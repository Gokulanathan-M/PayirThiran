"""
Train a soil image classifier using transfer learning (ResNet18).

Dataset structure expected:
    soil_dataset/
        Soil Train/Soil Train/
            Alluvial Soil/  (156 images)
            Black Soil/     (55 images)
            Cinder Soil/    (24 images)
            Red Soil/       (60 images)
        Soil Test/Soil Test/
            Alluvial Soil/  (39 images)
            Black Soil/     (13 images)
            Cinder Soil/    (6 images)
            Red Soil/       (15 images)

Usage:
    cd ai-service
    python -m training.train_soil_classifier
"""

import os
import sys
import copy
import time
import json
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, WeightedRandomSampler
from torchvision import datasets, transforms, models

# ------------------------------------------------------------------ #
#  Configuration                                                      #
# ------------------------------------------------------------------ #
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", ".."))
DATASET_DIR = os.path.join(PROJECT_DIR, "soil_dataset")
TRAIN_DIR = os.path.join(DATASET_DIR, "Soil Train", "Soil Train")
TEST_DIR = os.path.join(DATASET_DIR, "Soil Test", "Soil Test")

MODEL_DIR = os.path.join(BASE_DIR, "..", "trained_models")
OUTPUT_MODEL = os.path.join(MODEL_DIR, "soil_classifier.pth")
OUTPUT_META = os.path.join(MODEL_DIR, "soil_classifier_meta.json")

IMAGE_SIZE = 224      # ResNet expects 224x224
BATCH_SIZE = 16
NUM_EPOCHS = 30
LEARNING_RATE = 0.001
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ------------------------------------------------------------------ #
#  Data Transforms                                                    #
# ------------------------------------------------------------------ #
# Heavy augmentation for training to compensate for small dataset
train_transforms = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.RandomCrop(IMAGE_SIZE),
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomVerticalFlip(p=0.3),
    transforms.RandomRotation(30),
    transforms.ColorJitter(brightness=0.3, contrast=0.3, saturation=0.3, hue=0.1),
    transforms.RandomAffine(degrees=0, translate=(0.1, 0.1), scale=(0.9, 1.1)),
    transforms.RandomGrayscale(p=0.05),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225]),
])

test_transforms = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225]),
])


def get_class_weights(dataset):
    """Compute sample weights to handle class imbalance."""
    targets = [s[1] for s in dataset.samples]
    class_counts = np.bincount(targets)
    class_weights = 1.0 / class_counts
    sample_weights = [class_weights[t] for t in targets]
    return sample_weights, class_weights


def build_model(num_classes: int) -> nn.Module:
    """Build a ResNet18 model with transfer learning."""
    model = models.resnet18(weights=models.ResNet18_Weights.IMAGENET1K_V1)

    # Freeze early layers (conv1 + layer1 + layer2)
    for name, param in model.named_parameters():
        if "layer3" not in name and "layer4" not in name and "fc" not in name:
            param.requires_grad = False

    # Replace the final FC layer for our number of classes
    num_features = model.fc.in_features
    model.fc = nn.Sequential(
        nn.Dropout(0.4),
        nn.Linear(num_features, 256),
        nn.ReLU(),
        nn.Dropout(0.3),
        nn.Linear(256, num_classes),
    )

    return model


def train_model(model, dataloaders, dataset_sizes, criterion, optimizer, scheduler, num_epochs):
    """Train the model and return best model weights."""
    best_model_wts = copy.deepcopy(model.state_dict())
    best_acc = 0.0
    history = {"train_loss": [], "train_acc": [], "test_loss": [], "test_acc": []}

    for epoch in range(num_epochs):
        print(f"\nEpoch {epoch + 1}/{num_epochs}")
        print("-" * 40)

        for phase in ["train", "test"]:
            if phase == "train":
                model.train()
            else:
                model.eval()

            running_loss = 0.0
            running_corrects = 0

            for inputs, labels in dataloaders[phase]:
                inputs = inputs.to(DEVICE)
                labels = labels.to(DEVICE)

                optimizer.zero_grad()

                with torch.set_grad_enabled(phase == "train"):
                    outputs = model(inputs)
                    _, preds = torch.max(outputs, 1)
                    loss = criterion(outputs, labels)

                    if phase == "train":
                        loss.backward()
                        optimizer.step()

                running_loss += loss.item() * inputs.size(0)
                running_corrects += torch.sum(preds == labels.data)

            epoch_loss = running_loss / dataset_sizes[phase]
            epoch_acc = running_corrects.double() / dataset_sizes[phase]

            print(f"  {phase:5s} — Loss: {epoch_loss:.4f}  Acc: {epoch_acc:.4f}")

            history[f"{phase}_loss"].append(epoch_loss)
            history[f"{phase}_acc"].append(float(epoch_acc))

            if phase == "test" and epoch_acc > best_acc:
                best_acc = epoch_acc
                best_model_wts = copy.deepcopy(model.state_dict())

        scheduler.step()

    print(f"\n{'=' * 40}")
    print(f"Best Test Accuracy: {best_acc:.4f}")

    model.load_state_dict(best_model_wts)
    return model, history


