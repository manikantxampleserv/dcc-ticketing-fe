import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  Users,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Mail,
  MessageSquare,
  Smartphone
} from 'lucide-react';
import { EscalationRule } from '../types';
import toast from 'react-hot-toast';

interface EscalationManagerProps {
  escalationRules: EscalationRule[];
  onCreateRule: (rule: Omit<EscalationRule, 'id'>) => void;
  onUpdateRule: (id: string, rule: Partial<EscalationRule>) => void;
  onDeleteRule: (id: string) => void;
}

export default function EscalationManager({
  escalationRules,
  onCreateRule,
  onUpdateRule,
  onDeleteRule
}: EscalationManagerProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRule, setEditingRule] = useState<EscalationRule | null>(null);

  const handleCreateRule = (ruleData: Omit<EscalationRule, 'id'>) => {
    onCreateRule(ruleData);
    setShowCreateModal(false);
    toast.success('Escalation rule created successfully');
  };

  const handleUpdateRule = (ruleData: Partial<EscalationRule>) => {
    if (editingRule) {
      onUpdateRule(editingRule.id, ruleData);
      setEditingRule(null);
      toast.success('Escalation rule updated successfully');
    }
  };

  const handleDeleteRule = (id: string) => {
    if (window.confirm('Are you sure you want to delete this escalation rule?')) {
      onDeleteRule(id);
      toast.success('Escalation rule deleted successfully');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Escalation Management</h2>
          <p className="text-gray-600">Configure automatic escalation rules for unresolved tickets</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Rule
        </button>
      </div>

      {/* Escalation Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {escalationRules.map(rule => (
          <div key={rule.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{rule.name}</h3>
              <div className="flex items-center space-x-2">
                <button onClick={() => setEditingRule(rule)} className="text-gray-400 hover:text-gray-600">
                  <Edit className="h-4 w-4" />
                </button>
                <button onClick={() => handleDeleteRule(rule.id)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Priority</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(rule.priority)}`}>
                  {rule.priority}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Threshold</span>
                <div className="flex items-center text-sm text-gray-900">
                  <Clock className="h-4 w-4 mr-1" />
                  {rule.timeThresholdHours}h
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Escalate To</span>
                <div className="flex items-center text-sm text-gray-900">
                  <Users className="h-4 w-4 mr-1" />
                  {rule.escalateToRole}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Notifications</span>
                <div className="flex items-center space-x-1">
                  {rule.notificationChannels.includes('email') && <Mail className="h-4 w-4 text-blue-500" />}
                  {rule.notificationChannels.includes('slack') && <MessageSquare className="h-4 w-4 text-green-500" />}
                  {rule.notificationChannels.includes('sms') && <Smartphone className="h-4 w-4 text-purple-500" />}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {rule.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {escalationRules.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No escalation rules</h3>
          <p className="mt-1 text-sm text-gray-500">
            Create your first escalation rule to automatically handle overdue tickets.
          </p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || editingRule) && (
        <EscalationRuleModal
          rule={editingRule}
          onSave={editingRule ? handleUpdateRule : handleCreateRule}
          onClose={() => {
            setShowCreateModal(false);
            setEditingRule(null);
          }}
        />
      )}
    </div>
  );
}

// Escalation Rule Modal Component
interface EscalationRuleModalProps {
  rule?: EscalationRule | null;
  onSave: (ruleData: any) => void;
  onClose: () => void;
}

function EscalationRuleModal({ rule, onSave, onClose }: EscalationRuleModalProps) {
  const [formData, setFormData] = useState({
    name: rule?.name || '',
    priority: rule?.priority || 'medium',
    timeThresholdHours: rule?.timeThresholdHours || 24,
    escalateToRole: rule?.escalateToRole || 'supervisor',
    isActive: rule?.isActive ?? true,
    notificationChannels: rule?.notificationChannels || ['email']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChannelChange = (channel: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        notificationChannels: [...formData.notificationChannels, channel as any]
      });
    } else {
      setFormData({
        ...formData,
        notificationChannels: formData.notificationChannels.filter(c => c !== channel)
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">{rule ? 'Edit Escalation Rule' : 'Create Escalation Rule'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Threshold (Hours)</label>
              <input
                type="number"
                min="1"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                value={formData.timeThresholdHours}
                onChange={e =>
                  setFormData({
                    ...formData,
                    timeThresholdHours: parseInt(e.target.value)
                  })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Escalate To</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              value={formData.escalateToRole}
              onChange={e =>
                setFormData({
                  ...formData,
                  escalateToRole: e.target.value as any
                })
              }
            >
              <option value="supervisor">Supervisor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notification Channels</label>
            <div className="space-y-2">
              {[
                { id: 'email', label: 'Email', icon: Mail },
                { id: 'slack', label: 'Slack', icon: MessageSquare },
                { id: 'sms', label: 'SMS', icon: Smartphone }
              ].map(({ id, label, icon: Icon }) => (
                <label key={id} className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    checked={formData.notificationChannels.includes(id as any)}
                    onChange={e => handleChannelChange(id, e.target.checked)}
                  />
                  <Icon className="ml-2 mr-2 h-4 w-4" />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                checked={formData.isActive}
                onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
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
              {rule ? 'Update' : 'Create'} Rule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
