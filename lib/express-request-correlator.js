const uuidV4 = require('uuid/v4');

const defaultMiddlewareOptions = {
  headerName: 'X-Correlation-Id',
  generateId: () => uuidV4(),
};

const createRequestCorrelatorMiddleware = options => {
  const defaultedOptions = {
    ...defaultMiddlewareOptions,
    ...options,
  };
  const createGetCorrelationId = request => ({ ifNotDefined } = {}) => {
    const previousCorrelationId = request.get(defaultedOptions.headerName);

    // Prefer existing `correlationId`
    if (previousCorrelationId) {
      return previousCorrelationId;
    }

    // Allow generating local `correlationId` first
    if (ifNotDefined)
      return ifNotDefined({ generateId: defaultedOptions.generateId });

    return defaultedOptions.generateId({ request });
  };

  const getHeaderName = () => {
    return defaultedOptions.headerName;
  };

  const createForwardCorrelationId = getCorrelationId => ({
    headers,
    ifNotDefined,
  } = {}) => {
    const correlationId = getCorrelationId({ ifNotDefined });

    if (!correlationId) return null;

    // eslint-disable-next-line no-param-reassign
    headers[defaultedOptions.headerName] = correlationId;

    return correlationId;
  };

  return (request, response, next) => {
    const getCorrelationId = createGetCorrelationId(request);
    const forwardCorrelationId = createForwardCorrelationId(getCorrelationId);

    request.correlator = {
      getCorrelationId,
      getHeaderName,
      forwardCorrelationId,
    };

    const correlationId = getCorrelationId();

    if (correlationId)
      response.header(defaultedOptions.headerName, correlationId);

    next();
  };
};

module.exports = {
  createRequestCorrelatorMiddleware,
};
