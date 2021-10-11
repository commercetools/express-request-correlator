import type { Request, Response, NextFunction } from 'express';
import type {
  TMiddlewareOptions,
  TCorrelatedRequest,
  TCorrelationId,
  TGetCorrelationId,
  TForwardCorrelationIdOptions,
} from './types';

import { v4 as uuidV4 } from 'uuid';

const defaultMiddlewareOptions: TMiddlewareOptions = {
  headerName: 'x-correlation-id',
  generateId: () => uuidV4(),
};

const getCorrelationIdRequestHeader = (request: Request, headerName: string) =>
  request.headers[headerName.toLowerCase()] as string;
const setCorrelationIdRequestHeader = (
  request: Request,
  headerName: string,
  nextCorrelationId: TCorrelationId
) => {
  request.headers[headerName.toLowerCase()] = nextCorrelationId;
};

const createRequestCorrelatorMiddleware = (options?: TMiddlewareOptions) => {
  const defaultedOptions = {
    ...defaultMiddlewareOptions,
    ...options,
  };
  const createGetCorrelationId =
    (request: Request): TGetCorrelationId =>
    (correlationIdOptions = {}) => {
      const previousCorrelationId = getCorrelationIdRequestHeader(
        request,
        defaultedOptions.headerName
      );
      let nextCorrelationId: TCorrelationId;

      // Prefer existing `correlationId`
      if (previousCorrelationId) {
        return previousCorrelationId;
      }

      // Allow generating local `correlationId` first
      if (correlationIdOptions.ifNotDefined) {
        nextCorrelationId = correlationIdOptions.ifNotDefined({
          generateId: defaultedOptions.generateId,
        });
      } else {
        nextCorrelationId = defaultedOptions.generateId({ request });
      }

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

  const createForwardCorrelationId =
    (getCorrelationId: TGetCorrelationId) =>
    (correlationIdOptions: TForwardCorrelationIdOptions): TCorrelationId => {
      const correlationId = getCorrelationId({
        ifNotDefined: correlationIdOptions.ifNotDefined,
      });

      correlationIdOptions.headers[defaultedOptions.headerName] = correlationId;

      return correlationId;
    };

  return (request: Request, response: Response, next: NextFunction) => {
    const getCorrelationId = createGetCorrelationId(request);
    const forwardCorrelationId = createForwardCorrelationId(getCorrelationId);

    (request as TCorrelatedRequest).correlator = {
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

export { createRequestCorrelatorMiddleware };
