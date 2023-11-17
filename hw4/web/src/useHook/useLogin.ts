import type { LoginRequest, LoginResponse } from "@/package/types/api";

export default function useLogin() {
  const login = async ({ name, password }: LoginRequest) => {
    const res = await fetch("api/login", {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      method: "POST",
      body: JSON.stringify({ name, password }),
    });

    const data: LoginResponse = await res.json();
    if (!res.ok) {
      throw new Error("Login Error");
    }
    return data;
  };

  const signup = async ({ name, password }: LoginRequest) => {
    const res = await fetch("api/signup", {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      method: "POST",
      body: JSON.stringify({ name, password }),
    });
    const data: LoginResponse = await res.json();
    if (!res.ok) {
      throw new Error("Login Error");
    }
    return data;
  };
  return {
    login,
    signup,
  };
}
