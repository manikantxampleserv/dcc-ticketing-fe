import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import CustomSelect from 'shared/CustomSelect';
import { usersFn } from 'services/users';
import { addCcToTicket } from 'services/CCTicket';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role?: string;
}

interface AllocateTicketModalProps {
  onClose: () => void;
  ticket_id: number;
}

const AllocateTicketModal: React.FC<AllocateTicketModalProps> = ({ onClose, ticket_id }) => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch users
  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersFn({ page: 1, limit: 1000 })
  });

  const agents: User[] = usersData?.data || [];

  // Filtered users for searchable dropdown
  const filteredAgents = useMemo(() => {
    if (!searchTerm) return agents;
    return agents.filter(a => `${a.first_name} ${a.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [agents, searchTerm]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUserId) return;

    setIsLoading(true);

    try {
      await addCcToTicket({
        ticket_id: ticket_id, // pass the ticket ID here
        user_id: selectedUserId
      });

      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Add <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-sm">(CC)</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Searchable Dropdown */}
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedUserId || ''}
            onChange={e => setSelectedUserId(Number(e.target.value))}
            required
          >
            <option value="">Select an agent</option>
            {agents.map(a => (
              <option key={a.id} value={a.id}>
                {a.first_name} {a.last_name}
              </option>
            ))}
          </select>

          {/* Optional reason */}
          <div>
            <label className="block text-gray-700 mb-1">Reason (optional)</label>
            <input
              type="text"
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter reason"
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
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Adding...</span>
                </>
              ) : (
                <span>Add CC</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AllocateTicketModal;
