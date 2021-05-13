module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      2,
      "always",
      [
        "global",
        "baklava",
        "dinner",
        "kibbeh",
        "kousa",
        "pilaf",
        "shawarma",
        "kebab",
        "dolma",
        "globalkey"
      ],
    ],
  },
};
