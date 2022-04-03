export enum Outcome {
  WIN = 1,
  DRAW = 0.5,
  LOSS = 0
}

export class Player {
  public static readonly ScalingFactor = 173.7178

  private _defaultRating : number
  public get defaultRating() : number {
    return this._defaultRating
  }

  private _rating : number
  public get rating() : number {
    return this._rating * Player.ScalingFactor + this._defaultRating
  }

  private _rd : number
  public get rd() : number {
    return this._rd * Player.ScalingFactor
  }

  private _volatility : number
  public get volatility() : number {
    return this._volatility
  }

  private _tau : number
  public get tau() : number {
    return this._tau
  }

  public outcomes : Outcome[] = []
  public oppRatings : number[] = []
  public oppRDs : number[] = []

  constructor(rating : number, rd : number, volatility : number, tau : number, defaultRating : number) {
    this._defaultRating = defaultRating
    this._rating = this.updateRating(rating)
    this._rd = this.updateDeviation(rd)
    this._volatility = volatility
    this._tau = tau
  }

  public updateRating = (rating : number) : number => {
    return this._rating = (rating - this._defaultRating) / Player.ScalingFactor
  }

  public updateDeviation = (rd : number) : number => {
    return this._rd = rd / Player.ScalingFactor
  }

  private _resetMatches = () : void => {
    this.outcomes = []
    this.oppRatings = []
    this.oppRDs = []
  }

  private _resetRD = () : number => {
    return this._rd = Math.sqrt(Math.pow(this._rd, 2) + Math.pow(this._volatility, 2))
  }

  public addResult = (opponent : Player, outcome : Outcome) : void => {
    this.oppRatings.push(opponent.rating)
    this.oppRDs.push(opponent.rd)
    this.outcomes.push(outcome)
  }

  public updateRank = () : void => {

    if(!this.outcomes.length) {
      this._resetRD()
    } else {
      // Step 1 - Done by Player Constructor
      // Step 2 - Done by updateRating and updateDeviation

      // Step 3 - Calculate the variance
      const v = this._variance()

      // Step 4 - Calculate the delta from variance
      const delta = this._delta(v)

      // Step 5 - Calculate the volatility from variance and delta
      this._volatility = this.volatilityAlgorithm(v, delta)

      // Step 6 - Reset the Rating Deviation
      this._resetRD()

      // Step 7 - Update Rating Deviation using new variance
      this._rd = 1 / Math.sqrt((1 / Math.pow(this._rd, 2)) + (1 / v))

      // Step 7 (Cont.) - Calculate and update Rating
      let sum = 0
      for(let i = 0; i < this.oppRatings.length; i++) {
        sum += this._g(this.oppRDs[i]) * (this.outcomes[i] - this._E(this.oppRatings[i], this.oppRDs[i]))
      }
      this._rating += Math.pow(this._rd, 2) * sum

      // Step 8
      this._resetMatches()
    }
  }

  public volatilityAlgorithm = (v : number, delta : number) : number => {
    // Step 5.1
    let A = Math.log(Math.pow(this._volatility, 2))
    const f = this._fFactory(delta, v, A)
    const epsilon = 0.000001

    // Step 5.2
    let B: number
    if(Math.pow(delta, 2) > Math.pow(this._rd, 2) + v) {
      B = Math.log(Math.pow(delta, 2) - Math.pow(this._rd, 2) - v)
    } else {
      let k = 1
      while(f(A - k * this.tau) < 0) {
        k++
      }
      B = A - k * this.tau
    }

    // Step 5.3
    let fA = f(A)
    let fB = f(B)

    // Step 5.4
    let C : number
    let fC : number
    while(Math.abs(B - A) > epsilon) {
      C = A + ((A - B) * fA) / (fB - fA)
      fC = f(C)
      if(fC * fB < 0) {
        A = B
        fA = fB
      } else {
        fA = fA / 2
      }
      B = C
      fB = fC
    }

    // Step 5.5
    return Math.exp(A / 2)

  }

  // Calculation of the estimated variance of the player's rating based on outcomes
  private _variance = () : number => {
    let sum = 0
    for(let i = 0; i < this.oppRatings.length; i++) {
      let E = this._E(this.oppRatings[i], this.oppRDs[i])
      sum += Math.pow(this._g(this.oppRDs[i]), 2) * E * (1 - E)
    }
    return 1 / sum
  }

  // Glicko E fuction
  private _E = (oppRating : number, oppDeviation : number) : number => {
    return 1 / (1 + Math.exp(-1 * this._g(oppDeviation) * (this._rating - oppRating)))
  }

  // Glicko2 g(rd) function
  private _g = (rd : number) : number => {
    return 1 / Math.sqrt(1 + 3 * Math.pow(rd, 2) / Math.pow(Math.PI, 2))
  }

  // Glicko2 delta function
  // Calculation of the estimated improvement in rating (see: Step 4)
  private _delta = (v : number) : number => {
    let sum = 0
    for(let i = 0; i < this.oppRatings.length; i++) {
      sum += this._g(this.oppRDs[i]) * (this.outcomes[i] - this._E(this.oppRatings[i], this.oppRDs[i]))
    }
    return v * sum
  }

  private _fFactory = (delta : number, v : number, a : number) => {
    let player = this
    return (x : number) => {
      return Math.exp(x) * (Math.pow(delta, 2) - Math.pow(player._rd, 2) - v - Math.exp(x)) / (2 * Math.pow(Math.pow(player._rd, 2) + v + Math.exp(x), 2)) - (x - a) / Math.pow(player._tau, 2)
    }
  }
}
