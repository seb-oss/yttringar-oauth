import { settings } from '../app-settings'
import * as got from 'got'
const authorizeUrl = settings.githubUrl + '/login/oauth/authorize'
const accessTokenUrl = settings.githubUrl + '/login/oauth/access_token'
const api = settings.githubUrl + '/api/v3'
const { client_id, client_secret } = settings

export function createIssue(
  pageId: number,
  title: string,
  issueBody: string,
  PageUrl: string,
  issueUrl: string,
  bearerToken: string
) {
  const url = api + issueUrl

  return got
    .post(url, {
      json: true,
      headers: {
        Authorization: bearerToken
      },
      body: {
        title,
        body: `
  ${issueBody}

  ---
  Document Details

  - Page id: ${pageId}
  - Page title: ${title}
  - Page url: ${PageUrl}

  `
      }
    })
    .then(e => e.body)
}

export function getAuthorizeUrl(client_id: string, state: string) {
  return `${authorizeUrl}?${new URLSearchParams({ client_id, state })}`
}

export async function getAccessToken({ code, state }: any) {
  const response = await got.post(accessTokenUrl, {
    json: true,
    body: {
      client_id,
      client_secret,
      code,
      state
    },
    headers: {
      'User-Agent': 'Utterances'
    }
  })
  if (response.body.error) {
    console.log(response.body.error)
    throw new Error(`Access token response had status ${response.body.error}.`)
  }

  return response.body.access_token
}
