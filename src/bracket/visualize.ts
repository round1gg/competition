import { Bracket } from './bracket'
import { NearestPow2 } from './util'

export default function VisualizeElimination(bracket?: Bracket): void {
  // Stores all of the vertical and horizontal strings that get printed to the console
  const matrix: string[][] = []

  // Arrays of strings that get inserted into the matrix
  // prettier-ignore
  const matchbox = [
    ' _______________ ',
    '|               |',
    '|               |',
    '|_______________|'
  ]
  const stem = ['--']
  const path = ['|']
  const matchWidth = Math.max(...matchbox.map((x) => x.length)) // Width of each match box

  const numParticipants = bracket ? NearestPow2(bracket.participants.length) : 16
  const numRounds = Math.floor(Math.log(numParticipants) / Math.log(2))
  const paddingH = 2
  const paddingW = 4
  const gridHeight = (numParticipants / 2) * matchbox.length + paddingH * 2 - 1
  const gridWidth = numRounds * matchWidth + (numRounds - 1) * (stem[0].length * 2 + path[0].length) + paddingW * 2

  // The bracket gets a little too big and unwieldy if there are more than 64 participants
  if (numParticipants > 64) {
    throw new Error('Visualize only supports up to 64 players')
  }

  // Build the matrix with a border around it
  for (let y = 0; y < gridHeight; y++) {
    // First and last column should be a | except on the first and last row
    const outerChar = y !== 0 && y !== gridHeight - 1 ? '|' : ' '
    // First and last row should be a - except on the first and last column
    const innerChar = y === 0 || y === gridHeight - 1 ? '-' : ' '
    matrix.push([outerChar, ...innerChar.repeat(gridWidth - 2).split(''), outerChar])
  }

  /**
   * Inserts the provided art into the matrix using top left origin of x,y
   * @param x {number} Horizontal column to start inserting the art
   * @param y {number} Vertical column to start inserting the art
   * @param art The art that will be inserted at given X,Y coordinate
   */
  const addArt = (x: number, y: number, art: string[]) => {
    // loop through each line in the array
    art.forEach((a: string, yOffset: number) => {
      // separate each character into individual elements in array
      a.split('').forEach((val, xOffset) => {
        // assign the specific cell the new character
        matrix[y + yOffset][x + xOffset] = val
      })
    })
  }

  let matchIndex = 1
  // Loop through each round
  for (let r = 1; r <= numRounds; r++) {
    const numMatches = numParticipants / Math.pow(2, r)

    // Origin for the first match to be inserted
    const x = (r - 1) * (matchWidth + stem[0].length * 2 + path[0].length)
    const y = paddingH / 2

    // Loop through each match in the round
    for (let m = 0; m < numMatches; m++) {
      const pad = Math.round((1 / 3) * Math.pow(r, 3) - Math.pow(r, 2) + (2 + 2 / 3) * r) - matchbox.length / 2
      const yOffset = pad + (2 * pad + matchbox.length) * m
      // Match box
      addArt(x + paddingW, y + yOffset, matchbox)

      // Horizontal paths
      if (r < numRounds) {
        // Exiting a match
        addArt(x + matchWidth + paddingW, y + yOffset + Math.ceil(matchbox.length / 2), stem)
      }
      if (r > 1) {
        // Entering a match
        addArt(x + paddingW - stem[0].length, y + yOffset + Math.ceil(matchbox.length / 2), stem)
      }

      // Vertical paths
      if (m % 2 === 0 && r < numRounds) {
        // Start of line
        const y0 = y + yOffset + Math.round(matchbox.length / 2) + 1
        // End of line
        const y1 = y0 + pad * 2 + matchbox.length / 2
        for (let i = y0; i <= y1; i++) {
          addArt(x + matchWidth + paddingW + stem[0].length, i, path)
        }
      }

      const match = bracket?.matches.find((item) => item.id === matchIndex.toString()) || null
      // Match Number
      addArt(x + paddingW + 2, y + yOffset + 2, [`M${matchIndex}`])

      // Match participants
      const id1 = bracket?.participants.find((p) => p.seeds.has(match?.p1Seed as string))?.id
      const id2 = bracket?.participants.find((p) => p.seeds.has(match?.p2Seed as string))?.id
      const p1Seed = id1 ? `P${id1}` : match?.p1Seed || '???'
      const p2Seed = id2 ? `P${id2}` : match?.p2Seed || '???'
      const matchup = `${p1Seed} v ${p2Seed}`
      addArt(x + paddingW + 6, y + yOffset + 2, [matchup])

      matchIndex++
    }
  }

  const output = matrix.reduce((str, item) => {
    str += item.join('')
    str += '\n'
    return str
  }, '\n')
  console.log(output) // tslint:disable-line
}
