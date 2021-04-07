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
        "feta",
        "kibbeh",
        "kofta",
        "kousa",
        "pilaf",
        "shawarma",
      ],
    ],
  },
};
