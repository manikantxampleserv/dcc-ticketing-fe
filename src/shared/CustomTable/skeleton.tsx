import * as React from 'react';
import { Box, Skeleton } from '@mui/joy';
import { SkeletonRowProps } from './types';
import { getSkeletonHeight, getSkeletonWidth } from './utils';

export const SkeletonRow = React.memo<SkeletonRowProps>(({ columns, visibleColumns, rowSelection, size = 'md' }) => {
  const filteredColumns = React.useMemo(
    () => columns.filter(column => visibleColumns.includes(column.key)),
    [columns, visibleColumns]
  );

  const skeletonHeight = React.useMemo(() => getSkeletonHeight(size), [size]);

  return (
    <tr>
      {rowSelection && (
        <td>
          <Skeleton variant="rectangular" width={16} height={16} sx={{ borderRadius: '2px' }} />
        </td>
      )}
      {filteredColumns.map(column => (
        <td key={column.key} style={{ textAlign: column.align || 'left' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ flex: 1 }}>
              <Skeleton
                variant="rectangular"
                height={skeletonHeight}
                width={getSkeletonWidth(column)}
                sx={{ borderRadius: '4px' }}
              />
            </Box>
          </Box>
        </td>
      ))}
    </tr>
  );
});

SkeletonRow.displayName = 'SkeletonRow';

export const SkeletonToolbar = React.memo(() => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      py: 1,
      pl: { sm: 2 },
      pr: { xs: 1, sm: 1 },
      borderTopLeftRadius: 'var(--unstable_actionRadius)',
      borderTopRightRadius: 'var(--unstable_actionRadius)'
    }}
  >
    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Skeleton variant="rectangular" width={120} height={20} sx={{ borderRadius: '4px' }} />
    </Box>

    <Box sx={{ display: 'flex', gap: 1 }}>
      <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: '6px' }} />
      <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: '6px' }} />
    </Box>
  </Box>
));

SkeletonToolbar.displayName = 'SkeletonToolbar';

export const SkeletonPagination = React.memo(() => (
  <Box
    sx={{
      borderTop: '1px solid',
      borderColor: 'divider',
      borderRadius: 'sm',
      backgroundColor: 'background.surface'
    }}
  >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        justifyContent: 'flex-end',
        p: 1
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Skeleton variant="rectangular" width={80} height={16} sx={{ borderRadius: '4px' }} />
        <Skeleton variant="rectangular" width={60} height={32} sx={{ borderRadius: '6px' }} />
      </Box>

      <Skeleton variant="rectangular" width={100} height={16} sx={{ borderRadius: '4px' }} />

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: '6px' }} />
        <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: '6px' }} />
      </Box>
    </Box>
  </Box>
));

SkeletonPagination.displayName = 'SkeletonPagination';
