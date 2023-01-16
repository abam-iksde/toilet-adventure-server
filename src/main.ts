import fastify from 'fastify'
import { asDemoQuery } from './isDemoQuery'
import { excludeDemos, initScoreboard } from './Scoreboard'
import { toScore, submitScore, verifyKey } from './submitScore'

const ff = fastify({ logger: true })

let scoreboard = initScoreboard()

ff.post('/submit', async (request, reply) => {
	const score = toScore(request.body)
	if (!score) {
		return reply.code(400).send()
	}
	if (typeof request.headers['key'] !== 'string' || !verifyKey(score, request.headers['key'])) {
		return reply.code(401).send()
	}
	const {
		newScoreboard,
		positionScore,
		positionTime,
	} = submitScore(scoreboard, score)
	scoreboard = newScoreboard
	return reply.code(200).send({
		positionScore,
		positionTime,
		scoreboard: excludeDemos(scoreboard),
	})
})

ff.get('/scoreboard', async (request, reply) => {
	return reply.code(200).send({
		scoreboard: excludeDemos(scoreboard),
	})
})

ff.get('/demo', async (request, reply) => {
	const demoQuery = asDemoQuery(request.query)
	if (!demoQuery) return reply.code(400).send()
	const { demo } = scoreboard.times[demoQuery.position]
	if (!demo) {
		return {
			noDemo: true,
		}
	}
	return {
		demo,
	}
})

ff.listen({ port: +(process.env.PORT || 8080), host: '0.0.0.0' }, (err, address) => {
	if (err) {
		console.error(err)
		process.exit(1)
	}
	console.log(`Server listening at ${address}`)
})
