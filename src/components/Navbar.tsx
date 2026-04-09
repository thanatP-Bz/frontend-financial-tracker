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
    <nav>
      <Link to="/dashboard">FinanceTracker</Link>
      <div>
        <span>{user?.name}</span>
        <button
          type="button"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
