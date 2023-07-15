import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Header from "./components/layout/header";
import Home from "./views/home";
import Footer from "./components/layout/footer";
import LoadingModal from "./components/modals/loadingModal";

export default function RouterLink() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} index />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
      <LoadingModal />
    </Router>
  );
}
