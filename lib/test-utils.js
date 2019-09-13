const createRequestCorrelatorMock = () => {
  const correlationId = 'test-correlation-id';
  const headerName = 'X-Correlation-Id';

  return {
    getCorrelationId: () => correlationId,
    getHeaderName: () => headerName,
    forwardCorrelationId: ({ headers }) => {
      // eslint-disable-next-line no-param-reassign
      headers[headerName] = correlationId;

      return correlationId;
    },
  };
};

module.exports = { createRequestCorrelatorMock };
