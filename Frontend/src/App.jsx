import React from "react";
import Landingpage from "./pages/Landingpage.jsx";

import { Route, Routes } from "react-router-dom";
import AuthPage from "./components/Authpage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landingpage />} />
      <Route path="/login" element={<AuthPage />} />
    </Routes>
  );
}

export default App;
