import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { logout } from "../../api/authApi";
import { useAuthStore } from "../../store/useAuthStore";
import { Menu } from "lucide-react";

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearAuth();
      navigate("/login");
      toast.success("Logged out");
    },
  });

  /* filter income */

  return (
    <nav className="flex items-center justify-between px-4 border-b border-gray-200  md:px-8 py-5 bg-white">
      {/* Empty left side - or you can add breadcrumbs later */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg bg-gray-100 cursor-pointer"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* logo */}
      <div>
        <h1 className="text-md md:text-xl lg:text-2xl font-bold text-gray-800">
          Financial Tracker
        </h1>
      </div>

      {/* Right side - User info + Logout */}
      <div className="flex items-center gap-4">
        {/* User Avatar + Name */}
        <div className="flex items-center gap-3 border-r border-gray-200 px-3">
          <div className="w-10 h-10 rounded-full bg-[#06908f] flex items-center justify-center text-white font-semibold ">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-700">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>

        {/* Logout Button */}
        <div className=" items-center gap-x-4 flex">
          <button
            onClick={() => logoutMutation.mutate()}
            className="px-3 py-2 text-sm font-medium text-white bg-[#e6748e] rounded-lg transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
