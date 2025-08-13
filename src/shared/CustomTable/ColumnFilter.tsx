import * as React from 'react';
import { Checkbox, Divider, Dropdown, IconButton, Menu, MenuButton, MenuItem, Typography } from '@mui/joy';
import { FilterList as FilterListIcon } from '@mui/icons-material';
import { ColumnFilterProps } from './types';

export const ColumnFilter = React.memo(<T,>({ columns, visibleColumns, onVisibilityChange }: ColumnFilterProps<T>) => {
  const handleToggleColumn = React.useCallback(
    (columnKey: string) => {
      const isVisible = visibleColumns.includes(columnKey);
      onVisibilityChange(columnKey, !isVisible);
    },
    [visibleColumns, onVisibilityChange]
  );

  const menuItems = React.useMemo(
    () =>
      columns.map(column => ({
        key: column.key,
        title: column.title,
        visible: visibleColumns.includes(column.key)
      })),
    [columns, visibleColumns]
  );

  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{
          root: {
            size: 'sm',
            variant: 'outlined',
            color: 'neutral',
            'aria-label': 'Toggle column visibility'
          }
        }}
      >
        <FilterListIcon />
      </MenuButton>
      <Menu sx={{ minWidth: 200 }}>
        <Typography level="body-sm" sx={{ px: 1, py: 0.5, fontWeight: 'lg' }}>
          Show/Hide Columns
        </Typography>
        <Divider />
        {menuItems.map(item => (
          <MenuItem key={item.key} sx={{ p: 0.5 }} onClick={() => handleToggleColumn(item.key)}>
            <Checkbox label={item.title} checked={item.visible} sx={{ width: '100%' }} />
          </MenuItem>
        ))}
      </Menu>
    </Dropdown>
  );
});

ColumnFilter.displayName = 'ColumnFilter';
