// import { Bell, Clock, Mail, Save, Shield, Trash, Zap } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import toast from 'react-hot-toast';
// import CustomInput from 'shared/CustomInput';
// import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
// import {
//   upsertEmailConfigurationFn,
//   deleteEmailConfigurationFn,
//   emailConfigurationFn
// } from 'services/EmailConfiguration';
// import { AxiosError } from 'axios';

// interface EmailConfiguration {
//   id: number;
//   smtp_server: string;
//   smtp_port: number;
//   username: string;
//   password?: string;
//   enable_tls: boolean;
//   from_email?: string;
//   from_name?: string;
//   auto_reply_enabled: boolean;
//   auto_reply_message?: string;
//   is_active: boolean;
// }

// interface EmailConfigApiResponse {
//   success: boolean;
//   message: string;
//   data: EmailConfiguration[];
//   pagination: {
//     current_page: number;
//     total_pages: number;
//     total_count: number;
//     has_next: boolean;
//     has_previous: boolean;
//   };
// }

// export default function Settings() {
//   const queryClient = useQueryClient();

//   const { data: emailConfigData } = useQuery({
//     queryKey: ['email-configurations'],
//     queryFn: () => emailConfigurationFn({ page: 1, limit: 10 })
//   }) as { data: EmailConfigApiResponse | undefined };

//   interface ApiResponse {
//     message: string;
//     data?: EmailConfiguration;
//   }

//   const upsertEmailConfig = useMutation<ApiResponse, AxiosError, Partial<EmailConfiguration>>({
//     mutationFn: payload => upsertEmailConfigurationFn(payload),
//     onSuccess: res => {
//       toast.success(res.message || 'Email settings saved successfully');
//       queryClient.invalidateQueries({ queryKey: ['email-configurations'] });
//     },
//     onError: (err: any) => {
//       toast.error(err.response?.data?.err || 'Something went wrong');
//     }
//   });

//   const deleteEmailConfig = useMutation<ApiResponse, AxiosError, number>({
//     mutationFn: id => deleteEmailConfigurationFn(id),
//     onSuccess: res => {
//       toast.success(res.message || 'Email configuration deleted');
//       setEmailSettings(defaultEmailSettings);
//       queryClient.invalidateQueries({ queryKey: ['email-configurations'] });
//     },
//     onError: (err: any) => {
//       toast.error(err.response?.data?.message || 'Delete failed');
//     }
//   });

//   const defaultEmailSettings = {
//     smtpServer: 'smtp.gmail.com',
//     smtpPort: 587,
//     username: 'sapsupport@doubleclick.co.tz',
//     password: '',
//     enableTLS: true,
//     autoReply: true,
//     autoReplyMessage:
//       'Thank you for contacting DoubleClick IT Support. We have received your request and will respond within our SLA timeframe.',
//     fromEmail: 'abc@gmail.com',
//     fromName: 'hrms',
//     isActive: true
//   };
//   const [emailSettings, setEmailSettings] = useState({
//     smtpServer: 'smtp.gmail.com',
//     smtpPort: 587,
//     username: 'sapsupport@doubleclick.co.tz',
//     password: '',
//     enableTLS: true,
//     autoReply: true,
//     autoReplyMessage: '',
//     fromEmail: 'abc@gmail.com',
//     fromName: 'hrms',
//     isActive: true
//   });

//   const [slaSettings, setSlaSettings] = useState({
//     high: 4,
//     medium: 24,
//     low: 72,
//     businessHoursOnly: false,
//     businessStart: '09:00',
//     businessEnd: '17:00',
//     weekendsIncluded: false
//   });

//   const [notificationSettings, setNotificationSettings] = useState({
//     emailNotifications: true,
//     slaWarnings: true,
//     newTicketAlerts: true,
//     escalationAlerts: true,
//     customerFeedbackAlerts: true,
//     warningThreshold: 80
//   });

//   const [generalSettings, setGeneralSettings] = useState({
//     companyName: 'DoubleClick IT Solutions',
//     supportEmail: 'sapsupport@doubleclick.co.tz',
//     timezone: 'Africa/Dar_es_Salaam',
//     language: 'en',
//     ticketPrefix: 'DCK',
//     autoAssignment: true,
//     requireCustomerFeedback: true,
//     allowCustomerReopening: true
//   });

