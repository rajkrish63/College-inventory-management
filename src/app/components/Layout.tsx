import { Outlet, Link, useLocation } from "react-router";
import { Navigation } from "./Navigation";
import { Sidebar } from "./Sidebar";
import { useState } from "react";
import { Microscope, Home, Settings, FlaskConical, Dna, Cpu, Atom, Monitor, ChevronDown, ChevronLeft, ChevronRight, User, LayoutGrid } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut as LogOutIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { SettingsModal } from "./SettingsModal";
import { LogoutModal } from "./LogoutModal";

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const location = useLocation();
  const { currentUser, logout } = useAppContext();
  const navigate = useNavigate();

  const isAdminRoute = location.pathname.startsWith("/admin");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {!isAdminRoute && <Navigation onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />}
      <div className="flex flex-1 overflow-hidden">
        {/* Persistent Sidebar */}
        {!isAdminRoute && (
          <Sidebar isOpen={isSidebarOpen}>
            <Sidebar.Nav>
              <Sidebar.Section title="Research Areas">
                {[
                  { name: "All Research Areas", icon: LayoutGrid, path: "/facilities/", state: { data: "All" } },
                  { name: "Chemistry Lab", icon: FlaskConical, path: "/facilities/", state: { data: "Chemistry" } },
                  { name: "Biotech Lab", icon: Dna, path: "/facilities/", state: { data: "Biotechnology" } },
                  { name: "Electronics Lab", icon: Cpu, path: "/facilities/", state: { data: "Electronics" } },
                  { name: "Materials Lab", icon: Atom, path: "/facilities/", state: { data: "Materials Science" } },
                  { name: "Computing Lab", icon: Monitor, path: "/facilities/", state: { data: "Computing" } },
                ].map((area) => {
                  const activeData = location.state?.data;
                  const isActive = area.state
                    ? activeData === area.state.data
                    : (!activeData && location.pathname === area.path);

                  return (
                    <Sidebar.Item
                      key={area.name}
                      label={area.name}
                      icon={area.icon}
                      to={area.path}
                      state={area.state}
                      isActive={isActive}
                    />
                  );
                })}
              </Sidebar.Section>
            </Sidebar.Nav>
            <Sidebar.Profile
              onSettingsClick={() => setIsSettingsOpen(true)}
              onLogoutClick={() => setIsLogoutOpen(true)}
            />
          </Sidebar>
        )}

        {/* Settings Modal */}
        <SettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />

        {/* Logout Modal */}
        <LogoutModal
          open={isLogoutOpen}
          onOpenChange={setIsLogoutOpen}
          onConfirm={handleLogout}
        />

        {/* Main Content Area */}
        <main className={`flex-1 ${isAdminRoute ? "overflow-hidden" : "overflow-y-auto scroll-smooth"} bg-white w-full pt-0`}>
          <div className="flex-1 h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
