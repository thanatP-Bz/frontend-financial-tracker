import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";
import { login } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const loginMutaion = useMutation({
    mutationFn: login,

    onSuccess: (data) => {
      setAuth(data.accessToken, data.refreshToken, data.user);

      toast.success("Login Successful!");
      navigate("/dashboard");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message = error.message?.data?.message || "Register failed";
      toast.error(message);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    loginMutaion.mutate(formData);
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <p>email</p>
          <input
            type="email"
            name="email"
            placeholder="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <p>password</p>
          <input
            type="password"
            name="password"
            placeholder="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button>submit</button>
      </form>
    </div>
  );
}
