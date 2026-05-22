export class UnauthorizedError extends Error {
  constructor(message = 'Sem autorização') {
    super(message)
  }
}
