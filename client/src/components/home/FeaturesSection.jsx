import { motion } from 'framer-motion';
import { Sprout, ScanLine, CloudSun, BarChart3, Recycle, FlaskConical } from 'lucide-react';

const features = [
  { icon: Sprout, title: 'Crop Recommendation', desc: 'Get top 2–3 crop suggestions best suited for your land, soil, and weather conditions.' },
  { icon: ScanLine, title: 'Soil Image Analysis', desc: 'Upload a photo of your soil — our AI identifies soil type and properties automatically.' },
  { icon: CloudSun, title: 'Weather Integration', desc: 'Real-time weather data for your location is factored into every recommendation.' },
  { icon: BarChart3, title: 'Profit Estimation', desc: 'See expected revenue and profit based on crop yields and your investment.' },
  { icon: Recycle, title: 'Sustainability Score', desc: 'Understand how your crop choice impacts soil health and long-term fertility.' },
  { icon: FlaskConical, title: 'Fertilizer Guidance', desc: 'Get personalized fertilizer and cultivation advice for optimal results.' },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900">
            What Our Platform Offers
          </h2>
          <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
            A comprehensive AI-powered agriculture platform that analyzes multiple data points
            to give you actionable farming guidance.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-2xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-800 text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
