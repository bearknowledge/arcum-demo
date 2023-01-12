import StatsCard from "./StatsCard";

const AttritionRate = ({ currMonth, prevMonth }) => {
    return (
        <StatsCard
            title="Attrition rate"
            stat={`${currMonth * 100}%`}
            percentDecimal={(currMonth - prevMonth) / prevMonth}
        />
    );
};

export default AttritionRate;
