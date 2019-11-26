import { authorizeUser, handleOauthCallback, createIssue } from './routes'
import * as express from 'express'
import * as cookieParser from 'cookie-parser'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import { settings } from './app-settings'
import { unauthorized } from './errors'
const PORT = 3000

const app = express()
app.use(cookieParser())
app.use(bodyParser.json())

const corsSettings = {
  origin: settings.origins,
  credentials: true
}

function errorHandler(
  err: Error,
  _req: express.Request,
  res: express.Response,
  _next: any
) {
  console.error(err)
  switch (err.name) {
    case 'BadRequest':
      res.status(400).send('bad request')
      break
    case 'Unauthorized':
      res.status(401).send('unauthorized')
      break
    default:
      res.status(500)
      break
  }
}

app.get('/', (_req, res: express.Response, _: any) => res.send('alive'))

/* 
  Initiate the oauth flow. Called by from a client wanting to be authorized.
  Redirects the user to the /authorize endpoint of oauth-service (github) 
  together with the necessary state.
  Lets the oauth service use the callback url that was the app was installed with.
  
  query-params: 
    - redirect_uri (required)
*/

app.get('/authorize', authorizeUser)

/* 
  The designated callback url from the oauth-service
  
  query-params:
    - code (a temporary string that can be exchanged for a access-token)
    - state (the state param that was sent to the oauth-service)
*/
app.get('/authorized', handleOauthCallback)

/* 
  The route the yttringar front end uses to retreive it's token from the cookie.

  Cookies:
    - token (required)
*/
app.get(
  '/token',
  cors(corsSettings),
  (req: express.Request, res: express.Response) => {
    const { token } = req.cookies
    if (!token) {
      return unauthorized('No accesstoken found in cookie')
    }
    res.json(token)
  }
)

/* 
  The current way yttringar requests to creates issues.
  The path that was matched (wildcard) corresponds to the path set in the yttringar front end as "repo"
  and is used to create the issue.

  body: {
    pageId, # An unique Id for the page 
    title,  # Title of the issue
    issueBody, # Markdown text from the issue body
    documentUrl # A link back to the page where the issue was created
  } 
*/

app.options('/repos/*', cors(corsSettings), (_, res: express.Response) =>
  res.sendStatus(200)
)

app.post('/repos/*', cors(corsSettings), createIssue)

app.use(errorHandler)

app.listen(PORT, () => console.log(`listening on ${PORT}`))

export default app
