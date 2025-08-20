import React, { useState } from "react";

function PreferenceForm() {
  const [prefs, setPrefs] = useState("");

  const handleSave = () => {
    console.log("保存偏好:", prefs);
    // TODO: 调用后端 API
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">设置偏好</h2>
      <textarea
        placeholder="输入饮食偏好..."
        className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400"
        value={prefs}
        onChange={(e) => setPrefs(e.target.value)}
      />
      <button
        onClick={handleSave}
        className="w-full py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600"
      >
        保存偏好
      </button>
    </div>
  );
}

export default PreferenceForm;
