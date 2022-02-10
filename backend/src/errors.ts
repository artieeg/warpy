import { RpcException } from '@nestjs/microservices';

export class BaseError extends RpcException {
  status = 'error';

  /**
   * Priority for the error
   * 0 - ignoring the error
   * 1 - show a toast
   * */
  priority: number = 1;
}

export class BannedFromStreamError extends BaseError {
  constructor() {
    super("You've been banned from this stream");

    this.name = 'BannedFromStreamError';
  }
}

export class UserNotFound extends BaseError {
  constructor() {
    super('User not found');

    this.name = 'UserNotFound';
  }
}

export class InternalError extends BaseError {
  constructor() {
    super('Internal error');

    this.name = 'InternalError';
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
  }
}

export class NoPermissionError extends BaseError {
  constructor() {
    super('No permission');

    this.name = 'NoPermissionError';
  }
}

export class StreamNotFound extends BaseError {
  constructor() {
    super('Stream not found');

    this.name = 'StreamNotFound';
  }
}

export class NotADeveloper extends BaseError {
  constructor() {
    super('Not a developer');

    this.name = 'NotADeveloper';
  }
}

export class InvalidVisual extends BaseError {
  constructor() {
    super('Visual should come from tenor.com');

    this.name = 'InvalidVisual';
  }
}

export class NotEnoughCoins extends BaseError {
  constructor() {
    super('Not enough coins');

    this.name = 'NotEnoughCoins';
  }
}

export class AppInviteNotFound extends BaseError {
  constructor() {
    super('The invite not found');

    this.name = 'AppInviteNotFound';
  }
}

export class AppInviteAlreadyAccepted extends BaseError {
  constructor() {
    super('The invite has been already accepted');

    this.name = 'AppInviteAlreadyAccepted';
  }
}

export class CantInviteYourself extends BaseError {
  constructor() {
    super('You cant invite yourself');

    this.name = 'CantInviteYourself';
  }
}

export class MaxVideoStreamers extends BaseError {
  constructor() {
    super('only 4 people can stream video at the same time');

    this.name = 'MaxVideoStreamers';
  }
}

export class MailSendError extends BaseError {
  constructor() {
    super('failed to send mail');

    this.name = 'MailSendError';
  }
}

export class WaitlistRecordExists extends BaseError {
  constructor(public field: 'email' | 'username') {
    super('waitlist record exists');

    this.name = 'WaitlistRecordExists';
  }
}
