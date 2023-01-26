import md5 from 'js-md5'
import { constructArray } from './utils'
import {PrismaClient} from "@prisma/client";

export interface Scoreboard {
	scores: {
		name: string
		score: number
	}[],
	times: {
		name: string
		score: number
		demo?: string
	}[],
}

export function excludeDemos(scoreboard: Scoreboard): Scoreboard {
	return {
		scores: scoreboard.scores,
		times: scoreboard.times.map(v => ({ name: v.name, score: v.score }))
	}
}

export async function initScoreboard(): Promise<Scoreboard> {
  const prismaClient = new PrismaClient()

  const dbScores = await prismaClient.score.findMany({
    orderBy: [{
      score: 'desc',
    }],
    take: 9,
  })

  const dbTimes = await prismaClient.time.findMany({
    orderBy: [{
      score: 'asc',
    }],
    take: 9,
  })

	return {
		scores: constructArray(9, index => {
      if (index < dbScores.length) {
        return {
          name: dbScores[index].name,
          score: dbScores[index].score,
        }
      }
      return {
        name: '------',
        score: 0,
		  }
    }
    ),
		times: constructArray(9, index => {
      if (index < dbTimes.length) {
        return {
          name: dbTimes[index].name,
          score: dbTimes[index].score,
          demo: dbTimes[index].demo,
        }
      }
      return{
        name: '------',
        score: 0,
      }
    }),
	}
}

export function sortScores(scoreboard: Scoreboard): Scoreboard {
	return {
		scores: scoreboard.scores.sort((a, b) => {
			if (a.name === '------') {
				return 1
			}
			if (b.name === '------') {
				return -1
			}
			return b.score - a.score
		}),
		times: scoreboard.times.sort((a, b) => {
			if (a.name === '------') {
				return 1
			}
			if (b.name === '------') {
				return -1
			}
			return a.score - b.score
		}),
	}
}

export function verifyAdminKey(key: string, scoreboard?: Scoreboard) {
	return scoreboard && (key === md5(`abam to szef :)${JSON.stringify(scoreboard)}`))
}
