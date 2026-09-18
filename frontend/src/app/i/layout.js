import React from "react";
import AppHeader from "./components/app-header";
import SideBar from "./components/sidebar";
import { getSession } from "@/lib/api-server";

const InvoicerRootLayout = async ({ children }) => {
  // the sidebar hides the admin-only links for everyone else
  const session = await getSession();

  return (
    <div className="antialiased p-6 mx-auto">
      <AppHeader />
      <SideBar role={session?.role} />

      {/* main content */}
      <main className="ml-56 pt-20  min-h-screen">{children}</main>
    </div>
  );
};

export default InvoicerRootLayout;
