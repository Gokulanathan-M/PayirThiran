export default function FertilizerList({ fertilizers = [] }) {
  if (!fertilizers.length) return null;

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommended Fertilizers</h3>
      <ul className="divide-y divide-gray-100">
        {fertilizers.map((f, i) => (
          <li key={i} className="py-3 flex items-start gap-3">
            <span className="text-green-600 mt-1">🧪</span>
            <div>
              <p className="font-medium text-gray-800">{f.name}</p>
              {f.dosage && <p className="text-sm text-gray-500">Dosage: {f.dosage}</p>}
              {f.timing && <p className="text-sm text-gray-500">When: {f.timing}</p>}
              {f.notes && <p className="text-sm text-gray-400 italic">{f.notes}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
