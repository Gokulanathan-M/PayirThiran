export default function Button({ children, variant = 'primary', className = '', loading = false, ...props }) {
  const base = 'px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md',
    secondary: 'bg-white text-primary-700 border border-primary-300 hover:bg-primary-50',
    outline: 'border border-gray-300 text-gray-600 hover:bg-gray-50',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
      {children}
    </button>
  );
}
