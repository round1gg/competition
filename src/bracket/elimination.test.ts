import { BracketState, BracketType, IBracket } from './bracket'
import Elimination from './elimination'
import { MatchWinner } from './match'
import { Participant } from './participant'

describe('Bracket Elimination', () => {
  describe('7 Participants', () => {
    const options: IBracket = {
      type: BracketType.ELIMINATION,
      state: BracketState.STAGING,
      supportDraws: false,
    }
    const bracket = new Elimination(options)

    // to be used later
    const numParticipants = 7
    const numByes = 1
    const participants: Participant[] = []
    for (let i = 1; i <= numParticipants; i++) {
      participants.push(new Participant({ id: i.toString(), name: `P${i}` }))
    }

    it('should create a new elimination bracket', () => {
      expect(bracket.type).toBe(BracketType.ELIMINATION)
      expect(bracket.participants.length).toBe(0)
      expect(bracket.matches.length).toBe(0)
    })
    it('should add participants', () => {
      bracket.addParticipants(participants)
      expect(bracket.participants.length).toBe(7)
    })
    it('should add matches based on number of participants', () => {
      bracket.createMatches()
      expect(bracket.matches.length).toBe(7)

      // bracket.visualize()
    })
    it('should sort participants in reverse order then back again', () => {
      expect(bracket.participants[0]).toBe(participants[0])
      bracket.sortParticipants((a: Participant, b: Participant) => (+a.id < +b.id ? 1 : -1))
      expect(bracket.participants[0]).toBe(participants[6])
      bracket.sortParticipants((a: Participant, b: Participant) => (+a.id < +b.id ? -1 : 1))
      expect(bracket.participants[0]).toBe(participants[0])
    })
    it('should give participants their initial seed and no others', () => {
      bracket.seedParticipants()
      expect(participants[0].seeds.size).toBe(1)
      expect(participants[0].seeds.has('S1')).toBe(true)
      expect(participants[1].seeds.size).toBe(1)
      expect(participants[1].seeds.has('S2')).toBe(true)
      expect(participants[2].seeds.size).toBe(1)
      expect(participants[2].seeds.has('S3')).toBe(true)
      expect(participants[3].seeds.size).toBe(1)
      expect(participants[3].seeds.has('S4')).toBe(true)
      expect(participants[4].seeds.size).toBe(1)
      expect(participants[4].seeds.has('S5')).toBe(true)
      expect(participants[5].seeds.size).toBe(1)
      expect(participants[5].seeds.has('S6')).toBe(true)
      expect(participants[6].seeds.size).toBe(1)
      expect(participants[6].seeds.has('S7')).toBe(true)

      // bracket.visualize()
    })
    it('should assign participants to the proper matches and resolve Byes', () => {
      bracket.seedMatches()
      expect(participants[0].seeds.has('W1')).toBe(true)
      expect(participants[0].seeds.size).toBe(2)
      expect(participants[1].seeds.has('W1')).toBe(false)

      for (let i = 0; i < participants.length; i++) {
        const isBye = i < numByes
        expect(participants[i].seeds.size).toBe(isBye ? 2 : 1)
      }

      // bracket.visualize()
    })
    it('should report the correct winners for the first round and update second round matches', () => {
      const [m1, m2, m3, m4, m5, m6, m7] = bracket.matches.sort((a, b) => (+a.id < +b.id ? -1 : 1))
      expect(m1.winner).toBe(MatchWinner.P1)
      expect(m2.winner).toBe(MatchWinner.UNDECIDED)
      expect(m3.winner).toBe(MatchWinner.UNDECIDED)
      expect(m4.winner).toBe(MatchWinner.UNDECIDED)

      m2.updateWinner(MatchWinner.P2)
      expect(m1.winner).toBe(MatchWinner.P1)
      expect(m2.winner).toBe(MatchWinner.P2)
      expect(m3.winner).toBe(MatchWinner.UNDECIDED)
      expect(m4.winner).toBe(MatchWinner.UNDECIDED)

      m3.updateWinner(MatchWinner.P1)
      expect(m1.winner).toBe(MatchWinner.P1)
      expect(m2.winner).toBe(MatchWinner.P2)
      expect(m3.winner).toBe(MatchWinner.P1)
      expect(m4.winner).toBe(MatchWinner.UNDECIDED)

      m4.updateWinner(MatchWinner.P2)
      expect(m1.winner).toBe(MatchWinner.P1)
      expect(m2.winner).toBe(MatchWinner.P2)
      expect(m3.winner).toBe(MatchWinner.P1)
      expect(m4.winner).toBe(MatchWinner.P2)

      expect(m5.winner).toBe(MatchWinner.UNDECIDED)
      expect(m6.winner).toBe(MatchWinner.UNDECIDED)
      expect(m7.winner).toBe(MatchWinner.UNDECIDED)

      // bracket.visualize()
    })
    it('should report the correct winners for the second round and update the final', () => {
      const [m1, m2, m3, m4, m5, m6, m7] = bracket.matches.sort((a, b) => (+a.id < +b.id ? -1 : 1))
      expect(m5.winner).toBe(MatchWinner.UNDECIDED)
      expect(m6.winner).toBe(MatchWinner.UNDECIDED)
      expect(m7.winner).toBe(MatchWinner.UNDECIDED)

      m5.updateWinner(MatchWinner.P1)
      expect(m5.winner).toBe(MatchWinner.P1)
      expect(m6.winner).toBe(MatchWinner.UNDECIDED)
      expect(m7.winner).toBe(MatchWinner.UNDECIDED)

      m6.updateWinner(MatchWinner.P2)
      expect(m5.winner).toBe(MatchWinner.P1)
      expect(m6.winner).toBe(MatchWinner.P2)
      expect(m7.winner).toBe(MatchWinner.UNDECIDED)

      // final round should have the correct players
      expect(m7.p1).toBe(m5.p1)
      expect(m7.p2).toBe(m6.p2)

      // Outcomes should not have changed
      expect(m1.winner).toBe(MatchWinner.P1)
      expect(m2.winner).toBe(MatchWinner.P2)
      expect(m3.winner).toBe(MatchWinner.P1)
      expect(m4.winner).toBe(MatchWinner.P2)

      // bracket.visualize()
    })
  })
  describe('4 Participants', () => {
    const options: IBracket = {
      type: BracketType.ELIMINATION,
      state: BracketState.STAGING,
      supportDraws: false,
    }
    const bracket = new Elimination(options)

    // to be used later
    const numParticipants = 4
    const numByes = 0
    const participants: Participant[] = []
    for (let i = 1; i <= numParticipants; i++) {
      participants.push(new Participant({ id: i.toString(), name: `P${i}` }))
    }

    it('should create a new elimination bracket', () => {
      expect(bracket.type).toBe(BracketType.ELIMINATION)
      expect(bracket.participants.length).toBe(0)
      expect(bracket.matches.length).toBe(0)
    })
    it('should add participants', () => {
      bracket.addParticipants(participants)
      expect(bracket.participants.length).toBe(4)
    })
    it('should add matches based on number of participants', () => {
      bracket.createMatches()
      expect(bracket.matches.length).toBe(3)

      // bracket.visualize()
    })
    it('should sort participants in reverse order then back again', () => {
      expect(bracket.participants[0]).toBe(participants[0])
      bracket.sortParticipants((a: Participant, b: Participant) => (+a.id < +b.id ? 1 : -1))
      expect(bracket.participants[0]).toBe(participants[3])
      bracket.sortParticipants((a: Participant, b: Participant) => (+a.id < +b.id ? -1 : 1))
      expect(bracket.participants[0]).toBe(participants[0])
    })
    it('should give participants their initial seed and no others', () => {
      bracket.seedParticipants()
      expect(participants[0].seeds.size).toBe(1)
      expect(participants[0].seeds.has('S1')).toBe(true)
      expect(participants[1].seeds.size).toBe(1)
      expect(participants[1].seeds.has('S2')).toBe(true)
      expect(participants[2].seeds.size).toBe(1)
      expect(participants[2].seeds.has('S3')).toBe(true)
      expect(participants[3].seeds.size).toBe(1)
      expect(participants[3].seeds.has('S4')).toBe(true)

      // bracket.visualize()
    })
    it('should assign participants to the proper matches', () => {
      bracket.seedMatches()
      expect(participants[0].seeds.size).toBe(1)
      expect(participants[1].seeds.size).toBe(1)
      expect(participants[2].seeds.size).toBe(1)
      expect(participants[3].seeds.size).toBe(1)
      expect(bracket.matches[0].p1).toBe(participants[0])
      expect(bracket.matches[0].p2).toBe(participants[3])
      expect(bracket.matches[1].p1).toBe(participants[1])
      expect(bracket.matches[1].p2).toBe(participants[2])
      expect(bracket.matches[2].p1).toBe(null)
      expect(bracket.matches[2].p2).toBe(null)

      // bracket.visualize()
    })
    it('should report the correct winners for the first round and update second round matches', () => {
      const [m1, m2, m3] = bracket.matches.sort((a, b) => (+a.id < +b.id ? -1 : 1))
      expect(m1.winner).toBe(MatchWinner.UNDECIDED)
      expect(m2.winner).toBe(MatchWinner.UNDECIDED)
      expect(m3.winner).toBe(MatchWinner.UNDECIDED)

      m1.updateWinner(MatchWinner.P1)
      expect(m1.winner).toBe(MatchWinner.P1)
      expect(m2.winner).toBe(MatchWinner.UNDECIDED)
      expect(m3.winner).toBe(MatchWinner.UNDECIDED)

      m2.updateWinner(MatchWinner.P2)
      expect(m1.winner).toBe(MatchWinner.P1)
      expect(m2.winner).toBe(MatchWinner.P2)
      expect(m3.winner).toBe(MatchWinner.UNDECIDED)

      // bracket.visualize()
    })
    it('should report the correct winners for the final round', () => {
      const [m1, m2, m3] = bracket.matches.sort((a, b) => (+a.id < +b.id ? -1 : 1))
      m3.updateWinner(MatchWinner.P1)
      expect(m1.winner).toBe(MatchWinner.P1)
      expect(m2.winner).toBe(MatchWinner.P2)
      expect(m3.winner).toBe(MatchWinner.P1)

      // Outcomes should not have changed
      expect(m1.winner).toBe(MatchWinner.P1)
      expect(m2.winner).toBe(MatchWinner.P2)
      expect(m3.winner).toBe(MatchWinner.P1)

      // bracket.visualize()
    })
  })
  describe('32 Participants', () => {
    const options: IBracket = {
      type: BracketType.ELIMINATION,
      state: BracketState.STAGING,
      supportDraws: false,
    }
    const bracket = new Elimination(options)

    // to be used later
    const numParticipants = 32
    const participants: Participant[] = []
    for (let i = 1; i <= numParticipants; i++) {
      participants.push(new Participant({ id: i.toString(), name: `P${i}` }))
    }

    it('should create a new elimination bracket', () => {
      expect(bracket.type).toBe(BracketType.ELIMINATION)
      expect(bracket.participants.length).toBe(0)
      expect(bracket.matches.length).toBe(0)
    })
    it('should add participants', () => {
      bracket.addParticipants(participants)
      expect(bracket.participants.length).toBe(32)
    })
    it('should add matches based on number of participants', () => {
      bracket.createMatches()
      expect(bracket.matches.length).toBe(31)

      bracket.visualize()
    })
    it('should sort participants in reverse order then back again', () => {
      expect(bracket.participants[0]).toBe(participants[0])
      bracket.sortParticipants((a: Participant, b: Participant) => (+a.id < +b.id ? 1 : -1))
      expect(bracket.participants[0]).toBe(participants[31])
      bracket.sortParticipants((a: Participant, b: Participant) => (+a.id < +b.id ? -1 : 1))
      expect(bracket.participants[0]).toBe(participants[0])
    })
    it('should give participants their initial seed and no others', () => {
      bracket.seedParticipants()
      expect(participants[0].seeds.size).toBe(1)
      expect(participants[0].seeds.has('S1')).toBe(true)
      expect(participants[1].seeds.size).toBe(1)
      expect(participants[1].seeds.has('S2')).toBe(true)
      expect(participants[2].seeds.size).toBe(1)
      expect(participants[2].seeds.has('S3')).toBe(true)
      expect(participants[3].seeds.size).toBe(1)
      expect(participants[3].seeds.has('S4')).toBe(true)

      bracket.visualize()
    })
    it('should assign participants to the proper matches', () => {
      bracket.seedMatches()
      expect(participants[0].seeds.size).toBe(1)
      expect(participants[1].seeds.size).toBe(1)
      expect(participants[2].seeds.size).toBe(1)
      expect(participants[3].seeds.size).toBe(1)
      expect(bracket.matches[0].p1).toBe(participants[0])
      expect(bracket.matches[0].p2).toBe(participants[31])
      expect(bracket.matches[1].p1).toBe(participants[15])
      expect(bracket.matches[1].p2).toBe(participants[16])
      expect(bracket.matches[16].p1).toBe(null)
      expect(bracket.matches[16].p2).toBe(null)
      expect(bracket.matches[24].p1).toBe(null)
      expect(bracket.matches[24].p2).toBe(null)
      expect(bracket.matches[28].p1).toBe(null)
      expect(bracket.matches[28].p2).toBe(null)
      expect(bracket.matches[30].p1).toBe(null)
      expect(bracket.matches[30].p2).toBe(null)

      bracket.visualize()
    })
    it('should report the correct winners for the first round and update second round matches', () => {
      const [m1, m2, m3] = bracket.matches.sort((a, b) => (+a.id < +b.id ? -1 : 1))
      expect(m1.winner).toBe(MatchWinner.UNDECIDED)
      expect(m2.winner).toBe(MatchWinner.UNDECIDED)
      expect(m3.winner).toBe(MatchWinner.UNDECIDED)

      m1.updateWinner(MatchWinner.P1)
      expect(m1.winner).toBe(MatchWinner.P1)
      expect(m2.winner).toBe(MatchWinner.UNDECIDED)
      expect(m3.winner).toBe(MatchWinner.UNDECIDED)

      m2.updateWinner(MatchWinner.P2)
      expect(m1.winner).toBe(MatchWinner.P1)
      expect(m2.winner).toBe(MatchWinner.P2)
      expect(m3.winner).toBe(MatchWinner.UNDECIDED)

      bracket.visualize()
    })
    it('should report the correct winners for the final round', () => {
      const [m1, m2, m3] = bracket.matches.sort((a, b) => (+a.id < +b.id ? -1 : 1))
      m3.updateWinner(MatchWinner.P1)
      expect(m1.winner).toBe(MatchWinner.P1)
      expect(m2.winner).toBe(MatchWinner.P2)
      expect(m3.winner).toBe(MatchWinner.P1)

      // Outcomes should not have changed
      expect(m1.winner).toBe(MatchWinner.P1)
      expect(m2.winner).toBe(MatchWinner.P2)
      expect(m3.winner).toBe(MatchWinner.P1)

      bracket.visualize()
    })
  })
})
