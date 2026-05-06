import { useState, useEffect } from 'react';
import { profileService } from '../../services/profileService';
import Loader from '../common/Loader';

export default function LandList() {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileService.getLands()
      .then(res => setLands(res.data.lands || res.data || []))
      .catch(() => setLands([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Saved Lands</h2>
      {lands.length === 0 ? (
        <p className="text-gray-500 text-sm">No saved lands. Complete a recommendation to save your land details.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {lands.map((land, i) => (
            <li key={i} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">{land.location || `Land ${i + 1}`}</p>
                <p className="text-sm text-gray-500">{land.landSize} {land.landUnit} · {land.soilType || 'Unknown soil'}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
