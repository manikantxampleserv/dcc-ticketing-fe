import React, { useState, useRef, useEffect } from 'react';
import { Search, Check, ChevronDown } from 'lucide-react';

export interface SearchableSelectOption {
  value: number;
  label: string;
  ticketNumber: string;
  subject: string;
  priority: string;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(
    option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) || option.value.toString().includes(searchTerm)
  );

  const selectedOption = options.find(option => option.value.toString() === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: number) => {
    onChange(optionValue.toString());
    setIsOpen(false);
    setSearchTerm('');
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'High':
        return 'text-red-600';
      case 'Medium':
        return 'text-yellow-600';
      case 'Low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 text-left bg-white border rounded-lg transition-all duration-200 ${
          isOpen ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-300 hover:border-gray-400'
        } ${!selectedOption ? 'text-gray-500' : 'text-gray-900'}`}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl max-h-80 overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full px-4 py-3 text-left hover:bg-indigo-50 transition-colors ${
                    value === option.value.toString() ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{option.ticketNumber}</div>
                      <div className="text-sm text-gray-500 truncate">{option.subject}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Priority:{' '}
                        <span className={`font-medium ${getPriorityColor(option.priority)}`}>{option.priority}</span>
                      </div>
                    </div>
                    {value === option.value.toString() && (
                      <Check className="h-5 w-5 text-indigo-600 flex-shrink-0 ml-2" />
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No tickets found</p>
                <p className="text-sm">Try adjusting your search term</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;

// Merge Modal
// interface MergeModalProps {
//   ticket: Ticket;
//   availableTickets: Ticket[];
//   onMerge: (parentTicketId: number, childTicketId: number, reason: string) => void;
//   onClose: () => void;
// }

// function MergeModal({ ticket, availableTickets, onMerge, onClose }: MergeModalProps) {
//   const [selectedTicketId, setSelectedTicketId] = useState('');
//   const [reason, setReason] = useState('');

//   const mergeableTickets = availableTickets.filter(t => t.id !== ticket.id && !t.is_merged && t.status !== 'Closed');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedTicketId || !reason.trim()) {
//       toast.error('Please select a ticket and provide a reason');
//       return;
//     }
//     onMerge(ticket?.id, Number(selectedTicketId), reason);
//     onClose();
//     toast.success('Tickets merged successfully');
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md">
//         <h2 className="text-lg font-semibold mb-4">Merge Tickets</h2>

//         <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
//           <div className="flex items-center">
//             <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
//             <span className="text-sm text-yellow-800">This ticket will become the parent ticket</span>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Merge with Ticket</label>
//             <select
//               required
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
//               value={selectedTicketId}
//               onChange={e => setSelectedTicketId(e.target.value)}
//             >
//               <option value="">Select a ticket to merge...</option>
//               {mergeableTickets.map(t => (
//                 <option key={t.id} value={t.id}>
//                   {t.ticket_number} - {t.subject} ({t.priority})
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Merge Reason *</label>
//             <textarea
//               required
//               rows={3}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
//               value={reason}
//               onChange={e => setReason(e.target.value)}
//               placeholder="Why are you merging these tickets?"
//             />
//           </div>

//           <div className="flex justify-end space-x-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
//               Merge Tickets
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
