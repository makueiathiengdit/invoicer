import React from "react";
import AppHeader from "./components/app-header";
import SideBar from "./components/sidebar";

const InvoicerRootLayout = ({ children }) => {
  return (
    <div className="antialiased p-6 mx-auto">
      <AppHeader />
      <SideBar />

      <main className="mt-12 bg-gray-100 z-50 h-screen">{children}</main>
    </div>
  );
};

export default InvoicerRootLayout;
