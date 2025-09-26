import { AlertTriangle, Check, GitMerge, Merge, Paperclip, RotateCcw, Upload, UserPlus, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Ticket, User } from '../types';
import SearchableSelect, { SearchableSelectOption } from 'shared/CustomTicketSelect';

interface TicketActionsProps {
  ticket: Ticket;
  users: User[];

  // setSearchUser: () => void;
  onAllocateTicket: (ticketId: number, userId: number, reason?: string) => void;
  onMergeTickets: (parentTicketId: number, childTicketId: number, reason: string) => void;
  onReopenTicket: (ticketId: number, reason: string) => void;
  onAddAttachment: (ticketId: number, fileName: string, file: File, isPublic: boolean) => void;
  availableTickets: Ticket[];
  searchUser: string;
}

export default function TicketActions({
  ticket,
  users,
  onAllocateTicket,
  onMergeTickets,
  onReopenTicket,
  onAddAttachment,
  availableTickets,
  searchUser
}: // setSearchUser
TicketActionsProps) {
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [showReopenModal, setShowReopenModal] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);

  const canAllocate = ticket.status !== 'Closed' && ticket.status !== 'Merged';
  const canMerge = ticket.status !== 'Closed' && !ticket.is_merged;
  const canReopen = ticket.status !== 'Merged' && (ticket.status === 'Resolved' || ticket.status === 'Closed');
  const canAttach = ticket.status !== 'Closed' && ticket.status !== 'Merged';

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
      {((ticket?.reopen_count !== undefined && ticket?.reopen_count > 0) ||
        ticket.is_merged ||
        ticket?.attachments?.length > 0) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 space-y-1">
            {ticket?.reopen_count !== undefined && ticket?.reopen_count > 0 && (
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
      )}

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
  onAllocate: (ticketId: number, userId: number, reason?: string) => void;
  onClose: () => void;
}

function AllocateModal({ ticket, users, onAllocate, onClose }: AllocateModalProps) {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users || []);
    } else {
      const filtered = users?.filter(
        user =>
          `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered || []);
    }
  }, [searchTerm, users]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUserSelect = (user: User) => {
    setSelectedUserId(user.id);
    setSearchTerm(`${user.first_name} ${user.last_name}`);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedUserId('');
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      toast.error('Please select a user');
      return;
    }

    setIsLoading(true);
    try {
      await onAllocate(ticket?.id, Number(selectedUserId), reason);
      onClose();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Allocate Ticket</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Searchable User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <label htmlFor="user-search" className="block text-sm font-medium text-gray-700 mb-2">
              Assign to User
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                id="user-search"
                type="text"
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={() => setIsOpen(true)}
                autoComplete="off"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <div
                      key={user.id}
                      onClick={() => handleUserSelect(user)}
                      className="px-4 py-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {user.first_name.charAt(0)}
                            {user.last_name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </div>
                          {user.email && <div className="text-sm text-gray-500">{user.email}</div>}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500 text-center">No users found matching "{searchTerm}"</div>
                )}
              </div>
            )}
          </div>

          {/* Reason Textarea */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Reason (Optional)
            </label>
            <textarea
              id="reason"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Why are you allocating this ticket?"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
              disabled={!selectedUserId || isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Allocating...</span>
                </>
              ) : (
                <span>Allocate Ticket</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Merge Modal
// Priority Badge Component
interface PriorityBadgeProps {
  priority: string;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const colors: Record<string, string> = {
    High: '!bg-red-100 !text-red-800 !border-red-200',
    Medium: '!bg-yellow-100 !text-yellow-800 !border-yellow-200',
    Low: '!bg-green-100 !text-green-800 !border-green-200'
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
        colors[priority] || colors.Low
      }`}
    >
      {priority}
    </span>
  );
};

// Main MergeModal Component
interface MergeModalProps {
  ticket: Ticket;
  availableTickets: Ticket[];
  onMerge: (parentTicketId: number, childTicketId: number, reason: string) => void;
  onClose: () => void;
}

