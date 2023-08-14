import {
  HashRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Home from "./views/home/home";
// import Footer from "./components/layout/footer";
import LoadingModal from "./components/modals/loadingModal";
import GalleryPage from "views/gallery/gallery";
// import LicensePage from "views/license";
import UserPage from "views/user/user";
// import ShopPage from "views/shop";
import SharePage from "views/share";

export default function RouterLink() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} index />
        <Route path="/gallery" element={<GalleryPage />} />
        {/* <Route path="/license" element={<LicensePage />} /> */}
        <Route path="/my" element={<UserPage />} />
        <Route path="/share" element={<SharePage />} />
        {/* <Route path="/shop" element={<ShopPage />} /> */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {/* <Footer /> */}
      <LoadingModal />
    </Router>
  );
}
