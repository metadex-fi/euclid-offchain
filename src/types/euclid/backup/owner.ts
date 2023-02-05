// export class POwner extends PLiteral<PKeyHash> {
//     private constructor(
//       public paymentKeyHash: KeyHash,
//     ) {
//       super(PKeyHash.ptype, paymentKeyHash);
//     }

//     static genPType(): PLiteral<PKeyHash> {
//       const paymentKeyHash = PKeyHash.ptype.genData();
//       return new POwner(paymentKeyHash);
//     }

//     static pliteral(paymentKeyHash: KeyHash): POwner {
//       return new POwner(paymentKeyHash);
//     }
//   }
