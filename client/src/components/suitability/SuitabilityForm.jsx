import { useState } from 'react';
import Select from '../common/Select';
import Input from '../common/Input';
import FileUpload from '../common/FileUpload';
import Button from '../common/Button';
import { SOIL_TYPES, CROPS, SEASONS } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function SuitabilityForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    cropName: '',
    soilType: '',
    soilImage: null,
    soilPH: '',
    landSize: '',
    location: '',
    season: '',
  });

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e?.target ? e.target.value : e }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.cropName) return toast.error('Please select a crop to check suitability.');
    if (!form.soilType && !form.soilImage) return toast.error('Provide soil type or upload a soil image.');
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Check Crop Suitability</h2>
      <p className="text-sm text-gray-500">
        Select a specific crop and provide your soil &amp; land details to check if it's suitable for your farm.
      </p>

      <Select label="Crop to Check *" options={CROPS.filter(c => c.value !== 'none')} value={form.cropName}
              onChange={set('cropName')} placeholder="Select a crop" />

      <div className="grid md:grid-cols-2 gap-4">
        <Select label="Soil Condition" options={SOIL_TYPES} value={form.soilType}
                onChange={set('soilType')} placeholder="Select soil type" />
        <Input label="Soil pH (optional)" type="number" min={0} max={14} step={0.1}
               value={form.soilPH} onChange={set('soilPH')} placeholder="e.g. 6.5" />
      </div>

      <FileUpload label="Upload Soil Image (optional)" accept="image/*"
                  file={form.soilImage} onChange={(f) => setForm(prev => ({ ...prev, soilImage: f }))} />

      <div className="grid md:grid-cols-2 gap-4">
        <Input label="Land Size (acres)" type="number" min={0} step={0.1}
               value={form.landSize} onChange={set('landSize')} placeholder="e.g. 2.5" />
        <Input label="Location / Pincode" value={form.location}
               onChange={set('location')} placeholder="e.g. Nashik or 422001" />
      </div>

      <Select label="Growing Season" options={SEASONS} value={form.season}
              onChange={set('season')} placeholder="Select season" />

      <div className="text-right pt-2">
        <Button type="submit" loading={loading}>
          {loading ? 'Checking…' : 'Check Suitability'}
        </Button>
      </div>
    </form>
  );
}
