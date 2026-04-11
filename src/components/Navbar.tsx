import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { logout } from "../api/authApi";
import { useAuthStore } from "../store/useAuthStore";

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
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <span className="text-lg font-bold">FinanceTracker</span>
      <div className="flex items-center gap-4">
        <span className="text-gray-600">{user?.name}</span>
        <button
          onClick={() => logoutMutation.mutate()}
          className="px-3 py-1 text-sm text-red-600 hover:text-red-800 cursor-pointer"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
