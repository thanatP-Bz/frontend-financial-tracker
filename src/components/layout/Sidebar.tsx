import { Home, Receipt, BarChart3, Settings } from "lucide-react";
import { useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Transactions", icon: Receipt, path: "/transactions" },
    { name: "Analytics", icon: BarChart3, path: "/analytics" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];
  return (
    <div className="w-64 h-screen bg-white boder-r flex flex-col">
      {/* logo */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Financial Tracker</h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 mt-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                  isActive(item.path)
                    ? "bg-[#0892a5] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section (optional - could add user info here) */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">v1.0.0</p>
      </div>
    </div>
  );
};

export default Sidebar;
