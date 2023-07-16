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
import GalleryPage from "views/gallery";
import LicensePage from "views/license";
import UserPage from "views/user";
import ShopPage from "views/shop";

export default function RouterLink() {
  return (
    <Router>
      <Header />
      <div className="mainContent">
        <Routes>
          <Route path="/" element={<Home />} index />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/license" element={<LicensePage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Footer />
      <LoadingModal />
    </Router>
  );
}
