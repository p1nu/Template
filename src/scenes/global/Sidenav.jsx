import React, { useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Box, Typography, IconButton } from "@mui/material";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import { tokens } from "../../theme.jsx"; // Adjust the import path as necessary  
import { Link } from "react-router-dom";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const colors = tokens();
  return (
    <MenuItem
      icon={icon}
      onClick={() => setSelected(title)}
      style={{
        color: selected === title ? '#868dfb' : colors.grey[100]
      }}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};


const Sidenav = () => {
  const colors = tokens();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  
  const handleMenuClick = () => {
    setIsCollapsed(!isCollapsed);
  };


  return (
    <Box
      // sx={{
      //   "& .pro-sidebar-inner": {
      //     backgroundColor: `${colors.primary[900]} !important`,
      //   },
      //   "& .pro-icon-wrapper": {
      //     backgroundColor: "transparent !important",
      //   },
      //   "& .pro-inner-item": {
      //     padding: "5px 35px 20px !important",
      //   },
      //   "& .pro-inner-item:hover": {
      //     color: "#868dfb !important",
      //   },
      //   "& .pro-menu-item.active": {
      //     color: "#868dfb !important",
      //   },
      // }}
    >
      <Sidebar collapsed={isCollapsed} rootStyles={{
        [`.${sidebarClasses.container}`]: {
          backgroundColor: colors.primary[900],
        }
      }}>
        <Menu iconShape="square">
          <MenuItem
            id="admin-menu-item"
            onClick={handleMenuClick}
            icon={isCollapsed ? <MenuOutlinedIcon /> : null}
            style={{ margin: "10px 0 20px 0", color: colors.primary[900] }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h5" color={colors.grey[100]}>
                  ADMIN
                </Typography>
                <IconButton onClick={handleMenuClick}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* USER */}
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
                <Typography variant="h5" color={colors.green[500]}>
                  Admin
                </Typography>
              </Box>
            </Box>
          )}

          {/* MENU ITEMS */}
          <Box paddingLeft={!isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 30px" }}
            >
              Data
            </Typography>
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

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 30px" }}
            >
              Data
            </Typography>
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
      </Sidebar>
    </Box>
    // <Sidebar>
    //   <Menu iconShape="square">
    //     <MenuItem icon={<MenuOutlinedIcon />}>Admin</MenuItem>
    //     <SubMenu title="Components" icon={<HomeOutlinedIcon />}>
    //       <MenuItem>Component 1</MenuItem>
    //       <MenuItem>Component 2</MenuItem>
    //     </SubMenu>
    //   </Menu>
    // </Sidebar>
  );
};

export default Sidenav;