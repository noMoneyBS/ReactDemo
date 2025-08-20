// 语言管理工具
import { getLanguageInfo } from './languages';
import { getText } from './translations';

// 语言管理器类
class LanguageManager {
  constructor() {
    this.currentLanguage = 'zh'; // 默认中文
    this.listeners = [];
  }

  // 设置当前语言
  setLanguage(languageCode) {
    this.currentLanguage = languageCode;
    this.notifyListeners();
    
    // 保存到localStorage
    localStorage.setItem('preferredLanguage', languageCode);
  }

  // 获取当前语言
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  // 获取当前语言信息
  getCurrentLanguageInfo() {
    return getLanguageInfo(this.currentLanguage);
  }

  // 初始化语言（从localStorage或浏览器设置）
  initLanguage() {
    // 优先使用localStorage中保存的语言
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      this.currentLanguage = savedLanguage;
      return;
    }

    // 如果没有保存的语言，尝试从浏览器设置获取
    const browserLanguage = navigator.language || navigator.userLanguage;
    if (browserLanguage) {
      const langCode = browserLanguage.split('-')[0];
      // 检查是否支持该语言
      const supportedLanguages = ['zh', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'it'];
      if (supportedLanguages.includes(langCode)) {
        this.currentLanguage = langCode;
      }
    }
  }

  // 获取翻译文本
  t(key) {
    return getText(this.currentLanguage, key);
  }

  // 添加语言变化监听器
  addListener(callback) {
    this.listeners.push(callback);
  }

  // 移除语言变化监听器
  removeListener(callback) {
    const index = this.listeners.indexOf(callback);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  // 通知所有监听器
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.currentLanguage));
  }
}

// 创建全局语言管理器实例
const languageManager = new LanguageManager();

// 初始化语言
languageManager.initLanguage();

export default languageManager;
