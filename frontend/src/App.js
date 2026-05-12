import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Landing from "./pages/Landing";
import Reservation from "./pages/placeholders/Reservation";
import Sales from "./pages/placeholders/Sales";
import GroupCoordinator from "./pages/placeholders/GroupCoordinator";
import GeneralManager from "./pages/placeholders/GeneralManager";
import GuestFlow from "./pages/guest/GuestFlow";
import ReceptionistLayout from "./pages/receptionist/ReceptionistLayout";
import Arrivals from "./pages/receptionist/Arrivals";
import NewWalkin from "./pages/receptionist/NewWalkin";
import GuestEdit from "./pages/receptionist/GuestEdit";
import PlaceholderTab from "./pages/receptionist/PlaceholderTab";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route path="/receptionist" element={<ReceptionistLayout />}>
            <Route index element={<Arrivals />} />
            <Route path="walkin" element={<NewWalkin />} />
            <Route path="guest/:id" element={<GuestEdit />} />
            <Route
              path="qr"
              element={
                <PlaceholderTab
                  title="QR Display Board"
                  subtitle="Lobby display for walk-in check-in scans"
                  copy="A live, fullscreen QR board that lobby screens can render. Built on top of the same walk-in pipeline used in the New Walk-in module."
                />
              }
            />
            <Route
              path="checkedout"
              element={
                <PlaceholderTab
                  title="Checked Out"
                  subtitle="Departures from the last 7 days"
                  copy="Quick recall of recent departures for follow-ups, feedback collection and lost-and-found resolution."
                />
              }
            />
            <Route
              path="all"
              element={
                <PlaceholderTab
                  title="All Reservations"
                  subtitle="Full PMS-synced reservation list"
                  copy="Filter, search and edit every reservation in the property's PMS, with full audit trail."
                />
              }
            />
          </Route>

          <Route path="/reservation" element={<Reservation />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/coordinator" element={<GroupCoordinator />} />
          <Route path="/group" element={<Navigate to="/coordinator" replace />} />
          <Route path="/management" element={<GeneralManager />} />
          <Route path="/gm" element={<Navigate to="/management" replace />} />
          <Route path="/guest" element={<GuestFlow />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
