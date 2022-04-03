import { Outcome, Player, Team } from './'

describe('Glicko 2 Race', () => {
  // Create the players
  const P1 = new Player(1500, 200, 0.06, 0.5, 1500)
  const P2 = new Player(1400, 30, 0.06, 0.5, 1500)
  const P3 = new Player(1550, 100, 0.06, 0.5, 1500)
  const P4 = new Player(1700, 300, 0.06, 0.5, 1500)

  const T1 = new Team([P1, P3])
  const T2 = new Team([P2, P4])

  it('should not have created a composite player for each team', () => {
    expect(T1.composite).toBeDefined()
    expect(T2.composite).toBeDefined()
  })

  it('should have calculated a new rating for each team composite', () => {
    expect(T1.composite.rating).toBe(1525)
    expect(T2.composite.rating).toBe(1550)
  })

  it('should add results to each member of a team without affecting the other team', () => {
    T1.addResult(T2, Outcome.WIN)
    expect(P1.outcomes.length).toBe(1)
    expect(P2.outcomes.length).toBe(0)
    expect(P3.outcomes.length).toBe(1)
    expect(P4.outcomes.length).toBe(0)

    T2.addResult(T1, Outcome.LOSS)
    expect(P1.outcomes.length).toBe(1)
    expect(P2.outcomes.length).toBe(1)
    expect(P3.outcomes.length).toBe(1)
    expect(P4.outcomes.length).toBe(1)
  })

  it('should calculate new rating for each player', () => {
    P1.updateRank()
    P2.updateRank()
    P3.updateRank()
    P4.updateRank()

    expect(P1.rating).toBeCloseTo(1591, -1)
    expect(P2.rating).toBeCloseTo(1395, -1)
    expect(P3.rating).toBeCloseTo(1574, -1)
    expect(P4.rating).toBeCloseTo(1477, -1)
  })
})
