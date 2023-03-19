import StatsCard from "./StatsCard";
import { abbreviate } from "src/utils/formatPlainNumbers";

const MerchantsAtRisk = ({ currMonth}) => {
  console.log(currMonth)
    return (
        <StatsCard
            title="Merchants at risk"
            stat={abbreviate(currMonth)}
           // percentDecimal={(currMonth - prevMonth) / prevMonth}
        />
    );
};

export default MerchantsAtRisk;
