import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const benefits = [
  'More accurate recommendations when you provide complete data',
  'Soil image analysis identifies soil type automatically',
  'Weather-aware suggestions using your real location',
  'Crop rotation analysis prevents soil degradation',
  'Profit estimation helps financial planning',
  'Sustainability scores for long-term soil health',
  'Personalized fertilizer and cultivation guidance',
  'History tracking across multiple farming seasons',
];

export default function BenefitsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-4">
              Why Use CropAI?
            </h2>
            <p className="text-gray-500 mb-8">
              The more information you provide, the better our AI recommendations.
              Here's what makes our platform valuable for every farmer.
            </p>
            <ul className="space-y-3">
              {benefits.map((b, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{b}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary-600 to-emerald-600 rounded-3xl p-8 text-white"
          >
            <h3 className="text-2xl font-display font-bold mb-4">Ready to Start?</h3>
            <p className="text-green-100 mb-6">
              Create a free account and get instant AI-powered crop recommendations
              tailored to your land.
            </p>
            <div className="space-y-3">
              <Link to="/recommend" className="block w-full text-center py-3 bg-yellow-400 text-green-900 rounded-xl font-semibold hover:bg-yellow-300 transition">
                Get Crop Recommendations
              </Link>
              <Link to="/suitability" className="block w-full text-center py-3 border-2 border-white/40 rounded-xl font-semibold hover:bg-white/10 transition">
                Check Crop Suitability
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