def evaluate_model(model, dataloader, class_names):
    """Evaluate the model and print per-class metrics."""
    model.eval()
    all_preds = []
    all_labels = []

    with torch.no_grad():
        for inputs, labels in dataloader:
            inputs = inputs.to(DEVICE)
            labels = labels.to(DEVICE)
            outputs = model(inputs)
            _, preds = torch.max(outputs, 1)
            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())

    all_preds = np.array(all_preds)
    all_labels = np.array(all_labels)

    total_correct = (all_preds == all_labels).sum()
    total = len(all_labels)
    print(f"\nOverall Test Accuracy: {total_correct}/{total} = {total_correct / total:.4f}")

    print(f"\n{'Class':<20s} {'Correct':>8s} {'Total':>6s} {'Accuracy':>10s}")
    print("-" * 48)
    for i, name in enumerate(class_names):
        mask = all_labels == i
        cls_total = mask.sum()
        cls_correct = ((all_preds == i) & mask).sum()
        cls_acc = cls_correct / cls_total if cls_total > 0 else 0
        print(f"  {name:<18s} {cls_correct:>8d} {cls_total:>6d} {cls_acc:>10.4f}")


def main():
    print("=" * 60)
    print("  Soil Image Classifier — Transfer Learning (ResNet18)")
    print("=" * 60)
    print(f"\nDevice: {DEVICE}")
    print(f"Train dir: {TRAIN_DIR}")
    print(f"Test dir:  {TEST_DIR}")

    # Verify directories exist
    if not os.path.isdir(TRAIN_DIR):
        print(f"\n❌ Train directory not found: {TRAIN_DIR}")
        sys.exit(1)
    if not os.path.isdir(TEST_DIR):
        print(f"\n❌ Test directory not found: {TEST_DIR}")
        sys.exit(1)

    # Load datasets
    train_dataset = datasets.ImageFolder(TRAIN_DIR, transform=train_transforms)
    test_dataset = datasets.ImageFolder(TEST_DIR, transform=test_transforms)

    class_names = train_dataset.classes
    num_classes = len(class_names)

    print(f"\nClasses ({num_classes}): {class_names}")
    print(f"Training samples: {len(train_dataset)}")
    print(f"Test samples:     {len(test_dataset)}")

    # Print class distribution
    train_targets = [s[1] for s in train_dataset.samples]
    print("\nClass distribution (train):")
    for i, name in enumerate(class_names):
        count = train_targets.count(i)
        print(f"  {name}: {count} images")

    # Weighted sampler for class imbalance
    sample_weights, class_weights = get_class_weights(train_dataset)
    sampler = WeightedRandomSampler(
        weights=sample_weights,
        num_samples=len(sample_weights),
        replacement=True,
    )

    # Data loaders
    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, sampler=sampler, num_workers=0)
    test_loader = DataLoader(test_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=0)

    dataloaders = {"train": train_loader, "test": test_loader}
    dataset_sizes = {"train": len(train_dataset), "test": len(test_dataset)}

    # Build model
    print("\nBuilding ResNet18 model with transfer learning...")
    model = build_model(num_classes).to(DEVICE)

    # Count trainable params
    trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
    total = sum(p.numel() for p in model.parameters())
    print(f"Trainable parameters: {trainable:,} / {total:,}")

    # Loss function with class weights for imbalance
    weight_tensor = torch.FloatTensor(class_weights).to(DEVICE)
    criterion = nn.CrossEntropyLoss(weight=weight_tensor)

    # Optimizer — only train unfrozen parameters
    params_to_train = [p for p in model.parameters() if p.requires_grad]
    optimizer = optim.Adam(params_to_train, lr=LEARNING_RATE, weight_decay=1e-4)

    # Learning rate scheduler
    scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=10, gamma=0.3)

    # Train
    print(f"\n{'=' * 60}")
    print(f"Training for {NUM_EPOCHS} epochs...")
    print(f"{'=' * 60}")

    start_time = time.time()
    model, history = train_model(model, dataloaders, dataset_sizes, criterion, optimizer, scheduler, NUM_EPOCHS)
    elapsed = time.time() - start_time
    print(f"\nTraining completed in {elapsed / 60:.1f} minutes")

    # Evaluate
    print(f"\n{'=' * 60}")
    print("Final Evaluation on Test Set")
    print(f"{'=' * 60}")
    evaluate_model(model, test_loader, class_names)

    # Save model
    os.makedirs(MODEL_DIR, exist_ok=True)
    torch.save({
        "model_state_dict": model.state_dict(),
        "class_names": class_names,
        "num_classes": num_classes,
        "image_size": IMAGE_SIZE,
    }, OUTPUT_MODEL)
    print(f"\n✅ Model saved to {OUTPUT_MODEL}")

    # Save metadata
    meta = {
        "class_names": class_names,
        "num_classes": num_classes,
        "image_size": IMAGE_SIZE,
        "epochs_trained": NUM_EPOCHS,
        "device": str(DEVICE),
        "best_test_acc": max(history["test_acc"]),
        "architecture": "ResNet18 (transfer learning)",
    }
    with open(OUTPUT_META, "w") as f:
        json.dump(meta, f, indent=2)
    print(f"✅ Metadata saved to {OUTPUT_META}")

    print("\n✅ Done! Soil classifier is ready for inference.")


if __name__ == "__main__":
    main()
