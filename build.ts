// this file is closely based on the equivalent in lucid

import * as dnt from "https://deno.land/x/dnt@0.30.0/mod.ts";
import * as esbuild from "https://deno.land/x/esbuild@v0.17.11/mod.js";
import packageInfo from "./package.json" assert { type: "json" };

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

// // Copy WebAssembly files from submodule
// const wasmOutputPath1 = "./dist/esm/src/core/libs/cardano_multiplatform_lib";
// const wasmOutputPath2 = "./dist/esm/src/core/libs/cardano_message_signing";

// await dnt.emptyDir(wasmOutputPath1);
// await dnt.emptyDir(wasmOutputPath2);

// Deno.copyFileSync(
//   "lucid/src/core/libs/cardano_multiplatform_lib/cardano_multiplatform_lib_bg.wasm",
//   wasmOutputPath1 + "/cardano_multiplatform_lib_bg.wasm",
// );

// Deno.copyFileSync(
//   "lucid/src/core/libs/cardano_message_signing/cardano_message_signing_bg.wasm",
//   wasmOutputPath2 + "/cardano_message_signing_bg.wasm",
// );


// //** Web ES Module */

// const importPathPlugin = {
//   name: "core-import-path",
//   setup(build: any) {
//     build.onResolve({
//       filter:
//         /^\.\/libs\/cardano_multiplatform_lib\/cardano_multiplatform_lib.generated.js$/,
//     }, (args: any) => {
//       return {
//         path:
//           "../esm/src/core/libs/cardano_multiplatform_lib/cardano_multiplatform_lib.generated.js",
//         external: true,
//       };
//     });
//     build.onResolve({
//       filter:
//         /^\.\/libs\/cardano_message_signing\/cardano_message_signing.generated.js$/,
//     }, (args: any) => {
//       return {
//         path:
//           "../esm/src/core/libs/cardano_message_signing/cardano_message_signing.generated.js",
//         external: true,
//       };
//     });
//   },
// };

// await esbuild.build({
//   bundle: true,
//   format: "esm",
//   entryPoints: ["./dist/esm/mod.js"],
//   outfile: "./dist/web/mod.js",
//   minify: true,
//   plugins: [
//     importPathPlugin,
//   ],
// });
// esbuild.stop();

// /** Add necessary global import statements to NPM ES Module. */
// const coreFile = `const isNode = globalThis?.process?.versions?.node;
// if (isNode) {
//     if (typeof btoa === 'undefined') {globalThis.btoa = function (str) {return Buffer.from(str, 'binary').toString('base64');}; globalThis.atob = function (b64Encoded) {return Buffer.from(b64Encoded, 'base64').toString('binary');};}
//     const { createRequire } = /* #__PURE__ */ await import(/* webpackIgnore: true */ "module");
//     const require = createRequire(import.meta.url);
//     const fetch = /* #__PURE__ */ await import(/* webpackIgnore: true */ "node-fetch");
//     const { Crypto } = /* #__PURE__ */ await import(/* webpackIgnore: true */ "@peculiar/webcrypto");
//     const { WebSocket } = /* #__PURE__ */ await import(/* webpackIgnore: true */ "ws");
//     const fs = /* #__PURE__ */ await import(/* webpackIgnore: true */ "fs");
//     if (!globalThis.WebSocket) globalThis.WebSocket = WebSocket;
//     if (!globalThis.crypto) globalThis.crypto = new Crypto();
//     if (!globalThis.fetch) globalThis.fetch = fetch.default;
//     if (!globalThis.Headers) globalThis.Headers = fetch.Headers;
//     if (!globalThis.Request) globalThis.Request = fetch.Request;
//     if (!globalThis.Response) globalThis.Response = fetch.Response;
//     if (!globalThis.require) globalThis.require = require; 
//     if (!globalThis.fs) globalThis.fs = fs; 
// }
// ${Deno.readTextFileSync("./dist/esm/lucid/src/core/core.js")}
// `;
// Deno.writeTextFileSync("./dist/esm/lucid/src/core/core.js", coreFile);
