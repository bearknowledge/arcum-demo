import { useEffect, useState } from "react";
// import NextLink from "next/link";
import Menu from "@mui/material/Menu";
import Fade from "@mui/material/Fade";
import MenuItem from "@mui/material/MenuItem";
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
import BusinessIcon from "@mui/icons-material/Business";
import { useAuth } from "../contexts/AuthUserContext";
import { DataContext } from "src/contexts/DataContext";

import InsertChartIcon from "@mui/icons-material/InsertChart";
// import { Logo } from "./logo";
import { NavItem } from "./nav-item";

import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";

export const sidebarWidth = 210;

const items = [
  {
    href: "/",
    icon: <InsertChartIcon fontSize="small" />,
    title: "Dashboard",
  },
  //   {
  //     href: "/",
  //     icon: <BusinessIcon fontSize="small" />,
  //     title: "Offices",
  // },

  // {
  //     href: "/upload",
  //     icon: <FileUploadIcon fontSize="small" />,
  //     title: "Upload Data",
  // },
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
  // {
  //     href: "/settings",
  //     icon: <CogIcon fontSize="small" />,
  //     title: "Settings",
  // },
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
  const { authUser, loading: authLoading, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [offices, setOffices] = useState([]);

  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e) => {
    if ((e.target.innerText).length === 0) {
     return  setAnchorEl(null);
    }
    props.office(e.target.innerText);
    setAnchorEl(null);
  };

  useEffect(() => {
    console.log(offices.length)
  }, [offices])

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
              setOffices(res.data.office_list);
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
  }, [authLoading, authUser]);

  const { open, onClose } = props;
  const router = useRouter();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"), {
    defaultMatches: true,
    noSsr: false,
  });

  const handleLogout = async () => {
    await axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/loggedOut?company=${authUser.companyId}`
      )
      .then((res) => {
        if (res.data.error) {
          console.log(res.data.error);
        }
      });
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
          <Typography color="primary" variant="h6" sx={{ mb: 2, mt: "62px" }}>
            Admin Tools
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            {items.map((item) => (
              <NavItem
                key={item.title}
                icon={item.icon}
                href={item.href}
                title={item.title}
                onClick={handleClose}
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
  office: PropTypes.func,
};
