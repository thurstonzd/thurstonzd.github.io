/*   Chord Transposer
 *     https://github.com/barrettj12/chord-transposer
 *   Author: Jordan Barrett (@barrettj12)
 *     https://github.com/barrettj12
 *
 *   Main JS file  
 */


import { ChordString } from "./ChordString.js";


// Main method for transposing a chord sequence by a given amount
export function transpose(input, amount) {
  let newCS = ChordString.transpose(
    ChordString.parse(input),
    amount
  )
  
  return newCS.toString();
}