import React, { useState } from "react";
import "./RecipeDisplay.css";

function RecipeDisplay({ recipes }) {
  const [index, setIndex] = useState(0);

  if (!recipes || recipes.length === 0) {
    return <div className="recipe-empty">暂无推荐，请先上传食材</div>;
  }

  const recipe = recipes[index];

  const nextRecipe = () => {
    setIndex((prev) => (prev + 1) % recipes.length);
  };

  const prevRecipe = () => {
    setIndex((prev) => (prev - 1 + recipes.length) % recipes.length);
  };

  return (
    <div className="recipe-container">
      <h2>{recipe.name}</h2>

      <h3>食材</h3>
      <ul>
        {recipe.ingredients.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <h3>做法</h3>
      <ol>
        {recipe.steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>

      {recipe.nutrients && (
        <>
          <h3>营养信息</h3>
          <p>热量: {recipe.nutrients.calories}</p>
          <p>蛋白质: {recipe.nutrients.protein}</p>
          <p>脂肪: {recipe.nutrients.fat}</p>
        </>
      )}

      <div className="recipe-nav">
        <button onClick={prevRecipe}>上一道</button>
        <span>{index + 1} / {recipes.length}</span>
        <button onClick={nextRecipe}>下一道</button>
      </div>
    </div>
  );
}

export default RecipeDisplay;
