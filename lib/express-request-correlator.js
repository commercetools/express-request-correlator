/* @flow strict */

const uuidV4 = require('uuid/v4');

export type TCorrelationId = ?string;
export type TGenerateIdOptions = {
  request: express$Request,
};
type TMiddlewareOptions = {
  headerName: string,
  generateId: (options: TGenerateIdOptions) => TCorrelationId,
};
type TGetCorrelationIdOptions = {
  ifNotDefined?: ({
    generateId: $PropertyType<TMiddlewareOptions, 'generateId'>,
  }) => TCorrelationId,
};
type TForwardCorrelationIdOptions = {
  headers: $PropertyType<express$Request, 'headers'>,
  ifNotDefined?: $PropertyType<TGetCorrelationIdOptions, 'ifNotDefined'>,
};
export type TRequestCorrelator = {
  getCorrelationId: (options?: TGetCorrelationIdOptions) => TCorrelationId,
  getHeaderName: () => string,
  forwardCorrelationId: (
    options?: TForwardCorrelationIdOptions
  ) => TCorrelationId,
};
type TCorrelatedRequest = express$Request & {
  correlator: TRequestCorrelator,
};

const defaultMiddlewareOptions: TMiddlewareOptions = {
  headerName: 'x-correlation-id',
  generateId: () => uuidV4(),
};

const getCorrelationIdRequestHeader = (
  request: $Subtype<TCorrelatedRequest>,
  headerName: string
) => request.headers[headerName.toLowerCase()];
const setCorrelationIdRequestHeader = (
  request: $Subtype<TCorrelatedRequest>,
  headerName: string,
  nextCorrelationId: TCorrelationId
) => {
  request.headers[headerName.toLowerCase()] = nextCorrelationId;
};

const createRequestCorrelatorMiddleware = (
  options?: TMiddlewareOptions
): express$Middleware => {
  const defaultedOptions = {
    ...defaultMiddlewareOptions,
    ...options,
  };
  const createGetCorrelationId = request => ({
    ifNotDefined,
  }: TGetCorrelationIdOptions = {}): TCorrelationId => {
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

  const getHeaderName = (): string => {
    return defaultedOptions.headerName;
  };

  const createForwardCorrelationId = getCorrelationId => ({
    headers,
    ifNotDefined,
  }: TForwardCorrelationIdOptions = {}): TCorrelationId => {
    const correlationId = getCorrelationId({ ifNotDefined });

    if (!correlationId) return null;

    headers[defaultedOptions.headerName] = correlationId;

    return correlationId;
  };

  return (
    request: $Subtype<TCorrelatedRequest>,
    response: express$Response,
    next: express$NextFunction
  ) => {
    const getCorrelationId = createGetCorrelationId(request);
    const forwardCorrelationId = createForwardCorrelationId(getCorrelationId);

    request.correlator = {
      getCorrelationId,
      getHeaderName,
      forwardCorrelationId,
    };

    const correlationId = getCorrelationId();

    if (correlationId)
      response.header(defaultedOptions.headerName.toLowerCase(), correlationId);

    next();
  };
};

const createRequestCorrelatorMock = () => {
  const correlationId = 'correlation-id';
  const headerName = defaultMiddlewareOptions.headerName;

  return {
    getCorrelationId: () => correlationId,
    getHeaderName: () => 'X-Correlation-Id',
    forwardCorrelationId: ({ headers }: TForwardCorrelationIdOptions) => {
      headers[headerName] = correlationId;

      return correlationId;
    },
  };
};

module.exports = {
  createRequestCorrelatorMiddleware,
  createRequestCorrelatorMock,
};
