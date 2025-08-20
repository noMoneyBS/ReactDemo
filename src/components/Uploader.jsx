import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { getText } from "../locales/translations";

function Uploader({ setRecipes, user, language }) {
  const [inputType, setInputType] = useState("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [imageRecognitionAvailable, setImageRecognitionAvailable] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(true);

  // 检查图片识别功能是否可用
  useEffect(() => {
    const checkImageRecognition = async () => {
      try {
        const response = await api.get("/image/availability");
        setImageRecognitionAvailable(response.data.available);
      } catch (error) {
        console.log("图片识别功能不可用:", error.message);
        setImageRecognitionAvailable(false);
      } finally {
        setLoadingAvailability(false);
      }
    };

    checkImageRecognition();
  }, []);

  const handleUpload = async () => {
    try {
      if (inputType === "text") {
        // 使用登录用户的ID
        const userId = user?.userId || user?.id || "testUser123";
        const res = await api.post("/chat", { 
          message: text,
          userId: userId,
          language: language
        });
        
        // 解析返回的JSON字符串
        let parsedRecipes = [];
        try {
          console.log("🔧 前端收到的原始数据:", res.data);
          parsedRecipes = JSON.parse(res.data.recipes);
          console.log("🔧 解析后的食谱数据:", parsedRecipes);
        } catch (parseError) {
          console.error("解析食谱数据失败:", parseError);
          console.error("原始数据:", res.data.recipes);
          alert(getText(language, "parseError"));
          return;
        }
        
        setRecipes(parsedRecipes); // 替换为新的食谱推荐
        setText(""); // 清空输入框
      } else {
        // 图片识别功能
        const formData = new FormData();
        formData.append("image", file);
        formData.append("language", language);
        
        // 先识别图片中的食材
        const recognitionRes = await api.post("/image/recognize", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        
        if (recognitionRes.data.success) {
          const recognizedIngredients = recognitionRes.data.ingredients;
          const ingredientsText = recognizedIngredients.map(ing => ing.name).join("、");
          
          // 显示识别结果
          alert(`${getText(language, "imageRecognitionSuccess")}${ingredientsText}`);
          
          // 使用识别到的食材生成食谱推荐
          const userId = user?.userId || user?.id || "testUser123";
          const res = await api.post("/chat", { 
            message: ingredientsText,
            userId: userId,
            language: language
          });
          
          // 解析返回的JSON字符串
          let parsedRecipes = [];
          try {
            parsedRecipes = JSON.parse(res.data.recipes);
          } catch (parseError) {
            console.error("解析食谱数据失败:", parseError);
            alert(getText(language, "parseError"));
            return;
          }
          
          setRecipes(parsedRecipes);
        } else {
          alert(getText(language, "imageRecognitionFailed"));
        }
        
        setFile(null); // 清空选择的文件
      }
    } catch (err) {
      console.error(err);
      alert(getText(language, "uploadFailed"));
    }
  };

  return (
    <section className="bg-white rounded-2xl p-6 shadow-md">
      <h2 className="text-lg font-semibold mb-4">{getText(language, "uploadIngredients")}</h2>

      <div className="flex space-x-4 mb-4">
        <button
          className={`px-3 py-1 rounded ${
            inputType === "text" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setInputType("text")}
        >
          {getText(language, "inputText")}
        </button>
        
        {loadingAvailability ? (
          <button className="px-3 py-1 rounded bg-gray-300 text-gray-500" disabled>
            {getText(language, "checkingAvailability")}
          </button>
        ) : imageRecognitionAvailable ? (
          <button
            className={`px-3 py-1 rounded ${
              inputType === "image" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setInputType("image")}
          >
            {getText(language, "uploadImage")}
          </button>
        ) : (
          <button className="px-3 py-1 rounded bg-gray-300 text-gray-500" disabled title={getText(language, "imageRecognitionUnavailable")}>
            📷 {getText(language, "uploadImage")} ({getText(language, "imageRecognitionUnavailable")})
          </button>
        )}
      </div>

      {inputType === "text" ? (
        <textarea
          placeholder={getText(language, "ingredientsPlaceholder")}
          className="w-full border rounded p-2 mb-4"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      ) : (
        <input
          type="file"
          accept="image/*"
          className="w-full mb-4"
          onChange={(e) => setFile(e.target.files[0])}
        />
      )}

      <button
        onClick={handleUpload}
        className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
      >
        {getText(language, "submit")}
      </button>
    </section>
  );
}

export default Uploader;
