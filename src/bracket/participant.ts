import { Match } from './match'

export class Participant {
  private _id: string
  public get id(): string {
    return this._id
  }

  private _name: string
  public get name(): string {
    return this._name
  }

  private _matches: Match[]
  public get matches(): Match[] {
    return this._matches
  }

  private _seeds: Set<string> = new Set<string>()
  public get seeds(): Set<string> {
    return this._seeds
  }

  private _meta: { [key: string]: any }
  public get meta(): { [key: string]: any } {
    return this._meta
  }

  constructor(options: IParticipant) {
    this._id = options.id
    this._name = options.name || ''
    this._matches = options.matches || []
    this._seeds = options.seeds || new Set<string>()
    this._meta = Object.assign({}, options.meta || {})
  }

  public reset = () => {
    this._matches = []
    this._seeds = new Set<string>()
  }

  public setMeta(meta: { [key: string]: any }): void {
    this._meta = Object.assign({}, meta)
  }
  public setMetaByKey(key: string, value: any): void {
    this._meta = Object.assign({}, this._meta, { [key]: value })
  }

  public addSeed = (seed: string): void => {
    this._seeds.add(seed)
  }

  public deleteSeed = (seed: string): void => {
    this._seeds.delete(seed)
  }

  public addMatch = (match: Match) => {
    this._matches.push(match)
  }
}

export interface IParticipant {
  id: string
  name?: string
  matches?: Match[]
  seeds?: Set<string>
  meta?: any
}
