import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import { Routes, Route, useLocation, Navigate, BrowserRouter as Router } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./scenes/global/AuthContext";
import Topbar from "./scenes/global/Topbar";
import Sidenav from "./scenes/global/Sidenav";
import Users from "./scenes/users/Index.jsx";
import AddUser from "./scenes/users/AddUser";
import UpdateUser from "./scenes/users/UpdateUser";
import Company from "./scenes/company/Index.jsx";
import Banner from "./scenes/company/Banner.jsx";
import BannerService from "./scenes/company/BannerService.jsx";
import AddCompany from "./scenes/company/AddCompany";
import UpdateCompany from "./scenes/company/UpdateCompany";
import Services from "./scenes/company/Services.jsx";
import ServiceCompany from "./scenes/company/ServiceCompany.jsx";
import AddService from "./scenes/company/AddService.jsx";
import AddServiceByCompany from "./scenes/company/AddServiceByCompany.jsx";
import UpdateService from "./scenes/company/UpdateService.jsx";
import {MediaGallery} from "./scenes/gallery/Index.jsx";
import Dashboard from "./scenes/dashboard/index.jsx";
import Login from "./scenes/users/Login.jsx";
import Contact from "./scenes/contact/contact.jsx";
import AddContact from "./scenes/contact/AddContact.jsx";
import UpdateContact from "./scenes/contact/UpdateContact.jsx";
import News from "./scenes/news/News.jsx";
import AddNews from "./scenes/news/AddNews.jsx";
import UpdateNews from "./scenes/news/UpdateNews.jsx";
import CSR from "./scenes/csr/CSR.jsx";
import AddCSR from "./scenes/csr/AddCSR.jsx";
import UpdateCSR from "./scenes/csr/UpdateCSR.jsx";
import Mission from "./scenes/csr/Mission.jsx";
import AddMissoin from "./scenes/csr/AddMissoin.jsx";
import UpdateMission from "./scenes/csr/UpdateMission.jsx";
import Jobs from "./scenes/jobs/Jobs.jsx";
import AddJob from "./scenes/jobs/AddJob.jsx";
import UpdateJob from "./scenes/jobs/UpdateJob.jsx";
import Test from "./scenes/news/Test.jsx";
import Gallery from "./scenes/gallery/Gallery.jsx";
import Products from "./scenes/products/Products.jsx";
import AddProduct from "./scenes/products/AddProduct.jsx";
import Categories from "./scenes/products/Categories.jsx";
import AddCategory from "./scenes/products/AddCategory.jsx";
import PreviewBanner from "./scenes/company/PreviewBanner.jsx";


function App() {
  const [theme, colorMode] = useMode();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const isLoginPage = location.pathname === "/login";



  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app" style={{ display: 'flex', height: '100vh' }}>
          {!isLoginPage && <Sidenav />}
          <main className="content" style={{ flexGrow: 1, overflow: 'auto' }}>
            {!isLoginPage && <Topbar />}
            <Routes>
              <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/users" element={user ? <Users /> : <Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/add-user" element={user ? <AddUser /> : <Navigate to="/login" />} />
              <Route path="/user/:id" element={user ? <UpdateUser /> : <Navigate to="/login" />} />
              <Route path="/company" element={user ? <Company /> : <Navigate to="/login" />} />
              <Route path="/banner/company/:id" element={user ? <Banner /> : <Navigate to="/login" />} />
              <Route path="/banner/service/:id" element={user ? <BannerService /> : <Navigate to="/login" />} />
              <Route path="/add-company" element={user ? <AddCompany /> : <Navigate to="/login" />} />
              <Route path="/company/:id" element={user ? <UpdateCompany /> : <Navigate to="/login" />} />
              <Route path="/services" element={user ? <Services /> : <Navigate to="/login" />} />
              <Route path="/company/service/:id" element={user ? <ServiceCompany /> : <Navigate to="/login" />} />
              <Route path="/add-service" element={user ? <AddService /> : <Navigate to="/login" />} />
              <Route path="/add-service/:id" element={user ? <AddServiceByCompany /> : <Navigate to="/login" />} />
              <Route path="/service/:id" element={user ? <UpdateService /> : <Navigate to="/login" />} />
              <Route path="/gallery" element={user ? <MediaGallery /> : <Navigate to="/login" />} />
              <Route path="/contact" element={user ? <Contact /> : <Navigate to="/login" />} />
              <Route path="/add-contact" element={user ? <AddContact /> : <Navigate to="/login" />} />
              <Route path="/contact/:id" element={user ? <UpdateContact /> : <Navigate to="/login" />} />
              <Route path="/news" element={user ? <News /> : <Navigate to="/login" />} />
              <Route path="/add-news" element={user ? <AddNews /> : <Navigate to="/login" />} />
              <Route path="/news/:id" element={user ? <UpdateNews /> : <Navigate to="/login" />} />
              <Route path="/csr" element={user ? <CSR /> : <Navigate to="/login" />} />
              <Route path="/add-csr" element={user ? <AddCSR /> : <Navigate to="/login" />} />
              <Route path="/csr/:id" element={user ? <UpdateCSR /> : <Navigate to="/login" />} />
              <Route path="/mission/:id" element={user ? <Mission /> : <Navigate to="/login" />} />
              <Route path="/add-mission/:id" element={user ? <AddMissoin /> : <Navigate to="/login" />} />
              <Route path="/update-mission/:id" element={user ? <UpdateMission /> : <Navigate to="/login" />} />
              <Route path="/jobs" element={user ? <Jobs /> : <Navigate to="/login" />} />
              <Route path="/add-job" element={user ? <AddJob /> : <Navigate to="/login" />} />
              <Route path="/job/:id" element={user ? <UpdateJob /> : <Navigate to="/login" />} />
              <Route path="/test" element={user ? <Test /> : <Navigate to="/login" />} />
              <Route path="/products" element={user ? <Products /> : <Navigate to="/login" />} />
              <Route path="/add-product" element={user ? <AddProduct /> : <Navigate to="/login" />} />
              <Route path="/categories" element={user ? <Categories /> : <Navigate to="/login" />} />
              <Route path="/add-category" element={user ? <AddCategory /> : <Navigate to="/login" />} />
              <Route path="/preview-banner/service/:serviceId" element={user ? <PreviewBanner /> : <Navigate to="/login" />} />
            </Routes>
            <Gallery />
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
