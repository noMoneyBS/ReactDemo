import React, { useState } from "react";
import AuthForm from "./components/AuthForm";
import Navbar from "./components/Navbar";
import Recommendation from "./components/Recommendation";
import Uploader from "./components/Uploader";

function App() {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]); // 推荐结果的全局状态

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <AuthForm onLogin={(u) => setUser(u)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={() => setUser(null)} />

      <main className="p-6 space-y-6 max-w-3xl mx-auto">
        <Recommendation recipes={recipes} setRecipes={setRecipes} />
        <Uploader setRecipes={setRecipes} />
      </main>
    </div>
  );
}

export default App;
