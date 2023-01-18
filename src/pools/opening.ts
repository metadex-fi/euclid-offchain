/*
Pool opening process:

1. from the assets in the wallet, pick at least two assets
2. for each asset, choose an amount between 1 and amount in wallet

This opens (a number of) graphs, where we can set the prices.
This graph is
    - if two assets: line
    - if three assets: matrix
    - if four assets: 3D matrix
    - five or more: split in multiple graphs, tbd how exactly


3. for each non-first asset, we need the following, partially dependent numbers:
    - initial price
    - total Min price
    - total Max price
    - active Min price
    - active Max price
    - tick size
    - total number of ticks
    - active number of ticks

... which we choose via sliders (with number input fields) on each axis of the graph.

--> now we need to determine what happens to each of them, when we change any of the other ones:

    - for simplicities' sake, the values of prices are set independently of ticks
    - ticks are set via tick size and are offset at zero (for now)


    core question: How to avoid spreading assets too thin?

    -> approach A:
        - start at maximally concentrated (single dirac) position, with all prices at 1
        - incrementally move away from there, checking for validity at each step
            - could be made more efficient by taking larger steps, checking validity, 
              and then stepping back and taking smaller steps if that fails

    -> approach B:
        - the smallest assets' amount is an upper bound on total (virtual) diracs (with some margin)
        - this can be further refined by using initialPrice and currentPrice for each (virtual) dirac
          to compute default asset there, and only sum those


    --> 
        1.  given initialPrices, totalMinPrices, totalMaxPrices, and tickSizes, we can compute number of
            virtual diracs, and for each the defaultActiveAsset --> total number of virtual diracs per asset
        2.  then, we can divide the deposit for each asset by number of virtual diracs for that asset
            -> if that's less than 1, we are overextended, and fail the expansion step
            -> if it's a fraction larger than 1, we simply have some excess deposit (display that somewhere)


==> this seems to belong in a Param-variant or generator, which wants to be parameterized with initial deposit; 
    write those asserts, then write that stepwise generator as discussed. 
        - JumpSize encodes tick stuff there
        - Param then needs a function like "virtualDiracsPerAsset(initialPrices, lowerBounds, upperBounds, jumpSizes)" 

*/

import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { maxInteger } from "../mod.ts";




// class Range {
//     private options: bigint[] = []
//     private value?: bigint

//     constructor(
//     private min = -maxInteger,
//     private max = maxInteger,
//     private tickSize = 1n,
//     ) {

//         this.updateOptions()
//     }


//     private updateOptions = (): void => {
//         this.options = []
//         for (let i = this.min; i <= this.max; i += this.tickSize) {
//             this.options.push(i)
//         }
//     }

//     public setTickSize = (tickSize: bigint): void => {
//         assert(tickSize > 0n, `Range: tickSize (${tickSize}) <= 0`);
//         this.tickSize = tickSize;
//         this.updateOptions()
//     }

//     public setMin = (min: bigint): void => {
//         assert(min <= this.max, `Range: min (${min}) > max (${this.max})`);
//         this.min = min;
//         this.updateOptions()
//     }

//     public raiseMin = (min: bigint): void => {
//         if (this.min < min) {
//             this.setMin(min)
//         }
//     }

//     public setMax = (max: bigint): void => {
//         assert(this.min <= max, `Range: min (${this.min}) > max (${max})`);
//         this.max = max;
//         this.updateOptions()
//     }

//     public lowerMax = (max: bigint): void => {
//         if (this.max > max) {
//             this.setMax(max)
//         }
//     }

//     public getValue = (index: number): bigint => {
//         return this.options[index]
//     }

//     public pickValue = (index: number): void => {
//         this.value = this.options[index]
//     }
// }

// class Settings {

//     public initialPriceRange = new Range()
//     public totalMinPriceRange = new Range()
//     public totalMaxPriceRange = new Range()
//     public activeMinPriceRange = new Range()
//     public activeMaxPriceRange = new Range()
//     public tickSizeRange = new Range()

//     public pickInitialPrice = (index: number): void => {
//         const initialPrice = this.initialPriceRange.getValue(index)
//         this.activeMinPriceRange.setMax(initialPrice)
//         this.activeMaxPriceRange.setMin(initialPrice)
//         this.totalMaxPriceRange.lowerMax(initialPrice)
//         this.totalMinPriceRange.raiseMin(initialPrice)
//         this.initialPriceRange.pickValue(index)
//     }

//     public pickTotalMinPrice = (index: number): void => {
//         this.totalMinPriceRange.pickValue(index)
//     }

//     public pickTotalMaxPrice = (index: number): void => {
//         const totalMaxPrice = this.totalMaxPriceRange.getValue(index)
//         this.activeMaxPriceRange.setMax(totalMaxPrice)
//         this.totalMaxPriceRange.pickValue(index)
//     }

//     public pickActiveMinPrice = (index: number): void => {
//         const activeMinPrice = this.activeMinPriceRange.getValue(index)
//         this.totalMinPriceRange.setMax(activeMinPrice)
//         this.initialPriceRange.setMin(activeMinPrice)
//         this.activeMinPriceRange.pickValue(index)
//     }

//     public pickActiveMaxPrice = (index: number): void => {
//         const activeMaxPrice = this.activeMaxPriceRange.getValue(index)
//         this.totalMaxPriceRange.setMin(activeMaxPrice)
//         this.initialPriceRange.setMax(activeMaxPrice)
//         this.activeMaxPriceRange.pickValue(index)
//     }

//     public pickTickSize = (index: number): void => {
//         const tickSize = this.tickSizeRange.getValue(index)
//         this.initialPriceRange.setTickSize(tickSize)
//         this.totalMinPriceRange.setTickSize(tickSize)
//         this.totalMaxPriceRange.setTickSize(tickSize)
//         this.activeMinPriceRange.setTickSize(tickSize)
//         this.activeMaxPriceRange.setTickSize(tickSize)
//         this.tickSizeRange.pickValue(index)
//     }
// }