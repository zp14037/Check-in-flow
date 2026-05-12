import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/receptionist/Sidebar";
import ToastHost from "../../components/receptionist/ToastHost";

export default function ReceptionistLayout() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1a1a1a] font-body" data-testid="receptionist-layout">
      <Sidebar />
      <div className="lg:pl-[240px] min-h-screen">
        <Outlet />
      </div>
      <ToastHost />
    </div>
  );
}
