export default function GrowthTips({ tips = [] }) {
  if (!tips.length) return null;

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Growth Tips</h3>
      <ul className="space-y-3">
        {tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="shrink-0 bg-green-100 text-green-700 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
              {i + 1}
            </span>
            <p className="text-sm text-gray-600 leading-relaxed">{tip}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
