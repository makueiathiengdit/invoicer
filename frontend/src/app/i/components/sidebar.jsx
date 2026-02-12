import React from "react";
import { FileText, Folder, Home } from "lucide-react";
import SideBarItem from "./sidebar-item";

const SIDEBAR_LINKS = [
  {
    title: "Overview",
    link: "/i",
    icon: <Home />,
    submenu: [],
  },
  {
    title: "Invoices",
    link: "/i/invoices",
    icon: <FileText />,
    submenu: [
      {
        title: "All",
        link: "/i/invoices/",
        icon: "",
      },

      {
        title: "Pending",
        link: "/i/invoices/pending",
        icon: "",
      },
      {
        title: "Processed",
        link: "/i/invoices/processed",
        icon: "",
      },
    ],
  },
  {
    title: "Purchase Order",
    link: "/i/purchase-orders",
    icon: <Folder />,
    submenu: [],
  },
];

const SideBar = () => {
  return (
    <>
      <aside
        className="fixed top-0 left-0 z-40 w-56 h-screen pt-14 transition-transform -translate-x-full  border-r border-teal-200 md:translate-x-0 bg-teal-600 "
        aria-label="Sidenav"
        id="drawer-navigation"
      >
        <div className="overflow-y-auto py-5 px-3 h-full  bg-teal-600">
          <ul className="space-y-2">
            {SIDEBAR_LINKS.map((item, id) => (
              <SideBarItem item={item} key={id} />
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
