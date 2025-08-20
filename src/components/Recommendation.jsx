import React from "react";

function Recommendation({ recipes, setRecipes }) {
  return (
    <section className="bg-black text-white rounded-2xl p-6 shadow-lg">
      <h2 className="text-lg font-semibold mb-4">今日推荐食谱</h2>

      {recipes.length === 0 ? (
        <p className="text-gray-400">还没有推荐，请在下方上传食材获取。</p>
      ) : (
        <ul className="space-y-2">
          {recipes.map((item, idx) => (
            <li
              key={idx}
              className="bg-gray-800 rounded-lg p-3 shadow-md hover:bg-gray-700"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default Recommendation;
