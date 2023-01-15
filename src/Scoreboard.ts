import { existsSync, readFileSync } from 'fs'
import { constructArray } from './utils'

export interface Scoreboard {
	scores: {
		name: string
		score: number
	}[],
	times: {
		name: string,
		score: number,
	}[],
}

export function initScoreboard(): Scoreboard {
	if (existsSync('scores.json')) {
		return JSON.parse(readFileSync('scores.json').toString())
	}

	return {
		scores: constructArray(9, () => ({
			name: '------',
			score: 0,
		})),
		times: constructArray(9, () => ({
			name: '------',
			score: 0,
		})),
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
