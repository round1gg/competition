import { Outcome, Player } from './player'

export default class Race {
  
  private _matches: [Player, Player, Outcome][] = []
  public get matches() : [Player, Player, Outcome][] {
    return this._matches
  }

  constructor(results: Player[][]) {
    this._matches = this.computeMatches(results)
  }

  public computeMatches = (results : Player[][]) : [Player, Player, Outcome][] => {
    let players : {player : Player; position : number}[] = []
    let position = 0

    results.forEach((rank : Player[]) => {
      position++
      rank.forEach((player: Player) => {
        players.push({player, position})
      })
    })

    const compute = (players : {player : Player; position : number}[]) : [Player, Player, Outcome][] => {
      if(!players.length) {
        return []
      }

      let p1 : {player : Player; position : number} = players.shift()!
      let p1Results = players.map((p2) : [Player, Player, Outcome] => {
        return [p1.player, p2.player, (p1.position < p2.position) ? Outcome.WIN : Outcome.DRAW]
      })

      return p1Results.concat(compute(players))
    }

    return compute(players)
  }

}