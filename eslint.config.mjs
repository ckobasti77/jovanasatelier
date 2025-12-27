import nextConfig from "eslint-config-next";

const eslintConfig = [...nextConfig];

eslintConfig.push({
  // Extend default ignores with generated convex output.
  ignores: ["convex/_generated/**"],
});

export default eslintConfig;
