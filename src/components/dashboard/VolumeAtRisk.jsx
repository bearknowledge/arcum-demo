import { abbreviate } from "src/utils/formatNumbers";
import StatsCard from "./StatsCard";

const VolumeAtRisk = ({ currMonth, prevMonth }) => {
    return (
        <StatsCard
            title="Volume at risk"
            stat={abbreviate(14000000)}
            percentDecimal={(currMonth - prevMonth) / prevMonth}
        />
    );
};

export default VolumeAtRisk;
