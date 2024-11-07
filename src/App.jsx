import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidenav from "./scenes/global/Sidenav";
import Users from "./scenes/users/Index.jsx";
// import AddUser from "./scenes/users/AddUser";
// import UpdateUser from "./scenes/users/UpdateUser";
import Company from "./scenes/company/Index.jsx";
// import AddCompany from "./scenes/company/AddCompany";
// import UpdateCompany from "./scenes/company/UpdateCompany";
// import { MediaGallery } from "./scenes/gallery/Index.jsx";
import Dashboard from "./scenes/dashboard/index.jsx";

function App() {
  const [theme, colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app" style={{ display: 'flex', height: '100vh' }}>
          <Sidenav />
          <main className="content" style={{ flexGrow: 1, overflow: 'auto' }}>
            <Topbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              {/* <Route path="/add-user" element={<AddUser />} /> */}
              {/* <Route path="/user/:id" element={<UpdateUser />} /> */}
              <Route path="/company" element={<Company />} />
              {/* <Route path="/add-company" element={<AddCompany />} /> */}
              {/* <Route path="/company/:id" element={<UpdateCompany />} /> */}
              {/* <Route path="/gallery" element={<MediaGallery />} /> */}
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
