import React from "react";
import AppHeader from "./components/app-header";
import SideBar from "./components/sidebar";

const InvoicerRootLayout = ({ children }) => {
  return (
    <div>
      <AppHeader />
      <SideBar />
      <main>{children}</main>
    </div>
  );
};

export default InvoicerRootLayout;