const MergeModal: React.FC<MergeModalProps> = ({ ticket, availableTickets, onMerge, onClose }) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Filter tickets that can be merged
  const mergeableTickets = availableTickets.filter(
    t => t.id !== ticket.id && !t.is_merged && t.status !== 'Closed' && t.status !== 'Merged'
  );

  // Transform tickets into searchable options
  const selectOptions: SearchableSelectOption[] = mergeableTickets.map(t => ({
    value: t.id,
    label: `${t.ticket_number} - ${t.subject}`,
    ticketNumber: t.ticket_number,
    subject: t.subject,
    priority: t.priority
  }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedTicketId || !reason.trim()) {
      toast.error('Please select a ticket and provide a reason');
      return;
    }

    setIsSubmitting(true);

    try {
      await onMerge(Number(selectedTicketId), ticket.id, reason);
      // toast.success('Tickets merged successfully');
      onClose();
    } catch (error) {
      console.error('Error merging tickets:', error);
      toast.error('Failed to merge tickets');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Find the selected ticket for preview
  const selectedTicket = mergeableTickets.find(t => t.id.toString() === selectedTicketId);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <GitMerge className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Merge Tickets</h2>
              <p className="text-sm text-gray-500 mt-1">Combine two related tickets into one</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" type="button">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 py-4 space-y-3">
          {/* Parent Ticket Info */}
          {/* <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-indigo-900 mb-1">Parent Ticket</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{ticket.ticket_number}</span>
                    <PriorityBadge priority={ticket.priority} />
                  </div>
                  <p className="text-gray-700 text-sm">{ticket.subject}</p>
                </div>
                <div className="mt-3 p-3 bg-white/70 rounded-md border border-indigo-100">
                  <p className="text-xs text-indigo-700 font-medium">
                    ℹ️ This ticket will remain active and contain all merged conversations and history
                  </p>
                </div>
              </div>
            </div>
          </div> */}
          <div className="mt-1 p-3  bg-cyan-50 rounded-md border border-indigo-100">
            <p className="text-xs text-indigo-700 font-medium">
              ℹ️ This ticket will continue as the primary parent ticket, maintaining its current workflow.
            </p>
          </div>
          <div className="space-y-6">
            {/* Ticket Selection */}
            <div className="space-y-2">
              <label htmlFor="ticket-select" className="block text-sm font-semibold text-gray-900">
                Select Ticket to Merge <span className="text-red-500">*</span>
              </label>
              {/* <p className="text-xs text-gray-600 mb-3">Choose the ticket that will be merged as the parent ticket</p> */}
              <SearchableSelect
                options={selectOptions}
                value={selectedTicketId}
                onChange={setSelectedTicketId}
                placeholder="Search and select a ticket..."
                required
              />
              {!selectedTicketId && (
                <p className="text-xs text-gray-500 mt-2">{mergeableTickets.length} ticket(s) available for merging</p>
              )}
            </div>

            {/* Selected Ticket Preview */}
            {selectedTicket && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-1.5 flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  Parent Ticket (will be merged)
                </h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{selectedTicket.ticket_number}</span>
                    <PriorityBadge priority={selectedTicket.priority} />
                  </div>
                  <p className="text-gray-700  mt-0 text-sm">{selectedTicket.subject}</p>
                  <p className="text-xs text-gray-500">Status: {selectedTicket.status}</p>
                </div>
              </div>
            )}

            {/* Reason */}
            <div className="space-y-2">
              <label htmlFor="merge-reason" className="block text-sm font-semibold text-gray-900">
                Merge Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                id="merge-reason"
                required
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-200"
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Explain why these tickets should be merged (e.g., duplicate issue, related problems, same user request...)"
                maxLength={500}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">This reason will be added to both tickets' history</p>
                <span className="text-xs text-gray-400">{reason.length}/500</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedTicketId || !reason.trim() || isSubmitting}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Merging...</span>
                  </>
                ) : (
                  <>
                    <GitMerge className="h-4 w-4" />
                    <span>Merge Tickets</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Reopen Modal
interface ReopenModalProps {
  ticket: Ticket;
  onReopen: (ticketId: number, reason: string) => void;
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
    // toast.success('Ticket reopened successfully');
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
  onAddAttachment: (ticketId: number, fileName: string, file: File, isPublic: boolean) => void;
  onClose: () => void;
}

function AttachmentModal({ ticket, onAddAttachment, onClose }: AttachmentModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');

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
    onAddAttachment(ticket?.id, fileName, selectedFile, isPublic);
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
            <input
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              value={fileName}
              onChange={e => setFileName(e.target.value)}
              placeholder="Why are you merging these tickets?"
            />
          </div>
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
