import React, { useState } from "react";

function FoodInput() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = () => {
    if (file) {
      console.log("上传图片:", file.name);
      // TODO: 调用后端上传图片 API
    } else if (text.trim()) {
      console.log("输入食材:", text);
      // TODO: 调用后端 API
    } else {
      alert("请上传图片或输入文字");
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">上传食材</h2>

      {/* 输入文字 */}
      <input
        type="text"
        placeholder="输入食材名称 (如：鸡胸肉, 西兰花)"
        className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* 上传图片 */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                   file:rounded-full file:border-0 
                   file:text-sm file:font-semibold 
                   file:bg-green-50 file:text-green-700 
                   hover:file:bg-green-100"
      />

      {file && (
        <p className="text-gray-600 text-sm">已选择: {file.name}</p>
      )}

      {/* 提交按钮 */}
      <button
        onClick={handleSubmit}
        className="w-full py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600"
      >
        提交食材
      </button>
    </div>
  );
}

export default FoodInput;
