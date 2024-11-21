import { ApexOptions } from 'apexcharts';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import React from 'react';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ClickAreaChartProps {
  data: { date: string; clicks: number }[];
}

const ClicksChart: React.FC<ClickAreaChartProps> = ({ data }) => {
  const { theme } = useTheme();

  // Sanitize data: Remove invalid or missing values
  const sanitizedData = data?.filter(
    (item) =>
      item?.date &&
      !isNaN(new Date(item.date).getTime()) && // Valid date
      item?.clicks !== undefined &&
      item?.clicks !== null &&
      !isNaN(item.clicks) // Valid clicks
  );

  // Format data for the chart
  const series = [
    {
      name: 'Clicks',
      data: sanitizedData.map((item) => ({
        x: new Date(item.date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
        }),
        y: item.clicks,
      })),
    },
  ];

  // Chart options
  const options: ApexOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false },
    },
    xaxis: {
      type: 'category',
      labels: {
        rotate: -45,
        style: {
          colors: theme === 'dark' ? '#a1a1aa' : '#1f2937',
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: theme === 'dark' ? '#a1a1aa' : '#1f2937',
          fontSize: '12px',
        },
      },
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'straight', width: 1 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    grid: {
      borderColor: theme === 'dark' ? '#2d3748' : '#e2e8f0',
      strokeDashArray: 4,
    },
    tooltip: { theme: theme === 'dark' ? 'dark' : 'light' },
  };

  // Render chart
  return <Chart options={options} series={series} type="area" height={350} />;
};

export default ClicksChart;
