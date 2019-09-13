<p align="center">
  <img alt="Logo" height="150" src="https://raw.githubusercontent.com/commercetools/express-request-correlator/master/logo.png" /><br /><br />
</p>

<h2 align="center">🧷 express-request-correlator - correlate requests running through express through correlation ids. 🚦</h2>

<p align="center">
  <a href="https://circleci.com/gh/commercetools/express-request-correlator">
    <img alt="CircleCI Status" src="https://circleci.com/gh/commercetools/express-request-correlator.svg?style=shield&circle-token=6b914111cae6bac8d92ab82ff1e84fdf64424e78">
  </a>
  <a href="https://codecov.io/gh/commercetools/express-request-correlator">
    <img alt="Codecov Coverage Status" src="https://img.shields.io/codecov/c/github/commercetools/express-request-correlator.svg?style=flat-square">
  </a>
  <a href="https://app.fossa.io/projects/git%2Bgithub.com%2Ftdeekens%2Fpromster?ref=badge_shield" alt="FOSSA Status"><img src="https://app.fossa.io/api/projects/git%2Bgithub.com%2Ftdeekens%2Fpromster.svg?type=shield"/></a>
  <a href="https://snyk.io/test/github/commercetools/express-request-correlator"><img src="https://snyk.io/test/github/commercetools/express-request-correlator/badge.svg" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/github/{username}/{repo}" style="max-width:100%;"/></a>
  <img alt="Made with Coffee" src="https://img.shields.io/badge/made%20with-%E2%98%95%EF%B8%8F%20coffee-yellow.svg">
</p>

## ❯ Why another middleware for express to work with correlation ids?

> These packages are a combination of observations and experiences we have had with other middlewares which we tried to improve.

1. 🎨 Customized correlation ids: sometimes one needs to customize correlation ids. For instance adding prefix based on the incoming request
2. 🍕 Forwarding correlation ids: oftentimes an incoming correlation id needs to be forwarded as a header to another request convienently
3. 🏄🏻 Opting out of correlation ids: cases exist where a correlation id can not be generated while the fact should be logged
4. 👌🏼 Inspecting correlation ids: the correlation id of a request should be easy to extract without knowing the specific header

## ❯ Installation

Depending on the preferred package manager use:

`yarn add @commercetools/express-request-correlator`

or

`npm i @commercetools/express-request-correlator --save`

## ❯ Documentation

The `express-request-correlator` comes with a couple of options it can be configured with:

- `headerName`: the name of the header which a new correlation id will be set on. Defaults to `X-Correlation-Id`
- `generateId`: a function called whenever an incoming request does not have a correlation id. Receives the `request` within its options argument

An example configuration would be:

```js
const {
  createRequestCorrelatorMiddleware,
} = require('@commercetools/express-request-correlator');

app.use(createRequestCorrelatorMiddleware());
```

Configuring the middleware on your express application exposes a `correlator` property on each request. This property exposing the following API:

```js
getCorrelationId(): TCorrelationId,
getHeaderName(): string,
forwardCorrelationId({ headers }: TForwardCorrelationIdOptions): TCorrelationId
```

1. If for instance you need to retrieve the current request's correlation id invoke `request.correlator.getCorrelationId()`.
2. If you want to forward the correlation id to another request's headers run `request.correlator.forwardCorrelationId({ headers })`
   - This will mutate the passed in headers to contain the previous request's correlation id

## ❯ Testing

In case you want to create a test correlator you can use the `createRequestCorrelatorMock` export. It will create a mocked correlator with the same API as the acutal correlator.
