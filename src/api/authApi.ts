import api from "./axios";
import type { LoginCredentials, RegisterCredentials } from "../types";

export const login = (data: LoginCredentials) =>
  api.post("/auth/login", data).then((res) => {
    console.log(res.data);
    return res.data;
  });

export const register = (data: RegisterCredentials) =>
  api.post("/auth/register", data).then((res) => {
    console.log(res.data);
    return res.data;
  });

export const logout = () => {
  const refreshToken = localStorage.getItem("refreshToken");
  return api.post("/auth/logout", { refreshToken });
};
