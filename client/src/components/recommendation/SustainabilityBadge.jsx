const LEVEL_COLORS = {
  high: 'bg-green-100 text-green-800 border-green-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  low: 'bg-red-100 text-red-800 border-red-300',
};

export default function SustainabilityBadge({ level = 'medium' }) {
  const key = level.toLowerCase();
  const css = LEVEL_COLORS[key] || LEVEL_COLORS.medium;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-xs font-semibold capitalize ${css}`}>
      {key === 'high' && '🌿'}
      {key === 'medium' && '🌱'}
      {key === 'low' && '⚠️'}
      {level}
    </span>
  );
}
