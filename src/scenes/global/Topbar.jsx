import React, { useContext, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import { tokens } from "../../theme";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const { user, logout } = useContext(AuthContext);

  // State to manage the user menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box
      display="flex"
      justifyContent="end"
      p={1.5}
      bgcolor={colors.grey[800]}
    >
      {/* Left side content, e.g., logo */}

      {/* Right side: User info */}
      <Box display="flex" alignItems="center">
        <Typography variant="h5" color={colors.grey[100]} mr={2}>
          {user?.user_name || "Guest"}
        </Typography>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleMenuOpen}
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            color="inherit"
          >
            <PersonIcon />
          </IconButton>
        </Tooltip>
        <Menu
          id="account-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={logout}>
            <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Topbar;
