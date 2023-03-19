import StatsCard from "./StatsCard";
import CardChart, { datasetConfig } from "./CardChart";
import { formatDateMMYY } from "src/utils/formatDates";

const NumberOfMerchants = ({ chartHistory }) => {
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
                data: chartHistory.map(
                    (monthValue) => monthValue.num_merchants
                ),
                ...datasetConfig,
            },
        ],
    };

    return (
        <StatsCard
            title="Number of merchants"
            chart={true}
            percentDecimal={
                (chartHistory[chartHistory.length - 1]?.num_merchants -
                    chartHistory[chartHistory.length - 2]?.num_merchants) /
                chartHistory[chartHistory.length - 2]?.num_merchants
            }
        >
            <CardChart data={data} />
        </StatsCard>
    );
};

export default NumberOfMerchants;
