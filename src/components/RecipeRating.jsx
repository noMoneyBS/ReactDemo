import React, { useState, useEffect } from "react";
import { getText } from "../locales/translations";
import api from "../api/axios";

function RecipeRating({ recipe, user, language, onRatingChange }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [tried, setTried] = useState(false);
  const [difficultyRating, setDifficultyRating] = useState(0);
  const [tasteRating, setTasteRating] = useState(0);
  const [healthRating, setHealthRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingRating, setExistingRating] = useState(null);
  const [averageRating, setAverageRating] = useState(null);

  // 加载现有评分
  useEffect(() => {
    if (recipe && user) {
      loadExistingRating();
      loadAverageRating();
    }
  }, [recipe, user]);

  const loadExistingRating = async () => {
    try {
      const response = await api.get(`/rating/user/${user.userId || user.id}/recipe/${encodeURIComponent(recipe.name)}`);
      if (response.data.rating) {
        const ratingData = response.data.rating;
        setRating(ratingData.rating);
        setComment(ratingData.comment || "");
        setTried(ratingData.tried);
        setDifficultyRating(ratingData.difficultyRating || 0);
        setTasteRating(ratingData.tasteRating || 0);
        setHealthRating(ratingData.healthRating || 0);
        setExistingRating(ratingData);
      }
    } catch (error) {
      console.log("没有找到现有评分");
    }
  };

  const loadAverageRating = async () => {
    try {
      const response = await api.get(`/rating/recipe/${encodeURIComponent(recipe.name)}/average`);
      setAverageRating(response.data.averageRating);
    } catch (error) {
      console.log("获取平均评分失败");
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert(getText(language, "pleaseRate"));
      return;
    }

    setIsSubmitting(true);
    try {
      const ratingData = {
        rating,
        comment: comment.trim() || null,
        tried,
        difficultyRating: difficultyRating || null,
        tasteRating: tasteRating || null,
        healthRating: healthRating || null
      };

      const response = await api.post("/rating/add", {
        userId: user.userId || user.id,
        recipeData: recipe,
        ratingData
      });

      if (response.data.success) {
        alert(getText(language, "ratingSubmitted"));
        setExistingRating(ratingData);
        if (onRatingChange) {
          onRatingChange(ratingData);
        }
        // 重新加载平均评分
        loadAverageRating();
      }
    } catch (error) {
      console.error("提交评分失败:", error);
      alert(getText(language, "ratingFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (value, onChange, size = "text-xl") => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange(star)}
            className={`${size} ${
              star <= value ? "text-yellow-400" : "text-gray-300"
            } hover:text-yellow-400 transition-colors`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  const renderRatingSection = (title, value, onChange, description) => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{title}</span>
        <span className="text-sm text-gray-500">{value}/5</span>
      </div>
      {renderStars(value, onChange, "text-lg")}
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-yellow-500">⭐</span>
        {getText(language, "rateRecipe")}
      </h3>

      {/* 平均评分显示 */}
      {averageRating && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {getText(language, "averageRating")}
            </span>
            <div className="flex items-center space-x-2">
              {renderStars(averageRating.averageRating, () => {}, "text-sm")}
              <span className="text-sm font-semibold text-blue-600">
                {averageRating.averageRating}/5
              </span>
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            {getText(language, "basedOn")} {averageRating.totalRatings} {getText(language, "ratings")}
          </p>
        </div>
      )}

      {/* 总体评分 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-medium text-gray-800">
            {getText(language, "overallRating")}
          </span>
          <span className="text-lg font-semibold text-yellow-600">{rating}/5</span>
        </div>
        {renderStars(rating, setRating)}
      </div>

      {/* 详细评分 */}
      <div className="space-y-4 mb-6">
        {renderRatingSection(
          getText(language, "tasteRating"),
          tasteRating,
          setTasteRating,
          getText(language, "tasteRatingDesc")
        )}
        
        {renderRatingSection(
          getText(language, "difficultyRating"),
          difficultyRating,
          setDifficultyRating,
          getText(language, "difficultyRatingDesc")
        )}
        
        {renderRatingSection(
          getText(language, "healthRating"),
          healthRating,
          setHealthRating,
          getText(language, "healthRatingDesc")
        )}
      </div>

      {/* 尝试状态 */}
      <div className="mb-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={tried}
            onChange={(e) => setTried(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            {getText(language, "triedThisRecipe")}
          </span>
        </label>
      </div>

      {/* 评论 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {getText(language, "comment")} ({getText(language, "optional")})
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={getText(language, "commentPlaceholder")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={3}
        />
      </div>

      {/* 提交按钮 */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || rating === 0}
          className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <span className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>{getText(language, "submitting")}</span>
            </span>
          ) : (
            existingRating ? getText(language, "updateRating") : getText(language, "submitRating")
          )}
        </button>
      </div>

      {/* 现有评分提示 */}
      {existingRating && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            {getText(language, "existingRatingNote")}
          </p>
        </div>
      )}
    </div>
  );
}

export default RecipeRating;
