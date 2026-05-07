# Implementation Guide — AI-Powered Sustainable Crop Recommendation and Suitability System

> **Version:** 1.0  
> **Date:** March 8, 2026  
> **Status:** Implementation Specification

---

## Table of Contents

1. [Technology Stack](#1-technology-stack)
2. [Development Environment Setup](#2-development-environment-setup)
3. [Project Folder Structure](#3-project-folder-structure)
4. [Frontend Implementation](#4-frontend-implementation)
5. [Backend Implementation](#5-backend-implementation)
6. [Database Implementation](#6-database-implementation)
7. [AI Model Integration](#7-ai-model-integration)
8. [API Design](#8-api-design)
9. [Authentication & Authorization](#9-authentication--authorization)
10. [Third-Party Service Integration](#10-third-party-service-integration)
11. [Testing Strategy](#11-testing-strategy)
12. [Deployment Considerations](#12-deployment-considerations)
13. [CI/CD Pipeline](#13-cicd-pipeline)
14. [Monitoring & Logging](#14-monitoring--logging)
15. [Security Implementation](#15-security-implementation)

---

## 1. Technology Stack

### 1.1 Frontend

| Layer            | Technology                | Version   | Purpose                                |
|------------------|---------------------------|-----------|----------------------------------------|
| UI Framework     | React                     | 18.x      | Component-based SPA framework          |
| Build Tool       | Vite                      | 5.x       | Fast bundling and HMR                  |
| CSS Framework    | Tailwind CSS              | 3.x       | Utility-first responsive styling       |
| Animations       | Framer Motion             | 11.x      | Page transitions and micro-animations  |
| State Management | React Context + useReducer| —         | Global app state                       |
| HTTP Client      | Axios                     | 1.x       | API communication                      |
| Routing          | React Router              | 6.x       | Client-side navigation                 |
| Form Handling    | React Hook Form           | 7.x       | Performant form validation             |
| Charts           | Recharts                  | 2.x       | Data visualization for profit/suitability |
| Notifications    | React Hot Toast            | 2.x       | User feedback toasts                   |
| Icons            | Lucide React              | 0.x       | Consistent icon set                    |

### 1.2 Backend

| Layer            | Technology       | Version | Purpose                                  |
|------------------|------------------|---------|------------------------------------------|
| Runtime          | Node.js          | 20 LTS  | Server-side JavaScript runtime           |
| Framework        | Express.js       | 4.x     | REST API framework                       |
| Validation       | Joi / Zod        | 3.x     | Request payload validation               |
| Auth             | JSON Web Tokens  | 9.x     | Stateless authentication                 |
| Password Hashing | bcrypt           | 5.x     | Secure credential storage                |
| File Upload      | Multer           | 1.x     | Soil image upload handling               |
| Rate Limiting    | express-rate-limit| 7.x   | API abuse prevention                     |
| CORS             | cors             | 2.x     | Cross-origin request handling            |
| Logging          | Winston          | 3.x     | Structured application logging           |
| Env Config       | dotenv           | 16.x    | Environment variable management          |

### 1.3 Database

| Component   | Technology | Version | Purpose                        |
|-------------|------------|---------|--------------------------------|
| Database    | MongoDB    | 7.x     | Document store for all data    |
| ODM         | Mongoose   | 8.x     | Schema modeling and validation |
| Caching     | Redis      | 7.x     | Session & weather data cache   |

### 1.4 AI / Machine Learning

| Component               | Technology           | Purpose                            |
|--------------------------|----------------------|------------------------------------|
| ML Framework             | Python / scikit-learn| Crop recommendation model          |
| Deep Learning            | TensorFlow / Keras   | Soil image classification          |
| Model Serving            | Flask or FastAPI      | Python microservice for inference  |
| Image Processing         | OpenCV / Pillow      | Soil image pre-processing          |
| Weather API              | OpenWeatherMap API   | Real-time weather data             |
| Geolocation              | Google Geocoding API | Lat/Lng from location name         |

### 1.5 DevOps & Infrastructure

| Component        | Technology       | Purpose                         |
|------------------|------------------|---------------------------------|
| Containerization | Docker           | Consistent environments         |
| Orchestration    | Docker Compose   | Multi-service local development |
| CI/CD            | GitHub Actions   | Automated testing & deployment  |
| Cloud Hosting    | AWS / DigitalOcean| Production hosting             |
| Reverse Proxy    | Nginx            | Load balancing & SSL termination|
| SSL              | Let's Encrypt    | HTTPS certificates              |

---

## 2. Development Environment Setup

### 2.1 Prerequisites

```
Node.js        >= 20.x LTS
npm             >= 10.x
Python          >= 3.10
MongoDB         >= 7.0
Redis           >= 7.0
Docker          >= 24.x  (optional, recommended)
Git             >= 2.40
```

### 2.2 Initial Setup Commands

```bash
# 1. Clone the repository
git clone https://github.com/<org>/crop-recommendation-system.git
cd crop-recommendation-system

# 2. Install frontend dependencies
cd client
npm install

# 3. Install backend dependencies
cd ../server
npm install

# 4. Set up Python AI service
cd ../ai-service
python -m venv venv
source venv/bin/activate        # Linux/Mac
# venv\Scripts\activate         # Windows
pip install -r requirements.txt

# 5. Configure environment variables
cp .env.example .env
# Edit .env with your keys (MongoDB URI, API keys, JWT secret, etc.)

# 6. Start all services (Docker Compose)
cd ..
docker-compose up --build
```

### 2.3 Environment Variables

```env
# ── Server ──
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/crop_recommendation
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379

# ── AI Service ──
AI_SERVICE_URL=http://localhost:8000
AI_SERVICE_API_KEY=internal_service_key

# ── External APIs ──
OPENWEATHER_API_KEY=your_openweather_api_key
GOOGLE_GEOCODING_API_KEY=your_google_api_key

# ── File Upload ──
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads/soil-images

# ── Client ──
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 3. Project Folder Structure

```
crop-recommendation-system/
│
├── client/                          # React Frontend
│   ├── public/
│   │   ├── favicon.ico
│   │   └── assets/
│   │       └── images/              # Static images (hero, icons)
│   ├── src/
│   │   ├── main.jsx                 # App entry point
│   │   ├── App.jsx                  # Root component with router
│   │   ├── index.css                # Tailwind directives
│   │   │
│   │   ├── components/              # Reusable UI components
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Select.jsx
│   │   │   │   ├── FileUpload.jsx
│   │   │   │   ├── Disclaimer.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   │
│   │   │   ├── home/
│   │   │   │   ├── HeroSection.jsx
│   │   │   │   ├── FeaturesSection.jsx
│   │   │   │   ├── HowItWorksSection.jsx
│   │   │   │   └── BenefitsSection.jsx
│   │   │   │
│   │   │   ├── recommendation/
│   │   │   │   ├── LandInfoForm.jsx
│   │   │   │   ├── SoilInfoForm.jsx
│   │   │   │   ├── EnvironmentForm.jsx
│   │   │   │   ├── CropHistoryForm.jsx
│   │   │   │   ├── FinancialForm.jsx
│   │   │   │   ├── RecommendationResults.jsx
│   │   │   │   ├── CropCard.jsx
│   │   │   │   ├── SustainabilityBadge.jsx
│   │   │   │   ├── ProfitChart.jsx
│   │   │   │   ├── FertilizerList.jsx
│   │   │   │   ├── CultivationGuide.jsx
│   │   │   │   └── GrowthTips.jsx
│   │   │   │
│   │   │   ├── suitability/
│   │   │   │   ├── SuitabilityForm.jsx
│   │   │   │   ├── SuitabilityResults.jsx
│   │   │   │   ├── SuitabilityGauge.jsx
│   │   │   │   ├── SoilImprovements.jsx
│   │   │   │   └── CultivationAdvice.jsx
│   │   │   │
│   │   │   ├── profile/
│   │   │   │   ├── ProfileHeader.jsx
│   │   │   │   ├── LandDetails.jsx
│   │   │   │   ├── CropHistory.jsx
│   │   │   │   └── PastRecommendations.jsx
│   │   │   │
│   │   │   └── auth/
│   │   │       ├── LoginForm.jsx
│   │   │       └── RegisterForm.jsx
│   │   │
│   │   ├── pages/                   # Route-level page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── CropRecommendationPage.jsx
│   │   │   ├── CropSuitabilityPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   │
│   │   ├── context/                 # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── AppContext.jsx
│   │   │
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useApi.js
│   │   │   ├── useForm.js
│   │   │   └── useWeather.js
│   │   │
│   │   ├── services/                # API service modules
│   │   │   ├── api.js               # Axios instance with interceptors
│   │   │   ├── authService.js
│   │   │   ├── recommendationService.js
│   │   │   ├── suitabilityService.js
│   │   │   ├── profileService.js
│   │   │   └── weatherService.js
│   │   │
│   │   ├── utils/                   # Utility functions
│   │   │   ├── constants.js
│   │   │   ├── validators.js
│   │   │   ├── formatters.js
│   │   │   └── helpers.js
│   │   │
│   │   └── styles/                  # Additional style files
│   │       └── animations.css
│   │
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   ├── package.json
│   └── .env
│
├── server/                          # Node.js Backend
│   ├── src/
│   │   ├── index.js                 # Server entry point
│   │   ├── app.js                   # Express app configuration
│   │   │
│   │   ├── config/
│   │   │   ├── db.js                # MongoDB connection
│   │   │   ├── redis.js             # Redis connection
│   │   │   ├── env.js               # Environment config loader
│   │   │   └── multer.js            # File upload config
│   │   │
│   │   ├── models/                  # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Land.js
│   │   │   ├── CropHistory.js
│   │   │   ├── Recommendation.js
│   │   │   ├── SuitabilityCheck.js
│   │   │   └── WeatherCache.js
│   │   │
│   │   ├── routes/                  # Express route definitions
│   │   │   ├── authRoutes.js
│   │   │   ├── recommendationRoutes.js
│   │   │   ├── suitabilityRoutes.js
│   │   │   ├── profileRoutes.js
│   │   │   ├── landRoutes.js
│   │   │   └── weatherRoutes.js
│   │   │
│   │   ├── controllers/             # Route handler logic
│   │   │   ├── authController.js
│   │   │   ├── recommendationController.js
│   │   │   ├── suitabilityController.js
│   │   │   ├── profileController.js
│   │   │   ├── landController.js
│   │   │   └── weatherController.js
│   │   │
│   │   ├── services/                # Business logic layer
│   │   │   ├── aiService.js         # Communication with AI microservice
│   │   │   ├── weatherService.js    # OpenWeatherMap integration
│   │   │   ├── profitService.js     # Profit estimation calculations
│   │   │   ├── cropRotationService.js
│   │   │   └── imageUploadService.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js    # JWT verification
│   │   │   ├── errorHandler.js      # Global error handler
│   │   │   ├── rateLimiter.js       # Request rate limiting
│   │   │   ├── validator.js         # Request validation middleware
│   │   │   └── upload.js            # Multer middleware
│   │   │
│   │   └── utils/
│   │       ├── logger.js            # Winston logger setup
│   │       ├── apiResponse.js       # Standardized response helper
│   │       ├── constants.js
│   │       └── helpers.js
│   │
│   ├── uploads/                     # Uploaded soil images
│   │   └── soil-images/
│   ├── package.json
│   ├── .env
│   └── .env.example
│
├── ai-service/                      # Python AI Microservice
│   ├── app/
│   │   ├── main.py                  # FastAPI entry point
│   │   ├── config.py                # Configuration
│   │   │
│   │   ├── models/                  # ML model definitions
│   │   │   ├── crop_recommendation_model.py
│   │   │   ├── soil_classifier_model.py
│   │   │   └── sustainability_model.py
│   │   │
│   │   ├── routes/                  # API endpoints
│   │   │   ├── recommendation.py
│   │   │   ├── suitability.py
│   │   │   └── soil_analysis.py
│   │   │
│   │   ├── services/                # Core AI logic
│   │   │   ├── crop_predictor.py
│   │   │   ├── soil_analyzer.py
│   │   │   ├── sustainability_evaluator.py
│   │   │   ├── fertilizer_recommender.py
│   │   │   └── cultivation_guide_generator.py
│   │   │
│   │   ├── preprocessing/          # Data preprocessing
│   │   │   ├── soil_image_processor.py
│   │   │   ├── feature_encoder.py
│   │   │   └── data_normalizer.py
│   │   │
│   │   └── utils/
│   │       ├── crop_database.py     # Crop knowledge base
│   │       ├── fertilizer_rules.py  # Rule-based fertilizer mapping
│   │       └── constants.py
│   │
│   ├── trained_models/              # Serialized ML models
│   │   ├── crop_recommender.pkl
│   │   ├── soil_classifier.h5
│   │   └── scaler.pkl
│   │
│   ├── training/                    # Model training scripts
│   │   ├── train_crop_model.py
│   │   ├── train_soil_classifier.py
│   │   ├── data/                    # Training datasets
│   │   │   ├── crop_data.csv
│   │   │   └── soil_images/
│   │   └── notebooks/              # Jupyter notebooks for EDA
│   │       ├── data_exploration.ipynb
│   │       └── model_evaluation.ipynb
│   │
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env
│
├── docker-compose.yml               # Multi-service orchestration
├── .gitignore
├── README.md
├── design.md
├── requirements.md
└── implementation.md
```

---

## 4. Frontend Implementation

### 4.1 Application Entry Point

**`client/src/main.jsx`**

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

### 4.2 Root Component & Routing

**`client/src/App.jsx`**

```jsx
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import CropRecommendationPage from './pages/CropRecommendationPage';
import CropSuitabilityPage from './pages/CropSuitabilityPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/recommend" element={
              <ProtectedRoute><CropRecommendationPage /></ProtectedRoute>
            } />
            <Route path="/suitability" element={
              <ProtectedRoute><CropSuitabilityPage /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;
```

### 4.3 Tailwind CSS Configuration

**`client/tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:   { 50: '#f0fdf4', 100: '#dcfce7', 500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d' },
        secondary: { 50: '#fefce8', 100: '#fef9c3', 500: '#eab308', 600: '#ca8a04', 700: '#a16207' },
        earth:     { 100: '#f5f0eb', 200: '#e8ddd3', 500: '#8B6914', 600: '#6B4F12' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(20px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
```

### 4.4 Navbar Component

**`client/src/components/common/Navbar.jsx`**

```jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Sprout, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const navLinks = [
  { path: '/',            label: 'Home' },
  { path: '/recommend',   label: 'Crop Recommendation' },
  { path: '/suitability', label: 'Crop Suitability' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-primary-700 font-display font-bold text-xl">
            <Sprout className="w-7 h-7" />
            CropAI
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-primary-600 border-b-2 border-primary-500 pb-1'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Profile / Auth */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to="/profile" className="p-2 rounded-full bg-primary-50 hover:bg-primary-100 transition">
                  <User className="w-5 h-5 text-primary-700" />
                </Link>
                <button onClick={logout} className="text-sm text-gray-500 hover:text-red-500 transition">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-white border-t"
        >
          <div className="px-4 py-3 space-y-2">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} className="block py-2 text-gray-700"
                    onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
```

### 4.5 Home Page — Hero Section

**`client/src/components/home/HeroSection.jsx`**

```jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Leaf } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10"
           style={{ backgroundImage: 'url("/assets/images/pattern.svg")' }} />

      <div className="max-w-7xl mx-auto px-4 py-24 sm:py-32 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight">
              AI-Powered <br />
              <span className="text-yellow-300">Sustainable</span> Farming
            </h1>
            <p className="mt-6 text-lg text-green-100 max-w-lg">
              Get data-driven crop recommendations based on your soil, weather,
              location, and crop history. Maximize profit while preserving soil health.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/recommend"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-green-900 rounded-xl font-semibold hover:bg-yellow-300 transition">
                Get Recommendations <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/suitability"
                    className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/40 rounded-xl font-semibold hover:bg-white/10 transition">
                Check Suitability
              </Link>
            </div>
          </motion.div>

          {/* Animated Illustration Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden md:grid grid-cols-2 gap-4"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-3">
              <Leaf className="w-10 h-10 text-yellow-300" />
              <h3 className="font-semibold text-lg">Soil Analysis</h3>
              <p className="text-sm text-green-100">Upload soil images or enter soil type for AI analysis.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-3 mt-8">
              <BarChart3 className="w-10 h-10 text-yellow-300" />
              <h3 className="font-semibold text-lg">Profit Estimation</h3>
              <p className="text-sm text-green-100">Know your expected profit before you plant.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

### 4.6 Crop Recommendation Page (Multi-Step Form)

**`client/src/pages/CropRecommendationPage.jsx`** — Structure

```jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LandInfoForm from '../components/recommendation/LandInfoForm';
import SoilInfoForm from '../components/recommendation/SoilInfoForm';
import EnvironmentForm from '../components/recommendation/EnvironmentForm';
import CropHistoryForm from '../components/recommendation/CropHistoryForm';
import FinancialForm from '../components/recommendation/FinancialForm';
import RecommendationResults from '../components/recommendation/RecommendationResults';
import Disclaimer from '../components/common/Disclaimer';
import { getRecommendation } from '../services/recommendationService';

const STEPS = ['Land Info', 'Soil', 'Environment', 'Crop History', 'Investment'];

export default function CropRecommendationPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateFormData = (section, data) => {
    setFormData(prev => ({ ...prev, [section]: data }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await getRecommendation(formData);
      setResults(response.data);
    } catch (err) {
      // error handled by toast in service layer
    } finally {
      setLoading(false);
    }
  };

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  if (results) return <RecommendationResults data={results} onReset={() => { setResults(null); setStep(0); setFormData({}); }} />;

  const stepForms = [
    <LandInfoForm data={formData.land} onSave={d => updateFormData('land', d)} onNext={next} />,
    <SoilInfoForm data={formData.soil} onSave={d => updateFormData('soil', d)} onNext={next} onPrev={prev} />,
    <EnvironmentForm data={formData.environment} onSave={d => updateFormData('environment', d)} onNext={next} onPrev={prev} />,
    <CropHistoryForm data={formData.cropHistory} onSave={d => updateFormData('cropHistory', d)} onNext={next} onPrev={prev} />,
    <FinancialForm data={formData.financial} onSave={d => updateFormData('financial', d)} onSubmit={handleSubmit} onPrev={prev} loading={loading} />,
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-display font-bold text-primary-800 text-center mb-2">
        Crop Recommendation
      </h1>
      <p className="text-center text-gray-500 mb-8">
        Tell us about your land and we'll recommend the best crops for you.
      </p>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              i <= step ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-8 h-0.5 ${i < step ? 'bg-primary-500' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <Disclaimer />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
          {stepForms[step]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
```

### 4.7 Soil Info Form Component (with validation rule)

**`client/src/components/recommendation/SoilInfoForm.jsx`**

```jsx
import { useState } from 'react';
import FileUpload from '../common/FileUpload';
import Select from '../common/Select';
import Input from '../common/Input';
import toast from 'react-hot-toast';

const SOIL_TYPES = [
  { value: 'sandy',   label: 'Sandy Soil' },
  { value: 'clay',    label: 'Clay Soil' },
  { value: 'loamy',   label: 'Loamy Soil' },
  { value: 'red',     label: 'Red Soil' },
  { value: 'black',   label: 'Black Soil' },
  { value: 'unknown', label: 'Unknown' },
];

export default function SoilInfoForm({ data, onSave, onNext, onPrev }) {
  const [soilType, setSoilType] = useState(data?.soilType || '');
  const [soilImage, setSoilImage] = useState(data?.soilImage || null);
  const [soilPH, setSoilPH] = useState(data?.soilPH || '');

  const handleNext = () => {
    // Enforce: at least one soil input must be provided
    if (!soilType && !soilImage) {
      toast.error('Please provide at least one soil input: select soil type or upload a soil image.');
      return;
    }
    onSave({ soilType, soilImage, soilPH: soilPH ? parseFloat(soilPH) : null });
    onNext();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Soil Information</h2>
      <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
        ⚠ At least one soil input is required — select a soil type, upload a soil image, or both.
      </p>

      <Select label="Soil Condition" options={SOIL_TYPES} value={soilType}
              onChange={e => setSoilType(e.target.value)} placeholder="Select soil type" />

      <FileUpload label="Upload Soil Image (optional)" accept="image/*"
                  file={soilImage} onChange={setSoilImage} />

      <Input label="Soil pH (optional)" type="number" min={0} max={14} step={0.1}
             value={soilPH} onChange={e => setSoilPH(e.target.value)}
             placeholder="e.g. 6.5" />

      <div className="flex justify-between pt-4">
        <button onClick={onPrev}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition">
          Back
        </button>
        <button onClick={handleNext}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition">
          Next
        </button>
      </div>
    </div>
  );
}
```

### 4.8 Recommendation Results Component

**`client/src/components/recommendation/RecommendationResults.jsx`**

```jsx
import { motion } from 'framer-motion';
import CropCard from './CropCard';
import SustainabilityBadge from './SustainabilityBadge';
import ProfitChart from './ProfitChart';
import FertilizerList from './FertilizerList';
import CultivationGuide from './CultivationGuide';
import GrowthTips from './GrowthTips';

export default function RecommendationResults({ data, onReset }) {
  const { crops, sustainability, profit, reasons, fertilizers, cultivationSteps, growthTips } = data;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-display font-bold text-primary-800 text-center mb-2">
          Your Crop Recommendations
        </h1>
        <p className="text-center text-gray-500 mb-10">
          Based on your land data, soil analysis, weather, and crop history.
        </p>
      </motion.div>

      {/* Top Recommended Crops */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommended Crops</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {crops.map((crop, i) => (
            <CropCard key={crop.name} crop={crop} rank={i + 1} />
          ))}
        </div>
      </section>

      {/* Sustainability */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Sustainability Score</h2>
        <SustainabilityBadge level={sustainability.level} explanation={sustainability.explanation} />
      </section>

      {/* Profit Estimation */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Profit Estimation</h2>
        <ProfitChart investment={profit.investment} revenue={profit.revenue} profit={profit.net} />
      </section>

      {/* Reasons */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Why These Crops?</h2>
        <ul className="space-y-2">
          {reasons.map((r, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-700">
              <span className="mt-1 w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
              {r}
            </li>
          ))}
        </ul>
      </section>

      {/* Fertilizers */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommended Fertilizers</h2>
        <FertilizerList fertilizers={fertilizers} />
      </section>

      {/* Cultivation Guidance */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Cultivation Guidance</h2>
        <CultivationGuide steps={cultivationSteps} />
      </section>

      {/* Growth Tips */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Crop Growth Tips</h2>
        <GrowthTips tips={growthTips} />
      </section>

      {/* Reset */}
      <div className="text-center pt-6">
        <button onClick={onReset}
                className="px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition">
          Start New Recommendation
        </button>
      </div>
    </div>
  );
}
```

### 4.9 Suitability Page

**`client/src/pages/CropSuitabilityPage.jsx`** — Structure

```jsx
import { useState } from 'react';
import SuitabilityForm from '../components/suitability/SuitabilityForm';
import SuitabilityResults from '../components/suitability/SuitabilityResults';
import Disclaimer from '../components/common/Disclaimer';
import { checkSuitability } from '../services/suitabilityService';

export default function CropSuitabilityPage() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await checkSuitability(formData);
      setResults(response.data);
    } catch (err) {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  if (results) return <SuitabilityResults data={results} onReset={() => setResults(null)} />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-display font-bold text-primary-800 text-center mb-2">
        Crop Suitability Check
      </h1>
      <p className="text-center text-gray-500 mb-8">
        Check if a specific crop is suitable for your land conditions.
      </p>
      <Disclaimer />
      <SuitabilityForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
```

### 4.10 Suitability Results Component

**`client/src/components/suitability/SuitabilityResults.jsx`**

```jsx
import SuitabilityGauge from './SuitabilityGauge';
import SoilImprovements from './SoilImprovements';
import CultivationAdvice from './CultivationAdvice';

export default function SuitabilityResults({ data, onReset }) {
  const { suitabilityPercent, level, reasons, soilImprovements, cultivationAdvice } = data;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
      <h1 className="text-3xl font-display font-bold text-primary-800 text-center">
        Suitability Report
      </h1>

      {/* Gauge */}
      <SuitabilityGauge percent={suitabilityPercent} level={level} />

      {/* Reasons */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Reason for Result</h2>
        <ul className="space-y-2">
          {reasons.map((r, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-700">
              <span className="mt-1 w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
              {r}
            </li>
          ))}
        </ul>
      </section>

      {/* Soil Improvements */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Soil Improvements Required</h2>
        <SoilImprovements items={soilImprovements} />
      </section>

      {/* Cultivation Advice */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Cultivation Advice</h2>
        <CultivationAdvice items={cultivationAdvice} />
      </section>

      <div className="text-center pt-6">
        <button onClick={onReset}
                className="px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition">
          Check Another Crop
        </button>
      </div>
    </div>
  );
}
```

### 4.11 API Service Layer

**`client/src/services/api.js`**

```js
import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error handler
api.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message || 'Something went wrong';
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    toast.error(message);
    return Promise.reject(error);
  }
);

export default api;
```

**`client/src/services/recommendationService.js`**

```js
import api from './api';

export const getRecommendation = (formData) => {
  const payload = new FormData();
  // Flatten nested form data
  const { land, soil, environment, cropHistory, financial } = formData;

  payload.append('landSize', land.size);
  payload.append('landUnit', land.unit);
  payload.append('location', land.location);
  payload.append('soilType', soil.soilType || '');
  if (soil.soilImage) payload.append('soilImage', soil.soilImage);
  if (soil.soilPH) payload.append('soilPH', soil.soilPH);
  payload.append('irrigationAvailable', environment.irrigationAvailable);
  if (environment.soilMoisture) payload.append('soilMoisture', environment.soilMoisture);
  payload.append('previousCrop', cropHistory.previousCrop);
  payload.append('season', cropHistory.season);
  payload.append('investmentAmount', financial.investmentAmount);

  return api.post('/recommendations', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
```

**`client/src/services/suitabilityService.js`**

```js
import api from './api';

export const checkSuitability = (formData) => {
  const payload = new FormData();
  payload.append('cropName', formData.cropName);
  payload.append('landSize', formData.landSize);
  payload.append('landUnit', formData.landUnit);
  payload.append('location', formData.location);
  payload.append('soilType', formData.soilType || '');
  if (formData.soilImage) payload.append('soilImage', formData.soilImage);
  payload.append('previousCrop', formData.previousCrop);
  payload.append('irrigationAvailable', formData.irrigationAvailable);

  return api.post('/suitability', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
```

### 4.12 Auth Context

**`client/src/context/AuthContext.jsx`**

```jsx
import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then(res => setUser(res.data.user))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

---

## 5. Backend Implementation

### 5.1 Server Entry Point

**`server/src/index.js`**

```js
const app = require('./app');
const connectDB = require('./config/db');
const { PORT } = require('./config/env');
const logger = require('./utils/logger');

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

start().catch(err => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
```

### 5.2 Express Application

**`server/src/app.js`**

```js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

// Route imports
const authRoutes = require('./routes/authRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const suitabilityRoutes = require('./routes/suitabilityRoutes');
const profileRoutes = require('./routes/profileRoutes');
const landRoutes = require('./routes/landRoutes');
const weatherRoutes = require('./routes/weatherRoutes');

const app = express();

// ── Global Middleware ──
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(rateLimiter);

// Static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── API Routes ──
app.use('/api/auth',            authRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/suitability',     suitabilityRoutes);
app.use('/api/profile',         profileRoutes);
app.use('/api/lands',           landRoutes);
app.use('/api/weather',         weatherRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ── Error Handler ──
app.use(errorHandler);

module.exports = app;
```

### 5.3 Database Connection

**`server/src/config/db.js`**

```js
const mongoose = require('mongoose');
const logger = require('../utils/logger');
const { MONGO_URI } = require('./env');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### 5.4 Mongoose Models

#### User Model — `server/src/models/User.js`

```js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true, maxlength: 100 },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  phone:    { type: String, trim: true },
  location: { type: String, trim: true },
  avatar:   { type: String, default: null },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
```

#### Land Model — `server/src/models/Land.js`

```js
const mongoose = require('mongoose');

const landSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name:      { type: String, default: 'My Land' },
  size:      { type: Number, required: true },
  unit:      { type: String, enum: ['acre', 'cent'], required: true },
  location:  { type: String, required: true },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number },
  },
  soilType:  { type: String, enum: ['sandy', 'clay', 'loamy', 'red', 'black', 'unknown', ''], default: '' },
  soilPH:    { type: Number, min: 0, max: 14 },
  irrigationAvailable: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Land', landSchema);
```

#### Crop History Model — `server/src/models/CropHistory.js`

```js
const mongoose = require('mongoose');

const cropHistorySchema = new mongoose.Schema({
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  land:         { type: mongoose.Schema.Types.ObjectId, ref: 'Land' },
  cropName:     { type: String, required: true },
  season:       { type: String, required: true },
  year:         { type: Number },
  yieldAmount:  { type: Number },
  yieldUnit:    { type: String },
  notes:        { type: String },
}, { timestamps: true });

module.exports = mongoose.model('CropHistory', cropHistorySchema);
```

#### Recommendation Model — `server/src/models/Recommendation.js`

```js
const mongoose = require('mongoose');

const cropResultSchema = new mongoose.Schema({
  name:                { type: String, required: true },
  suitabilityPercent:  { type: Number, required: true },
  sustainabilityLevel: { type: String, enum: ['High', 'Medium', 'Low'] },
  sustainabilityNote:  { type: String },
}, { _id: false });

const profitSchema = new mongoose.Schema({
  investment: { type: Number },
  revenue:    { type: Number },
  net:        { type: Number },
}, { _id: false });

const recommendationSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  land:    { type: mongoose.Schema.Types.ObjectId, ref: 'Land' },

  // Inputs snapshot
  inputs: {
    landSize:        Number,
    landUnit:        String,
    location:        String,
    soilType:        String,
    soilImagePath:   String,
    soilPH:          Number,
    irrigationAvailable: Boolean,
    soilMoisture:    String,
    previousCrop:    String,
    season:          String,
    investmentAmount:Number,
  },

  // AI outputs
  crops:            [cropResultSchema],
  sustainability:   {
    level:       { type: String, enum: ['High', 'Medium', 'Low'] },
    explanation: String,
  },
  profit:           profitSchema,
  reasons:          [String],
  fertilizers:      [String],
  cultivationSteps: [String],
  growthTips:       [String],

  // Metadata
  weatherSnapshot: { type: mongoose.Schema.Types.Mixed },
  modelVersion:    { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Recommendation', recommendationSchema);
```

#### Suitability Check Model — `server/src/models/SuitabilityCheck.js`

```js
const mongoose = require('mongoose');

const suitabilityCheckSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

  inputs: {
    cropName:    String,
    landSize:    Number,
    landUnit:    String,
    location:    String,
    soilType:    String,
    soilImagePath: String,
    previousCrop: String,
    irrigationAvailable: Boolean,
  },

  suitabilityPercent: { type: Number, required: true },
  level:              { type: String, enum: ['Highly suitable', 'Moderately suitable', 'Not recommended'] },
  reasons:            [String],
  soilImprovements:   [String],
  cultivationAdvice:  [String],

  weatherSnapshot: { type: mongoose.Schema.Types.Mixed },
  modelVersion:    { type: String },
}, { timestamps: true });

module.exports = mongoose.model('SuitabilityCheck', suitabilityCheckSchema);
```

### 5.5 Route Definitions

#### Auth Routes — `server/src/routes/authRoutes.js`

```js
const router = require('express').Router();
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login',    login);
router.get('/me',        auth, getMe);
router.put('/me',        auth, updateProfile);

module.exports = router;
```

#### Recommendation Routes — `server/src/routes/recommendationRoutes.js`

```js
const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const { createRecommendation, getHistory, getById } = require('../controllers/recommendationController');

router.post('/',     auth, upload.single('soilImage'), createRecommendation);
router.get('/',      auth, getHistory);
router.get('/:id',   auth, getById);

module.exports = router;
```

#### Suitability Routes — `server/src/routes/suitabilityRoutes.js`

```js
const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const { checkSuitability, getHistory, getById } = require('../controllers/suitabilityController');

router.post('/',     auth, upload.single('soilImage'), checkSuitability);
router.get('/',      auth, getHistory);
router.get('/:id',   auth, getById);

module.exports = router;
```

### 5.6 Controller — Recommendation

**`server/src/controllers/recommendationController.js`**

```js
const Recommendation = require('../models/Recommendation');
const aiService = require('../services/aiService');
const weatherService = require('../services/weatherService');
const profitService = require('../services/profitService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

exports.createRecommendation = async (req, res, next) => {
  try {
    const {
      landSize, landUnit, location, soilType, soilPH,
      irrigationAvailable, soilMoisture,
      previousCrop, season, investmentAmount,
    } = req.body;

    const soilImagePath = req.file ? req.file.path : null;

    // 1. Fetch weather data for the location
    const weather = await weatherService.getWeatherByLocation(location);

    // 2. Call AI microservice for crop recommendation
    const aiPayload = {
      soilType,
      soilImagePath,
      soilPH: soilPH ? parseFloat(soilPH) : null,
      irrigationAvailable: irrigationAvailable === 'true',
      soilMoisture,
      previousCrop,
      season,
      weather,
      landSize: parseFloat(landSize),
    };

    const aiResult = await aiService.getRecommendation(aiPayload);

    // 3. Compute profit estimation
    const profit = profitService.estimate({
      investmentAmount: parseFloat(investmentAmount),
      cropName: aiResult.crops[0].name,
      landSize: parseFloat(landSize),
      landUnit,
    });

    // 4. Persist to database
    const recommendation = await Recommendation.create({
      user: req.user._id,
      inputs: {
        landSize: parseFloat(landSize),
        landUnit,
        location,
        soilType,
        soilImagePath,
        soilPH: soilPH ? parseFloat(soilPH) : null,
        irrigationAvailable: irrigationAvailable === 'true',
        soilMoisture,
        previousCrop,
        season,
        investmentAmount: parseFloat(investmentAmount),
      },
      crops: aiResult.crops,
      sustainability: aiResult.sustainability,
      profit,
      reasons: aiResult.reasons,
      fertilizers: aiResult.fertilizers,
      cultivationSteps: aiResult.cultivationSteps,
      growthTips: aiResult.growthTips,
      weatherSnapshot: weather,
      modelVersion: aiResult.modelVersion,
    });

    return successResponse(res, 201, 'Recommendation generated successfully', {
      id: recommendation._id,
      crops: recommendation.crops,
      sustainability: recommendation.sustainability,
      profit: recommendation.profit,
      reasons: recommendation.reasons,
      fertilizers: recommendation.fertilizers,
      cultivationSteps: recommendation.cultivationSteps,
      growthTips: recommendation.growthTips,
    });
  } catch (error) {
    next(error);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const recs = await Recommendation.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .select('crops.0.name crops.0.suitabilityPercent createdAt');
    return successResponse(res, 200, 'History retrieved', recs);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const rec = await Recommendation.findOne({ _id: req.params.id, user: req.user._id });
    if (!rec) return errorResponse(res, 404, 'Recommendation not found');
    return successResponse(res, 200, 'Recommendation retrieved', rec);
  } catch (error) {
    next(error);
  }
};
```

### 5.7 Controller — Suitability

**`server/src/controllers/suitabilityController.js`**

```js
const SuitabilityCheck = require('../models/SuitabilityCheck');
const aiService = require('../services/aiService');
const weatherService = require('../services/weatherService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

exports.checkSuitability = async (req, res, next) => {
  try {
    const {
      cropName, landSize, landUnit, location,
      soilType, previousCrop, irrigationAvailable,
    } = req.body;

    const soilImagePath = req.file ? req.file.path : null;

    // 1. Fetch weather
    const weather = await weatherService.getWeatherByLocation(location);

    // 2. Call AI service
    const aiResult = await aiService.checkSuitability({
      cropName,
      soilType,
      soilImagePath,
      previousCrop,
      irrigationAvailable: irrigationAvailable === 'true',
      weather,
      landSize: parseFloat(landSize),
    });

    // 3. Determine level
    let level;
    if (aiResult.suitabilityPercent >= 80) level = 'Highly suitable';
    else if (aiResult.suitabilityPercent >= 60) level = 'Moderately suitable';
    else level = 'Not recommended';

    // 4. Persist
    const check = await SuitabilityCheck.create({
      user: req.user._id,
      inputs: { cropName, landSize: parseFloat(landSize), landUnit, location, soilType, soilImagePath, previousCrop, irrigationAvailable: irrigationAvailable === 'true' },
      suitabilityPercent: aiResult.suitabilityPercent,
      level,
      reasons: aiResult.reasons,
      soilImprovements: aiResult.soilImprovements,
      cultivationAdvice: aiResult.cultivationAdvice,
      weatherSnapshot: weather,
      modelVersion: aiResult.modelVersion,
    });

    return successResponse(res, 201, 'Suitability check completed', {
      id: check._id,
      suitabilityPercent: check.suitabilityPercent,
      level: check.level,
      reasons: check.reasons,
      soilImprovements: check.soilImprovements,
      cultivationAdvice: check.cultivationAdvice,
    });
  } catch (error) {
    next(error);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const checks = await SuitabilityCheck.find({ user: req.user._id })
      .sort({ createdAt: -1 }).limit(50)
      .select('inputs.cropName suitabilityPercent level createdAt');
    return successResponse(res, 200, 'History retrieved', checks);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const check = await SuitabilityCheck.findOne({ _id: req.params.id, user: req.user._id });
    if (!check) return errorResponse(res, 404, 'Suitability check not found');
    return successResponse(res, 200, 'Check retrieved', check);
  } catch (error) {
    next(error);
  }
};
```

### 5.8 Auth Middleware

**`server/src/middleware/authMiddleware.js`**

```js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/env');

module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
```

### 5.9 Global Error Handler

**`server/src/middleware/errorHandler.js`**

```js
const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  logger.error(err.stack || err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, message: 'Validation failed', errors: messages });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: 'Duplicate entry' });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }

  // Default
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
```

### 5.10 AI Service Client

**`server/src/services/aiService.js`**

```js
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { AI_SERVICE_URL, AI_SERVICE_API_KEY } = require('../config/env');
const logger = require('../utils/logger');

const aiClient = axios.create({
  baseURL: AI_SERVICE_URL,
  timeout: 60000,
  headers: { 'X-API-Key': AI_SERVICE_API_KEY },
});

/**
 * Call the AI microservice for crop recommendation
 */
exports.getRecommendation = async (payload) => {
  try {
    const form = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === 'soilImagePath' && value) {
        form.append('soilImage', fs.createReadStream(value));
      } else if (value !== null && value !== undefined) {
        form.append(key, String(value));
      }
    });

    // weather is an object — serialize
    if (payload.weather) form.append('weather', JSON.stringify(payload.weather));

    const res = await aiClient.post('/api/recommend', form, { headers: form.getHeaders() });
    return res.data;
  } catch (error) {
    logger.error('AI recommendation service error:', error.message);
    throw new Error('AI service unavailable — please try again later');
  }
};

/**
 * Call the AI microservice for suitability check
 */
exports.checkSuitability = async (payload) => {
  try {
    const form = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === 'soilImagePath' && value) {
        form.append('soilImage', fs.createReadStream(value));
      } else if (key === 'weather') {
        form.append('weather', JSON.stringify(value));
      } else if (value !== null && value !== undefined) {
        form.append(key, String(value));
      }
    });

    const res = await aiClient.post('/api/suitability', form, { headers: form.getHeaders() });
    return res.data;
  } catch (error) {
    logger.error('AI suitability service error:', error.message);
    throw new Error('AI service unavailable — please try again later');
  }
};
```

### 5.11 Weather Service

**`server/src/services/weatherService.js`**

```js
const axios = require('axios');
const { OPENWEATHER_API_KEY, GOOGLE_GEOCODING_API_KEY } = require('../config/env');
const logger = require('../utils/logger');

/**
 * Convert a location name to lat/lng using Google Geocoding API
 */
const geocode = async (location) => {
  const res = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
    params: { address: location, key: GOOGLE_GEOCODING_API_KEY },
  });
  if (res.data.results.length === 0) throw new Error(`Location not found: ${location}`);
  const { lat, lng } = res.data.results[0].geometry.location;
  return { lat, lng };
};

/**
 * Fetch current weather + forecast for a location
 */
exports.getWeatherByLocation = async (location) => {
  try {
    const { lat, lng } = await geocode(location);

    const [current, forecast] = await Promise.all([
      axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: { lat, lon: lng, appid: OPENWEATHER_API_KEY, units: 'metric' },
      }),
      axios.get('https://api.openweathermap.org/data/2.5/forecast', {
        params: { lat, lon: lng, appid: OPENWEATHER_API_KEY, units: 'metric' },
      }),
    ]);

    return {
      location,
      coordinates: { lat, lng },
      current: {
        temp:      current.data.main.temp,
        humidity:  current.data.main.humidity,
        rainfall:  current.data.rain?.['1h'] || 0,
        windSpeed: current.data.wind.speed,
        condition: current.data.weather[0].main,
      },
      forecast: forecast.data.list.slice(0, 8).map(item => ({
        dt:       item.dt,
        temp:     item.main.temp,
        humidity: item.main.humidity,
        rainfall: item.rain?.['3h'] || 0,
        condition:item.weather[0].main,
      })),
    };
  } catch (error) {
    logger.error('Weather service error:', error.message);
    throw new Error('Unable to fetch weather data for the given location');
  }
};
```

### 5.12 Profit Service

**`server/src/services/profitService.js`**

```js
/**
 * Approximate market prices and yields per acre (₹, India-centric defaults).
 * In production, this would be fetched from a market-data API.
 */
const CROP_ECONOMICS = {
  groundnut:  { yieldPerAcre: 800,  pricePerKg: 55  },
  maize:      { yieldPerAcre: 2500, pricePerKg: 22  },
  cotton:     { yieldPerAcre: 600,  pricePerKg: 65  },
  rice:       { yieldPerAcre: 2800, pricePerKg: 25  },
  wheat:      { yieldPerAcre: 2000, pricePerKg: 28  },
  sugarcane:  { yieldPerAcre: 35000,pricePerKg: 3.5 },
  soybean:    { yieldPerAcre: 1000, pricePerKg: 42  },
  sunflower:  { yieldPerAcre: 700,  pricePerKg: 50  },
  millets:    { yieldPerAcre: 1200, pricePerKg: 30  },
  pulses:     { yieldPerAcre: 600,  pricePerKg: 70  },
};

/**
 * Estimate profit.
 *
 * @param {Object} params
 * @param {number} params.investmentAmount - Total investment in ₹
 * @param {string} params.cropName         - Crop name (lowercase)
 * @param {number} params.landSize         - Land area
 * @param {string} params.landUnit         - 'acre' | 'cent'
 * @returns {{ investment: number, revenue: number, net: number }}
 */
exports.estimate = ({ investmentAmount, cropName, landSize, landUnit }) => {
  const areaInAcres = landUnit === 'cent' ? landSize / 100 : landSize;
  const crop = CROP_ECONOMICS[cropName.toLowerCase()] || { yieldPerAcre: 1000, pricePerKg: 30 };

  const expectedYield = crop.yieldPerAcre * areaInAcres; // kg
  const revenue = expectedYield * crop.pricePerKg;       // ₹
  const net = revenue - investmentAmount;

  return {
    investment: investmentAmount,
    revenue:    Math.round(revenue),
    net:        Math.round(net),
  };
};
```

### 5.13 Standardized API Response Helper

**`server/src/utils/apiResponse.js`**

```js
exports.successResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data && { data }),
  });
};

exports.errorResponse = (res, statusCode, message, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};
```

---

## 6. Database Implementation

### 6.1 MongoDB Collections Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        MongoDB: crop_recommendation              │
├──────────────────────┬───────────────────────────────────────────┤
│  Collection          │  Purpose                                  │
├──────────────────────┼───────────────────────────────────────────┤
│  users               │  User accounts and profiles               │
│  lands               │  Registered land parcels per user         │
│  crophistories       │  Historical crop cultivation records      │
│  recommendations     │  AI recommendation results + inputs       │
│  suitabilitychecks   │  Suitability check results + inputs       │
│  weathercaches       │  Cached weather lookups (TTL indexed)     │
└──────────────────────┴───────────────────────────────────────────┘
```

### 6.2 Index Strategy

```js
// users
db.users.createIndex({ email: 1 }, { unique: true });

// lands
db.lands.createIndex({ user: 1 });

// crophistories
db.crophistories.createIndex({ user: 1, createdAt: -1 });

// recommendations
db.recommendations.createIndex({ user: 1, createdAt: -1 });

// suitabilitychecks
db.suitabilitychecks.createIndex({ user: 1, createdAt: -1 });

// weathercaches — auto-expire after 1 hour
db.weathercaches.createIndex({ location: 1 });
db.weathercaches.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });
```

### 6.3 Data Relationships (ASCII ERD)

```
┌───────────┐        ┌───────────────┐
│   User    │◄───┐   │    Land       │
│───────────│    │   │───────────────│
│ _id       │    └───│ user (ref)    │
│ name      │        │ size          │
│ email     │        │ location      │
│ password  │        │ soilType      │
└─────┬─────┘        └───────┬───────┘
      │                      │
      │  ┌───────────────────┘
      │  │
      ▼  ▼
┌──────────────────┐    ┌─────────────────────┐
│  CropHistory     │    │  Recommendation      │
│──────────────────│    │─────────────────────│
│ user (ref)       │    │ user (ref)           │
│ land (ref)       │    │ land (ref)           │
│ cropName         │    │ inputs {}            │
│ season           │    │ crops []             │
└──────────────────┘    │ sustainability {}    │
                        │ profit {}            │
                        │ fertilizers []       │
                        │ cultivationSteps []  │
                        └─────────────────────┘

                        ┌─────────────────────┐
                        │  SuitabilityCheck    │
                        │─────────────────────│
                        │ user (ref)           │
                        │ inputs {}            │
                        │ suitabilityPercent   │
                        │ level                │
                        │ soilImprovements []  │
                        │ cultivationAdvice [] │
                        └─────────────────────┘
```

### 6.4 Weather Cache Model

**`server/src/models/WeatherCache.js`**

```js
const mongoose = require('mongoose');

const weatherCacheSchema = new mongoose.Schema({
  location:  { type: String, required: true, index: true },
  data:      { type: mongoose.Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now, index: { expires: 3600 } }, // TTL 1 hour
});

module.exports = mongoose.model('WeatherCache', weatherCacheSchema);
```

---

## 7. AI Model Integration

### 7.1 AI Microservice Architecture

```
                    ┌─────────────────────────────────────────┐
                    │         Python AI Microservice           │
                    │           (FastAPI / Port 8000)          │
                    ├─────────────────────────────────────────┤
                    │                                         │
  POST /api/recommend ──►  Preprocessing ──► Crop Model ──►  │
                    │           │                   │         │
                    │      Soil Image CNN     Sustainability  │
                    │           │              Evaluator       │
                    │           ▼                   │         │
                    │      Feature Vector           ▼         │
                    │           │            Fertilizer        │
                    │           ▼            Recommender       │
                    │      Random Forest /          │         │
                    │      Gradient Boost           ▼         │
                    │           │           Cultivation        │
                    │           ▼           Guide Generator    │
  POST /api/suitability ──► Suitability                       │
                    │         Calculator                      │
                    │                                         │
  POST /api/soil-analyze ──► Soil CNN                         │
                    │                                         │
                    └─────────────────────────────────────────┘
```

### 7.2 FastAPI Entry Point

**`ai-service/app/main.py`**

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import recommendation, suitability, soil_analysis
from app.config import Settings

settings = Settings()
app = FastAPI(title="CropAI ML Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recommendation.router, prefix="/api")
app.include_router(suitability.router,     prefix="/api")
app.include_router(soil_analysis.router,   prefix="/api")


@app.get("/health")
def health():
    return {"status": "ok", "service": "ai-service"}
```

### 7.3 Crop Recommendation Endpoint

**`ai-service/app/routes/recommendation.py`**

```python
from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional
import json

from app.services.crop_predictor import CropPredictor
from app.services.soil_analyzer import SoilAnalyzer
from app.services.sustainability_evaluator import SustainabilityEvaluator
from app.services.fertilizer_recommender import FertilizerRecommender
from app.services.cultivation_guide_generator import CultivationGuideGenerator

router = APIRouter()
predictor = CropPredictor()
soil_analyzer = SoilAnalyzer()
sustainability = SustainabilityEvaluator()
fertilizer = FertilizerRecommender()
cultivation = CultivationGuideGenerator()


@router.post("/recommend")
async def recommend(
    soilType: str = Form(""),
    soilImage: Optional[UploadFile] = File(None),
    soilPH: Optional[float] = Form(None),
    irrigationAvailable: str = Form("false"),
    soilMoisture: Optional[str] = Form(None),
    previousCrop: str = Form(""),
    season: str = Form(""),
    weather: str = Form("{}"),
    landSize: float = Form(1.0),
):
    weather_data = json.loads(weather)
    irrigation = irrigationAvailable.lower() == "true"

    # 1. Soil analysis from image (if provided)
    soil_features = {}
    if soilImage:
        contents = await soilImage.read()
        soil_features = soil_analyzer.analyze_image(contents)

    # 2. Merge soil info
    soil_info = {
        "type": soil_features.get("predicted_type", soilType),
        "ph": soilPH,
        "moisture": soilMoisture,
        "organic_content": soil_features.get("organic_content"),
        "texture_class": soil_features.get("texture_class"),
    }

    # 3. Predict top crops
    crops = predictor.predict(
        soil=soil_info,
        weather=weather_data,
        previous_crop=previousCrop,
        season=season,
        irrigation=irrigation,
        land_size=landSize,
    )

    # 4. Sustainability evaluation
    sus = sustainability.evaluate(
        crops=crops,
        soil=soil_info,
        previous_crop=previousCrop,
    )

    # 5. Fertilizer recommendations
    ferts = fertilizer.recommend(
        crop=crops[0]["name"],
        soil=soil_info,
    )

    # 6. Cultivation guide
    guide = cultivation.generate(
        crop=crops[0]["name"],
        soil=soil_info,
        season=season,
        irrigation=irrigation,
    )

    return {
        "crops": crops,
        "sustainability": sus,
        "reasons": guide["reasons"],
        "fertilizers": ferts,
        "cultivationSteps": guide["steps"],
        "growthTips": guide["tips"],
        "modelVersion": predictor.version,
    }
```

### 7.4 Crop Prediction Model

**`ai-service/app/services/crop_predictor.py`**

```python
import numpy as np
import joblib
from pathlib import Path

MODEL_PATH = Path(__file__).parent.parent.parent / "trained_models" / "crop_recommender.pkl"
SCALER_PATH = Path(__file__).parent.parent.parent / "trained_models" / "scaler.pkl"


class CropPredictor:
    """
    Predicts top-N suitable crops using a trained Gradient Boosting / Random Forest model.

    Input features (14-dimensional vector):
        [soil_type_encoded, soil_ph, soil_moisture, organic_content,
         temperature, humidity, rainfall, wind_speed,
         irrigation, land_size, season_encoded,
         previous_crop_encoded, texture_class_encoded, elevation]
    """

    def __init__(self):
        self.model = joblib.load(MODEL_PATH)
        self.scaler = joblib.load(SCALER_PATH)
        self.version = "1.0.0"

        self.soil_type_map = {
            "sandy": 0, "clay": 1, "loamy": 2,
            "red": 3, "black": 4, "unknown": 5,
        }
        self.season_map = {
            "kharif": 0, "rabi": 1, "zaid": 2, "summer": 3, "winter": 4,
        }
        self.crop_map = {
            "none": 0, "rice": 1, "wheat": 2, "maize": 3, "groundnut": 4,
            "cotton": 5, "sugarcane": 6, "soybean": 7, "sunflower": 8,
            "millets": 9, "pulses": 10,
        }
        self.crop_labels = list(self.crop_map.keys())[1:]  # exclude 'none'

    def _encode_features(self, soil, weather, previous_crop, season, irrigation, land_size):
        soil_type_enc = self.soil_type_map.get(soil.get("type", "unknown"), 5)
        soil_ph = soil.get("ph") or 6.5  # default neutral
        soil_moisture_val = {"low": 0.2, "medium": 0.5, "high": 0.8}.get(
            (soil.get("moisture") or "medium").lower(), 0.5
        )
        organic = soil.get("organic_content") or 0.5
        texture = {"sandy": 0, "clay": 1, "loam": 2, "silt": 3}.get(
            (soil.get("texture_class") or "loam").lower(), 2
        )

        temp = weather.get("current", {}).get("temp", 28)
        humidity = weather.get("current", {}).get("humidity", 60)
        rainfall = weather.get("current", {}).get("rainfall", 0)
        wind = weather.get("current", {}).get("windSpeed", 5)

        season_enc = self.season_map.get(season.lower(), 0)
        prev_crop_enc = self.crop_map.get(previous_crop.lower(), 0)
        irr = 1 if irrigation else 0

        features = np.array([[
            soil_type_enc, soil_ph, soil_moisture_val, organic,
            temp, humidity, rainfall, wind,
            irr, land_size, season_enc,
            prev_crop_enc, texture, 0  # elevation placeholder
        ]])

        return self.scaler.transform(features)

    def predict(self, soil, weather, previous_crop, season, irrigation, land_size, top_n=3):
        features = self._encode_features(soil, weather, previous_crop, season, irrigation, land_size)

        # Get probability distribution across crop classes
        probas = self.model.predict_proba(features)[0]

        # Top-N by probability
        top_indices = np.argsort(probas)[::-1][:top_n]

        results = []
        for idx in top_indices:
            crop_name = self.crop_labels[idx]
            suitability = round(float(probas[idx]) * 100, 1)
            results.append({
                "name": crop_name.capitalize(),
                "suitabilityPercent": suitability,
            })

        return results
```

### 7.5 Soil Image Classifier

**`ai-service/app/services/soil_analyzer.py`**

```python
import numpy as np
from io import BytesIO
from PIL import Image
from pathlib import Path

MODEL_PATH = Path(__file__).parent.parent.parent / "trained_models" / "soil_classifier.h5"


class SoilAnalyzer:
    """
    CNN-based soil type classifier.
    Input: Raw image bytes.
    Output: Predicted soil type, organic content estimate, and texture class.
    """

    def __init__(self):
        try:
            import tensorflow as tf
            self.model = tf.keras.models.load_model(str(MODEL_PATH))
        except Exception:
            self.model = None  # Graceful degradation

        self.classes = ["sandy", "clay", "loamy", "red", "black"]
        self.texture_map = {
            "sandy": "sandy",
            "clay": "clay",
            "loamy": "loam",
            "red": "loam",
            "black": "clay",
        }

    def analyze_image(self, image_bytes: bytes) -> dict:
        if self.model is None:
            return {}

        # Preprocess
        img = Image.open(BytesIO(image_bytes)).convert("RGB")
        img = img.resize((224, 224))
        arr = np.array(img) / 255.0
        arr = np.expand_dims(arr, axis=0)

        # Predict
        predictions = self.model.predict(arr)[0]
        predicted_idx = int(np.argmax(predictions))
        predicted_type = self.classes[predicted_idx]
        confidence = float(predictions[predicted_idx])

        return {
            "predicted_type": predicted_type,
            "confidence": round(confidence, 3),
            "texture_class": self.texture_map.get(predicted_type, "loam"),
            "organic_content": self._estimate_organic(predicted_type),
        }

    @staticmethod
    def _estimate_organic(soil_type: str) -> float:
        estimates = {
            "sandy": 0.3, "clay": 0.5, "loamy": 0.7,
            "red": 0.4, "black": 0.6,
        }
        return estimates.get(soil_type, 0.5)
```

### 7.6 Sustainability Evaluator

**`ai-service/app/services/sustainability_evaluator.py`**

```python
class SustainabilityEvaluator:
    """
    Evaluates how sustainable a crop is for the given soil,
    based on crop rotation principles and soil health factors.
    """

    NITROGEN_FIXERS = {"groundnut", "soybean", "pulses"}
    HEAVY_FEEDERS = {"sugarcane", "cotton", "maize"}

    def evaluate(self, crops: list, soil: dict, previous_crop: str) -> dict:
        top_crop = crops[0]["name"].lower()
        prev = previous_crop.lower()

        score = 50  # base score

        # Crop rotation bonus
        if top_crop != prev:
            score += 15
        else:
            score -= 10  # penalty for monoculture

        # Nitrogen fixation bonus
        if top_crop in self.NITROGEN_FIXERS:
            score += 20

        # Heavy feeder after heavy feeder penalty
        if top_crop in self.HEAVY_FEEDERS and prev in self.HEAVY_FEEDERS:
            score -= 15

        # Soil pH compatibility
        ph = soil.get("ph") or 6.5
        if 5.5 <= ph <= 7.5:
            score += 10
        else:
            score -= 5

        # Clamp
        score = max(0, min(100, score))

        # Map to level
        if score >= 70:
            level = "High"
            explanation = self._high_explanation(top_crop, prev)
        elif score >= 40:
            level = "Medium"
            explanation = f"Growing {top_crop.capitalize()} after {prev.capitalize()} is acceptable but consider rotating with a legume next season."
        else:
            level = "Low"
            explanation = f"Repeatedly growing heavy feeders depletes soil nutrients. Alternate with nitrogen-fixing crops."

        return {"level": level, "explanation": explanation}

    @staticmethod
    def _high_explanation(crop, prev):
        if crop in SustainabilityEvaluator.NITROGEN_FIXERS:
            return f"Legume crops like {crop.capitalize()} restore nitrogen levels in soil, improving long-term fertility."
        return f"Rotating from {prev.capitalize()} to {crop.capitalize()} diversifies soil nutrient demands and reduces pest cycles."
```

### 7.7 Fertilizer Recommender

**`ai-service/app/services/fertilizer_recommender.py`**

```python
class FertilizerRecommender:
    """
    Rule-based fertilizer recommendation engine.
    Takes crop type and soil characteristics, returns recommended fertilizers.
    """

    FERTILIZER_RULES = {
        "groundnut": ["Organic compost", "Phosphorus supplements", "Rhizobium culture"],
        "maize":     ["Nitrogen fertilizer (Urea)", "Potassium supplements", "Zinc sulphate"],
        "cotton":    ["Nitrogen fertilizer", "Phosphorus fertilizer", "Organic compost"],
        "rice":      ["Nitrogen fertilizer (Urea)", "Potassium supplements", "Organic manure"],
        "wheat":     ["Nitrogen fertilizer", "Phosphorus fertilizer", "Potassium supplements"],
        "sugarcane": ["Nitrogen fertilizer", "Potassium supplements", "Farmyard manure"],
        "soybean":   ["Phosphorus supplements", "Organic compost", "Rhizobium inoculant"],
        "sunflower": ["Nitrogen fertilizer", "Boron supplements", "Organic compost"],
        "millets":   ["Organic compost", "Nitrogen fertilizer (low dose)", "Potassium supplements"],
        "pulses":    ["Phosphorus supplements", "Organic compost", "Rhizobium culture"],
    }

    def recommend(self, crop: str, soil: dict) -> list:
        base = self.FERTILIZER_RULES.get(crop.lower(), [
            "Organic compost",
            "Balanced NPK fertilizer",
        ])

        # Additional recommendations based on soil
        extras = []
        ph = soil.get("ph")
        if ph and ph < 5.5:
            extras.append("Agricultural lime (to raise pH)")
        elif ph and ph > 7.5:
            extras.append("Sulphur / Gypsum (to lower pH)")

        organic = soil.get("organic_content") or 0.5
        if organic < 0.4:
            extras.append("Green manure / Vermicompost")

        return list(dict.fromkeys(base + extras))  # deduplicate preserving order
```

### 7.8 Cultivation Guide Generator

**`ai-service/app/services/cultivation_guide_generator.py`**

```python
class CultivationGuideGenerator:
    """
    Generates step-by-step cultivation guidance and growth tips per crop.
    Uses a knowledge base of best practices.
    """

    GUIDES = {
        "groundnut": {
            "steps": [
                "Prepare soil with organic manure 2 weeks before sowing",
                "Sow seeds at 30cm spacing, 5cm depth",
                "Apply phosphorus fertilizer at sowing time",
                "Irrigate within 3 days of sowing",
                "Weed manually at 20 and 40 days after sowing",
                "Apply gypsum at flowering stage",
                "Harvest 100–110 days after sowing when leaves yellow",
            ],
            "tips": [
                "Maintain moderate soil moisture — avoid waterlogging",
                "Avoid heavy nitrogen as it promotes foliage over pods",
                "Ensure good drainage to prevent fungal diseases",
                "Rotate with cereals for best soil health",
            ],
            "reasons": [
                "Soil conditions are suitable for groundnut cultivation",
                "Weather conditions in your region are favorable",
                "Previous crop rotation is beneficial — reduces pest buildup",
                "Market demand for groundnut remains consistently high",
            ],
        },
        "maize": {
            "steps": [
                "Prepare well-tilled seedbed with farmyard manure",
                "Sow seeds at 60cm row spacing, 25cm plant spacing",
                "Apply nitrogen fertilizer in split doses — at sowing and knee-height stage",
                "Irrigate every 7–10 days during dry spells",
                "Control weeds in first 30 days using manual or chemical methods",
                "Monitor for stem borer and fall armyworm pests",
                "Harvest when cobs are dry and kernels are hard",
            ],
            "tips": [
                "Maize requires well-drained soil — avoid clayey waterlogged fields",
                "Apply zinc sulphate if deficiency symptoms appear",
                "Ensure adequate spacing for good air circulation",
                "Use intercropping with legumes on large fields",
            ],
            "reasons": [
                "Soil type supports maize with proper fertilizer supplementation",
                "Temperature and humidity are within optimal range",
                "Crop rotation from previous crop reduces disease pressure",
                "Maize has a strong local and industrial market demand",
            ],
        },
    }

    DEFAULT_GUIDE = {
        "steps": [
            "Prepare soil using organic manure",
            "Sow seeds at recommended spacing for the crop",
            "Apply recommended fertilizers during early growth stage",
            "Maintain irrigation schedule based on crop water requirements",
            "Monitor for pests and diseases regularly",
            "Harvest at optimal maturity stage",
        ],
        "tips": [
            "Maintain moderate soil moisture",
            "Avoid waterlogging",
            "Improve organic content of soil",
            "Follow recommended crop rotation practices",
        ],
        "reasons": [
            "Soil conditions suitable for this crop",
            "Weather conditions are favorable",
            "Previous crop rotation is compatible",
            "Market demand is reasonable for profitability",
        ],
    }

    def generate(self, crop: str, soil: dict, season: str, irrigation: bool) -> dict:
        guide = self.GUIDES.get(crop.lower(), self.DEFAULT_GUIDE)

        # Append irrigation-specific tip
        if not irrigation:
            guide = {**guide, "tips": guide["tips"] + [
                "Consider rainwater harvesting to supplement irrigation"
            ]}

        return guide
```

### 7.9 Model Training Script (Reference)

**`ai-service/training/train_crop_model.py`**

```python
"""
Training script for the crop recommendation model.
Uses a Gradient Boosting Classifier trained on historical crop data.

Dataset columns:
  soil_type, soil_ph, soil_moisture, organic_content,
  temperature, humidity, rainfall, wind_speed,
  irrigation, land_size, season, previous_crop, texture_class, elevation,
  label (crop name)
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import classification_report
import joblib
from pathlib import Path

DATA_PATH = Path(__file__).parent / "data" / "crop_data.csv"
MODEL_DIR = Path(__file__).parent.parent / "trained_models"

def train():
    # Load data
    df = pd.read_csv(DATA_PATH)

    # Encode categorical columns
    label_encoders = {}
    cat_cols = ["soil_type", "season", "previous_crop", "texture_class"]
    for col in cat_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col].astype(str))
        label_encoders[col] = le

    target_le = LabelEncoder()
    df["label"] = target_le.fit_transform(df["label"])

    # Features / Target
    feature_cols = [
        "soil_type", "soil_ph", "soil_moisture", "organic_content",
        "temperature", "humidity", "rainfall", "wind_speed",
        "irrigation", "land_size", "season",
        "previous_crop", "texture_class", "elevation",
    ]

    X = df[feature_cols].values
    y = df["label"].values

    # Scale
    scaler = StandardScaler()
    X = scaler.fit_transform(X)

    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train
    model = GradientBoostingClassifier(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.1,
        random_state=42,
    )
    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    print(classification_report(y_test, y_pred, target_names=target_le.classes_))

    cv_scores = cross_val_score(model, X, y, cv=5)
    print(f"Cross-validation accuracy: {cv_scores.mean():.3f} ± {cv_scores.std():.3f}")

    # Save
    MODEL_DIR.mkdir(exist_ok=True)
    joblib.dump(model,  MODEL_DIR / "crop_recommender.pkl")
    joblib.dump(scaler, MODEL_DIR / "scaler.pkl")
    print("Model and scaler saved.")


if __name__ == "__main__":
    train()
```

---

## 8. API Design

### 8.1 API Endpoint Reference

All endpoints are prefixed with `/api`.

#### Authentication

| Method | Endpoint         | Auth | Description                  |
|--------|------------------|------|------------------------------|
| POST   | /auth/register   | No   | Create new user account      |
| POST   | /auth/login      | No   | Login and receive JWT        |
| GET    | /auth/me         | Yes  | Get current user profile     |
| PUT    | /auth/me         | Yes  | Update user profile          |

#### Crop Recommendation

| Method | Endpoint              | Auth | Description                          |
|--------|-----------------------|------|--------------------------------------|
| POST   | /recommendations      | Yes  | Submit data and get recommendations  |
| GET    | /recommendations      | Yes  | Get recommendation history           |
| GET    | /recommendations/:id  | Yes  | Get single recommendation detail     |

#### Crop Suitability

| Method | Endpoint           | Auth | Description                        |
|--------|--------------------|------|------------------------------------|
| POST   | /suitability       | Yes  | Submit data and check suitability  |
| GET    | /suitability       | Yes  | Get suitability check history      |
| GET    | /suitability/:id   | Yes  | Get single suitability detail      |

#### Land Management

| Method | Endpoint      | Auth | Description                |
|--------|---------------|------|----------------------------|
| POST   | /lands        | Yes  | Register a new land parcel |
| GET    | /lands        | Yes  | List user's lands          |
| GET    | /lands/:id    | Yes  | Get land details           |
| PUT    | /lands/:id    | Yes  | Update land info           |
| DELETE | /lands/:id    | Yes  | Remove a land              |

#### Weather

| Method | Endpoint              | Auth | Description                        |
|--------|-----------------------|------|------------------------------------|
| GET    | /weather?location=X   | Yes  | Get weather data for a location    |

### 8.2 Request / Response Examples

#### POST /api/auth/register

**Request:**
```json
{
  "name": "Farmer Kumar",
  "email": "kumar@example.com",
  "password": "securePass123",
  "phone": "+91-9876543210",
  "location": "Coimbatore, Tamil Nadu"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "_id": "660a1b2c3d4e5f6a7b8c9d0e",
      "name": "Farmer Kumar",
      "email": "kumar@example.com",
      "location": "Coimbatore, Tamil Nadu"
    }
  }
}
```

#### POST /api/recommendations

**Request (multipart/form-data):**
```
landSize: 5
landUnit: acre
location: Coimbatore, Tamil Nadu
soilType: red
soilImage: [binary file]
soilPH: 6.2
irrigationAvailable: true
soilMoisture: medium
previousCrop: rice
season: rabi
investmentAmount: 30000
```

**Response (201):**
```json
{
  "success": true,
  "message": "Recommendation generated successfully",
  "data": {
    "id": "660a1c2d3e4f5a6b7c8d9e0f",
    "crops": [
      { "name": "Groundnut", "suitabilityPercent": 92 },
      { "name": "Maize",     "suitabilityPercent": 86 },
      { "name": "Cotton",    "suitabilityPercent": 78 }
    ],
    "sustainability": {
      "level": "High",
      "explanation": "Legume crops like Groundnut restore nitrogen levels in soil, improving long-term fertility."
    },
    "profit": {
      "investment": 30000,
      "revenue": 65000,
      "net": 35000
    },
    "reasons": [
      "Soil conditions are suitable for groundnut cultivation",
      "Weather conditions in your region are favorable",
      "Previous crop rotation is beneficial — reduces pest buildup",
      "Market demand for groundnut remains consistently high"
    ],
    "fertilizers": [
      "Organic compost",
      "Phosphorus supplements",
      "Rhizobium culture"
    ],
    "cultivationSteps": [
      "Prepare soil with organic manure 2 weeks before sowing",
      "Sow seeds at 30cm spacing, 5cm depth",
      "Apply phosphorus fertilizer at sowing time",
      "Irrigate within 3 days of sowing",
      "Weed manually at 20 and 40 days after sowing",
      "Apply gypsum at flowering stage",
      "Harvest 100–110 days after sowing when leaves yellow"
    ],
    "growthTips": [
      "Maintain moderate soil moisture — avoid waterlogging",
      "Avoid heavy nitrogen as it promotes foliage over pods",
      "Ensure good drainage to prevent fungal diseases",
      "Rotate with cereals for best soil health"
    ]
  }
}
```

#### POST /api/suitability

**Request (multipart/form-data):**
```
cropName: Rice
landSize: 3
landUnit: acre
location: Thanjavur, Tamil Nadu
soilType: clay
previousCrop: groundnut
irrigationAvailable: true
```

**Response (201):**
```json
{
  "success": true,
  "message": "Suitability check completed",
  "data": {
    "id": "660a1d3e4f5a6b7c8d9e0f1a",
    "suitabilityPercent": 82,
    "level": "Highly suitable",
    "reasons": [
      "Soil moisture is moderate and appropriate for rice",
      "Weather conditions are favorable for paddy cultivation",
      "Crop rotation from groundnut to rice is compatible and beneficial"
    ],
    "soilImprovements": [
      "Increase nitrogen content with urea application",
      "Improve drainage in waterlogged sections",
      "Add organic compost for long-term soil health"
    ],
    "cultivationAdvice": [
      "Maintain irrigation every 7 days during vegetative stage",
      "Apply nitrogen fertilizer in 3 split doses"
    ]
  }
}
```

### 8.3 Error Response Format

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": ["Optional array of detailed validation errors"]
}
```

**Common HTTP status codes:**

| Code | Meaning                |
|------|------------------------|
| 400  | Validation error       |
| 401  | Authentication failed  |
| 403  | Forbidden              |
| 404  | Resource not found     |
| 409  | Conflict (duplicate)   |
| 429  | Rate limit exceeded    |
| 500  | Internal server error  |
| 503  | AI service unavailable |

---

## 9. Authentication & Authorization

### 9.1 Auth Flow

```
┌──────────┐     POST /auth/register      ┌──────────┐
│  Client   │ ──────────────────────────► │  Server   │
│           │ ◄──────────────────────────  │           │
│           │     { token, user }          │           │
│           │                              │           │
│           │     POST /auth/login         │           │
│           │ ──────────────────────────► │           │
│           │ ◄──────────────────────────  │           │
│           │     { token, user }          │           │
│           │                              │           │
│           │     GET /api/recommendations │           │
│           │     Authorization: Bearer <T>│           │
│           │ ──────────────────────────► │           │
│           │     ─► authMiddleware        │           │
│           │         ─► jwt.verify(T)     │           │
│           │         ─► User.findById()   │           │
│           │         ─► req.user = user   │           │
│           │     ─► controller            │           │
│           │ ◄──────────────────────────  │           │
│           │     { data }                 │           │
└──────────┘                              └──────────┘
```

### 9.2 Auth Controller

**`server/src/controllers/authController.js`**

```js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const signToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, location } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return errorResponse(res, 409, 'Email already registered');

    const user = await User.create({ name, email, password, phone, location });
    const token = signToken(user._id);

    return successResponse(res, 201, 'Registration successful', { token, user });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    const token = signToken(user._id);
    return successResponse(res, 200, 'Login successful', { token, user });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res) => {
  return successResponse(res, 200, 'Profile retrieved', { user: req.user });
};

exports.updateProfile = async (req, res, next) => {
  try {
    const allowed = ['name', 'phone', 'location', 'avatar'];
    const updates = {};
    allowed.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    return successResponse(res, 200, 'Profile updated', { user });
  } catch (error) {
    next(error);
  }
};
```

### 9.3 Password Security

- Passwords hashed using bcrypt with salt rounds of 12
- Minimum password length: 8 characters
- Password never returned in API responses (`toJSON` method strips it)
- JWT tokens expire after 7 days (configurable)

---

## 10. Third-Party Service Integration

### 10.1 OpenWeatherMap API

**Purpose:** Real-time weather data (temperature, humidity, rainfall, wind) for the farmer's location.

**API Used:**
- Current Weather: `https://api.openweathermap.org/data/2.5/weather`
- 5-Day Forecast: `https://api.openweathermap.org/data/2.5/forecast`

**Caching:** Responses cached in Redis / MongoDB (TTL: 1 hour) to reduce API calls.

### 10.2 Google Geocoding API

**Purpose:** Convert location names (e.g., "Coimbatore, Tamil Nadu") to latitude/longitude coordinates for weather lookups.

**API Used:** `https://maps.googleapis.com/maps/api/geocode/json`

### 10.3 Integration Error Handling

```
Third-party API failure handling:
  ├── Weather API timeout/failure
  │     └── Use fallback: regional average weather data from local DB
  ├── Geocoding API failure
  │     └── Ask user to enter coordinates manually
  └── AI microservice timeout
        └── Return 503 with retry-after header
```

---

## 11. Testing Strategy

### 11.1 Test Layers

| Layer            | Tool                  | Scope                            |
|------------------|-----------------------|----------------------------------|
| Unit Tests       | Jest                  | Utility functions, services      |
| API Tests        | Jest + Supertest      | Route handlers, middleware       |
| Component Tests  | React Testing Library | UI components                    |
| Integration Tests| Jest + MongoDB Memory | Full request → DB → response     |
| E2E Tests        | Cypress / Playwright  | Complete user flows              |
| ML Model Tests   | pytest                | Model accuracy, input validation |

### 11.2 Test File Structure

```
server/
  __tests__/
    unit/
      profitService.test.js
      cropRotationService.test.js
    integration/
      auth.test.js
      recommendation.test.js
      suitability.test.js
    middleware/
      authMiddleware.test.js

client/
  src/__tests__/
    components/
      SoilInfoForm.test.jsx
      RecommendationResults.test.jsx
    pages/
      HomePage.test.jsx
    services/
      api.test.js

ai-service/
  tests/
    test_crop_predictor.py
    test_soil_analyzer.py
    test_sustainability.py
    test_api_endpoints.py
```

### 11.3 Example Unit Test

**`server/__tests__/unit/profitService.test.js`**

```js
const { estimate } = require('../../src/services/profitService');

describe('Profit Service', () => {
  it('calculates profit correctly for groundnut in acres', () => {
    const result = estimate({
      investmentAmount: 30000,
      cropName: 'groundnut',
      landSize: 5,
      landUnit: 'acre',
    });

    expect(result.investment).toBe(30000);
    expect(result.revenue).toBe(220000);  // 800 * 5 * 55
    expect(result.net).toBe(190000);
  });

  it('converts cents to acres correctly', () => {
    const result = estimate({
      investmentAmount: 5000,
      cropName: 'rice',
      landSize: 200,
      landUnit: 'cent',
    });

    // 200 cents = 2 acres → 2800 * 2 * 25 = 140000
    expect(result.revenue).toBe(140000);
    expect(result.net).toBe(135000);
  });

  it('uses default values for unknown crops', () => {
    const result = estimate({
      investmentAmount: 10000,
      cropName: 'dragon_fruit',
      landSize: 1,
      landUnit: 'acre',
    });

    expect(result.revenue).toBe(30000);  // default 1000 * 1 * 30
    expect(result.net).toBe(20000);
  });
});
```

---

## 12. Deployment Considerations

### 12.1 Docker Compose (Development / Staging)

**`docker-compose.yml`**

```yaml
version: "3.9"

services:
  # ── MongoDB ──
  mongo:
    image: mongo:7
    container_name: cropai-mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: crop_recommendation

  # ── Redis ──
  redis:
    image: redis:7-alpine
    container_name: cropai-redis
    ports:
      - "6379:6379"

  # ── Node.js Backend ──
  server:
    build: ./server
    container_name: cropai-server
    ports:
      - "5000:5000"
    depends_on:
      - mongo
      - redis
      - ai-service
    environment:
      NODE_ENV: production
      MONGO_URI: mongodb://mongo:27017/crop_recommendation
      REDIS_URL: redis://redis:6379
      AI_SERVICE_URL: http://ai-service:8000
    volumes:
      - uploads:/app/uploads

  # ── Python AI Service ──
  ai-service:
    build: ./ai-service
    container_name: cropai-ai
    ports:
      - "8000:8000"

  # ── React Frontend ──
  client:
    build: ./client
    container_name: cropai-client
    ports:
      - "3000:80"
    depends_on:
      - server

volumes:
  mongo_data:
  uploads:
```

### 12.2 Server Dockerfile

**`server/Dockerfile`**

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .

EXPOSE 5000

CMD ["node", "src/index.js"]
```

### 12.3 AI Service Dockerfile

**`ai-service/Dockerfile`**

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# System dependencies for OpenCV / image processing
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx libglib2.0-0 && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 12.4 Client Dockerfile

**`client/Dockerfile`**

```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 12.5 Production Deployment Architecture

```
                          ┌──────────────────────┐
                          │     Cloudflare CDN    │
                          │    (SSL Termination)  │
                          └──────────┬───────────┘
                                     │
                          ┌──────────▼───────────┐
                          │      Nginx Proxy      │
                          │   (Load Balancer)     │
                          └──────┬──────┬────────┘
                                 │      │
                    ┌────────────┘      └────────────┐
                    │                                │
          ┌─────────▼──────────┐          ┌──────────▼─────────┐
          │  React SPA (S3 /   │          │   Node.js Backend   │
          │  Static Hosting)   │          │   (EC2 / ECS)       │
          └────────────────────┘          └──────────┬──────────┘
                                                     │
                                          ┌──────────▼──────────┐
                                          │  AI Microservice     │
                                          │  (EC2 GPU / Lambda)  │
                                          └──────────┬──────────┘
                                                     │
                                     ┌───────────────┼───────────────┐
                                     │               │               │
                              ┌──────▼─────┐  ┌──────▼─────┐  ┌─────▼──────┐
                              │  MongoDB    │  │   Redis     │  │  S3 Bucket  │
                              │  Atlas      │  │  ElastiCache│  │ (Images)    │
                              └────────────┘  └────────────┘  └────────────┘
```

### 12.6 Environment-Specific Configuration

| Aspect                  | Development            | Staging                 | Production                 |
|-------------------------|------------------------|-------------------------|----------------------------|
| Database                | Local MongoDB          | MongoDB Atlas (shared)  | MongoDB Atlas (dedicated)  |
| Redis                   | Local Redis            | Managed Redis           | AWS ElastiCache            |
| AI Service              | Local Python process   | Docker on shared VM     | EC2 GPU instance / ECS     |
| File Storage            | Local filesystem       | Docker volume           | AWS S3                     |
| SSL                     | None (HTTP)            | Let's Encrypt           | Cloudflare                 |
| Logging                 | Console                | File + console          | CloudWatch / Datadog       |
| Domain                  | localhost              | staging.cropai.app      | cropai.app                 |
| Rate Limiting           | 100 req/min            | 60 req/min              | 30 req/min                 |

---

## 13. CI/CD Pipeline

### 13.1 GitHub Actions Workflow

**`.github/workflows/ci.yml`**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # ── Lint & Test Server ──
  server-test:
    runs-on: ubuntu-latest
    services:
      mongo:
        image: mongo:7
        ports: ["27017:27017"]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: cd server && npm ci
      - run: cd server && npm run lint
      - run: cd server && npm test
        env:
          MONGO_URI: mongodb://localhost:27017/test_db
          JWT_SECRET: test_secret

  # ── Lint & Test Client ──
  client-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: cd client && npm ci
      - run: cd client && npm run lint
      - run: cd client && npm test -- --watchAll=false
      - run: cd client && npm run build

  # ── AI Service Tests ──
  ai-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - run: cd ai-service && pip install -r requirements.txt
      - run: cd ai-service && pytest tests/ -v

  # ── Deploy (main branch only) ──
  deploy:
    needs: [server-test, client-test, ai-test]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to production
        run: |
          echo "Deploy steps here (Docker build, push, deploy to cloud)"
```

---

## 14. Monitoring & Logging

### 14.1 Logging Strategy

| Layer      | Tool              | Log Levels                  |
|------------|-------------------|-----------------------------|
| Backend    | Winston           | error, warn, info, debug    |
| AI Service | Python logging    | ERROR, WARNING, INFO, DEBUG |
| Frontend   | Console + Sentry  | Error boundary logging      |

### 14.2 Winston Logger Setup

**`server/src/utils/logger.js`**

```js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'cropai-server' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

module.exports = logger;
```

### 14.3 Application Health Monitoring

```
Monitored Metrics:
  ├── API response times (p50, p95, p99)
  ├── Error rate per endpoint
  ├── MongoDB connection pool status
  ├── Redis cache hit/miss ratio
  ├── AI microservice latency
  ├── AI model prediction confidence distribution
  ├── Soil image upload success rate
  ├── Weather API call frequency and cache hit rate
  ├── JWT token validation errors
  └── Rate limit trigger frequency
```

---

## 15. Security Implementation

### 15.1 Security Measures

| Threat                 | Mitigation                                         |
|------------------------|----------------------------------------------------|
| XSS                    | Helmet.js security headers, React auto-escaping    |
| CSRF                   | SameSite cookies, CORS whitelist                   |
| SQL/NoSQL Injection    | Mongoose schema validation, Joi/Zod input validation|
| Brute Force            | Rate limiting (express-rate-limit), account lockout |
| File Upload Attacks    | File type validation, size limits, virus scanning  |
| JWT Theft              | Short expiry, httpOnly cookies option, token rotation|
| Data Exposure          | Password hashing (bcrypt), field-level projection   |
| Dependency Vulns       | npm audit, Snyk integration in CI                  |
| API Abuse              | Rate limiting per IP and per user                  |
| Insecure Transmission  | TLS/SSL everywhere (Let's Encrypt / Cloudflare)    |

### 15.2 Rate Limiting Configuration

**`server/src/middleware/rateLimiter.js`**

```js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000,      // 1 minute
  max: process.env.NODE_ENV === 'production' ? 30 : 100,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;
```

### 15.3 File Upload Validation

**`server/src/middleware/upload.js`**

```js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/soil-images'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `soil-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

module.exports = upload;
```

### 15.4 Input Validation

**`server/src/middleware/validator.js`** (Example with Zod)

```js
const { z } = require('zod');

const recommendationSchema = z.object({
  landSize:    z.string().transform(Number).pipe(z.number().positive()),
  landUnit:    z.enum(['acre', 'cent']),
  location:    z.string().min(2).max(200),
  soilType:    z.enum(['sandy', 'clay', 'loamy', 'red', 'black', 'unknown', '']).optional(),
  soilPH:      z.string().transform(Number).pipe(z.number().min(0).max(14)).optional(),
  irrigationAvailable: z.enum(['true', 'false']),
  soilMoisture:  z.string().optional(),
  previousCrop:  z.string().min(1),
  season:        z.string().min(1),
  investmentAmount: z.string().transform(Number).pipe(z.number().positive()),
});

const validateRecommendation = (req, res, next) => {
  try {
    recommendationSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
    });
  }
};

module.exports = { validateRecommendation };
```

---

## Appendix A: Python AI Service Requirements

**`ai-service/requirements.txt`**

```
fastapi==0.111.0
uvicorn==0.30.0
python-multipart==0.0.9
numpy==1.26.4
pandas==2.2.2
scikit-learn==1.5.0
joblib==1.4.2
tensorflow==2.16.1
Pillow==10.3.0
opencv-python-headless==4.10.0.82
pydantic==2.7.1
python-dotenv==1.0.1
pytest==8.2.0
httpx==0.27.0
```

## Appendix B: Data Accuracy Disclaimer Component

**`client/src/components/common/Disclaimer.jsx`**

```jsx
import { Info } from 'lucide-react';

export default function Disclaimer() {
  return (
    <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-blue-800">
        <strong>Data Accuracy Notice:</strong> Providing more details such as soil condition,
        soil image, previous crop history, irrigation availability, and investment amount
        improves the accuracy of AI predictions. The more information you provide,
        the better our recommendations will be.
      </p>
    </div>
  );
}
```

---

> **End of Implementation Guide**
>
> This document provides a complete implementation specification for the AI-Powered Sustainable Crop Recommendation and Suitability System, covering frontend, backend, database, AI integration, API design, security, testing, and deployment.
