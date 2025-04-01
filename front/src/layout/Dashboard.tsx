import { useMaterialTailwindController } from "context/index.tsx";
import React from "react";
import Sidebar from "./Sidebar.tsx";
import routes from "routes/SidebarRoutes.tsx";
import { Route, Routes } from "react-router-dom";
import DashboardNavbar from "./Dashboard-navbar.tsx";

export function Dashboard() {
    const [controller, dispatch] = useMaterialTailwindController();
    const { sidenavType } = controller;
  
    return (
      <div className="min-h-screen bg-blue-gray-50/50">

        
        <Sidebar
                routes={routes}
                brandImg={"/logo_vote.svg"} 
                brandName={"E-Vote Express"}  
                      
                />


        <div className="p-4 xl:ml-80">
        <DashboardNavbar />
          <Routes>
            {routes.map(
              ({ layout, pages }) =>
                layout === "dashboard" &&
                pages.map(({ path, element }) => (
                  <Route path={path} element={element} />
                ))
            )}
          </Routes>
        </div>
      </div>
    );
  }