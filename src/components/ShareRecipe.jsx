import React, { useState } from "react";
import { getText } from "../locales/translations";
import api from "../api/axios";
import RecipeRating from "./RecipeRating";

function ShareRecipe({ recipe, user, language, onShareSuccess, onCancel }) {
  const [isSharing, setIsSharing] = useState(false);
  const [shareData, setShareData] = useState({
    description: recipe.description || "",
    tags: recipe.tags ? recipe.tags.join(", ") : "",
    isPublic: true
  });
  const [authorRating, setAuthorRating] = useState({
    rating: 0,
    comment: "",
    tried: true
  });

  const handleShare = async () => {
    if (!user) {
      alert(getText(language, "pleaseLogin"));
      return;
    }

    if (authorRating.rating === 0) {
      alert(getText(language, "pleaseRateRecipe"));
      return;
    }

    setIsSharing(true);
    try {
      // 准备分享数据
      const recipeData = {
        ...recipe,
        description: shareData.description,
        tags: shareData.tags.split(",").map(tag => tag.trim()).filter(tag => tag)
      };

      const response = await api.post("/community/share", {
        authorId: user.userId || user.id,
        recipeData,
        authorRating: authorRating.rating > 0 ? authorRating : null
      });

      if (response.data.success) {
        alert(getText(language, "recipeSharedSuccessfully"));
        if (onShareSuccess) {
          onShareSuccess(response.data.recipe);
        }
      }
    } catch (error) {
      console.error("分享食谱失败:", error);
      alert(getText(language, "shareRecipeFailed"));
    } finally {
      setIsSharing(false);
    }
  };

  const handleInputChange = (field, value) => {
    setShareData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          📤 {getText(language, "shareRecipe")}
        </h2>
        <p className="text-gray-600">
          {getText(language, "shareRecipeDescription")}
        </p>
      </div>

      {/* 食谱预览 */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-800 mb-2">
          {getText(language, "recipePreview")}
        </h3>
        <div className="space-y-2 text-sm">
          <div><strong>{getText(language, "name")}:</strong> {recipe.name}</div>
          <div><strong>{getText(language, "cookingTime")}:</strong> {recipe.cookingTime}</div>
          <div><strong>{getText(language, "difficulty")}:</strong> {recipe.difficulty}</div>
          <div><strong>{getText(language, "ingredients")}:</strong> {recipe.ingredients.length} {getText(language, "items")}</div>
          <div><strong>{getText(language, "steps")}:</strong> {recipe.steps.length} {getText(language, "steps")}</div>
        </div>
      </div>

      {/* 分享设置 */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {getText(language, "description")} ({getText(language, "optional")})
          </label>
          <textarea
            value={shareData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder={getText(language, "descriptionPlaceholder")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {getText(language, "tags")} ({getText(language, "optional")})
          </label>
          <input
            type="text"
            value={shareData.tags}
            onChange={(e) => handleInputChange("tags", e.target.value)}
            placeholder={getText(language, "tagsPlaceholder")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            {getText(language, "tagsHelp")}
          </p>
        </div>

        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={shareData.isPublic}
              onChange={(e) => handleInputChange("isPublic", e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              {getText(language, "makePublic")}
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-1">
            {getText(language, "publicHelp")}
          </p>
        </div>
      </div>

      {/* 作者评分 */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">
          ⭐ {getText(language, "yourRating")}
        </h3>
        <RecipeRating
          recipe={recipe}
          user={user}
          language={language}
          onRatingChange={setAuthorRating}
          isAuthorRating={true}
        />
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          {getText(language, "cancel")}
        </button>
        <button
          onClick={handleShare}
          disabled={isSharing || authorRating.rating === 0}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSharing ? (
            <span className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>{getText(language, "sharing")}</span>
            </span>
          ) : (
            getText(language, "shareToCommunity")
          )}
        </button>
      </div>

      {/* 分享提示 */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          💡 {getText(language, "shareTip")}
        </p>
      </div>
    </div>
  );
}

export default ShareRecipe;
