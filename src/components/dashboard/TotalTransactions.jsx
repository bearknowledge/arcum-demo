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
                        style: "decimal",
                    });
                },
            },
        },
    },
};

const TotalTransactions = ({ chartHistory }) => {
    const labels = chartHistory.map((monthValue) =>
        formatDateMMYY(monthValue.date)
    );

    const data = {
        labels,
        datasets: [
            {
                data: chartHistory.map(
                    (monthValue) => monthValue.num_transactions
                ),
                ...datasetConfig,
            },
        ],
    };

    return (
        <StatsCard
            title="Total transactions"
            chart={true}
            percentDecimal={
                (chartHistory[chartHistory.length - 1].num_transactions -
                    chartHistory[chartHistory.length - 2].num_transactions) /
                chartHistory[chartHistory.length - 2].num_transactions
            }
        >
            <CardChart data={data} options={options} />
        </StatsCard>
    );
};

export default TotalTransactions;
