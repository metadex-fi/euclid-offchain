import { assert } from "../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { Lucid } from "../../lucid.mod.js";
import { AdminRedeemer, PEuclidAction } from "../types/euclid/euclidAction.js";
import { AssocMap } from "../types/general/fundamental/container/map.js";
import { Data, f, t } from "../types/general/fundamental/type.js";
import { PositiveValue } from "../types/general/derived/value/positiveValue.js";
import { ParamDatum, PPreEuclidDatum } from "../types/euclid/euclidDatum.js";
export class PrePool {
  constructor() {
    Object.defineProperty(this, "paramUtxo", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0,
    });
    Object.defineProperty(this, "preDiracUtxos", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0,
    });
    Object.defineProperty(this, "setParamUtxo", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (paramUtxo) => {
        assert(
          !this.paramUtxo,
          `duplicate paramNFT for ${this.paramUtxo?.paramNFT.show()}`,
        );
        this.paramUtxo = paramUtxo;
        return this;
      },
    });
    Object.defineProperty(this, "addPreDiracUtxo", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (preDiracUtxo) => {
        const threadNFT = preDiracUtxo.preDirac.threadNFT;
        if (!this.preDiracUtxos) {
          this.preDiracUtxos = new AssocMap((kh) => kh.show());
        }
        assert(
          !this.preDiracUtxos.has(threadNFT),
          `CRITICAL: duplicate dirac ${threadNFT}`,
        );
        this.preDiracUtxos.set(threadNFT, preDiracUtxo);
        return this;
      },
    });
    Object.defineProperty(this, "parse", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        if (!this.paramUtxo || !this.preDiracUtxos) {
          return undefined; // TODO consider if critical, then handle and/or log resp.
        }
        const subsequents = this.paramUtxo.paramNFT.sortSubsequents([
          ...this.preDiracUtxos.keys(),
        ]); // TODO  consider if invalids critical, then handle and/or log resp.
        const threadNFTs = subsequents.sorted;
        const parsedDiracUtxos = new Array();
        const invalidDiracUtxos = new Array();
        for (const threadNFT of threadNFTs) {
          const preDiracUtxo = this.preDiracUtxos.get(threadNFT);
          const parsedDiracUtxo = preDiracUtxo.parse(this.paramUtxo.param);
          if (parsedDiracUtxo) {
            parsedDiracUtxos.push(parsedDiracUtxo);
          } else {
            invalidDiracUtxos.push(preDiracUtxo);
          }
        }
        if (!parsedDiracUtxos.length) {
          return undefined;
        }
        return [
          Pool.parse(this.paramUtxo, parsedDiracUtxos),
          threadNFTs[threadNFTs.length - 1],
        ];
      },
    });
    Object.defineProperty(this, "show", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (tabs = "") => {
        const tt = tabs + t;
        const ttf = tt + f;
        return `PrePool {
${ttf}paramUtxo: ${this.paramUtxo?.show(ttf)}
${ttf}preDiracUtxos: ${this.preDiracUtxos?.show((pdu, ts) => pdu.show(ts), ttf)}
${tt}}`;
      },
    });
    Object.defineProperty(this, "cleaningTx", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (tx, contract) => {
        const adminRedeemer = PEuclidAction.ptype.pconstant(
          new AdminRedeemer(),
        );
        const burningNFTs = {};
        for (
          const nft of [
            ...(this.paramUtxo ? [this.paramUtxo.paramNFT] : []),
            ...(this.preDiracUtxos ? [...this.preDiracUtxos.keys()] : []),
          ]
        ) {
          burningNFTs[nft.toLucid] = -1n;
        }
        return tx // TODO read script?
          .attachMintingPolicy(contract.mintingPolicy)
          .mintAssets(burningNFTs, Lucid.Data.void()) // NOTE the Lucid.Data.void() redeemer is crucial
          .collectFrom(this.utxos, Data.to(adminRedeemer));
      },
    });
  }
  get utxos() {
    return [
      ...(this.paramUtxo ? [this.paramUtxo.utxo] : []),
      ...(this.preDiracUtxos
        ? [...this.preDiracUtxos.values()].map((d) => d.utxo)
        : []),
    ];
  }
}
export class Pool {
  constructor(paramUtxo, diracUtxos) {
    Object.defineProperty(this, "paramUtxo", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: paramUtxo,
    });
    Object.defineProperty(this, "diracUtxos", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: diracUtxos,
    });
    Object.defineProperty(this, "openingTx", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (tx, contract) => {
        let tx_ = this.paramUtxo.openingTx(tx, contract);
        // let remaining = this.diracUtxos.slice(0, 100); TODO this is for splitting larger txes
        this.diracUtxos.forEach((diracUtxo) =>
          tx_ = diracUtxo.openingTx(tx_, contract)
        );
        return tx_;
      },
    });
    Object.defineProperty(this, "closingTx", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (tx, contract) => {
        const adminRedeemer = PEuclidAction.ptype.pconstant(
          new AdminRedeemer(),
        );
        const burningNFTs = {};
        for (
          const nft of [
            this.paramUtxo.paramNFT,
            ...this.diracUtxos.map((d) => d.dirac.threadNFT),
          ]
        ) {
          burningNFTs[nft.toLucid] = -1n;
        }
        return tx // TODO read script?
          .attachMintingPolicy(contract.mintingPolicy)
          .mintAssets(burningNFTs, Lucid.Data.void()) // NOTE the Lucid.Data.void() redeemer is crucial
          .collectFrom(this.utxos, Data.to(adminRedeemer));
      },
    });
    Object.defineProperty(this, "switchingTx", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (tx, contract) => {
        const adminRedeemer = PEuclidAction.ptype.pconstant(
          new AdminRedeemer(),
        );
        const peuclidDatum = PPreEuclidDatum.genPType(); //only need this for ParamDatum, so this is fine
        const paramDatum = peuclidDatum.pconstant(
          new ParamDatum(this.paramUtxo.param.switched),
        );
        return tx
          .collectFrom([this.paramUtxo.utxo], Data.to(adminRedeemer))
          .payToContract(contract.address, {
            inline: Data.to(paramDatum),
            scriptRef: contract.validator, // for now, for simplicities' sake
          }, this.paramUtxo.utxo.assets);
      },
    });
  }
  get utxos() {
    return [this.paramUtxo.utxo, ...this.diracUtxos.map((d) => d.utxo)];
  }
  get idNFT() {
    return this.paramUtxo.paramNFT;
  }
  get lastIdNFT() {
    if (this.diracUtxos) {
      return this.diracUtxos[this.diracUtxos.length - 1].dirac.threadNFT;
    } else {
      return this.paramUtxo.paramNFT;
    }
  }
  get balance() {
    const assets = this.paramUtxo.param.assets;
    const total = this.diracUtxos.reduce(
      (a, b) => a.normedPlus(b.balance),
      new PositiveValue(),
    ).ofAssets(this.paramUtxo.param.assets);
    assets.forEach((asset) => {
      total.addAmountOf(asset, 0n);
    });
    return total;
  }
  swappingsFor(user) {
    if (this.paramUtxo.param.active === 0n) {
      return [];
    }
    const balance = user.availableBalance;
    // console.log("pool.swappingsFor balance", balance)
    if (!balance) {
      return [];
    }
    const sellableBalance = balance.ofAssets(this.paramUtxo.param.assets);
    // console.log("pool.swappingsFor sellableBalance", sellableBalance)
    if (!sellableBalance.size) {
      return [];
    }
    return this.diracUtxos.flatMap((d) =>
      d.swappingsFor(user, this.paramUtxo, sellableBalance.unsigned)
    );
  }
  static parse(paramUtxo, diracUtxos) {
    return new Pool(paramUtxo, diracUtxos);
  }
  static open(paramUtxo, diracUtxos) {
    return new Pool(paramUtxo, diracUtxos);
  }
}
