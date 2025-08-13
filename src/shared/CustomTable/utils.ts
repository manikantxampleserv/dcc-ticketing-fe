import { TableSize, CustomTableColumn } from './types';

export const getSkeletonHeight = (size: TableSize = 'md'): number => {
  switch (size) {
    case 'sm':
      return 16;
    case 'lg':
      return 24;
    default:
      return 20;
  }
};

export const getSkeletonWidth = (column: CustomTableColumn<any>): string => {
  if (column.width) {
    if (typeof column.width === 'number') {
      return `${Math.min(column.width * 0.8, 200)}px`;
    }
    return column.width.toString();
  }
  const widths = ['60%', '80%', '40%', '90%', '70%'];
  return widths[Math.floor(Math.random() * widths.length)];
};

export const labelDisplayedRows = ({ from, to, count }: { from: number; to: number; count: number }): string => {
  return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
};

export const getFilteredColumns = <T>(
  columns: CustomTableColumn<T>[],
  visibleColumns: string[]
): CustomTableColumn<T>[] => {
  return columns.filter(column => visibleColumns.includes(column.key));
};

export const getRowKey = <T>(record: T, index: number, rowKey: string | ((record: T) => string) = 'id'): React.Key => {
  if (typeof rowKey === 'function') {
    return rowKey(record);
  }
  return (record as any)[rowKey] || index;
};

export const calculatePaginationInfo = (dataSource: any[], currentPage: number, pageSize: number, total?: number) => {
  const totalRecords = total || dataSource.length;
  const from = dataSource.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(from + dataSource.length - 1, totalRecords);

  return { from, to, totalRecords };
};

export const createSelectionHandlers = <T>(
  selected: React.Key[],
  setSelected: (keys: React.Key[]) => void,
  dataSource: T[],
  rowSelection: any,
  getRowKeyFn: (record: T, index: number) => React.Key
) => {
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = dataSource.map((record, index) => getRowKeyFn(record, index));
      setSelected(newSelected);
      rowSelection?.onChange?.(newSelected, dataSource);
      return;
    }
    setSelected([]);
    rowSelection?.onChange?.([], []);
  };

  const handleClick = (record: T, index: number) => {
    const recordKey = getRowKeyFn(record, index);
    const selectedIndex = selected.indexOf(recordKey);
    let newSelected: React.Key[] = [];

    if (rowSelection.type === 'radio') {
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
    rowSelection.onChange?.(newSelected, selectedRecords);
  };

  return { handleSelectAllClick, handleClick };
};
