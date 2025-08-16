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
      <aside className="w-56 bg-gray-900 text-white flex flex-col p-4">
        <h1 className="text-lg mb-6">SPUDLOVE</h1>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
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
