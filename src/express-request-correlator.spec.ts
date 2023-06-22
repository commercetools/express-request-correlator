import { mocked } from 'jest-mock';
import type { Request, Response, NextFunction } from 'express';
import { v4 as uuidV4 } from 'uuid';
import { createRequestCorrelatorMiddleware } from './express-request-correlator';
import type { TCorrelatedRequest } from './types';

jest.mock('uuid');

// @ts-ignore: it's a fake request object
const createRequest = (custom = {}): Request => ({
  headers: {},
  get: jest.fn(),
  ...custom,
});

// @ts-ignore: it's a fake response object
const createResponse = (custom = {}): Response => ({
  header: jest.fn(),
  ...custom,
});

describe('with default options', () => {
  const requestCorrelatorMiddleware = createRequestCorrelatorMiddleware();
  const headerName = 'x-correlation-id';

  describe('with existing correlation id', () => {
    let initialRequest: Request;
    let correlatedRequest: TCorrelatedRequest;
    let response: Response;
    let next: NextFunction;
    const correlationId = 'existing-id';
    beforeEach(() => {
      next = jest.fn();
      initialRequest = createRequest({
        headers: {
          [headerName]: correlationId,
        },
      });
      mocked(initialRequest.get).mockReturnValue(correlationId);
      response = createResponse();

      requestCorrelatorMiddleware(initialRequest, response, next);
      correlatedRequest = initialRequest as TCorrelatedRequest;
    });

    it('should continue through the middleware chain', () => {
      expect(next).toHaveBeenCalled();
    });

    it('should return the existing correlation id', () => {
      expect(correlatedRequest.correlator.getCorrelationId()).toEqual(
        correlationId
      );
    });

    it('should return the default header name', () => {
      expect(correlatedRequest.correlator.getHeaderName()).toEqual(headerName);
    });

    it('should forward the existing correlation id', () => {
      const headesWithoutCorrelationId = {};

      expect(
        correlatedRequest.correlator.forwardCorrelationId({
          headers: headesWithoutCorrelationId,
        })
      ).toEqual(correlationId);
      expect(headesWithoutCorrelationId).toHaveProperty(
        headerName,
        correlationId
      );
    });
  });

  describe('without existing correlation id', () => {
    let initialRequest: Request;
    let correlatedRequest: TCorrelatedRequest;
    let response: Response;
    let next: NextFunction;
    describe('when generator returns id', () => {
      const correlationId = 'existing-id';
      beforeEach(() => {
        next = jest.fn();
        initialRequest = createRequest({
          headers: {
            [headerName]: null,
          },
        });
        mocked(initialRequest.get).mockReturnValue(undefined);
        mocked(uuidV4).mockReturnValue(correlationId);
        response = createResponse();

        requestCorrelatorMiddleware(initialRequest, response, next);
        correlatedRequest = initialRequest as TCorrelatedRequest;
      });

      it('should continue through the middleware chain', () => {
        expect(next).toHaveBeenCalled();
      });

      it('should return a new correlation id', () => {
        expect(correlatedRequest.correlator.getCorrelationId()).toEqual(
          correlationId
        );
      });

      it('should return the default header name', () => {
        expect(correlatedRequest.correlator.getHeaderName()).toEqual(
          headerName
        );
      });

      it('should forward the existing correlation id', () => {
        const headesWithoutCorrelationId = {};

        expect(
          correlatedRequest.correlator.forwardCorrelationId({
            headers: headesWithoutCorrelationId,
          })
        ).toEqual(correlationId);
        expect(headesWithoutCorrelationId).toHaveProperty(
          headerName,
          correlationId
        );
      });
    });

    describe('when generator does not return id', () => {
      const correlationId = 'existing-id';
      const ifNotDefined = jest.fn(() => correlationId);
      beforeEach(() => {
        next = jest.fn();
        initialRequest = createRequest({
          headers: {
            [headerName]: null,
          },
        });
        mocked(initialRequest.get).mockReturnValue(undefined);
        mocked(uuidV4).mockReturnValue('');
        response = createResponse();

        requestCorrelatorMiddleware(initialRequest, response, next);
        correlatedRequest = initialRequest as TCorrelatedRequest;
      });

      it('should continue through the middleware chain', () => {
        expect(next).toHaveBeenCalled();
      });

      it('should return a new correlation id through ifNotDefined', () => {
        expect(
          correlatedRequest.correlator.getCorrelationId({
            ifNotDefined,
          })
        ).toEqual(correlationId);
      });

      it('should return the default header name', () => {
        expect(correlatedRequest.correlator.getHeaderName()).toEqual(
          headerName
        );
      });

      it('should forward the existing correlation id through ifNotDefined', () => {
        const headesWithoutCorrelationId = {};

        expect(
          correlatedRequest.correlator.forwardCorrelationId({
            headers: headesWithoutCorrelationId,
            ifNotDefined,
          })
        ).toEqual(correlationId);
        expect(headesWithoutCorrelationId).toHaveProperty(
          headerName,
          correlationId
        );
      });
    });
  });
});

describe('with custom options', () => {
  let initialRequest: Request;
  let correlatedRequest: TCorrelatedRequest;
  let response: Response;
  let next: NextFunction;
  const correlationId = 'existing-id';
  const generateId = () => correlationId;
  const headerName = 'X-Request-Id';
  const requestCorrelatorMiddleware = createRequestCorrelatorMiddleware({
    headerName,
    generateId,
  });

  beforeEach(() => {
    next = jest.fn();
    initialRequest = createRequest({
      headers: {
        [headerName]: correlationId,
      },
    });
    mocked(initialRequest.get).mockReturnValue(correlationId);
    response = createResponse();

    requestCorrelatorMiddleware(initialRequest, response, next);
    correlatedRequest = initialRequest as TCorrelatedRequest;
  });

  it('should continue through the middleware chain', () => {
    expect(next).toHaveBeenCalled();
  });

  it('should return the existing correlation id', () => {
    expect(correlatedRequest.correlator.getCorrelationId()).toEqual(
      correlationId
    );
  });

  it('should return the default header name', () => {
    expect(correlatedRequest.correlator.getHeaderName()).toEqual(headerName);
  });

  it('should forward the existing correlation id', () => {
    const headesWithoutCorrelationId = {};

    expect(
      correlatedRequest.correlator.forwardCorrelationId({
        headers: headesWithoutCorrelationId,
      })
    ).toEqual(correlationId);
    expect(headesWithoutCorrelationId).toHaveProperty(
      headerName,
      correlationId
    );
  });
});
