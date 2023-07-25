export class NotFoundError extends Error {
  constructor(public readonly message: string) {
    super(message);
  }
}
