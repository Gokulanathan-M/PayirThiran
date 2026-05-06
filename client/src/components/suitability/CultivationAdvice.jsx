export default function CultivationAdvice({ advice }) {
  if (!advice) return null;

  const items = [
    { icon: '📅', label: 'Best Planting Time', text: advice.plantingTime },
    { icon: '💧', label: 'Water Requirements', text: advice.waterNeeds },
    { icon: '🧪', label: 'Fertilizer Plan', text: advice.fertilizerPlan },
    { icon: '🐛', label: 'Common Pests', text: advice.commonPests },
    { icon: '📊', label: 'Expected Yield', text: advice.expectedYield },
  ].filter(i => i.text);

  if (!items.length) return null;

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Cultivation Advice</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {items.map((item, i) => (
          <div key={i} className="border border-gray-100 rounded-lg p-3">
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <span>{item.icon}</span> {item.label}
            </p>
            <p className="text-sm font-medium text-gray-700 mt-1">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
