import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Landing from "./pages/Landing";
import Receptionist from "./pages/placeholders/Receptionist";
import Reservation from "./pages/placeholders/Reservation";
import Sales from "./pages/placeholders/Sales";
import GroupCoordinator from "./pages/placeholders/GroupCoordinator";
import GeneralManager from "./pages/placeholders/GeneralManager";
import GuestView from "./pages/placeholders/GuestView";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/receptionist" element={<Receptionist />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/group" element={<GroupCoordinator />} />
          <Route path="/gm" element={<GeneralManager />} />
          <Route path="/guest" element={<GuestView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
