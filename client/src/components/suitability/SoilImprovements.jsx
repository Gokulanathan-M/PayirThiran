export default function SoilImprovements({ improvements = [] }) {
  if (!improvements || !improvements.length) return null;

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Soil Improvement Suggestions</h3>
      <ul className="space-y-3">
        {improvements.map((item, i) => (
          <li key={i} className="flex items-start gap-3 bg-amber-50 rounded-lg p-3">
            <span className="text-amber-600 mt-0.5">🔧</span>
            <div>
              <p className="font-medium text-gray-800">{item.title}</p>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
