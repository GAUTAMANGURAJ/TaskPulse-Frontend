import React from 'react';
import { Table, Card } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { EmptyState } from '../common/EmptyState';

export interface CustomDataTableProps<T> extends Omit<TableProps<T>, 'columns'> {
  columns: ColumnsType<T>;
  dataSource: T[];
  rowKey: string | ((record: T) => string | number);
  isLoading?: boolean;
  isFiltered?: boolean;
  onClearFilters?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  onAction?: () => void;
  actionText?: string;
}

export function CustomDataTable<T extends object>({
  columns,
  dataSource,
  rowKey,
  isLoading = false,
  isFiltered = false,
  onClearFilters,
  emptyTitle,
  emptyDescription,
  onAction,
  actionText,
  pagination = {
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ['10', '25', '50'],
    showTotal: (total: number) => `Total ${total} entries`,
  },
  ...tableProps
}: CustomDataTableProps<T>) {
  if (!isLoading && dataSource.length === 0) {
    if (isFiltered) {
      return (
        <Card variant="borderless" className="border border-slate-200/80 dark:border-slate-800">
          <EmptyState
            title="No Matching Records"
            description="No entries match your search or filter parameters."
            actionText={onClearFilters ? 'Reset Filters' : undefined}
            onAction={onClearFilters}
          />
        </Card>
      );
    }

    return (
      <Card variant="borderless" className="border border-slate-200/80 dark:border-slate-800">
        <EmptyState
          title={emptyTitle || 'No Records Found'}
          description={emptyDescription || 'There are no entries available in this collection.'}
          actionText={actionText}
          onAction={onAction}
        />
      </Card>
    );
  }

  return (
    <Card
      variant="borderless"
      className="shadow-sm border border-slate-200/80 dark:border-slate-800"
      styles={{ body: { padding: 0 } }}
    >
      <Table<T>
        columns={columns}
        dataSource={dataSource}
        rowKey={rowKey}
        loading={isLoading}
        pagination={pagination}
        {...tableProps}
      />
    </Card>
  );
}
