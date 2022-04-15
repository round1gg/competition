import { Bracket, IBracket, BracketType } from './bracket'
import { IMatch, Match, MatchWinner } from './match'
import { Participant } from './participant'
import { NearestPow2 } from './util'
import VisualizeElimination from './visualize'

/**
 * Calculates the first round seeding in pairs of two
 * @param numSlots Number of participants
 * @returns {number[]} [1,16,8,9,4,13,5,12,2,15,7,10,3,14,6,11] would mean 1 vs 16, 8 vs 9, etc.
 */
const getFirstRoundSeeding = (numSlots: number): number[] => {
  // TODO : Support multiple seeding algorithms
  /**
   * Determine Seed Order
   *
   * Given 16 participants, we want the first round to pair like this:
   * 1v16 (match 1)
   * 8v9  (match 2)
   * 4v13 (match 3)
   * 5v12 (match 4)
   * 2v15 (match 5)
   * 7v10 (match 6)
   * 3v14 (match 7)
   * 6v11 (match 8)
   * This way rank 1 is on the opposite side as Rank 2, etc.
   */
  const numRounds = Math.log(numSlots) / Math.log(2)

  const rounds: number[][] = []
  // prepopulate rounds
  for (let i = 0; i < numRounds; i++) {
    rounds[i] = []
  }
  // final round expected to have #1 vs #2
  rounds[numRounds] = [1, 2]
  // for each round, work backwards
  for (let r = numRounds; r > 0; r--) {
    // current round
    const round = rounds[r]
    // round before current
    const feeder = rounds[r - 1]

    // loop through current known round participants
    for (let m = 0; m < round.length; m++) {
      // each previous round has twice as many participants as subsequent rounds
      const numParticipants = round.length * 2
      // P1
      feeder[m * 2] = round[m]
      // P2
      feeder[m * 2 + 1] = numParticipants + 1 - round[m]
    }
  }
  return rounds[1]
}

export default class Elimination extends Bracket {
  constructor(options: IBracket) {
    super(options)
  }

  public override createMatches(): void {
    super.createMatches()

    const numSlots = NearestPow2(this.participants.length)
    const numRounds = Math.log(numSlots) / Math.log(2)
    const firstRoundSeeds = getFirstRoundSeeding(numSlots)
    for (let round = 1; round <= numRounds; round++) {
      // matches to create = numSlots / 2^x (where x = round #)
      for (let i = 0; i < numSlots / Math.pow(2, round); i++) {
        const matchNumber = i + (numSlots - Math.pow(2, numRounds - round + 1)) + 1

        // First round are Seed placements, subsequent rounds are Winner placements
        const p1Seed =
          round === 1 ? 'S' + firstRoundSeeds[2 * i] : 'W' + (matchNumber - numSlots / Math.pow(2, round - 1) + i)
        const p2Seed =
          round === 1
            ? 'S' + firstRoundSeeds[2 * i + 1]
            : 'W' + (matchNumber - numSlots / Math.pow(2, round - 1) + 1 + i)

        const matchOptions: IMatch = {
          id: matchNumber.toString(),
          p1: null,
          p1Seed, // round 1 seed comes from seedMatches()
          p1Score: 0,
          p2: null,
          p2Seed, // round 1 seed comes from seedMatches()
          p2Score: 0,
          winner: MatchWinner.UNDECIDED,
          bracket: this,
        }

        this._matches.push(new Match(matchOptions))
      }
    }
  }

  public override visualize(): void {
    VisualizeElimination(this)
  }
}
