import React, { useState } from "react";
import api from "../api/axios";

function Uploader({ setRecipes }) {
  const [inputType, setInputType] = useState("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    try {
      if (inputType === "text") {
        const res = await api.post("/chat", { message: text });
        setRecipes((prev) => [...prev, res.data.reply]); // 自动追加推荐
        setText(""); // 清空输入框
      } else {
        const formData = new FormData();
        formData.append("image", file);
        const res = await api.post("/preference/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // 假设上传后也返回推荐内容
        if (res.data.reply) {
          setRecipes((prev) => [...prev, res.data.reply]);
        }
        setFile(null); // 清空选择的文件
      }
    } catch (err) {
      console.error(err);
      alert("上传失败，请检查控制台日志。");
    }
  };

  return (
    <section className="bg-white rounded-2xl p-6 shadow-md">
      <h2 className="text-lg font-semibold mb-4">上传食材</h2>

      <div className="flex space-x-4 mb-4">
        <button
          className={`px-3 py-1 rounded ${
            inputType === "text" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setInputType("text")}
        >
          输入文字
        </button>
        <button
          className={`px-3 py-1 rounded ${
            inputType === "image" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setInputType("image")}
        >
          上传图片
        </button>
      </div>

      {inputType === "text" ? (
        <textarea
          placeholder="请输入食材，如：鸡胸肉、西红柿..."
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
        提交
      </button>
    </section>
  );
}

export default Uploader;
