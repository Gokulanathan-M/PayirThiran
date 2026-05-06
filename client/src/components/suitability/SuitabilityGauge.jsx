import { SUITABILITY_LEVELS } from '../../utils/constants';

export default function SuitabilityGauge({ score = 0, level = 'MODERATE' }) {
  const pct = Math.min(100, Math.max(0, score));
  
  let infoKey = 'MODERATE';
  if (level && typeof level === 'string') {
    const upperLevel = level.toUpperCase();
    if (SUITABILITY_LEVELS[upperLevel]) {
      infoKey = upperLevel;
    }
  } else if (score >= 80) infoKey = 'HIGH';
  else if (score >= 60) infoKey = 'MODERATE';
  else infoKey = 'LOW';

  const info = SUITABILITY_LEVELS[infoKey] || SUITABILITY_LEVELS.MODERATE;
  
  const colorMap = {
    'text-green-600': '#16a34a',
    'text-yellow-600': '#ca8a04',
    'text-red-600': '#dc2626'
  };
  const hexColor = colorMap[info.color] || '#ca8a04';

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="10" />
          <circle cx="60" cy="60" r="50" fill="none" stroke={hexColor} strokeWidth="10"
                  strokeLinecap="round" strokeDasharray={`${pct * 3.14} ${314 - pct * 3.14}`} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color: hexColor }}>{pct}%</span>
        </div>
      </div>
      <span className="mt-2 inline-block rounded-full px-4 py-1 text-sm font-semibold text-white"
            style={{ backgroundColor: hexColor }}>
        {info.label}
      </span>
    </div>
  );
}
