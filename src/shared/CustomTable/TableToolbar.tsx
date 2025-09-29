import * as React from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/joy';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { CustomTableColumn, EnhancedTableToolbarProps } from './types';
import { ColumnFilter } from './ColumnFilter';
import { SkeletonToolbar } from './skeleton';
import toast from 'react-hot-toast';
import PopConfirm from 'components/PopConfirm';

export const EnhancedTableToolbar = React.memo(
  <T,>({
    numSelected,
    title = 'Data Table',
    actions,
    showColumnFilter = true,
    onDelete,
    columns,
    visibleColumns,
    onVisibilityChange,
    loading
  }: EnhancedTableToolbarProps<T>) => {
    const hasSelection = numSelected > 0;

    if (loading) {
      return <SkeletonToolbar />;
    }

    const toolbarContent = React.useMemo(
      () => (
        <>
          {/* Left Title / Selected Count */}
          {hasSelection ? (
            <Typography sx={{ flex: '1 1 100%' }} component="div">
              {numSelected} selected
            </Typography>
          ) : (
            <Typography level="body-lg" sx={{ flex: '1 1 100%' }} id="tableTitle" component="div">
              {title}
            </Typography>
          )}

          {/* Extra Actions */}
          {actions && <Box sx={{ mr: 1 }}>{actions}</Box>}

          {/* Right Buttons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {hasSelection
              ? onDelete && (
                  <PopConfirm
                    title={`Delete ${numSelected} item(s)`}
                    description={`Are you sure you want to delete ${numSelected} selected item(s)?`}
                    okText="Delete"
                    cancelText="Cancel"
                    placement="top"
                    onConfirm={() => {
                      // Call your delete handler
                      onDelete();
                      // toast.success(`${numSelected} item(s) deleted successfully!`);
                    }}
                  >
                    <Tooltip title="Delete">
                      <IconButton size="sm" color="danger" variant="solid">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </PopConfirm>
                )
              : showColumnFilter && (
                  <Tooltip title="Show/Hide Columns">
                    <ColumnFilter
                      columns={columns as CustomTableColumn[]}
                      visibleColumns={visibleColumns}
                      onVisibilityChange={onVisibilityChange}
                    />
                  </Tooltip>
                )}
          </Box>
        </>
      ),
      [
        hasSelection,
        numSelected,
        title,
        actions,
        onDelete,
        showColumnFilter,
        columns,
        visibleColumns,
        onVisibilityChange
      ]
    );

    return (
      <Box
        sx={[
          {
            display: 'flex',
            alignItems: 'center',
            py: 1,
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            borderTopLeftRadius: 'var(--unstable_actionRadius)',
            borderTopRightRadius: 'var(--unstable_actionRadius)'
          },
          hasSelection && {
            bgcolor: 'background.level1'
          }
        ]}
      >
        {toolbarContent}
      </Box>
    );
  }
);

EnhancedTableToolbar.displayName = 'EnhancedTableToolbar';
