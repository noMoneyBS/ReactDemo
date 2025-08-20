import React, { useState } from "react";

function RecipeContainer() {
  const [recipe, setRecipe] = useState("");
  const [index, setIndex] = useState(0);

  const prevRecipe = () => {
    console.log("上一个");
    setIndex((i) => Math.max(i - 1, 0));
  };

  const nextRecipe = () => {
    console.log("下一个");
    setIndex((i) => i + 1);
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">推荐菜谱</h2>
      {recipe ? (
        <div className="mt-3 whitespace-pre-line text-gray-800">{recipe}</div>
      ) : (
        <p className="text-gray-500">请先登录并设置偏好，然后提交食材。</p>
      )}
      <div className="flex justify-between">
        <button
          onClick={prevRecipe}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          上一个
        </button>
        <button
          onClick={nextRecipe}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          下一个
        </button>
      </div>
    </div>
  );
}

export default RecipeContainer;
