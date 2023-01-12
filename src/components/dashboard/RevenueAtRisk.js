import { abbreviate } from "src/utils/formatNumbers";
import StatsCard from "./StatsCard";
import { customers, mayCustomers } from "src/__mocks__/customers";
import { useContext } from "react";
import { DataContext } from "src/contexts/DataContext";

const mayRevenueAtRisk = mayCustomers.reduce((total, currentCustomer) => {
    return total + currentCustomer.Revenue;
}, 0);

const juneRevenueAtRisk = customers.reduce((total, currentCustomer) => {
    return total + currentCustomer.Revenue;
}, 0);

const RevenueAtRisk = () => {
    const { uploadCount } = useContext(DataContext);

    return (
        <StatsCard
            title="Revenue at risk"
            stat={
                uploadCount !== 2
                    ? abbreviate(mayRevenueAtRisk)
                    : abbreviate(juneRevenueAtRisk)
            }
            percentDecimal={
                uploadCount !== 2
                    ? 0.21
                    : (juneRevenueAtRisk - mayRevenueAtRisk) / mayRevenueAtRisk
            }
        />
    );
};

export default RevenueAtRisk;
