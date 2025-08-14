import { List, ListItemButton } from '@mui/joy';
import { useAuth } from 'context/AuthContext';
import { UserIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfileMenu() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    setIsOpen(false);
  };

  const { user } = useAuth();

  return (
    <div className="relative">
      <div className="flex items-center space-x-3" onClick={() => setIsOpen(!isOpen)}>
        {user?.avatar ? (
          <img className="h-8 w-8 rounded-full" src={user.avatar} alt={user.first_name + ' ' + user.last_name} />
        ) : (
          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
            <UserIcon className="h-5 w-5 text-gray-600" />
          </div>
        )}
        <div className="hidden md:block">
          <p className="text-sm font-medium capitalize text-gray-900">{user?.first_name + ' ' + user?.last_name}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.user_role?.name}</p>
        </div>
      </div>

      {/* Notification Panel */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute -right-5 mt-3.5 w-52 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
            <div className="max-h-80 overflow-y-auto">
              <List>
                <ListItemButton
                  onClick={() => {
                    navigate('/profile');
                    setIsOpen(false);
                  }}
                >
                  Profile
                </ListItemButton>
                <ListItemButton
                  onClick={() => {
                    navigate('/settings');
                    setIsOpen(false);
                  }}
                >
                  Settings
                </ListItemButton>
                <ListItemButton onClick={() => navigate('/change-password')}>Change Password</ListItemButton>
                <ListItemButton onClick={handleLogout}>Logout</ListItemButton>
              </List>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
