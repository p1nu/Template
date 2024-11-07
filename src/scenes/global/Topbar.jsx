import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import { Box, IconButton, InputBase, useTheme } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import PersonIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      p={2}
      bgcolor={colors.grey[900]}
    >
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[900]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>
      {/* ICONS */}
      <Box display="flex">
        {theme.palette.mode === "dark" && (
          <IconButton onClick={colorMode.toggleColorMode}>
            <DarkModeOutlinedIcon />
          </IconButton>
        )}
        <IconButton>
          <NotificationsIcon />
        </IconButton>
        <IconButton>
          <SettingsIcon />
        </IconButton>
        <IconButton>
          <PersonIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
