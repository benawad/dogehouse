// @ts-ignore
import config from "../../.prettierrc.js";
import english from "../locales/en/translate.json";
import * as fs from "fs";
import { join } from "path";
import prettier from "prettier";
import { traverseTranslations } from "./traverseTranslations";
import { get, set } from "lodash";

const paths = traverseTranslations();

fs.readdirSync(join(__dirname, "../locales")).forEach((locale) => {
  if (locale === "en") {
    return;
  }
  const filename = join(
    __dirname,
    "../public/locales",
    locale,
    "translation.json"
  );
  let data: any;
  try {
    data = JSON.parse(fs.readFileSync(filename, { encoding: "utf-8" }));
  } catch (err) {
    throw new Error(`${locale}: ${err.message}`);
  }
  paths.forEach((p) => {
    if (get(data, p, null) === null) {
      set(data, p, get(english, p));
    }
  });

  fs.writeFileSync(
    filename,
    prettier.format(JSON.stringify(data), {
      parser: "json",
      useTabs: true,
      ...config,
    })
  );
});
