# Requirements Document

## AI-Powered Sustainable Crop Recommendation and Suitability System

**Version:** 1.0  
**Date:** March 8, 2026  
**Status:** Draft  

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Goals & Objectives](#2-system-goals--objectives)
3. [Stakeholders](#3-stakeholders)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [User Stories](#6-user-stories)
7. [Use Cases](#7-use-cases)
8. [Input Validation Rules](#8-input-validation-rules)
9. [Business Rules](#9-business-rules)
10. [Constraints](#10-constraints)
11. [Assumptions](#11-assumptions)
12. [Dependencies](#12-dependencies)
13. [Acceptance Criteria](#13-acceptance-criteria)
14. [Glossary](#14-glossary)

---

## 1. Introduction

### 1.1 Purpose

This document specifies the complete functional and non-functional requirements for the **AI-Powered Sustainable Crop Recommendation and Suitability System**. It serves as the authoritative reference for development, testing, and acceptance of the platform.

### 1.2 Scope

The system is a full-stack AI-powered web application that provides:

- Intelligent crop recommendations based on land, soil, weather, and financial data
- Crop suitability evaluation for farmer-selected crops
- Sustainability assessment for soil health
- Profit estimation and financial guidance
- Fertilizer and cultivation recommendations
- User account management with historical data tracking

### 1.3 Intended Audience

| Audience | Purpose |
|----------|---------|
| Development Team | Implementation reference |
| QA/Testing Team | Test case derivation |
| Product Owner | Feature validation |
| UI/UX Designers | Interaction requirements |
| AI/ML Engineers | Model requirements and integration specs |
| DevOps Engineers | Infrastructure and deployment requirements |

### 1.4 Document Conventions

- **FR-XXX** — Functional Requirement identifier
- **NFR-XXX** — Non-Functional Requirement identifier
- **US-XXX** — User Story identifier
- **BR-XXX** — Business Rule identifier
- **[MUST]** — Mandatory requirement
- **[SHOULD]** — Strongly recommended
- **[MAY]** — Optional / nice-to-have

---

## 2. System Goals & Objectives

### 2.1 Primary Goals

| ID | Goal | Description |
|----|------|-------------|
| G-01 | **Data-Driven Farming Guidance** | Provide farmers with AI-powered, scientifically-backed crop recommendations to maximize yield and profitability |
| G-02 | **Sustainable Agriculture** | Promote environmentally sustainable farming practices by evaluating soil health impact and recommending crop rotation |
| G-03 | **Accessibility** | Make advanced agricultural AI accessible to farmers through an intuitive, easy-to-use web interface |
| G-04 | **Financial Optimization** | Help farmers make informed investment decisions through accurate profit estimation |
| G-05 | **Soil Health Preservation** | Encourage long-term soil health through rotation recommendations, sustainability scoring, and fertilizer guidance |

### 2.2 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| AI Recommendation Accuracy | ≥ 80% alignment with expert agronomist advice | Post-season validation surveys |
| User Satisfaction Score | ≥ 4.0 / 5.0 | In-app feedback surveys |
| Data Completeness Rate | ≥ 60% of users provide 5+ input fields | Analytics tracking |
| Platform Uptime | 99.5% | Infrastructure monitoring |
| Average Prediction Response Time | ≤ 5 seconds | APM monitoring |
| Monthly Active Users (6 months post-launch) | ≥ 1,000 | Analytics |
| Return User Rate | ≥ 40% | User tracking |

---

## 3. Stakeholders

| Stakeholder | Role | Interest |
|-------------|------|----------|
| Farmers (End Users) | Primary users who input data and receive recommendations | Accurate, understandable farming guidance |
| Agricultural Extension Officers | Secondary users who may use the platform to advise farmers | Reliable data-driven insights |
| System Administrators | Manage platform, update crop database, monitor health | Stable, maintainable system |
| AI/ML Team | Develop and maintain prediction models | Clean data pipeline, model serving infrastructure |
| Product Owner | Define features and priorities | Business value delivery |
| Development Team | Build and maintain the platform | Clear requirements, testable specs |

---

## 4. Functional Requirements

### 4.1 User Authentication & Account Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-001 | The system **[MUST]** allow users to register with name, email, phone (optional), and password | MUST |
| FR-002 | The system **[MUST]** allow registered users to log in using email and password | MUST |
| FR-003 | The system **[MUST]** issue a JWT token upon successful authentication | MUST |
| FR-004 | The system **[MUST]** protect all data-modifying endpoints with authentication middleware | MUST |
| FR-005 | The system **[MUST]** allow users to view and edit their profile information | MUST |
| FR-006 | The system **[SHOULD]** allow users to reset their password via email | SHOULD |
| FR-007 | The system **[MUST]** securely hash passwords before storage (bcrypt, min 12 salt rounds) | MUST |
| FR-008 | The system **[MUST]** validate email uniqueness during registration | MUST |
| FR-009 | The system **[SHOULD]** display a profile icon on the top-right of the navigation bar | SHOULD |
| FR-010 | The system **[MUST]** persist user sessions using JWT tokens with appropriate expiry | MUST |

### 4.2 Land Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-011 | The system **[MUST]** allow users to add land details including size, unit (acre/cent), and location | MUST |
| FR-012 | The system **[MUST]** store land information associated with the user's account | MUST |
| FR-013 | The system **[SHOULD]** allow users to manage multiple land parcels | SHOULD |
| FR-014 | The system **[SHOULD]** support geolocation-based location detection | SHOULD |
| FR-015 | The system **[MUST]** allow manual location entry as an alternative to geolocation | MUST |
| FR-016 | The system **[MUST]** allow users to update and delete their land records | MUST |

### 4.3 Soil Information Collection

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-017 | The system **[MUST]** enforce that at least one soil input is provided: manual soil condition selection OR soil image upload OR both | MUST |
| FR-018 | The system **[MUST]** provide manual soil condition options: Sandy, Clay, Loamy, Red, Black, Unknown | MUST |
| FR-019 | The system **[MUST]** accept soil image uploads (JPG, PNG formats, max 5MB) | MUST |
| FR-020 | The system **[MUST]** allow users to provide both manual soil condition and soil image simultaneously | MUST |
| FR-021 | The system **[SHOULD]** accept optional soil pH input (numeric, range 0–14) | SHOULD |
| FR-022 | The system **[MUST]** display a clear validation message if no soil input is provided | MUST |
| FR-023 | The system **[MUST]** show a preview of uploaded soil images before form submission | MUST |

### 4.4 Environmental Information Collection

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-024 | The system **[MUST]** collect irrigation availability (Yes/No) | MUST |
| FR-025 | The system **[SHOULD]** optionally collect soil moisture level (Low/Medium/High) | SHOULD |
| FR-026 | The system **[MUST]** automatically fetch weather data based on the user's location | MUST |

### 4.5 Crop History Collection

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-027 | The system **[MUST]** collect previous crop cultivated from the user | MUST |
| FR-028 | The system **[MUST]** collect the season in which the previous crop was cultivated | MUST |
| FR-029 | The system **[MUST]** store crop history records per user per land parcel | MUST |
| FR-030 | The system **[SHOULD]** allow users to view their full crop history timeline | SHOULD |
| FR-031 | The system **[MUST]** use crop history data for crop rotation analysis | MUST |

### 4.6 Financial Information Collection

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-032 | The system **[MUST]** collect the investment amount (₹) for cultivation | MUST |
| FR-033 | The system **[SHOULD]** use a default average investment if the user does not provide one | SHOULD |
| FR-034 | The system **[MUST]** use the investment amount in profit estimation calculations | MUST |

### 4.7 Crop Recommendation (Section 1)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-035 | The system **[MUST]** provide a "Crop Recommendation" section accessible from the main navigation | MUST |
| FR-036 | The system **[MUST]** collect all required inputs via a multi-step form: Land Info → Soil Info → Environment → Crop History → Financial | MUST |
| FR-037 | The system **[MUST]** perform AI-powered analysis using: soil data, weather data, crop history, rotation logic, and financial data | MUST |
| FR-038 | The system **[MUST]** return the top 2–3 recommended crops with suitability percentage scores | MUST |
| FR-039 | The system **[MUST]** display a sustainability score (High/Medium/Low) for each recommended crop with an explanation | MUST |
| FR-040 | The system **[MUST]** display profit estimation for each recommended crop showing: Investment, Expected Revenue, Estimated Profit | MUST |
| FR-041 | The system **[MUST]** provide reasons for each recommendation (e.g., soil suitable, weather favorable, rotation beneficial, market demand) | MUST |
| FR-042 | The system **[MUST]** recommend fertilizers for each crop | MUST |
| FR-043 | The system **[MUST]** provide step-by-step cultivation guidance for each recommended crop | MUST |
| FR-044 | The system **[MUST]** provide crop growth tips for each recommended crop | MUST |
| FR-045 | The system **[MUST]** display a data accuracy disclaimer on the recommendation page | MUST |
| FR-046 | The system **[SHOULD]** allow users to save recommendation results to their profile | SHOULD |
| FR-047 | The system **[SHOULD]** display a step indicator showing progress through the multi-step form | SHOULD |

### 4.8 Crop Suitability Check (Section 2)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-048 | The system **[MUST]** provide a "Crop Suitability Check" section accessible from the main navigation | MUST |
| FR-049 | The system **[MUST]** accept crop name input from the user (searchable dropdown or text input) | MUST |
| FR-050 | The system **[MUST]** collect: crop name, land size, location, soil condition or soil image, previous crop, and irrigation availability | MUST |
| FR-051 | The system **[MUST]** return a suitability percentage score for the selected crop | MUST |
| FR-052 | The system **[MUST]** classify suitability levels: 80–100% (Highly Suitable), 60–79% (Moderately Suitable), Below 60% (Not Recommended) | MUST |
| FR-053 | The system **[MUST]** list soil improvements required if the crop is not fully suitable | MUST |
| FR-054 | The system **[MUST]** provide reasons for the suitability result | MUST |
| FR-055 | The system **[MUST]** provide cultivation advice specific to the crop and conditions | MUST |
| FR-056 | The system **[MUST]** display the data accuracy disclaimer | MUST |
| FR-057 | The system **[SHOULD]** allow users to save suitability results to their profile | SHOULD |
| FR-058 | The system **[MUST]** visually represent suitability using a gauge or progress indicator | MUST |

### 4.9 AI Processing

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-059 | The system **[MUST]** perform soil analysis from manual inputs and/or uploaded soil images | MUST |
| FR-060 | The system **[MUST]** perform weather analysis based on the user's geographical location | MUST |
| FR-061 | The system **[MUST]** run a crop recommendation ML model that considers soil, weather, rotation, and land factors | MUST |
| FR-062 | The system **[MUST]** apply crop rotation logic based on previous crop history | MUST |
| FR-063 | The system **[MUST]** evaluate sustainability of recommended/selected crops for soil health | MUST |
| FR-064 | The system **[MUST]** estimate profit using: Profit = (Expected Yield × Market Price) − Investment Cost | MUST |
| FR-065 | The system **[MUST]** generate fertilizer recommendations based on crop and soil conditions | MUST |
| FR-066 | The system **[MUST]** generate step-by-step cultivation guidance | MUST |
| FR-067 | The system **[MUST]** analyze soil images using a CNN-based image classification model | MUST |
| FR-068 | The system **[SHOULD]** merge soil image analysis results with manual soil input for higher accuracy | SHOULD |
| FR-069 | The system **[MUST]** handle missing optional inputs gracefully by using defaults or reducing confidence | MUST |

### 4.10 Data Accuracy Disclaimer

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-070 | The system **[MUST]** display the following disclaimer on both recommendation and suitability pages: *"Providing more details such as soil condition, soil image, previous crop history, irrigation availability, and investment amount improves the accuracy of AI predictions."* | MUST |
| FR-071 | The system **[SHOULD]** display a "data completeness score" indicating how much input the user provided | SHOULD |

### 4.11 User Profile & History

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-072 | The system **[MUST]** store user profile, land information, previous crop records, and past recommendations | MUST |
| FR-073 | The system **[MUST]** allow users to view their past recommendations and suitability checks | MUST |
| FR-074 | The system **[MUST]** use stored crop history for improved crop rotation analysis | MUST |
| FR-075 | The system **[SHOULD]** display crop history as a visual timeline on the profile page | SHOULD |
| FR-076 | The system **[SHOULD]** allow users to view full reports of past predictions | SHOULD |

### 4.12 User Interface

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-077 | The system **[MUST]** include four main pages: Home, Crop Recommendation, Crop Suitability, User Profile | MUST |
| FR-078 | The system **[MUST]** include a navigation bar with links: Home, Crop Recommendation, Crop Suitability | MUST |
| FR-079 | The system **[MUST]** display a profile icon at the top-right of the navigation bar | MUST |
| FR-080 | The Home Page **[MUST]** include an animated hero section | MUST |
| FR-081 | The Home Page **[MUST]** explain the system features, input types used, and benefits of providing complete data | MUST |
| FR-082 | The system **[MUST]** be fully responsive across mobile, tablet, and desktop viewports | MUST |
| FR-083 | The system **[MUST]** use animated transitions and interactions powered by Framer Motion | MUST |
| FR-084 | The system **[MUST]** show a loading state with visual feedback during AI processing | MUST |

---

## 5. Non-Functional Requirements

### 5.1 Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-001 | Page initial load time (First Contentful Paint) | ≤ 1.5 seconds |
| NFR-002 | API response time for non-AI endpoints | ≤ 200ms (95th percentile) |
| NFR-003 | AI recommendation processing time | ≤ 5 seconds |
| NFR-004 | Soil image upload and analysis time | ≤ 8 seconds |
| NFR-005 | Database query response time | ≤ 50ms |
| NFR-006 | Concurrent user support | ≥ 1,000 simultaneous users |
| NFR-007 | Frontend bundle size (gzipped) | ≤ 500KB initial load |

### 5.2 Reliability & Availability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-008 | System uptime | 99.5% (monthly) |
| NFR-009 | Mean Time To Recovery (MTTR) | ≤ 30 minutes |
| NFR-010 | Data backup frequency | Daily automated backups |
| NFR-011 | Graceful degradation when external APIs fail | Weather: use seasonal defaults; Market: use cached prices |
| NFR-012 | AI model failure handling | Return error message; never crash the application |
| NFR-013 | Database failover | MongoDB Atlas automatic failover |

### 5.3 Security

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-014 | All data in transit encrypted via HTTPS (TLS 1.2+) | MUST |
| NFR-015 | Passwords hashed using bcrypt (min 12 salt rounds) | MUST |
| NFR-016 | JWT tokens signed with strong secret (256-bit minimum) | MUST |
| NFR-017 | Input validation on all API endpoints (prevent injection attacks) | MUST |
| NFR-018 | File upload size restricted to 5MB; only JPG/PNG permitted | MUST |
| NFR-019 | Rate limiting on authentication endpoints (5 requests / 15 min / IP) | MUST |
| NFR-020 | Rate limiting on AI endpoints (10 requests / hour / user) | MUST |
| NFR-021 | Security headers via Helmet.js (XSS, CSP, HSTS, etc.) | MUST |
| NFR-022 | CORS configured to allow only trusted origins | MUST |
| NFR-023 | No sensitive data (passwords, tokens) logged in server logs | MUST |
| NFR-024 | MongoDB connection uses authentication and encrypted transport | MUST |

### 5.4 Scalability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-025 | Backend designed for horizontal scaling (stateless) | MUST |
| NFR-026 | Database supports automatic scaling (MongoDB Atlas) | MUST |
| NFR-027 | AI model serving supports independent scaling | SHOULD |
| NFR-028 | Caching layer (Redis) for frequently accessed data | SHOULD |
| NFR-029 | CDN for static frontend assets | SHOULD |

### 5.5 Usability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-030 | Interface usable by farmers with basic smartphone/computer literacy | MUST |
| NFR-031 | Multi-step forms include clear step indicators and progress display | MUST |
| NFR-032 | All form fields include helpful labels, placeholders, and tooltips | MUST |
| NFR-033 | Error messages are clear, specific, and actionable | MUST |
| NFR-034 | Results displayed in visual, easy-to-understand formats (gauges, cards, tables) | MUST |
| NFR-035 | Mobile-first responsive design | MUST |
| NFR-036 | Color contrast meets WCAG 2.1 AA standards | SHOULD |
| NFR-037 | Keyboard navigation support for all interactive elements | SHOULD |

### 5.6 Maintainability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-038 | Codebase follows consistent coding standards (ESLint, Prettier) | MUST |
| NFR-039 | Frontend components follow atomic design principles (reusable, composable) | MUST |
| NFR-040 | Backend services use clear separation of concerns (routes → controllers → services → models) | MUST |
| NFR-041 | All public API endpoints documented (Swagger/OpenAPI) | SHOULD |
| NFR-042 | Unit test coverage ≥ 70% for business logic services | SHOULD |
| NFR-043 | Integration test coverage for all API endpoints | SHOULD |
| NFR-044 | AI models versioned and traceable to training data | SHOULD |

### 5.7 Data Quality

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-045 | Crop database must contain at least 30 crops with complete growing condition data | MUST |
| NFR-046 | Market price data must be updated at least monthly | SHOULD |
| NFR-047 | Weather data must be fetched from a reliable provider with ≥ 99% API uptime | MUST |
| NFR-048 | Soil image analysis model must achieve ≥ 85% classification accuracy | SHOULD |
| NFR-049 | Crop prediction model must achieve F1-score ≥ 0.85 on test data | SHOULD |

---

## 6. User Stories

### 6.1 Authentication

| ID | User Story | Acceptance Criteria |
|----|------------|-------------------|
| US-001 | As a **new user**, I want to **register an account** so that I can **save my land data and access personalized recommendations** | - Registration form with name, email, password fields<br>- Email uniqueness validation<br>- Password strength indicator<br>- Successful registration redirects to dashboard |
| US-002 | As a **registered user**, I want to **log in** so that I can **access my profile and past data** | - Login with email + password<br>- Error message for invalid credentials<br>- JWT token stored securely<br>- Redirect to home after login |
| US-003 | As a **logged-in user**, I want to **see my profile icon** in the navigation bar so that I can **quickly access my account** | - Profile avatar/icon visible top-right<br>- Dropdown with: Profile, My Lands, History, Logout |

### 6.2 Crop Recommendation

| ID | User Story | Acceptance Criteria |
|----|------------|-------------------|
| US-004 | As a **farmer**, I want to **enter my land details** so that the system can **recommend suitable crops** | - Multi-step form starts with land size and location<br>- Location can be auto-detected or manually entered<br>- Unit selection (acre/cent) |
| US-005 | As a **farmer**, I want to **provide my soil information** so that the AI can **analyze my soil conditions** | - At least one soil input enforced<br>- Radio buttons for soil type selection<br>- Image upload with drag-and-drop<br>- Optional pH input |
| US-006 | As a **farmer**, I want to **upload a photo of my soil** so that the AI can **automatically detect the soil type** | - File picker and drag-and-drop<br>- Image preview before submission<br>- File size/type validation<br>- Processing indicator during analysis |
| US-007 | As a **farmer**, I want to **receive 2–3 crop recommendations** with suitability scores so that I can **choose the best crop** | - Results show top 2-3 crops as visual cards<br>- Each card shows suitability percentage<br>- Interactive circular gauge display |
| US-008 | As a **farmer**, I want to **see the sustainability score** of each recommended crop so that I can **protect my soil health** | - Sustainability level (High/Medium/Low) displayed<br>- Color-coded indicator bar<br>- Clear explanation text |
| US-009 | As a **farmer**, I want to **see the estimated profit** for each crop so that I can **make an informed financial decision** | - Table showing: Investment, Revenue, Profit<br>- Profit margin percentage<br>- Investment defaults if not provided |
| US-010 | As a **farmer**, I want to **understand why a crop was recommended** so that I can **trust the AI's suggestion** | - Bullet list of reasons<br>- Reasons include: soil match, weather match, rotation benefit, market demand |
| US-011 | As a **farmer**, I want to **get fertilizer recommendations** so that I can **properly nourish my crops** | - List of recommended fertilizers<br>- Includes name, type (organic/chemical), dosage |
| US-012 | As a **farmer**, I want to **get step-by-step cultivation guidance** so that I can **follow best practices** | - Numbered step list<br>- Each step has timing information<br>- Clear, actionable language |
| US-013 | As a **farmer**, I want to **see crop growth tips** so that I can **optimize my farming** | - Bulleted list of tips<br>- Specific to soil condition and crop |

### 6.3 Crop Suitability Check

| ID | User Story | Acceptance Criteria |
|----|------------|-------------------|
| US-014 | As a **farmer**, I want to **select a crop I wish to grow** and check its suitability so that I can **validate my farming plan** | - Searchable crop name input<br>- Pre-populated with known crops<br>- Free text entry for unlisted crops |
| US-015 | As a **farmer**, I want to **see the suitability percentage** of my chosen crop so that I know **how viable it is** | - Large, prominent percentage display<br>- Visual gauge component<br>- Color-coded: green (≥80%), yellow (60-79%), red (<60%)<br>- Clear level label |
| US-016 | As a **farmer**, I want to **know what soil improvements are needed** if my chosen crop is not fully suitable | - List of specific improvements<br>- Each includes the issue and recommendation<br>- Actionable guidance |
| US-017 | As a **farmer**, I want to **understand the reasons** behind the suitability score so that I can **plan accordingly** | - Bullet list with check marks (favorable) and warning icons (unfavorable)<br>- Covers: soil, weather, rotation, nutrients |
| US-018 | As a **farmer**, I want to **receive cultivation advice** specific to my chosen crop and conditions | - Personalized advice based on soil type, irrigation, and season<br>- Practical, step-by-step guidance |

### 6.4 Data Management

| ID | User Story | Acceptance Criteria |
|----|------------|-------------------|
| US-019 | As a **farmer**, I want to **save my land details** to my profile so that I **don't have to re-enter them every time** | - Land data persisted to database<br>- Pre-filled in subsequent recommendation forms<br>- Editable from profile page |
| US-020 | As a **farmer**, I want to **view my crop history** so that I can **track my farming pattern** | - Timeline view of past crops<br>- Includes crop name, season, year<br>- Sorted chronologically |
| US-021 | As a **farmer**, I want to **view my past recommendations** so that I can **reference previous AI advice** | - List of past predictions<br>- Each entry shows date, type (recommendation/suitability), summary<br>- "View Full Report" for details |
| US-022 | As a **farmer**, I want the system to **use my crop history** for better rotation analysis so that **recommendations improve over time** | - System queries crop history when generating recommendations<br>- Rotation engine factors in all historical crops |

### 6.5 User Interface

| ID | User Story | Acceptance Criteria |
|----|------------|-------------------|
| US-023 | As a **visitor**, I want to **see an informative home page** that explains what the system does so that I can **understand the value** | - Animated hero section<br>- Feature cards<br>- Data input explanation<br>- Benefits section<br>- Call-to-action buttons |
| US-024 | As a **user**, I want **smooth animations and transitions** throughout the application so that the **experience feels modern** | - Page transitions animated<br>- Form step transitions animated<br>- Results appear with staggered animation<br>- Loading states have skeleton animations |
| US-025 | As a **mobile user**, I want the **application to work perfectly on my phone** so that I can **use it in the field** | - Responsive design at all breakpoints<br>- Touch-friendly inputs<br>- Hamburger navigation on mobile<br>- Images optimized for mobile bandwidth |
| US-026 | As a **user**, I want to **see a disclaimer** about data accuracy so that I **understand the AI's limitations** | - Disclaimer visible on both recommendation and suitability pages<br>- Non-intrusive but clearly visible<br>- Displayed before submission and with results |

---

## 7. Use Cases

### 7.1 Use Case UC-01: Get Crop Recommendation

```
Use Case:       UC-01 — Get Crop Recommendation
Actor:          Registered Farmer
Preconditions:  User is logged in
Trigger:        User navigates to "Crop Recommendation" page

Main Flow:
1. System displays multi-step input form with step indicator
2. User enters land information (size, unit, location)
3. User advances to soil information step
4. System validates at least one soil input is provided
5. User selects manual soil condition and/or uploads soil image
6. User optionally enters soil pH
7. User advances to environmental information step
8. User selects irrigation availability and optionally soil moisture
9. User advances to crop history step
10. User selects previous crop and season
11. User advances to financial step
12. User enters investment amount
13. System displays data accuracy disclaimer
14. User submits the form
15. System displays loading animation ("AI is analyzing your data...")
16. System processes: soil analysis → weather fetch → rotation check → 
    ML prediction → sustainability scoring → profit estimation → 
    fertilizer recommendation → cultivation guide generation
17. System displays recommendation results:
    - Top 2-3 crops with suitability percentages
    - Sustainability scores with explanations
    - Profit estimation table
    - Reasons for recommendation
    - Fertilizer recommendations
    - Cultivation guidance steps
    - Growth tips
18. User reviews results

Alternative Flows:
4a. No soil input provided:
    4a.1 System displays validation error
    4a.2 User must provide at least manual condition OR soil image

14a. User skips optional fields:
    14a.1 System proceeds with available data
    14a.2 Data completeness score reflects missing inputs
    14a.3 Recommendations may have reduced accuracy

16a. Weather API fails:
    16a.1 System uses seasonal defaults for the region
    16a.2 Results include note about estimated weather data

16b. Soil image model fails:
    16b.1 System relies solely on manual soil input
    16b.2 Results include note about soil analysis limitation

Post-conditions:
- Recommendation results displayed to user
- Prediction record saved to database
- Crop history updated
```

### 7.2 Use Case UC-02: Check Crop Suitability

```
Use Case:       UC-02 — Check Crop Suitability
Actor:          Registered Farmer
Preconditions:  User is logged in
Trigger:        User navigates to "Crop Suitability" page

Main Flow:
1. System displays suitability check form
2. User enters/selects the crop name
3. User enters land size and location
4. User provides soil condition and/or soil image
5. User selects previous crop
6. User selects irrigation availability
7. System displays data accuracy disclaimer
8. User submits the form
9. System displays loading animation
10. System processes: soil analysis → weather fetch → rotation check → 
    suitability evaluation
11. System displays results:
    - Suitability percentage with visual gauge
    - Suitability level (Highly Suitable / Moderately Suitable / Not Recommended)
    - Soil improvements required (if any)
    - Reasons for the result
    - Cultivation advice
12. User reviews results

Alternative Flows:
2a. Crop not in database:
    2a.1 System attempts to match closest known crop
    2a.2 If no match, system informs user that crop is not supported

Post-conditions:
- Suitability result displayed
- Prediction record saved to database
```

### 7.3 Use Case UC-03: Register Account

```
Use Case:       UC-03 — Register Account
Actor:          New User (Visitor)
Preconditions:  User is not logged in
Trigger:        User clicks "Register" or "Sign Up"

Main Flow:
1. System displays registration form
2. User enters name, email, and password
3. User optionally enters phone number
4. User submits the form
5. System validates:
   - Email format correct
   - Email not already registered
   - Password meets minimum strength (8+ chars, mixed case, number)
6. System hashes password and creates user record
7. System issues JWT token
8. System redirects user to the home page (logged in)

Alternative Flows:
5a. Email already registered:
    5a.1 System displays error: "An account with this email already exists"
5b. Password too weak:
    5b.1 System displays password strength requirements

Post-conditions:
- User account created in database
- User is authenticated with JWT token
```

### 7.4 Use Case UC-04: View Profile & History

```
Use Case:       UC-04 — View Profile & History
Actor:          Registered Farmer
Preconditions:  User is logged in
Trigger:        User clicks profile icon → "My Profile"

Main Flow:
1. System displays profile page with:
   - Profile header (name, email, membership date)
   - Land details section
   - Crop history timeline
   - Past recommendations list
2. User can edit profile information
3. User can edit/add land details
4. User can view full reports of past predictions
5. User can browse crop history chronologically

Post-conditions:
- Profile data displayed
- No data modified unless user initiates edit
```

---

## 8. Input Validation Rules

### 8.1 Field-Level Validation

| Field | Type | Required | Validation Rules |
|-------|------|----------|-----------------|
| Name | String | Yes | 2–100 characters, alphabetic + spaces |
| Email | String | Yes | Valid email format (RFC 5322), unique in DB |
| Password | String | Yes | Min 8 chars, at least 1 uppercase, 1 lowercase, 1 number |
| Phone | String | No | 10–15 digits, optional country code |
| Land Size | Number | Yes | Positive number, > 0, max 10,000 |
| Land Size Unit | Enum | Yes | "acre" or "cent" |
| Location | String / Object | Yes | Non-empty string or valid coordinates |
| Latitude | Number | Conditional | -90 to 90 |
| Longitude | Number | Conditional | -180 to 180 |
| Soil Condition | Enum | Conditional* | "sandy", "clay", "loamy", "red", "black", "unknown" |
| Soil Image | File | Conditional* | JPG or PNG, max 5MB, min 100×100px |
| Soil pH | Number | No | 0.0 to 14.0 |
| Irrigation Available | Boolean | Yes | true or false |
| Soil Moisture | Enum | No | "low", "medium", "high" |
| Previous Crop | String | Yes | Non-empty, from known crop list or free text |
| Season | Enum | Yes | "kharif", "rabi", "zaid", "summer", "winter" |
| Investment Amount | Number | Yes | Positive number, > 0, currency: INR |
| Crop Name (Suitability) | String | Yes | Non-empty, from known crop list or free text |

\* **Conditional Rule (BR-001):** At least one of Soil Condition or Soil Image must be provided.

### 8.2 Cross-Field Validation

| Rule ID | Rule Description |
|---------|-----------------|
| CV-001 | If soil condition is not provided, soil image must be provided (and vice versa, or both) |
| CV-002 | If soil pH is provided, it must be a valid number between 0 and 14 |
| CV-003 | Location coordinates, if provided, must be valid geographical coordinates |
| CV-004 | Investment amount must be reasonable for the land size (warn if < ₹1,000/acre or > ₹5,00,000/acre) |

---

## 9. Business Rules

| ID | Business Rule | Enforcement |
|----|---------------|-------------|
| BR-001 | At least one soil input (manual condition OR soil image) must be provided for any prediction request | Server-side validation + client-side form validation |
| BR-002 | Suitability levels are classified as: 80–100% (Highly Suitable), 60–79% (Moderately Suitable), Below 60% (Not Recommended) | Suitability service logic |
| BR-003 | Profit is calculated as: Profit = (Expected Yield × Market Price) − Investment Cost | Profit estimation service |
| BR-004 | Sustainability levels are: 80–100 (High), 50–79 (Medium), 0–49 (Low) | Sustainability service |
| BR-005 | Crop rotation penalties apply when the same crop or same-family crop is grown consecutively | Rotation engine logic |
| BR-006 | The system recommends exactly 2–3 crops in the recommendation section (top scoring crops above a minimum threshold) | Recommendation service |
| BR-007 | If fewer than 2 crops meet the minimum threshold, the system recommends available crops with a warning | Recommendation service |
| BR-008 | The data accuracy disclaimer must appear on every prediction form and results page | Frontend component |
| BR-009 | A data completeness score (0-100%) is calculated based on the number of optional inputs provided | All prediction services |
| BR-010 | Soil image analysis results are merged with manual input; if they conflict, the image analysis takes precedence but both are recorded | Soil analysis service |
| BR-011 | Market prices older than 90 days trigger a staleness warning in profit estimations | Profit estimation service |
| BR-012 | Users can only access their own data (lands, history, predictions) | Authorization middleware |

---

## 10. Constraints

### 10.1 Technical Constraints

| ID | Constraint | Rationale |
|----|-----------|-----------|
| TC-001 | Frontend must be built with **React** | Project requirement |
| TC-002 | Backend must be built with **Node.js + Express.js** | Project requirement |
| TC-003 | Database must be **MongoDB** | Project requirement |
| TC-004 | UI styling must use **Tailwind CSS** | Project requirement |
| TC-005 | Animations must use **Framer Motion** | Project requirement |
| TC-006 | AI models must be servable from Node.js (via ONNX Runtime, TensorFlow.js, or a Python microservice) | Integration with Node.js backend |
| TC-007 | Soil image analysis model must run inference within 5 seconds per image | Real-time user experience |
| TC-008 | Maximum uploaded image size: 5MB | Server resource management |
| TC-009 | JWT tokens for authentication (no server-side sessions) | Stateless architecture for scalability |

### 10.2 Business Constraints

| ID | Constraint | Rationale |
|----|-----------|-----------|
| BC-001 | System must support crops grown in India (initial scope) | Target market |
| BC-002 | Currency must default to Indian Rupee (₹ / INR) | Target market |
| BC-003 | Weather data must be available for Indian geographical regions | Target market |
| BC-004 | Market prices should reference Indian agricultural commodity markets | Target market |
| BC-005 | The system does not replace professional agronomist advice (disclaimer required) | Legal and liability |

### 10.3 Resource Constraints

| ID | Constraint | Rationale |
|----|-----------|-----------|
| RC-001 | Development team size: small (1–5 developers) | Project scope |
| RC-002 | Cloud hosting budget must be minimized (use free/low-tier services where possible) | Budget |
| RC-003 | AI model training data may be limited; models must work with available datasets | Data availability |

---

## 11. Assumptions

| ID | Assumption | Impact if False |
|----|-----------|----------------|
| AS-001 | Users have access to a smartphone or computer with a modern web browser | May need to support legacy browsers or offline mode |
| AS-002 | Users can take and upload a photograph of their soil | Soil image feature would be underutilized; manual input becomes primary |
| AS-003 | Internet connectivity is available when using the platform | May need offline capability or PWA support |
| AS-004 | OpenWeatherMap API (or similar) provides adequate weather data for Indian regions | May need alternative weather data sources |
| AS-005 | Sufficient labeled soil image data (10,000+ images) is available for training the CNN model | Model accuracy may be lower; may need data augmentation or transfer learning |
| AS-006 | Sufficient historical crop data (50,000+ records) is available for training the prediction model | Model may need simpler algorithms or synthetic data augmentation |
| AS-007 | Market price data for major crops is accessible via API or government datasets | Profit estimation accuracy would be reduced |
| AS-008 | Users understand basic agricultural terminology (soil types, crop names, seasons) | May need to add educational tooltips or a glossary |
| AS-009 | MongoDB Atlas free/shared tier is sufficient for the initial user base | May need to upgrade to a paid tier sooner |
| AS-010 | The primary language of the interface is English | May need multi-language support for wider adoption |
| AS-011 | Users are willing to create an account to access predictions | May need to offer limited predictions without registration |

---

## 12. Dependencies

### 12.1 External Service Dependencies

| Dependency | Type | Used For | Fallback |
|-----------|------|----------|----------|
| **OpenWeatherMap API** | External API | Real-time weather data by location | Seasonal averages per region (stored locally) |
| **MongoDB Atlas** | Cloud Database | Primary data storage | Self-hosted MongoDB instance |
| **Cloudinary / AWS S3** | Cloud Storage | Soil image storage | Local file storage (development only) |
| **Market Price API** (e.g., data.gov.in or agmarknet) | External API / Dataset | Current crop market prices | Manually curated price database updated monthly |

### 12.2 Software Dependencies

| Dependency | Version (min) | Used For |
|-----------|--------------|----------|
| Node.js | 18.x | Backend runtime |
| React | 18.x | Frontend framework |
| Express.js | 4.x | Backend web framework |
| MongoDB Driver / Mongoose | 7.x / 8.x | Database ORM |
| Tailwind CSS | 3.x | UI styling |
| Framer Motion | 10.x | Animations |
| jsonwebtoken | 9.x | JWT token management |
| bcryptjs | 2.x | Password hashing |
| multer | 1.x | File upload handling |
| joi / zod | latest | Input validation |
| axios | 1.x | HTTP client (API calls) |
| TensorFlow.js / ONNX Runtime | latest | ML model inference |
| Python 3.10+ | 3.10 | ML model training (offline) |
| scikit-learn / XGBoost | latest | Crop prediction model |
| TensorFlow / Keras | 2.x | Soil image model |

### 12.3 Data Dependencies

| Data | Source | Update Frequency |
|------|--------|-----------------|
| Crop growing conditions database | Agricultural research publications, ICAR data | Initial seed + annual review |
| Crop rotation rules | Agricultural extension guidelines | Initial seed + annual review |
| Fertilizer recommendations | Soil science references | Initial seed + as needed |
| Market prices | Government agricultural market data | Monthly |
| Soil image training data | Agricultural datasets, field collection | Pre-training phase |
| Historical crop records | Government agricultural statistics | Pre-training phase |

---

## 13. Acceptance Criteria

### 13.1 System-Level Acceptance Criteria

| ID | Criterion | Verification Method |
|----|-----------|-------------------|
| AC-001 | User can register, log in, and access their profile | Manual testing + automated E2E test |
| AC-002 | Crop recommendation form collects all required inputs across multi-step form | Manual testing |
| AC-003 | At least one soil input validation is enforced on both client and server | Unit test + E2E test |
| AC-004 | System returns 2-3 recommended crops with suitability scores for a valid request | Integration test |
| AC-005 | Each recommended crop includes: sustainability score, profit estimation, reasons, fertilizers, cultivation guide, growth tips | Integration test |
| AC-006 | Crop suitability page correctly evaluates a farmer-selected crop | Integration test |
| AC-007 | Suitability levels are correctly classified (80-100%, 60-79%, <60%) | Unit test |
| AC-008 | Profit estimation uses the formula: Yield × Price − Investment | Unit test |
| AC-009 | Data accuracy disclaimer appears on recommendation and suitability pages | Visual inspection |
| AC-010 | Weather data is fetched based on user's location and factors into the recommendation | Integration test (mock weather API) |
| AC-011 | Soil image upload produces a soil type classification with confidence score | Integration test (test images) |
| AC-012 | Crop rotation engine penalizes unsuitable rotations and rewards beneficial ones | Unit test with known crop pairs |
| AC-013 | User profile stores and displays: land details, crop history, past recommendations | E2E test |
| AC-014 | Application is responsive on mobile (320px), tablet (768px), and desktop (1280px) | Visual testing at breakpoints |
| AC-015 | Home page includes: animated hero, features overview, input explanation, benefits, CTA | Visual inspection |
| AC-016 | All API endpoints return proper error responses for invalid inputs | Integration test |
| AC-017 | System handles external API failures gracefully with fallback behavior | Integration test with mocked failures |
| AC-018 | AI processing completes within 5 seconds for recommendation requests | Performance test |
| AC-019 | Application loads within 1.5 seconds (First Contentful Paint) | Lighthouse audit |
| AC-020 | All user data is isolated — users cannot access other users' data | Security test |

---

## 14. Glossary

| Term | Definition |
|------|-----------|
| **Crop Recommendation** | AI-generated suggestion of 2-3 best crops for a farmer's land based on multiple input factors |
| **Crop Suitability** | AI evaluation of whether a farmer-specified crop is suitable for their land conditions |
| **Suitability Score** | A percentage (0-100%) indicating how well a crop matches the given land, soil, weather, and rotation conditions |
| **Sustainability Score** | A rating (High/Medium/Low) indicating how sustainable a crop is for long-term soil health |
| **Crop Rotation** | The agricultural practice of growing different crops in succession on the same land to maintain soil health |
| **Soil Condition** | The type of soil present on the land (sandy, clay, loamy, red, black, or unknown) |
| **Soil pH** | A measure of soil acidity/alkalinity on a scale of 0-14 (7 is neutral) |
| **Kharif Season** | Monsoon crop season in India (June–October) |
| **Rabi Season** | Winter crop season in India (October–March) |
| **Zaid Season** | Short summer crop season in India (March–June) |
| **Quintal** | A unit of weight equal to 100 kilograms |
| **CNN** | Convolutional Neural Network — a deep learning architecture used for image classification |
| **JWT** | JSON Web Token — a compact token format used for secure API authentication |
| **ONNX** | Open Neural Network Exchange — a cross-platform format for ML model interoperability |
| **Profit Estimation** | Calculated as: (Expected Yield × Market Price) − Investment Cost |
| **Data Completeness Score** | A percentage indicating how many optional input fields the user provided, affecting prediction accuracy |
| **ICAR** | Indian Council of Agricultural Research |
| **Agmarknet** | Agricultural Marketing Information Network (Government of India) |

---

*End of Requirements Document*
