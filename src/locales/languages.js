// 前端语言配置
export const languages = [
  { code: "zh", name: "中文", flag: "🇨🇳", nativeName: "中文" },
  { code: "en", name: "English", flag: "🇺🇸", nativeName: "English" },
  { code: "ja", name: "日本語", flag: "🇯🇵", nativeName: "日本語" },
  { code: "ko", name: "한국어", flag: "🇰🇷", nativeName: "한국어" },
  { code: "fr", name: "Français", flag: "🇫🇷", nativeName: "Français" },
  { code: "de", name: "Deutsch", flag: "🇩🇪", nativeName: "Deutsch" },
  { code: "es", name: "Español", flag: "🇪🇸", nativeName: "Español" },
  { code: "it", name: "Italiano", flag: "🇮🇹", nativeName: "Italiano" },
];

// 获取语言信息
export function getLanguageInfo(code) {
  return languages.find(lang => lang.code === code) || languages[0];
}

// 获取支持的语言列表
export function getSupportedLanguages() {
  return languages;
}
