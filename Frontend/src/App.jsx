import React from "react";
import Landingpage from "./pages/Landingpage.jsx";

import { Route, Routes } from "react-router-dom";
import AuthPage from "./components/Authpage";
import UserPage from "./pages/Userpage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landingpage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/userpage" element={<UserPage />} />
    </Routes>
  );
}

export default App;
