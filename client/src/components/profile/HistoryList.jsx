import { useState, useEffect } from 'react';
import { recommendationService } from '../../services/recommendationService';
import Loader from '../common/Loader';
import { formatDate } from '../../utils/formatters';

export default function HistoryList() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    recommendationService.getHistory()
      .then(res => setHistory(res.data.history || res.data || []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommendation History</h2>
      {history.length === 0 ? (
        <p className="text-gray-500 text-sm">No history yet. Run your first crop recommendation!</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {history.map((h, i) => (
            <li key={i} className="py-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800">
                    {h.crops?.map(c => c.cropName).join(', ') || 'Analysis'}
                  </p>
                  <p className="text-sm text-gray-500">{h.location || 'Unknown location'}</p>
                </div>
                <span className="text-xs text-gray-400">{formatDate(h.createdAt)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
