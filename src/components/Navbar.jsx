import React from "react";
import { getText } from "../locales/translations";
import LanguageSelector from "./LanguageSelector";

function Navbar({ user, onLogout, language, onLanguageChange }) {
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Cooker</h1>
      <div className="flex items-center space-x-4">
        <span className="text-gray-700">{getText(language, "welcome")}，{user.username || user.email || '用户'}！</span>
        <LanguageSelector 
          selectedLanguage={language} 
          onLanguageChange={onLanguageChange} 
        />
        <button
          onClick={onLogout}
          className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
        >
          {getText(language, "logout")}
        </button>
      </div>
    </header>
  );
}

export default Navbar;
