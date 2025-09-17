import * as React from 'react';
import { Box, Checkbox, Sheet, Table } from '@mui/joy';
import { CustomTableColumn, CustomTableProps, SortOrder, TableRowSelection } from './types';
import { getRowKey, getFilteredColumns, calculatePaginationInfo, createSelectionHandlers } from './utils';
import { EnhancedTableHead } from './TableHead';
import { EnhancedTableToolbar } from './TableToolbar';
import { TablePaginationComponent } from './TablePagination';
import { SkeletonRow } from './skeleton';

const CustomTable = <T extends Record<string, any> = any>({
  columns,
  dataSource,
  rowKey = 'id',
  loading = false,
  pagination = {
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: [7, 14, 21, 28, 35, 42, 49, 56, 63, 70]
  },
  rowSelection,
  toolbar,
  size = 'md',
  bordered = true,
  onRow,
  className,
  style,
  onSortChange,
  ...props
}: CustomTableProps<T>) => {
  const [order, setOrder] = React.useState<SortOrder | null>(null);
  const [orderBy, setOrderBy] = React.useState<string>('');
  const [selected, setSelected] = React.useState<React.Key[]>([]);
  const [visibleColumns, setVisibleColumns] = React.useState<string[]>(() =>
    columns.filter(col => !col.hidden).map(col => col.key)
  );

  const getRowKeyFn = React.useCallback((record: T, index: number) => getRowKey(record, index, rowKey), [rowKey]);

  const filteredColumns = React.useMemo(() => {
    const filtered = getFilteredColumns(columns, visibleColumns);
    // Apply smart defaults to columns
    return filtered.map((column, index) => ({
      ...column,
      // Auto-set width for actions column if not specified
      width: column.key === 'actions' && !column.width ? 140 : column.width,
      // Auto-center align actions column if not specified
      align: column.key === 'actions' && !column.align ? 'center' : column.align,
      // Auto-enable ellipsis for long text columns if not specified
      ellipsis: column.ellipsis !== false && !column.render && column.key !== 'actions' ? true : column.ellipsis,
      // Add responsive priority (first and last columns are most important)
      priority: column.priority || (index === 0 || column.key === 'actions' ? 'high' : 'medium')
    }));
  }, [columns, visibleColumns]);

  const { handleSelectAllClick, handleClick } = React.useMemo(
    () => createSelectionHandlers(selected, setSelected, dataSource, rowSelection, getRowKeyFn),
    [selected, dataSource, rowSelection, getRowKeyFn]
  );

  const handleVisibilityChange = React.useCallback(
    (columnKey: string, visible: boolean) => {
      if (!loading) {
        setVisibleColumns(prev => (visible ? [...prev, columnKey] : prev.filter(key => key !== columnKey)));
      }
    },
    [loading]
  );

  const handleRequestSort = React.useCallback(
    (property: keyof T) => {
      if (loading) return;

      let newOrder: SortOrder | null = 'asc';

      if (orderBy === property) {
        if (order === 'asc') {
          newOrder = 'desc';
        } else if (order === 'desc') {
          newOrder = null;
        } else {
          newOrder = 'asc';
        }
      }

      setOrder(newOrder);
      setOrderBy(newOrder ? String(property) : '');
      onSortChange?.(String(property), newOrder);
    },
    [loading, orderBy, order, onSortChange]
  );

  const handleDelete = React.useCallback(() => {
    if (!loading) {
      toolbar?.onDelete?.(selected);
    }
  }, [loading, toolbar, selected]);

  const handleRowClick = React.useCallback(
    (record: T, index: number) => (event: React.MouseEvent) => {
      if (rowSelection && !rowSelection.getCheckboxProps?.(record)?.disabled) {
        handleClick(record, index);
      }
      onRow?.(record, index)?.onClick?.(event);
    },
    [rowSelection, handleClick, onRow]
  );

  const currentPage = pagination !== false ? pagination.current || 1 : 1;
  const pageSize = pagination !== false ? pagination.pageSize || 10 : 10;
  const total = pagination !== false ? pagination.total || 0 : dataSource.length;
  const { from, to } = React.useMemo(
    () => calculatePaginationInfo(dataSource, currentPage, pageSize, total),
    [dataSource, currentPage, pageSize, total]
  );

  const skeletonRows = React.useMemo(
    () =>
      loading
        ? Array.from({ length: 7 }, (_, index) => (
            <SkeletonRow
              key={`skeleton-${index}`}
              columns={columns}
              visibleColumns={visibleColumns}
              rowSelection={!!rowSelection}
              size={size}
            />
          ))
        : [],
    [loading, columns, visibleColumns, rowSelection, size]
  );

  const tableRows = React.useMemo(() => {
    if (loading) return skeletonRows;

    return dataSource.map((row, index) => {
      const recordKey = getRowKeyFn(row, index);
      const isItemSelected = selected.includes(recordKey);
      const labelId = `enhanced-table-checkbox-${index}`;
      const checkboxProps = rowSelection?.getCheckboxProps?.(row) || {};
      const rowProps = onRow?.(row, index) || {};

      return (
        <tr
          key={recordKey}
          onClick={handleRowClick(row, index)}
          onDoubleClick={rowProps.onDoubleClick}
          onContextMenu={rowProps.onContextMenu}
          role={rowSelection ? 'checkbox' : undefined}
          aria-checked={rowSelection ? isItemSelected : undefined}
          tabIndex={-1}
          style={
            isItemSelected
              ? ({
                  '--TableCell-dataBackground': 'var(--TableCell-selectedBackground)',
                  '--TableCell-headBackground': 'var(--TableCell-selectedBackground)'
                } as React.CSSProperties)
              : {}
          }
        >
          {rowSelection && (
            <td style={{ width: '40px', textAlign: 'center', padding: '12px 16px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Checkbox
                  checked={isItemSelected}
                  disabled={checkboxProps.disabled}
                  slotProps={{
                    input: {
                      'aria-labelledby': labelId
                    }
                  }}
                  sx={{
                    '& .MuiCheckbox-checkbox': {
                      borderRadius: '4px'
                    }
                  }}
                />
              </Box>
            </td>
          )}

          {filteredColumns.map((column, colIndex) => {
            const value = (row as any)[column.dataIndex];
            const cellContent = column.render ? column.render(value, row, index) : value ?? '-';
            const CellComponent = colIndex === 0 && !rowSelection ? 'th' : 'td';

            // Auto-wrap actions in proper container
            const finalContent =
              column.key === 'actions' && column.render ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minWidth: '120px',
                    flexWrap: 'nowrap'
                  }}
                >
                  {column.render(value, row, index)}
                </Box>
              ) : (
                cellContent
              );

            return (
              <CellComponent
                key={column.key}
                {...(colIndex === 0 &&
                  !rowSelection && {
                    id: labelId,
                    scope: 'row'
                  })}
                style={{
                  textAlign: column.align || 'left',
                  width: column.width,
                  minWidth: column.width ? Math.min(column.width, 120) : undefined,
                  maxWidth: column.width,
                  ...(column.ellipsis && {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }),
                  ...(column.key === 'actions' && {
                    whiteSpace: 'nowrap',
                    overflow: 'visible'
                  })
                }}
              >
                {finalContent}
              </CellComponent>
            );
          })}
        </tr>
      );
    });
  }, [loading, skeletonRows, dataSource, getRowKeyFn, selected, rowSelection, onRow, handleRowClick, filteredColumns]);

  return (
    <Sheet
      variant={bordered ? 'outlined' : 'plain'}
      sx={{
        width: '100%',
        borderRadius: 'sm',
        display: 'flex',
        flexDirection: 'column',
        ...style
      }}
      className={className}
    >
      {toolbar && (
        <EnhancedTableToolbar
          numSelected={selected.length}
          title={toolbar.title}
          actions={toolbar.actions}
          showFilter={toolbar.showFilter}
          showColumnFilter={toolbar.showColumnFilter}
          onDelete={selected.length > 0 ? handleDelete : undefined}
          columns={columns as CustomTableColumn[]}
          visibleColumns={visibleColumns}
          onVisibilityChange={handleVisibilityChange}
          loading={loading}
        />
      )}

      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          maxHeight: '70vh',
          width: '100%',
          // Responsive table container
          '@media (max-width: 768px)': {
            maxHeight: '60vh'
          }
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          hoverRow={!loading}
          size={size}
          sx={{
            '--TableCell-headBackground': 'transparent',
            '--TableCell-selectedBackground': theme => theme.vars.palette.success.softBg,
            '--TableCell-paddingX': '16px',
            '--TableCell-paddingY': '12px',
            width: '100%',
            minWidth: 'max-content',
            tableLayout: 'auto',
            // Responsive adjustments
            '@media (max-width: 1200px)': {
              '--TableCell-paddingX': '12px',
              '--TableCell-paddingY': '8px'
            },
            '@media (max-width: 768px)': {
              '--TableCell-paddingX': '8px',
              '--TableCell-paddingY': '6px',
              fontSize: '0.875rem'
            },
            '& thead': {
              position: 'sticky',
              top: 0,
              zIndex: 1,
              backgroundColor: 'var(--joy-palette-background-surface)'
            },
            '& th, & td': {
              padding: 'var(--TableCell-paddingY) var(--TableCell-paddingX)',
              // Responsive text handling
              '@media (max-width: 768px)': {
                '&:not(:first-child):not(:last-child)': {
                  display: 'none'
                }
              }
            },
            '& tbody tr': {
              '&:hover': {
                backgroundColor: 'var(--joy-palette-background-level1)'
              }
            },
            ...(rowSelection && {
              '& thead th:nth-child(1)': {
                width: '40px'
              }
            })
          }}
          {...props}
        >
          <EnhancedTableHead
            columns={columns as CustomTableColumn[]}
            visibleColumns={visibleColumns}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={dataSource.length}
            rowSelection={rowSelection as TableRowSelection<unknown>}
            loading={loading}
          />

          <tbody>{tableRows}</tbody>
        </Table>
      </Box>

      {pagination !== false && (
        <TablePaginationComponent
          pagination={pagination}
          currentPage={currentPage}
          pageSize={pageSize}
          total={total}
          from={from}
          to={to}
          loading={loading}
        />
      )}
    </Sheet>
  );
};

export default React.memo(CustomTable) as typeof CustomTable;
