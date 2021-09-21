export class BannedFromStreamError extends Error {
  error: "banned";
  info: "You have been banned from this stream";

  constructor(message: string) {
    super(message);

    this.name = "BannedFromStreamError";
  }
}

export class UserNotFound extends Error {
  constructor() {
    super("User not found");

    this.name = "UserNotFound";
  }
}

export class InternalError extends Error {
  error: "internal-error";
  info: "Something went wrong";

  constructor() {
    super();

    this.name = "InternalError";
  }
}
