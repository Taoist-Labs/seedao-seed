import "./App.css";
import AppProvider from "./providers/appProvider";
import RouterLink from "./router";
import CustomThemeProvider from "./providers/customThemeProvider";
import WagmiProvider from 'providers/wagmiProvider';

function App() {
  return (
    <AppProvider>
        <WagmiProvider>
          {/*<Web3Provider>*/}
            <CustomThemeProvider>
              <RouterLink />
            </CustomThemeProvider>
          {/*</Web3Provider>*/}
        </WagmiProvider>
    </AppProvider>
  );
}

export default App;
