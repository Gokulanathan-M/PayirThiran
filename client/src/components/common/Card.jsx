export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 sm:p-8 ${className}`} {...props}>
      {children}
    </div>
  );
}
