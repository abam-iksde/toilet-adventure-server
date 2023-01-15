import { writeFileSync } from 'fs'
import md5 from 'js-md5'
import { Scoreboard, sortScores } from './Scoreboard'

interface Score {
	name: string
	score: number
	time: number
}

export function toScore(potentialScore: any): Score | undefined {
	if ('name' in potentialScore && 'score' in potentialScore && 'time' in potentialScore) {
		if (typeof potentialScore.name === 'string' && !isNaN(+potentialScore.score) && !isNaN(+potentialScore.time)) {
			return {
				name: potentialScore.name,
				score: +potentialScore.score,
				time: +potentialScore.time,
			}
		}
	}
	return undefined
}

export function submitScore(scoreboard: Scoreboard, score: Score): { newScoreboard: Scoreboard, positionScore: number, positionTime: number } {
	scoreboard.scores.push({
		name: score.name,
		score: score.score,
	})
	scoreboard.times.push({
		name: score.name,
		score: score.time,
	})
	const newScoreboard = sortScores(scoreboard)
	newScoreboard.scores.pop()
	newScoreboard.times.pop()
	const positionScore = newScoreboard.scores.findIndex((v) => v.name === score.name && v.score === score.score)
	const positionTime = newScoreboard.times.findIndex((v) => v.name === score.name && v.score === score.time)

	writeFileSync('scores.json', JSON.stringify(newScoreboard))

	return {
		newScoreboard,
		positionScore,
		positionTime,
	}
}

export function verifyKey(score: Score, key: string) {
	return key === md5(`${score.name}${Math.floor(score.score)}${Math.floor(score.time)}balls`)
}
