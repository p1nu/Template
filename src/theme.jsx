import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";
// import { Battery20Rounded, SecurityOutlined } from "@mui/icons-material";
// import { dark, light } from "@mui/material/styles/createPalette";

//coloe design tokens
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        primary: {
          100: "#d4dae2",
          200: "#a9b5c5",
          300: "#7d90a8",
          400: "#526b8b",
          500: "#27466e",
          600: "#1f3858",
          700: "#172a42",
          800: "#101c2c",
          900: "#080e16",
        },
        grey: {
          100: "#e8eaec",
          200: "#d1d5d9",
          300: "#bbc0c7",
          400: "#a4abb4",
          500: "#8d96a1",
          600: "#717881",
          700: "#555a61",
          800: "#383c40",
          900: "#1c1e20",
        },
        blueAccent: {
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
        greenAccent: {
          100: "#d5f1e0",
          200: "#abe3c2",
          300: "#80d4a3",
          400: "#56c685",
          500: "#2cb866",
          600: "#239352",
          700: "#1a6e3d",
          800: "#124a29",
          900: "#092514",
        },
        redAccent: {
          100: "#f6d2d2",
          200: "#eda5a5",
          300: "#e37878",
          400: "#da4b4b",
          500: "#d11e1e",
          600: "#a71818",
          700: "#7d1212",
          800: "#540c0c",
          900: "#2a0606",
        },
      }
    : {
      primary: {
        100: "#080e16",
        200: "#101c2c",
        300: "#172a42",
        400: "#1f3858",
        500: "#27466e",
        600: "#526b8b",
        700: "#7d90a8",
        800: "#a9b5c5",
        900: "#d4dae2",
      },
      grey: {
        100: "#1c1e20",
        200: "#383c40",
        300: "#555a61",
        400: "#717881",
        500: "#8d96a1",
        600: "#a4abb4",
        700: "#bbc0c7",
        800: "#d1d5d9",
        900: "#e8eaec",
      },
      blueAccent: {
        100: "#05182a",
        200: "#0a2f54",
        300: "#0f477e",
        400: "#145ea8",
        500: "#1976d2",
        600: "#4791db",
        700: "#75ade4",
        800: "#a3c8ed",
        900: "#d1e4f6",
      },
      greenAccent: {
        100: "#092514",
        200: "#124a29",
        300: "#1a6e3d",
        400: "#239352",
        500: "#2cb866",
        600: "#56c685",
        700: "#80d4a3",
        800: "#abe3c2",
        900: "#d5f1e0",
      },
      redAccent: {
        100: "#2a0606",
        200: "#540c0c",
        300: "#7d1212",
        400: "#a71818",
        500: "#d11e1e",
        600: "#da4b4b",
        700: "#e37878",
        800: "#eda5a5",
        900: "#f6d2d2",
      },
      }),
});

//mui theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);

  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.primary[500],
            },
          }
        : {
            primary: {
              main: colors.primary[100],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: "#fcfcfc",
            },
          }),
    },
    typography: {
      fontFamily: ["Source Sans 3", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Source Sans 3", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Source Sans 3", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Source Sans 3", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Source Sans 3", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Source Sans 3", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Source Sans 3", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

//context for color mode
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const useMode = () => {
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return [theme, colorMode];
};
