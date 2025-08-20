import React, { useState } from "react";
import api from "../api/axios";

export default function AuthForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      // 假设后端返回 { token, user }
      localStorage.setItem("token", res.data.token || "mock-token");
      onLogin(res.data.user || { email });
    } catch (err) {
      console.error(err);
      setError("登录失败，请检查邮箱或密码");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-md w-80"
    >
      <h2 className="text-xl font-semibold mb-4">登录</h2>

      <input
        type="email"
        placeholder="请输入邮箱"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border rounded p-2 mb-3"
        required
      />

      <input
        type="password"
        placeholder="请输入密码"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border rounded p-2 mb-3"
        required
      />

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <button
        type="submit"
        className="w-full px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
      >
        登录
      </button>
    </form>
  );
}
