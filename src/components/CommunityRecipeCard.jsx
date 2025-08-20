import React, { useState } from "react";
import { getText } from "../locales/translations";

function CommunityRecipeCard({ recipe, user, language, onInteraction }) {
  const [isLiked, setIsLiked] = useState(recipe.userInteractions?.like || false);
  const [isFavorited, setIsFavorited] = useState(recipe.userInteractions?.favorite || false);
  const [isTried, setIsTried] = useState(recipe.userInteractions?.try || false);

  const handleInteraction = async (type) => {
    if (!user) {
      alert(getText(language, "pleaseLogin"));
      return;
    }

    let newState;
    switch (type) {
      case 'like':
        newState = !isLiked;
        setIsLiked(newState);
        break;
      case 'favorite':
        newState = !isFavorited;
        setIsFavorited(newState);
        break;
      case 'try':
        newState = !isTried;
        setIsTried(newState);
        break;
      default:
        return;
    }

    try {
      await onInteraction(recipe.id, type, newState);
    } catch (error) {
      // 如果失败，恢复原状态
      switch (type) {
        case 'like':
          setIsLiked(!newState);
          break;
        case 'favorite':
          setIsFavorited(!newState);
          break;
        case 'try':
          setIsTried(!newState);
          break;
      }
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(language === "zh" ? "zh-CN" : "en-US");
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* 食谱图片 */}
      {recipe.imageUrl && (
        <div className="h-48 bg-gray-200 overflow-hidden">
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* 食谱信息 */}
      <div className="p-4">
        {/* 标题和作者 */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">
            {recipe.name}
          </h3>
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">👤</span>
            <span>{recipe.author?.username || getText(language, "anonymous")}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(recipe.createdAt)}</span>
          </div>
        </div>

        {/* 描述 */}
        {recipe.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {recipe.description}
          </p>
        )}

        {/* 基本信息 */}
        <div className="flex flex-wrap gap-2 mb-3">
          {recipe.cookingTime && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              ⏱️ {recipe.cookingTime}
            </span>
          )}
          {recipe.difficulty && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
              📊 {recipe.difficulty}
            </span>
          )}
          {recipe.servings && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              👥 {recipe.servings}
            </span>
          )}
        </div>

        {/* 标签 */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
            {recipe.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                +{recipe.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* 评分 */}
        {recipe.averageRating > 0 && (
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              {renderStars(recipe.averageRating)}
              <span className="text-sm font-semibold text-yellow-600">
                {recipe.averageRating}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              ({recipe.ratingCount} {getText(language, "ratings")})
            </span>
          </div>
        )}

        {/* 统计信息 */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-4">
            <span>👍 {recipe.likes}</span>
            <span>⭐ {recipe.favorites}</span>
            <span>👨‍🍳 {recipe.tryCount}</span>
          </div>
        </div>

        {/* 互动按钮 */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex space-x-2">
            <button
              onClick={() => handleInteraction('like')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
                isLiked
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span>{isLiked ? "❤️" : "🤍"}</span>
              <span>{getText(language, "like")}</span>
            </button>

            <button
              onClick={() => handleInteraction('favorite')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
                isFavorited
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span>{isFavorited ? "⭐" : "☆"}</span>
              <span>{getText(language, "favorite")}</span>
            </button>

            <button
              onClick={() => handleInteraction('try')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
                isTried
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span>{isTried ? "✅" : "👨‍🍳"}</span>
              <span>{getText(language, "try")}</span>
            </button>
          </div>

          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            {getText(language, "viewDetails")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommunityRecipeCard;
