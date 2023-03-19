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
import PropTypes from 'prop-types'
import TotalVolume from "src/components/dashboard/TotalVolume";
import { useContext, useEffect, useState } from "react";
import Lottie from "lottie-react";
import processingAnimation from "../../public/static/animations/loading.json";
import axios from "axios";

import { useAuth } from "../contexts/AuthUserContext";
import { DataContext } from "src/contexts/DataContext";
import { flexbox } from "@mui/system";

const DashboardMain = (props) => {
  const { authUser, loading: authLoading } = useAuth();
  const { uploadCount } = useContext(DataContext);
  const [upload, setLastUpload] = useState("");
  const [uploadOriginal, setLastUploadOriginal] = useState("")
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [month, setMonth] = useState();
  const [currentOffice, setOffice] = useState();
  const [highlight, setHighlight] = useState();

  const getMonth = (prop) => {
    const date =
      prop.getFullYear() +
      "-" +
      (prop.getMonth() + 1 >= 10
        ? prop.getMonth() + 1
        : "0" + String(prop.getMonth() + 1)) +
      "-" +
      "01";
    const year = Number(uploadOriginal.substring(0, 4));
    const month = Number(uploadOriginal.substring(5, 7));
    console.log({ propMonth: prop.getMonth() + 1, month });
    console.log({ propYear: prop.getFullYear(), year });
    console.log(date);
    if (prop.getFullYear() - year === 0) {
      const monthDelta = month - (prop.getMonth() + 1);
      console.log({"MONTHDELTA":monthDelta})
      console.log({"MONTH":prop.getMonth() + 1}, month)
      setLastUpload(date);
      setHighlight(data.chart_history[11 - monthDelta]);
    }
  };

  useEffect(() => {
    if (highlight != undefined && data != {} && upload != "") {
      setLoading(false);
    }
  }, [highlight, data, upload]);

  useEffect(() => {
    setOffice(props.office);
    console.log(currentOffice);
  }, []);

  useEffect(() => {
    const fetchLastUpload = () => {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/companies/${authUser.companyId}/last-upload`
        )
        .then((res) => {
          if (res.data.error) {
            console.log(res.data.error);
          } else {
            let upload = new Date(res.data.last_upload[0].term_date);
            console.log(upload)
            upload.setHours(upload.getHours() + 4);
            const year = upload.getUTCFullYear();
            let month;
            if ((upload.getUTCMonth() + 1) >= 10) {
              month = upload.getUTCMonth() + 1;
            }
            if ((upload.getUTCMonth() + 1) < 10) {
              month = `0${upload.getUTCMonth() + 1}`;
            }
            
            const day = "01";
            const join = [year, month, day].join("-");
            console.log(join)
            setLastUpload(join);
            setMonth()
            setLastUploadOriginal(join);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    if (!authLoading && authUser) {
      fetchLastUpload();
    }
  }, [authLoading, authUser]);

  useEffect(() => {
    const fetchCompanyStats = () => {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/companies/${authUser.companyId}/stats?office=${props.office}`
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
              setHighlight(res.data.chart_history[11]);
              setData(res.data);
              console.log(res.data);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };

    if (!authLoading && authUser) {
      fetchCompanyStats();
    }
  }, [authLoading, authUser, props.office]);
  return (
    <>
      <Head>
        <title>Dashboard | {process.env.NEXT_PUBLIC_PRODUCT_NAME}</title>
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
              alignItems: "flex-center",
              mb: "27px",
            }}
          >
            <Typography variant="h3">
              {props.office === undefined || props.office === "undefined"
                ? "Dashboard"
                : props.office}
            </Typography>
          </Box>
          {loading ? (
            <Lottie
              animationData={processingAnimation}
              style={{
                height: "80vh",
              }}
              loop
            />
          ) : error ? (
            // TODO: Replace with proper error statement

            <p>{error}</p>
          ) : !loading && highlight == undefined ? (
            <p>No Data has been entered</p>
          ) : (
            <>
              <Grid container spacing={3}>
                <Grid item lg={3} sm={6} xl={3} xs={12}>
                  <MerchantsAtRisk
                    key={highlight}
                    currMonth={highlight?.merchants_at_risk}
                    // prevMonth={
                    //     data.chart_history[
                    //         data.chart_history.length - 2
                    //     ]?.merchants_at_risk
                    // }
                  />
                </Grid>
                <Grid item xl={3} lg={3} sm={6} xs={12}>
                  <VolumeAtRisk
                    key={highlight}
                    currMonth={highlight?.volume_at_risk}
                    // prevMonth={
                    //     data.chart_history[
                    //         data.chart_history.length - 2
                    //     ]?.volume_at_risk
                    // }
                  />
                </Grid>
                <Grid item xl={3} lg={3} sm={6} xs={12}>
                  <RevenueAtRisk
                    key={highlight}
                    currMonth={highlight?.revenue_at_risk}
                    // prevMonth={
                    //     data.chart_history[
                    //         data.chart_history.length - 2
                    //     ]?.revenue_at_risk
                    // }
                  />
                </Grid>
                <Grid item xl={3} lg={3} sm={6} xs={12}>
                  <AttritionRate
                    key={highlight}
                    currMonth={highlight?.churn}
                    prevMonth={highlight?.merchants_at_risk}
                    //     data.chart_history[
                    //         data.chart_history.length - 2
                    //     ]?.churn
                    // }
                  />
                </Grid>
                <Grid item xl={3} lg={3} sm={6} xs={12}>
                  <NumberOfMerchants
                    key={month}
                    month={month}
                    chartHistory={data?.chart_history}
                  />
                </Grid>
                <Grid item xl={3} lg={3} sm={6} xs={12}>
                  <TotalTransactions chartHistory={data?.chart_history} />
                </Grid>
                <Grid item xl={3} lg={3} sm={6} xs={12}>
                  <TotalVolume chartHistory={data?.chart_history} />
                </Grid>
                <Grid item xl={3} lg={3} sm={6} xs={12}>
                  <TotalRevenue chartHistory={data?.chart_history} />
                </Grid>
                <Grid item xs={12}>
                  <CustomerTable
                    update={getMonth}
                    month={upload}
                    key={upload}
                    office={props.office}
                  />
                </Grid>
              </Grid>
            </>
          )}
        </Container>
      </Box>
    </>
  );
};

export default DashboardMain;

DashboardMain.propTypes = {
  office: PropTypes.string,
};
