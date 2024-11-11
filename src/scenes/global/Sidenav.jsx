import React, { useState } from "react";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import {
  Box,
  Collapse,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  useTheme,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import CorporateFareOutlinedIcon from '@mui/icons-material/CorporateFareOutlined';
import NewspaperOutlinedIcon from "@mui/icons-material/NewspaperOutlined";
import RecyclingOutlinedIcon from "@mui/icons-material/RecyclingOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AddIcon from "@mui/icons-material/Add";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      icon={icon}
      onClick={() => setSelected(title)}
      style={{
        color: selected === title ? colors.grey[900] : colors.grey[700],
        backgroundColor:
          selected === title ? colors.primary[300] : "transparent",
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
  const [openUser, setOpenUser] = useState(false);
  const [openCompany, setOpenCompany] = useState(false);

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
        "& .MuiListItemButton-root:hover": {
          backgroundColor: `${colors.primary[300]} !important`,
          color: `${colors.grey[900]} !important`,
        },
        "& .pro-inner-list-item": {
          backgroundColor: `${colors.primary[400]} !important`,
          padding: "0 !important",
        },
        "& .pro-inner-list-item ul": {
          backgroundColor: `${colors.primary[400]} !important`,
          padding: "0 !important",
        },
        "& .pro-inner-list-item ul li": {
          backgroundColor: `${colors.primary[400]} !important`,
          paddingLeft: "40px !important",
        },
        "& .pro-inner-list-item ul li:hover": {
          backgroundColor: `${colors.primary[300]} !important`,
          paddingLeft: "40px !important",
        },
        "& .pro-inner-list-item ul li.active": {
          backgroundColor: `${colors.primary[300]} !important`,
          paddingLeft: "40px !important",
        },
        "& .popper-inner": {
          backgroundColor: `${colors.primary[400]} !important`,
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <SidebarHeader>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            p={2}
          >
            <IconButton onClick={handleMenuClick}>
              <MenuOutlinedIcon sx={{ color: colors.primary[900] }} />
            </IconButton>
            {!isCollapsed && (
              <Box flexGrow={1} display="flex" justifyContent="center">
                <Typography variant="h3" color={colors.grey[900]}>
                  ADMIN
                </Typography>
              </Box>
            )}
          </Box>
        </SidebarHeader>
        <SidebarContent>
          <Menu>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <SubMenu title={"Users"} icon={<PeopleOutlinedIcon />}>
              <Item
                title="All Users"
                to="/users"
                icon={<PeopleOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Add User"
                to="/add-user"
                icon={<AddIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </SubMenu>
            <SubMenu title={"Companies"} icon={<CorporateFareOutlinedIcon/>}>
              <Item
                title="All Companies"
                to="/company"
                icon={<CorporateFareOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Add Company"
                to="/add-company"
                icon={<AddIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="All Services"
                to="/services"
                icon={<CategoryOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </SubMenu>
            <Item
              title="Gallery"
              to="/gallery"
              icon={<CollectionsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <SubMenu
              title={"Contacts"}
              icon={<ContactsOutlinedIcon />}
            >
              <Item
                title="All Contacts"
                to="/contact"
                icon={<ContactsOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Add Contact"
                to="/add-contact"
                icon={<AddIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </SubMenu>
            <SubMenu
              title={"Jobs"}
              icon={<AssignmentIndOutlinedIcon />}
            >
              <Item
                title="All Jobs"
                to="/jobs"
                icon={<AssignmentIndOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Add Job"
                to="/add-job"
                icon={<AddIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </SubMenu>
            <Item
              title="News"
              to="/news"
              icon={<NewspaperOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="CSR"
              to="/csr"
              icon={<RecyclingOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Menu>
        </SidebarContent>
        <Link to="/login">
          <SidebarFooter>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              p={1}
            >
              <IconButton>
                <LogoutOutlinedIcon sx={{ color: colors.primary[900] }} />
              </IconButton>
              {!isCollapsed && (
                <Box flexGrow={1} display="flex" justifyContent="center">
                  <Typography
                    variant="h3"
                    color={colors.grey[900]}
                    sx={{
                      textDecoration: "none",
                    }}
                  >
                    LOG OUT
                  </Typography>
                </Box>
              )}
            </Box>
          </SidebarFooter>
        </Link>
      </ProSidebar>
    </Box>
  );
};

export default Sidenav;
