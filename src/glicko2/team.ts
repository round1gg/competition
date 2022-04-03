import { Outcome, Player } from './player'

// Based on "Abstracting Glicko-2 for Team Games"
// http://rhetoricstudios.com/downloads/AbstractingGlicko2ForTeamGames.pdf
// Using the Composite Opponent Update Method

export default class Team {
  private _players: Player[]
  public get players(): Player[] {
    return this._players
  }

  private _composite: Player
  public get composite(): Player {
    return this._composite
  }

  constructor(players: Player[]) {
    this._players = players
    this._composite = this._createComposite(players)
  }

  private _createComposite = (players: Player[]): Player => {
    if (players.length === 0) {
      throw new Error('No players provided, no composite can be created')
    }
    if (players.length === 1) {
      return players[0].clone()
    }

    let rating = 0
    let rd = 0

    players.forEach((player: Player, i: number) => {
      rating += (player.rating - rating) / (i + 1)
      rd += (player.rd - rd) / (i + 1)
    })

    return new Player(
      rating,
      rd,
      players[0].volatility, // TODO: find a better reference for these values
      players[0].tau,
      players[0].defaultRating,
    )
  }

  /**
   *
   * @param opponent {Team} The opposing Team object so we have access to their precalculated composite
   * @param outcome {Outcome} Win = 1, Draw = 0.5, Loss = 0
   */
  public addResult = (opponent: Team, outcome: Outcome): void => {
    this._players.forEach((player: Player) => {
      player.addResult(opponent.composite, outcome)
    })
  }
}
