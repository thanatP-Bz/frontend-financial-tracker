import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { logout } from '../api/authApi';
import { useAuthStore } from '../store/useAuthStore';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearAuth();
      navigate('/login');
      toast.success('Logged out');
    },
  });

  return (
    <nav className="bg-white border-b px-6 py-3 flex items-center justify-between">
      <Link to="/dashboard" className="font-bold text-lg">
        FinanceTracker
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/add-transaction" className="text-sm text-blue-600 hover:underline">
          + Add Transaction
        </Link>
        <span className="text-sm text-gray-500">{user?.name}</span>
        <button
          type="button"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          className="text-sm text-red-500 hover:underline disabled:opacity-50"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
