import { Match, MatchWinner } from './match'
import { Participant } from './participant'
export class Bracket {
  protected _type: BracketType
  public get type(): BracketType {
    return this._type
  }

  protected _state: BracketState
  public get state(): BracketState {
    return this._state
  }

  protected _supportDraws: boolean
  public get supportDraws(): boolean {
    return this._supportDraws
  }

  protected _participants: Participant[]
  public get participants(): Participant[] {
    return this._participants
  }

  protected _matches: Match[]
  public get matches(): Match[] {
    return this._matches
  }

  protected _meta: {[key: string]: any}
  public get meta(): {[key: string]: any} {
    return this._meta
  }

  constructor(options: IBracket) {
    this._type = options.type
    this._state = options.state || BracketState.STAGING
    this._supportDraws = options.supportDraws || false
    this._participants = options.participants || []
    this._matches = options.matches || []
    this._meta = Object.assign({}, options.meta || {})
  }

  public setMeta(meta: {[key: string]: any}): void {
    this._meta = Object.assign({}, meta)
  }

  public setMetaByKey(key: string, value: any): void {
    this._meta = Object.assign({}, this._meta, {[key]: value})
  }

  public addParticipants(participants: Participant | Participant[]): void {
    if (Array.isArray(participants)) {
      this._participants = this.participants.concat(participants)
    } else {
      this._participants.push(participants)
    }
  }

  public sortParticipants = (sortFn: any): void => {
    if (!sortFn) {
      return
    }
    this._participants = this.participants.sort(sortFn)
  }

  public createMatches(): void {
    this._matches = []
  }

  /**
   * Generic seeding in the order they were last updated
   */
  public seedParticipants(): void {
    for (let i = 0; i < this.participants.length; i++) {
      this.participants[i].addSeed('S' + (i + 1))
    }
  }

  public seedMatches(): void {
    const matches = this.matches.filter((x) => x.winner === MatchWinner.UNDECIDED)

    matches.forEach((match) => {
      let p1 = null
      let p2 = null
      if (typeof match.p1Seed === 'string') {
        p1 = this.participants.find((x) => x.seeds.has(match.p1Seed as string)) || null
        p1?.addMatch(match)
      }
      if (typeof match.p2Seed === 'string') {
        p2 = this.participants.find((x) => x.seeds.has(match.p2Seed as string)) || null
        p2?.addMatch(match)
      }
      // Assign players to match
      match.updatePlayers(p1, p2)

      // Resolve initial bye rounds
      if (p1 && !p2 && match.p1Seed === 'S' + p1.id) {
        match.updateWinner(MatchWinner.P1)
      }
      if (p2 && !p1 && match.p2Seed === 'S' + p2.id) {
        match.updateWinner(MatchWinner.P2)
      }
    })
  }

  public start(): void {
    this._state = BracketState.INPROGRESS
  }

  public finalize(): void {
    this._state = BracketState.FINAL
  }

  /**
   * Renders a visual representation of the bracket in the console if able to
   */
  public visualize(): void {
    // Using console log as the expectation of visualize is to log a visual representation of the bracket
    console.log(`No visualization available for bracket type: ${this.type}`) // tslint:disable-line
  }
}

export interface IBracket {
  type: BracketType
  state?: BracketState
  supportDraws?: boolean
  participants?: Participant[]
  matches?: Match[]
  meta?: any
}

export enum BracketType {
  'ELIMINATION',
  // 'ROUND_ROBIN',
  // 'SWISS',
}

export enum BracketState {
  'STAGING',
  'INPROGRESS',
  'FINAL',
}