//   useEffect(() => {
//     const firstConfig = emailConfigData?.data?.[0];
//     if (firstConfig) {
//       setEmailSettings({
//         smtpServer: firstConfig.smtp_server,
//         smtpPort: firstConfig.smtp_port,
//         username: firstConfig.username,
//         password: '',
//         enableTLS: firstConfig.enable_tls,
//         autoReply: firstConfig.auto_reply_enabled,
//         autoReplyMessage: firstConfig.auto_reply_message || '',
//         fromEmail: firstConfig.from_email || '',
//         fromName: firstConfig.from_name || '',
//         isActive: firstConfig.is_active ?? true
//       });
//     }
//   }, [emailConfigData]);

//   const handleSaveEmailSettings = () => {
//     const id = emailConfigData?.data?.[0]?.id;
//     if (!id) return toast.error('No email configuration found');

//     upsertEmailConfig.mutate({
//       id,
//       smtp_server: emailSettings.smtpServer,
//       smtp_port: emailSettings.smtpPort,
//       username: emailSettings.username,
//       password: emailSettings.password,
//       enable_tls: emailSettings.enableTLS,
//       from_email: emailSettings.fromEmail,
//       from_name: emailSettings.fromName,
//       is_active: emailSettings.isActive,
//       auto_reply_enabled: emailSettings.autoReply,
//       auto_reply_message: emailSettings.autoReplyMessage
//     });
//   };

//   const handleDeleteEmailSettings = () => {
//     const id = emailConfigData?.data?.[0]?.id;
//     if (!id) return toast.error('No email configuration to delete');

//     if (window.confirm('Are you sure you want to delete this email configuration?')) {
//       deleteEmailConfig.mutate(id);
//     }
//   };

//   const handleSaveSLASettings = () => toast.success('SLA settings saved successfully');
//   const handleSaveNotificationSettings = () => toast.success('Notification settings saved successfully');
//   const handleSaveGeneralSettings = () => toast.success('General settings saved successfully');
//   const testEmailConnection = () => toast.success('Email connection test successful');

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
//         <p className="text-gray-600">Configure your ticketing system settings and preferences</p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Email Configuration */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center mb-4">
//             <Mail className="h-5 w-5 text-blue-500 mr-2" />
//             <h2 className="text-lg font-semibold text-gray-900">Email Configuration</h2>
//           </div>

//           <div className="space-y-4">
//             <CustomInput
//               label="SMTP Server"
//               type="text"
//               value={emailSettings.smtpServer}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                 setEmailSettings({ ...emailSettings, smtpServer: e.target.value })
//               }
//             />

//             <CustomInput
//               label="Port"
//               type="number"
//               value={emailSettings.smtpPort}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                 setEmailSettings({ ...emailSettings, smtpPort: parseInt(e.target.value) || 0 })
//               }
//             />

//             <CustomInput
//               label="Username"
//               type="email"
//               value={emailSettings.username}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                 setEmailSettings({ ...emailSettings, username: e.target.value })
//               }
//             />

//             <CustomInput
//               label="From Email"
//               type="email"
//               value={emailSettings.fromEmail}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                 setEmailSettings({ ...emailSettings, fromEmail: e.target.value })
//               }
//             />

//             <CustomInput
//               label="From Name"
//               type="text"
//               value={emailSettings.fromName}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                 setEmailSettings({ ...emailSettings, fromName: e.target.value })
//               }
//             />

//             <CustomInput
//               label="Password"
//               type="password"
//               value={emailSettings.password}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                 setEmailSettings({ ...emailSettings, password: e.target.value })
//               }
//             />

//             {emailSettings.autoReply && (
//               <textarea
//                 rows={3}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2"
//                 value={emailSettings.autoReplyMessage}
//                 onChange={e => setEmailSettings({ ...emailSettings, autoReplyMessage: e.target.value })}
//               />
//             )}

//             <div className="flex space-x-3">
//               <button
//                 onClick={handleSaveEmailSettings}
//                 className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
//               >
//                 <Save className="h-4 w-4 mr-2" />
//                 Save
//               </button>

