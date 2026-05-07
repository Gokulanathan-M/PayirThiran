import { motion } from 'framer-motion';
import { MapPin, Upload, Cpu, FileText } from 'lucide-react';

const steps = [
  { icon: MapPin, step: '01', title: 'Enter Land Details', desc: 'Provide your land size, location, and soil information.' },
  { icon: Upload, step: '02', title: 'Add Soil & Crop Data', desc: 'Upload soil image or select soil type. Add previous crop history.' },
  { icon: Cpu, step: '03', title: 'AI Analyzes Data', desc: 'Our AI processes soil, weather, rotation logic, and market data.' },
  { icon: FileText, step: '04', title: 'Get Results', desc: 'Receive detailed crop recommendations with profit and sustainability insights.' },
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900">
            How It Works
          </h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            Four simple steps to get AI-powered farming guidance.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div className="relative mx-auto w-16 h-16">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                  <s.icon className="w-7 h-7 text-primary-600" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {s.step}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 mt-4 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
