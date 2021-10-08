import { RpcException } from '@nestjs/microservices';

export class BaseError extends RpcException {
  status = 'error';
}

export class BannedFromStreamError extends BaseError {
  constructor() {
    super("You've been banned from this stream");

    this.name = 'BannedFromStreamError';
    this.message = "You've been banned from this stream";
  }
}

export class UserNotFound extends BaseError {
  constructor() {
    super('User not found');

    this.name = 'UserNotFound';
    this.message = 'Cannot find this user';
  }
}

export class InternalError extends BaseError {
  constructor() {
    super('Internal error');

    this.name = 'InternalError';
    this.message = 'Something went wrong';
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
    super('This user has another speaker banned');

    this.name = 'StreamHasBlockedSpeakerError';
    this.message = `Can't let this user speak: they have banned ${first_name} ${last_name}`;
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
    super('This user has been banned by another speaker');

    this.name = 'BlockedByAnotherSpeaker';
    this.message = `Can't let this user speak: they are banned by another speaker ${first_name} ${last_name}`;
  }
}

export class NoPermissionError extends BaseError {
  constructor() {
    super('No permission');

    this.name = 'NoPermissionError';
    this.message = "You don't have permissions to do that";
  }
}

export class StreamNotFound extends BaseError {
  constructor() {
    super('Stream not found');

    this.name = 'StreamNotFound';
    this.message = "Can't find this stream";
  }
}
