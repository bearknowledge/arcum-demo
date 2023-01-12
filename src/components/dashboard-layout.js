import { useState } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardNavbar } from "./dashboard-navbar";
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
    const { children } = props;
    const [isSidebarOpen, setSidebarOpen] = useState(true);

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
                    {children}
                </Box>
            </DashboardLayoutRoot>
            <DashboardNavbar onSidebarOpen={() => setSidebarOpen(true)} />
            <DashboardSidebar
                onClose={() => setSidebarOpen(false)}
                open={isSidebarOpen}
            />
        </>
    );
};
