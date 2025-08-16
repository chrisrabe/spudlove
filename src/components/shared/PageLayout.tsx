import React, { type ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { MapPin, Bell } from "lucide-react";

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { to: "/locations", label: "Locations", icon: <MapPin size={20} /> },
    { to: "/notifications", label: "Notifications", icon: <Bell size={20} /> },
  ];

  return (
    <div className="flex h-screen w-screen">
      <aside className="w-56 flex flex-col p-4 border-r border-gray-300">
        <h1 className="text-lg mb-6 font-bold pb-2 border-b border-gray-300">
          SPUDLOVE
        </h1>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-full transition-colors ${
                  isActive ? "bg-blue-950 text-white" : "hover:bg-blue-100"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 bg-gray-100 overflow-y-auto">{children}</main>
    </div>
  );
};

export default PageLayout;
