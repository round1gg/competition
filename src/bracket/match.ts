import { Bracket } from './bracket'
import { Participant } from './participant'

export class Match {
  private _id: string
  public get id(): string {
    return this._id
  }
  private _p1: Participant | null
  public get p1(): Participant | null {
    return this._p1
  }
  private _p1Score: number
  public get p1Score(): number {
    return this._p1Score
  }
  private _p1Seed: string | null
  public get p1Seed(): string | null {
    return this._p1Seed
  }
  private _p2: Participant | null
  public get p2(): Participant | null {
    return this._p2
  }
  private _p2Score: number
  public get p2Score(): number {
    return this._p2Score
  }
  private _p2Seed: string | null
  public get p2Seed(): string | null {
    return this._p2Seed
  }
  private _winner: MatchWinner
  public get winner(): MatchWinner {
    return this._winner
  }
  private _bracket: Bracket
  public get bracket(): Bracket {
    return this._bracket
  }
  private _meta: { [key: string]: any }
  public get meta(): { [key: string]: any } {
    return this._meta
  }

  constructor(options: IMatch) {
    // required
    this._id = options.id
    this._p1Seed = options.p1Seed
    this._p2Seed = options.p2Seed
    this._bracket = options.bracket

    // optional
    this._p1 = options.p1 || null
    this._p1Score = options.p1Score || 0
    this._p2 = options.p2 || null
    this._p2Score = options.p2Score || 0
    this._winner = options.winner || MatchWinner.UNDECIDED
    this._meta = Object.assign({}, options.meta || {})
  }

  public setMeta(meta: { [key: string]: any }): void {
    this._meta = Object.assign({}, meta)
  }
  public setMetaByKey(key: string, value: any): void {
    this._meta = Object.assign({}, this._meta, { [key]: value })
  }

  public updatePlayers = (p1: Participant | null, p2: Participant | null): void => {
    this._p1 = p1
    this._p2 = p2
  }

  public updateScore = (p1Score: number, p2Score: number): void => {
    this._p1Score = p1Score
    this._p2Score = p2Score
  }

  public updateWinner = (winner: MatchWinner): void => {
    this._winner = winner
    const nextMatch = this.bracket.matches.find((x) => x.p1Seed === 'W' + this.id || x.p2Seed === 'W' + this.id)
    switch (winner) {
      case MatchWinner.P1:
        // Add outcome seeds to participants
        this.p1?.addSeed('W' + this.id)
        this.p2?.addSeed('L' + this.id)
        // Update next match to have current player information
        if (nextMatch?.p1Seed === 'W' + this.id) {
          nextMatch.updatePlayers(this.p1, nextMatch.p2)
        } else if (nextMatch?.p2Seed === 'W' + this.id) {
          nextMatch.updatePlayers(nextMatch.p1, this.p2)
        }
        break
      case MatchWinner.P2:
        // Add outcome seeds to participants
        this.p1?.addSeed('L' + this.id)
        this.p2?.addSeed('W' + this.id)
        // Update next match to have current player information
        if (nextMatch?.p1Seed === 'W' + this.id) {
          nextMatch.updatePlayers(this.p1, nextMatch.p2)
        } else if (nextMatch?.p2Seed === 'W' + this.id) {
          nextMatch.updatePlayers(nextMatch.p1, this.p2)
        }
        break
      case MatchWinner.UNDECIDED:
      default:
    }
  }
}

export enum MatchWinner {
  UNDECIDED = 0,
  P1,
  P2,
}

export interface IMatch {
  id: string
  p1Seed: string | null
  p2Seed: string | null
  bracket: Bracket
  p1?: Participant | null
  p1Score?: number
  p2?: Participant | null
  p2Score?: number
  winner?: MatchWinner
  meta?: any
}
