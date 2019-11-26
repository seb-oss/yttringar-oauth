# yttringar

This repo contains the code for a node api that powers the GitHub OAuth flow and issue creation for [yttringar](https://github.com/sebgroup/yttringar), used internally at [SEB](https://sebgroup.com/).
It is a fork from https://github.com/utterance/utterances-oauth.

Please note: The front end for utterances is not compatible with the node API.
Instead please use the [yttringar fork](https://github.com/sebgroup/yttringar).

# Getting started

## install

```
npm i

```

## configuration

Create a file named `.env` at the root. File should have the following values:

- CLIENT_ID: The client id to be used in the [GitHub OAuth web application flow](https://developer.github.com/v3/oauth/#web-application-flow)
- CLIENT_SECRET: The client secret for the OAuth web application flow
- STATE_PASSWORD: 32 character password for encrypting state in request headers/cookies. Generate [here](https://1password.com/password-generator/).
- ORIGINS: comma delimited list of permitted origins (the front end iframe). For CORS.
- (optional) GITHUB_URL: if you're hosting your own github (enterprise), you need to specify the url to that. Defaults to https://github.com.

Example:

```
CLIENT_ID=aaaaaaaaaaaaaaaaaaaa
CLIENT_SECRET=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
STATE_PASSWORD=01234567890123456789012345678901
ORIGINS=https://yttringar.se,http://localhost:9000
GITHUB_URL=https://github.company.se
```

## develop

```
npm run dev

```

## build

npm run build