//               {emailConfigData?.data?.[0]?.id && (
//                 <button
//                   onClick={handleDeleteEmailSettings}
//                   className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//                 >
//                   <Trash className="h-4 w-4 mr-2" />
//                   Delete
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* SLA Configuration */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center mb-4">
//             <Clock className="h-5 w-5 text-green-500 mr-2" />
//             <h2 className="text-lg font-semibold text-gray-900">SLA Configuration</h2>
//           </div>

//           <div className="space-y-4">
//             <CustomInput
//               label="High Priority (hours)"
//               value={slaSettings.high.toString()}
//               onChange={(value: string) => {
//                 setSlaSettings({
//                   ...slaSettings,
//                   high: parseInt(value) || 0
//                 });
//               }}
//               type="number"
//             />

//             <CustomInput
//               label="Medium Priority (hours)"
//               value={slaSettings.medium.toString()}
//               onChange={(value: string) => {
//                 setSlaSettings({
//                   ...slaSettings,
//                   medium: parseInt(value) || 0
//                 });
//               }}
//               type="number"
//             />

//             <CustomInput
//               label="Low Priority (hours)"
//               value={slaSettings.low.toString()}
//               onChange={(value: string) => {
//                 setSlaSettings({
//                   ...slaSettings,
//                   low: parseInt(value) || 0
//                 });
//               }}
//               type="number"
//             />

//             <div>
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                   checked={slaSettings.businessHoursOnly}
//                   onChange={e =>
//                     setSlaSettings({
//                       ...slaSettings,
//                       businessHoursOnly: e.target.checked
//                     })
//                   }
//                 />
//                 <span className="ml-2 text-sm text-gray-600">Business hours only</span>
//               </label>
//             </div>

//             {slaSettings.businessHoursOnly && (
//               <div className="grid grid-cols-2 gap-4">
//                 <CustomInput
//                   label="Business Start"
//                   value={slaSettings.businessStart}
//                   onChange={(value: string) => {
//                     setSlaSettings({
//                       ...slaSettings,
//                       businessStart: value
//                     });
//                   }}
//                   type="time"
//                 />
//                 <CustomInput
//                   label="Business End"
//                   value={slaSettings.businessEnd}
//                   onChange={(value: string) => {
//                     setSlaSettings({
//                       ...slaSettings,
//                       businessEnd: value
//                     });
//                   }}
//                   type="time"
//                 />
//               </div>
//             )}

//             <div>
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                   checked={slaSettings.weekendsIncluded}
//                   onChange={e =>
//                     setSlaSettings({
//                       ...slaSettings,
//                       weekendsIncluded: e.target.checked
//                     })
//                   }
//                 />
//                 <span className="ml-2 text-sm text-gray-600">Include weekends</span>
//               </label>
//             </div>

//             <button
//               onClick={handleSaveSLASettings}
//               className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
//             >
//               <Save className="h-4 w-4 mr-2" />
//               Save SLA Settings
//             </button>
//           </div>
//         </div>

//         {/* Notification Settings */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center mb-4">
//             <Bell className="h-5 w-5 text-yellow-500 mr-2" />
//             <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
//           </div>

//           <div className="space-y-4">
//             <div>
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                   checked={notificationSettings.emailNotifications}
//                   onChange={e =>
//                     setNotificationSettings({
//                       ...notificationSettings,
//                       emailNotifications: e.target.checked
//                     })
//                   }
//                 />
//                 <span className="ml-2 text-sm text-gray-600">Email notifications</span>
//               </label>
//             </div>

//             <div>
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                   checked={notificationSettings.slaWarnings}
//                   onChange={e =>
//                     setNotificationSettings({
//                       ...notificationSettings,
//                       slaWarnings: e.target.checked
//                     })
//                   }
//                 />
//                 <span className="ml-2 text-sm text-gray-600">SLA warning alerts</span>
//               </label>
//             </div>

//             <div>
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                   checked={notificationSettings.newTicketAlerts}
//                   onChange={e =>
//                     setNotificationSettings({
//                       ...notificationSettings,
//                       newTicketAlerts: e.target.checked
//                     })
//                   }
//                 />
//                 <span className="ml-2 text-sm text-gray-600">New ticket alerts</span>
//               </label>
//             </div>

//             <div>
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                   checked={notificationSettings.escalationAlerts}
//                   onChange={e =>
//                     setNotificationSettings({
//                       ...notificationSettings,
//                       escalationAlerts: e.target.checked
//                     })
//                   }
//                 />
//                 <span className="ml-2 text-sm text-gray-600">Escalation alerts</span>
//               </label>
//             </div>

