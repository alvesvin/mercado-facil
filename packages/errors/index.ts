import type { TRPC_ERROR_CODE_KEY } from "@trpc/server";

// You cannot do anything about this error
export abstract class UnrecoverableError extends Error {
  public readonly code: TRPC_ERROR_CODE_KEY;

  constructor(args: { code?: TRPC_ERROR_CODE_KEY; message: string }) {
    super(args.message);
    this.code = args.code ?? "INTERNAL_SERVER_ERROR";
  }
}

// You have the permission to do something, but because of some state condition you cannot do it
export abstract class FlowInvarianceError extends Error {
  public readonly code: TRPC_ERROR_CODE_KEY;

  constructor(args: { code?: TRPC_ERROR_CODE_KEY; message: string }) {
    super(args.message);
    this.code = args.code ?? "PRECONDITION_FAILED";
  }
}

// You do not have the permission to do something
export abstract class AccessError extends Error {
  public readonly code: TRPC_ERROR_CODE_KEY;

  constructor(args: { code?: TRPC_ERROR_CODE_KEY; message: string }) {
    super(args.message);
    this.code = args.code ?? "FORBIDDEN";
  }
}

export class UnauthorizedError extends AccessError {
  constructor(message: string = "Unauthorized") {
    super({ message });
  }
}

export class ResourceNotFoundError extends UnrecoverableError {
  constructor(message: string = "Resource not found") {
    super({ message });
  }
}

export class ForbiddenError extends AccessError {
  constructor(message: string = "Forbidden") {
    super({ message });
  }
}
