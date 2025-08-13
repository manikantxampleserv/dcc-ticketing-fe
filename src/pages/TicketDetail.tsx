import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  User,
  Calendar,
  MessageSquare,
  Paperclip,
  Send,
  Star,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  Square,
  Download,
  Eye,
  FileText,
  Image,
  File
} from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import { formatDistanceToNow, format } from 'date-fns';
import toast from 'react-hot-toast';
import TicketActions from '../components/TicketActions';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, updateTicket } = useTickets();
  const [newMessage, setNewMessage] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const ticket = state.tickets.find(t => t.id === id);
  const assignedAgent = ticket?.assignedTo ? state.agents.find(a => a.id === ticket.assignedTo) : null;

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Ticket not found</h3>
        <button onClick={() => navigate('/tickets')} className="mt-4 text-primary-600 hover:text-primary-500">
          Back to tickets
        </button>
      </div>
    );
  }

  const handleAllocateTicket = (ticketId: string, userId: string, reason?: string) => {
    // Implementation for ticket allocation
    console.log('Allocating ticket:', ticketId, 'to user:', userId, 'reason:', reason);
  };

  const handleMergeTickets = (parentTicketId: string, childTicketId: string, reason: string) => {
    // Implementation for ticket merging
    console.log('Merging tickets:', parentTicketId, childTicketId, 'reason:', reason);
  };

  const handleReopenTicket = (ticketId: string, reason: string) => {
    // Implementation for ticket reopening
    console.log('Reopening ticket:', ticketId, 'reason:', reason);
  };

  const handleAddAttachment = (ticketId: string, file: File, isPublic: boolean) => {
    // Implementation for adding attachments
    console.log('Adding attachment to ticket:', ticketId, 'file:', file.name, 'public:', isPublic);
  };

  const handleStatusChange = (newStatus: string) => {
    const updatedTicket = {
      ...ticket,
      status: newStatus as any,
      updatedAt: new Date().toISOString(),
      ...(newStatus === 'resolved' && { resolvedAt: new Date().toISOString() }),
      ...(newStatus === 'closed' && { closedAt: new Date().toISOString() })
    };
    updateTicket(updatedTicket);
    toast.success(`Ticket ${newStatus}`);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newResponse = {
      id: Date.now().toString(),
      ticketId: ticket.id,
      message: newMessage,
      author: state.currentUser?.name || 'Agent',
      authorType: 'agent' as const,
      createdAt: new Date().toISOString(),
      isInternal,
      attachments: attachments.map(file => ({
        id: Date.now().toString() + Math.random(),
        ticketId: ticket.id,
        fileName: file.name,
        originalFileName: file.name,
        filePath: URL.createObjectURL(file),
        fileSize: file.size,
        contentType: file.type,
        fileHash: '',
        uploadedBy: state.currentUser?.id || '',
        uploadedByType: 'user' as const,
        isPublic: !isInternal,
        virusScanned: false,
        createdAt: new Date().toISOString()
      }))
    };

    const updatedTicket = {
      ...ticket,
      responses: [...ticket.responses, newResponse],
      updatedAt: new Date().toISOString(),
      ...(ticket.status === 'open' && { status: 'in-progress' as const })
    };

    updateTicket(updatedTicket);
    setNewMessage('');
    setIsInternal(false);
    setAttachments([]);
    toast.success('Response sent');
  };

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (contentType === 'application/pdf') return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'in-progress':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'resolved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'closed':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSLAColor = (slaStatus: string) => {
    switch (slaStatus) {
      case 'breached':
        return 'text-red-600 bg-red-50';
      case 'approaching':
        return 'text-yellow-600 bg-yellow-50';
      case 'within':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/tickets')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{ticket.ticketNumber}</h1>
            <p className="text-gray-600">{ticket.subject}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {ticket.status !== 'closed' && (
            <>
              {ticket.status === 'open' && (
                <button
                  onClick={() => handleStatusChange('in-progress')}
                  className="flex items-center px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Work
                </button>
              )}

              {ticket.status === 'in-progress' && (
                <>
                  <button
                    onClick={() => handleStatusChange('open')}
                    className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </button>
                  <button
                    onClick={() => handleStatusChange('resolved')}
                    className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Resolve
                  </button>
                </>
              )}

              {ticket.status === 'resolved' && (
                <button
                  onClick={() => handleStatusChange('closed')}
                  className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Close
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Description */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>

            {ticket.attachments.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Attachments</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ticket.attachments.map(attachment => (
                    <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(attachment.contentType)}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{attachment.originalFileName}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(attachment.fileSize)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => window.open(attachment.filePath, '_blank')}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = attachment.filePath;
                            link.download = attachment.originalFileName;
                            link.click();
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Responses */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Conversation</h2>
            </div>

            <div className="divide-y divide-gray-200">
              {ticket.responses.map(response => (
                <div key={response.id} className={`p-6 ${response.isInternal ? 'bg-yellow-50' : ''}`}>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{response.author}</span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            response.authorType === 'agent'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {response.authorType}
                        </span>
                        {response.isInternal && (
                          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Internal</span>
                        )}
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(response.createdAt), {
                            addSuffix: true
                          })}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{response.message}</p>

                      {/* Response Attachments */}
                      {response.attachments && response.attachments.length > 0 && (
                        <div className="mt-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {response.attachments.map(attachment => (
                              <div
                                key={attachment.id}
                                className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded"
                              >
                                <div className="flex items-center space-x-2">
                                  {getFileIcon(attachment.contentType)}
                                  <div>
                                    <p className="text-xs font-medium text-gray-900">{attachment.originalFileName}</p>
                                    <p className="text-xs text-gray-500">{formatFileSize(attachment.fileSize)}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <button
                                    onClick={() => window.open(attachment.filePath, '_blank')}
                                    className="p-1 text-gray-400 hover:text-gray-600"
                                    title="View"
                                  >
                                    <Eye className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      const link = document.createElement('a');
                                      link.href = attachment.filePath;
                                      link.download = attachment.originalFileName;
                                      link.click();
                                    }}
                                    className="p-1 text-gray-400 hover:text-gray-600"
                                    title="Download"
                                  >
                                    <Download className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Form */}
            {ticket.status !== 'closed' && (
              <div className="p-6 border-t border-gray-200">
                <div className="space-y-4">
                  <textarea
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Type your response..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                  />

                  {/* File Attachments */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />

                    {attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center space-x-2">
                              {getFileIcon(file.type)}
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                            </div>
                            <button onClick={() => removeAttachment(index)} className="text-red-500 hover:text-red-700">
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={isInternal}
                        onChange={e => setIsInternal(e.target.checked)}
                      />
                      <span className="ml-2 text-sm text-gray-600">Internal note</span>
                    </label>
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ticket Actions */}
          <TicketActions
            ticket={ticket}
            users={[]} // You'll need to pass actual users from context
            onAllocateTicket={handleAllocateTicket}
            onMergeTickets={handleMergeTickets}
            onReopenTicket={handleReopenTicket}
            onAddAttachment={handleAddAttachment}
            availableTickets={state.tickets.filter(t => t.id !== ticket.id)}
          />

          {/* Ticket Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Information</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(ticket.status)}`}
                  >
                    {ticket.status.replace('-', ' ')}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Priority</label>
                <div className="mt-1">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(ticket.priority)}`}
                  >
                    {ticket.priority}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">SLA Status</label>
                <div className="mt-1">
                  <div className={`flex items-center px-2 py-1 rounded-md ${getSLAColor(ticket.slaStatus)}`}>
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">{ticket.slaStatus}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Assigned To</label>
                <div className="mt-1">
                  {assignedAgent ? (
                    <div className="flex items-center">
                      {assignedAgent.avatar && (
                        <img
                          src={assignedAgent.avatar}
                          alt={assignedAgent.name}
                          className="h-6 w-6 rounded-full mr-2"
                        />
                      )}
                      <span className="text-sm text-gray-900">{assignedAgent.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Unassigned</span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Time Spent</label>
                <div className="mt-1 flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-gray-400" />
                  <span className="text-sm text-gray-900">
                    {Math.floor(ticket.timeSpent / 60)}h {ticket.timeSpent % 60}m
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <div className="mt-1 flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                  <span className="text-sm text-gray-900">
                    {format(new Date(ticket.createdAt), 'MMM d, yyyy HH:mm')}
                  </span>
                </div>
              </div>

              {ticket.resolvedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Resolved</label>
                  <div className="mt-1 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                    <span className="text-sm text-gray-900">
                      {format(new Date(ticket.resolvedAt), 'MMM d, yyyy HH:mm')}
                    </span>
                  </div>
                </div>
              )}

              {ticket?.reopenCount && ticket?.reopenCount > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Reopen Count</label>
                  <div className="mt-1">
                    <span className="text-sm text-orange-600 font-medium">{ticket.reopenCount}</span>
                  </div>
                </div>
              )}

              {ticket.isMerged && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Merged Status</label>
                  <div className="mt-1">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                      Merged Ticket
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-sm text-gray-900">{ticket.customerName}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm text-gray-900">{ticket.customerEmail}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Company</label>
                <p className="text-sm text-gray-900">{ticket.customerCompany}</p>
              </div>
            </div>
          </div>

          {/* Customer Satisfaction */}
          {ticket.customerSatisfaction && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Feedback</h3>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Rating</label>
                  <div className="flex items-center mt-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= ticket.customerSatisfaction! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">{ticket.customerSatisfaction}/5</span>
                  </div>
                </div>

                {ticket.feedbackComment && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Comment</label>
                    <p className="text-sm text-gray-900 mt-1">{ticket.feedbackComment}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
