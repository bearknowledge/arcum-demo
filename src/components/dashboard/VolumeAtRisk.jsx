import { abbreviate } from "src/utils/formatNumbers";
import StatsCard from "./StatsCard";

const VolumeAtRisk = ({ currMonth, prevMonth }) => {
    return (
        <StatsCard
            title="Volume at risk"
            stat={abbreviate(currMonth)}
            percentDecimal={(currMonth - prevMonth) / prevMonth}
        />
    );
};

export default VolumeAtRisk;
