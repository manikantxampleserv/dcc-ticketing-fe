import React, { useState, useRef, useEffect } from 'react';

export default function AllocateTicketModal({ onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Dummy user data for now
  const users = [
    { id: 1, first_name: 'Amit', last_name: 'Verma', email: 'amit@example.com' },
    { id: 2, first_name: 'Sara', last_name: 'Khan', email: 'sara@example.com' },
    { id: 3, first_name: 'John', last_name: 'Doe', email: 'john@example.com' }
  ];

  useEffect(() => {
    if (searchTerm) {
      const results = users.filter(
        u =>
          u.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(results);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm]);

  const handleUserSelect = user => {
    setSelectedUserId(user.id);
    setSearchTerm(`${user.first_name} ${user.last_name}`);
    setIsOpen(false);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      console.log('Allocated to user:', selectedUserId, 'Reason:', reason);
      setIsLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Allocate Ticket</h2>

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
                onChange={e => setSearchTerm(e.target.value)}
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
