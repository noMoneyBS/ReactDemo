import React, { useState, useEffect } from "react";
import { getText } from "../locales/translations";
import api from "../api/axios";
import CommunityRecipeCard from "./CommunityRecipeCard";
import CommunitySearch from "./CommunitySearch";

function Community({ user, language }) {
  const [activeTab, setActiveTab] = useState("latest");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState({});

  useEffect(() => {
    loadRecipes();
  }, [activeTab, searchQuery, searchFilters]);

  const loadRecipes = async () => {
    setLoading(true);
    try {
      let response;
      
      if (searchQuery) {
        // 搜索食谱
        const params = new URLSearchParams({
          q: searchQuery,
          page: 1,
          limit: 20,
          ...searchFilters
        });
        response = await api.get(`/community/search?${params}`);
      } else {
        // 根据标签获取食谱
        switch (activeTab) {
          case "latest":
            response = await api.get("/community/latest?limit=20");
            break;
          case "popular":
            response = await api.get("/community/popular?limit=20");
            break;
          case "all":
            response = await api.get("/community/recipes?limit=20");
            break;
          default:
            response = await api.get("/community/latest?limit=20");
        }
      }

      if (response.data.success) {
        setRecipes(response.data.recipes || []);
      }
    } catch (error) {
      console.error("加载社区食谱失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query, filters) => {
    setSearchQuery(query);
    setSearchFilters(filters);
  };

  const handleRecipeInteraction = async (recipeId, interactionType, isActive) => {
    try {
      await api.post(`/community/recipes/${recipeId}/interact`, {
        userId: user.userId || user.id,
        interactionType,
        isActive
      });
      
      // 重新加载食谱以更新统计数据
      loadRecipes();
    } catch (error) {
      console.error("互动失败:", error);
    }
  };

  const renderTabButton = (tab, label, icon) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 rounded-lg transition-colors ${
        activeTab === tab
          ? "bg-blue-500 text-white"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🍽️ {getText(language, "community")}
        </h1>
        <p className="text-gray-600">
          {getText(language, "communityDescription")}
        </p>
      </div>

      {/* 搜索栏 */}
      <CommunitySearch 
        onSearch={handleSearch}
        language={language}
      />

      {/* 标签页 */}
      <div className="bg-white rounded-xl p-4 shadow-md">
        <div className="flex flex-wrap gap-2 mb-4">
          {renderTabButton("latest", getText(language, "latestRecipes"), "🆕")}
          {renderTabButton("popular", getText(language, "popularRecipes"), "🔥")}
          {renderTabButton("all", getText(language, "allRecipes"), "📋")}
        </div>
        
        {/* 搜索结果提示 */}
        {searchQuery && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-blue-700">
              🔍 {getText(language, "searchResultsFor")}: "{searchQuery}"
              <button
                onClick={() => setSearchQuery("")}
                className="ml-2 text-blue-500 hover:text-blue-700 underline"
              >
                {getText(language, "clearSearch")}
              </button>
            </p>
          </div>
        )}
      </div>

      {/* 食谱列表 */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">{getText(language, "loading")}</span>
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <CommunityRecipeCard
                key={recipe.id}
                recipe={recipe}
                user={user}
                language={language}
                onInteraction={handleRecipeInteraction}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchQuery ? getText(language, "noSearchResults") : getText(language, "noCommunityRecipes")}
            </h3>
            <p className="text-gray-500">
              {searchQuery 
                ? getText(language, "tryDifferentKeywords")
                : getText(language, "beFirstToShare")
              }
            </p>
          </div>
        )}
      </div>

      {/* 分享提示 */}
      {!searchQuery && recipes.length > 0 && (
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">
            {getText(language, "shareYourRecipe")}
          </h3>
          <p className="text-green-100 mb-4">
            {getText(language, "shareRecipeDescription")}
          </p>
          <button className="px-6 py-2 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors">
            {getText(language, "shareNow")}
          </button>
        </div>
      )}
    </div>
  );
}

export default Community;
