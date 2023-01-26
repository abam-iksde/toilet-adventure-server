import fastify from 'fastify'
import { asDemoQuery } from './isDemoQuery'
import {excludeDemos, initScoreboard, Scoreboard, verifyAdminKey} from './Scoreboard'
import { toScore, submitScore, verifyKey } from './submitScore'

const ff = fastify({ logger: true })

let scoreboard: Scoreboard

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
	} = await submitScore(scoreboard, score)
	scoreboard = newScoreboard
	return reply.code(200).send({
		positionScore,
		positionTime,
		scoreboard: excludeDemos(scoreboard),
	})
})

ff.get('/scoreboard', async (request, reply) => {
	const includeDemos = (query: any) => 'includeDemos' in query
	if (includeDemos(request.query)) {
		return reply.code(200).send({
			scoreboard,
		})
	}
	return reply.code(200).send({
		scoreboard: excludeDemos(scoreboard),
	})
})

ff.post('/scoreboard', async (request, reply) => {
	const getScoreboard = (body: any) => body.scoreboard
	const newScoreboard = getScoreboard(request.body)
	if (!request.headers.key || typeof request.headers.key !== 'string' || !verifyAdminKey(request.headers.key, newScoreboard)) return reply.code(401).send()
	scoreboard = newScoreboard
	return reply.code(200).send()
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

async function main() {
  scoreboard = await initScoreboard()

  ff.listen({port: +(process.env.PORT || 8080), host: '0.0.0.0'}, (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
  })
}

main()
