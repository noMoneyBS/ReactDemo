import React, { useState } from "react";
import { getText } from "../locales/translations";
import api from "../api/axios";

function RecipeDisplay({ recipes, language, user }) {
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [isSelecting, setIsSelecting] = useState(false);

  if (!recipes || recipes.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-md text-center">
        <div className="text-gray-500 text-lg mb-4">🍽️</div>
        <p className="text-gray-600">{getText(language, "noRecommendations")}</p>
      </div>
    );
  }

  const currentRecipe = recipes[currentRecipeIndex];

  const goToPrevious = () => {
    setCurrentRecipeIndex((prev) => (prev > 0 ? prev - 1 : recipes.length - 1));
  };

  const goToNext = () => {
    setCurrentRecipeIndex((prev) => (prev < recipes.length - 1 ? prev + 1 : 0));
  };

  // 选择当前食谱
  const selectCurrentRecipe = async () => {
    if (!user) {
      alert("请先登录");
      return;
    }

    setIsSelecting(true);
    try {
      const userId = user?.userId || user?.id;
      const selectedRecipe = recipes[currentRecipeIndex];
      
      const response = await api.post("/preference/select", {
        userId,
        selectedRecipe,
        allRecipes: recipes
      });

      if (response.data.success) {
        alert(`✅ ${getText(language, "preferenceRecorded")}`);
      }
    } catch (error) {
      console.error("选择食谱失败:", error);
      alert(`❌ ${getText(language, "preferenceFailed")}`);
    } finally {
      setIsSelecting(false);
    }
  };

  // 获取难度等级的颜色
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
      case '简单':
        return 'bg-green-100 text-green-800';
      case 'medium':
      case '中等':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
      case '困难':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* 食谱头部信息 */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{currentRecipe.name}</h1>
            {currentRecipe.description && (
              <p className="text-orange-100 text-sm">{currentRecipe.description}</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-3xl">🍳</div>
          </div>
        </div>
        
        {/* 食谱基本信息 */}
        <div className="flex flex-wrap gap-4 text-sm">
          {currentRecipe.cookingTime && (
            <div className="flex items-center gap-1">
              <span>⏱️</span>
              <span>{currentRecipe.cookingTime}</span>
            </div>
          )}
          {currentRecipe.difficulty && (
            <div className="flex items-center gap-1">
              <span>📊</span>
              <span>{currentRecipe.difficulty}</span>
            </div>
          )}
          {currentRecipe.servings && (
            <div className="flex items-center gap-1">
              <span>👥</span>
              <span>{currentRecipe.servings}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 标签 */}
        {currentRecipe.tags && currentRecipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {currentRecipe.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 食材部分 */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="text-green-600">🥬</span>
            {getText(language, "ingredients")}
          </h2>
          <div className="grid gap-2">
            {Array.isArray(currentRecipe.ingredients) ? (
              currentRecipe.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-white rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">{ingredient.name || ingredient}</span>
                  {ingredient.amount && (
                    <span className="text-gray-600 text-sm ml-auto">{ingredient.amount}</span>
                  )}
                  {ingredient.notes && (
                    <span className="text-gray-500 text-xs italic">({ingredient.notes})</span>
                  )}
                </div>
              ))
            ) : (
              // 兼容旧格式
              currentRecipe.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-white rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{ingredient}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 步骤部分 */}
        <div className="bg-blue-50 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="text-blue-600">👨‍🍳</span>
            {getText(language, "steps")}
          </h2>
          <div className="space-y-3">
            {Array.isArray(currentRecipe.steps) ? (
              currentRecipe.steps.map((step, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step || index + 1}
                  </div>
                  <div className="flex-1 bg-white rounded-lg p-3">
                    <p className="text-gray-800">{step.instruction || step}</p>
                    {step.time && (
                      <p className="text-gray-500 text-sm mt-1">⏱️ {step.time}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              // 兼容旧格式
              currentRecipe.steps.map((step, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 bg-white rounded-lg p-3">
                    <p className="text-gray-800">{step}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 营养信息 */}
        <div className="bg-purple-50 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="text-purple-600">📊</span>
            {getText(language, "nutrition")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(currentRecipe.nutrition || currentRecipe.nutrients || {}).map(([key, value]) => (
              <div key={key} className="bg-white rounded-lg p-3 text-center">
                <div className="text-sm text-gray-600 capitalize">{key}</div>
                <div className="font-semibold text-purple-600">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 烹饪小贴士 */}
        {currentRecipe.tips && currentRecipe.tips.length > 0 && (
          <div className="bg-yellow-50 rounded-xl p-4">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-yellow-600">💡</span>
              {getText(language, "cookingTips")}
            </h2>
            <div className="space-y-2">
              {currentRecipe.tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  <p className="text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 导航控制 */}
      <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
        <button
          onClick={goToPrevious}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          {getText(language, "previous")}
        </button>
        
        <div className="text-center">
          <div className="text-sm text-gray-600">
            {currentRecipeIndex + 1} / {recipes.length}
          </div>
          <div className="text-xs text-gray-500">
            {getText(language, "recipe")}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={selectCurrentRecipe}
            disabled={isSelecting}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isSelecting ? getText(language, "selecting") : getText(language, "selectRecipe")}
          </button>
          
          <button
            onClick={goToNext}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            {getText(language, "next")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecipeDisplay;
