import * as React from 'react';
import { Box, FormControl, FormLabel, IconButton, Option, Select, Typography } from '@mui/joy';
import {
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon
} from '@mui/icons-material';
import { TablePagination } from './types';
import { labelDisplayedRows } from './utils';
import { SkeletonPagination } from './skeleton';

interface TablePaginationComponentProps {
  pagination: TablePagination;
  currentPage: number;
  pageSize: number;
  total: number;
  from: number;
  to: number;
  loading?: boolean;
}

export const TablePaginationComponent = React.memo<TablePaginationComponentProps>(
  ({ pagination, currentPage, pageSize, total, from, to, loading = false }) => {
    const maxPage = Math.ceil(total / pageSize);

    const handlePreviousPage = React.useCallback(() => {
      if (currentPage > 1 && pagination.onChange) {
        pagination.onChange(currentPage - 1, pageSize);
      }
    }, [currentPage, pageSize, pagination]);

    const handleNextPage = React.useCallback(() => {
      if (currentPage < maxPage && pagination.onChange) {
        pagination.onChange(currentPage + 1, pageSize);
      }
    }, [currentPage, maxPage, pageSize, pagination]);

    const handlePageSizeChange = React.useCallback(
      (_: any, newValue: number | null) => {
        if (newValue && pagination.onChange) {
          pagination.onChange(1, newValue); // Reset to page 1 when changing page size
        }
      },
      [pagination]
    );

    const pageSizeOptions = React.useMemo(
      () => pagination.pageSizeOptions || [5, 10, 25, 50],
      [pagination.pageSizeOptions]
    );

    if (loading) {
      return <SkeletonPagination />;
    }

    return (
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
          {pagination.showSizeChanger && (
            <FormControl orientation="horizontal" size="sm">
              <FormLabel>Rows per page:</FormLabel>
              <Select value={pageSize} onChange={handlePageSizeChange}>
                {pageSizeOptions.map(size => (
                  <Option key={size} value={size}>
                    {size}
                  </Option>
                ))}
              </Select>
            </FormControl>
          )}

          <Typography sx={{ textAlign: 'center', minWidth: 80 }}>
            {labelDisplayedRows({ from, to, count: total })}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              size="sm"
              color="neutral"
              variant="outlined"
              disabled={currentPage <= 1}
              onClick={handlePreviousPage}
              sx={{ bgcolor: 'background.surface' }}
              aria-label="Previous page"
            >
              <KeyboardArrowLeftIcon />
            </IconButton>
            <IconButton
              size="sm"
              color="neutral"
              variant="outlined"
              disabled={currentPage >= maxPage}
              onClick={handleNextPage}
              sx={{ bgcolor: 'background.surface' }}
              aria-label="Next page"
            >
              <KeyboardArrowRightIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    );
  }
);

TablePaginationComponent.displayName = 'TablePaginationComponent';
