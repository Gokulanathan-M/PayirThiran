import { motion } from 'framer-motion';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import BenefitsSection from '../components/home/BenefitsSection';

export default function HomePage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <BenefitsSection />
    </motion.div>
  );
}
