import { abbreviate } from "src/utils/formatNumbers";
import StatsCard from "./StatsCard";
import { useContext } from "react";
import { DataContext } from "src/contexts/DataContext";

// const mayRevenueAtRisk = mayCustomers.reduce((total, currentCustomer) => {
//     return total + currentCustomer.Revenue;
// }, 0);

// const juneRevenueAtRisk = customers.reduce((total, currentCustomer) => {
//     return total + currentCustomer.Revenue;
// }, 0);

const RevenueAtRisk = ({currMonth, prevMonth}) => {
    // const { uploadCount } = useContext(DataContext);
    console.log(currMonth)
    return (
        <StatsCard
            title="Revenue at risk"
            stat={abbreviate(currMonth)}
            percentDecimal={
              .4
                // uploadCount !== 2
                //     ? 0.21
                //     : (juneRevenueAtRisk - mayRevenueAtRisk) / mayRevenueAtRisk
            }
        />
    );
};

export default RevenueAtRisk;
