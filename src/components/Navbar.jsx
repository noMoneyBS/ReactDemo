import React from "react";

function Navbar({ user, onLogout }) {
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Cooker</h1>
      <div className="flex items-center space-x-4">
        <span className="text-gray-700">欢迎，{user.username}！</span>
        <button
          onClick={onLogout}
          className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
        >
          登出
        </button>
      </div>
    </header>
  );
}

export default Navbar;
