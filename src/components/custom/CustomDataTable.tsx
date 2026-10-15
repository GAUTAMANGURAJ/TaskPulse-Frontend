import React from 'react';
import { Table, Card } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { EmptyState } from '../common/EmptyState';
import { useI18n } from '../../i18n/I18nContext';

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
  scrollY?: number | string | false;
  scrollHeight?: string;
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
  pagination,
  scroll,
  scrollY,
  scrollHeight,
  ...tableProps
}: CustomDataTableProps<T>) {
  const { t } = useI18n();

  const effectiveScrollY = scrollHeight ?? scrollY ?? 'calc(100vh - 22.5rem)';

  const defaultPagination = {
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ['10', '25', '50'],
    showTotal: (total: number) => t('common.totalEntries', { total }),
  };

  const effectivePagination =
    pagination === false ? false : { ...defaultPagination, ...pagination };

  const effectiveScroll: TableProps<T>['scroll'] = {
    x: 'max-content',
    ...(scrollY !== false && effectiveScrollY ? { y: effectiveScrollY } : {}),
    ...scroll,
  };

  if (!isLoading && dataSource.length === 0) {
    if (isFiltered) {
      return (
        <Card variant="borderless" className="card-enterprise">
          <EmptyState
            title={emptyTitle || t('tasks.noMatchingTitle')}
            description={emptyDescription || t('tasks.noMatchingDesc')}
            actionText={onClearFilters ? t('tasks.resetFilters') : undefined}
            onAction={onClearFilters}
          />
        </Card>
      );
    }

    return (
      <Card variant="borderless" className="card-enterprise">
        <EmptyState
          title={emptyTitle || t('tasks.noTasksTitle')}
          description={emptyDescription || t('tasks.noTasksDesc')}
          actionText={actionText}
          onAction={onAction}
        />
      </Card>
    );
  }

  return (
    <Card
      variant="borderless"
      className="card-enterprise overflow-hidden shadow-sm"
      styles={{ body: { padding: 0 } }}
    >
      <div className="w-full">
        <Table<T>
          columns={columns}
          dataSource={dataSource}
          rowKey={rowKey}
          loading={isLoading}
          pagination={effectivePagination}
          scroll={effectiveScroll}
          className="ant-table-modern"
          {...tableProps}
        />
      </div>
    </Card>
  );
}
