const uuidV4 = require('uuid/v4');

const defaultMiddlewareOptions = {
  headerName: 'x-correlation-id',
  generateId: () => uuidV4(),
};

const getCorrelationIdRequestHeader = (request, headerName) =>
  request.headers[headerName.toLowerCase()];
const setCorrelationIdRequestHeader = (
  request,
  headerName,
  nextCorrelationId
) => {
  request.headers[headerName.toLowerCase()] = nextCorrelationId;
};

const createRequestCorrelatorMiddleware = options => {
  const defaultedOptions = {
    ...defaultMiddlewareOptions,
    ...options,
  };
  const createGetCorrelationId = request => ({ ifNotDefined } = {}) => {
    const previousCorrelationId = getCorrelationIdRequestHeader(
      request,
      defaultedOptions.headerName
    );
    let nextCorrelationId = null;

    // Prefer existing `correlationId`
    if (previousCorrelationId) {
      return previousCorrelationId;
    }

    // Allow generating local `correlationId` first
    if (ifNotDefined)
      nextCorrelationId = ifNotDefined({
        generateId: defaultedOptions.generateId,
      });
    else nextCorrelationId = defaultedOptions.generateId({ request });

    // Storing correlation id on request for subsequent invocations
    setCorrelationIdRequestHeader(
      request,
      defaultedOptions.headerName,
      nextCorrelationId
    );

    return nextCorrelationId;
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
