import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import isDate from "lodash/isDate";
import { __prod__ } from "./constants";

const DETECTION_OPTIONS = {
  order: ["localStorage", "navigator"],
};

function createDateFormatOptions(format: string): Intl.DateTimeFormatOptions {
  switch (format) {
    case "intlDate": {
      // EN returns 3/16/2021, 5:45 PM
      return {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
    }
    case "intlTime": {
      // EN returns 05:45 PM
      return {
        hour: "numeric",
        minute: "numeric",
      };
    }
    default: {
      // EN returns Tuesday, March 16, 2021, 5:45 PM
      return {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
    }
  }
}

export const init_i18n = () => {
  i18n
    // import & load translations from -> /public/locales
    .use(Backend)
    // https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // see opts @ https://www.i18next.com/overview/configuration-options
    .init({
      detection: DETECTION_OPTIONS,
      fallbackLng: "en",
      debug: !__prod__,
      interpolation: {
        escapeValue: false,
        format: (value, format, lng) => {
          return isDate(value) && format
            ? new Intl.DateTimeFormat(lng, createDateFormatOptions(format))
                .format(value)
                .toString()
            : value;
        },
      },
      react: {
        useSuspense: false, // fixes 'no fallback UI was specified' in react i18next when using hooks
      },
    });
};
