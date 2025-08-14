import { useAuth } from 'context/AuthContext';
import { useFormik } from 'formik';
import {
  Activity,
  Building,
  Camera,
  CheckCircle,
  Clock,
  Edit,
  Key,
  Lock,
  Mail,
  Phone,
  Shield,
  Ticket,
  User,
  X
} from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import CustomInput from 'shared/CustomInput';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showChangePassword, setShowChangePassword] = useState(false);

  const { user } = useAuth();
  const formik = useFormik({
    initialValues: {
      current_password: '',
      new_password: '',
      confirm_password: ''
    },
    onSubmit: () => {}
  });

  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department_id: user?.department_id || ''
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }
    // Handle password change logic here
    toast.success('Password changed successfully');
    setShowChangePassword(false);
    setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
  };

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

  const getStatusColor = (status: boolean) => {
    return status ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <>
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="relative p-5">
          <div className="flex items-center">
            <div className="relative">
              {user?.avatar ? (
                <img
                  className="h-24 w-24 rounded-full border-4 border-white shadow-lg"
                  src={user.avatar}
                  alt={`${user.first_name} ${user.last_name}`}
                />
              ) : (
                <div className="h-24 w-24 rounded-full border-4 border-white shadow-lg bg-gray-300 flex items-center justify-center">
                  <User className="h-10 w-10 text-gray-600" />
                </div>
              )}
              <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50">
                <Camera className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <div className="ml-6 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 capitalize">
                    {user?.first_name} {user?.last_name}
                  </h1>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getRoleColor(
                      user?.user_role?.name || ''
                    )}`}
                  >
                    {user?.user_role?.name}
                  </span>
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(
                      user?.is_active || false
                    )}`}
                  >
                    {user?.is_active ? 'Active' : 'Inactive'}
                  </span>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
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
                <Icon className="mr-2 h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Profile Information Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
                          !isEditing ? 'bg-gray-50 text-gray-600' : ''
                        }`}
                        value={formData.first_name}
                        onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
                          !isEditing ? 'bg-gray-50 text-gray-600' : ''
                        }`}
                        value={formData.last_name}
                        onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="inline mr-1 h-4 w-4" />
                      Email
                    </label>
                    <input
                      type="email"
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
                        !isEditing ? 'bg-gray-50 text-gray-600' : ''
                      }`}
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline mr-1 h-4 w-4" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
                        !isEditing ? 'bg-gray-50 text-gray-600' : ''
                      }`}
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Building className="inline mr-1 h-4 w-4" />
                      Department
                    </label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
                        !isEditing ? 'bg-gray-50 text-gray-600' : ''
                      }`}
                      value={formData.department_id}
                      onChange={e => setFormData({ ...formData, department_id: e.target.value })}
                    />
                  </div>
                </div>

                {/* System Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    System Information
                  </h3>

                  <div className="bg-gray-50 p-4 rounded-lg space-y-5">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">User ID:</span>
                      <span className="text-sm text-gray-600">{user?.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Username:</span>
                      <span className="text-sm text-gray-600">{user?.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Role:</span>
                      <span className={`text-sm px-2 py-1 rounded-full ${getRoleColor(user?.user_role?.name || '')}`}>
                        {user?.user_role?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Created:</span>
                      <span className="text-sm text-gray-600">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Last Login:</span>
                      <span className="text-sm text-gray-600">
                        {user?.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* Activity & Stats Tab */}
          {activeTab === 'activity' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Stats Cards */}
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <div className="flex items-center">
                  <Ticket className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-blue-600">Active Tickets</p>
                    <p className="text-2xl font-bold text-blue-900">{0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-green-600">Resolved</p>
                    <p className="text-2xl font-bold text-green-600">{0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-yellow-600">Avg Response</p>
                    <p className="text-2xl font-bold text-yellow-600">{0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-purple-600">SLA Compliance</p>
                    <p className="text-2xl font-bold text-purple-600">{0}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Key className="mr-2 h-5 w-5" />
              Change Password
            </h2>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <CustomInput
                label="Current Password"
                value={passwordData.current_password}
                type="password"
                startDecorator={<Lock size={18} />}
                name="current_password"
              />
              <CustomInput
                label="New Password"
                formik={formik}
                name="new_password"
                type="password"
                startDecorator={<Lock size={18} />}
              />
              <CustomInput
                label="Confirm New Password"
                formik={formik}
                name="confirm_password"
                type="password"
                startDecorator={<Lock size={18} />}
              />

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
