import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { theme } from "src/theme";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const datasetConfig = {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light,
};

export default function Chart({ data, options = {} }) {
    const defaultOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        ...options,
    };

    return <Line options={defaultOptions} data={data} height={300} />;
}
