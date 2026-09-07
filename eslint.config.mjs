import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

// `next lint` used to skip build output for us; `eslint .` does not.
export default defineConfig([
  globalIgnores([".next/**", "out/**", "next-env.d.ts"]),
  {
    extends: [...nextCoreWebVitals, ...nextTypescript],
  },
]);
