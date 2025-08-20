import React, { useState } from "react";
import AuthForm from "./components/AuthForm";
import Navbar from "./components/Navbar";
import RecipeDisplay from "./components/RecipeDisplay";
import Uploader from "./components/Uploader";
import LanguageSelector from "./components/LanguageSelector";
import { getText } from "./locales/translations";

function App() {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]); // 推荐结果的全局状态
  const [language, setLanguage] = useState("zh"); // 默认中文



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
        <Uploader setRecipes={setRecipes} user={user} language={language} />
      </main>
    </div>
  );
}

export default App;
