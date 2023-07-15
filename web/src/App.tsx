import "./App.css";
import AppProvider from "./providers/appProvider";
import RouterLink from "./router";

function App() {
  return (
    <AppProvider>
      <RouterLink />
    </AppProvider>
  );
}

export default App;
