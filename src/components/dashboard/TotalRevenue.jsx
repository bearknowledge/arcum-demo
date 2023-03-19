import StatsCard from "./StatsCard";
import CardChart, { datasetConfig } from "./CardChart";
import { abbreviate } from "src/utils/formatNumbers";
import { formatDateMMYY } from "src/utils/formatDates";

const options = {
    scales: {
        y: {
            ticks: {
                // Include a dollar sign in the ticks
                callback: function (value, index, ticks) {
                    return abbreviate(value);
                },
            },
        },
    },
};

const TotalRevenue = ({ chartHistory }) => {
    const labels = chartHistory.map((monthValue) => {
    let date = new Date(monthValue.date)
    date.setUTCHours(6)
    return formatDateMMYY(date)
    }
    );

    const data = {
        labels,
        datasets: [
            {
                data: chartHistory.map((monthValue) =>  monthValue.revenue),

                ...datasetConfig,
            },
        ],
    };

    return (
        <StatsCard
            title="Total revenue"
            chart={true}
            percentDecimal={
                (chartHistory[chartHistory.length - 1]?.revenue -
                    chartHistory[chartHistory.length - 2]?.revenue) /
                chartHistory[chartHistory.length - 2]?.revenue
            }
        >
            <CardChart data={data} options={options} />
        </StatsCard>
    );
};

export default TotalRevenue;
