import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { createContext, useState, useMemo } from "react";

export const tokens = () => ({
  primary: {
    100: "#dce0e7",
    200: "#b8c2ce",
    300: "#95a3b6",
    400: "#71859d",
    500: "#4e6685",
    600: "#3e526a",
    700: "#2f3d50",
    800: "#1f2935",
    900: "#10141b",
  },
  grey: {
    100: "#f0f3f5",
    200: "#e2e6ec",
    300: "#d3dae2",
    400: "#c5cdd9",
    500: "#b6c1cf",
    600: "#929aa6",
    700: "#6d747c",
    800: "#494d53",
    900: "#191b1c",
  },
  blue: {
    100: "#d1e4f6",
    200: "#a3c8ed",
    300: "#75ade4",
    400: "#4791db",
    500: "#1976d2",
    600: "#145ea8",
    700: "#0f477e",
    800: "#0a2f54",
    900: "#05182a",
  },
  green: {
    100: "#d5f1e0",
    200: "#abe3c2",
    300: "#80d4a3",
    400: "#56c685",
    500: "#2cb866",
  },
});

const themeSettings = () => {
  const colors = tokens();

  return {
    palette: {
      primary: {
        main: colors.primary[500],
      },
      secondary: {
        main: colors.green[500],
      },
      background: {
        default: colors.primary[100],
      },
    },
    typography: {
      fontFamily: "Roboto, sans-serif",
      h1: {
        fontSize: "2rem",
        fontWeight: 500,
      },
      h2: {
        fontSize: "1.75rem",
        fontWeight: 500,
      },
      h3: {
        fontSize: "1.5rem",
        fontWeight: 500,
      },
      h4: {
        fontSize: "1.25rem",
        fontWeight: 500,
      },
      h5: {
        fontSize: "1rem",
        fontWeight: 500,
      },
      h6: {
        fontFamily: ["Source Sans 3", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

// Context for color mode
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const useMode = () => {
  const [mode, setMode] = useState("dark");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings()), []);

  return [theme, colorMode];
};
