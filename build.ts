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

Deno.copyFileSync("LICENSE", "dist/LICENSE");
Deno.copyFileSync("README.md", "dist/README.md");

// Copy WebAssembly

async function downloadAndCopyWasmFiles() {
  const lucidWasmDir = "https://deno.land/x/lucid@0.10.6/src/core/libs";
  const denodexWasmDir = "dist/esm/lucid/src/core/libs";

  const wasmFiles = [
    "cardano_multiplatform_lib/cardano_multiplatform_lib_bg.wasm",
    "cardano_message_signing/cardano_message_signing_bg.wasm",
  ];

  for (const file of wasmFiles) {
    const lucidWasmUrl = `${lucidWasmDir}/${file}`;
    const denodexWasmPath = `${denodexWasmDir}/${file}`;

    const response = await fetch(lucidWasmUrl);
    const wasm = await response.arrayBuffer();

    await Deno.writeFile(denodexWasmPath, new Uint8Array(wasm));
  }
}

await downloadAndCopyWasmFiles();
