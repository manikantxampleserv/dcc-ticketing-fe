import * as React from 'react';
import { SortOrder, TableRowSelection, CustomTableColumn } from './types';
import { getRowKey } from './utils';

export const useTableSelection = <T>(
  dataSource: T[],
  rowSelection: TableRowSelection<T> | undefined,
  rowKeyProp: string | ((record: T) => string) = 'id'
) => {
  const [selected, setSelected] = React.useState<React.Key[]>(rowSelection?.selectedRowKeys || []);

  React.useEffect(() => {
    if (rowSelection?.selectedRowKeys) {
      setSelected(rowSelection.selectedRowKeys);
    }
  }, [rowSelection?.selectedRowKeys]);

  const getRowKeyFn = React.useCallback(
    (record: T, index: number) => getRowKey(record, index, rowKeyProp),
    [rowKeyProp]
  );

  const handleSelectAllClick = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        const newSelected = dataSource.map((record, index) => getRowKeyFn(record, index));
        setSelected(newSelected);
        rowSelection?.onChange?.(newSelected, dataSource);
        return;
      }
      setSelected([]);
      rowSelection?.onChange?.([], []);
    },
    [dataSource, getRowKeyFn, rowSelection]
  );

  const handleClick = React.useCallback(
    (record: T, index: number) => {
      const recordKey = getRowKeyFn(record, index);
      const selectedIndex = selected.indexOf(recordKey);
      let newSelected: React.Key[] = [];

      if (rowSelection?.type === 'radio') {
        newSelected = selectedIndex === -1 ? [recordKey] : [];
      } else {
        if (selectedIndex === -1) {
          newSelected = [...selected, recordKey];
        } else if (selectedIndex === 0) {
          newSelected = selected.slice(1);
        } else if (selectedIndex === selected.length - 1) {
          newSelected = selected.slice(0, -1);
        } else if (selectedIndex > 0) {
          newSelected = [...selected.slice(0, selectedIndex), ...selected.slice(selectedIndex + 1)];
        }
      }

      setSelected(newSelected);
      const selectedRecords = dataSource.filter((item, idx) => newSelected.includes(getRowKeyFn(item, idx)));
      rowSelection?.onChange?.(newSelected, selectedRecords);
    },
    [selected, dataSource, getRowKeyFn, rowSelection]
  );

  return {
    selected,
    setSelected,
    handleSelectAllClick,
    handleClick,
    getRowKeyFn
  };
};

export const useTableSorting = (onSortChange?: (sortField: string, sortOrder: SortOrder | null) => void) => {
  const [order, setOrder] = React.useState<SortOrder | null>(null);
  const [orderBy, setOrderBy] = React.useState<string>('');

  const handleRequestSort = React.useCallback(
    (property: string | symbol) => {
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
    [orderBy, order, onSortChange]
  );

  return {
    order,
    orderBy,
    handleRequestSort
  };
};

export const useColumnVisibility = <T>(columns: CustomTableColumn<T>[]) => {
  const [visibleColumns, setVisibleColumns] = React.useState<string[]>(() =>
    columns.filter(col => !col.hidden).map(col => col.key)
  );

  const handleVisibilityChange = React.useCallback((columnKey: string, visible: boolean) => {
    setVisibleColumns(prev => (visible ? [...prev, columnKey] : prev.filter(key => key !== columnKey)));
  }, []);

  React.useEffect(() => {
    const newVisibleColumns = columns
      .filter(col => !col.hidden)
      .map(col => col.key)
      .filter(key => visibleColumns.includes(key) || !visibleColumns.length);

    if (
      newVisibleColumns.length !== visibleColumns.length ||
      !newVisibleColumns.every(key => visibleColumns.includes(key))
    ) {
      setVisibleColumns(newVisibleColumns);
    }
  }, [columns]);

  return {
    visibleColumns,
    handleVisibilityChange
  };
};

export const useTablePagination = (dataSource: any[], pagination: any) => {
  const currentPage = pagination !== false ? pagination.current || 1 : 1;
  const pageSize = pagination !== false ? pagination.pageSize || 10 : 10;
  const total = pagination !== false ? pagination.total || 0 : dataSource.length;

  const paginationInfo = React.useMemo(() => {
    const from = dataSource.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const to = Math.min(from + dataSource.length - 1, total);

    return { from, to, total };
  }, [dataSource.length, currentPage, pageSize, total]);

  return {
    currentPage,
    pageSize,
    ...paginationInfo
  };
};
