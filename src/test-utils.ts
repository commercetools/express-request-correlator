import type { TRequestCorrelator } from './types';

const createRequestCorrelatorMock = (): TRequestCorrelator => {
  const correlationId = 'test-correlation-id';
  const headerName = 'X-Correlation-Id';

  return {
    getCorrelationId: () => correlationId,
    getHeaderName: () => headerName,
    forwardCorrelationId: (options) => {
      if (options) {
        options.headers[headerName] = correlationId;
      }

      return correlationId;
    },
  };
};

export { createRequestCorrelatorMock };
