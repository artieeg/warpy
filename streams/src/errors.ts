export interface IError {
  code: number;
}

export class AccessDeniedError extends Error implements IError {
  code = 403;
  constructor() {
    super("access denied");
  }
}
