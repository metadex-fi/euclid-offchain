import { Value } from "../../refactor_parse/lucid/src/core/wasm_modules/cardano_multiplatform_lib_nodejs/cardano_multiplatform_lib.js";

export function equal<T>(a: T, b: T): boolean {
  if (a === null) {
    if (b === null) {
      return true;
    } else return false;
  }
  if (b === null) return false;
  if (typeof a === "object" && typeof b === "object") {
    if (a.constructor === b.constructor) {
      const aEntries = Object.entries(a);
      const bEntries = Object.entries(b);
      if (aEntries.length === bEntries.length) {
        for (let i = 0; i < aEntries.length; i++) {
          if (!equal(aEntries[i][0], bEntries[i][0])) return false;
          if (!equal(aEntries[i][1], bEntries[i][1])) return false;
        }
        return true;
      } else return false;
    } else return false;
  } else return a === b;
}

export function contains<T>(array: T[], item: T): boolean {
  array.forEach((elem) => {
    if (equal(elem, item)) return true;
  });
  return false;
}
