# PayirThiran - Smart Crop Recommendation System

PayirThiran is a full-stack web application designed to help farmers make data-driven decisions. It uses machine learning to analyze soil images and environmental data (weather, pH, moisture) to recommend the most suitable crops for cultivation, along with sustainability scores and financial estimates.

## 🚀 Features
- **AI-Powered Soil Analysis**: Upload soil images to classify soil types using a CNN model.
- **Smart Crop Recommendations**: Personalized crop suggestions based on real-time weather (via OpenWeatherMap), soil data, and investment capacity.
- **Sustainability Tracking**: Provides sustainability scores for different crops to encourage eco-friendly farming.
- **Financial Planning**: Estimated investment, revenue, and ROI calculations for each recommended crop.
- **Cloud-Ready**: Fully integrated with MongoDB Atlas for secure, cloud-based data storage.

## 🛠️ Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion, Recharts.
- **Backend**: Node.js, Express.js, Mongoose.
- **AI Service**: Python, FastAPI, PyTorch (CNN for soil classification).
- **Database**: MongoDB (Atlas).
- **APIs**: OpenWeatherMap (Weather & Geocoding).

## 📁 Project Structure
```text
├── client/          # React Frontend (Vite)
├── server/          # Node.js Backend
├── ai-service/      # Python AI Microservice
└── README.md
```

## ⚙️ Local Setup

### 1. Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- MongoDB (Local or Atlas)

### 2. Environment Configuration
Create a `.env` file in the `server/` directory (use `server/.env.example` as a template):
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret
OPENWEATHER_API_KEY=your_openweather_key
AI_SERVICE_URL=http://localhost:8000
```

### 3. Installation & Running
**AI Service (Python):**
```bash
cd ai-service
pip install -r requirements.txt
python -m app.main
```

**Backend (Node.js):**
```bash
cd server
npm install
npm run dev
```

**Frontend (React):**
```bash
cd client
npm install
npm run dev
```

## ☁️ Deployment Instructions

### 1. AI Service (Render)
- **Root Directory**: `ai-service/`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port 10000`

### 2. Backend (Render)
- **Root Directory**: `server/`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**: Add all keys from your `.env` file. Ensure `AI_SERVICE_URL` points to your deployed Render AI Service.

### 3. Frontend (Vercel)
- **Root Directory**: `client/`
- **Framework Preset**: `Vite`
- **Environment Variables**: Add `VITE_API_BASE_URL` pointing to your deployed Render Backend URL + `/api`.

## 📄 License
This project is for educational purposes as part of the PayirThiran initiative.
