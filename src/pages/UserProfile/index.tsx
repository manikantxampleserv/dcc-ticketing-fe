import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuth } from 'context/AuthContext';
import { updateUserFn } from 'services/users';
import { departmentsFn } from 'services/Department';
import { Activity, Camera, Edit, Ticket, User, X } from 'lucide-react';
import TicketHistory from 'pages/TicketHistory';
import UserActivityStats from 'pages/UserActivityStats';
import CustomSelect from 'shared/CustomSelect';

const UserProfile = () => {
  const { user: selected } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [previewAvatar, setPreviewAvatar] = useState(selected?.avatar || '');
  const [formData, setFormData] = useState({
    first_name: selected?.first_name || '',
    last_name: selected?.last_name || '',
    email: selected?.email || '',
    phone: selected?.phone || '',
    department_id: selected?.department_id || '',
    avatar: selected?.avatar || '',
    role_id: selected?.role_id
  });

  // Fetch departments
  const { data: departmentsData } = useQuery({ queryKey: ['departments'], queryFn: departmentsFn });
  const departments = departmentsData?.data || [];

  // Update user mutation
  const { mutate: updateUser, isLoading: isUpdatingUser } = useMutation({
    mutationFn: updateUserFn,
    onSuccess: res => {
      toast.success(res.message);
      setIsEditing(false);
    },
    onError: () => toast.error('Failed to update profile')
  });

  // Avatar change handler
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) setPreviewAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFormData(prev => ({ ...prev, avatar: URL.createObjectURL(file) }));
    }
  };

  // Update profile handler
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected?.id) return toast.error('User ID missing');

    const payload = {
      id: selected.id,
      ...formData
    };

    updateUser(payload);
  };

  // Role and status colors
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'supervisor':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'agent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'customer':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  const getStatusColor = (status: boolean) =>
    status ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200';

  return (
    <>
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="relative p-5 flex items-center">
          <div className="relative">
            {previewAvatar ? (
              <img
                className="h-24 w-24 rounded-full border-4 border-white shadow-lg"
                src={previewAvatar}
                alt={`${selected.first_name} ${selected.last_name}`}
              />
            ) : (
              <div className="h-24 w-24 rounded-full border-4 border-white shadow-lg bg-gray-300 flex items-center justify-center">
                <User className="h-10 w-10 text-gray-600" />
              </div>
            )}
            {isEditing && (
              <>
                <input type="file" accept="image/*" className="hidden" id="avatarInput" onChange={handleAvatarChange} />
                <button
                  onClick={() => document.getElementById('avatarInput')?.click()}
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50"
                >
                  <Camera className="h-4 w-4 text-gray-600" />
                </button>
              </>
            )}
          </div>

          <div className="ml-6 flex-1 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 capitalize">
                {selected?.first_name} {selected?.last_name}
              </h1>
              <p className="text-gray-600">{selected?.email}</p>
            </div>
            <div className="flex items-center space-x-3">
              <span
                className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getRoleColor(
                  selected?.user_role?.name || ''
                )}`}
              >
                {selected?.user_role?.name}
              </span>
              <span
                className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(
                  selected?.is_active || false
                )}`}
              >
                {selected?.is_active ? 'Active' : 'Inactive'}
              </span>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center"
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center"
                >
                  <X className="mr-2 h-4 w-4" /> Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white mt-4 rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'profile', label: 'Profile Information', icon: User },
              { key: 'activity', label: 'Activity & Stats', icon: Activity },
              { key: 'tickets', label: 'Ticket History', icon: Ticket }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === key
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="mr-2 h-4 w-4" /> {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <User className="mr-2 h-5 w-5" /> Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.first_name}
                      onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                      placeholder="First Name"
                      className={`w-full px-3 py-2 border rounded-md ${!isEditing ? 'bg-gray-50 text-gray-600' : ''}`}
                    />
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.last_name}
                      onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                      placeholder="Last Name"
                      className={`w-full px-3 py-2 border rounded-md ${!isEditing ? 'bg-gray-50 text-gray-600' : ''}`}
                    />
                  </div>
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email"
                    className={`w-full px-3 py-2 border rounded-md ${!isEditing ? 'bg-gray-50 text-gray-600' : ''}`}
                  />
                  <input
                    type="tel"
                    disabled={!isEditing}
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Phone"
                    className={`w-full px-3 py-2 border rounded-md ${!isEditing ? 'bg-gray-50 text-gray-600' : ''}`}
                  />
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">Department</label>
                    <select
                      value={formData.department_id || ''}
                      disabled={!isEditing}
                      onChange={e => setFormData({ ...formData, department_id: Number(e.target.value) })}
                      className={`w-full px-3 py-2 border rounded-md ${!isEditing ? 'bg-gray-50 text-gray-600' : ''}`}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept: any) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.department_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* System Info */}
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span>ID:</span> <span>{selected?.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Username:</span> <span>{selected?.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Role:</span>{' '}
                    <span className={getRoleColor(selected?.user_role?.name || '')}>{selected?.user_role?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created:</span>{' '}
                    <span>{selected?.created_at ? new Date(selected.created_at).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Login:</span>{' '}
                    <span>
                      {selected?.last_login_at ? new Date(selected.last_login_at).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdatingUser}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                  >
                    {isUpdatingUser ? 'Updating...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          )}

          {activeTab === 'activity' && <UserActivityStats userId={selected?.id} />}
          {activeTab === 'tickets' && <TicketHistory agentId={selected?.id} />}
        </div>
      </div>
    </>
  );
};

export default UserProfile;
