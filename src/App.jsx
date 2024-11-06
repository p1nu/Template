import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidenav from "./scenes/global/Sidenav";
import Topbar from "./scenes/global/Topbar";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Sidenav />
        <main className="content">
          <Topbar />
          <Routes>
            <Route path="/" element={<div>Home</div>}></Route>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
