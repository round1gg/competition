import Elo from './index'

describe('Test Elo Functionality', () => {
    test('It should calculate expected score', () => {
        const elo = new Elo()
        expect(elo.expectedPoints(1000,1000, 400)).toBe(0.5)
        expect(elo.expectedPoints(800,1000, 400)).toBeCloseTo(0.240)
        expect(elo.expectedPoints(1200,1000, 400)).toBeCloseTo(0.759)
    })
    test('It should calculate new rating', () => {
        const elo = new Elo()
        expect(elo.calculate(1000,1000,1)).toBe(1016)
        expect(elo.calculate(1000,1000,0)).toBe(984)
        expect(elo.calculate(1000,1000,0.5)).toBe(1000)

        // test K Factor
        expect(elo.calculate(1000,1000,1, 40)).toBe(1020)
        expect(elo.calculate(1000,1000,0, 40)).toBe(980)

        // test 20 K Factor and 200 Performance Rating
        expect(elo.calculate(1200,1000,0, 20)).toBeCloseTo(1184.805)
    })
})