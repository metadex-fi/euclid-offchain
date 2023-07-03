import * as dnt from "https://deno.land/x/dnt@0.30.0/mod.ts";
import packageInfo from "./package.json" assert { type: "json" };

await dnt.emptyDir("./dist");

//** NPM ES Module for Node.js and Browser */

await dnt.build({
  entryPoints: ["./mod.ts"],
  outDir: "./dist",
  test: false,
  scriptModule: false,
  typeCheck: false,
  shims: {},
  package: {
    ...packageInfo,
    engines: {
      node: ">=14",
    },
    dependencies: {
      "node-fetch": "^3.2.3",
      "@peculiar/webcrypto": "^1.4.0",
      "ws": "^8.10.0",
    },
    main: "./esm/mod.js",
    type: "module",
  },
});

// Deno.copyFileSync("LICENSE", "dist/LICENSE");
Deno.copyFileSync("README.md", "dist/README.md");

// Optional: Additional build steps specific to Denodex

/** Add necessary global import statements to NPM ES Module. */
const coreFile = `${Deno.readTextFileSync("./dist/esm/src/core/core.js")}`;
Deno.writeTextFileSync("./dist/esm/src/core/core.js", coreFile);
