import React from "react";
import { getSupportedLanguages } from "../locales/languages";

function LanguageSelector({ selectedLanguage, onLanguageChange }) {
  const languages = getSupportedLanguages();
  
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    onLanguageChange(newLanguage);
  };
  
  return (
    <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200">
      <span className="text-sm text-gray-600 font-medium">🌍</span>
      <select
        value={selectedLanguage}
        onChange={handleLanguageChange}
        className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default LanguageSelector;
