import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

export default function FinancialForm({ data, onSave, onSubmit, onPrev, loading }) {
  const [investmentAmount, setInvestmentAmount] = useState(data?.investmentAmount || '');

  const handleSubmit = () => {
    const saved = { investmentAmount: investmentAmount ? parseFloat(investmentAmount) : null };
    onSave(saved);
    onSubmit(saved);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Financial Information</h2>
      <p className="text-sm text-gray-500">
        Optional — helps estimate profitability and ROI for each recommended crop.
      </p>

      <Input label="Investment Budget (₹)" type="number" min={0} step={100}
             value={investmentAmount} onChange={e => setInvestmentAmount(e.target.value)}
             placeholder="e.g. 50000" />

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrev}>Back</Button>
        <Button onClick={handleSubmit} loading={loading}>
          {loading ? 'Analysing…' : 'Get Recommendations'}
        </Button>
      </div>
    </div>
  );
}
