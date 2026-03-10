"use strict";
exports.__esModule = true;
exports.Transpose = void 0;
// prettier-ignore
var chordsArrangement = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
// prettier-ignore
var chordsArrangementFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
var Transpose = /** @class */ (function () {
    function Transpose(song) {
        this.chords = this.parse(song);
        this.song = song;
    }
    /**
     * Finds chords in a given line of text.
     *
     * @param line - The line of text to search for chords.
     * @param offset - The offset of the line within the larger text.
     * @returns An array of Chord objects containing the chord and its position.
     */
    Transpose.prototype.findChords = function (line, offset) {
        var modifiedLine = line
            .replace(/\||\t|\-|\/|\(|\)|\,|\s/g, " ")
            .replace(/[\[\]']+/g, " ")
            .trim();
        var reg = /^ *[A-Ga-g](#|b|&)?m?\+?(sus|add|maj|dim|aug)?[0-9]?( *(-|\/) *[A-G](#|b)?)?( +[A-Ga-g](#|b|&)?m?\+?(sus|add|maj|dim|aug)?[0-9]?( *(-|\/) *[A-G](#|b|&)?)? *)* *$/g;
        var reguniq = /[A-Ga-g](#|b|&)?m?\+?(sus|add|maj|dim|aug)?[0-9]?( *(-|\/) *[A-G](#|b|&)?)? */g;
        if (!modifiedLine.match(reg)) {
            return [];
        }
        var chordsWithPositions = [];
        var match;
        while ((match = reguniq.exec(line)) !== null) {
            chordsWithPositions.push({
                chord: match[0].trim(),
                position: match.index + offset
            });
        }
        return chordsWithPositions;
    };
    /**
     * Parses a string containing chords and returns an array of Chord objects.
     *
     * @param src - The string to be parsed.
     * @returns An array of Chord objects.
     */
    Transpose.prototype.parse = function (src) {
        // Parse a text with chords and highlight guitar chords
        var src_textArray = src.split(/\r\n|\r|\n/g);
        var offset = 0;
        var chords = [];
        // Process each line in the src_textArray
        for (var i = 0; i < src_textArray.length; i++) {
            chords.push.apply(chords, this.findChords(src_textArray[i], offset));
            offset += src_textArray[i].length + 1;
        }
        return chords;
    };
    /**
     * Adds HTML tags to highlight chords in the song.
     *
     * @returns The updated song string with chord highlighting tags.
     */
    Transpose.prototype.getWithTags = function () {
        // Add '<span class="chords-highlighted">...</span>' into the code
        var offset = 0;
        var firstString = '<span class="chords-highlighted">';
        var secondString = "</span>";
        var updatedSong = this.song;
        this.chords.forEach(function (value) {
            var index = value.position + offset; // Apply offset
            var start = index;
            while (start < updatedSong.length && !updatedSong[start].match(/\s/)) {
                start++;
            }
            // Calculate the position to insert the tags
            updatedSong =
                updatedSong.slice(0, index) +
                    firstString +
                    value.chord +
                    secondString +
                    updatedSong.slice(start);
            // Update the position for the next iteration
            offset +=
                firstString.length +
                    secondString.length +
                    value.chord.length -
                    (start - index);
        });
        return updatedSong;
    };
    /**
     * Shifts the scale of the chords by the specified amount.
     *
     * @param shiftBy The amount to shift the scale by. This could be a positive or negative number.
     * @returns An array of updated chords with the shifted scale.
     */
    Transpose.prototype.shiftScale = function (shiftBy) {
        var refArrangement = null;
        var updatedChords = this.chords.map(function (chord) {
            if (refArrangement === null) {
                refArrangement =
                    chordsArrangement.indexOf(chord.chord) !== -1
                        ? chordsArrangement
                        : chordsArrangementFlat;
            }
            // check if the chord is a minor chord
            var searchKey = chord.chord;
            var isMinor = false;
            if (chord.chord[chord.chord.length - 1] === "m") {
                searchKey = chord.chord.slice(0, chord.chord.length - 1);
                isMinor = true;
            }
            var currentIndex = refArrangement.indexOf(searchKey);
            var finalPosition = currentIndex + shiftBy;
            if (finalPosition < 0) {
                finalPosition =
                    (refArrangement.length + finalPosition) % refArrangement.length;
            }
            else {
                finalPosition %= refArrangement.length;
            }
            return {
                chord: "" + refArrangement[finalPosition] + (isMinor ? "m" : ""),
                position: chord.position
            };
        });
        return updatedChords;
    };
    /**
     * Shifts the scale of the chords by the specified amount.
     *
     * @param shiftBy The amount to shift the scale by. This could be either positive or negative number.
     * @returns The instance of the class with the shifted scale.
     */
    Transpose.prototype.shiftScaleBy = function (shiftBy) {
        this.chords = this.shiftScale(shiftBy);
        return this;
    };
    /**
     * Shifts the scale from one chord to another chord.
     *
     * @param from The chord to shift from.
     * @param to The chord to shift to.
     * @returns The updated instance of the ChordsTransposer class.
     */
    Transpose.prototype.shiftScaleFromTo = function (from, to) {
        var arrangement = chordsArrangement.indexOf(from) !== -1 &&
            chordsArrangement.indexOf(to) !== -1
            ? chordsArrangement
            : chordsArrangementFlat;
        var diff = arrangement.indexOf(to) - arrangement.indexOf(from);
        this.chords = this.shiftScale(diff);
        return this;
    };
    return Transpose;
}());
exports.Transpose = Transpose;
exports["default"] = Transpose;
