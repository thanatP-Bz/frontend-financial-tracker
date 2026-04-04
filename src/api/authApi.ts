import api from "./axios";
import type { LoginCredentials, RegisterCredentials } from "../types";

export const login = (data: LoginCredentials) =>
  api.post("/auth/login", data).then((res) => {
    console.log("Login response:", res.data); // DEBUG: See what backend returns
    return res.data;
  });

export const register = (data: RegisterCredentials) =>
  api.post("/auth/register", data).then((res) => {
    console.log("Register response:", res.data); // DEBUG: See what backend returns
    return res.data;
  });

export const logout = () => api.post("/auth/logout");
