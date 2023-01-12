import { useEffect } from "react";
// import NextLink from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { Box, Button, Drawer, Typography, useMediaQuery } from "@mui/material";
// import OpenInNewIcon from "@mui/icons-material/OpenInNew";
// import { ChartBar as ChartBarIcon } from "../icons/chart-bar";
import { Cog as CogIcon } from "../icons/cog";
// import { Lock as LockIcon } from "../icons/lock";
// import { Selector as SelectorIcon } from "../icons/selector";
// import { ShoppingBag as ShoppingBagIcon } from "../icons/shopping-bag";
// import { User as UserIcon } from "../icons/user";
// import { UserAdd as UserAddIcon } from "../icons/user-add";
// import { Users as UsersIcon } from "../icons/users";
// import { XCircle as XCircleIcon } from "../icons/x-circle";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import InsertChartIcon from "@mui/icons-material/InsertChart";
// import { Logo } from "./logo";
import { NavItem } from "./nav-item";

import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "src/contexts/AuthUserContext";

export const sidebarWidth = 210;

const items = [
    {
        href: "/",
        icon: <InsertChartIcon fontSize="small" />,
        title: "Dashboard",
    },
    {
        href: "/upload",
        icon: <FileUploadIcon fontSize="small" />,
        title: "Upload Data",
    },
    // {
    //   href: "/customers",
    //   icon: <UsersIcon fontSize="small" />,
    //   title: "Customers",
    // },
    // {
    //   href: "/products",
    //   icon: <ShoppingBagIcon fontSize="small" />,
    //   title: "Products",
    // },
    // {
    //   href: "/account",
    //   icon: <UserIcon fontSize="small" />,
    //   title: "Account",
    // },
    {
        href: "/settings",
        icon: <CogIcon fontSize="small" />,
        title: "Settings",
    },
    // {
    //   href: "/login",
    //   icon: <LockIcon fontSize="small" />,
    //   title: "Login",
    // },
    // {
    //   href: "/register",
    //   icon: <UserAddIcon fontSize="small" />,
    //   title: "Register",
    // },
    // {
    //   href: "/404",
    //   icon: <XCircleIcon fontSize="small" />,
    //   title: "Error",
    // },
];

export const DashboardSidebar = (props) => {
    const { open, onClose } = props;
    const router = useRouter();
    const { logout } = useAuth();
    const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"), {
        defaultMatches: true,
        noSsr: false,
    });

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    useEffect(
        () => {
            if (!router.isReady) {
                return;
            }

            if (open) {
                onClose?.();
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [router.asPath]
    );

    const content = (
        <>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                }}
            >
                <Box
                    sx={{
                        pr: 2,
                        pl: 3,
                        mb: 5,
                        pt: 3,
                    }}
                >
                    <Image
                        src="/static/images/ArcumLogo.png"
                        alt="Arcum AI logo"
                        height={50}
                        width={143}
                    />
                </Box>
                <Box sx={{ px: 2 }}>
                    <Typography
                        color="primary"
                        variant="h6"
                        sx={{ mb: 2, mt: "62px" }}
                    >
                        Admin Tools
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}>
                        {items.map((item) => (
                            <NavItem
                                key={item.title}
                                icon={item.icon}
                                href={item.href}
                                title={item.title}
                            />
                        ))}
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "column",
                        height: "100%",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            height: "100%",
                        }}
                    ></Box>
                    <Box sx={{ mt: "auto" }}>
                        <Button
                            startIcon={<LogoutIcon />}
                            aria-label="logout"
                            color="primary"
                            onClick={handleLogout}
                            fullWidth
                        >
                            Sign Out
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>
    );

    if (lgUp) {
        return (
            <Drawer
                anchor="left"
                open
                PaperProps={{
                    sx: {
                        backgroundColor: "FFFFFF",
                        color: "#FFFFFF",
                        width: sidebarWidth,
                    },
                }}
                variant="permanent"
            >
                {content}
            </Drawer>
        );
    }

    return (
        <Drawer
            anchor="left"
            onClose={onClose}
            open={open}
            PaperProps={{
                sx: {
                    backgroundColor: "FFFFFF",
                    color: "#FFFFFF",
                    width: sidebarWidth,
                },
            }}
            sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
            variant="temporary"
        >
            {content}
        </Drawer>
    );
};

DashboardSidebar.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
};
