export default function CultivationGuide({ guide }) {
  if (!guide) return null;

  const sections = [
    { title: 'Land Preparation', icon: '🌾', content: guide.landPreparation },
    { title: 'Sowing', icon: '🌱', content: guide.sowing },
    { title: 'Irrigation Schedule', icon: '💧', content: guide.irrigation },
    { title: 'Pest Management', icon: '🐛', content: guide.pestManagement },
    { title: 'Harvesting', icon: '🚜', content: guide.harvesting },
  ].filter(s => s.content);

  if (!sections.length) return null;

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Cultivation Guide</h3>
      <div className="space-y-4">
        {sections.map((s, i) => (
          <div key={i} className="border border-gray-100 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 flex items-center gap-2 mb-2">
              <span>{s.icon}</span> {s.title}
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">{s.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
