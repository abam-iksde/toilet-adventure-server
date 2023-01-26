import md5 from 'js-md5'
import { Scoreboard, sortScores } from './Scoreboard'
import { PrismaClient } from '@prisma/client'

interface Score {
	name: string
	score: number
	time: number
	demo?: string
}

export function toScore(potentialScore: any): Score | undefined {
	if ('name' in potentialScore && 'score' in potentialScore && 'time' in potentialScore) {
		if (typeof potentialScore.name === 'string' && !isNaN(+potentialScore.score) && !isNaN(+potentialScore.time)) {
			return {
				name: potentialScore.name,
				score: +potentialScore.score,
				time: +potentialScore.time,
				demo: potentialScore.demo,
			}
		}
	}
	return undefined
}

const prismaClient = new PrismaClient()

export async function submitScore(scoreboard: Scoreboard, score: Score): Promise<{ newScoreboard: Scoreboard, positionScore: number, positionTime: number }> {
  const submitScore = {
    name: score.name,
    score: score.score,
  }

  const submitTime = {
    name: score.name,
    score: score.time,
    demo: score.demo ?? '',
  }

  await prismaClient.$transaction(async txClient => {
    await txClient.score.create({
      data: submitScore,
    })
    await txClient.time.create({
      data: submitTime,
    })
  })

  scoreboard.scores.push(submitScore)
	scoreboard.times.push(submitTime)
	const newScoreboard = sortScores(scoreboard)
	newScoreboard.scores.pop()
	newScoreboard.times.pop()
	const positionScore = newScoreboard.scores.findIndex((v) => v.name === score.name && v.score === score.score)
	const positionTime = newScoreboard.times.findIndex((v) => v.name === score.name && v.score === score.time)

	return {
		newScoreboard,
		positionScore,
		positionTime,
	}
}

export function verifyKey(score: Score, key: string) {
	return key === md5(`${score.name}${Math.floor(score.score)}${Math.floor(score.time)}balls`)
}
