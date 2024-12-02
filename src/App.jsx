import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import { Routes, Route, useLocation } from "react-router-dom";
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
import Jobs from "./scenes/jobs/Jobs.jsx";
import AddJob from "./scenes/jobs/AddJob.jsx";
import UpdateJob from "./scenes/jobs/UpdateJob.jsx";

function App() {
  const [theme, colorMode] = useMode();
  const location = useLocation();

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
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/login" element={<Login />} />
              <Route path="/add-user" element={<AddUser />} />
              <Route path="/user/:id" element={<UpdateUser />} />
              <Route path="/company" element={<Company />} />
              <Route path="/banner/company/:id" element={<Banner />} />
              <Route path="/banner/service/:id" element={<BannerService />} />
              <Route path="/add-company" element={<AddCompany />} />
              <Route path="/company/:id" element={<UpdateCompany />} />
              <Route path="/services" element={<Services />} />
              <Route path="/company/service/:id" element={<ServiceCompany />} />
              <Route path="/add-service" element={<AddService />} />
              <Route path="/add-service/:id" element={<AddServiceByCompany />} />
              <Route path="/service/:id" element={<UpdateService />} />
              <Route path="/gallery" element={<MediaGallery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/add-contact" element={<AddContact />} />
              <Route path="/contact/:id" element={<UpdateContact />} />
              <Route path="/news" element={<News />} />
              <Route path="/add-news" element={<AddNews />} />
              <Route path="/news/:id" element={<UpdateNews />} />
              <Route path="/csr" element={<CSR />} />
              <Route path="/add-csr" element={<AddCSR />} />
              <Route path="/csr/:id" element={<UpdateCSR />} />
              <Route path="/mission/:id" element={<Mission />} />
              <Route path="/add-mission/:id" element={<AddMissoin />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/add-job" element={<AddJob />} />
              <Route path="/job/:id" element={<UpdateJob />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
