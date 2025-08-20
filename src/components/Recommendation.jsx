import React from "react";
import { getText } from "../locales/translations";

function Recommendation({ recipes, setRecipes, language }) {
  return (
    <section className="bg-black text-white rounded-2xl p-6 shadow-lg">
      <h2 className="text-lg font-semibold mb-4">{getText(language, "todayRecommendations")}</h2>

      {recipes.length === 0 ? (
        <p className="text-gray-400">{getText(language, "noRecommendations")}</p>
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
