import "./App.css";
import AppProvider from "./providers/appProvider";
import RouterLink from "./router";
import CustomThemeProvider from "./providers/customThemeProvider";

function App() {
  return (
    <AppProvider>
      <CustomThemeProvider>
        <RouterLink />
      </CustomThemeProvider>
    </AppProvider>
  );
}

export default App;
