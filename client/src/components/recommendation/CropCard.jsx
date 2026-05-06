import SustainabilityBadge from './SustainabilityBadge';
import { formatCurrency } from '../../utils/formatters';

export default function CropCard({ crop, rank, onSelect, selected }) {
  return (
    <button
      onClick={() => onSelect(crop)}
      className={`w-full text-left rounded-2xl border-2 p-5 transition-all hover:shadow-lg ${
        selected ? 'border-green-500 shadow-md bg-green-50/40' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-green-700">#{rank}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{crop.cropName}</h3>
            <p className="text-sm text-gray-500 capitalize">{crop.season} season</p>
          </div>
        </div>
        <SustainabilityBadge level={crop.sustainabilityScore} />
      </div>

      <div className="grid grid-cols-3 gap-3 text-center mt-4">
        <Stat label="Confidence" value={`${crop.confidence ?? 0}%`} />
        <Stat label="Est. Revenue" value={formatCurrency(crop.estimatedRevenue)} />
        <Stat label="ROI" value={crop.roi ? `${crop.roi}%` : '—'} />
      </div>
    </button>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-lg py-2 px-1">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800 truncate">{value}</p>
    </div>
  );
}
