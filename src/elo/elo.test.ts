import Elo from './index'

describe('Test Elo Functionality', () => {
  it('should calculate expected score', () => {
    const elo = new Elo()
    expect(elo.expectedPoints(1000, 1000, 400)).toBe(0.5)
    expect(elo.expectedPoints(800, 1000, 400)).toBeCloseTo(0.24)
    expect(elo.expectedPoints(1200, 1000, 400)).toBeCloseTo(0.759)
  })

  it('should calculate new rating', () => {
    const elo = new Elo()
    expect(elo.calculate(1000, 1000, 1)).toBe(1016)
    expect(elo.calculate(1000, 1000, 0)).toBe(984)
    expect(elo.calculate(1000, 1000, 0.5)).toBe(1000)
  })

  it('should calculate new ratings with different K factors', () => {
    const elo = new Elo()
    expect(elo.calculate(1000, 1000, 1, 40)).toBe(1020)
    expect(elo.calculate(1000, 1000, 0, 40)).toBe(980)
  })

  it('should calculate new rating with different K factor and performance ratings', () => {
    const elo = new Elo()
    expect(elo.calculate(1200, 1000, 0, 20)).toBeCloseTo(1184.805)
  })
})
