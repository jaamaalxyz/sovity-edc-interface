const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      "node_modules/",
      ".next/",
      "out/",
      "dist/",
      "build/",
      "coverage/",
      ".env*",
      "*.log",
      ".cache/",
      ".parcel-cache/",
      ".vscode/",
      ".idea/",
      "*.swp",
      "*.swo",
      ".DS_Store",
      ".platform/",
      "src/config/ssl-certificate/",
      "scripts/",
      "buildspec.yml",
      "server.js",
      "cluster.js",
      "next.config.js",
      "jest.config.js",
      "jest.setup.js",
      "prettier.config.js",
      "jsconfig.json",
      "public/",
    ],
  },
  ...compat.extends("next/core-web-vitals", "plugin:prettier/recommended"),
  {
    plugins: {
      "simple-import-sort": require("eslint-plugin-simple-import-sort"),
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  ...compat.extends("plugin:tailwindcss/recommended"),
  {
    files: ["**/__tests__/**/*", "**/*.test.*", "**/*.spec.*"],
    rules: {
      "tailwindcss/no-custom-classname": "off",
    },
  },
];

module.exports = eslintConfig;
