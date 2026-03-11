/*   Chord Transposer
 *     https://github.com/barrettj12/chord-transposer
 *   Author: Jordan Barrett (@barrettj12)
 *     https://github.com/barrettj12
 *
 *   The ChordString class
 *   Each instance represents a collection of chords with associated formatting data
 */


import { NOTE_NAMES, Note } from "./Note.js";

const SYMBOLS = ['#', 'b'];


export class ChordString {
  constructor(base, chords) {
    this.base = base;
    // Array of pairs [pos, note]
    this.chords = chords;
  }
  
  rawNotes() {
    return this.chords.map( x => x[1] );
  }
  
  // Want to minimise this when finding best enharmonic
  totSharpness() {
    return this.rawNotes().map( x => x.sharpness )
                          .reduce( (x, y) => x + y, 0 );
  }
  
  static transpose(cs, semitones) {
    let csFirst = new ChordString(
      cs.base,
      cs.chords.map( x => [
        x[0],
        Note.transpose( x[1], semitones )
      ] )
    );
    
    // Find best enharmonic
    // Want to minimise |totalSharpness|
    let csUp, csDown;
    
    if (csFirst.totSharpness() == 0){
      return csFirst;
    }
    else if (csFirst.totSharpness() > 0){
      csDown = csFirst;

      do {
        csUp = csDown;    
        csDown = new ChordString(
          csUp.base,
          csUp.chords.map( x => [
            x[0],
            Note.enharmonicDown( x[1] )
          ] )
        );
      }
      while (csDown.totSharpness() > 0)

    }
    else if (csFirst.totSharpness() < 0){
      csUp = csFirst;

      do {
        csDown = csUp;
        csUp = new ChordString(
          csDown.base,
          csDown.chords.map( x => [
            x[0],
            Note.enharmonicUp( x[1] )
          ] )
        );
      }
      while (csUp.totSharpness() < 0)
    }

    return (Math.abs(csUp.totSharpness()) <= Math.abs(csDown.totSharpness()) ? csUp : csDown);
  }
  
  // Parses a raw string/textfile into a ChordString object
  static parse(rawStr) {
    let newBase = "";
    let parsingSymbols = false;   // Whether we can parse symbols 'b' '#' at this time
    let noteName = "";
    let sharpness = 0;
    let notes = [];
    
    for (const char of rawStr) {
      if (NOTE_NAMES.includes(char)) {
        if (parsingSymbols) {
          // Create note from current values
          createNote();
        }
        
        // Start parsing next note
        parsingSymbols = true;
        noteName = char;
      }
      else if (parsingSymbols && SYMBOLS.includes(char)) {
        sharpness += (char === '#' ? 1 : -1);
      }
      else {
        createNote();
        
        // Char goes on base
        newBase += char;
      }
    }
    
    createNote();
    
    const cs = new ChordString(newBase, notes);
    return cs;
      
    // Creates a Note if there is one in the buffer
    function createNote() {
      if (noteName != "") {
        // Time to create a note
        let nextNote = new Note(noteName, sharpness);
        // Enter in dictionary
        notes.push([newBase.length, nextNote]);
      
        // Reset parsing
        parsingSymbols = false;
        noteName = "";
        sharpness = 0;
      }
    }
  }

  // Returns string representation of a ChordString object
  toString() {
    let output = "";
    let posBase = 0;
    let posNote = 0;

    while (posBase < this.base.length ||
           posNote < this.chords.length) {
      if (posNote < this.chords.length &&
          this.chords[posNote][0] == posBase) {
        output += this.chords[posNote][1].toString();
        posNote++;
      }
      else {
        output += this.base.charAt(posBase);
        posBase++;
      }
    }

    return output;
  }
}