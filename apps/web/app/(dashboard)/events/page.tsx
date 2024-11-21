'use client';

import Loading from '@/components/loading';
import { api } from '@/lib/auth';
import getAPIUrl from '@/lib/env';
import { useTheme } from 'next-themes';
import DataTable, { createTheme, TableColumn } from 'react-data-table-component';
import useSWR from 'swr';

type RowData = {
  id: number;
  linkId: string;
  country: string;
  browser: string;
  device: string;
  createdAt: string;
};

createTheme(
  'dashTheme',
  {
    text: {
      primary: '#a1a1aa',
      secondary: '#ffffff',
    },
    background: {
      default: '#080808',
    },
    context: {
      background: '#cb4b16',
      text: '#FFFFFF',
    },
    divider: {
      default: '#334155',
    },
    action: {
      button: 'rgba(0,0,0,.54)',
      hover: 'rgba(0,0,0,.08)',
      disabled: 'rgba(0,0,0,.12)',
    },
  },
  'dark'
);

export default function Events() {
  const fetcher = (url: string) => api.get(url).then((r) => r.data);
  const { resolvedTheme } = useTheme();
  console.log(resolvedTheme);
  const { data, error, isLoading } = useSWR(`${getAPIUrl()}/api/admin/clicks`, fetcher);

  const columns: TableColumn<RowData>[] = [
    {
      name: 'DASH Link',
      selector: (row: RowData) => `${getAPIUrl()}/${row.linkId}` || '',
      sortable: false,
    },
    {
      name: 'Country',
      selector: (row: RowData) => row.country || '',
      sortable: false,
    },
    {
      name: 'Browser',
      selector: (row: RowData) => row.browser || '',
      sortable: false,
    },
    {
      name: 'Device',
      selector: (row: RowData) => row.device || '',
      sortable: false,
    },
    {
      name: 'Date',
      selector: (row: RowData) => row.createdAt || '',
      sortable: false,
    },
  ];

  const paginationComponentOptions = {
    rowsPerPageText: 'Show',
    rangeSeparatorText: 'of',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'All',
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Error</div>;
  return (
    <div>
      <section className="bg-card border border-default rounded-lg">
        <h3 className="p-6 text-xl font-semibold text-accent-800">Click Events</h3>
        <div className="custom-datatable rounded-lg overflow-hidden">
          <DataTable columns={columns} data={data.data} pagination paginationComponentOptions={paginationComponentOptions} theme={resolvedTheme === 'dark' ? 'dashTheme' : 'light'} persistTableHead />
        </div>
      </section>
    </div>
  );
}
