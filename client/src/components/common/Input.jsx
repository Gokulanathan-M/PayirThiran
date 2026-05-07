export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <input
        className={`w-full px-4 py-2.5 rounded-xl border transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${
          error ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
