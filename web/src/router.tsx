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

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <LoadingModal />
    </Router>
  );
}
