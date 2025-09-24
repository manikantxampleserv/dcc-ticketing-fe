import { AlertTriangle, Check, Merge, Paperclip, RotateCcw, Upload, UserPlus } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Ticket, User } from '../types';

interface TicketActionsProps {
  ticket: Ticket;
  users: User[];
  onAllocateTicket: (ticketId: string, userId: string, reason?: string) => void;
  onMergeTickets: (parentTicketId: string, childTicketId: string, reason: string) => void;
  onReopenTicket: (ticketId: string, reason: string) => void;
  onAddAttachment: (ticketId: string, file: File, isPublic: boolean) => void;
  availableTickets: Ticket[];
}

export default function TicketActions({
  ticket,
  users,
  onAllocateTicket,
  onMergeTickets,
  onReopenTicket,
  onAddAttachment,
  availableTickets
}: TicketActionsProps) {
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [showReopenModal, setShowReopenModal] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);

  const canAllocate = ticket.status !== 'closed';
  const canMerge = ticket.status !== 'closed' && !ticket.is_merged;
  const canReopen = ticket.status === 'resolved' || ticket.status === 'closed';
  const canAttach = ticket.status !== 'closed';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Actions</h3>

      <div className="grid grid-cols-2 gap-3">
        {/* Allocate Ticket */}
        <button
          onClick={() => setShowAllocateModal(true)}
          disabled={!canAllocate}
          className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
            canAllocate
              ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200'
          }`}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Allocate
        </button>

        {/* Merge Tickets */}
        <button
          onClick={() => setShowMergeModal(true)}
          disabled={!canMerge}
          className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
            canMerge
              ? 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200'
          }`}
        >
          <Merge className="h-4 w-4 mr-2" />
          Merge
        </button>

        {/* Reopen Ticket */}
        <button
          onClick={() => setShowReopenModal(true)}
          disabled={!canReopen}
          className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
            canReopen
              ? 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200'
          }`}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reopen
        </button>

        {/* Add Attachment */}
        <button
          onClick={() => setShowAttachmentModal(true)}
          disabled={!canAttach}
          className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
            canAttach
              ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200'
          }`}
        >
          <Paperclip className="h-4 w-4 mr-2" />
          Attach
        </button>
      </div>

      {/* Ticket Info */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600 space-y-1">
          {ticket?.reopen_count && ticket?.reopen_count > 0 && (
            <div className="flex items-center text-orange-600">
              <RotateCcw className="h-4 w-4 mr-1" />
              Reopened {ticket.reopen_count} time(s)
            </div>
          )}
          {ticket.is_merged && (
            <div className="flex items-center text-purple-600">
              <Merge className="h-4 w-4 mr-1" />
              Merged ticket
            </div>
          )}
          {ticket?.attachments?.length > 0 && (
            <div className="flex items-center text-blue-600">
              <Paperclip className="h-4 w-4 mr-1" />
              {ticket?.attachments?.length} attachment(s)
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAllocateModal && (
        <AllocateModal
          ticket={ticket}
          users={users}
          onAllocate={onAllocateTicket}
          onClose={() => setShowAllocateModal(false)}
        />
      )}

      {showMergeModal && (
        <MergeModal
          ticket={ticket}
          availableTickets={availableTickets}
          onMerge={onMergeTickets}
          onClose={() => setShowMergeModal(false)}
        />
      )}

      {showReopenModal && (
        <ReopenModal ticket={ticket} onReopen={onReopenTicket} onClose={() => setShowReopenModal(false)} />
      )}

      {showAttachmentModal && (
        <AttachmentModal
          ticket={ticket}
          onAddAttachment={onAddAttachment}
          onClose={() => setShowAttachmentModal(false)}
        />
      )}
    </div>
  );
}

// Allocate Modal
interface AllocateModalProps {
  ticket: Ticket;
  users: User[];
  onAllocate: (ticketId: string, userId: string, reason?: string) => void;
  onClose: () => void;
}

function AllocateModal({ ticket, onAllocate, onClose }: AllocateModalProps) {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      toast.error('Please select a user');
      return;
    }
    onAllocate(ticket?.id, selectedUserId, reason);
    onClose();
    toast.success('Ticket allocated successfully');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Allocate Ticket</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign to User</label>
            <select
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              value={selectedUserId}
              onChange={e => setSelectedUserId(e.target.value)}
            >
              <option value="">Select a user...</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason (Optional)</label>
            <textarea
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Why are you allocating this ticket?"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Allocate Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Merge Modal
interface MergeModalProps {
  ticket: Ticket;
  availableTickets: Ticket[];
  onMerge: (parentTicketId: string, childTicketId: string, reason: string) => void;
  onClose: () => void;
}

function MergeModal({ ticket, availableTickets, onMerge, onClose }: MergeModalProps) {
  const [selectedTicketId, setSelectedTicketId] = useState('');
  const [reason, setReason] = useState('');

  const mergeableTickets = availableTickets.filter(t => t.id !== ticket.id && !t.is_merged && t.status !== 'closed');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId || !reason.trim()) {
      toast.error('Please select a ticket and provide a reason');
      return;
    }
    onMerge(ticket?.id, selectedTicketId, reason);
    onClose();
    toast.success('Tickets merged successfully');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Merge Tickets</h2>

        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
            <span className="text-sm text-yellow-800">This ticket will become the parent ticket</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Merge with Ticket</label>
            <select
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              value={selectedTicketId}
              onChange={e => setSelectedTicketId(e.target.value)}
            >
              <option value="">Select a ticket to merge...</option>
              {mergeableTickets.map(t => (
                <option key={t.id} value={t.id}>
                  {t.ticket_number} - {t.subject} ({t.priority})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Merge Reason *</label>
            <textarea
              required
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Why are you merging these tickets?"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
              Merge Tickets
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Reopen Modal
interface ReopenModalProps {
  ticket: Ticket;
  onReopen: (ticketId: string, reason: string) => void;
  onClose: () => void;
}

function ReopenModal({ ticket, onReopen, onClose }: ReopenModalProps) {
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error('Please provide a reason for reopening');
      return;
    }
    onReopen(ticket?.id, reason);
    onClose();
    toast.success('Ticket reopened successfully');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Reopen Ticket</h2>

        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-orange-600 mr-2" />
            <span className="text-sm text-orange-800">This will change the ticket status back to "Open"</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Reopening *</label>
            <textarea
              required
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Why are you reopening this ticket?"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
              Reopen Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Attachment Modal
interface AttachmentModalProps {
  ticket: Ticket;
  onAddAttachment: (ticketId: string, file: File, isPublic: boolean) => void;
  onClose: () => void;
}

function AttachmentModal({ ticket, onAddAttachment, onClose }: AttachmentModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    // Check file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error('File type not supported');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }
    onAddAttachment(ticket?.id, selectedFile, isPublic);
    onClose();
    toast.success('Attachment added successfully');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Add Attachment</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select File</label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragOver ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={e => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="space-y-2">
                  <Check className="h-8 w-8 text-green-500 mx-auto" />
                  <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-600">
                    Drag and drop a file here, or{' '}
                    <label className="text-primary-600 hover:text-primary-500 cursor-pointer">
                      browse
                      <input
                        type="file"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) handleFileSelect(file);
                        }}
                      />
                    </label>
                  </p>
                  <p className="text-xs text-gray-500">Max 10MB • PDF, DOC, XLS, Images</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                checked={isPublic}
                onChange={e => setIsPublic(e.target.checked)}
              />
              <span className="ml-2 text-sm text-gray-600">Make visible to customer</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Attachment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
