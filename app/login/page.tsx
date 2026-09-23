"use client";

import { useState } from "react";
import api from "@/lib/axios";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post(
            "/auth/login",
            {
                username: username.trim(),
                password,
            },
            {
                headers: {
                "Content-Type": "application/json",
                },
            }
        );

      console.log("LOGIN SUCCESS:", response.data);

      localStorage.setItem("token", response.data.accessToken);

    } catch (error: any) {
  console.log("STATUS:", error.response?.status);
  console.log("DATA:", error.response?.data);
}
  };

  return (
    <main>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">
          Login
        </button>
      </form>
    </main>
  );
}