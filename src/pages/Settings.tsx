import { Bell, Clock, Mail, Save, Shield, Zap } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import CustomInput from 'shared/CustomInput';

export default function Settings() {
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: 'smtp.gmail.com',
    smtpPort: '587',
    username: 'sapsupport@doubleclick.co.tz',
    password: '',
    enableTLS: true,
    autoReply: true,
    autoReplyMessage:
      'Thank you for contacting DoubleClick IT Support. We have received your request and will respond within our SLA timeframe.'
  });

  const [slaSettings, setSlaSettings] = useState({
    high: 4,
    medium: 24,
    low: 72,
    businessHoursOnly: false,
    businessStart: '09:00',
    businessEnd: '17:00',
    weekendsIncluded: false
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    slaWarnings: true,
    newTicketAlerts: true,
    escalationAlerts: true,
    customerFeedbackAlerts: true,
    warningThreshold: 80 // percentage of SLA time
  });

  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'DoubleClick IT Solutions',
    supportEmail: 'sapsupport@doubleclick.co.tz',
    timezone: 'Africa/Dar_es_Salaam',
    language: 'en',
    ticketPrefix: 'DCK',
    autoAssignment: true,
    requireCustomerFeedback: true,
    allowCustomerReopening: true
  });

  const handleSaveEmailSettings = () => {
    // Save email settings logic here
    toast.success('Email settings saved successfully');
  };

  const handleSaveSLASettings = () => {
    // Save SLA settings logic here
    toast.success('SLA settings saved successfully');
  };

  const handleSaveNotificationSettings = () => {
    // Save notification settings logic here
    toast.success('Notification settings saved successfully');
  };

  const handleSaveGeneralSettings = () => {
    // Save general settings logic here
    toast.success('General settings saved successfully');
  };

  const testEmailConnection = () => {
    // Test email connection logic here
    toast.success('Email connection test successful');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure your ticketing system settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Configuration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Mail className="h-5 w-5 text-blue-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Email Configuration</h2>
          </div>

          <div className="space-y-4">
            <CustomInput
              label="SMTP Server"
              value={emailSettings.smtpServer}
              onChange={(value: string) => {
                setEmailSettings({
                  ...emailSettings,
                  smtpServer: value
                });
              }}
              type="text"
            />

            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                label="Port"
                value={emailSettings.smtpPort}
                onChange={(value: string) => {
                  setEmailSettings({
                    ...emailSettings,
                    smtpPort: value
                  });
                }}
                type="number"
              />
              <div className="flex items-end">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    checked={emailSettings.enableTLS}
                    onChange={e =>
                      setEmailSettings({
                        ...emailSettings,
                        enableTLS: e.target.checked
                      })
                    }
                  />
                  <span className="ml-2 text-sm text-gray-600">Enable TLS</span>
                </label>
              </div>
            </div>

            <CustomInput
              label="Username"
              value={emailSettings.username}
              onChange={(value: string) => {
                setEmailSettings({
                  ...emailSettings,
                  username: value
                });
              }}
              type="email"
            />

            <CustomInput
              label="Password"
              value={emailSettings.password}
              onChange={(value: string) => {
                setEmailSettings({
                  ...emailSettings,
                  password: value
                });
              }}
              type="password"
              placeholder="Enter password"
            />

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={emailSettings.autoReply}
                  onChange={e =>
                    setEmailSettings({
                      ...emailSettings,
                      autoReply: e.target.checked
                    })
                  }
                />
                <span className="ml-2 text-sm text-gray-600">Enable auto-reply</span>
              </label>
            </div>

            {emailSettings.autoReply && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Auto-reply Message</label>
                <textarea
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  value={emailSettings.autoReplyMessage}
                  onChange={e =>
                    setEmailSettings({
                      ...emailSettings,
                      autoReplyMessage: e.target.value
                    })
                  }
                />
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={handleSaveEmailSettings}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </button>
              <button
                onClick={testEmailConnection}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Zap className="h-4 w-4 mr-2" />
                Test Connection
              </button>
            </div>
          </div>
        </div>

        {/* SLA Configuration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Clock className="h-5 w-5 text-green-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">SLA Configuration</h2>
          </div>

          <div className="space-y-4">
            <CustomInput
              label="High Priority (hours)"
              value={slaSettings.high.toString()}
              onChange={(value: string) => {
                setSlaSettings({
                  ...slaSettings,
                  high: parseInt(value) || 0
                });
              }}
              type="number"
            />

            <CustomInput
              label="Medium Priority (hours)"
              value={slaSettings.medium.toString()}
              onChange={(value: string) => {
                setSlaSettings({
                  ...slaSettings,
                  medium: parseInt(value) || 0
                });
              }}
              type="number"
            />

            <CustomInput
              label="Low Priority (hours)"
              value={slaSettings.low.toString()}
              onChange={(value: string) => {
                setSlaSettings({
                  ...slaSettings,
                  low: parseInt(value) || 0
                });
              }}
              type="number"
            />

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={slaSettings.businessHoursOnly}
                  onChange={e =>
                    setSlaSettings({
                      ...slaSettings,
                      businessHoursOnly: e.target.checked
                    })
                  }
                />
                <span className="ml-2 text-sm text-gray-600">Business hours only</span>
              </label>
            </div>

            {slaSettings.businessHoursOnly && (
              <div className="grid grid-cols-2 gap-4">
                <CustomInput
                  label="Business Start"
                  value={slaSettings.businessStart}
                  onChange={(value: string) => {
                    setSlaSettings({
                      ...slaSettings,
                      businessStart: value
                    });
                  }}
                  type="time"
                />
                <CustomInput
                  label="Business End"
                  value={slaSettings.businessEnd}
                  onChange={(value: string) => {
                    setSlaSettings({
                      ...slaSettings,
                      businessEnd: value
                    });
                  }}
                  type="time"
                />
              </div>
            )}

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={slaSettings.weekendsIncluded}
                  onChange={e =>
                    setSlaSettings({
                      ...slaSettings,
                      weekendsIncluded: e.target.checked
                    })
                  }
                />
                <span className="ml-2 text-sm text-gray-600">Include weekends</span>
              </label>
            </div>

            <button
              onClick={handleSaveSLASettings}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Save SLA Settings
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Bell className="h-5 w-5 text-yellow-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={notificationSettings.emailNotifications}
                  onChange={e =>
                    setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: e.target.checked
                    })
                  }
                />
                <span className="ml-2 text-sm text-gray-600">Email notifications</span>
              </label>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={notificationSettings.slaWarnings}
                  onChange={e =>
                    setNotificationSettings({
                      ...notificationSettings,
                      slaWarnings: e.target.checked
                    })
                  }
                />
                <span className="ml-2 text-sm text-gray-600">SLA warning alerts</span>
              </label>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={notificationSettings.newTicketAlerts}
                  onChange={e =>
                    setNotificationSettings({
                      ...notificationSettings,
                      newTicketAlerts: e.target.checked
                    })
                  }
                />
                <span className="ml-2 text-sm text-gray-600">New ticket alerts</span>
              </label>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={notificationSettings.escalationAlerts}
                  onChange={e =>
                    setNotificationSettings({
                      ...notificationSettings,
                      escalationAlerts: e.target.checked
                    })
                  }
                />
                <span className="ml-2 text-sm text-gray-600">Escalation alerts</span>
              </label>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={notificationSettings.customerFeedbackAlerts}
                  onChange={e =>
                    setNotificationSettings({
                      ...notificationSettings,
                      customerFeedbackAlerts: e.target.checked
                    })
                  }
                />
                <span className="ml-2 text-sm text-gray-600">Customer feedback alerts</span>
              </label>
            </div>

            <div>
              <CustomInput
                label="SLA Warning Threshold (%)"
                value={notificationSettings.warningThreshold.toString()}
                onChange={(value: string) => {
                  setNotificationSettings({
                    ...notificationSettings,
                    warningThreshold: parseInt(value) || 0
                  });
                }}
                type="number"
                min="0"
                max="100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Send warning when {notificationSettings.warningThreshold}% of SLA time has elapsed
              </p>
            </div>

            <button
              onClick={handleSaveNotificationSettings}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Notifications
            </button>
          </div>
        </div>

        {/* General Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 text-purple-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">General Settings</h2>
          </div>

          <div className="space-y-4">
            <CustomInput
              label="Company Name"
              value={generalSettings.companyName}
              onChange={(value: string) => {
                setGeneralSettings({
                  ...generalSettings,
                  companyName: value
                });
              }}
              type="text"
            />

            <CustomInput
              label="Support Email"
              value={generalSettings.supportEmail}
              onChange={(value: string) => {
                setGeneralSettings({
                  ...generalSettings,
                  supportEmail: value
                });
              }}
              type="email"
            />

            <CustomInput
              label="Ticket Prefix"
              value={generalSettings.ticketPrefix}
              onChange={(value: string) => {
                setGeneralSettings({
                  ...generalSettings,
                  ticketPrefix: value
                });
              }}
              type="text"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                value={generalSettings.timezone}
                onChange={e =>
                  setGeneralSettings({
                    ...generalSettings,
                    timezone: e.target.value
                  })
                }
              >
                <option value="Africa/Dar_es_Salaam">Africa/Dar es Salaam</option>
                <option value="Africa/Nairobi">Africa/Nairobi</option>
                <option value="UTC">UTC</option>
              </select>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={generalSettings.autoAssignment}
                  onChange={e =>
                    setGeneralSettings({
                      ...generalSettings,
                      autoAssignment: e.target.checked
                    })
                  }
                />
                <span className="ml-2 text-sm text-gray-600">Auto-assign tickets</span>
              </label>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={generalSettings.requireCustomerFeedback}
                  onChange={e =>
                    setGeneralSettings({
                      ...generalSettings,
                      requireCustomerFeedback: e.target.checked
                    })
                  }
                />
                <span className="ml-2 text-sm text-gray-600">Require customer feedback</span>
              </label>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={generalSettings.allowCustomerReopening}
                  onChange={e =>
                    setGeneralSettings({
                      ...generalSettings,
                      allowCustomerReopening: e.target.checked
                    })
                  }
                />
                <span className="ml-2 text-sm text-gray-600">Allow customer to reopen tickets</span>
              </label>
            </div>

            <button
              onClick={handleSaveGeneralSettings}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Save General Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
