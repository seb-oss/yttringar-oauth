import { config } from 'dotenv'

config()
if (
  !process.env.CLIENT_ID ||
  !process.env.CLIENT_SECRET ||
  !process.env.STATE_PASSWORD ||
  !process.env.ORIGINS
) {
  throw new Error('Missing app settings.')
}

if (process.env.STATE_PASSWORD.length !== 32) {
  throw new Error('"state-password" must be 32 characters.')
}

export const settings = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  state_password: process.env.STATE_PASSWORD,
  bot_token: process.env.BOT_TOKEN,
  origins: process.env.ORIGINS.split(',').map(x => x.trim()),
  githubUrl: process.env.GITHUB_URL || 'https://github.com'
}
