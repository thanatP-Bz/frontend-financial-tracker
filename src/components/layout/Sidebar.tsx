import { Home, Receipt, BarChart3, Settings, X, Wallet } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Transactions", icon: Receipt, path: "/transactions" },
    { name: "Budgets", icon: Wallet, path: "/budgets" },
    { name: "Analytics", icon: BarChart3, path: "/analytics" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <>
      {/* Overlay - only on mobile when open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static
        inset-y-0 left-0
        z-50
        w-64 h-screen
        bg-white 
        flex flex-col
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Logo + Close Button */}
        <div className="p-6 flex justify-end">
          {/* Close button - only visible on mobile */}
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-2 bg-gray-100 rounded-lg cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 md:p-4 mt-1">
          <ul className="space-y-1.5 md:space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base font-medium ${
                    isActive(item.path)
                      ? "bg-[#0892a5] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <item.icon size={18} className="md:w-5 md:h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">v1.0.0</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
