import Head from "next/head";
import { Box, Container, Grid, Typography } from "@mui/material";
import MerchantsAtRisk from "../components/dashboard/MerchantsAtRisk";
import TotalRevenue from "../components/dashboard/TotalRevenue";
import RevenueAtRisk from "../components/dashboard/RevenueAtRisk";
import VolumeAtRisk from "../components/dashboard/VolumeAtRisk";
import AttritionRate from "../components/dashboard/AttritionRate";
import NumberOfMerchants from "../components/dashboard/NumberOfMerchants";
import TotalTransactions from "../components/dashboard/TotalTransactions";
import CustomerTable from "src/components/dashboard/CustomerTable";
import { DashboardLayout } from "../components/dashboard-layout";
import ProtectedRoute from "src/components/ProtectedRoute";
import TotalVolume from "src/components/dashboard/TotalVolume";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

import { useAuth } from "../contexts/AuthUserContext";
import { DataContext } from "src/contexts/DataContext";

const Dashboard = () => {
    const { authUser, loading: authLoading } = useAuth();
    const { uploadCount } = useContext(DataContext);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCompanyStats = () => {
            axios
                .get(
                    `${process.env.NEXT_PUBLIC_API_URL}/companies/${authUser.companyId}/stats`
                )
                .then((res) => {
                    if (res.data.error) {
                        console.log(res.data.error);
                    } else {
                        if (res.data.current_merchants_at_risk === 0) {
                            setError(
                                "No merchants at risk. Please upload data to see results."
                            );
                        } else {
                            setData(res.data);
                        }
                        setLoading(false);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        if (!authLoading && authUser) {
            fetchCompanyStats();
        }
    }, [authLoading, authUser]);

    return (
        <>
            <Head>
                <title>
                    Dashboard | {process.env.NEXT_PUBLIC_PRODUCT_NAME}
                </title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    pb: 8,
                }}
            >
                <Container maxWidth={false}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-end",
                        }}
                    >
                        <Typography variant="h3" sx={{ mb: "27px" }}>
                            Dashboard
                        </Typography>
                        <Typography variant="h5" sx={{ mb: "27px" }}>
                            {uploadCount !== 2
                                ? "May 1, 2022 - May 31, 2022"
                                : "June 1, 2022 - June 30, 2022"}
                        </Typography>
                    </Box>
                    {loading ? (
                        // TODO: Replace with loading component
                        <p>Loading charts...</p>
                    ) : error ? (
                        // TODO: Replace with proper error statement
                        <p>{error}</p>
                    ) : (
                        <>
                            <Grid container spacing={3}>
                                <Grid item lg={3} sm={6} xl={3} xs={12}>
                                    <MerchantsAtRisk
                                        currMonth={
                                            data.current_merchants_at_risk
                                        }
                                        prevMonth={
                                            data.chart_history[
                                                data.chart_history.length - 2
                                            ].merchants_at_risk
                                        }
                                    />
                                </Grid>
                                <Grid item xl={3} lg={3} sm={6} xs={12}>
                                    <VolumeAtRisk
                                        currMonth={data.current_volume_at_risk}
                                        prevMonth={
                                            data.chart_history[
                                                data.chart_history.length - 2
                                            ].volume_at_risk
                                        }
                                    />
                                </Grid>
                                <Grid item xl={3} lg={3} sm={6} xs={12}>
                                    <RevenueAtRisk
                                        currMonth={data.current_revenue_at_risk}
                                        prevMonth={
                                            data.chart_history[
                                                data.chart_history.length - 2
                                            ].revenue_at_risk
                                        }
                                    />
                                </Grid>
                                <Grid item xl={3} lg={3} sm={6} xs={12}>
                                    <AttritionRate
                                        currMonth={
                                            data.chart_history[
                                                data.chart_history.length - 1
                                            ].churn
                                        }
                                        prevMonth={
                                            data.chart_history[
                                                data.chart_history.length - 2
                                            ].churn
                                        }
                                    />
                                </Grid>
                                <Grid item xl={3} lg={3} sm={6} xs={12}>
                                    <NumberOfMerchants
                                        chartHistory={data.chart_history}
                                    />
                                </Grid>
                                <Grid item xl={3} lg={3} sm={6} xs={12}>
                                    <TotalTransactions
                                        chartHistory={data.chart_history}
                                    />
                                    
                                </Grid>
                                <Grid item xl={3} lg={3} sm={6} xs={12}>
                                    <TotalVolume
                                        chartHistory={data.chart_history}
                                    />
                                </Grid>
                                <Grid item xl={3} lg={3} sm={6} xs={12}>
                                    <TotalRevenue
                                        chartHistory={data.chart_history}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <CustomerTable />
                                </Grid>
                            </Grid>
                        </>
                    )}
                </Container>
            </Box>
        </>
    );
};

Dashboard.getLayout = (page) => (
    <ProtectedRoute>
        <DashboardLayout>{page}</DashboardLayout>
    </ProtectedRoute>
);

export default Dashboard;
