import { useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { LAND_UNITS } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function LandInfoForm({ data, onSave, onNext }) {
  const [size, setSize] = useState(data?.size || '');
  const [unit, setUnit] = useState(data?.unit || 'acre');
  const [location, setLocation] = useState(data?.location || '');

  const handleNext = () => {
    if (!size || !location) {
      toast.error('Please fill in land size and location.');
      return;
    }
    if (isNaN(size) || Number(size) <= 0) {
      toast.error('Land size must be a positive number.');
      return;
    }
    onSave({ size: Number(size), unit, location });
    onNext();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Land Information</h2>

      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Land Size" type="number" min={0} step="0.1" placeholder="e.g. 5"
               value={size} onChange={e => setSize(e.target.value)} />
        <Select label="Unit" options={LAND_UNITS} value={unit}
                onChange={e => setUnit(e.target.value)} />
      </div>

      <Input label="Location" type="text" placeholder="e.g. Coimbatore, Tamil Nadu"
             value={location} onChange={e => setLocation(e.target.value)} />

      <div className="flex justify-end pt-4">
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
}
