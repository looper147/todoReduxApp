// npx expo install expo-localization i18n-js
import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";

//save device current lang and direction
export const deviceLanguage = getLocales()[0].languageCode;
export let textDirection = getLocales()[0].textDirection;

//initialize i18n
export const i18n = new I18n({});

//load translation for a specific lang
const loadTranslation = async (langCode: string) => {
  switch (langCode) {
    case "en":
      return require("../../lang/en.json");
    case "ar":
      return require("../../lang/ar.json");
    default:
      return require("../../lang/en.json");
  }
};

// function to set the lang and load translations aynchronously
export const setLanguage = async (languageCode: string) => {
  i18n.locale = languageCode;
  //change text direction to new locale text direction
  textDirection =
    getLocales().find((locale) => locale.languageCode === languageCode)
      ?.textDirection || null;
  const translations = await loadTranslation(languageCode);
  if (translations) {
    i18n.translations[languageCode] = translations;
  }
};

i18n.enableFallback = true;
// initialize language
setLanguage(deviceLanguage);
