import React from "react";
import AppHeader from "./components/app-header";
import SideBar from "./components/sidebar";

const InvoicerRootLayout = ({ children }) => {
  return (
    <div className="antialiased p-6 mx-auto">
      <AppHeader />
      <SideBar />

      {/* main content */}
      <main className=" ml-56 pt-20  min-h-screen">{children}</main>
    </div>
  );
};

export default InvoicerRootLayout;
