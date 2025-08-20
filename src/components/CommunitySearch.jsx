import React, { useState } from "react";
import { getText } from "../locales/translations";

function CommunitySearch({ onSearch, language }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const filters = {};
    if (difficulty) filters.difficulty = difficulty;
    onSearch(searchQuery, filters);
  };

  const handleClear = () => {
    setSearchQuery("");
    setDifficulty("");
    onSearch("", {});
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-md">
      <form onSubmit={handleSearch} className="space-y-4">
        {/* 搜索框 */}
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={getText(language, "searchRecipesPlaceholder")}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {getText(language, "search")}
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            {showFilters ? "✕" : "⚙️"}
          </button>
        </div>

        {/* 过滤器 */}
        {showFilters && (
          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                {getText(language, "difficulty")}:
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{getText(language, "allDifficulties")}</option>
                <option value="简单">{getText(language, "easy")}</option>
                <option value="中等">{getText(language, "medium")}</option>
                <option value="困难">{getText(language, "hard")}</option>
              </select>
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors"
              >
                {getText(language, "applyFilters")}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition-colors"
              >
                {getText(language, "clearAll")}
              </button>
            </div>
          </div>
        )}

        {/* 快速搜索建议 */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">{getText(language, "popularSearches")}:</span>
          {["中餐", "西餐", "素食", "快手菜", "甜点"].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                setSearchQuery(tag);
                onSearch(tag, {});
              }}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}

export default CommunitySearch;
