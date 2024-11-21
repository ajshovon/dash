'use client';
import ClicksChart from '@/components/ClicksChart';
import Loading from '@/components/loading';
import BrowsersProgress from '@/components/Progresses/BrowsersProgress';
import CountriesProgress from '@/components/Progresses/CountriesProgress';
import DevicesProgress from '@/components/Progresses/DevicesProgress';
import LinksProgress from '@/components/Progresses/LinksProgress';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { api } from '@/lib/auth';
import getAPIUrl from '@/lib/env';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import useSWR from 'swr';

export default function Analytics() {
  const fetcher = (url: string) => api.get(url).then((r) => r.data);
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const [startDate, setStartDate] = useState(formatDate(new Date(Date.now() - 24 * 60 * 60 * 1000)));
  const [endDate, setEndDate] = useState(formatDate(new Date()));

  const { data, error, isLoading } = useSWR(`${getAPIUrl()}/api/admin/analytics?startDate=${startDate}&endDate=${endDate}`, fetcher);

  const handleDateChange = (values: { range: DateRange; rangeCompare?: DateRange }) => {
    if (values.range.from) {
      setStartDate(formatDate(values.range.from));
    }
    if (values.range.to) {
      setEndDate(formatDate(values.range.to));
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading data</div>;
  return (
    <div className="space-y-5">
      <div className="bg-card border border-default rounded-lg">
        <div className="sm:p-6 p-4 flex justify-end items-center gap-5 flex-wrap">
          <DateRangePicker onUpdate={(values) => handleDateChange(values)} initialDateFrom={startDate} initialDateTo={endDate} align="start" locale="en-GB" showCompare={false} />
        </div>
        <ClicksChart data={data?.clicksPerDay} />
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
        <LinksProgress links={data?.top5Clicks} />
        <CountriesProgress countries={data?.top5Countries} />
        <DevicesProgress devices={data?.top5Devices} />
        <BrowsersProgress browsers={data?.top5Browsers} />
      </div>
    </div>
  );
}
