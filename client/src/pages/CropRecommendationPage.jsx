import { useState } from 'react';
import { motion } from 'framer-motion';
import LandInfoForm from '../components/recommendation/LandInfoForm';
import SoilInfoForm from '../components/recommendation/SoilInfoForm';
import EnvironmentForm from '../components/recommendation/EnvironmentForm';
import CropHistoryForm from '../components/recommendation/CropHistoryForm';
import FinancialForm from '../components/recommendation/FinancialForm';
import RecommendationResults from '../components/recommendation/RecommendationResults';
import { recommendationService } from '../services/recommendationService';
import { useApp } from '../hooks/useApp';
import toast from 'react-hot-toast';

const STEPS = ['Land Info', 'Soil', 'Environment', 'Crop History', 'Investment'];

export default function CropRecommendationPage() {
  const { addRecommendation } = useApp();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    land: {},
    soil: {},
    environment: {},
    cropHistory: {},
    financial: {},
  });

  const save = (section) => (data) => setFormData(prev => ({ ...prev, [section]: data }));
  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = async (financialData) => {
    const merged = { ...formData, financial: financialData };
    setFormData(merged);
    try {
      setLoading(true);
      const res = await recommendationService.getRecommendation(merged);
      const data = res.data.recommendation || res.data;
      setResult(data);
      addRecommendation(data);
      toast.success('Recommendations ready!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(0);
    setResult(null);
    setFormData({ land: {}, soil: {}, environment: {}, cropHistory: {}, financial: {} });
  };

  if (result) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <RecommendationResults result={result} onReset={handleReset} />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="max-w-2xl mx-auto px-4 py-10">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              i < step ? 'bg-green-600 text-white' : i === step ? 'bg-green-100 text-green-700 ring-2 ring-green-400' : 'bg-gray-100 text-gray-400'
            }`}>{i + 1}</span>
            <span className="hidden sm:inline text-xs text-gray-500">{label}</span>
            {i < STEPS.length - 1 && <div className={`w-8 h-0.5 ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {step === 0 && <LandInfoForm data={formData.land} onSave={save('land')} onNext={next} />}
      {step === 1 && <SoilInfoForm data={formData.soil} onSave={save('soil')} onNext={next} onPrev={prev} />}
      {step === 2 && <EnvironmentForm data={formData.environment} onSave={save('environment')} onNext={next} onPrev={prev} />}
      {step === 3 && <CropHistoryForm data={formData.cropHistory} onSave={save('cropHistory')} onNext={next} onPrev={prev} />}
      {step === 4 && <FinancialForm data={formData.financial} onSave={save('financial')} onSubmit={handleSubmit} onPrev={prev} loading={loading} />}
    </motion.div>
  );
}
