import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    primary: {
      main: "#33404A",
      contrastText: "#FFF",
    },
    secondary: {
      main: "#94BBD6",
      contrastText: "#FFF",
    },
    background: {
      main: "#F4F9F9",
      contrastText: "#EBD3F8",
    },
    greyNavItem: {
      main: "#688396",
    },
  },
  typography: {
    fontFamily: "Poppins, Arial, sans-serif",
  },
});;

theme = responsiveFontSizes(theme);

export default theme;
