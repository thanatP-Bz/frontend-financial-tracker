import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { logout } from "../../api/authApi";
import { useAuthStore } from "../../store/useAuthStore";
import { LogOut } from "lucide-react";

export default function Navbar() {
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

  return (
    <nav className="flex items-center justify-between px-11 py-5 bg-white">
      {/* Empty left side - or you can add breadcrumbs later */}
      <div></div>

      {/* Right side - User info + Logout */}
      <div className="flex items-center gap-4">
        {/* User Avatar + Name */}
        <div className="flex items-center gap-3 border-r border-gray-200 px-3">
          <div className="w-10 h-10 rounded-full bg-[#06908f] flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-700">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>

        {/* Logout Button */}
        <div className="flex items-center gap-x-4">
          <div className="text-gray-500">
            <LogOut />
          </div>
          <button
            onClick={() => logoutMutation.mutate()}
            className="px-3 py-2 text-sm font-medium text-white bg-[#f27979] rounded-lg transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
