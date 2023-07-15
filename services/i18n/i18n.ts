// npx expo install expo-localization i18n-js
import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import en from "../../lang/en";
import ar from "../../lang/ar";
export const deviceLanguage = getLocales()[0].languageCode;
export const textDirection = getLocales()[0].textDirection;
export const i18n = new I18n({ en, ar });

//setting locale
i18n.locale = deviceLanguage;

// When a value is missing from a language it'll fall back to another language with the key present.
i18n.enableFallback = true;

export const t = i18n.t;