//             <div>
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                   checked={notificationSettings.customerFeedbackAlerts}
//                   onChange={e =>
//                     setNotificationSettings({
//                       ...notificationSettings,
//                       customerFeedbackAlerts: e.target.checked
//                     })
//                   }
//                 />
//                 <span className="ml-2 text-sm text-gray-600">Customer feedback alerts</span>
//               </label>
//             </div>

//             <div>
//               <CustomInput
//                 label="SLA Warning Threshold (%)"
//                 value={notificationSettings.warningThreshold.toString()}
//                 onChange={(value: string) => {
//                   setNotificationSettings({
//                     ...notificationSettings,
//                     warningThreshold: parseInt(value) || 0
//                   });
//                 }}
//                 type="number"
//                 min="0"
//                 max="100"
//               />
//               <p className="text-xs text-gray-500 mt-1">
//                 Send warning when {notificationSettings.warningThreshold}% of SLA time has elapsed
//               </p>
//             </div>

//             <button
//               onClick={handleSaveNotificationSettings}
//               className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
//             >
//               <Save className="h-4 w-4 mr-2" />
//               Save Notifications
//             </button>
//           </div>
//         </div>

//         {/* General Settings */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center mb-4">
//             <Shield className="h-5 w-5 text-purple-500 mr-2" />
//             <h2 className="text-lg font-semibold text-gray-900">General Settings</h2>
//           </div>

//           <div className="space-y-4">
//             <CustomInput
//               label="Company Name"
//               value={generalSettings.companyName}
//               onChange={(value: string) => {
//                 setGeneralSettings({
//                   ...generalSettings,
//                   companyName: value
//                 });
//               }}
//               type="text"
//             />

//             <CustomInput
//               label="Support Email"
//               value={generalSettings.supportEmail}
//               onChange={(value: string) => {
//                 setGeneralSettings({
//                   ...generalSettings,
//                   supportEmail: value
//                 });
//               }}
//               type="email"
//             />

//             <CustomInput
//               label="Ticket Prefix"
//               value={generalSettings.ticketPrefix}
//               onChange={(value: string) => {
//                 setGeneralSettings({
//                   ...generalSettings,
//                   ticketPrefix: value
//                 });
//               }}
//               type="text"
//             />

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
//               <select
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
//                 value={generalSettings.timezone}
//                 onChange={e =>
//                   setGeneralSettings({
//                     ...generalSettings,
//                     timezone: e.target.value
//                   })
//                 }
//               >
//                 <option value="Africa/Dar_es_Salaam">Africa/Dar es Salaam</option>
//                 <option value="Africa/Nairobi">Africa/Nairobi</option>
//                 <option value="UTC">UTC</option>
//               </select>
//             </div>

//             <div>
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                   checked={generalSettings.autoAssignment}
//                   onChange={e =>
//                     setGeneralSettings({
//                       ...generalSettings,
//                       autoAssignment: e.target.checked
//                     })
//                   }
//                 />
//                 <span className="ml-2 text-sm text-gray-600">Auto-assign tickets</span>
//               </label>
//             </div>

//             <div>
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                   checked={generalSettings.requireCustomerFeedback}
//                   onChange={e =>
//                     setGeneralSettings({
//                       ...generalSettings,
//                       requireCustomerFeedback: e.target.checked
//                     })
//                   }
//                 />
//                 <span className="ml-2 text-sm text-gray-600">Require customer feedback</span>
//               </label>
//             </div>

//             <div>
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                   checked={generalSettings.allowCustomerReopening}
//                   onChange={e =>
//                     setGeneralSettings({
//                       ...generalSettings,
//                       allowCustomerReopening: e.target.checked
//                     })
//                   }
//                 />
//                 <span className="ml-2 text-sm text-gray-600">Allow customer to reopen tickets</span>
//               </label>
//             </div>

//             <button
//               onClick={handleSaveGeneralSettings}
//               className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
//             >
//               <Save className="h-4 w-4 mr-2" />
//               Save General Settings
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { Bell, Clock, Mail, Save, Shield, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import CustomInput from 'shared/CustomInput';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  upsertEmailConfigurationFn,
  deleteEmailConfigurationFn,
  emailConfigurationFn
} from 'services/EmailConfiguration';
import { AxiosError } from 'axios';
import { deleteSLAFn, slaFn, upsertSLAFn } from 'services/SLAConfiguration';

