class BaseError extends Error {
  info: string;
}

export class BannedFromStreamError extends BaseError {
  info: string;

  constructor(message: string) {
    super(message);

    this.name = "BannedFromStreamError";
    this.info = "You've been banned from this stream";
  }
}

export class UserNotFound extends BaseError {
  constructor() {
    super("User not found");

    this.name = "UserNotFound";
    this.info = "You've been banned from this stream";
  }
}

export class InternalError extends BaseError {
  constructor() {
    super();

    this.name = "InternalError";
    this.info = "Something went wrong";
  }
}

export class StreamHasBlockedSpeakerError extends BaseError {
  constructor({
    last_name,
    first_name,
  }: {
    last_name: string;
    first_name: string;
  }) {
    super();

    this.name = "StreamHasBlockedSpeakerError";
    this.info = `Can't let this user speak: they have banned ${first_name} ${last_name}`;
  }
}

export class BlockedByAnotherSpeaker extends BaseError {
  constructor({
    last_name,
    first_name,
  }: {
    last_name: string;
    first_name: string;
  }) {
    super();

    this.name = "BlockedByAnotherSpeaker";
    this.info = `Can't let this user speak: they are banned by another speaker ${first_name} ${last_name}`;
  }
}

export class NoPermissionError extends BaseError {
  constructor() {
    super();

    this.name = "NoPermissionError";
    this.info = "You don't have permissions to do that";
  }
}

export class StreamNotFound extends BaseError {
  constructor() {
    super();

    this.name = "StreamNotFound";
    this.info = "Can't find this stream";
  }
}
