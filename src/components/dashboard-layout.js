import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardNavbar } from "./dashboard-navbar";
import DashboardMain from "./dashboard-main";
import { sidebarWidth } from "./dashboard-sidebar";

const DashboardLayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  paddingTop: 75,
  [theme.breakpoints.up("lg")]: {
    paddingLeft: sidebarWidth,
    paddingTop: 25,
  },
  background:
    "linear-gradient(106.35deg, rgba(108, 99, 255, 0.057) 38.12%, rgba(108, 99, 255, 0) 100%), #FFFFFF",
}));


export const DashboardLayout = (props) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [office, setOffice] = useState();
  let { children} = props;

  return (
    <>
      <DashboardLayoutRoot>
        <Box
          sx={{
            display: "flex",
            flex: "1 1 auto",
            flexDirection: "column", 
            width: "100%",
          }}
        >
          <DashboardMain office={office} key={office}/>
        </Box>
      </DashboardLayoutRoot>
      <DashboardNavbar onSidebarOpen={() => setSidebarOpen(true)} />
      <DashboardSidebar
        office={(newoffice) => {
          if (newoffice === "Dashboard") {
            return setOffice(undefined)
          } 
          setOffice(newoffice)}}
        onClose={() => setSidebarOpen(false)}
        open={isSidebarOpen}
      />
    </>
  );
};
