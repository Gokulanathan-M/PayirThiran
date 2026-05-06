import { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export default function FileUpload({ label, file, onChange, accept = 'image/*', error }) {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const selected = e.target.files[0];
    if (selected) onChange(selected);
  };

  const handleRemove = () => {
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}

      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition"
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Click to upload or drag & drop</p>
          <p className="text-xs text-gray-400 mt-1">Max file size: 5MB</p>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-primary-50 border border-primary-200 rounded-xl p-3">
          <ImageIcon className="w-8 h-8 text-primary-600" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          <button onClick={handleRemove} className="p-1 hover:bg-red-100 rounded-full transition">
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>
      )}

      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
