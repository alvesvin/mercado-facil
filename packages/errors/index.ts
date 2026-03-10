import type { TRPC_ERROR_CODE_KEY } from "@trpc/server";

// You cannot do anything about this error
export abstract class UnrecoverableError extends Error {
  public readonly code: TRPC_ERROR_CODE_KEY;
  public readonly tag = "UnrecoverableError";

  constructor(args: { code?: TRPC_ERROR_CODE_KEY; message: string }) {
    super(args.message);
    this.code = args.code ?? "INTERNAL_SERVER_ERROR";
  }
}
UnrecoverableError.prototype.name = "UnrecoverableError";

// You have the permission to do something, but because of some state condition you cannot do it
export abstract class FlowInvarianceError extends Error {
  public readonly code: TRPC_ERROR_CODE_KEY;
  public readonly tag = "FlowInvarianceError";

  constructor(args: { code?: TRPC_ERROR_CODE_KEY; message: string }) {
    super(args.message);
    this.code = args.code ?? "PRECONDITION_FAILED";
  }
}
FlowInvarianceError.prototype.name = "FlowInvarianceError";

// You do not have the permission to do something
export abstract class AccessError extends Error {
  public readonly code: TRPC_ERROR_CODE_KEY;
  public readonly tag = "AccessError";

  constructor(args: { code?: TRPC_ERROR_CODE_KEY; message: string }) {
    super(args.message);
    this.code = args.code ?? "FORBIDDEN";
  }
}
AccessError.prototype.name = "AccessError";

export class UnauthorizedError extends AccessError {
  constructor(message: string = "Unauthorized") {
    super({ message });
  }
}
UnauthorizedError.prototype.name = "UnauthorizedError";

export class ResourceNotFoundError extends FlowInvarianceError {
  constructor(message: string = "Resource not found") {
    super({ message });
  }
}
ResourceNotFoundError.prototype.name = "ResourceNotFoundError";

export class ForbiddenError extends AccessError {
  constructor(message: string = "Forbidden") {
    super({ message });
  }
}
ForbiddenError.prototype.name = "ForbiddenError";
