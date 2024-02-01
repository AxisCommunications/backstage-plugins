import React from 'react';
import { Table, TableColumn } from '@backstage/core-components';
import type { Component } from '@axis-backstage/plugin-statuspage-common';
import { StatusChip } from './StatusChip';

export type ComponentsTableProps = {
  components: Component[];
};

export const ComponentsTable = ({ components }: ComponentsTableProps) => {
  // Columns definition
  const columns: TableColumn[] = [
    { title: 'System', field: 'name', id: 'id' },
    {
      title: 'Status',
      field: 'status',
      render: (rowData: any) => <StatusChip status={rowData.status} />,
      align: 'right',
    },
  ];

  return (
    <Table
      options={{
        search: false,
        paging: false,
        header: false,
        padding: 'dense',
        toolbar: false,
      }}
      columns={columns}
      data={components.map(({ name, status, id }) => ({ name, status, id }))}
    />
  );
};
