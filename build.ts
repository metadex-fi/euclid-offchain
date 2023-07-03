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

/** Add necessary global import statements to NPM ES Module. */
const coreFile = `const isNode = globalThis?.process?.versions?.node;
if (isNode) {
    if (typeof btoa === 'undefined') {globalThis.btoa = function (str) {return Buffer.from(str, 'binary').toString('base64');}; globalThis.atob = function (b64Encoded) {return Buffer.from(b64Encoded, 'base64').toString('binary');};}
    const fetch = /* #__PURE__ */ await import(/* webpackIgnore: true */ "node-fetch");
    const { Crypto } = /* #__PURE__ */ await import(/* webpackIgnore: true */ "@peculiar/webcrypto");
    const { WebSocket } = /* #__PURE__ */ await import(/* webpackIgnore: true */ "ws");
    const fs = /* #__PURE__ */ await import(/* webpackIgnore: true */ "fs");
    if (!globalThis.WebSocket) globalThis.WebSocket = WebSocket;
    if (!globalThis.crypto) globalThis.crypto = new Crypto();
    if (!globalThis.fetch) globalThis.fetch = fetch.default;
    if (!globalThis.Headers) globalThis.Headers = fetch.Headers;
    if (!globalThis.Request) globalThis.Request = fetch.Request;
    if (!globalThis.Response) globalThis.Response = fetch.Response;
    if (!globalThis.fs) globalThis.fs = fs; 
}

${Deno.readTextFileSync("./dist/esm/src/core/core.js")}
`;
Deno.writeTextFileSync("./dist/esm/src/core/core.js", coreFile);
