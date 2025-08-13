import * as React from 'react';
import { Box, Checkbox, Link, Skeleton, Typography } from '@mui/joy';
import { ArrowDownward as ArrowDownwardIcon } from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';
import { EnhancedTableHeadProps } from './types';
import { getFilteredColumns } from './utils';

export const EnhancedTableHead = React.memo(
  <T,>({
    columns,
    visibleColumns,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    rowSelection,
    loading
  }: EnhancedTableHeadProps<T>) => {
    const filteredColumns = React.useMemo(() => getFilteredColumns(columns, visibleColumns), [columns, visibleColumns]);

    const createSortHandler = React.useCallback(
      (property: keyof T) => () => {
        if (!loading) {
          onRequestSort(property);
        }
      },
      [loading, onRequestSort]
    );

    const renderHeaderCell = React.useCallback(
      (column: (typeof columns)[0]) => {
        const active = orderBy === column.dataIndex;
        const sortable = column.sortable !== false && !loading;

        if (loading) {
          return <Skeleton variant="rectangular" width="80%" height={16} sx={{ borderRadius: '4px' }} />;
        }

        if (!sortable) {
          return (
            <Typography level="body-sm" fontWeight="lg">
              {column.title}
            </Typography>
          );
        }

        return (
          <Link
            underline="none"
            color="neutral"
            textColor={active ? 'primary.plainColor' : undefined}
            component="button"
            onClick={createSortHandler(column.dataIndex)}
            startDecorator={
              column.align === 'right' ? <ArrowDownwardIcon sx={[active ? { opacity: 1 } : { opacity: 0 }]} /> : null
            }
            endDecorator={
              column.align !== 'right' ? <ArrowDownwardIcon sx={[active ? { opacity: 1 } : { opacity: 0 }]} /> : null
            }
            sx={{
              fontWeight: 'lg',
              '& svg': {
                transition: '0.2s',
                transform: active && order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)'
              },
              '&:hover': { '& svg': { opacity: 1 } }
            }}
          >
            {column.title}
            {active && (
              <Box component="span" sx={visuallyHidden}>
                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
              </Box>
            )}
          </Link>
        );
      },
      [loading, orderBy, order, createSortHandler]
    );

    return (
      <thead>
        <tr>
          {rowSelection && (
            <th>
              {rowSelection.type !== 'radio' && !loading && (
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={onSelectAllClick}
                  slotProps={{
                    input: {
                      'aria-label': 'select all rows'
                    }
                  }}
                  sx={{ verticalAlign: 'sub' }}
                />
              )}
              {loading && <Skeleton variant="rectangular" width={16} height={16} sx={{ borderRadius: '2px' }} />}
            </th>
          )}
          {filteredColumns.map(column => (
            <th
              key={column.key}
              style={{
                width: column.width,
                textAlign: column.align || 'left',
                position: 'sticky',
                top: 0,
                backgroundColor: 'var(--joy-palette-background-surface)',
                zIndex: 1
              }}
              aria-sort={
                orderBy === column.dataIndex && column.sortable !== false && !loading
                  ? ({ asc: 'ascending', desc: 'descending' } as const)[order!]
                  : undefined
              }
            >
              {renderHeaderCell(column)}
            </th>
          ))}
        </tr>
      </thead>
    );
  }
);

EnhancedTableHead.displayName = 'EnhancedTableHead';
