import React, { useState, useEffect } from "react";
import { getText } from "../locales/translations";
import api from "../api/axios";

function RatingHistory({ user, language }) {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("history");

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [historyRes, statsRes] = await Promise.all([
        api.get(`/rating/user/${user.userId || user.id}/history`),
        api.get(`/rating/user/${user.userId || user.id}/stats`)
      ]);

      setHistory(historyRes.data.history);
      setStats(statsRes.data.stats);
    } catch (error) {
      console.error("加载评分数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating, size = "text-sm") => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${size} ${
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

  const renderHistoryTab = () => (
    <div className="space-y-4">
      {history.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📝</div>
          <p>{getText(language, "noRatingHistory")}</p>
        </div>
      ) : (
        history.map((rating) => (
          <div key={rating.id} className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-800">{rating.recipeName}</h4>
              <div className="flex items-center space-x-2">
                {renderStars(rating.rating)}
                <span className="text-sm font-semibold text-yellow-600">
                  {rating.rating}/5
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
              <span>{formatDate(rating.updatedAt)}</span>
              {rating.tried && (
                <span className="flex items-center space-x-1 text-green-600">
                  <span>✓</span>
                  <span>{getText(language, "tried")}</span>
                </span>
              )}
            </div>

            {rating.comment && (
              <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                "{rating.comment}"
              </p>
            )}

            {/* 详细评分 */}
            {(rating.difficultyRating || rating.tasteRating || rating.healthRating) && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-4 text-xs">
                  {rating.difficultyRating && (
                    <div>
                      <span className="text-gray-500">{getText(language, "difficulty")}: </span>
                      {renderStars(rating.difficultyRating, "text-xs")}
                    </div>
                  )}
                  {rating.tasteRating && (
                    <div>
                      <span className="text-gray-500">{getText(language, "taste")}: </span>
                      {renderStars(rating.tasteRating, "text-xs")}
                    </div>
                  )}
                  {rating.healthRating && (
                    <div>
                      <span className="text-gray-500">{getText(language, "health")}: </span>
                      {renderStars(rating.healthRating, "text-xs")}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  const renderStatsTab = () => {
    if (!stats) return null;

    return (
      <div className="space-y-6">
        {/* 总体统计 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalRatings}</div>
            <div className="text-sm text-blue-700">{getText(language, "totalRatings")}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.averageRating}</div>
            <div className="text-sm text-green-700">{getText(language, "averageRating")}</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.triedCount}</div>
            <div className="text-sm text-yellow-700">{getText(language, "triedRecipes")}</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {stats.totalRatings > 0 ? Math.round((stats.triedCount / stats.totalRatings) * 100) : 0}%
            </div>
            <div className="text-sm text-purple-700">{getText(language, "tryRate")}</div>
          </div>
        </div>

        {/* 评分分布 */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h4 className="font-semibold mb-3">{getText(language, "ratingDistribution")}</h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-16">
                  <span className="text-sm">{star}</span>
                  <span className="text-yellow-400">★</span>
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${stats.totalRatings > 0 ? (stats.ratingDistribution[star] / stats.totalRatings) * 100 : 0}%`
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">
                  {stats.ratingDistribution[star] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 最喜欢的食材 */}
        {Object.keys(stats.favoriteIngredients).length > 0 && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold mb-3">{getText(language, "favoriteIngredients")}</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.favoriteIngredients)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .map(([ingredient, count]) => (
                  <span
                    key={ingredient}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {ingredient} ({count})
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* 最喜欢的标签 */}
        {Object.keys(stats.favoriteTags).length > 0 && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold mb-3">{getText(language, "favoriteTags")}</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.favoriteTags)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .map(([tag, count]) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {tag} ({count})
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* 最近活动 */}
        {stats.recentActivity.length > 0 && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold mb-3">{getText(language, "recentActivity")}</h4>
            <div className="space-y-2">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-700">{activity.recipeName}</span>
                  <div className="flex items-center space-x-2">
                    {renderStars(activity.rating, "text-xs")}
                    <span className="text-gray-500">{formatDate(activity.updatedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">{getText(language, "loading")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md">
      {/* 标签页 */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab("history")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "history"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {getText(language, "ratingHistory")}
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "stats"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {getText(language, "statistics")}
          </button>
        </nav>
      </div>

      {/* 内容区域 */}
      <div className="p-6">
        {activeTab === "history" ? renderHistoryTab() : renderStatsTab()}
      </div>
    </div>
  );
}

export default RatingHistory;
