import { useState } from 'react';
import Select from '../common/Select';
import Button from '../common/Button';
import { CROPS, SEASONS } from '../../utils/constants';

export default function CropHistoryForm({ data, onSave, onNext, onPrev }) {
  const [previousCrop, setPreviousCrop] = useState(data?.previousCrop || '');
  const [season, setSeason] = useState(data?.season || '');

  const handleNext = () => {
    onSave({ previousCrop, season });
    onNext();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Crop History &amp; Season</h2>
      <p className="text-sm text-gray-500">Optional — helps the AI suggest better crop rotations.</p>

      <Select label="Previous Crop Grown" options={CROPS} value={previousCrop}
              onChange={e => setPreviousCrop(e.target.value)} placeholder="Select previous crop" />

      <Select label="Intended Growing Season" options={SEASONS} value={season}
              onChange={e => setSeason(e.target.value)} placeholder="Select season" />

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrev}>Back</Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
}
