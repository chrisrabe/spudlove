import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import LocationsPage from "./components/pages/LocationsPage";
import NotificationsPage from "./components/pages/NotificationsPage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/locations" replace />} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
