/* @flow strict */

import type { TForwardCorrelationIdOptions } from './express-request-correlator';

const createRequestCorrelatorMock = () => {
  const correlationId = 'test-correlation-id';
  const headerName = 'X-Correlation-Id';

  return {
    getCorrelationId: () => correlationId,
    getHeaderName: () => headerName,
    forwardCorrelationId: ({ headers }: TForwardCorrelationIdOptions) => {
      headers[headerName] = correlationId;

      return correlationId;
    },
  };
};

module.exports = { createRequestCorrelatorMock };
