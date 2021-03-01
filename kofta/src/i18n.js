import i18n from 'i18next';
import Backend from 'i18next-http-backend';
//import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { __prod__ } from "./vscode-webview/constants";

i18n
  // import & load translations from -> /public/locales
  .use(Backend)
  // detect user language #TODO
  // https://github.com/i18next/i18next-browser-languageDetector
  //.use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // see opts @ https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: "en",
    debug: __prod__ ? false : true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    react: {
      useSuspense: false // fixes 'no fallback UI was specified' in react i18next when using hooks
    }
  });

export default i18n;
