import { badRequest } from './errors'
import * as github from './adapters/github'
import { encodeState, tryDecodeState } from './state'
import { settings } from './app-settings'
import * as express from 'express'

const { client_id, state_password } = settings

export async function authorizeUser(
  req: express.Request,
  res: express.Response
) {
  const { redirect_uri: endUserUrl } = req.query
  if (!endUserUrl) {
    return badRequest(`"redirect_uri" is required.`)
  }

  const state = await encodeState(endUserUrl, state_password)

  const authUrl = github.getAuthorizeUrl(client_id, state)
  return res.redirect(authUrl)
}

export async function handleOauthCallback(
  req: express.Request,
  res: express.Response
) {
  const code = req.query.code
  const state = req.query.state

  if (!code) {
    return badRequest('"code" is required.')
  }

  if (!state) {
    return badRequest('"state" is required.')
  }

  const returnUrl = await tryDecodeState(state, state_password)
  if (returnUrl instanceof Error) {
    return badRequest(returnUrl.message)
  }

  const accessToken = await github.getAccessToken({ code, state })

  res.set('Set-Cookie', `token=${accessToken}`)
  return res.redirect(returnUrl)
}

export async function createIssue(req: express.Request, res: express.Response) {
  const { pageId, title, issueBody, documentUrl } = req.body

  const authorization = req.headers.authorization

  if (!authorization) {
    return badRequest('Authorization header is required.')
  }

  try {
    await github.createIssue(
      pageId,
      title,
      issueBody,
      documentUrl,
      req.path,
      authorization
    )
    return res.status(200)
  } catch (e) {
    console.error(e)
    return badRequest('Unable to post issue to GitHub.')
  }
}
