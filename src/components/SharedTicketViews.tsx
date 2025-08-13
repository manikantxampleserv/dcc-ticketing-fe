import React, { useState } from 'react';
import { Eye, Users, Plus, Edit, Trash2, Share2, Filter, Save, X, AlertTriangle } from 'lucide-react';
import { TeamView, Ticket } from '../types';
import toast from 'react-hot-toast';

interface SharedTicketViewsProps {
  teamViews: TeamView[];
  tickets: Ticket[];
  currentUserId: string;
  onCreateView: (view: Omit<TeamView, 'id'>) => void;
  onUpdateView: (id: string, view: Partial<TeamView>) => void;
  onDeleteView: (id: string) => void;
  onSelectView: (view: TeamView) => void;
}

export default function SharedTicketViews({
  teamViews,
  tickets,
  currentUserId,
  onCreateView,
  onUpdateView,
  onDeleteView,
  onSelectView
}: SharedTicketViewsProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingView, setEditingView] = useState<TeamView | null>(null);
  const [selectedView, setSelectedView] = useState<TeamView | null>(null);

  const handleCreateView = (viewData: Omit<TeamView, 'id'>) => {
    onCreateView(viewData);
    setShowCreateModal(false);
    toast.success('Team view created successfully');
  };

  const handleUpdateView = (viewData: Partial<TeamView>) => {
    if (editingView) {
      onUpdateView(editingView.id, viewData);
      setEditingView(null);
      toast.success('Team view updated successfully');
    }
  };

  const handleDeleteView = (id: string) => {
    if (window.confirm('Are you sure you want to delete this team view?')) {
      onDeleteView(id);
      toast.success('Team view deleted successfully');
    }
  };

  const getFilteredTickets = (view: TeamView) => {
    return tickets.filter(ticket => {
      const { filters } = view;

      if (filters.priority && !filters.priority.includes(ticket.priority)) return false;
      if (filters.status && !filters.status.includes(ticket.status)) return false;
      if (filters.assignedTo && ticket.assignedTo && !filters.assignedTo.includes(ticket.assignedTo)) return false;
      if (filters.tags && !filters.tags.some(tag => ticket.tags.includes(tag))) return false;

      return true;
    });
  };

  const urgentViews = teamViews.filter(
    view =>
      view.filters.priority?.includes('high') ||
      view.name.toLowerCase().includes('urgent') ||
      view.name.toLowerCase().includes('critical')
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shared Team Views</h2>
          <p className="text-gray-600">Collaborative views for urgent issues and team visibility</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create View
        </button>
      </div>

      {/* Urgent/Critical Views */}
      {urgentViews.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <h3 className="text-lg font-semibold text-red-800">Urgent Issue Views</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {urgentViews.map(view => (
              <ViewCard
                key={view.id}
                view={view}
                ticketCount={getFilteredTickets(view).length}
                currentUserId={currentUserId}
                onSelect={() => {
                  setSelectedView(view);
                  onSelectView(view);
                }}
                onEdit={() => setEditingView(view)}
                onDelete={() => handleDeleteView(view.id)}
                isUrgent={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Team Views */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamViews
          .filter(view => !urgentViews.includes(view))
          .map(view => (
            <ViewCard
              key={view.id}
              view={view}
              ticketCount={getFilteredTickets(view).length}
              currentUserId={currentUserId}
              onSelect={() => {
                setSelectedView(view);
                onSelectView(view);
              }}
              onEdit={() => setEditingView(view)}
              onDelete={() => handleDeleteView(view.id)}
            />
          ))}
      </div>

      {teamViews.length === 0 && (
        <div className="text-center py-12">
          <Eye className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No team views</h3>
          <p className="mt-1 text-sm text-gray-500">Create your first shared view to improve team collaboration.</p>
        </div>
      )}

      {/* Selected View Details */}
      {selectedView && (
        <SelectedViewDetails
          view={selectedView}
          tickets={getFilteredTickets(selectedView)}
          onClose={() => setSelectedView(null)}
        />
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || editingView) && (
        <TeamViewModal
          view={editingView}
          onSave={editingView ? handleUpdateView : handleCreateView}
          onClose={() => {
            setShowCreateModal(false);
            setEditingView(null);
          }}
        />
      )}
    </div>
  );
}

// View Card Component
interface ViewCardProps {
  view: TeamView;
  ticketCount: number;
  currentUserId: string;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isUrgent?: boolean;
}

function ViewCard({ view, ticketCount, currentUserId, onSelect, onEdit, onDelete, isUrgent }: ViewCardProps) {
  const canEdit = view.createdBy === currentUserId;

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow ${
        isUrgent ? 'border-red-300' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{view.name}</h3>
        <div className="flex items-center space-x-2">
          {canEdit && (
            <>
              <button onClick={onEdit} className="text-gray-400 hover:text-gray-600">
                <Edit className="h-4 w-4" />
              </button>
              <button onClick={onDelete} className="text-red-400 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">{view.description}</p>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Tickets</span>
          <span className={`text-sm font-medium ${isUrgent ? 'text-red-600' : 'text-gray-900'}`}>{ticketCount}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Team Members</span>
          <div className="flex items-center text-sm text-gray-900">
            <Users className="h-4 w-4 mr-1" />
            {view.teamMembers.length}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Shared</span>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              view.isShared ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {view.isShared ? 'Yes' : 'No'}
          </span>
        </div>
      </div>

      <button
        onClick={onSelect}
        className={`w-full mt-4 px-4 py-2 rounded-lg transition-colors flex items-center justify-center ${
          isUrgent ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-primary-600 text-white hover:bg-primary-700'
        }`}
      >
        <Eye className="h-4 w-4 mr-2" />
        View Tickets
      </button>
    </div>
  );
}

// Selected View Details Component
interface SelectedViewDetailsProps {
  view: TeamView;
  tickets: Ticket[];
  onClose: () => void;
}

function SelectedViewDetails({ view, tickets, onClose }: SelectedViewDetailsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{view.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-96">
          {tickets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No tickets match this view's filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map(ticket => (
                <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{ticket.ticketNumber}</h4>
                      <p className="text-sm text-gray-600">{ticket.subject}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          ticket.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : ticket.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {ticket.priority}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          ticket.status === 'open'
                            ? 'bg-blue-100 text-blue-800'
                            : ticket.status === 'in-progress'
                              ? 'bg-orange-100 text-orange-800'
                              : ticket.status === 'resolved'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {ticket.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Team View Modal Component
interface TeamViewModalProps {
  view?: TeamView | null;
  onSave: (viewData: any) => void;
  onClose: () => void;
}

function TeamViewModal({ view, onSave, onClose }: TeamViewModalProps) {
  const [formData, setFormData] = useState({
    name: view?.name || '',
    description: view?.description || '',
    isShared: view?.isShared ?? true,
    filters: {
      priority: view?.filters.priority || [],
      status: view?.filters.status || [],
      assignedTo: view?.filters.assignedTo || [],
      tags: view?.filters.tags || []
    },
    teamMembers: view?.teamMembers || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      createdBy: view?.createdBy || 'current-user-id' // Replace with actual current user ID
    });
  };

  const handlePriorityChange = (priority: string, checked: boolean) => {
    const newPriorities = checked
      ? [...formData.filters.priority, priority as any]
      : formData.filters.priority.filter(p => p !== priority);

    setFormData({
      ...formData,
      filters: { ...formData.filters, priority: newPriorities }
    });
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    const newStatuses = checked
      ? [...formData.filters.status, status]
      : formData.filters.status.filter(s => s !== status);

    setFormData({
      ...formData,
      filters: { ...formData.filters, status: newStatuses }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">{view ? 'Edit Team View' : 'Create Team View'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">View Name</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority Filters</label>
            <div className="space-y-2">
              {['high', 'medium', 'low'].map(priority => (
                <label key={priority} className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    checked={formData.filters.priority.includes(priority as any)}
                    onChange={e => handlePriorityChange(priority, e.target.checked)}
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{priority}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Filters</label>
            <div className="space-y-2">
              {['open', 'in-progress', 'resolved', 'closed'].map(status => (
                <label key={status} className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    checked={formData.filters.status.includes(status)}
                    onChange={e => handleStatusChange(status, e.target.checked)}
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{status.replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                checked={formData.isShared}
                onChange={e => setFormData({ ...formData, isShared: e.target.checked })}
              />
              <span className="ml-2 text-sm text-gray-700">Share with team</span>
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
            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
              {view ? 'Update' : 'Create'} View
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
