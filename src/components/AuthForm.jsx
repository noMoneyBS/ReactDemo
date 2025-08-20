import React, { useState } from "react";
import api from "../api/axios";
import { getText } from "../locales/translations";

export default function AuthForm({ onLogin, language }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        // 登录
        const res = await api.post("/auth/login", { email, password });
        localStorage.setItem("token", res.data.token || "mock-token");
        onLogin(res.data.user || { email, userId: res.data.userId });
      } else {
        // 注册
        const res = await api.post("/auth/register", { username, email, password });
        setSuccess(getText(language, "registerSuccess"));
        setIsLogin(true);
        setUsername("");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || (isLogin ? getText(language, "loginFailed") : getText(language, "registerFailed")));
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-96">
      <div className="flex mb-6">
        <button
          type="button"
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-2 px-4 rounded-l-lg font-medium transition-colors ${
            isLogin
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {getText(language, "login")}
        </button>
        <button
          type="button"
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-2 px-4 rounded-r-lg font-medium transition-colors ${
            !isLogin
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {getText(language, "register")}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold mb-4 text-center">
          {isLogin ? getText(language, "welcomeBack") : getText(language, "createAccount")}
        </h2>

        {!isLogin && (
          <input
            type="text"
            placeholder={getText(language, "username")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded p-2 mb-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            required={!isLogin}
          />
        )}

        <input
          type="email"
          placeholder={getText(language, "email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded p-2 mb-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          required
        />

        <input
          type="password"
          placeholder={getText(language, "password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded p-2 mb-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          required
        />

        {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}
        {success && <p className="text-green-500 mb-2 text-sm">{success}</p>}

        <button
          type="submit"
          className="w-full px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors font-medium"
        >
          {isLogin ? getText(language, "login") : getText(language, "register")}
        </button>
      </form>
    </div>
  );
}
