/* @flow strict */

export type {
  TRequestCorrelator,
  TCorrelationId,
  TGenerateIdOptions,
  TMiddlewareOptions,
  TGetCorrelationIdOptions,
  TForwardCorrelationIdOptions,
} from './express-request-correlator';

const {
  createRequestCorrelatorMiddleware,
} = require('./express-request-correlator');
const testUtils = require('./test-utils');

module.exports = {
  createRequestCorrelatorMiddleware,
  testUtils,
};
