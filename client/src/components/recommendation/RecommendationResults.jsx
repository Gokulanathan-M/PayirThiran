import { useState } from 'react';
import { motion } from 'framer-motion';
import CropCard from './CropCard';
import ProfitChart from './ProfitChart';
import FertilizerList from './FertilizerList';
import CultivationGuide from './CultivationGuide';
import GrowthTips from './GrowthTips';
import Disclaimer from '../common/Disclaimer';
import Button from '../common/Button';

export default function RecommendationResults({ result, onReset }) {
  const [selectedCrop, setSelectedCrop] = useState(result?.crops?.[0] || null);

  if (!result || !result.crops?.length) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 mb-4">No recommendations returned. Please try again with different inputs.</p>
        <Button onClick={onReset}>Start Over</Button>
      </div>
    );
  }

  const { crops, soilAnalysis, weatherData } = result;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Your Crop Recommendations</h2>
          <p className="text-sm text-gray-500 mt-1">
            Based on your soil, location, and preferences — top {crops.length} crops ranked by suitability.
          </p>
        </div>
        <Button variant="outline" onClick={onReset}>New Analysis</Button>
      </div>

      {/* Weather & Soil Summary */}
      {(weatherData || soilAnalysis) && (
        <div className="grid md:grid-cols-2 gap-4">
          {weatherData && (
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-medium text-blue-800 mb-2">🌤 Weather Data</h4>
              <p className="text-sm text-blue-700">
                Temp: {weatherData.temperature}°C · Humidity: {weatherData.humidity}% · Rainfall: {weatherData.rainfall} mm
              </p>
            </div>
          )}
          {soilAnalysis && (
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <h4 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
                🧪 Soil Analysis
              </h4>
              <div className="space-y-1">
                <p className="text-sm text-amber-900 font-semibold">
                  Detected Type: <span className="text-amber-700">{soilAnalysis.detectedType || 'N/A'}</span>
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-amber-700/80">
                  <span>pH: {soilAnalysis.pH || 'N/A'}</span>
                  {soilAnalysis.confidence && (
                    <span>Confidence: {soilAnalysis.confidence}%</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Crop Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {crops.map((crop, i) => (
          <CropCard key={i} crop={crop} rank={i + 1} selected={selectedCrop?.cropName === crop.cropName}
                    onSelect={setSelectedCrop} />
        ))}
      </div>

      {/* Profit Chart */}
      <ProfitChart crops={crops} />

      {/* Selected Crop Details */}
      {selectedCrop && (
        <motion.div key={selectedCrop.cropName} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
            Details for <span className="text-green-700">{selectedCrop.cropName}</span>
          </h3>
          <FertilizerList fertilizers={selectedCrop.fertilizers} />
          <CultivationGuide guide={selectedCrop.cultivationGuide} />
          <GrowthTips tips={selectedCrop.growthTips} />
        </motion.div>
      )}

      <Disclaimer />
    </motion.div>
  );
}
