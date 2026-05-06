import { Info } from 'lucide-react';

export default function Disclaimer() {
  return (
    <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-blue-800">
        <strong>Data Accuracy Notice:</strong> Providing more details such as soil condition,
        soil image, previous crop history, irrigation availability, and investment amount
        improves the accuracy of AI predictions. The more information you provide,
        the better our recommendations will be.
      </p>
    </div>
  );
}
