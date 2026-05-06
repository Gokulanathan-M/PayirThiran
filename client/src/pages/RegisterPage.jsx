import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (data) => {
    try {
      setLoading(true);
      await register(data);
      toast.success('Account created! Welcome aboard.');
      navigate('/recommend');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <RegisterForm onSubmit={handleRegister} loading={loading} />
    </motion.div>
  );
}
