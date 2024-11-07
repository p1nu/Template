import { useState } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlinedIcon from "@mui/icons-material/PieChartOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      icon={icon}
      onClick={() => setSelected(title)}
      style={{
        color: selected === title ? colors.grey[900] : colors.grey[700],
        backgroundColor: selected === title ? colors.primary[300] : "transparent",
      }}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidenav = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  const handleMenuClick = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          backgroundColor: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          // padding: "5px 15px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: `${colors.grey[900]} !important`,
          backgroundColor: `${colors.primary[300]} !important`,
        },
        "& .pro-menu-item.active": {
          color: `${colors.blueAccent[700]} !important`,
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu>
          <MenuItem
            id="admin-menu-item"
            onClick={handleMenuClick}
            icon={isCollapsed ? <MenuOutlinedIcon /> : null}
            // style={{ margin: "10px 0 10px 8px", color: colors.grey[900] }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="20px"
              >
                <Typography variant="h3" color={colors.grey[900]}>
                  ADMIN
                </Typography>
                <IconButton onClick={handleMenuClick} sx={{
                  color: colors.grey[900],
                }}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* USER
          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-use"
                  width="100px"
                  height="100px"
                  src={`../../assets/user.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>

              <Box textAlign={"center"}>
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight={"bold"}
                  sx={{ m: "10px 0 0 0" }}
                >
                  John Doe
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  Admin
                </Typography>
              </Box>
            </Box>
          )} */}

          {/* MENU ITEMS */}
          <Box paddingLeft={!isCollapsed ? undefined : undefined}>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Users"
              to="/users"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Companies"
              to="/company"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Gallery"
              to="/gallery"
              icon={<CollectionsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidenav;
