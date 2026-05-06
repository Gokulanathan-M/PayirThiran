"""Generate fertilizer recommendations, cultivation guides, and financial estimates."""

# Crop knowledge base
CROP_INFO = {
    "Rice": {
        "fertilizers": [
            {"name": "DAP (Di-Ammonium Phosphate)", "dosage": "50 kg/acre", "timing": "Basal application at transplanting", "notes": "Apply in puddled field"},
            {"name": "Urea", "dosage": "40 kg/acre", "timing": "Split: 50% at tillering, 50% at panicle initiation", "notes": "Avoid application during heavy rain"},
            {"name": "MOP (Muriate of Potash)", "dosage": "25 kg/acre", "timing": "Basal application", "notes": "Essential for grain filling"},
        ],
        "guide": {
            "landPreparation": "Plough 2-3 times, puddle the field, and level properly. Maintain 2-3 cm standing water.",
            "sowing": "Transplant 25-30 day old seedlings at 20x15 cm spacing. Use 2-3 seedlings per hill.",
            "irrigation": "Maintain 5 cm water during vegetative stage. Drain 10-15 days before harvest.",
            "pestManagement": "Monitor for stem borer, BPH, and blast disease. Use neem-based sprays as first line.",
            "harvesting": "Harvest when 80% grains turn golden. Thresh within 24 hours for best quality.",
        },
        "tips": [
            "Use certified seeds treated with fungicide",
            "Maintain proper water management for higher yields",
            "Practice alternate wetting and drying to save water",
        ],
        "investment_per_acre": 18000,
        "revenue_per_acre": 42000,
        "season": "kharif",
        "sustainability": "medium",
    },
    "Wheat": {
        "fertilizers": [
            {"name": "DAP", "dosage": "50 kg/acre", "timing": "At sowing", "notes": "Drill into furrows"},
            {"name": "Urea", "dosage": "55 kg/acre", "timing": "Split: 50% at CRI stage, 50% at boot stage", "notes": "Irrigate after application"},
            {"name": "Zinc Sulphate", "dosage": "10 kg/acre", "timing": "Basal", "notes": "Important in zinc-deficient soils"},
        ],
        "guide": {
            "landPreparation": "Fine tilth needed. Plough, harrow, and planking for leveled seedbed.",
            "sowing": "Sow in rows 20 cm apart. Seed rate: 40-50 kg/acre. Optimum time: Nov 1-25.",
            "irrigation": "5-6 irrigations at CRI, tillering, jointing, flowering, milk, and dough stages.",
            "pestManagement": "Watch for yellow rust, aphids, and termites. Spray propiconazole for rust.",
            "harvesting": "Harvest when grains are hard and golden. Moisture should be below 14%.",
        },
        "tips": [
            "Timely sowing is crucial for maximum yield",
            "First irrigation at CRI stage is most critical",
            "Use disease-resistant varieties for your region",
        ],
        "investment_per_acre": 15000,
        "revenue_per_acre": 38000,
        "season": "rabi",
        "sustainability": "high",
    },
    "Maize": {
        "fertilizers": [
            {"name": "DAP", "dosage": "55 kg/acre", "timing": "At sowing", "notes": "Place near seed rows"},
            {"name": "Urea", "dosage": "50 kg/acre", "timing": "Split: knee-high and tasseling stages", "notes": "Side dress application"},
        ],
        "guide": {
            "landPreparation": "Deep ploughing followed by 2-3 harrowings. Add FYM 2 weeks before sowing.",
            "sowing": "Row spacing 60-75 cm, plant spacing 20-25 cm. Seed rate: 8-10 kg/acre.",
            "irrigation": "Critical at silking and grain filling. Total 6-8 irrigations needed.",
            "pestManagement": "Watch for fall armyworm and stem borer. Use pheromone traps for monitoring.",
            "harvesting": "Harvest after cob husks dry and kernels form black layer at base.",
        },
        "tips": [
            "Avoid waterlogging at all stages",
            "Earthing up at knee-high stage improves anchorage",
            "Remove tassels from female rows in hybrid seed production",
        ],
        "investment_per_acre": 14000,
        "revenue_per_acre": 32000,
        "season": "kharif",
        "sustainability": "high",
    },
    "Cotton": {
        "fertilizers": [
            {"name": "DAP", "dosage": "50 kg/acre", "timing": "At sowing", "notes": "Basal dose"},
            {"name": "Urea", "dosage": "45 kg/acre", "timing": "Split at 30, 60, 90 DAS", "notes": "Foliar application after 90 DAS"},
        ],
        "guide": {
            "landPreparation": "Deep ploughing in summer. Form ridges and furrows for proper drainage.",
            "sowing": "Row spacing 90-120 cm. Use Bt cotton hybrids with appropriate refuge.",
            "irrigation": "First at square formation, then every 15-20 days in dry spells.",
            "pestManagement": "Scout for bollworm, whitefly, jassids. Use IPM approach with ETL-based spraying.",
            "harvesting": "Pick bolls when fully opened. 3-4 pickings spaced 15-20 days apart.",
        },
        "tips": [
            "Avoid late sowing to prevent pink bollworm damage",
            "Train workers for proper picking to maintain lint quality",
            "Destroy crop residues after final picking",
        ],
        "investment_per_acre": 22000,
        "revenue_per_acre": 50000,
        "season": "kharif",
        "sustainability": "medium",
    },
    "Sugarcane": {
        "fertilizers": [
            {"name": "DAP", "dosage": "75 kg/acre", "timing": "At planting", "notes": "In furrows"},
            {"name": "Urea", "dosage": "100 kg/acre", "timing": "Split at 45, 90, 120 DAP", "notes": "Earthing up after each dose"},
            {"name": "MOP", "dosage": "40 kg/acre", "timing": "At planting and 60 DAP", "notes": "Promotes sucrose accumulation"},
        ],
        "guide": {
            "landPreparation": "Deep ploughing, leveling, and preparation of furrows 75-90 cm apart.",
            "sowing": "Plant 3-budded setts horizontally in furrows. Treat setts with fungicide.",
            "irrigation": "Frequent irrigation needed. Critical at tillering and grand growth phase.",
            "pestManagement": "Major pests: top borer, early shoot borer. Use trichogramma cards for biocontrol.",
            "harvesting": "Harvest at 10-12 months when brix reading is 18-20%. Cut close to ground.",
        },
        "tips": [
            "Use healthy seed material from registered nurseries",
            "Trash mulching conserves moisture and suppresses weeds",
            "Ratoon management can give 2-3 profitable cuts",
        ],
        "investment_per_acre": 35000,
        "revenue_per_acre": 80000,
        "season": "kharif",
        "sustainability": "low",
    },
    "Soybean": {
        "fertilizers": [
            {"name": "DAP", "dosage": "40 kg/acre", "timing": "At sowing", "notes": "Soybean fixes its own nitrogen"},
            {"name": "Rhizobium inoculant", "dosage": "200g/10 kg seed", "timing": "Seed treatment", "notes": "Enhances nitrogen fixation"},
        ],
        "guide": {
            "landPreparation": "One deep ploughing and 2 harrowings. Good drainage essential.",
            "sowing": "Row spacing 30-45 cm. Seed rate: 30-35 kg/acre. Sow in June.",
            "irrigation": "Generally rainfed. Irrigate at pod filling if rain fails.",
            "pestManagement": "Monitor for girdle beetle, pod borer, and yellow mosaic virus.",
            "harvesting": "Harvest when 95% pods are mature and leaves have dropped.",
        },
        "tips": [
            "Inoculate seeds with Rhizobium for better nitrogen fixation",
            "Avoid deep sowing — 3-4 cm is optimal",
            "Rotate with cereals for soil health benefits",
        ],
        "investment_per_acre": 12000,
        "revenue_per_acre": 30000,
        "season": "kharif",
        "sustainability": "high",
    },
    "Mustard": {
        "fertilizers": [
            {"name": "DAP", "dosage": "40 kg/acre", "timing": "At sowing", "notes": "Apply in seed rows"},
            {"name": "Sulphur", "dosage": "16 kg/acre", "timing": "Basal", "notes": "Critical for oil content"},
        ],
        "guide": {
            "landPreparation": "Fine seedbed with 2-3 ploughings. Pre-sowing irrigation recommended.",
            "sowing": "Row spacing 30-45 cm. Seed rate: 2-3 kg/acre. Sow Oct 15 - Nov 5.",
            "irrigation": "2-3 irrigations: pre-flowering, pod formation, grain filling. Avoid at flowering.",
            "pestManagement": "Watch for aphids, painted bug, white rust. Spray dimethoate for aphids.",
            "harvesting": "Harvest when 75% pods turn yellow-brown. Thresh after sun drying.",
        },
        "tips": [
            "Timely sowing is key to avoid aphid damage",
            "Sulphur application increases oil content significantly",
            "Bee pollination improves seed set by 15-20%",
        ],
        "investment_per_acre": 10000,
        "revenue_per_acre": 28000,
        "season": "rabi",
        "sustainability": "high",
    },
    "Groundnut": {
        "fertilizers": [
            {"name": "SSP (Single Super Phosphate)", "dosage": "50 kg/acre", "timing": "At sowing", "notes": "Provides phosphorus and sulphur"},
            {"name": "Gypsum", "dosage": "80 kg/acre", "timing": "At pegging", "notes": "Critical for pod development"},
        ],
        "guide": {
            "landPreparation": "Light soil preferred. Plough, harrow, and form ridges.",
            "sowing": "Ridge planting at 30x10 cm. Seed rate: 40-50 kg/acre. Peel carefully.",
            "irrigation": "Light irrigations. Critical at flowering and pegging stages.",
            "pestManagement": "Watch for leaf miner, tikka disease. Use seed treatment with thiram.",
            "harvesting": "Pull plants when inner shell darkens. Dry in sun for 3-4 days.",
        },
        "tips": [
            "Gypsum application at pegging is essential for pod development",
            "Avoid over-irrigation to prevent aflatoxin contamination",
            "Use seed treatment for protection against collar rot",
        ],
        "investment_per_acre": 16000,
        "revenue_per_acre": 40000,
        "season": "kharif",
        "sustainability": "high",
    },
    "Chickpea": {
        "fertilizers": [
            {"name": "DAP", "dosage": "40 kg/acre", "timing": "At sowing", "notes": "Legume — fixes nitrogen"},
            {"name": "Rhizobium inoculant", "dosage": "200g/10 kg seed", "timing": "Seed treatment", "notes": "Enhances N fixation"},
        ],
        "guide": {
            "landPreparation": "Medium tilth. Avoid wet fields. Use raised bed for heavy soils.",
            "sowing": "Row spacing 30 cm. Seed rate: 30-40 kg/acre. Sow Oct end to Nov mid.",
            "irrigation": "Generally one pre-sowing + one at pod filling. Avoid excess moisture.",
            "pestManagement": "Pod borer main pest. Use NPV, HaNPV, or neem-based sprays.",
            "harvesting": "Harvest when plants and pods turn brown. Avoid delay to reduce shattering.",
        },
        "tips": [
            "Avoid excess nitrogen as chickpea is a nitrogen fixer",
            "Wilt-resistant varieties reduce disease losses",
            "Pre-sowing irrigation ensures better germination",
        ],
        "investment_per_acre": 11000,
        "revenue_per_acre": 32000,
        "season": "rabi",
        "sustainability": "high",
    },
    "Sunflower": {
        "fertilizers": [
            {"name": "DAP", "dosage": "45 kg/acre", "timing": "At sowing", "notes": "Basal dose"},
            {"name": "Urea", "dosage": "30 kg/acre", "timing": "30 DAS", "notes": "Top dressing"},
            {"name": "Boron", "dosage": "2 kg/acre", "timing": "At button stage", "notes": "Spray 0.2% borax solution"},
        ],
        "guide": {
            "landPreparation": "Deep ploughing + 2 harrowings. Add FYM at 4 t/acre.",
            "sowing": "Row spacing 60 cm, plant spacing 30 cm. Seed rate: 3-4 kg/acre.",
            "irrigation": "4-5 light irrigations. Critical at star bud, flowering, and seed filling.",
            "pestManagement": "Head rot, sclerotinia, and necrosis are main concerns. Avoid dense planting.",
            "harvesting": "Harvest when back of head turns yellow and seeds are hard. Dry to 9% moisture.",
        },
        "tips": [
            "Bee pollination can increase seed set by 30-40%",
            "Boron spray at button stage prevents hollow seeds",
            "Support heads if lodging risk is high during rains",
        ],
        "investment_per_acre": 13000,
        "revenue_per_acre": 30000,
        "season": "rabi",
        "sustainability": "medium",
    },
}

