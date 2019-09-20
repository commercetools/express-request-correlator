const uuidV4 = require('uuid/v4');
const {
  createRequestCorrelatorMiddleware,
} = require('./express-request-correlator');

jest.mock('uuid/v4');

const createRequest = custom => ({
  headers: {},
  get: jest.fn(),

  ...custom,
});

const createResponse = custom => ({
  header: jest.fn(),

  ...custom,
});

describe('with default options', () => {
  const requestCorrelatorMiddleware = createRequestCorrelatorMiddleware();
  const headerName = 'x-correlation-id';

  describe('with existing correlation id', () => {
    let request;
    let response;
    let next;
    const correlationId = 'existing-id';
    beforeEach(() => {
      next = jest.fn();
      request = createRequest({
        headers: {
          [headerName]: correlationId,
        },
      });
      request.get.mockReturnValue(correlationId);
      response = createResponse();

      return requestCorrelatorMiddleware(request, response, next);
    });

    it('should continue through the middleware chain', () => {
      expect(next).toHaveBeenCalled();
    });

    it('should return the existing correlation id', () => {
      expect(request.correlator.getCorrelationId()).toEqual(correlationId);
    });

    it('should return the default header name', () => {
      expect(request.correlator.getHeaderName()).toEqual(headerName);
    });

    it('should forward the existing correlation id', () => {
      const headesWithoutCorrelationId = {};

      expect(
        request.correlator.forwardCorrelationId({
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
    let request;
    let response;
    let next;

    describe('when generator returns id', () => {
      const correlationId = 'existing-id';
      beforeEach(() => {
        next = jest.fn();
        request = createRequest({
          headers: {
            [headerName]: null,
          },
        });
        request.get.mockReturnValue(null);
        uuidV4.mockReturnValue(correlationId);
        response = createResponse();

        return requestCorrelatorMiddleware(request, response, next);
      });

      it('should continue through the middleware chain', () => {
        expect(next).toHaveBeenCalled();
      });

      it('should return a new correlation id', () => {
        expect(request.correlator.getCorrelationId()).toEqual(correlationId);
      });

      it('should return the default header name', () => {
        expect(request.correlator.getHeaderName()).toEqual(headerName);
      });

      it('should forward the existing correlation id', () => {
        const headesWithoutCorrelationId = {};

        expect(
          request.correlator.forwardCorrelationId({
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
        request = createRequest({
          headers: {
            [headerName]: null,
          },
        });
        request.get.mockReturnValue(null);
        uuidV4.mockReturnValue(null);
        response = createResponse();

        return requestCorrelatorMiddleware(request, response, next);
      });

      it('should continue through the middleware chain', () => {
        expect(next).toHaveBeenCalled();
      });

      it('should return a new correlation id through ifNotDefined', () => {
        expect(
          request.correlator.getCorrelationId({
            ifNotDefined,
          })
        ).toEqual(correlationId);
      });

      it('should return the default header name', () => {
        expect(request.correlator.getHeaderName()).toEqual(headerName);
      });

      it('should forward the existing correlation id through ifNotDefined', () => {
        const headesWithoutCorrelationId = {};

        expect(
          request.correlator.forwardCorrelationId({
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
  let request;
  let response;
  let next;
  const correlationId = 'existing-id';
  const generateId = () => correlationId;
  const headerName = 'X-Request-Id';
  const requestCorrelatorMiddleware = createRequestCorrelatorMiddleware({
    headerName,
    generateId,
  });

  beforeEach(() => {
    next = jest.fn();
    request = createRequest({
      headers: {
        [headerName]: correlationId,
      },
    });
    request.get.mockReturnValue(correlationId);
    response = createResponse();

    return requestCorrelatorMiddleware(request, response, next);
  });

  it('should continue through the middleware chain', () => {
    expect(next).toHaveBeenCalled();
  });

  it('should return the existing correlation id', () => {
    expect(request.correlator.getCorrelationId()).toEqual(correlationId);
  });

  it('should return the default header name', () => {
    expect(request.correlator.getHeaderName()).toEqual(headerName);
  });

  it('should forward the existing correlation id', () => {
    const headesWithoutCorrelationId = {};

    expect(
      request.correlator.forwardCorrelationId({
        headers: headesWithoutCorrelationId,
      })
    ).toEqual(correlationId);
    expect(headesWithoutCorrelationId).toHaveProperty(
      headerName,
      correlationId
    );
  });
});
