import StatsCard from "./StatsCard";

const AttritionRate = ({ currMonth, prevMonth }) => {
  console.log(prevMonth)
  return (
    <>
    {prevMonth === 0 ?
    <StatsCard
      title="Attrition rate"
      stat={'0%'}
      // percentDecimal={(currMonth - prevMonth) / prevMonth}
    />:
    <StatsCard
    title="Attrition rate"
    stat={`${(currMonth * 100).toFixed(2)}%`}
    // percentDecimal={(currMonth - prevMonth) / prevMonth}
  />
    }
    </>
  );
};

export default AttritionRate;
