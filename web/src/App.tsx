import "./App.css";
import AppProvider from "./providers/appProvider";
import RouterLink from "./router";
import CustomThemeProvider from "./providers/customThemeProvider";
import Web3Provider from "providers/web3Provider";

function App() {
  return (
    <AppProvider>
      <Web3Provider>
        <CustomThemeProvider>
          <RouterLink />
        </CustomThemeProvider>
      </Web3Provider>
    </AppProvider>
  );
}

export default App;
