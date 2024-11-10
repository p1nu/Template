import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import { Routes, Route, useLocation } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidenav from "./scenes/global/Sidenav";
import Users from "./scenes/users/Index.jsx";
import AddUser from "./scenes/users/AddUser";
import UpdateUser from "./scenes/users/UpdateUser";
import Company from "./scenes/company/Index.jsx";
import AddCompany from "./scenes/company/AddCompany";
import UpdateCompany from "./scenes/company/UpdateCompany";
import MediaGallery from "./scenes/gallery/Index.jsx";
import Dashboard from "./scenes/dashboard/index.jsx";
import Login from "./scenes/users/Login.jsx";
import Contact from "./scenes/contact/contact.jsx";
import AddContact from "./scenes/contact/AddContact.jsx";
import UpdateContact from "./scenes/contact/UpdateContact.jsx";
import News from "./scenes/news/News.jsx";
import AddNews from "./scenes/news/AddNews.jsx";
import CSR from "./scenes/csr/CSR.jsx";

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
              <Route path="/add-company" element={<AddCompany />} />
              <Route path="/company/:id" element={<UpdateCompany />} />
              <Route path="/gallery" element={<MediaGallery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/add-contact" element={<AddContact />} />
              <Route path="/contact/:id" element={<UpdateContact />} />
              <Route path="/news" element={<News />} />
              <Route path="/add-news" element={<AddNews />} />
              <Route path="/csr" element={<CSR />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
