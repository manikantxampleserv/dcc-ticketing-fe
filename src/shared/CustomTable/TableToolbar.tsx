import * as React from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/joy';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { CustomTableColumn, EnhancedTableToolbarProps } from './types';
import { ColumnFilter } from './ColumnFilter';
import { SkeletonToolbar } from './skeleton';

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
          {hasSelection ? (
            <Typography sx={{ flex: '1 1 100%' }} component="div">
              {numSelected} selected
            </Typography>
          ) : (
            <Typography level="body-lg" sx={{ flex: '1 1 100%' }} id="tableTitle" component="div">
              {title}
            </Typography>
          )}

          {actions && <Box sx={{ mr: 1 }}>{actions}</Box>}

          <Box sx={{ display: 'flex', gap: 1 }}>
            {hasSelection
              ? onDelete && (
                  <Tooltip title="Delete">
                    <IconButton size="sm" color="danger" variant="solid" onClick={onDelete}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
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
