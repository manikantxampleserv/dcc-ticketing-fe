import { X } from 'lucide-react';
import React, { useState } from 'react';

// Remark Modal Component
interface RemarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (remark: string) => void;
  title: string;
  actionText: string;
  isLoading: boolean;
}

export const RemarkModal: React.FC<RemarkModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  actionText,
  isLoading
}) => {
  const [remark, setRemark] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remark.trim()) return;
    onSubmit(remark);
    setRemark('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" disabled={isLoading}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remark <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              value={remark}
              onChange={e => setRemark(e.target.value)}
              placeholder={`Please provide a remark for ${actionText.toLowerCase()}...`}
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!remark.trim() || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <span>{actionText}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
