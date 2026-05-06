import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

export default function ProfitChart({ crops = [] }) {
  if (!crops.length) return null;

  const data = crops.map(c => ({
    name: c.cropName,
    investment: c.estimatedInvestment || 0,
    revenue: c.estimatedRevenue || 0,
    profit: (c.estimatedRevenue || 0) - (c.estimatedInvestment || 0),
  }));

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Profit Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
          <Tooltip formatter={v => formatCurrency(v)} />
          <Legend />
          <Bar dataKey="investment" fill="#f59e0b" name="Investment" radius={[4, 4, 0, 0]} />
          <Bar dataKey="revenue" fill="#10b981" name="Revenue" radius={[4, 4, 0, 0]} />
          <Bar dataKey="profit" fill="#3b82f6" name="Profit" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
