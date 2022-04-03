import { Player, Race } from './'

describe('Glicko 2 Race', () => {
  // Create the players
  const P1 = new Player(1500, 200, 0.06, 0.5, 1500)
  const P2 = new Player(1400, 30, 0.06, 0.5, 1500)
  const P3 = new Player(1550, 100, 0.06, 0.5, 1500)
  const P4 = new Player(1700, 300, 0.06, 0.5, 1500)

  // Create the Results
  let results = [
    [P4], // First Place
    [P1, P3], // Tied for Second Place
    [P2], // Fourth Place
  ]

  // Create the Race
  const race = new Race(results)

  it('should create 6 matches in race', () => {
    expect(race.matches.length).toBe(6)
  })

  it('should add matches to each player', () => {
    expect(P1.outcomes.length).toBe(3)
    expect(P2.outcomes.length).toBe(3)
    expect(P3.outcomes.length).toBe(3)
    expect(P4.outcomes.length).toBe(3)
  })

  it('should still calculate rating properly', () => {
    P1.updateRank()
    P2.updateRank()
    P3.updateRank()
    P4.updateRank()

    expect(P1.rating).toBeCloseTo(1527, -1)
    expect(P2.rating).toBeCloseTo(1395, -1)
    expect(P3.rating).toBeCloseTo(1549, -1)
    expect(P4.rating).toBeCloseTo(1846, -1)
  })
})