interface EmailConfiguration {
  id: number;
  smtp_server: string;
  smtp_port: number;
  username: string;
  password?: string;
  enable_tls: boolean;
  from_email?: string;
  from_name?: string;
  auto_reply_enabled: boolean;
  auto_reply_message?: string;
  is_active: boolean;
}
interface EmailConfigApiResponse {
  success: boolean;
  message: string;
  data: EmailConfiguration[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

export default function Settings() {
  const queryClient = useQueryClient();

  const { data: emailConfigData } = useQuery({
    queryKey: ['email-configurations'],
    queryFn: () => emailConfigurationFn({ page: 1, limit: 10 })
  }) as { data: EmailConfigApiResponse | undefined };

  const { data: slaData } = useQuery({
    queryKey: ['sla-config'],
    queryFn: slaFn
  });

  const [slaSettings, setSlaSettings] = useState({
    priority: 'High',
    response_time_hours: 0,
    resolution_time_hours: 0,
    business_hours_only: false,
    business_start_time: '09:00',
    business_end_time: '17:00',
    include_weekends: false,
    is_active: true
  });

  useEffect(() => {
    const config = slaData?.data?.[0];
    if (config) {
      setSlaSettings({
        priority: config.priority || 'High',
        response_time_hours: config.response_time_hours || 0,
        resolution_time_hours: config.resolution_time_hours || 0,
        business_hours_only: config.business_hours_only ?? false,
        business_start_time: config.business_start_time || '09:00',
        business_end_time: config.business_end_time || '17:00',
        include_weekends: config.include_weekends ?? false,
        is_active: config.is_active ?? true
      });
    }
  }, [slaData]);

  const slaMutation = useMutation({
    mutationFn: upsertSLAFn,
    onSuccess: () => {
      toast.success('SLA saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['sla-config'] });
    },
    onError: () => {
      toast.error('Failed to save SLA');
    }
  });

  const deleteSLAMutation = useMutation({
    mutationFn: (id: number) => deleteSLAFn(id),
    onSuccess: () => {
      toast.success('SLA configuration deleted');
      queryClient.invalidateQueries({ queryKey: ['sla-config'] });
      setSlaSettings({
        priority: 'High',
        response_time_hours: 0,
        resolution_time_hours: 0,
        business_hours_only: false,
        business_start_time: '09:00',
        business_end_time: '17:00',
        include_weekends: false,
        is_active: true
      });
    },
    onError: () => {
      toast.error('Failed to delete SLA configuration');
    }
  });

  interface ApiResponse {
    message: string;
    data?: EmailConfiguration;
  }

  const upsertEmailConfig = useMutation<ApiResponse, AxiosError, Partial<EmailConfiguration>>({
    mutationFn: payload => upsertEmailConfigurationFn(payload),
    onSuccess: res => {
      toast.success(res.message || 'Email settings saved successfully');
      queryClient.invalidateQueries({ queryKey: ['email-configurations'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.err || 'Something went wrong');
    }
  });

  const deleteEmailConfig = useMutation<ApiResponse, AxiosError, number>({
    mutationFn: id => deleteEmailConfigurationFn(id),
    onSuccess: res => {
      toast.success(res.message || 'Email configuration deleted');
      setEmailSettings({
        smtp_server: 'smtp.gmail.com',
        smtp_port: 587,
        username: 'sapsupport@doubleclick.co.tz',
        password: '',
        enable_tls: true,
        auto_reply_enabled: true,
        auto_reply_message:
          'Thank you for contacting DoubleClick IT Support. We have received your request and will respond within our SLA timeframe.',
        from_email: 'abc@gmail.com',
        from_name: 'hrms',
        is_active: true
      });
      queryClient.invalidateQueries({ queryKey: ['email-configurations'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  });

  const [emailSettings, setEmailSettings] = useState({
    smtp_server: 'smtp.gmail.com',
    smtp_port: 587,
    username: 'sapsupport@doubleclick.co.tz',
    password: '',
    enable_tls: true,
    auto_reply_enabled: true,
    auto_reply_message:
      'Thank you for contacting DoubleClick IT Support. We have received your request and will respond within our SLA timeframe.',
    from_email: 'abc@gmail.com',
    from_name: 'hrms',
    is_active: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    slaWarnings: true,
    newTicketAlerts: true,
    escalationAlerts: true,
    customerFeedbackAlerts: true,
    warningThreshold: 80
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

  useEffect(() => {
    const firstConfig = emailConfigData?.data?.[0];
    if (firstConfig) {
      setEmailSettings(prev => ({
        smtp_server: firstConfig.smtp_server,
        smtp_port: firstConfig.smtp_port,
        username: firstConfig.username,
        password: firstConfig.password ?? prev.password ?? '',
        enable_tls: firstConfig.enable_tls,
        auto_reply_enabled: firstConfig.auto_reply_enabled,
        auto_reply_message: firstConfig.auto_reply_message || '',
        from_email: firstConfig.from_email || '',
        from_name: firstConfig.from_name || '',
        is_active: firstConfig.is_active ?? true
      }));
    }
  }, [emailConfigData]);

  const handleSaveEmailSettings = () => {
    const id = emailConfigData?.data?.[0]?.id;
    if (!id) return toast.error('No email configuration found');

    upsertEmailConfig.mutate({
      id,
      smtp_server: emailSettings.smtp_server,
      smtp_port: emailSettings.smtp_port,
      username: emailSettings.username,
      password: emailSettings.password,
      enable_tls: emailSettings.enable_tls,
      from_email: emailSettings.from_email,
      from_name: emailSettings.from_name,
      is_active: emailSettings.is_active,
      auto_reply_enabled: emailSettings.auto_reply_enabled,
      auto_reply_message: emailSettings.auto_reply_message
    });
  };

  const handleDeleteEmailSettings = () => {
    const id = emailConfigData?.data?.[0]?.id;
    if (!id) return toast.error('No email configuration to delete');

    if (window.confirm('Are you sure you want to delete this email configuration?')) {
      deleteEmailConfig.mutate(id);
    }
  };

  const handleSaveSLASettings = () => {
    const id = slaData?.data?.[0]?.id;
    slaMutation.mutate({
      id,
      priority: slaSettings.priority,
      response_time_hours: slaSettings.response_time_hours,
      resolution_time_hours: slaSettings.resolution_time_hours,
      business_hours_only: slaSettings.business_hours_only,
      business_start_time: slaSettings.business_start_time,
      business_end_time: slaSettings.business_end_time,
      include_weekends: slaSettings.include_weekends,
      is_active: slaSettings.is_active
    });
  };

  const handleDeleteSLASettings = () => {
    const id = slaData?.data?.[0]?.id;
    if (!id) return toast.error('No SLA configuration to delete');

    if (window.confirm('Are you sure you want to delete this SLA configuration?')) {
      deleteSLAMutation.mutate(id);
    }
  };

  const handleSaveNotificationSettings = () => toast.success('Notification settings saved successfully');
  const handleSaveGeneralSettings = () => toast.success('General settings saved successfully');
  return (
    <div className="space-y-6">
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
              name="smtp_server"
              label="SMTP Server"
              type="text"
              value={emailSettings.smtp_server}
              onChange={e => setEmailSettings({ ...emailSettings, smtp_server: e.target.value })}
            />

            <CustomInput
              name="smtp_port"
              label="Port"
              type="number"
              value={emailSettings.smtp_port}
              onChange={e => setEmailSettings({ ...emailSettings, smtp_port: parseInt(e.target.value) || 0 })}
            />

            <CustomInput
              name="username"
              label="Username"
              type="email"
              value={emailSettings.username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmailSettings({ ...emailSettings, username: e.target.value })
              }
            />

            <CustomInput
              name="from_email"
              label="From Email"
              type="email"
              value={emailSettings.from_email}
              onChange={e => setEmailSettings({ ...emailSettings, from_email: e.target.value })}
            />

            <CustomInput
              name="from_name"
              label="From Name"
              type="text"
              value={emailSettings.from_name}
              onChange={e => setEmailSettings({ ...emailSettings, from_name: e.target.value })}
            />

            <CustomInput
              name="password"
              label="Password"
              type="password"
              value={emailSettings.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmailSettings({ ...emailSettings, password: e.target.value })
              }
            />
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={emailSettings.enable_tls}
                onChange={e => setEmailSettings({ ...emailSettings, enable_tls: e.target.checked })}
              />
              <span className="ml-2 text-sm text-gray-600">Enable TLS</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={emailSettings.auto_reply_enabled}
                onChange={e => setEmailSettings({ ...emailSettings, auto_reply_enabled: e.target.checked })}
              />
              <span className="ml-2 text-sm text-gray-600">Enable Auto Reply</span>
            </label>

            <div className="flex space-x-3">
              <button
                onClick={handleSaveEmailSettings}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </button>

              {emailConfigData?.data?.[0]?.id && (
                <button
                  onClick={handleDeleteEmailSettings}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
        {/* SLA Configuration */}{' '}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Clock className="h-5 w-5 text-green-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">SLA Configuration</h2>
          </div>

          <div className="space-y-4">
            <CustomInput
              name="priority"
              label="Priority"
              value={slaSettings.priority ?? ''}
              onChange={e => setSlaSettings({ ...slaSettings, priority: e.target.value })}
            />

            <CustomInput
              name="response_time_hours"
              label="Response Time (hours)"
              value={slaSettings.response_time_hours ?? ''}
              onChange={e =>
                setSlaSettings({
                  ...slaSettings,
                  response_time_hours: parseInt(e.target.value) || 0
                })
              }
              type="number"
            />

            <CustomInput
              name="resolution_time_hours"
              label="Resolution Time (hours)"
              value={slaSettings.resolution_time_hours ?? ''}
              onChange={e =>
                setSlaSettings({
                  ...slaSettings,
                  resolution_time_hours: parseInt(e.target.value) || 0
                })
              }
              type="number"
            />

            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                checked={slaSettings.business_hours_only ?? false}
                onChange={e =>
                  setSlaSettings({
                    ...slaSettings,
                    business_hours_only: e.target.checked
                  })
                }
              />
              <span className="ml-2 text-sm text-gray-600">Business hours only</span>
            </label>

            {slaSettings.business_hours_only && (
              <div className="grid grid-cols-2 gap-4">
                <CustomInput
                  name="business_start_time"
                  label="Business Start"
                  value={slaSettings.business_start_time ?? ''}
                  onChange={e => setSlaSettings({ ...slaSettings, business_start_time: e.target.value })}
                  type="time"
                />
                <CustomInput
                  name="business_end_time"
                  label="Business End"
                  value={slaSettings.business_end_time ?? ''}
                  onChange={e => setSlaSettings({ ...slaSettings, business_end_time: e.target.value })}
                  type="time"
                />
              </div>
            )}

            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                checked={slaSettings.include_weekends ?? false}
                onChange={e =>
                  setSlaSettings({
                    ...slaSettings,
                    include_weekends: e.target.checked
                  })
                }
              />
              <span className="ml-2 text-sm text-gray-600">Include weekends</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                checked={slaSettings.is_active ?? false}
                onChange={e =>
                  setSlaSettings({
                    ...slaSettings,
                    is_active: e.target.checked
                  })
                }
              />
              <span className="ml-2 text-sm text-gray-600">Active</span>
            </label>

            <button
              onClick={handleSaveSLASettings}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Save SLA Settings
            </button>
            {slaData?.data?.[0]?.id && (
              <button
                onClick={handleDeleteSLASettings}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </button>
            )}
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
                name="warningThreshold"
                label="SLA Warning Threshold (%)"
                value={notificationSettings.warningThreshold.toString()}
                onChange={e =>
                  setNotificationSettings({
                    ...notificationSettings,
                    warningThreshold: parseInt(e.target.value) || 0
                  })
                }
                type="number"
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
              name="companyName"
              value={generalSettings.companyName}
              onChange={e => setGeneralSettings({ ...generalSettings, companyName: e.target.value })}
              type="text"
            />

            <CustomInput
              label="Support Email"
              name="supportEmail"
              value={generalSettings.supportEmail}
              onChange={e => setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })}
              type="email"
            />

            <CustomInput
              label="Ticket Prefix"
              name="ticketPrefix"
              value={generalSettings.ticketPrefix}
              onChange={e => setGeneralSettings({ ...generalSettings, ticketPrefix: e.target.value })}
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
