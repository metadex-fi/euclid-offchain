import * as dnt from "https://deno.land/x/dnt@0.30.0/mod.ts";
import { dirname, fromFileUrl } from "https://deno.land/std@0.117.0/path/mod.ts";
import packageInfo from "./package.json" assert { type: "json" };

const scriptDir = dirname(fromFileUrl(import.meta.url));

await dnt.emptyDir("./dist");

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

Deno.copyFileSync("README.md", "dist/README.md");

// Copy WebAssembly
const lucidPath = Deno.realPathSync(`${scriptDir}/lucid`);
Deno.copyFileSync(
  `${lucidPath}/src/core/libs/cardano_multiplatform_lib/cardano_multiplatform_lib_bg.wasm`,
  `${scriptDir}/dist/esm/src/core/libs/cardano_multiplatform_lib/cardano_multiplatform_lib_bg.wasm`,
);
Deno.copyFileSync(
  `${lucidPath}/src/core/libs/cardano_message_signing/cardano_message_signing_bg.wasm`,
  `${scriptDir}/dist/esm/src/core/libs/cardano_message_signing/cardano_message_signing_bg.wasm`,
);
