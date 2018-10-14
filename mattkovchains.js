const Combinatorics = require('js-combinatorics');
const weightedRandom = require('weighted-random');

// 2nd-order markov chains for notes, made by matt
const minNote = 0
// max note is inclusive
const maxNote = 23
const arrayLength = maxNote - minNote + 1
const order = 2

function newArray(length, map) {
    return Array.apply(null, Array(length)).map(map)
}

function generateNote(notePair) {
    if (notePair.length != order) {
        throw ("Your notePair is not of size " + order)
    } else if (Math.min(...notePair) < minNote) {
        throw ("Your notePair has a note smaller than " + minNote)
    } else if (Math.max(...notePair) > maxNote) {
        throw ("Your notePair has a note larger than " + maxNote)
    }

    var probabilities = this.chain[notePair.toString()]

    var note = weightedRandom(probabilities) + minNote
    return note
}

function consumeNote(note) {
    if (note < minNote) {
        throw "Note too small!"
    } else if (note > maxNote) {
        throw "Note too big!"
    }

    if (this.lastNotes.length == order) {
        this.chain[this.lastNotes.toString()][note] += 1

        this.lastNotes.shift()
    }

    this.lastNotes.push(note)
}

function guessNote() {
    var generatedNote = undefined

    if (this.lastNotes.length == order) {
        generatedNote = this.generateNote(this.lastNotes)
        this.lastNotes.push(generatedNote)
        this.lastNotes.shift()
    }

    return generatedNote
}

// create markov chain
function mattkovChain() {
    var noteArray = newArray(arrayLength, function (x, i) { return i + minNote })

    var chain = {}

    var notePairs = Combinatorics.permutation(noteArray, order).toArray()

    // this library does not do permutations with repetition, so we have to make due
    // note that if the order were to be tweaked, this would break
    // since an order of 3 would not account for something like 23, 23, 22
    noteArray.forEach(function(note) {
        notePairs.push(newArray(order, function() {
            return note
        }))
    })

    notePairs.forEach(function(notePair) {
        var probabilities = newArray(arrayLength, function () { return 0.01 })

        chain[notePair.toString()] = probabilities
    })

    var lastNotes = []

    var mattkovChain = {
        chain,
        generateNote,
        lastNotes,
        guessNote,
        consumeNote
    }

    return mattkovChain
}

module.exports = mattkovChain