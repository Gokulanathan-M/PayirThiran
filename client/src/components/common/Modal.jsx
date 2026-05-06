export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        {title && <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>}
        {children}
      </div>
    </div>
  );
}