# Default entry for unknown crops
_DEFAULT_INFO = {
    "fertilizers": [
        {"name": "NPK 10-26-26", "dosage": "50 kg/acre", "timing": "At sowing", "notes": "General basal dose"},
        {"name": "Urea", "dosage": "30 kg/acre", "timing": "30 DAS", "notes": "Top dressing"},
    ],
    "guide": {
        "landPreparation": "Prepare a fine seedbed with proper leveling.",
        "sowing": "Follow recommended spacing and seed rate for the specific crop.",
        "irrigation": "Irrigate at critical growth stages. Avoid waterlogging.",
        "pestManagement": "Monitor regularly and follow integrated pest management.",
        "harvesting": "Harvest at physiological maturity for best quality.",
    },
    "tips": [
        "Use certified seeds for better germination",
        "Follow recommended fertilizer doses based on soil test",
        "Practice crop rotation for sustainable farming",
    ],
    "investment_per_acre": 15000,
    "revenue_per_acre": 35000,
    "season": "kharif",
    "sustainability": "medium",
}


def get_crop_info(crop_name: str) -> dict:
    """Return the knowledge base entry for a crop, or default."""
    return CROP_INFO.get(crop_name, _DEFAULT_INFO)


def enrich_predictions(predictions: list[dict], investment: float | None, land_size: float | None) -> list[dict]:
    """Add fertilizer, guide, tips, and financial estimates to crop predictions."""
    land = land_size or 1.0
    for pred in predictions:
        info = get_crop_info(pred["cropName"])
        pred["season"] = info.get("season", "kharif")
        pred["sustainabilityScore"] = info.get("sustainability", "medium")
        pred["fertilizers"] = info["fertilizers"]
        pred["cultivationGuide"] = info["guide"]
        pred["growthTips"] = info["tips"]

        inv = info["investment_per_acre"] * land
        rev = info["revenue_per_acre"] * land
        if investment:
            ratio = investment / inv if inv > 0 else 1
            inv = investment
            rev = rev * min(ratio, 1.5)

        pred["estimatedInvestment"] = round(inv)
        pred["estimatedRevenue"] = round(rev)
        pred["roi"] = round(((rev - inv) / inv) * 100) if inv > 0 else 0

    return predictions
