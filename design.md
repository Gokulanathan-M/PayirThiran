# Design Document

## AI-Powered Sustainable Crop Recommendation and Suitability System

**Version:** 1.0  
**Date:** March 8, 2026  
**Status:** Draft  

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Architecture](#2-system-architecture)
3. [High-Level Architecture Diagram](#3-high-level-architecture-diagram)
4. [Component Design](#4-component-design)
5. [UI Layout & Wireframes](#5-ui-layout--wireframes)
6. [Data Flow](#6-data-flow)
7. [Database Schema Design](#7-database-schema-design)
8. [AI Module Design](#8-ai-module-design)
9. [API Design Overview](#9-api-design-overview)
10. [Security Design](#10-security-design)
11. [Error Handling Strategy](#11-error-handling-strategy)
12. [Scalability Considerations](#12-scalability-considerations)

---

## 1. Introduction

### 1.1 Purpose

This document describes the complete system design of the **AI-Powered Sustainable Crop Recommendation and Suitability System** — a modern, full-stack web platform that empowers farmers with data-driven farming guidance. The platform leverages artificial intelligence, machine learning, soil image analysis, real-time weather data, crop history analytics, and profit estimation to provide actionable agricultural recommendations.

### 1.2 Scope

The design covers:

- Frontend (React-based SPA)
- Backend (Node.js + Express REST API)
- Database layer (MongoDB)
- AI/ML processing pipeline
- Third-party integrations (weather APIs, market price data)
- Deployment architecture

### 1.3 Design Goals

| Goal | Description |
|------|-------------|
| **Usability** | Intuitive, mobile-friendly interface accessible to farmers with varying technical literacy |
| **Accuracy** | AI models trained on regional agricultural data for precise recommendations |
| **Performance** | Sub-3-second response times for standard queries; sub-10-second for AI-intensive operations |
| **Scalability** | Horizontally scalable architecture supporting 10,000+ concurrent users |
| **Maintainability** | Modular, well-documented codebase with clear separation of concerns |
| **Data Privacy** | Secure storage and processing of user and land data with encryption at rest and in transit |

---

## 2. System Architecture

### 2.1 Architecture Style

The system follows a **layered architecture** with clear separation between:

- **Presentation Layer** — React SPA (Single Page Application)
- **API Gateway Layer** — Express.js REST API with middleware pipeline
- **Business Logic Layer** — Service modules handling core domain logic
- **AI Processing Layer** — ML model inference, image analysis, weather integration
- **Data Access Layer** — MongoDB via Mongoose ODM
- **External Integration Layer** — Weather APIs, market price APIs

### 2.2 Architecture Principles

1. **Single Responsibility** — Each module handles one well-defined concern
2. **Loose Coupling** — Services communicate through well-defined interfaces
3. **Stateless API** — Backend is stateless; session managed via JWT tokens
4. **Event-Driven Processing** — AI inference tasks are queued for asynchronous processing when needed
5. **Fail-Safe Defaults** — Missing inputs degrade recommendations gracefully, never crash the system

---

## 3. High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CLIENT (Browser)                                 │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                     React SPA + Tailwind CSS                         │  │
│  │  ┌─────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │  Home   │  │    Crop      │  │    Crop      │  │   User      │  │  │
│  │  │  Page   │  │ Recommend.   │  │ Suitability  │  │  Profile    │  │  │
│  │  └─────────┘  └──────────────┘  └──────────────┘  └─────────────┘  │  │
│  │                    Framer Motion Animations                         │  │
│  └───────────────────────────┬───────────────────────────────────────────┘  │
└──────────────────────────────┼──────────────────────────────────────────────┘
                               │ HTTPS / REST API
                               ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                         API GATEWAY (Express.js)                             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────────────┐    │
│  │   Auth     │  │   Rate     │  │  Request   │  │   CORS / Helmet   │    │
│  │ Middleware │  │  Limiter   │  │ Validator  │  │    Security       │    │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  └────────┬───────────┘    │
│        └────────────────┴───────────────┴──────────────────┘                │
│                                  │                                           │
│  ┌───────────────────────────────┴────────────────────────────────────────┐  │
│  │                        ROUTE HANDLERS                                  │  │
│  │  /api/auth/*   /api/crop/*   /api/suitability/*   /api/user/*         │  │
│  └───────────────────────────────┬────────────────────────────────────────┘  │
└──────────────────────────────────┼───────────────────────────────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                       BUSINESS LOGIC LAYER                                   │
│                                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Auth       │  │    Crop      │  │ Suitability  │  │    User      │    │
│  │  Service     │  │   Service    │  │   Service    │  │   Service    │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                 │                  │                  │            │
│         │      ┌──────────┴──────────────────┴─────────┐       │            │
│         │      │        AI PROCESSING LAYER            │       │            │
│         │      │  ┌────────────┐  ┌────────────────┐   │       │            │
│         │      │  │  Soil      │  │    Weather     │   │       │            │
│         │      │  │  Analyzer  │  │   Integrator   │   │       │            │
│         │      │  └────────────┘  └────────────────┘   │       │            │
│         │      │  ┌────────────┐  ┌────────────────┐   │       │            │
│         │      │  │  Crop ML   │  │    Profit      │   │       │            │
│         │      │  │  Model     │  │   Estimator    │   │       │            │
│         │      │  └────────────┘  └────────────────┘   │       │            │
│         │      │  ┌────────────┐  ┌────────────────┐   │       │            │
│         │      │  │ Rotation   │  │  Fertilizer    │   │       │            │
│         │      │  │  Engine    │  │  Recommender   │   │       │            │
│         │      │  └────────────┘  └────────────────┘   │       │            │
│         │      │  ┌────────────┐  ┌────────────────┐   │       │            │
│         │      │  │Sustainab.  │  │  Cultivation   │   │       │            │
│         │      │  │ Scorer     │  │  Guide Gen.    │   │       │            │
│         │      │  └────────────┘  └────────────────┘   │       │            │
│         │      └───────────────────────────────────────┘       │            │
│         │                         │                            │            │
└─────────┴─────────────────────────┼────────────────────────────┴────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                         DATA ACCESS LAYER                                    │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │                      Mongoose ODM                                    │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │    │
│  │  │  User    │ │  Land    │ │  Crop    │ │ Predict. │ │  Market  │  │    │
│  │  │  Model   │ │  Model   │ │ History  │ │  Result  │ │  Data    │  │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                              MongoDB Atlas                                   │
└──────────────────────────────────────────────────────────────────────────────┘

                    EXTERNAL SERVICES
┌──────────────────────────────────────────────────────────────────────────────┐
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────────┐   │
│  │  OpenWeatherMap  │  │  Market Price    │  │  Cloud Storage (S3 /    │   │
│  │  API             │  │  API             │  │  Cloudinary for images) │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Component Design

### 4.1 Frontend Components

The React application is organized into a component hierarchy designed for reusability and maintainability.

#### 4.1.1 Component Tree

```
<App>
├── <AuthProvider>                     # Global authentication context
│   ├── <Router>
│   │   ├── <Navbar />                 # Persistent navigation bar
│   │   │   ├── <Logo />
│   │   │   ├── <NavLinks />          # Home | Crop Recommendation | Crop Suitability
│   │   │   └── <ProfileIcon />       # Top-right user avatar / login button
│   │   │
│   │   ├── <Routes>
│   │   │   ├── <HomePage />
│   │   │   │   ├── <HeroSection />            # Animated hero with Framer Motion
│   │   │   │   ├── <FeaturesOverview />       # System capabilities cards
│   │   │   │   ├── <InputTypesSection />      # What data the system uses
│   │   │   │   ├── <BenefitsSection />        # Why provide complete data
│   │   │   │   └── <CTASection />             # Call to action
│   │   │   │
│   │   │   ├── <CropRecommendationPage />
│   │   │   │   ├── <StepIndicator />          # Multi-step form progress
│   │   │   │   ├── <LandInfoForm />           # Land size, location
│   │   │   │   ├── <SoilInfoForm />           # Soil type, image upload, pH
│   │   │   │   ├── <EnvironmentForm />        # Irrigation, moisture
│   │   │   │   ├── <CropHistoryForm />        # Previous crop, season
│   │   │   │   ├── <FinancialForm />          # Investment amount
│   │   │   │   ├── <DataAccuracyDisclaimer /> # Accuracy improvement notice
│   │   │   │   └── <RecommendationResults />
│   │   │   │       ├── <CropCards />          # Top 2-3 recommended crops
│   │   │   │       ├── <SustainabilityScore />
│   │   │   │       ├── <ProfitEstimation />
│   │   │   │       ├── <ReasonExplanation />
│   │   │   │       ├── <FertilizerList />
│   │   │   │       ├── <CultivationGuide />
│   │   │   │       └── <GrowthTips />
│   │   │   │
│   │   │   ├── <CropSuitabilityPage />
│   │   │   │   ├── <CropSelectionInput />     # Crop name entry
│   │   │   │   ├── <LandInfoForm />           # Reused component
│   │   │   │   ├── <SoilInfoForm />           # Reused component
│   │   │   │   ├── <CropHistoryForm />        # Reused component (previous crop)
│   │   │   │   ├── <EnvironmentForm />        # Irrigation availability
│   │   │   │   ├── <DataAccuracyDisclaimer />
│   │   │   │   └── <SuitabilityResults />
│   │   │   │       ├── <SuitabilityGauge />   # Visual percentage display
│   │   │   │       ├── <SoilImprovements />
│   │   │   │       ├── <ReasonExplanation />
│   │   │   │       └── <CultivationAdvice />
│   │   │   │
│   │   │   ├── <UserProfilePage />
│   │   │   │   ├── <ProfileHeader />
│   │   │   │   ├── <LandDetailsSection />
│   │   │   │   ├── <CropHistoryTimeline />
│   │   │   │   └── <PastRecommendations />
│   │   │   │
│   │   │   ├── <LoginPage />
│   │   │   └── <RegisterPage />
│   │   │
│   │   └── <Footer />
│   └── <ToastNotifications />         # Global notification system
└── <LoadingOverlay />                 # Full-screen loader for AI processing
```

#### 4.1.2 Shared / Reusable Components

| Component | Description |
|-----------|-------------|
| `<Button />` | Standard button with variants: primary, secondary, outline, danger |
| `<InputField />` | Text/number input with label, validation, and error display |
| `<SelectField />` | Dropdown selection with search capability |
| `<FileUpload />` | Drag-and-drop image upload with preview |
| `<Card />` | Styled container for content sections |
| `<Modal />` | Overlay dialog for confirmations and detailed views |
| `<Tooltip />` | Contextual help tooltips |
| `<ProgressBar />` | Linear/circular progress indicators |
| `<Gauge />` | Circular gauge for suitability percentage display |
| `<Table />` | Data table with sorting capabilities |
| `<Accordion />` | Expandable content sections |
| `<Skeleton />` | Loading placeholder animations |
| `<Badge />` | Status indicator badges (High/Medium/Low) |

#### 4.1.3 State Management

```
┌─────────────────────────────────────────────────┐
│               REACT CONTEXT PROVIDERS            │
│  ┌───────────────┐  ┌────────────────────────┐  │
│  │ AuthContext    │  │ NotificationContext     │  │
│  │ - user        │  │ - toasts               │  │
│  │ - token       │  │ - addToast()           │  │
│  │ - login()     │  │ - removeToast()        │  │
│  │ - logout()    │  └────────────────────────┘  │
│  │ - register()  │                               │
│  └───────────────┘                               │
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │        Component-Level State (useState)      │ │
│  │  - Form data (multi-step forms)              │ │
│  │  - UI state (loading, errors, modals)        │ │
│  │  - API response data                         │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │        Custom Hooks                          │ │
│  │  - useAuth()                                 │ │
│  │  - useApi() (fetch wrapper with loading)     │ │
│  │  - useForm() (multi-step form management)    │ │
│  │  - useLocationSearch() (geo-location)        │ │
│  │  - useImageUpload() (file handling)          │ │
│  └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### 4.2 Backend Components

#### 4.2.1 Express.js Application Structure

```
┌──────────────────────────────────────────────────┐
│                 Express Application               │
│                                                    │
│  Middleware Pipeline (executed in order):          │
│  ┌──────────────────────────────────────────────┐ │
│  │ 1. helmet()          — Security headers      │ │
│  │ 2. cors()            — Cross-origin policy   │ │
│  │ 3. express.json()    — Body parser           │ │
│  │ 4. rateLimiter()     — Rate limiting         │ │
│  │ 5. requestLogger()   — Request logging       │ │
│  │ 6. authMiddleware()  — JWT validation *      │ │
│  │ 7. validator()       — Input validation *    │ │
│  └──────────────────────────────────────────────┘ │
│  * Applied per-route, not globally                │
│                                                    │
│  Route Modules:                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │ /api/auth         — Authentication routes    │ │
│  │ /api/crop         — Crop recommendation      │ │
│  │ /api/suitability  — Suitability check        │ │
│  │ /api/user         — User profile management  │ │
│  │ /api/land         — Land data management     │ │
│  │ /api/history      — Crop history management  │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  Error Handling:                                   │
│  ┌──────────────────────────────────────────────┐ │
│  │ globalErrorHandler() — Catches all errors    │ │
│  │ notFoundHandler()    — 404 for unknown routes│ │
│  └──────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

#### 4.2.2 Service Layer Design

Each service encapsulates a specific business domain:

| Service | Responsibilities |
|---------|-----------------|
| `AuthService` | User registration, login, JWT management, password hashing |
| `CropRecommendationService` | Orchestrates all AI modules to generate crop recommendations |
| `CropSuitabilityService` | Evaluates suitability of a user-specified crop |
| `SoilAnalysisService` | Processes manual soil input and soil image analysis |
| `WeatherService` | Fetches and processes weather data for a location |
| `CropRotationService` | Analyzes crop history and recommends rotation-compatible crops |
| `SustainabilityService` | Calculates sustainability scores based on soil health impact |
| `ProfitEstimationService` | Computes expected yield, revenue, and profit |
| `FertilizerService` | Recommends fertilizers based on soil and crop needs |
| `CultivationGuideService` | Generates step-by-step cultivation guidance |
| `UserService` | User profile CRUD, land management, history retrieval |
| `ImageUploadService` | Handles soil image upload, storage, and preprocessing |

#### 4.2.3 Service Interaction Diagram — Crop Recommendation Flow

```
CropRecommendationService (Orchestrator)
│
├──► SoilAnalysisService
│    ├── analyzeManualInput(soilType, pH)
│    └── analyzeImage(soilImageURL)
│         └── calls ML Soil Image Model
│
├──► WeatherService
│    └── getWeatherData(latitude, longitude)
│         └── calls OpenWeatherMap API
│
├──► CropRotationService
│    └── getRotationCompatibleCrops(previousCrop, season)
│
├──► [ML Crop Prediction Model]
│    └── predict(soilFeatures, weatherFeatures, rotationData)
│         └── Returns ranked crop list with confidence scores
│
├──► SustainabilityService
│    └── evaluate(recommendedCrops, soilCondition, cropHistory)
│
├──► ProfitEstimationService
│    └── estimate(crops, landSize, investment, marketPrices)
│
├──► FertilizerService
│    └── recommend(crops, soilCondition, soilPH)
│
└──► CultivationGuideService
     └── generate(crops, soilCondition, irrigationAvailable, season)
```

---

## 5. UI Layout & Wireframes

### 5.1 Navigation Bar

```
┌──────────────────────────────────────────────────────────────────────┐
│  🌱 CropAdvisor AI    Home    Crop Recommendation    Suitability   [👤]│
└──────────────────────────────────────────────────────────────────────┘
```

- Logo on the left
- Navigation links centered
- Profile icon (avatar or login button) on the far right
- Sticky navbar with backdrop blur on scroll
- Mobile: hamburger menu with slide-out drawer

### 5.2 Home Page Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│                         NAVIGATION BAR                               │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                   ANIMATED HERO SECTION                        │  │
│  │                                                                │  │
│  │   "Smart Farming Starts with AI"                              │  │
│  │   "Get personalized crop recommendations powered by           │  │
│  │    machine learning, soil analysis, and real-time weather"    │  │
│  │                                                                │  │
│  │   [Get Started]          [Learn More]                         │  │
│  │                                                                │  │
│  │   Background: Animated gradient with floating leaf particles  │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    FEATURES OVERVIEW                            │  │
│  │                                                                │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │  │
│  │  │ 🌾 Crop  │  │ ✅ Suit- │  │ 💰 Profit│  │ 🌍 Sust- │     │  │
│  │  │ Recomm.  │  │ ability  │  │ Estim.   │  │ ainab.   │     │  │
│  │  │          │  │ Check    │  │          │  │ Score    │     │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                  DATA INPUTS EXPLANATION                        │  │
│  │                                                                │  │
│  │  "Our AI uses these inputs for accurate predictions:"         │  │
│  │                                                                │  │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐                │  │
│  │  │ Soil Data │  │ Weather   │  │ Crop      │                │  │
│  │  │ & Images  │  │ & Climate │  │ History   │                │  │
│  │  └───────────┘  └───────────┘  └───────────┘                │  │
│  │  ┌───────────┐  ┌───────────┐                                │  │
│  │  │ Land      │  │ Financial │                                │  │
│  │  │ Details   │  │ Info      │                                │  │
│  │  └───────────┘  └───────────┘                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                   BENEFITS SECTION                              │  │
│  │                                                                │  │
│  │  "Why provide complete data?"                                 │  │
│  │                                                                │  │
│  │  ✓ More accurate crop recommendations                        │  │
│  │  ✓ Better profit estimations                                 │  │
│  │  ✓ Precise fertilizer guidance                               │  │
│  │  ✓ Improved sustainability analysis                          │  │
│  │                                                                │  │
│  │  ⚠ Disclaimer: Providing more details such as soil           │  │
│  │    condition, soil image, previous crop history, irrigation   │  │
│  │    availability, and investment amount improves the accuracy  │  │
│  │    of AI predictions.                                         │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    CALL TO ACTION                               │  │
│  │                                                                │  │
│  │   "Ready to optimize your farming?"                           │  │
│  │                                                                │  │
│  │   [Start Crop Recommendation]    [Check Crop Suitability]     │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                         FOOTER                                  │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

### 5.3 Crop Recommendation Page Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│                         NAVIGATION BAR                               │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  STEP INDICATOR                                                │  │
│  │  [1 Land] ─── [2 Soil] ─── [3 Environment] ─── [4 History]   │  │
│  │          ─── [5 Financial] ─── [✓ Review]                     │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  STEP 1: LAND INFORMATION                                           │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  Land Size:  [________] [Acre ▾ / Cent]                       │  │
│  │  Location:   [________] (auto-detect or manual entry)         │  │
│  │              📍 Use My Location                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  STEP 2: SOIL INFORMATION  ⚠ At least one soil input required      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  Manual Soil Condition:                                        │  │
│  │  ○ Sandy  ○ Clay  ○ Loamy  ○ Red  ○ Black  ○ Unknown         │  │
│  │                                                                │  │
│  │  Soil Image Upload:                                            │  │
│  │  ┌─────────────────────────────────┐                          │  │
│  │  │     📷 Drag & drop or browse    │                          │  │
│  │  │     Accepts: JPG, PNG (max 5MB) │                          │  │
│  │  └─────────────────────────────────┘                          │  │
│  │                                                                │  │
│  │  Soil pH (optional):  [_______]  Range: 0-14                  │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  STEP 3: ENVIRONMENTAL INFORMATION                                   │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  Irrigation Available:  ○ Yes  ○ No                           │  │
│  │  Soil Moisture (optional):  [Low ▾ / Medium / High]           │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  STEP 4: CROP HISTORY                                                │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  Previous Crop:    [___________▾]                             │  │
│  │  Season Cultivated: [___________▾]                            │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  STEP 5: FINANCIAL INFORMATION                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  Investment Amount (₹):  [___________]                        │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  ⚠ DATA ACCURACY DISCLAIMER                                   │  │
│  │  Providing more details such as soil condition, soil image,   │  │
│  │  previous crop history, irrigation availability, and          │  │
│  │  investment amount improves the accuracy of AI predictions.   │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  [◄ Back]                                    [Get Recommendations ►] │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### 5.4 Recommendation Results Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│                   RECOMMENDATION RESULTS                             │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │              🌾 TOP RECOMMENDED CROPS                        │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │    │
│  │  │  🥇 Groundnut │  │  🥈 Maize    │  │  🥉 Cotton   │      │    │
│  │  │              │  │              │  │              │      │    │
│  │  │  Suitability │  │  Suitability │  │  Suitability │      │    │
│  │  │    92%       │  │    86%       │  │    78%       │      │    │
│  │  │  [circular   │  │  [circular   │  │  [circular   │      │    │
│  │  │   gauge]     │  │   gauge]     │  │   gauge]     │      │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘      │    │
│  └──────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │  🌍 SUSTAINABILITY SCORE                                     │    │
│  │                                                              │    │
│  │  Groundnut:  ████████████░░  HIGH                           │    │
│  │  "Legume crops restore nitrogen levels in soil."            │    │
│  │                                                              │    │
│  │  Maize:      ████████░░░░░░  MEDIUM                         │    │
│  │  "Maize depletes moderate nitrogen; rotate with legumes."   │    │
│  └──────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │  💰 PROFIT ESTIMATION                                        │    │
│  │                                                              │    │
│  │  ┌─────────────────────────────────────────────────────────┐ │    │
│  │  │  Crop       │ Investment │ Revenue  │ Est. Profit      │ │    │
│  │  │─────────────│───────────│──────────│──────────────────│ │    │
│  │  │  Groundnut  │ ₹30,000   │ ₹65,000  │ ₹35,000  (+117%)│ │    │
│  │  │  Maize      │ ₹30,000   │ ₹55,000  │ ₹25,000  (+83%) │ │    │
│  │  │  Cotton     │ ₹30,000   │ ₹50,000  │ ₹20,000  (+67%) │ │    │
│  │  └─────────────────────────────────────────────────────────┘ │    │
│  └──────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │  📋 REASON FOR RECOMMENDATION                                │    │
│  │                                                              │    │
│  │  ✓ Soil conditions suitable for groundnut cultivation       │    │
│  │  ✓ Weather conditions favorable (temperature, rainfall)     │    │
│  │  ✓ Previous crop rotation beneficial (nitrogen fixation)    │    │
│  │  ✓ Market demand high in your region                        │    │
│  └──────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │  🧪 RECOMMENDED FERTILIZERS                                  │    │
│  │                                                              │    │
│  │  • Nitrogen fertilizer (Urea — 46-0-0)                     │    │
│  │  • Organic compost (well-decomposed farmyard manure)        │    │
│  │  • Potassium supplements (Muriate of Potash)                │    │
│  │  • Phosphorus supplement (Single Super Phosphate)           │    │
│  └──────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │  📝 CULTIVATION GUIDANCE                                     │    │
│  │                                                              │    │
│  │  1. Prepare soil using organic manure (2-3 weeks before)    │    │
│  │  2. Sow seeds at recommended depth and spacing              │    │
│  │  3. Maintain irrigation schedule (every 5-7 days)           │    │
│  │  4. Apply fertilizer during early growth stage (week 3)     │    │
│  │  5. Monitor for pests and diseases (weekly inspection)      │    │
│  │  6. Second fertilizer application at flowering stage        │    │
│  │  7. Harvest at maturity (monitor moisture content)          │    │
│  └──────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │  💡 CROP GROWTH TIPS                                         │    │
│  │                                                              │    │
│  │  • Maintain moderate soil moisture throughout growth         │    │
│  │  • Avoid waterlogging — ensure proper drainage              │    │
│  │  • Improve organic content with green manure                │    │
│  │  • Mulch to retain soil moisture in dry periods             │    │
│  └──────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  [◄ New Recommendation]    [Save to Profile]    [📥 Download PDF]   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### 5.5 Crop Suitability Page Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│                         NAVIGATION BAR                               │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  CROP SUITABILITY CHECK                                        │  │
│  │  "Check if a specific crop is suitable for your land"         │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  Crop Name:     [___________▾]  (searchable dropdown)         │  │
│  │  Land Size:     [________] [Acre ▾]                           │  │
│  │  Location:      [________] 📍                                 │  │
│  │                                                                │  │
│  │  Soil Condition: ○ Sandy ○ Clay ○ Loamy ○ Red ○ Black ○ Unk. │  │
│  │  Soil Image:     [📷 Upload]                                  │  │
│  │                                                                │  │
│  │  Previous Crop:  [___________▾]                               │  │
│  │  Irrigation:     ○ Yes  ○ No                                  │  │
│  │                                                                │  │
│  │  ⚠ Data Accuracy Disclaimer                                   │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│                              [Check Suitability ►]                   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘

                        ▼▼▼ RESULTS ▼▼▼

┌──────────────────────────────────────────────────────────────────────┐
│                  SUITABILITY RESULTS                                  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                SUITABILITY: 82%                                 │  │
│  │           ┌───────────────────┐                                │  │
│  │           │    ╭─────────╮    │                                │  │
│  │           │   ╱           ╲   │                                │  │
│  │           │  │   82%       │  │    ✅ HIGHLY SUITABLE          │  │
│  │           │   ╲           ╱   │                                │  │
│  │           │    ╰─────────╯    │    80-100% → Highly suitable   │  │
│  │           └───────────────────┘    60-80%  → Moderate          │  │
│  │                                    Below 60% → Not recommended │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  🔧 SOIL IMPROVEMENTS REQUIRED                                │  │
│  │                                                                │  │
│  │  • Increase nitrogen content (add urea or compost)            │  │
│  │  • Improve drainage (raised bed farming recommended)          │  │
│  │  • Add organic compost (2-3 tons per acre)                    │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  📋 REASON FOR RESULT                                         │  │
│  │                                                                │  │
│  │  ✓ Soil moisture moderate — within acceptable range           │  │
│  │  ✓ Weather favorable — temperature and humidity suitable      │  │
│  │  ✓ Crop rotation compatible — no soil depletion conflict      │  │
│  │  ⚠ Nitrogen levels slightly below optimal                     │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  📝 CULTIVATION ADVICE                                        │  │
│  │                                                                │  │
│  │  • Maintain irrigation every 7 days                           │  │
│  │  • Apply nitrogen fertilizer at sowing and 30 days after      │  │
│  │  • Monitor for common pests in your region                    │  │
│  │  • Harvest window: 90-120 days after sowing                   │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  [◄ Check Another Crop]    [Save to Profile]                        │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### 5.6 User Profile Page Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│                         NAVIGATION BAR                               │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  PROFILE HEADER                                                │  │
│  │  ┌──────┐                                                     │  │
│  │  │ 👤   │  Farmer Name                                       │  │
│  │  │Avatar│  farmer@email.com                                   │  │
│  │  └──────┘  Member since: Jan 2026                            │  │
│  │            [Edit Profile]                                     │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────┐  ┌──────────────────────────────────────┐  │
│  │  LAND DETAILS        │  │  CROP HISTORY TIMELINE               │  │
│  │                      │  │                                      │  │
│  │  Land Size: 5 acre   │  │  2026 Kharif — Groundnut ✓          │  │
│  │  Location: Tamil Nadu│  │  2025 Rabi   — Wheat ✓              │  │
│  │  Soil Type: Red      │  │  2025 Kharif — Paddy ✓              │  │
│  │                      │  │  2024 Rabi   — Maize ✓              │  │
│  │  [Edit Land Details] │  │                                      │  │
│  └──────────────────────┘  └──────────────────────────────────────┘  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  PAST RECOMMENDATIONS                                         │  │
│  │                                                                │  │
│  │  ┌──────────────────────────────────────────────────────────┐ │  │
│  │  │ 📅 Mar 5, 2026  │  Type: Recommendation                 │ │  │
│  │  │ Crops: Groundnut (92%), Maize (86%), Cotton (78%)        │ │  │
│  │  │ [View Full Report]                                       │ │  │
│  │  └──────────────────────────────────────────────────────────┘ │  │
│  │  ┌──────────────────────────────────────────────────────────┐ │  │
│  │  │ 📅 Feb 20, 2026 │  Type: Suitability Check              │ │  │
│  │  │ Crop: Sugarcane │  Suitability: 74% (Moderate)           │ │  │
│  │  │ [View Full Report]                                       │ │  │
│  │  └──────────────────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### 5.7 Responsive Design Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | Single column, stacked cards, hamburger nav |
| Tablet | 640px – 1024px | Two-column grid, compact cards |
| Desktop | > 1024px | Full layout, side-by-side sections |

---

## 6. Data Flow

### 6.1 Crop Recommendation — Complete Data Flow

```
┌─────────┐                                                          
│  USER   │                                                          
└────┬────┘                                                          
     │ 1. Fills multi-step form                                      
     │    (land, soil, environment, history, financial)              
     ▼                                                               
┌──────────────┐                                                     
│   REACT SPA  │                                                     
│              │  2. Client-side validation                          
│  - Validate  │     • At least one soil input provided              
│    inputs    │     • Required fields present                       
│  - Upload    │     • File size/type check                          
│    soil img  │                                                     
└──────┬───────┘                                                     
       │ 3. POST /api/crop/recommend                                 
       │    (multipart/form-data with image, JSON body)              
       ▼                                                             
┌──────────────────────┐                                             
│   EXPRESS BACKEND    │                                             
│                      │                                             
│  4. Auth Middleware   │  Verify JWT token                           
│  5. Validate Request │  Schema validation (Joi/Zod)               
│  6. Upload Image     │  Store to Cloudinary/S3                    
└──────────┬───────────┘                                             
           │                                                         
           ▼                                                         
┌──────────────────────────────────────────────────────────────────┐  
│            CROP RECOMMENDATION SERVICE (Orchestrator)             │  
│                                                                    │  
│  ┌─────────────────────────────────────────────────────────────┐ │  
│  │ PARALLEL EXECUTION PHASE                                    │ │  
│  │                                                             │ │  
│  │  7a. SoilAnalysisService        7b. WeatherService          │ │  
│  │      ├── Parse manual input         ├── Geocode location    │ │  
│  │      ├── Analyze soil image         └── Fetch weather data  │ │  
│  │      │   (ML model inference)           (OpenWeatherMap)    │ │  
│  │      └── Merge soil features                                │ │  
│  │                                                             │ │  
│  │  7c. CropRotationService                                    │ │  
│  │      └── Query rotation rules for previous crop             │ │  
│  └─────────────────────────┬───────────────────────────────────┘ │  
│                            │                                      │  
│                            ▼                                      │  
│  ┌─────────────────────────────────────────────────────────────┐ │  
│  │ 8. ML CROP PREDICTION MODEL                                 │ │  
│  │    Input: combined feature vector                           │ │  
│  │    ├── Soil features (type, pH, moisture, image features)   │ │  
│  │    ├── Weather features (temp, humidity, rainfall)          │ │  
│  │    ├── Rotation compatibility scores                        │ │  
│  │    └── Land size, irrigation availability                   │ │  
│  │                                                             │ │  
│  │    Output: Ranked list of crops with confidence scores      │ │  
│  │    [Groundnut: 0.92, Maize: 0.86, Cotton: 0.78, ...]      │ │  
│  └─────────────────────────┬───────────────────────────────────┘ │  
│                            │                                      │  
│                            ▼                                      │  
│  ┌─────────────────────────────────────────────────────────────┐ │  
│  │ POST-PROCESSING PHASE (Top 2-3 crops)                       │ │  
│  │                                                             │ │  
│  │  9a. SustainabilityService                                  │ │  
│  │      └── Score each crop for soil health impact             │ │  
│  │                                                             │ │  
│  │  9b. ProfitEstimationService                                │ │  
│  │      └── Calculate: Yield × MarketPrice − Investment        │ │  
│  │                                                             │ │  
│  │  9c. FertilizerService                                      │ │  
│  │      └── Match fertilizers to crop + soil deficiencies      │ │  
│  │                                                             │ │  
│  │  9d. CultivationGuideService                                │ │  
│  │      └── Generate step-by-step guidance & growth tips       │ │  
│  └─────────────────────────┬───────────────────────────────────┘ │  
│                            │                                      │  
└────────────────────────────┼──────────────────────────────────────┘  
                             │                                        
                             ▼                                        
┌──────────────────────────────────────────────────────────────────┐  
│  10. COMPOSE FINAL RESPONSE                                      │  
│                                                                    │  
│  {                                                                 │  
│    recommendations: [                                              │  
│      {                                                             │  
│        crop: "Groundnut",                                          │  
│        suitability: 92,                                            │  
│        sustainability: { level: "High", explanation: "..." },      │  
│        profit: { investment: 30000, revenue: 65000, profit: 35000},│  
│        reasons: ["Soil suitable", "Weather favorable", ...],       │  
│        fertilizers: ["Nitrogen fertilizer", ...],                  │  
│        cultivationGuide: ["Step 1...", "Step 2...", ...],          │  
│        growthTips: ["Maintain moisture...", ...]                    │  
│      },                                                            │  
│      ...                                                           │  
│    ],                                                              │  
│    disclaimer: "Providing more details improves accuracy..."       │  
│  }                                                                 │  
└──────────────────────────────┬───────────────────────────────────┘  
                               │                                      
                               ▼                                      
┌─────────────────────────────────────────────────────────────────┐   
│  11. SAVE TO DATABASE                                            │   
│      ├── Save prediction result (PredictionResult collection)    │   
│      ├── Update crop history (CropHistory collection)            │   
│      └── Return JSON response to client                          │   
└──────────────────────────────┬──────────────────────────────────┘   
                               │                                      
                               ▼                                      
┌─────────────────────────────────────────────────────────────────┐   
│  12. REACT SPA RENDERS RESULTS                                   │   
│      ├── Animated transition to results view                     │   
│      ├── Render crop cards with gauges                           │   
│      ├── Display profit table                                    │   
│      ├── Show sustainability bars                                │   
│      └── Expand cultivation guidance accordion                   │   
└─────────────────────────────────────────────────────────────────┘   
```

### 6.2 Crop Suitability — Data Flow

```
USER INPUT                     PROCESSING                        OUTPUT
─────────                      ──────────                        ──────
Crop Name ──────┐
Land Size ──────┤
Location ───────┤         ┌──────────────┐
Soil Data ──────┼────────►│ Suitability  │──────► Suitability %
Soil Image ─────┤         │   Service    │──────► Level (High/Med/Low)
Previous Crop ──┤         │              │──────► Soil Improvements
Irrigation ─────┘         │  Uses:       │──────► Reasons
                          │  - Soil AI   │──────► Cultivation Advice
                          │  - Weather   │
                          │  - Rotation  │
                          │  - Crop DB   │
                          └──────────────┘
```

### 6.3 Authentication Flow

```
┌────────┐    POST /api/auth/register     ┌──────────┐    Hash Password    ┌──────────┐
│ Client │ ──────────────────────────────► │  Auth    │ ──────────────────► │ MongoDB  │
│        │                                 │ Service  │ ◄────── Save User ─ │          │
│        │ ◄── { token, user } ─────────── │          │                     │          │
└────────┘                                 └──────────┘                     └──────────┘

┌────────┐    POST /api/auth/login         ┌──────────┐    Verify Password  ┌──────────┐
│ Client │ ──────────────────────────────► │  Auth    │ ──────────────────► │ MongoDB  │
│        │                                 │ Service  │ ◄── User Record ──  │          │
│        │ ◄── { token, user } ─────────── │          │                     │          │
└────────┘                                 └──────────┘                     └──────────┘

Subsequent Requests:
┌────────┐    Authorization: Bearer <JWT>   ┌──────────┐
│ Client │ ────────────────────────────────► │  Auth    │ ── Decode & verify
│        │                                   │Middleware│ ── Attach user to req
│        │                                   └──────────┘
```

---

## 7. Database Schema Design

### 7.1 Collections Overview

```
MongoDB Database: crop_advisor_db
│
├── users
├── lands
├── crop_histories
├── prediction_results
├── crop_database
└── market_prices
```

### 7.2 User Collection

```javascript
{
  _id: ObjectId,
  name: String,                    // Full name
  email: String,                   // Unique, indexed
  password: String,                // bcrypt hashed
  phone: String,                   // Optional
  avatar: String,                  // URL to profile image
  
  // Default land (quick access)
  defaultLandId: ObjectId,         // Reference to lands collection
  
  // Preferences
  preferredLanguage: String,       // Default: "en"
  preferredUnit: String,           // "acre" | "cent"
  preferredCurrency: String,       // Default: "INR"
  
  // Metadata
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date,
  isActive: Boolean                // Default: true
}

// Indexes:
// { email: 1 } — unique
// { createdAt: -1 }
```

### 7.3 Land Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,                // Reference to users collection (indexed)
  
  // Land Details
  name: String,                    // e.g., "North Field"
  size: Number,                    // Numeric value
  sizeUnit: String,                // "acre" | "cent"
  
  // Location
  location: {
    address: String,               // Human-readable address
    district: String,
    state: String,
    country: String,               // Default: "India"
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  // Soil Information
  soilCondition: String,           // "sandy" | "clay" | "loamy" | "red" | "black" | "unknown"
  soilPH: Number,                  // 0-14, optional
  soilImageURL: String,            // Uploaded soil image
  soilAnalysisResult: {            // Cached AI soil analysis
    detectedType: String,
    confidence: Number,
    features: Object,
    analyzedAt: Date
  },
  
  // Environment
  irrigationAvailable: Boolean,
  soilMoisture: String,            // "low" | "medium" | "high"
  waterSource: String,             // Optional: "well" | "canal" | "rain-fed" | "borewell"
  
  // Metadata
  createdAt: Date,
  updatedAt: Date
}

// Indexes:
// { userId: 1 }
// { "location.coordinates": "2dsphere" } — geospatial queries
// { userId: 1, createdAt: -1 }
```

### 7.4 Crop History Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,                // Reference to users
  landId: ObjectId,                // Reference to lands
  
  // Crop Details
  cropName: String,                // e.g., "Groundnut"
  season: String,                  // "kharif" | "rabi" | "zaid" | "summer" | "winter"
  year: Number,                    // e.g., 2025
  
  // Cultivation Details
  sowingDate: Date,
  harvestDate: Date,
  actualYield: Number,             // Optional (kg)
  yieldUnit: String,               // "kg" | "quintal" | "ton"
  
  // Financial
  investmentAmount: Number,        // ₹
  revenueEarned: Number,           // ₹ (optional, post-harvest)
  
  // Linked Prediction
  predictionResultId: ObjectId,    // Reference to prediction_results
  
  // Metadata
  createdAt: Date,
  updatedAt: Date
}

// Indexes:
// { userId: 1, landId: 1 }
// { userId: 1, year: -1, season: 1 }
// { cropName: 1 }
```

### 7.5 Prediction Result Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,                // Reference to users
  landId: ObjectId,                // Reference to lands
  
  // Request Type
  type: String,                    // "recommendation" | "suitability"
  
  // Input Snapshot (preserved for audit and reproducibility)
  input: {
    landSize: Number,
    landSizeUnit: String,
    location: {
      address: String,
      latitude: Number,
      longitude: Number
    },
    soilCondition: String,
    soilPH: Number,
    soilImageURL: String,
    irrigationAvailable: Boolean,
    soilMoisture: String,
    previousCrop: String,
    previousSeason: String,
    investmentAmount: Number,
    
    // Suitability-specific
    targetCrop: String             // Only for suitability checks
  },
  
  // AI Processing Data
  processingData: {
    soilAnalysis: {
      manualType: String,
      imageDetectedType: String,
      imageConfidence: Number,
      mergedFeatures: Object
    },
    weatherData: {
      temperature: Number,
      humidity: Number,
      rainfall: Number,
      season: String,
      fetchedAt: Date
    },
    rotationAnalysis: {
      previousCrop: String,
      compatibleCrops: [String],
      incompatibleCrops: [String]
    }
  },
  
  // RECOMMENDATION RESULTS (type === "recommendation")
  recommendations: [{
    crop: String,
    suitabilityScore: Number,       // 0-100
    
    sustainability: {
      level: String,                // "high" | "medium" | "low"
      score: Number,                // 0-100
      explanation: String
    },
    
    profitEstimation: {
      investmentCost: Number,
      expectedYield: Number,        // kg
      marketPricePerUnit: Number,   // ₹/kg
      expectedRevenue: Number,
      estimatedProfit: Number,
      profitMarginPercent: Number
    },
    
    reasons: [String],
    
    fertilizers: [{
      name: String,
      type: String,                 // "chemical" | "organic"
      applicationSchedule: String,
      dosage: String
    }],
    
    cultivationGuide: [{
      step: Number,
      instruction: String,
      timing: String
    }],
    
    growthTips: [String]
  }],
  
  // SUITABILITY RESULTS (type === "suitability")
  suitabilityResult: {
    crop: String,
    suitabilityScore: Number,       // 0-100
    level: String,                  // "highly_suitable" | "moderately_suitable" | "not_recommended"
    
    soilImprovements: [{
      issue: String,
      recommendation: String
    }],
    
    reasons: [String],
    
    cultivationAdvice: [String]
  },
  
  // Data quality indicator
  dataCompletenessScore: Number,    // 0-100 (how much input was provided)
  
  // Disclaimer
  disclaimer: String,
  
  // Metadata
  createdAt: Date,
  processingTimeMs: Number          // How long the AI took
}

// Indexes:
// { userId: 1, createdAt: -1 }
// { userId: 1, type: 1 }
// { type: 1, createdAt: -1 }
```

### 7.6 Crop Database Collection

```javascript
{
  _id: ObjectId,
  name: String,                    // e.g., "Groundnut"
  scientificName: String,          // e.g., "Arachis hypogaea"
  category: String,                // "cereal" | "pulse" | "oilseed" | "vegetable" | "fruit" | "spice" | "fiber"
  
  // Growing Conditions
  idealConditions: {
    soilTypes: [String],           // ["sandy", "loamy", "red"]
    soilPHRange: {
      min: Number,
      max: Number
    },
    temperatureRange: {            // °C
      min: Number,
      max: Number,
      optimal: Number
    },
    rainfallRange: {               // mm
      min: Number,
      max: Number
    },
    humidityRange: {               // %
      min: Number,
      max: Number
    },
    irrigationRequired: Boolean,
    seasons: [String]              // ["kharif", "rabi"]
  },
  
  // Yield Data
  averageYieldPerAcre: Number,     // quintal/acre
  growthDuration: Number,          // days
  
  // Sustainability
  soilNutrientImpact: {
    nitrogen: String,              // "adds" | "depletes" | "neutral"
    phosphorus: String,
    potassium: String
  },
  
  // Rotation
  goodPredecessors: [String],      // Crops that are good to grow before this
  badPredecessors: [String],       // Crops to avoid growing before this
  
  // Common Fertilizers
  recommendedFertilizers: [{
    name: String,
    type: String,
    timing: String,
    dosagePerAcre: String
  }],
  
  // Cultivation Guide Template
  cultivationSteps: [{
    step: Number,
    phase: String,                 // "preparation" | "sowing" | "growth" | "harvest"
    instruction: String,
    timing: String
  }],
  
  // Market Data Reference
  averageMarketPrice: Number,      // ₹/quintal
  priceLastUpdated: Date,
  
  createdAt: Date,
  updatedAt: Date
}

// Indexes:
// { name: 1 } — unique
// { category: 1 }
// { "idealConditions.soilTypes": 1 }
// { "idealConditions.seasons": 1 }
```

### 7.7 Market Price Collection

```javascript
{
  _id: ObjectId,
  cropName: String,
  state: String,
  district: String,
  
  pricePerQuintal: Number,         // ₹
  priceDate: Date,
  
  source: String,                  // "api" | "manual" | "government"
  
  createdAt: Date
}

// Indexes:
// { cropName: 1, state: 1, priceDate: -1 }
// { priceDate: -1 }
```

### 7.8 Entity Relationship Diagram

```
┌──────────────┐       1:N       ┌──────────────┐
│    USERS     │ ───────────────► │    LANDS     │
│              │                  │              │
│ _id          │                  │ _id          │
│ name         │                  │ userId ──────┤
│ email        │    1:N           │ name         │
│ password     │ ──────────┐     │ size         │
│ defaultLandId│           │     │ location     │
└──────┬───────┘           │     │ soilCondition│
       │                   │     └──────┬───────┘
       │ 1:N               │            │
       │                   │            │ 1:N
       ▼                   │            ▼
┌──────────────┐           │     ┌──────────────┐
│  PREDICTION  │           │     │ CROP_HISTORY │
│   RESULTS    │           │     │              │
│              │           │     │ _id          │
│ _id          │  ◄────────┘     │ userId       │
│ userId       │                  │ landId       │
│ landId       │                  │ cropName     │
│ type         │                  │ season       │
│ input        │                  │ year         │
│ recommendations│                │ actualYield  │
│ suitabilityResult│              │ predictionResultId │
└──────────────┘                  └──────────────┘
       
       Standalone Reference Collections:
       
┌──────────────┐           ┌──────────────┐
│ CROP_DATABASE│           │ MARKET_PRICES│
│              │           │              │
│ _id          │           │ _id          │
│ name         │           │ cropName     │
│ idealCond.   │           │ state        │
│ avgYield     │           │ pricePerQtl  │
│ fertilizers  │           │ priceDate    │
└──────────────┘           └──────────────┘
```

---

## 8. AI Module Design

### 8.1 AI Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI PROCESSING PIPELINE                         │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  MODULE 1: SOIL IMAGE ANALYSIS                              │ │
│  │                                                             │ │
│  │  Model: Convolutional Neural Network (CNN)                  │ │
│  │  Framework: TensorFlow.js / ONNX Runtime                    │ │
│  │  Input: Soil photograph (224×224 RGB)                       │ │
│  │  Output: { soilType: String, confidence: Float,             │ │
│  │            features: { color, texture, moisture_visual } }  │ │
│  │                                                             │ │
│  │  Architecture:                                              │ │
│  │  Input(224×224×3) → Conv2D blocks → GlobalAvgPool           │ │
│  │  → Dense(256) → Dropout(0.3) → Dense(6, softmax)           │ │
│  │                                                             │ │
│  │  Classes: [sandy, clay, loamy, red, black, unknown]         │ │
│  │  Training Data: 10,000+ labeled soil images                 │ │
│  │  Target Accuracy: >85%                                      │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  MODULE 2: WEATHER ANALYSIS                                 │ │
│  │                                                             │ │
│  │  Source: OpenWeatherMap API (or similar)                     │ │
│  │  Input: latitude, longitude                                 │ │
│  │  Output: {                                                  │ │
│  │    temperature: Number (°C),                                │ │
│  │    humidity: Number (%),                                    │ │
│  │    rainfall: Number (mm, monthly avg),                      │ │
│  │    windSpeed: Number (km/h),                                │ │
│  │    season: String (derived),                                │ │
│  │    forecast7day: Array                                      │ │
│  │  }                                                          │ │
│  │                                                             │ │
│  │  Processing:                                                │ │
│  │  1. Fetch current + 7-day forecast                          │ │
│  │  2. Calculate monthly rainfall average                      │ │
│  │  3. Determine agricultural season                           │ │
│  │  4. Normalize features for ML input                         │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  MODULE 3: CROP PREDICTION MODEL                            │ │
│  │                                                             │ │
│  │  Model: Gradient Boosting / Random Forest Ensemble          │ │
│  │  Framework: Python (scikit-learn / XGBoost) served via      │ │
│  │             Flask microservice or ONNX Runtime in Node.js   │ │
│  │                                                             │ │
│  │  Feature Vector (15 features):                              │ │
│  │  ┌─────────────────────────────────────────────────────┐    │ │
│  │  │ soil_type_encoded (one-hot, 6 dims)                 │    │ │
│  │  │ soil_pH                                             │    │ │
│  │  │ soil_moisture_encoded                               │    │ │
│  │  │ temperature                                         │    │ │
│  │  │ humidity                                            │    │ │
│  │  │ rainfall                                            │    │ │
│  │  │ irrigation_available (binary)                       │    │ │
│  │  │ land_size_normalized                                │    │ │
│  │  │ previous_crop_encoded                               │    │ │
│  │  │ season_encoded                                      │    │ │
│  │  └─────────────────────────────────────────────────────┘    │ │
│  │                                                             │ │
│  │  Output: Top-N crops with probability scores                │ │
│  │  [{ crop: "Groundnut", score: 0.92 }, ...]                 │ │
│  │                                                             │ │
│  │  Training: 50,000+ historical crop records                  │ │
│  │  Validation: 5-fold cross-validation, target F1 > 0.85     │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  MODULE 4: CROP ROTATION ENGINE                             │ │
│  │                                                             │ │
│  │  Type: Rule-based + Knowledge Graph                         │ │
│  │                                                             │ │
│  │  Logic:                                                     │ │
│  │  1. Look up previous crop in rotation compatibility DB      │ │
│  │  2. Score each candidate crop:                              │ │
│  │     - Nutrient replenishment bonus (+20%)                   │ │
│  │     - Same-family penalty (-30%)                            │ │
│  │     - Disease cycle break bonus (+15%)                      │ │
│  │  3. Return compatibility modifier for each crop             │ │
│  │                                                             │ │
│  │  Rotation Rules Examples:                                   │ │
│  │  ┌──────────────┬───────────────────┬───────────────────┐   │ │
│  │  │ Previous     │ Good Next Crops   │ Bad Next Crops    │   │ │
│  │  ├──────────────┼───────────────────┼───────────────────┤   │ │
│  │  │ Rice         │ Groundnut, Lentil │ Rice, Wheat       │   │ │
│  │  │ Groundnut    │ Maize, Wheat      │ Groundnut         │   │ │
│  │  │ Wheat        │ Pulses, Cotton    │ Wheat, Barley     │   │ │
│  │  │ Cotton       │ Groundnut, Pulses │ Cotton            │   │ │
│  │  │ Maize        │ Soybean, Pulses   │ Maize, Sorghum   │   │ │
│  │  └──────────────┴───────────────────┴───────────────────┘   │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  MODULE 5: SUSTAINABILITY EVALUATOR                         │ │
│  │                                                             │ │
│  │  Type: Scoring algorithm                                    │ │
│  │                                                             │ │
│  │  Factors (weighted):                                        │ │
│  │  ┌────────────────────────────┬──────────┐                  │ │
│  │  │ Factor                     │ Weight   │                  │ │
│  │  ├────────────────────────────┼──────────┤                  │ │
│  │  │ Nitrogen fixation ability  │ 25%      │                  │ │
│  │  │ Water usage efficiency     │ 20%      │                  │ │
│  │  │ Soil erosion impact        │ 15%      │                  │ │
│  │  │ Chemical input requirement │ 15%      │                  │ │
│  │  │ Crop rotation benefit      │ 15%      │                  │ │
│  │  │ Biodiversity contribution  │ 10%      │                  │ │
│  │  └────────────────────────────┴──────────┘                  │ │
│  │                                                             │ │
│  │  Score Ranges:                                              │ │
│  │  80-100 → High  │  50-79 → Medium  │  0-49 → Low          │ │
│  │                                                             │ │
│  │  Output: {                                                  │ │
│  │    score: 85,                                               │ │
│  │    level: "High",                                           │ │
│  │    explanation: "Legume crops restore nitrogen levels..."    │ │
│  │  }                                                          │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  MODULE 6: PROFIT ESTIMATION ENGINE                         │ │
│  │                                                             │ │
│  │  Formula:                                                   │ │
│  │  Profit = (Expected Yield × Market Price) − Investment Cost │ │
│  │                                                             │ │
│  │  Sub-calculations:                                          │ │
│  │  1. Expected Yield = Avg Yield/Acre × Land Size × Modifier │ │
│  │     Modifier based on:                                      │ │
│  │     - Soil quality (0.7 - 1.2)                             │ │
│  │     - Irrigation (0.8 if none, 1.0 if available)           │ │
│  │     - Weather suitability (0.6 - 1.1)                      │ │
│  │                                                             │ │
│  │  2. Market Price = Latest regional market price/quintal     │ │
│  │     Source: market_prices collection (updated periodically) │ │
│  │                                                             │ │
│  │  3. Investment = User-provided amount                       │ │
│  │     If not provided: use average cultivation cost/acre      │ │
│  │                                                             │ │
│  │  Output: {                                                  │ │
│  │    investmentCost: 30000,                                   │ │
│  │    expectedYield: 650,           // kg                      │ │
│  │    marketPricePerUnit: 100,      // ₹/kg                   │ │
│  │    expectedRevenue: 65000,                                  │ │
│  │    estimatedProfit: 35000,                                  │ │
│  │    profitMarginPercent: 116.67                              │ │
│  │  }                                                          │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  MODULE 7: FERTILIZER RECOMMENDER                           │ │
│  │                                                             │ │
│  │  Type: Rule-based + Lookup table                            │ │
│  │                                                             │ │
│  │  Logic:                                                     │ │
│  │  1. Query crop_database for recommended fertilizers         │ │
│  │  2. Adjust based on soil deficiencies:                      │ │
│  │     - Low pH → add lime                                    │ │
│  │     - Sandy soil → more organic matter                     │ │
│  │     - Clay soil → gypsum for drainage                      │ │
│  │  3. Adjust based on previous crop nutrient impact           │ │
│  │  4. Prioritize organic options when possible                │ │
│  │                                                             │ │
│  │  Output: [{                                                 │ │
│  │    name: "Urea",                                            │ │
│  │    type: "chemical",                                        │ │
│  │    applicationSchedule: "At sowing and 30 days after",      │ │
│  │    dosage: "50 kg/acre"                                     │ │
│  │  }]                                                         │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  MODULE 8: CULTIVATION GUIDE GENERATOR                      │ │
│  │                                                             │ │
│  │  Type: Template-based with dynamic parameters               │ │
│  │                                                             │ │
│  │  Logic:                                                     │ │
│  │  1. Retrieve base cultivation template from crop_database   │ │
│  │  2. Customize steps based on:                               │ │
│  │     - Soil type (preparation steps differ)                  │ │
│  │     - Irrigation availability (watering schedule)           │ │
│  │     - Season (timing adjustments)                           │ │
│  │     - Land size (scale-appropriate advice)                  │ │
│  │  3. Add growth tips specific to conditions                  │ │
│  │                                                             │ │
│  │  Output: {                                                  │ │
│  │    cultivationGuide: [                                      │ │
│  │      { step: 1, instruction: "...", timing: "2 weeks..." }, │ │
│  │      { step: 2, instruction: "...", timing: "At sowing" }   │ │
│  │    ],                                                       │ │
│  │    growthTips: [                                             │ │
│  │      "Maintain moderate soil moisture",                      │ │
│  │      "Avoid waterlogging"                                    │ │
│  │    ]                                                         │ │
│  │  }                                                          │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 ML Model Serving Strategy

```
Option A: Python Microservice (Recommended for complex models)
┌─────────────────┐     HTTP/gRPC      ┌─────────────────────┐
│   Node.js API   │ ──────────────────► │  Flask/FastAPI      │
│                 │                     │  Python Service     │
│                 │ ◄────── JSON ────── │  - scikit-learn     │
│                 │                     │  - TensorFlow       │
└─────────────────┘                     └─────────────────────┘

Option B: ONNX Runtime in Node.js (For simpler models)
┌─────────────────────────────────────────┐
│              Node.js API                 │
│  ┌─────────────────────────────────┐    │
│  │  ONNX Runtime (onnxruntime-node)│    │
│  │  - Load .onnx model files      │    │
│  │  - Direct inference in process  │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘

Option C: TensorFlow.js (For image models)
┌─────────────────────────────────────────┐
│              Node.js API                 │
│  ┌─────────────────────────────────┐    │
│  │  @tensorflow/tfjs-node          │    │
│  │  - Load SavedModel / LayersModel│    │
│  │  - GPU acceleration optional    │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### 8.3 Model Training Pipeline (Offline)

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Data          │    │ Feature      │    │ Model        │    │ Model        │
│ Collection    │───►│ Engineering  │───►│ Training     │───►│ Export       │
│               │    │              │    │              │    │              │
│ - Historical  │    │ - Encoding   │    │ - Train/Val  │    │ - ONNX       │
│   crop data   │    │ - Scaling    │    │   split      │    │ - SavedModel │
│ - Soil images │    │ - One-hot    │    │ - Hypertuning│    │ - Version    │
│ - Weather     │    │ - Imputation │    │ - Evaluation │    │   control    │
│   records     │    │              │    │              │    │              │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

---

## 9. API Design Overview

### 9.1 API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login and receive JWT |
| GET | `/api/auth/me` | Yes | Get current user profile |
| PUT | `/api/user/profile` | Yes | Update user profile |
| POST | `/api/land` | Yes | Add land details |
| GET | `/api/land` | Yes | Get user's lands |
| PUT | `/api/land/:id` | Yes | Update land details |
| DELETE | `/api/land/:id` | Yes | Delete land |
| POST | `/api/crop/recommend` | Yes | Get crop recommendations |
| POST | `/api/crop/suitability` | Yes | Check crop suitability |
| GET | `/api/history` | Yes | Get crop history |
| POST | `/api/history` | Yes | Add crop history record |
| GET | `/api/predictions` | Yes | Get past predictions |
| GET | `/api/predictions/:id` | Yes | Get specific prediction detail |
| POST | `/api/upload/soil-image` | Yes | Upload soil image |

### 9.2 Key API Response Structures

#### Crop Recommendation Response

```json
{
  "success": true,
  "data": {
    "predictionId": "65f1a2b3c4d5e6f7...",
    "dataCompletenessScore": 85,
    "recommendations": [
      {
        "crop": "Groundnut",
        "suitabilityScore": 92,
        "sustainability": {
          "level": "High",
          "score": 88,
          "explanation": "Legume crops restore nitrogen levels in soil."
        },
        "profitEstimation": {
          "investmentCost": 30000,
          "expectedYieldKg": 650,
          "marketPricePerKg": 100,
          "expectedRevenue": 65000,
          "estimatedProfit": 35000,
          "profitMarginPercent": 116.67
        },
        "reasons": [
          "Soil conditions suitable for groundnut cultivation",
          "Weather conditions favorable (temperature: 28°C, humidity: 65%)",
          "Previous crop rotation beneficial — nitrogen fixation",
          "Market demand high in Tamil Nadu region"
        ],
        "fertilizers": [
          {
            "name": "Urea",
            "type": "chemical",
            "applicationSchedule": "At sowing and 30 days after",
            "dosage": "50 kg/acre"
          },
          {
            "name": "Organic Compost",
            "type": "organic",
            "applicationSchedule": "During soil preparation",
            "dosage": "2 tons/acre"
          }
        ],
        "cultivationGuide": [
          { "step": 1, "instruction": "Prepare soil using organic manure", "timing": "2-3 weeks before sowing" },
          { "step": 2, "instruction": "Sow seeds at 30cm spacing", "timing": "At sowing" },
          { "step": 3, "instruction": "Maintain irrigation schedule", "timing": "Every 5-7 days" },
          { "step": 4, "instruction": "Apply fertilizer during early growth", "timing": "Week 3" },
          { "step": 5, "instruction": "Monitor pests weekly", "timing": "Throughout growth" }
        ],
        "growthTips": [
          "Maintain moderate soil moisture throughout growth period",
          "Avoid waterlogging — ensure proper drainage channels",
          "Improve organic soil content with green manure cover crops"
        ]
      }
    ],
    "disclaimer": "Providing more details such as soil condition, soil image, previous crop history, irrigation availability, and investment amount improves the accuracy of AI predictions."
  }
}
```

---

## 10. Security Design

### 10.1 Authentication & Authorization

| Aspect | Implementation |
|--------|---------------|
| Password Storage | bcrypt with salt rounds = 12 |
| Token Type | JSON Web Token (JWT) |
| Token Expiry | Access: 24h, Refresh: 7d |
| Token Storage (Client) | httpOnly cookie (preferred) or localStorage |
| Route Protection | Express middleware validates JWT on protected routes |

### 10.2 Input Validation & Sanitization

- All inputs validated with **Joi** or **Zod** schema validation
- File uploads restricted: max 5MB, only JPG/PNG
- SQL/NoSQL injection prevention via Mongoose parameterized queries
- XSS prevention via output encoding and Helmet headers

### 10.3 Rate Limiting

| Endpoint Group | Limit |
|----------------|-------|
| Auth endpoints | 5 requests / 15 minutes per IP |
| AI prediction endpoints | 10 requests / hour per user |
| General API | 100 requests / 15 minutes per user |

### 10.4 Security Headers (Helmet)

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
```

---

## 11. Error Handling Strategy

### 11.1 Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "At least one soil input (manual condition or soil image) must be provided.",
    "details": [
      { "field": "soilCondition", "message": "Required if soil image is not provided" }
    ]
  }
}
```

### 11.2 Error Code Categories

| Code Range | Category | Example |
|------------|----------|---------|
| 400 | Validation errors | Missing required field |
| 401 | Authentication errors | Invalid/expired token |
| 403 | Authorization errors | Accessing another user's data |
| 404 | Not found | Land/prediction not found |
| 422 | Processing errors | AI model inference failed |
| 429 | Rate limit exceeded | Too many requests |
| 500 | Internal server errors | Unexpected failures |
| 503 | Service unavailable | Weather API down, ML service down |

### 11.3 Graceful Degradation

| Failed Service | Fallback Behavior |
|----------------|-------------------|
| Weather API down | Use seasonal averages for the region |
| Soil image model fails | Rely on manual soil input only |
| Market price API down | Use cached/historical prices |
| ML model timeout | Return cached recommendations for similar inputs |

---

## 12. Scalability Considerations

### 12.1 Horizontal Scaling Strategy

```
                    ┌──────────────────┐
                    │   Load Balancer   │
                    │   (Nginx / ALB)   │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
        ┌─────┴─────┐ ┌─────┴─────┐ ┌─────┴─────┐
        │  Node.js  │ │  Node.js  │ │  Node.js  │
        │ Instance 1│ │ Instance 2│ │ Instance 3│
        └─────┬─────┘ └─────┬─────┘ └─────┬─────┘
              │              │              │
              └──────────────┼──────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
        ┌─────┴─────┐ ┌─────┴─────┐ ┌─────┴─────┐
        │  MongoDB  │ │   Redis   │ │  ML Python │
        │  Atlas    │ │   Cache   │ │  Service   │
        └───────────┘ └───────────┘ └────────────┘
```

### 12.2 Caching Strategy

| Data | Cache Duration | Storage |
|------|---------------|---------|
| Weather data for location | 1 hour | Redis |
| Market prices | 24 hours | Redis |
| Crop database | 24 hours | In-memory |
| ML model predictions (same input hash) | 6 hours | Redis |
| Static assets | 30 days | CDN |

### 12.3 Performance Targets

| Metric | Target |
|--------|--------|
| API response (non-AI) | < 200ms |
| AI recommendation | < 5 seconds |
| Image upload + analysis | < 8 seconds |
| Page load (first contentful paint) | < 1.5 seconds |
| Database query | < 50ms |
| Concurrent users | 1,000+ |

---

*End of Design Document*
