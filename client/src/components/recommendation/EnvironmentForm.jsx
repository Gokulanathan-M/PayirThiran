import { useState } from 'react';
import Select from '../common/Select';
import Button from '../common/Button';
import { MOISTURE_LEVELS } from '../../utils/constants';

const IRRIGATION_OPTIONS = [
  { value: '', label: 'Select irrigation type' },
  { value: 'drip', label: 'Drip Irrigation' },
  { value: 'sprinkler', label: 'Sprinkler' },
  { value: 'flood', label: 'Flood / Surface' },
  { value: 'rainfed', label: 'Rain-fed (No Irrigation)' },
  { value: 'manual', label: 'Manual Watering' },
];

export default function EnvironmentForm({ data, onSave, onNext, onPrev }) {
  const [irrigation, setIrrigation] = useState(data?.irrigation || '');
  const [soilMoisture, setSoilMoisture] = useState(data?.soilMoisture || '');

  const handleNext = () => {
    onSave({ irrigation, soilMoisture });
    onNext();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Environment &amp; Irrigation</h2>
      <p className="text-sm text-gray-500">These fields are optional but help improve accuracy.</p>

      <Select label="Irrigation Type" options={IRRIGATION_OPTIONS} value={irrigation}
              onChange={e => setIrrigation(e.target.value)} placeholder="Select irrigation type" />

      <Select label="Soil Moisture Level" options={MOISTURE_LEVELS} value={soilMoisture}
              onChange={e => setSoilMoisture(e.target.value)} placeholder="Select moisture level" />

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrev}>Back</Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
}
