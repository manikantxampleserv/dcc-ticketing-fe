import React from 'react';

interface ConfirmDialogProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  title: string;
  description: string;
  loading?: boolean;
  onConfirm: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  setOpen,
  title,
  description,
  loading,
  onConfirm
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">{description}</p>

        <div className="mt-4 flex justify-end gap-2">
          <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={() => setOpen(false)}>
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            disabled={loading}
            onClick={onConfirm}
          >
            {loading ? 'Deleting...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};
