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
                    return abbreviate(value, {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                    });
                },
            },
        },
    },
};

const TotalVolume = ({ chartHistory }) => {
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
                data: chartHistory.map((monthValue) => monthValue.volume),
                ...datasetConfig,
            },
        ],
    };

    return (
        <StatsCard
            title="Total volume"
            chart={true}
            percentDecimal={
                (chartHistory[chartHistory.length - 1]?.volume -
                    chartHistory[chartHistory.length - 2]?.volume) /
                chartHistory[chartHistory.length - 2]?.volume
            }
        >
            <CardChart data={data} options={options} />
        </StatsCard>
    );
};

export default TotalVolume;
