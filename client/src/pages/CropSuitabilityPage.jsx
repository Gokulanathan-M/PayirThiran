import { useState } from 'react';
import { motion } from 'framer-motion';
import SuitabilityForm from '../components/suitability/SuitabilityForm';
import SuitabilityResults from '../components/suitability/SuitabilityResults';
import { suitabilityService } from '../services/suitabilityService';
import { useApp } from '../hooks/useApp';
import toast from 'react-hot-toast';

export default function CropSuitabilityPage() {
  const { addSuitability } = useApp();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const res = await suitabilityService.checkSuitability(formData);
      const data = res.data.suitability || res.data;
      setResult(data);
      addSuitability(data);
      toast.success('Suitability report ready!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Suitability check failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="max-w-3xl mx-auto px-4 py-10">
      {result ? (
        <SuitabilityResults result={result} onReset={() => setResult(null)} />
      ) : (
        <SuitabilityForm onSubmit={handleSubmit} loading={loading} />
      )}
    </motion.div>
  );
}
