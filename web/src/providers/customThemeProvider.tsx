import { useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import lightTheme from "../theme/light";
import darkTheme from "../theme/dark";
import { useAppContext } from "../providers/appProvider";

export default function CustomThemeProvider({ children }: any) {
  const {
    state: { themeMode },
  } = useAppContext();
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
          ...(themeMode === "light" ? lightTheme : darkTheme),
        },
      }),
    [themeMode],
  );
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
