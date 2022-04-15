import { Outcome, Player } from './'

describe('Glicko 2 Player', () => {
  it('should create a default player when passed no properties', () => {
    let player = new Player()
    expect(player.rating).toBe(1500)
    expect(player.rd).toBeCloseTo(350, 0)
    expect(player.volatility).toBe(0.06)
    expect(player.tau).toBe(0.5)
    expect(player.defaultRating).toBe(1500)
  })

  // Create the players
  const P1 = new Player(1500, 200, 0.06, 0.5, 1500)
  const P2 = new Player(1400, 30, 0.06, 0.5, 1500)
  const P3 = new Player(1550, 100, 0.06, 0.5, 1500)
  const P4 = new Player(1700, 300, 0.06, 0.5, 1500)

  it('should not be affect subsequent new players', () => {
    expect(P1.rating).toBe(1500)
    expect(P1.rd).toBeCloseTo(200, 0)

    expect(P2.rating).toBe(1400)
    expect(P2.rd).toBeCloseTo(30, 0)
  })

  it('should add results without affecting rating', () => {
    // Add the matches
    P1.addResult(P2, Outcome.WIN).addResult(P3, Outcome.LOSS).addResult(P4, Outcome.LOSS)

    expect(P1.rating).toBe(1500)
  })

  it('should track match results without affecting other players', () => {
    expect(P1.outcomes.length).toBe(3)
    expect(P1.oppRatings.length).toBe(3)
    expect(P1.oppRDs.length).toBe(3)

    expect(P2.outcomes.length).toBe(0)
    expect(P2.oppRatings.length).toBe(0)
    expect(P2.oppRDs.length).toBe(0)
  })

  it('should return 1464 rating for P1', () => {
    // Calculate new rating based on matches
    P1.updateRank()

    expect(P1.rating).toBeCloseTo(1464, 0)
    expect(P1.rd).toBeCloseTo(151.52, 1)
  })

  it('should not affect other Players when one is calculated', () => {
    expect(P2.rating).toBe(1400)
    expect(P2.rd).toBeCloseTo(30, 0)
  })

  it('should not change rating if no matches are played', () => {
    P2.updateRank()
    expect(P2.rating).toBe(1400)
  })

  it('should update rating manually', () => {
    P4.updateRating(1350)
    expect(P4.rating).toBe(1350)
    P4.updateRating(1700)
    expect(P4.rating).toBe(1700)
  })

  it('should update rating deviation manually', () => {
    P4.updateDeviation(200)
    expect(P4.rd).toBeCloseTo(200, 0)
    P4.updateDeviation(300)
    expect(P4.rd).toBeCloseTo(300, 0)
  })

  it('should calculate volatility correctly', () => {
    let volatility = P1.volatilityAlgorithm(1.7785, -0.4834)
    expect(volatility).toBeCloseTo(0.05999, 5)
  })
})
