import React, { useState, useRef, useEffect } from "react";
import { getText } from "../locales/translations";
import api from "../api/axios";

function InteractiveChat({ user, language, onRecipesGenerated }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationState, setConversationState] = useState({ state: "initial" });
  const messagesEndRef = useRef(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 发送消息
  const sendMessage = async (message) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await api.post("/interactive/chat", {
        userId: user?.userId || user?.id || "testUser123",
        message: message,
        language: language,
        conversationState: conversationState
      });

      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: response.data.message,
        options: response.data.options || [],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setConversationState({ state: response.data.state, data: response.data.data });

      // 如果生成了食谱，通知父组件
      if (response.data.type === "recipes") {
        try {
          const recipes = JSON.parse(response.data.recipes);
          onRecipesGenerated(recipes);
        } catch (error) {
          console.error("解析食谱失败:", error);
        }
      }

    } catch (error) {
      console.error("发送消息失败:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: "error",
        content: getText(language, "chatError"),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理选项点击
  const handleOptionClick = (option) => {
    sendMessage(option.label);
  };

  // 处理表单提交
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoading && inputValue.trim()) {
      sendMessage(inputValue);
    }
  };

  // 渲染消息
  const renderMessage = (message) => {
    return (
      <div
        key={message.id}
        className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} mb-4`}
      >
        <div
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
            message.type === "user"
              ? "bg-blue-500 text-white"
              : message.type === "error"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          <p className="text-sm">{message.content}</p>
          {message.options && message.options.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className="block w-full text-left px-3 py-2 bg-white rounded border hover:bg-gray-50 transition-colors"
                >
                  <span className="mr-2">{option.emoji}</span>
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* 聊天头部 */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4">
        <h2 className="text-lg font-semibold flex items-center">
          <span className="mr-2">🤖</span>
          {getText(language, "interactiveChat")}
        </h2>
        <p className="text-sm opacity-90">
          {getText(language, "chatDescription")}
        </p>
      </div>

      {/* 消息列表 */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">👋</div>
            <p>{getText(language, "chatWelcome")}</p>
            <p className="text-sm mt-2">{getText(language, "chatHint")}</p>
          </div>
        ) : (
          messages.map(renderMessage)
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                <span className="text-sm">{getText(language, "thinking")}</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 输入框 */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={getText(language, "chatInputPlaceholder")}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {getText(language, "send")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default InteractiveChat;
