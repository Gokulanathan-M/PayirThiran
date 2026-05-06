import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Leaf, ScanLine, CloudSun } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 text-white">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20 sm:py-28 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
              <Leaf className="w-4 h-4 text-yellow-300" />
              <span className="text-sm text-green-100">AI-Powered Agriculture</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight">
              Smart Farming <br />
              <span className="text-yellow-300">Starts Here</span>
            </h1>
            <p className="mt-6 text-lg text-green-100 max-w-lg">
              Get data-driven crop recommendations based on your soil, weather,
              location, and crop history. Maximize profit while preserving soil health.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/recommend"
                className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-green-900 rounded-xl font-semibold hover:bg-yellow-300 transition shadow-lg hover:shadow-xl">
                Get Recommendations <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/suitability"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/40 rounded-xl font-semibold hover:bg-white/10 transition">
                Check Suitability
              </Link>
            </div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden md:grid grid-cols-2 gap-4"
          >
            {[
              { icon: ScanLine, title: 'Soil Analysis', desc: 'Upload soil images or enter soil type for AI analysis.' },
              { icon: BarChart3, title: 'Profit Estimation', desc: 'Know your expected profit before you plant.' },
              { icon: CloudSun, title: 'Weather Insights', desc: 'Real-time weather data for your location.' },
              { icon: Leaf, title: 'Sustainability', desc: 'Protect soil health with smart crop rotation.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.15 }}
                className={`bg-white/10 backdrop-blur-sm rounded-2xl p-5 space-y-2 ${i % 2 !== 0 ? 'mt-6' : ''}`}
              >
                <item.icon className="w-9 h-9 text-yellow-300" />
                <h3 className="font-semibold text-base">{item.title}</h3>
                <p className="text-sm text-green-100">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
