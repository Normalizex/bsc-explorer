import React from "react";
import ApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import { useTypedSelector } from "../../hooks/typed";
import { selectThemes } from "../../store/themes/themes.slice";
import { DarkMode } from '../../store/themes/themesProps';

type ChartPropsType = "line" | "area" | "bar" | "histogram" | "pie" | "donut" | "radialBar" | "scatter" | "bubble" | "heatmap" | "candlestick" | "boxPlot" | "radar" | "polarArea" | "rangeBar" | "treemap";

export type ChartSeries = Array<{
    name: string,
    data: number[]
}>

interface ChartProps {
    series: ChartSeries,
    options?: ApexOptions,
    type?: ChartPropsType,
    height?: string
}

const Chart: React.FC<ChartProps> = ({
    series,
    options,
    type,
    height
}) => {
    const theme = useTypedSelector(selectThemes);

    const defaultOptions: ApexOptions = {
        chart: {
            background: 'transparent',
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth'
        },
        legend: {
            position: 'bottom'
        },
        grid: {
            show: false
        },
        theme: {
            mode: theme.mode === DarkMode ? 'dark' : 'light'
        }
    }
    const chartOptions: ApexOptions = {
        ...defaultOptions,
        ...options
    }

    return (
        <ApexChart
            options={chartOptions}
            series={series}
            type={type}
            height={height}
        />
    )
};

export default Chart;