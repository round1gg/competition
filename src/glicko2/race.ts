import { Outcome, Player } from './player'

export default class Race {
  private _matches: [Player, Player, Outcome][] = []
  public get matches(): [Player, Player, Outcome][] {
    return this._matches
  }

  constructor(results: Player[][]) {
    this._matches = this.computeMatches(results)
  }

  private _inverseOutcome = (outcome: Outcome): Outcome => {
    switch (outcome) {
      case Outcome.WIN:
        return Outcome.LOSS

      case Outcome.LOSS:
        return Outcome.WIN

      case Outcome.DRAW:
      default:
        return Outcome.DRAW
    }
  }

  public computeMatches = (results: Player[][]): [Player, Player, Outcome][] => {
    const competitors: { player: Player; position: number }[] = []
    let position = 0

    results.forEach((rank: Player[]) => {
      position++
      rank.forEach((player: Player) => {
        competitors.push({ player, position })
      })
    })

    const compute = (players: { player: Player; position: number }[]): [Player, Player, Outcome][] => {
      if (!players.length) {
        return []
      }

      const p1: { player: Player; position: number } = players.shift()!
      const p1Results = players.map((p2): [Player, Player, Outcome] => {
        const outcome = p1.position < p2.position ? Outcome.WIN : Outcome.DRAW

        p1.player.addResult(p2.player, outcome) // Add match to Player 1
        p2.player.addResult(p1.player, this._inverseOutcome(outcome)) // Add match to Player 2 with the inverse outcome

        return [p1.player, p2.player, outcome]
      })

      return p1Results.concat(compute(players))
    }

    return compute(competitors)
  }
}
