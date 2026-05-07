import { motion } from 'framer-motion';
import SuitabilityGauge from './SuitabilityGauge';
import SoilImprovements from './SoilImprovements';
import CultivationAdvice from './CultivationAdvice';
import Disclaimer from '../common/Disclaimer';
import Button from '../common/Button';

export default function SuitabilityResults({ result, onReset }) {
  if (!result) return null;

  const { cropName, suitabilityScore, suitabilityLevel, soilAnalysis, improvements, cultivationAdvice, reasons } = result;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Suitability Report: <span className="text-green-700">{cropName}</span>
        </h2>
        <Button variant="outline" onClick={onReset}>Check Another Crop</Button>
      </div>

      {/* Main gauge */}
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
        <SuitabilityGauge score={suitabilityScore} level={suitabilityLevel} />

        {reasons?.length > 0 && (
          <ul className="mt-6 space-y-1 text-sm text-gray-600 max-w-md">
            {reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-green-500">✓</span> {r}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Soil summary */}
      {soilAnalysis && (
        <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
          <h4 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
            🧪 Soil Summary
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

      <SoilImprovements improvements={improvements} />
      <CultivationAdvice advice={cultivationAdvice} />
      <Disclaimer />
    </motion.div>
  );
}
