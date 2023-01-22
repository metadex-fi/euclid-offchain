import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Constr, UTxO } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { Asset, Assets, Currency, Data, KeyHash, Pool, Token } from "../mod.ts";
import { DiracUtxo, ParamUtxo, UtxoPool } from "./utxos.ts";

export class Euclid {
  // owner -> id -> utxo
  private ownerIdParamUtxos = new Map<
    KeyHash,
    Map<Token, ParamUtxo>
  >();
  private ownerIdDiracUtxos = new Map<
    KeyHash,
    Map<Token, DiracUtxo>
  >();
  public invalidDiracs = new Map<string, DiracUtxo[]>();
  public invalidUtxos = new Map<string, UTxO[]>();
  public emptyPoolParams?: Map<KeyHash, Map<Token, ParamUtxo>>;
  public ownerUtxoPools?: Map<KeyHash, UtxoPool[]>;

  constructor(
    public readonly contractCurrency: Currency,
  ) {}

  static ingest(utxos: UTxO[], contractCurrency: Currency): Euclid {
    const e = new Euclid(contractCurrency);
    utxos.forEach((utxo) => {
      try {
        // TODO assert scriptref, and all the other fields if it makes sense
        assert(utxo.datum, `datum must be present`);
        const datum = Data.from(utxo.datum);
        assert(datum instanceof Constr, `datum must be a Constr`);
        switch (datum.index) {
          case 0: {
            const paramUtxo = new ParamUtxo(
              utxo,
              datum.fields,
              contractCurrency,
            );
            const ps = e.ownerIdParamUtxos.get(paramUtxo.param.owner) ??
              new Map<Token, ParamUtxo>();
            assert(!ps.has(paramUtxo.id), `duplicate param id ${paramUtxo.id}`);
            ps.set(paramUtxo.id, paramUtxo);
            e.ownerIdParamUtxos.set(paramUtxo.param.owner, ps);
            break;
          }
          case 1: {
            const diracUtxo = new DiracUtxo(
              utxo,
              datum.fields,
              contractCurrency,
            );
            const ds = e.ownerIdDiracUtxos.get(diracUtxo.dirac.owner) ??
              new Map<Token, DiracUtxo>();
            assert(!ds.has(diracUtxo.id), `duplicate dirac id ${diracUtxo.id}`);
            ds.set(diracUtxo.id, diracUtxo);
            e.ownerIdDiracUtxos.set(diracUtxo.dirac.owner, ds);
            break;
          }
          default:
            throw new Error(`invalid datum index: ${datum.index}`);
        }
      } catch (e) {
        const is = e.invalidUtxos.get(e.message) ?? [];
        is.push(utxo);
        e.invalidUtxos.set(e.message, is);
      }
    });
    return e;
  }

  public digest = (): void => {
    // owner -> param-id -> pool
    const pools = new Map<
      KeyHash,
      Map<Token, {
        paramNFT: Asset;
        threadNFTs: Assets;
        paramUtxo: ParamUtxo;
        diracUtxos: DiracUtxo[];
      }>
    >();
    // pairing up params and diracs by owner and param-id
    const emptyParamOwners = new Set(this.ownerIdParamUtxos.keys());
    const emptyOwnerParams = new Map<
      KeyHash,
      Map<Token, ParamUtxo>
    >();
    for (const [owner, idDiracUtxos] of this.ownerIdDiracUtxos) {
      const idParamUtxos = this.ownerIdParamUtxos.get(owner);
      if (idParamUtxos) {
        emptyParamOwners.delete(owner);
        const pools_ = pools.get(owner) ?? new Map<Token, {
          paramNFT: Asset;
          threadNFTs: Assets;
          paramUtxo: ParamUtxo;
          diracUtxos: DiracUtxo[];
        }>();
        const emptyParamIds = new Set(idParamUtxos.keys());
        for (const [id, diracUtxo] of idDiracUtxos) {
          const paramUtxo = idParamUtxos.get(id);
          if (paramUtxo) {
            emptyParamIds.delete(id);
            diracUtxo.parseWith(paramUtxo.param);
            const pool = pools_.get(id) ?? {
              paramNFT: diracUtxo.dirac.paramNFT,
              threadNFTs: Assets.singleton(diracUtxo.dirac.threadNFT),
              paramUtxo: paramUtxo,
              diracUtxos: new Array<DiracUtxo>(),
            };
            pool.diracUtxos.push(diracUtxo);
            pools_.set(id, pool);
          } else {
            const message = `no params for dirac ${id}`;
            const is = this.invalidDiracs.get(message) ?? [];
            is.push(...[...idDiracUtxos.values()].flat());
            this.invalidDiracs.set(message, is);
          }
        }
        const emptyIdParams = emptyOwnerParams.get(owner) ??
          new Map<Token, ParamUtxo>();
        for (const id of emptyParamIds) {
          const param = idParamUtxos.get(id);
          emptyIdParams.set(id, param!);
        }
        emptyOwnerParams.set(owner, emptyIdParams);
        pools.set(owner, pools_);
      } else {
        const message = `no params for owner ${owner}`;
        const is = this.invalidDiracs.get(message) ?? [];
        is.push(...[...idDiracUtxos.values()].flat());
        this.invalidDiracs.set(message, is);
      }
    }
    for (const owner of emptyParamOwners) {
      const params = this.ownerIdParamUtxos.get(owner);
      const emptyIdParams = emptyOwnerParams.get(owner) ??
        new Map<Token, ParamUtxo>();
      for (const [id, param] of params!) {
        emptyIdParams.set(id, param);
      }
      emptyOwnerParams.set(owner, emptyIdParams);
    }
    this.emptyPoolParams = emptyOwnerParams;

    const result = new Map<KeyHash, UtxoPool[]>();
    for (const [owner, pools_] of pools) {
      result.set(
        owner,
        [...pools_.values()].map((pool) => (
          new UtxoPool(
            new Pool(
              pool.paramNFT,
              pool.threadNFTs,
              pool.paramUtxo.param,
              pool.diracUtxos.map((utxo) => utxo.dirac),
            ),
            pool.paramUtxo,
            pool.diracUtxos,
          )
        )),
      );
    }
    this.ownerUtxoPools = result;
  };

  public openForBusiness = (assets: Assets): UtxoPool[] => {
    assert(
      this.ownerUtxoPools,
      "digest() must be called before openForBusiness()",
    );
    return [...this.ownerUtxoPools.values()].flat().filter((utxoPool) =>
      utxoPool.openForBusiness(assets)
    );
  };
}
