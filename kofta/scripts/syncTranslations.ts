// @ts-ignore
import config from "../../.prettierrc.js";
import english from "../public/locales/en/translation.json";
import * as fse from "fs-extra";
import * as fs from "fs";
import { join } from "path";
import prettier from "prettier";
import { traverseTranslations } from "./traverseTranslations";
import { get, set } from "lodash";

const paths = traverseTranslations();

fs.readdirSync(join(__dirname, "../public/locales")).forEach((locale) => {
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

fs.rmdirSync(join(__dirname, "../../kibbeh/public/locales"), {
  recursive: true,
});
fs.unlinkSync(join(__dirname, "../../kibbeh/src/generated/translationKeys.ts"));
fs.copyFileSync(
  join(__dirname, "../src/generated/translationKeys.ts"),
  join(__dirname, "../../kibbeh/src/generated/translationKeys.ts")
);
fse.copySync(
  join(__dirname, "../public/locales"),
  join(__dirname, "../../kibbeh/public/locales")
);
