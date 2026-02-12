import React from "react";
import AppHeader from "./components/app-header";
import SideBar from "./components/sidebar";

const InvoicerRootLayout = ({ children }) => {
  return (
    <div className="p-6 mx-auto">
      <AppHeader />
      <SideBar />

      <main className="m-8 mt-12 bg-gray-100">{children}</main>
    </div>
  );
};

export default InvoicerRootLayout;
