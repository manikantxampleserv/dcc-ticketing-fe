import React, { useEffect, useRef, useState } from 'react';
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
import { createCommentFn, ticketFn, updateTicketFn } from 'services/Ticket';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import TicketDetailSkeleton from './Ticket/TicketDetailSkeleton';
import { TicketComment } from 'types/Tickets';
import { usersFn } from 'services/users';
// ✅ Import react-mentions
import { MentionsInput, Mention } from 'react-mentions';
import MentionEditor from './TicketComment';
import { Ticket } from 'types/index';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, updateTicket } = useTickets();
  const [newMessage, setNewMessage] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [attachments, setAttachments] = useState<File | null>(null);
  const [searchUser, setSearchUser] = useState('');
  // ✅ Add mentions state
  const [mentionedUsers, setMentionedUsers] = useState<{ id: string; display: string }[]>([]);

  const client = useQueryClient();
  const conversationRef = useRef<HTMLDivElement>(null);

  const {
    data: TicketDetail,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['tickets-details', id],
    queryFn: () => ticketFn(Number(id))
  });
  const ticket = TicketDetail?.data;

  const { mutate: createComment, isPending: isCreating } = useMutation({
    mutationFn: createCommentFn,
    onSuccess: (res: any) => {
      toast.success(res.data?.message || 'Send comment successfully!');
      client.refetchQueries({ queryKey: ['tickets'] });
    }
  });
  const { mutate: updateTicketStatus, isPending: isUpdating } = useMutation({
    mutationFn: updateTicketFn,
    onSuccess: (response: any) => {
      toast.success(response.message || 'Ticket updated successfully!');
      client.refetchQueries({ queryKey: ['tickets-update'] });
      refetch();
    }
  });

  const { data: usersData, isLoading: isLoadingUser } = useQuery({
    queryKey: ['users', searchUser],
    queryFn: () =>
      usersFn({
        search: searchUser || ''
      })
  });

  const userList = usersData?.data || [];

  // Prepare mention data for react-mentions
  const mentionData = userList.map((user: any) => ({
    id: user.id,
    display: user.email || user.name || ''
  }));

  // Add this useEffect to scroll to bottom when comments change
  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [ticket?.ticket_comments]);

  // const searchUsersHandler = (query: any, callback: any) => {
  //   setSearchUser(query);
  //   if (!query) {
  //     callback(mentionData);
  //     return;
  //   }
  //   // Support multi-word search
  //   const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  //   const filtered = mentionData.filter((user: any) =>
  //     terms.every((term: any) => user.display.toLowerCase().includes(term))
  //   );
  //   callback(filtered);
  // };
  const searchUsersHandler = (query: string, callback: any) => {
    setSearchUser(query);

    // Already mentioned user IDs
    const mentionedIds = mentionedUsers.map(m => m.id);

    // Filter users not already mentioned
    const availableUsers = mentionData.filter((user: any) => !mentionedIds.includes(user.id.toString()));

    console.log('Available Users for Mention:', availableUsers);
    if (!query) {
      callback(availableUsers);
      return;
    }

    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const filtered = availableUsers.filter((user: any) =>
      terms.every(term => user.display.toLowerCase().includes(term))
    );
    callback(filtered);
  };
  // const searchUsersHandler = async (searchTerm: string) => {
  //   setSearchUser(searchTerm);

  //   // Get IDs already mentioned to exclude
  //   const mentionedIds = mentionedUsers.map(m => m.id.toString());

  //   // Filter out already mentioned users
  //   const availableUsers = mentionData.filter((user: any) => !mentionedIds.includes(user.id.toString()));

  //   if (!searchTerm) {
  //     // Return all available users if search term empty
  //     return availableUsers;
  //   }

  //   const terms = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
  //   const filtered = availableUsers.filter((user: any) =>
  //     terms.every(term => user.display.toLowerCase().includes(term))
  //   );

  //   return filtered;
  // };

  // Extract mentioned user IDs from markup string
  const extractMentions = (text: string) => {
    const regex = /@\[(.+?)\]\((.+?)\)/g;
    const mentioned: { id: string; display: string }[] = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      mentioned.push({ id: match[2], display: match[1] });
    }
    return mentioned;
  };

  // const onChangeHandler = (event: any, newValue: any, newPlainText: any, newMentions: any) => {
  //   setNewMessage(newValue);
  //   setMentionedUsers(newMentions);
  // };
  const onChangeHandler = (event: any, newValue: any, newPlainText: any, newMentions: any) => {
    console.log('New Mentions:', newMentions);
    setNewMessage(newValue); // clean text with @user
    setMentionedUsers(newMentions); // array of { id, display }
  };

  // Usage inside onChangeHandler:
  // const onChangeHandler = (value: string) => {
  //   setNewMessage(value);
  //   const extractMentions = (html: string) => {
  //     const regex = /@\[([^\]]+)\]\([^\)]+\)/g;
  //     const mentions: string[] = [];
  //     let match;
  //     while ((match = regex.exec(html)) !== null) {
  //       mentions.push(match[1]); // match[1] contains display name inside @[display](id)
  //     }
  //     return mentions;
  //   };
  //   const mentioned = extractMentions(value);
  //   // Update mentionedUsers based on extracted mention display names or ids
  //   // This requires mapping display names or IDs to user data from your mention data
  // };

  if (isLoading) {
    return <TicketDetailSkeleton />;
  }

  if (!ticket && !isLoading) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Ticket not found</h3>
        <button onClick={() => navigate(-1)} className="mt-4 text-primary-600 hover:text-primary-500">
          Back to tickets
        </button>
      </div>
    );
  }

  const handleAllocateTicket = (ticketId: number, userId: number, reason?: string) => {
    console.log('Allocating ticket:', ticketId, 'to user:', userId, 'reason:', reason);
    updateTicketStatus({ id: ticketId, assigned_agent_id: Number(userId) });
  };

  const handleMergeTickets = (parentTicketId: number, childTicketId: number, reason: string) => {
    console.log('Merging tickets:', parentTicketId, childTicketId, 'reason:', reason);
  };

  const handleReopenTicket = (ticketId: number, reason: string) => {
    console.log('Reopening ticket:', ticketId, 'reason:', reason);
    updateTicketStatus({ id: ticketId, status: 'Open', reopen_count: ticket?.reopen_count + 1 });
  };

  const handleAddAttachment = (ticketId: string, file: File, isPublic: boolean) => {
    console.log('Adding attachment to ticket:', ticketId, 'file:', file.name, 'public:', isPublic);
  };

  const handleStatusChange = (newStatus: string) => {
    const updatedTicket = {
      ...ticket,
      status: newStatus as any,
      updatedAt: new Date().toISOString(),
      ...(newStatus === 'resolved' && { resolvedAt: new Date().toISOString() }),
      ...(newStatus === 'Closed' && { ClosedAt: new Date().toISOString() })
    };
    updateTicket(updatedTicket);
    toast.success(`Ticket ${newStatus}`);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAttachments(file);
  };

  const removeAttachment = () => {
    setAttachments(null);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };
  const handleSendMessage = async () => {
    console.log('Send message:', newMessage, 'Internal:', isInternal, 'Attachments:', attachments);
    if (!newMessage.trim()) return;

    const cleanedText = newMessage.replace(/\@\[@(.+?)\]\((.+?)\)/g, '@$1');

    // ✅ Extract mentioned users from the message
    const mentions = extractMentions(newMessage);
    const mentionedUserIds = mentions.map(m => m.id);

    const formData = new FormData();
    formData.append('ticket_id', ticket?.id || '');
    formData.append('is_internal', isInternal ? 'true' : 'false');
    formData.append('comment_text', cleanedText);
    // ✅ Add mentioned users to form data
    if (mentionedUserIds.length > 0) {
      formData.append('mentioned_users', JSON.stringify(mentionedUserIds));
    }

    if (attachments) {
      formData.append('attachment', attachments);
    }

    await createComment(formData as any);

    setNewMessage('');
    setIsInternal(false);
    setSearchUser('');
    setAttachments(null);
    setMentionedUsers([]); // Clear mentioned users
  };

  // ✅ Custom styles for mentions
  const mentionInputStyle = {
    control: {
      backgroundColor: '#fff',
      fontSize: 14,
      fontWeight: 'normal'
    },
    '&multiLine': {
      control: {
        fontFamily: 'inherit',
        minHeight: 100,
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        padding: '8px 12px',
        width: '100%'
      },
      highlighter: {
        // padding: '8px 12px',
        border: '1px solid transparent'
      },
      input: {
        padding: '8px 12px',
        border: '1px solid transparent',
        outline: 'none',
        fontSize: 14,
        fontFamily: 'inherit',
        resize: 'vertical',
        minHeight: 100
      }
    },
    suggestions: {
      list: {
        backgroundColor: 'white',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        fontSize: 14,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        maxHeight: 200,
        overflow: 'auto',
        zIndex: 1000
      },
      item: {
        padding: '12px 16px',
        borderBottom: '1px solid #e5e7eb',
        cursor: 'pointer',
        '&focused': {
          backgroundColor: '#eff6ff',
          color: 'black',
          fontWeight: 800
        },
        '&highlighted': {
          backgroundColor: '#eff6ff',
          fontWeight: 'bold',
          color: '#1d4ed8'
        }
      }
    }
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
      case 'High':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'in-progress':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Resolved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Closed':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSLAColor = (slaStatus: string) => {
    switch (slaStatus) {
      case 'Breached':
        return 'text-red-600 bg-red-50';
      case 'Approaching':
        return 'text-yellow-600 bg-yellow-50';
      case 'Within':
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
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{ticket?.ticket_number}</h1>
            <p className="text-gray-600">{ticket?.subject}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {ticket?.status !== 'Closed' && (
            <>
              {ticket?.status === 'Open' && (
                <button
                  onClick={() => handleStatusChange('in-progress')}
                  className="flex items-center px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Work
                </button>
              )}

              {ticket?.status === 'In Progress' && (
                <>
                  <button
                    onClick={() => handleStatusChange('Open')}
                    className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </button>
                  <button
                    onClick={() => handleStatusChange('Resolved')}
                    className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Resolve
                  </button>
                </>
              )}

              {ticket?.status === 'Resolved' && (
                <button
                  onClick={() => handleStatusChange('Closed')}
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
            {/* <p className="text-gray-700 whitespace-pre-wrap">{ticket?.description}</p> */}
            <div
              className="text-gray-700 mail-description whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: ticket?.description || '' }}
            />

            {ticket?.attachments && ticket?.attachments?.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Attachments</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ticket?.attachments?.map((attachment: any) => (
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
            {/* Reply Section */}
            {ticket.status !== 'Closed' && (
              <div className="p-4 border-t">
                <MentionsInput
                  value={newMessage}
                  onChange={onChangeHandler}
                  style={mentionInputStyle}
                  placeholder="Comment and use @ to mention"
                  allowSpaceInQuery
                >
                  <Mention
                    trigger="@"
                    data={searchUsersHandler}
                    // className="!font-bold !bg-red-600 !text-red-50"
                    displayTransform={(id: any, display: any) => `@${display}`}
                    markup="@[@__display__](__id__)"
                    // className="mention-highlight"
                  />
                </MentionsInput>

                {/* Clean display of mentions */}
                {mentionedUsers.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="text-sm text-gray-500">Mentioned:</span>
                    {mentionedUsers.map((m, i) => {
                      const name = m.display.startsWith('@') ? m.display.slice(1) : m.display;
                      return (
                        <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {name}
                        </span>
                      );
                    })}
                  </div>
                )}

                <div className="mt-2">
                  <input type="file" onChange={handleFileSelect} />
                  {attachments && (
                    <div className="mt-1 flex justify-between items-center bg-gray-100 p-2 rounded">
                      <span>{attachments.name}</span>
                      <button onClick={removeAttachment} className="text-red-500">
                        ×
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-between space-x-2">
                  <label className="flex items-center space-x-1">
                    <input type="checkbox" checked={isInternal} onChange={e => setIsInternal(e.target.checked)} />
                    <span>Internal</span>
                  </label>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isCreating}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                  >
                    {isCreating ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </div>
            )}
            {/* <MentionEditor
              newMessage={newMessage}
              onChangeHandler={onChangeHandler}
              searchUsersHandler={searchUsersHandler}
              mentionedUsers={mentionedUsers}
              attachments={attachments}
              handleFileSelect={handleFileSelect}
              removeAttachment={removeAttachment}
              isInternal={isInternal}
              setIsInternal={setIsInternal}
              handleSendMessage={handleSendMessage}
              isCreating={isCreating}
            /> */}

            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Conversation</h2>
            </div>

            <div ref={conversationRef} className="divide-y divide-gray-200">
              {ticket?.ticket_comments?.map((response: any) => (
                <div key={response.id} className={`p-6 ${response.is_internal ? 'bg-yellow-50' : ''}`}>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                        {response?.ticket_comment_customers ? (
                          !response?.ticket_comment_customers?.image_url && <User className="h-4 w-4 text-gray-600" />
                        ) : response?.ticket_comment_users?.avatar ? (
                          <img
                            src={response?.ticket_comment_users?.avatar}
                            alt="avatar"
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-4 w-4 text-gray-600" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm !capitalize font-medium text-gray-900">
                          {response?.ticket_comment_customers
                            ? response?.ticket_comment_customers?.first_name +
                              ' ' +
                              response?.ticket_comment_customers?.last_name
                            : response?.ticket_comment_users?.first_name +
                              ' ' +
                              response?.ticket_comment_users?.last_name}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            response.comment_type === 'agent'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {response.comment_type}
                        </span>
                        {response.is_internal && (
                          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Internal</span>
                        )}
                        <span className="text-xs text-gray-500">
                          {response?.created_at &&
                            formatDistanceToNow(new Date(response?.created_at), {
                              addSuffix: true
                            })}
                        </span>
                      </div>
                      {/* <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{response.comment_text}</p> */}
                      <p
                        className="mt-2 text-sm mail-description text-gray-700 whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: response.comment_text || '' }}
                      />

                      {response?.attachment_urls && (
                        <div className="mt-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded">
                              <div className="flex items-center space-x-2">
                                <img
                                  src={response?.attachment_urls}
                                  alt="attachment"
                                  className="h-10 w-10 object-cover rounded"
                                  onError={e => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const fallback = target.nextElementSibling as HTMLDivElement;
                                    if (fallback) fallback.style.display = 'flex';
                                  }}
                                />
                                <div
                                  className="h-10 w-10 rounded border flex items-center justify-center bg-gray-100"
                                  style={{ display: 'none' }}
                                >
                                  <File className="h-4 w-4 text-gray-600" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-gray-900 truncate">
                                    {response.attachment_urls.split('/').pop() || 'Attachment'}
                                  </p>
                                  <p className="text-xs text-gray-500">File</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => window.open(response.attachment_urls, '_blank')}
                                  className="p-1 text-gray-400 hover:text-gray-600"
                                  title="View"
                                >
                                  <Eye className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={async () => {
                                    const url = response.attachment_urls;
                                    const fileName = url.split('/').pop()?.split('?')[0] || 'attachment';

                                    try {
                                      const fetchResponse = await fetch(url);
                                      const blob = await fetchResponse.blob();

                                      const link = document.createElement('a');
                                      link.href = URL.createObjectURL(blob);
                                      link.download = fileName;
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                      URL.revokeObjectURL(link.href);
                                    } catch (error) {
                                      const link = document.createElement('a');
                                      link.href = url;
                                      link.download = fileName;
                                      link.target = '_blank';
                                      link.click();
                                    }
                                  }}
                                  className="p-1 text-gray-400 hover:text-gray-600"
                                  title="Download"
                                >
                                  <Download className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ticket Actions */}
          <TicketActions
            ticket={ticket}
            users={usersData?.data}
            onAllocateTicket={handleAllocateTicket}
            onMergeTickets={handleMergeTickets}
            onReopenTicket={handleReopenTicket}
            onAddAttachment={handleAddAttachment}
            availableTickets={state?.tickets?.filter((t: any) => t?.id !== ticket?.id) || []}
            searchUser={searchUser}
            setSearchUser={setSearchUser}
          />

          {/* Ticket Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Information</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                      ticket?.status || ''
                    )}`}
                  >
                    {ticket?.status}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Priority</label>
                <div className="mt-1">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(
                      ticket?.priority || ''
                    )}`}
                  >
                    {ticket?.priority}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">SLA Status</label>
                <div className="mt-1">
                  <div className={`flex items-center px-2 py-1 rounded-md ${getSLAColor(ticket?.sla_status || '')}`}>
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">{ticket?.sla_status}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Assigned To</label>
                <div className="mt-1">
                  {ticket?.assigned_by ? (
                    <div className="flex items-center">
                      {ticket?.assigned_by?.avatar && (
                        <img
                          src={ticket?.assigned_by?.avatar}
                          alt={ticket?.assigned_by?.name}
                          className="h-6 w-6 rounded-full mr-2"
                        />
                      )}
                      <span className="text-sm text-gray-900">{ticket?.assigned_by?.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Unassigned</span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Source</label>
                <div className="mt-1 flex items-center">
                  <span className="text-sm text-gray-900">{ticket?.source}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Time Spent</label>
                <div className="mt-1 flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-gray-400" />
                  <span className="text-sm text-gray-900">
                    {Math.floor((ticket?.time_spent_minutes || 0) / 60)}h {(ticket?.time_spent_minutes || 0) % 60}m
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Created at</label>
                <div className="mt-1 flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                  <span className="text-sm text-gray-900">
                    {ticket?.created_at && format(new Date(ticket.created_at), 'MMM d, yyyy HH:mm')}
                  </span>
                </div>
              </div>

              {ticket?.resolved_at && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Resolved</label>
                  <div className="mt-1 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                    <span className="text-sm text-gray-900">
                      {format(new Date(ticket.resolved_at), 'MMM d, yyyy HH:mm')}
                    </span>
                  </div>
                </div>
              )}

              {ticket?.reopen_count && ticket?.reopen_count > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Reopen Count</label>
                  <div className="mt-1">
                    <span className="text-sm text-orange-600 font-medium">{ticket?.reopen_count}</span>
                  </div>
                </div>
              )}

              {ticket?.is_merged && (
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
                <p className="text-sm text-gray-900">
                  {(ticket?.customers?.first_name || '') + ' ' + (ticket?.customers?.last_name || '')}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm text-gray-900">{ticket?.customers?.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Company</label>
                <p className="text-sm text-gray-900">{ticket?.customers?.companies?.company_name}</p>
              </div>
            </div>
          </div>

          {/* Customer Satisfaction */}
          {ticket?.customerSatisfaction && (
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
                          star <= (ticket?.customerSatisfaction || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">{ticket?.customerSatisfaction}/5</span>
                  </div>
                </div>

                {ticket?.feedbackComment && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Comment</label>
                    <p className="text-sm text-gray-900 mt-1">{ticket?.feedbackComment}</p>
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

// import React, { useEffect, useRef, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//   ArrowLeft,
//   Clock,
//   User,
//   Calendar,
//   MessageSquare,
//   Paperclip,
//   Send,
//   Star,
//   CheckCircle,
//   AlertTriangle,
//   Play,
//   Pause,
//   Square,
//   Download,
//   Eye,
//   FileText,
//   Image,
//   File
// } from 'lucide-react';
// import { useTickets } from '../context/TicketContext';
// import { formatDistanceToNow, format } from 'date-fns';
// import toast from 'react-hot-toast';
// import TicketActions from '../components/TicketActions';
// import { createCommentFn, ticketFn } from 'services/Ticket';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import TicketDetailSkeleton from './Ticket/TicketDetailSkeleton';
// import { TicketComment } from 'types/Tickets';
// import { usersFn } from 'services/users';

// export default function TicketDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { state, updateTicket } = useTickets();
//   const [newMessage, setNewMessage] = useState('');
//   const [isInternal, setIsInternal] = useState(false);
//   // const [attachments, setAttachments] = useState<any>();
//   const [attachments, setAttachments] = useState<File | null>(null);
//   const [searchUser, setSearchUser] = useState('');

//   const client = useQueryClient();

//   const conversationRef = useRef<HTMLDivElement>(null);

//   const { data: TicketDetail, isLoading } = useQuery({
//     queryKey: ['tickets', id],
//     queryFn: () => ticketFn(Number(id))
//   });
//   const ticket = TicketDetail?.data;
//   // const ticket = state?.tickets?.[0];
//   // const ticket = state.tickets.find(t => t.id === id);
//   // const assignedAgent = ticket?.assignedTo ? state.agents.find(a => a.id === ticket.assignedTo) : null;

//   const { mutate: createComment, isPending: isCreating } = useMutation({
//     mutationFn: createCommentFn,
//     onSuccess: (res: any) => {
//       toast.success(res.data?.message || 'Send comment successfully!');

//       client.refetchQueries({ queryKey: ['tickets'] });
//     }
//   });
//   const { data: usersData, isLoading: isLoadingUser } = useQuery({
//     queryKey: ['users', searchUser],
//     queryFn: () =>
//       usersFn({
//         search: searchUser || ''
//       })
//   });

//   const userList = usersData?.data || [];
//   // Add this useEffect to scroll to bottom when comments change
//   useEffect(() => {
//     if (conversationRef.current) {
//       conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
//     }
//   }, [ticket?.ticket_comments]);
//   if (isLoading) {
//     return <TicketDetailSkeleton />;
//   }

//   if (!ticket && !isLoading) {
//     return (
//       <div className="text-center py-12">
//         <h3 className="text-lg font-medium text-gray-900">Ticket not found</h3>
//         <button onClick={() => navigate(-1)} className="mt-4 text-primary-600 hover:text-primary-500">
//           Back to tickets
//         </button>
//       </div>
//     );
//   }

//   const handleAllocateTicket = (ticketId: string, userId: string, reason?: string) => {
//     // Implementation for ticket allocation
//     console.log('Allocating ticket:', ticketId, 'to user:', userId, 'reason:', reason);
//   };

//   const handleMergeTickets = (parentTicketId: string, childTicketId: string, reason: string) => {
//     // Implementation for ticket merging
//     console.log('Merging tickets:', parentTicketId, childTicketId, 'reason:', reason);
//   };

//   const handleReopenTicket = (ticketId: string, reason: string) => {
//     // Implementation for ticket reopening
//     console.log('Reopening ticket:', ticketId, 'reason:', reason);
//   };

//   const handleAddAttachment = (ticketId: string, file: File, isPublic: boolean) => {
//     // Implementation for adding attachments
//     console.log('Adding attachment to ticket:', ticketId, 'file:', file.name, 'public:', isPublic);
//   };

//   const handleStatusChange = (newStatus: string) => {
//     const updatedTicket = {
//       ...ticket,
//       status: newStatus as any,
//       updatedAt: new Date().toISOString(),
//       ...(newStatus === 'resolved' && { resolvedAt: new Date().toISOString() }),
//       ...(newStatus === 'Closed' && { ClosedAt: new Date().toISOString() })
//     };
//     updateTicket(updatedTicket);
//     toast.success(`Ticket ${newStatus}`);
//   };

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     // const files = Array.from(e.target.files || []);
//     // setAttachments(prev => [...prev, ...files]);
//     const file = e.target.files?.[0] || null;
//     setAttachments(file);
//   };

//   const removeAttachment = () => {
//     // setAttachments(prev => prev.filter((_, i) => i !== index));
//     setAttachments(null);
//     // Clear file input
//     const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
//     if (fileInput) {
//       fileInput.value = '';
//     }
//   };

//   const handleSendMessage = async () => {
//     console.log('Send message:', newMessage, 'Internal:', isInternal, 'Attachments:', attachments);
//     if (!newMessage.trim()) return;

//     // const newResponse = {
//     //   id: Date.now().toString(),
//     //   ticketId: ticket.id,
//     //   message: newMessage,
//     //   author: state.currentUser?.name || 'Agent',
//     //   authorType: 'agent' as const,
//     //   created_at: new Date().toISOString(),
//     //   isInternal,
//     //   attachments: attachments.map(file => ({
//     //     id: Date.now().toString() + Math.random(),
//     //     ticketId: ticket.id,
//     //     fileName: file.name,
//     //     originalFileName: file.name,
//     //     filePath: URL.createObjectURL(file),
//     //     fileSize: file.size,
//     //     contentType: file.type,
//     //     fileHash: '',
//     //     uploadedBy: state.currentUser?.id || '',
//     //     uploadedByType: 'user' as const,
//     //     isPublic: !isInternal,
//     //     virusScanned: false,
//     //     created_at: new Date().toISOString()
//     //   }))
//     // };

//     // const updatedTicket = {
//     //   ...ticket,
//     //   responses: [...ticket.responses, newResponse],
//     //   updatedAt: new Date().toISOString(),
//     //   ...(ticket.status === 'Open' && { status: 'in-progress' as const })
//     // };

//     const formData = new FormData();
//     formData.append('ticket_id', ticket?.id || '');
//     formData.append('is_internal', isInternal ? 'true' : 'false');
//     formData.append('comment_text', newMessage);
//     formData.append('attachment', attachments);
//     await createComment(formData as any);
//     // createComment({
//     //   ticket_id: ticket?.id || null,
//     //   is_internal: isInternal,
//     //   comment_text: newMessage
//     // } as TicketComment);
//     // updateTicket(updatedTicket);
//     setNewMessage('');
//     setIsInternal(false);
//     setAttachments(null);
//     // toast.success('Response sent');
//   };

//   const getFileIcon = (contentType: string) => {
//     if (contentType.startsWith('image/')) return <Image className="h-4 w-4" />;
//     if (contentType === 'application/pdf') return <FileText className="h-4 w-4" />;
//     return <File className="h-4 w-4" />;
//   };

//   const formatFileSize = (bytes: number) => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   };

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case 'High':
//         return 'text-red-600 bg-red-50 border-red-200';
//       case 'Medium':
//         return 'text-yellow-600 bg-yellow-50 border-yellow-200';
//       case 'Low':
//         return 'text-green-600 bg-green-50 border-green-200';
//       default:
//         return 'text-gray-600 bg-gray-50 border-gray-200';
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'Open':
//         return 'text-blue-600 bg-blue-50 border-blue-200';
//       case 'in-progress':
//         return 'text-orange-600 bg-orange-50 border-orange-200';
//       case 'Resolved':
//         return 'text-green-600 bg-green-50 border-green-200';
//       case 'Closed':
//         return 'text-gray-600 bg-gray-50 border-gray-200';
//       default:
//         return 'text-gray-600 bg-gray-50 border-gray-200';
//     }
//   };

//   const getSLAColor = (slaStatus: string) => {
//     switch (slaStatus) {
//       case 'Breached':
//         return 'text-red-600 bg-red-50';
//       case 'Approaching':
//         return 'text-yellow-600 bg-yellow-50';
//       case 'Within':
//         return 'text-green-600 bg-green-50';
//       default:
//         return 'text-gray-600 bg-gray-50';
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//             <ArrowLeft className="h-5 w-5" />
//           </button>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">{ticket?.ticket_number}</h1>
//             <p className="text-gray-600">{ticket?.subject}</p>
//           </div>
//         </div>

//         <div className="flex items-center space-x-3">
//           {ticket?.status !== 'Closed' && (
//             <>
//               {ticket?.status === 'Open' && (
//                 <button
//                   onClick={() => handleStatusChange('in-progress')}
//                   className="flex items-center px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
//                 >
//                   <Play className="h-4 w-4 mr-2" />
//                   Start Work
//                 </button>
//               )}

//               {ticket?.status === 'In Progress' && (
//                 <>
//                   <button
//                     onClick={() => handleStatusChange('Open')}
//                     className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
//                   >
//                     <Pause className="h-4 w-4 mr-2" />
//                     Pause
//                   </button>
//                   <button
//                     onClick={() => handleStatusChange('Resolved')}
//                     className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//                   >
//                     <CheckCircle className="h-4 w-4 mr-2" />
//                     Resolve
//                   </button>
//                 </>
//               )}

//               {ticket?.status === 'Resolved' && (
//                 <button
//                   onClick={() => handleStatusChange('Closed')}
//                   className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
//                 >
//                   <Square className="h-4 w-4 mr-2" />
//                   Close
//                 </button>
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Main Content */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Ticket Description */}
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
//             <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>

//             {ticket?.attachments?.length > 0 && (
//               <div className="mt-4">
//                 <h3 className="text-sm font-medium text-gray-900 mb-2">Attachments</h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   {ticket?.attachments?.map((attachment: any) => (
//                     <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                       <div className="flex items-center space-x-3">
//                         {getFileIcon(attachment.contentType)}
//                         <div>
//                           <p className="text-sm font-medium text-gray-900">{attachment.originalFileName}</p>
//                           <p className="text-xs text-gray-500">{formatFileSize(attachment.fileSize)}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <button
//                           onClick={() => window.open(attachment.filePath, '_blank')}
//                           className="p-1 text-gray-400 hover:text-gray-600"
//                           title="View"
//                         >
//                           <Eye className="h-4 w-4" />
//                         </button>
//                         <button
//                           onClick={() => {
//                             const link = document.createElement('a');
//                             link.href = attachment.filePath;
//                             link.download = attachment.originalFileName;
//                             link.click();
//                           }}
//                           className="p-1 text-gray-400 hover:text-gray-600"
//                           title="Download"
//                         >
//                           <Download className="h-4 w-4" />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Responses */}
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//             <div className="p-6 border-b border-gray-200">
//               <h2 className="text-lg font-semibold text-gray-900">Conversation</h2>
//             </div>

//             <div
//               ref={conversationRef}
//               className="divide-y divide-gray-200 "
//               // className="divide-y divide-gray-200 !max-h-[38rem] !min-h-full overflow-y-auto scroll-smooth"
//               // style={{ scrollBehavior: 'smooth' }}
//             >
//               {ticket?.ticket_comments?.map((response: any) => (
//                 <div key={response.id} className={`p-6 ${response.is_internal ? 'bg-yellow-50' : ''}`}>
//                   <div className="flex items-start space-x-3">
//                     <div className="flex-shrink-0">
//                       <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
//                         <User className="h-4 w-4 text-gray-600" />
//                       </div>
//                     </div>
//                     <div className="flex-1">
//                       <div className="flex items-center space-x-2">
//                         <span className="text-sm font-medium text-gray-900">{response.author}</span>
//                         <span
//                           className={`px-2 py-1 text-xs rounded-full ${
//                             response.comment_type === 'agent'
//                               ? 'bg-blue-100 text-blue-800'
//                               : 'bg-green-100 text-green-800'
//                           }`}
//                         >
//                           {response.comment_type}
//                         </span>
//                         {response.is_internal && (
//                           <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Internal</span>
//                         )}
//                         <span className="text-xs text-gray-500">
//                           {response?.created_at &&
//                             formatDistanceToNow(new Date(response?.created_at), {
//                               addSuffix: true
//                             })}
//                         </span>
//                       </div>
//                       <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{response.comment_text}</p>

//                       {/* Response Attachments */}
//                       {/* {response?.attachments && response.attachments.length > 0 && (
//                         <div className="mt-3">
//                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                             {response?.attachments?.map((attachment: any) => (
//                               <div
//                                 key={attachment.id}
//                                 className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded"
//                               >
//                                 <div className="flex items-center space-x-2">
//                                   {getFileIcon(attachment.contentType)}
//                                   <div>
//                                     <p className="text-xs font-medium text-gray-900">{attachment.originalFileName}</p>
//                                     <p className="text-xs text-gray-500">{formatFileSize(attachment.fileSize)}</p>
//                                   </div>
//                                 </div>
//                                 <div className="flex items-center space-x-1">
//                                   <button
//                                     onClick={() => window.open(attachment.filePath, '_blank')}
//                                     className="p-1 text-gray-400 hover:text-gray-600"
//                                     title="View"
//                                   >
//                                     <Eye className="h-3 w-3" />
//                                   </button>
//                                   <button
//                                     onClick={() => {
//                                       const link = document.createElement('a');
//                                       link.href = attachment.filePath;
//                                       link.download = attachment.originalFileName;
//                                       link.click();
//                                     }}
//                                     className="p-1 text-gray-400 hover:text-gray-600"
//                                     title="Download"
//                                   >
//                                     <Download className="h-3 w-3" />
//                                   </button>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )} */}
//                       {response?.attachment_urls && (
//                         <div className="mt-3">
//                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                             <div className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded">
//                               <div className="flex items-center space-x-2">
//                                 <img
//                                   src={response?.attachment_urls}
//                                   alt="attachment"
//                                   className="h-10 w-10 object-cover rounded"
//                                 />
//                                 {/* <div>
//                                     <p className="text-xs font-medium text-gray-900">{attachment.originalFileName}</p>
//                                     <p className="text-xs text-gray-500">{formatFileSize(attachment.fileSize)}</p>
//                                   </div> */}
//                                 <div
//                                   className="h-10 w-10 rounded border flex items-center justify-center bg-gray-100"
//                                   style={{ display: 'none' }}
//                                 >
//                                   <File className="h-4 w-4 text-gray-600" />
//                                 </div>

//                                 <div className="flex-1 min-w-0">
//                                   <p className="text-xs font-medium text-gray-900 truncate">
//                                     {response.attachment_urls.split('/').pop() || 'Attachment'}
//                                   </p>
//                                   <p className="text-xs text-gray-500">File</p>
//                                 </div>
//                               </div>
//                               <div className="flex items-center space-x-1">
//                                 <button
//                                   onClick={() => window.open(response.attachment_urls, '_blank')}
//                                   className="p-1 text-gray-400 hover:text-gray-600"
//                                   title="View"
//                                 >
//                                   <Eye className="h-3 w-3" />
//                                 </button>
//                                 <button
//                                   onClick={() => {
//                                     const link = document.createElement('a');
//                                     link.href = response.attachment_urls;
//                                     link.download = response.attachment_urls.split('/').pop() || 'attachment';
//                                     link.click();
//                                   }}
//                                   className="p-1 text-gray-400 hover:text-gray-600"
//                                   title="Download"
//                                 >
//                                   <Download className="h-3 w-3" />
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Reply Form */}
//             {ticket.status !== 'Closed' && (
//               <div className="p-6 border-t border-gray-200">
//                 <div className="space-y-4">
//                   <textarea
//                     rows={4}
//                     className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
//                     placeholder="Type your response..."
//                     value={newMessage}
//                     onChange={e => setNewMessage(e.target.value)}
//                   />

//                   {/* File Attachments */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
//                     <input
//                       type="file"
//                       // multiple
//                       onChange={handleFileSelect}
//                       className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
//                     />
//                     {/* ✅ FIXED: Show single selected attachment */}
//                     {attachments && (
//                       <div className="mt-2">
//                         <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
//                           <div className="flex items-center space-x-2">
//                             {getFileIcon(attachments.type)}
//                             <span className="text-sm text-gray-700">{attachments.name}</span>
//                             <span className="text-xs text-gray-500">({formatFileSize(attachments.size)})</span>
//                           </div>
//                           <button onClick={() => removeAttachment()} className="text-red-500 hover:text-red-700">
//                             ×
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                     {/* {attachments?.length > 0 && (
//                       <div className="mt-2 space-y-2">
//                         {attachments.map((file, index) => (
//                           <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
//                             <div className="flex items-center space-x-2">
//                               {getFileIcon(file.type)}
//                               <span className="text-sm text-gray-700">{file.name}</span>
//                               <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
//                             </div>
//                             <button onClick={() => removeAttachment(index)} className="text-red-500 hover:text-red-700">
//                               ×
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     )} */}
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <label className="flex items-center">
//                       <input
//                         type="checkbox"
//                         className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                         checked={isInternal}
//                         onChange={e => setIsInternal(e.target.checked)}
//                       />
//                       <span className="ml-2 text-sm text-gray-600">Internal note</span>
//                     </label>
//                     <button
//                       onClick={handleSendMessage}
//                       disabled={!newMessage.trim() || isCreating}
//                       className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                     >
//                       {isCreating ? (
//                         <>
//                           {/* Loading Spinner */}
//                           <svg
//                             className="animate-spin h-4 w-4 mr-2"
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                           >
//                             <circle
//                               className="opacity-25"
//                               cx="12"
//                               cy="12"
//                               r="10"
//                               stroke="currentColor"
//                               strokeWidth="4"
//                             />
//                             <path
//                               className="opacity-75"
//                               fill="currentColor"
//                               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                             />
//                           </svg>
//                           Sending...
//                         </>
//                       ) : (
//                         <>
//                           <Send className="h-4 w-4 mr-2" />
//                           Send
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Sidebar */}
//         <div className="space-y-6">
//           {/* Ticket Actions */}
//           <TicketActions
//             ticket={ticket}
//             users={[]} // You'll need to pass actual users from context
//             onAllocateTicket={handleAllocateTicket}
//             onMergeTickets={handleMergeTickets}
//             onReopenTicket={handleReopenTicket}
//             onAddAttachment={handleAddAttachment}
//             availableTickets={state.tickets.filter(t => t.id !== ticket.id)}
//           />

//           {/* Ticket Info */}
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Information</h3>

//             <div className="space-y-4">
//               <div>
//                 <label className="text-sm font-medium text-gray-500">Status</label>
//                 <div className="mt-1">
//                   <span
//                     className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
//                       ticket.status
//                     )}`}
//                   >
//                     {ticket?.status}
//                     {/* {ticket?.status?.replace('-', ' ')} */}
//                   </span>
//                 </div>
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-gray-500">Priority</label>
//                 <div className="mt-1">
//                   <span
//                     className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(
//                       ticket.priority
//                     )}`}
//                   >
//                     {ticket.priority}
//                   </span>
//                 </div>
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-gray-500">SLA Status</label>
//                 <div className="mt-1">
//                   <div className={`flex items-center px-2 py-1 rounded-md ${getSLAColor(ticket.sla_status)}`}>
//                     <AlertTriangle className="h-4 w-4 mr-1" />
//                     <span className="text-sm font-medium">{ticket.sla_status}</span>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-gray-500">Assigned To</label>
//                 <div className="mt-1">
//                   {ticket?.assigned_by ? (
//                     <div className="flex items-center">
//                       {ticket?.assigned_by?.avatar && (
//                         <img
//                           src={ticket?.assigned_by?.avatar}
//                           alt={ticket?.assigned_by?.name}
//                           className="h-6 w-6 rounded-full mr-2"
//                         />
//                       )}
//                       <span className="text-sm text-gray-900">{ticket?.assigned_by?.name}</span>
//                     </div>
//                   ) : (
//                     <span className="text-sm text-gray-500">Unassigned</span>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-gray-500">Source</label>
//                 <div className="mt-1 flex items-center">
//                   <span className="text-sm text-gray-900">{ticket?.source}</span>
//                 </div>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-500">Time Spent</label>
//                 <div className="mt-1 flex items-center">
//                   <Clock className="h-4 w-4 mr-1 text-gray-400" />
//                   <span className="text-sm text-gray-900">
//                     {Math.floor(ticket?.time_spent_minutes / 60)}h {ticket?.time_spent_minutes % 60}m
//                   </span>
//                 </div>
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-gray-500">Created at</label>
//                 <div className="mt-1 flex items-center">
//                   <Calendar className="h-4 w-4 mr-1 text-gray-400" />
//                   <span className="text-sm text-gray-900">
//                     {ticket?.created_at && format(new Date(ticket.created_at), 'MMM d, yyyy HH:mm')}
//                   </span>
//                 </div>
//               </div>

//               {ticket?.resolved_at && (
//                 <div>
//                   <label className="text-sm font-medium text-gray-500">Resolved</label>
//                   <div className="mt-1 flex items-center">
//                     <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
//                     <span className="text-sm text-gray-900">
//                       {format(new Date(ticket.resolved_at), 'MMM d, yyyy HH:mm')}
//                     </span>
//                   </div>
//                 </div>
//               )}

//               {ticket?.reopen_count && ticket?.reopen_count > 0 && (
//                 <div>
//                   <label className="text-sm font-medium text-gray-500">Reopen Count</label>
//                   <div className="mt-1">
//                     <span className="text-sm text-orange-600 font-medium">{ticket?.reopen_count}</span>
//                   </div>
//                 </div>
//               )}

//               {ticket?.is_merged && (
//                 <div>
//                   <label className="text-sm font-medium text-gray-500">Merged Status</label>
//                   <div className="mt-1">
//                     <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
//                       Merged Ticket
//                     </span>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Customer Info */}
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>

//             <div className="space-y-3">
//               <div>
//                 <label className="text-sm font-medium text-gray-500">Name</label>
//                 <p className="text-sm text-gray-900">
//                   {ticket.customers?.first_name + ' ' + ticket.customers?.last_name}
//                 </p>
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-gray-500">Email</label>
//                 <p className="text-sm text-gray-900">{ticket?.customers?.email}</p>
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-gray-500">Company</label>
//                 <p className="text-sm text-gray-900">{ticket?.customers?.companies?.company_name}</p>
//               </div>
//             </div>
//           </div>

//           {/* Customer Satisfaction */}
//           {ticket.customerSatisfaction && (
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Feedback</h3>

//               <div className="space-y-3">
//                 <div>
//                   <label className="text-sm font-medium text-gray-500">Rating</label>
//                   <div className="flex items-center mt-1">
//                     {[1, 2, 3, 4, 5].map(star => (
//                       <Star
//                         key={star}
//                         className={`h-4 w-4 ${
//                           star <= ticket.customerSatisfaction! ? 'text-yellow-400 fill-current' : 'text-gray-300'
//                         }`}
//                       />
//                     ))}
//                     <span className="ml-2 text-sm text-gray-600">{ticket.customerSatisfaction}/5</span>
//                   </div>
//                 </div>

//                 {ticket.feedbackComment && (
//                   <div>
//                     <label className="text-sm font-medium text-gray-500">Comment</label>
//                     <p className="text-sm text-gray-900 mt-1">{ticket.feedbackComment}</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
