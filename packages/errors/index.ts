import { Data } from "effect";

// You cannot do anything about this error
export abstract class UnrecoverableError extends Data.TaggedError("UnrecoverableError")<{
  status: number;
  message: string;
}> {}

// You have the permission to do something, but because of some state condition you cannot do it
export abstract class FlowInvarianceError extends Data.TaggedError("FlowInvarianceError")<{
  status: number;
  message: string;
}> {}

// You do not have the permission to do something
export abstract class AccessError extends Data.TaggedError("AccessError")<{
  status: number;
  message: string;
}> {}

export class UnauthorizedError extends AccessError {
  constructor(message: string = "Unauthorized") {
    super({ status: 401, message });
  }
}

export class ResourceNotFoundError extends UnrecoverableError {
  constructor(message: string = "Resource not found") {
    super({ status: 400, message });
  }
}

export class ForbiddenError extends AccessError {
  constructor(message: string = "Forbidden") {
    super({ status: 403, message });
  }
}
