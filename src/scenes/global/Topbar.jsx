import React, { useContext } from 'react';
import { Box, InputBase, IconButton} from '@mui/material';
import { ColorModeContext } from '../../theme.jsx'; // Adjust the import path as necessary
import SearchIcon from '@mui/icons-material/Search';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import { tokens } from '../../theme.jsx'; // Adjust the import path as necessary

const Topbar = () => {
  const colors = tokens();

  return (
    <Box display="flex" justifyContent="space-between" p={2} bgcolor={colors.grey[200]}>
      {/* SEARCH BAR */}
      <Box display="flex" bgcolor={colors.grey[500]} >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton type="button" sx={{ p: 1 }}>
          <NotificationsIcon />
        </IconButton>
        <IconButton type="button" sx={{ p: 1 }}>
          <SettingsIcon />
        </IconButton>
        <IconButton type="button" sx={{ p: 1 }}>
          <PersonIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;