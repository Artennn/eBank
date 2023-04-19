import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const chartOptions: ApexOptions = {
    chart: {
        toolbar: {
            show: false,
        },
        zoom: {
            enabled: false,
        },
        sparkline: {
            enabled: true,
        }
    },
    dataLabels: {
        enabled: false,
    },
    grid: {
        show: false,
    },
    xaxis: {
        type: "datetime",
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        },
        labels: {
            show: false
        },
        tooltip: {
            enabled: false,
        }
    },
    yaxis: {
        labels: {
            show: false,
        }
    },
    tooltip: {
        x: {
            format: "dd/MM/yy",
        },
        marker: {
            show: false,
        },
        y: {
            title: {
                formatter: (seriesName: string) => "PLN",
            },
        }
    },
};

export const IncomeChart = ({
    data,
}: {
    data: {
        x: number;
        y: number;
    }[];
}) => {
    const series = {
        name: "",
        type: "area",
        data: data,
    };

    return (
        <Chart type="area" width="100%" height="70%" options={chartOptions} series={[series]} />
    )
}