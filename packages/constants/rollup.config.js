import typescript from "rollup-plugin-typescript2"
import babel from "rollup-plugin-babel"
import { DEFAULT_EXTENSIONS } from "@babel/core"
import pkg from "./package.json"

const extensions = [...DEFAULT_EXTENSIONS, ".ts", ".tsx"]

/**
 * @type InputOptions
 */
export default {
  input: "./src/index.ts",
  plugins: [
    typescript(),
    babel({ include: "src/**/*", extensions, externalHelpers: true })
  ],
  external: [...Object.keys(pkg.peerDependencies || []), ...Object.keys(pkg.dependencies || [])],
  preserveModules: true,
  output: [
    {
      dir: "dist/es",
      format: "es"
    },
    {
      dir: "dist/cjs",
      format: "cjs"
    }
  ]
}
