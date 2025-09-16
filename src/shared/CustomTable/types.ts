import * as React from 'react';

export type TableSize = 'sm' | 'md' | 'lg';
export type TableAlign = 'left' | 'center' | 'right';
export type SortOrder = 'asc' | 'desc';
export type SelectionType = 'checkbox' | 'radio';

export interface CustomTableColumn<T = any> {
  key: string;
  dataIndex: keyof T;
  title: string;
  width?: string | number;
  align?: TableAlign;
  sortable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sorter?: boolean | ((a: T, b: T) => number);
  filters?: Array<{ text: string; value: any }>;
  onFilter?: (value: any, record: T) => boolean;
  fixed?: 'left' | 'right';
  ellipsis?: boolean;
  hidden?: boolean;
}

export interface TablePagination {
  current?: number;
  pageSize?: number;
  total?: number;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  onChange?: (page: number, pageSize: number) => void;
}

export interface TableRowSelection<T = any> {
  type?: SelectionType;
  selectedRowKeys?: React.Key[];
  onChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
  onSelectAll?: (selected: boolean, selectedRows: T[], changeRows: T[]) => void;
  getCheckboxProps?: (record: T) => { disabled?: boolean };
}

export interface TableToolbar {
  title?: string;
  actions?: React.ReactNode;
  showFilter?: boolean;
  showColumnFilter?: boolean;
  onDelete?: (selectedKeys: React.Key[]) => void;
}

export interface TableRowProps {
  onClick?: (event: React.MouseEvent) => void;
  onDoubleClick?: (event: React.MouseEvent) => void;
  onContextMenu?: (event: React.MouseEvent) => void;
}

export interface TableExpandable<T = any> {
  expandedRowRender?: (record: T, index: number) => React.ReactNode;
  expandedRowKeys?: React.Key[];
  onExpand?: (expanded: boolean, record: T) => void;
}

export interface TableScroll {
  x?: number | string;
  y?: number | string;
}

export interface CustomTableProps<T = any> {
  columns: CustomTableColumn<T>[];
  dataSource: T[];
  rowKey?: string | ((record: T) => string);
  loading?: boolean;
  pagination?: TablePagination | false;
  rowSelection?: TableRowSelection<T>;
  title?: string;
  toolbar?: TableToolbar;
  size?: TableSize;
  bordered?: boolean;
  onRow?: (record: T, index: number) => TableRowProps;
  scroll?: TableScroll;
  expandable?: TableExpandable<T>;
  showSorterTooltip?: boolean;
  sortDirections?: ('ascend' | 'descend')[];
  showHeader?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onSortChange?: (sortField: string, sortOrder: SortOrder | null) => void;
}

export interface EnhancedTableHeadProps<T> {
  columns: CustomTableColumn<T>[];
  visibleColumns: string[];
  numSelected: number;
  onRequestSort: (property: keyof T) => void;
  onSelectAllClick?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: SortOrder | null;
  orderBy: string;
  rowCount: number;
  rowSelection?: TableRowSelection<T>;
  loading?: boolean;
}

export interface EnhancedTableToolbarProps<T> {
  numSelected: number;
  title?: string;
  actions?: React.ReactNode;
  showFilter?: boolean;
  showColumnFilter?: boolean;
  onDelete?: () => void;
  columns: CustomTableColumn<T>[];
  visibleColumns: string[];
  onVisibilityChange: (columnKey: string, visible: boolean) => void;
  loading?: boolean;
}

export interface ColumnFilterProps<T> {
  columns: CustomTableColumn<T>[];
  visibleColumns: string[];
  onVisibilityChange: (columnKey: string, visible: boolean) => void;
}

export interface SkeletonRowProps {
  columns: CustomTableColumn<any>[];
  visibleColumns: string[];
  rowSelection?: boolean;
  size?: TableSize;
}
export interface TableToolbar {
  title?: string;
  showFilter?: boolean;
  onDelete?: (selectedKeys: React.Key[]) => void;
  renderExtraActions?: () => React.ReactNode;
}
