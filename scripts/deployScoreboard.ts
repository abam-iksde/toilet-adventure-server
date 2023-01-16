import md5 from "js-md5"
import { backendUrl, scores } from "./scores"

async function main() {
  const response = await fetch(`${backendUrl}/scoreboard`, {
    method: 'POST',
    headers: {
      key: md5(`abam to szef :)${JSON.stringify(scores.scoreboard)}`),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(scores),
  })

  console.log({ status: response.status })
}

main()
