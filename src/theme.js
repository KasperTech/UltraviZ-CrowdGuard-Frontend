import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    primary: {
      main: "#4361ee",
      contrastText: "#FFF",
    },
    secondary: {
      main: "#4C3BCF",
      contrastText: "#FFF",
    },
    background: {
      main: "#f4f6f8",
      contrastText: "#EBD3F8",
    },
    greyNavItem: {
      main: "#637381",
    },
  },
  typography: {
    fontFamily: "Poppins, Arial, sans-serif",
  },
});

theme = responsiveFontSizes(theme);

export default theme;
