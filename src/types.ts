import type { Request } from 'express';

export type TCorrelationId = string | undefined;
export type TGenerateIdOptions = {
  request: Request;
};
export type TMiddlewareOptions = {
  headerName: string;
  generateId: (options: TGenerateIdOptions) => TCorrelationId;
};
export type TGetCorrelationIdOptions = {
  ifNotDefined?: (
    options: Pick<TMiddlewareOptions, 'generateId'>
  ) => TCorrelationId;
};
export type TGetCorrelationId = (
  options?: TGetCorrelationIdOptions
) => TCorrelationId;
export type TForwardCorrelationIdOptions = {
  headers: Record<string, unknown>;
  ifNotDefined?: TGetCorrelationIdOptions['ifNotDefined'];
};
export type TRequestCorrelator = {
  getCorrelationId: TGetCorrelationId;
  getHeaderName: () => string;
  forwardCorrelationId: (
    options: TForwardCorrelationIdOptions
  ) => TCorrelationId;
};
export type TCorrelatedRequest = Request & {
  correlator: TRequestCorrelator;
};
