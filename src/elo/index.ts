export default class Elo {
  private _k: number
  private _p: number

  /**
   * Elo rating calculator
   * @param k {number} The K Factor for calculating ratings (default: 32)
   * @param p {number} The Performance Rating for calculating ratings (default: 400)
   */
  constructor(k: number = 32, p: number = 400) {
    this._k = k
    this._p = p
  }

  /**
   * Calculates the win chance of ratingOne compared to ratingTwo
   * @param ratingOne {number} The rating of the player for which you are calculating the win chance
   * @param ratingTwo {number} The rating of the player's opponent
   * @param p {number} Performance Rating
   * @returns {number}
   */
  public expectedPoints = (ratingOne: number, ratingTwo: number, p: number): number => {
    return 1 / (1 + Math.pow(10, (ratingTwo - ratingOne) / p))
  }

  /**
   * Calculates the delta of the ratings between two players based on K Factor and Performance Rating
   * @param ratingOne {number} The rating of the player for which you are calculating the new rating
   * @param ratingTwo {number} The rating of the player's opponent
   * @param points {1|0|0.5} Win = 1, Loss = 0, Draw = 0.5
   * @param k {number} (Optional) Overrides K Factor
   * @returns {number}
   */
  public calculate = (ratingOne: number, ratingTwo: number, points: 1 | 0.5 | 0, k?: number, p?: number): number => {
    if (![1, 0.5, 0].includes(points)) {
      throw new Error('Invalid points provided to Elo calculation. Please use 0, 0.5 or 1')
    }

    const factor = !k ? this._k : k
    const performance = !p ? this._p : p

    const expected = this.expectedPoints(ratingOne, ratingTwo, performance)
    return ratingOne + factor * (points - expected)
  }
}
