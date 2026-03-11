/*   Chord Transposer
 *     https://github.com/barrettj12/chord-transposer
 *   Author: Jordan Barrett (@barrettj12)
 *     https://github.com/barrettj12
 *
 *   The Note class
 *   Each instance represents a single musical note
 */


export const NOTE_NAMES = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

// Sharp shifts for transposing
const SHARP_SHIFT = [
  [0, -1, 0,  0, 1,  0, -1, 0,  0, 1,  0, 1],
  [0,  0, 1,  0, 1,  0,  0, 1,  0, 1,  0, 1],
  [0, -1, 0, -1, 0,  0, -1, 0, -1, 0, -1, 0],
  [0, -1, 0,  0, 1,  0, -1, 0, -1, 0,  0, 1],
  [0,  0, 1,  0, 1,  0, -1, 0,  0, 1,  0, 1],
  [0, -1, 0, -1, 0, -1, -1, 0, -1, 0, -1, 0],
  [0, -1, 0, -1, 0,  0, -1, 0, -1, 0,  0, 1],
]

// Steps between notes in order (A->B, B->C, ...)
const STEPS = [2,1,2,2,1,2,2];


export class Note {
  constructor(letter, sharpness) {
    // Char between 'A' and 'G'
    this.letter = letter;
    // Integer. 0 = natural, -1 = flat, +1 = sharp, -2 = double flat, etc
    this.sharpness = sharpness;
  }
  
  toString() {
    let str = this.letter;
    let k = this.sharpness;
    
    while (k != 0) {
      if (k > 0) {
        str += '#';
        k--;
      } else {
        str += 'b';
        k++;
      }
    }
    
    return str;
  }
  
  // Best guess transpose
  static transpose(note, semitones) {
    // New note letter
    let letterShift = Math.round(semitones*7/12);
    let newLetter = this.letterShift(note.letter, letterShift);
    
    // Calculate sharp shift from array - normally 0
    let sharpShift = SHARP_SHIFT
                        [this.letterCode(note.letter)]
                        [mod(semitones,12)];
    
    return new Note(
      newLetter,
      note.sharpness + sharpShift
    );
  }
  
  static letterShift(letter, num) {
    return NOTE_NAMES[mod(this.letterCode(letter)+num, 7)];
  }
  
  // Associates each char A-G to its position in NOTE_NAMES
  static letterCode(letter) {
    return letter.charCodeAt(0) - 65;
  }

  // Given a note, returns the enharmonic with more sharps
  //   e.g.  Eb -> D#,  C -> B# 
  static enharmonicUp(note) {
    let newLetter = this.letterShift(note.letter, -1);
    return new Note(
      newLetter,
      note.sharpness + STEPS[this.letterCode(newLetter)]
    );
  }

  // Given a note, returns the enharmonic with more flats
  //   e.g.  D# -> Eb,  B -> Cb 
  static enharmonicDown(note) {
    return new Note(
      this.letterShift(note.letter, 1),
      note.sharpness - STEPS[this.letterCode(note.letter)]
    );
  }
}


// Mathematically correct modulo function
function mod(x, y) {
  let init = x % y;
  return (init >= 0 ? init : init + y);
}
