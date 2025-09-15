import React from 'react';
import { Button, Box, Typography } from '@mui/joy';
import { Trash2 } from 'lucide-react';
import PopConfirm from './PopConfirm';
import toast from 'react-hot-toast';

const PopConfirmExample: React.FC = () => {
  const handleDelete = async () => {
    // Simulate API call with loading
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success('Task deleted successfully!');
  };

  const handleQuickAction = async () => {
    // Quick action
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success('Quick action completed!');
  };

  const handleErrorAction = async () => {
    // Simulate error
    await new Promise(resolve => setTimeout(resolve, 1000));
    throw new Error('Something went wrong!');
  };

  return (
    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <Typography level="h2" sx={{ mb: 2 }}>
        PopConfirm with Promise Loader
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <PopConfirm
          title="Delete the task"
          description="Are you sure to delete this task?"
          onConfirm={handleDelete}
          okText="Yes"
          cancelText="No"
          placement="top"
        >
          <Button color="danger" variant="outlined" startDecorator={<Trash2 size={16} />}>
            Delete (2s loading)
          </Button>
        </PopConfirm>

        <PopConfirm
          title="Quick action"
          description="This will complete quickly"
          onConfirm={handleQuickAction}
          okText="Confirm"
          cancelText="Cancel"
          placement="top"
        >
          <Button color="primary" variant="soft">
            Quick Action (0.5s)
          </Button>
        </PopConfirm>

        <PopConfirm
          title="Error simulation"
          description="This will fail and keep dialog open"
          onConfirm={handleErrorAction}
          okText="Try"
          cancelText="Cancel"
          placement="top"
        >
          <Button color="warning" variant="outlined">
            Test Error
          </Button>
        </PopConfirm>
      </Box>

      <Typography level="body-sm" sx={{ color: 'text.secondary', textAlign: 'center', maxWidth: 500 }}>
        Click any button to see the PopConfirm with promise loading states:
        <br />
        • Loading spinner appears on confirmation button
        <br />
        • Both buttons are disabled during loading
        <br />• Dialog closes on success, stays open on error
      </Typography>
    </Box>
  );
};

export default PopConfirmExample;
