<p align="center">
  <img alt="Logo" height="150" src="https://raw.githubusercontent.com/commercetools/express-request-correlator/master/logo.png" /><br /><br />
</p>

<h2 align="center">🧷 Express middleware to help tracing correlation IDs ⚙️</h2>

<p align="center">
  <a href="https://github.com/commercetools/express-request-correlator/actions">
    <img alt="CI Status" src="https://github.com/commercetools/express-request-correlator/workflows/express-request-correlator/badge.svg" />
  </a>
  <img alt="Made with Coffee" src="https://img.shields.io/badge/made%20with-%E2%98%95%EF%B8%8F%20coffee-yellow.svg" />
</p>

## ❯ Why another middleware for express to work with correlation ids?

> This packages is a combination of observations and experiences we have had with other middlewares upon whose ideas we build:

1. 🎨 **Customized** correlation ids: sometimes correlation ids need customization. For instance adding prefix based on the incoming request's origin.
2. 🍕 **Forwarding** correlation ids: oftentimes an incoming correlation id needs to be forwarded as a header to another request (e.g. a `fetch` call).
3. 🏄🏻 **Opting out** of correlation ids: cases exist where a correlation id can or should not be generated while the fact should be logged
4. 👌🏼 **Inspecting** correlation ids: the correlation id of a request should be easy to extract without knowing the specific header it is passed under

## ❯ Installation

Depending on the preferred package manager:

`yarn add @commercetools/express-request-correlator`

or

`npm i @commercetools/express-request-correlator --save`

## ❯ Concepts

A correlation id, can be referred to as a unique identifier that is attached to requests that allow grouping them as a transaction or event chain. In the case of multiple microservices it is used to correlate an incoming request to other resulting requests to other services. As a result a correlation ids should be passed on when found on an incoming request. If not found they should be generated early to have a correlatable request/transaction chain as soon as possible. Ultimately, this helps enabling a concept called distributed tracing in a distributed systems by for instance graphing a sequence diagram of multiple requests across various services.

Usually correlation ids are passed as a header. The specific name of that header differs. Often `X-Correlation-Id` is used. Generally multiple services should agree on a shared name and location (e.g. header) of the id. However, it is possible that service `A` makes a request with a correlation id named (`X-Request-Id`) to service `B` which forwards it as `X-Correlation-Id`.

## ❯ Documentation

The `express-request-correlator` comes with a couple of options it can be configured with:

- `headerName`: the name of the header on which a new correlation id will be set on. Defaults to `X-Correlation-Id`.
- `generateId`: a function called whenever an incoming request does not have a correlation id. Receives the `request` within its options argument.

An example configuration would be:

```js
import { createRequestCorrelatorMiddleware } from '@commercetools/express-request-correlator';

app.use(createRequestCorrelatorMiddleware());
```

1. The middleware adds a correlation id to each response as a header for debugging
   - The previously received id is forwarded/used or a new id is generated
2. The middleware itself exposes a property called `correlator` (more below) onto each incoming request
   - This object allows receiving the correlation id in other parts of the request chain

Configuring the middleware on your express application exposes a `correlator` property on each request. See type `TRequestCorrelator`.

1. If for instance you need to retrieve the current request's correlation id invoke `request.correlator.getCorrelationId()`
2. If you want to forward the correlation id to another request's headers run `request.correlator.forwardCorrelationId({ headers })`
   - This will mutate the passed in headers to contain the previous request's correlation id

Note, that `getCorrelationId` and `forwardCorrelationId` both accept a object with configuration:

```js
{
  ifNotDefined: () => TCorrelationId;
}
```

Whenever `ifNotDefined` is passed it can be used as a last resort to generate a new correlation id given the request does not already have one. Another use case is logging. Whenever `ifNotDefined` is not passed the "globally" configured `generate` function will be used if no correlation id is present on the request.

## ❯ Testing

In case you want to create a test correlator you can use the `createRequestCorrelatorMock` function on the `testUtils` object. It will create a mocked correlator with the same API as the actual correlator.

```js
import { createRequestCorrelatorMock } from '@commercetools/express-request-correlator/test-utils';

createRequestCorrelatorMock();
```
