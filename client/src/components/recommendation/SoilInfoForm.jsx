import { useState } from 'react';
import FileUpload from '../common/FileUpload';
import Select from '../common/Select';
import Input from '../common/Input';
import Button from '../common/Button';
import { SOIL_TYPES } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function SoilInfoForm({ data, onSave, onNext, onPrev }) {
  const [soilType, setSoilType] = useState(data?.soilType || '');
  const [soilImage, setSoilImage] = useState(data?.soilImage || null);
  const [soilPH, setSoilPH] = useState(data?.soilPH || '');

  const handleNext = () => {
    if (!soilType && !soilImage) {
      toast.error('Please provide at least one soil input: select soil type or upload a soil image.');
      return;
    }
    onSave({ soilType, soilImage, soilPH: soilPH ? parseFloat(soilPH) : null });
    onNext();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Soil Information</h2>
      <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
        ⚠ At least one soil input is required — select a soil type, upload a soil image, or both.
      </p>

      <Select label="Soil Condition" options={SOIL_TYPES} value={soilType}
              onChange={e => setSoilType(e.target.value)} placeholder="Select soil type" />

      <FileUpload label="Upload Soil Image (optional)" accept="image/*"
                  file={soilImage} onChange={setSoilImage} />

      <Input label="Soil pH (optional)" type="number" min={0} max={14} step={0.1}
             value={soilPH} onChange={e => setSoilPH(e.target.value)}
             placeholder="e.g. 6.5" />

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrev}>Back</Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
}
