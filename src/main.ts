import fastify from 'fastify'
import { initScoreboard } from './Scoreboard'
import { toScore, submitScore, verifyKey } from './submitScore'

const ff = fastify({ logger: true })

let scoreboard = initScoreboard()

ff.get('/submit', async (request, reply) => {
	const score = toScore(request.query)
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
		scoreboard,
	})
})

ff.get('/scoreboard', async (request, reply) => {
	return reply.code(200).send({
		scoreboard
	})
})

ff.listen({ port: +(process.env.PORT || 8080) }, (err, address) => {
	if (err) {
		console.error(err)
		process.exit(1)
	}
	console.log(`Server listening at ${address}`)
})
