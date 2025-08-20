import React, { useState } from "react";
import AuthForm from "./components/AuthForm";
import Navbar from "./components/Navbar";
import RecipeDisplay from "./components/RecipeDisplay";
import Uploader from "./components/Uploader";
import InteractiveChat from "./components/InteractiveChat";
import LanguageSelector from "./components/LanguageSelector";
import { getText } from "./locales/translations";

function App() {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]); // 推荐结果的全局状态
  const [language, setLanguage] = useState("zh"); // 默认中文
  const [inputMode, setInputMode] = useState("uploader"); // uploader 或 interactive



  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen relative">
        <div className="absolute top-4 right-4">
          <LanguageSelector 
            selectedLanguage={language} 
            onLanguageChange={setLanguage} 
          />
        </div>
        <AuthForm onLogin={(u) => setUser(u)} language={language} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        user={user} 
        onLogout={() => setUser(null)} 
        language={language}
        onLanguageChange={setLanguage}
      />

      <main className="p-6 space-y-6 max-w-3xl mx-auto">
        <RecipeDisplay recipes={recipes} language={language} user={user} />
        
        {/* 输入模式选择 */}
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <div className="flex space-x-4 mb-4">
            <button
              className={`px-4 py-2 rounded-lg transition-colors ${
                inputMode === "uploader" 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setInputMode("uploader")}
            >
              📝 {getText(language, "traditionalMode")}
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-colors ${
                inputMode === "interactive" 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setInputMode("interactive")}
            >
              🤖 {getText(language, "interactiveMode")}
            </button>
          </div>
          
          {/* 模式说明 */}
          <div className="text-sm text-gray-600">
            {inputMode === "uploader" ? (
              <p>{getText(language, "uploaderDescription")}</p>
            ) : (
              <p>{getText(language, "interactiveDescription")}</p>
            )}
          </div>
        </div>
        
        {/* 根据模式显示不同组件 */}
        {inputMode === "uploader" ? (
          <Uploader setRecipes={setRecipes} user={user} language={language} />
        ) : (
          <InteractiveChat 
            user={user} 
            language={language} 
            onRecipesGenerated={setRecipes} 
          />
        )}
      </main>
    </div>
  );
}

export default App;
