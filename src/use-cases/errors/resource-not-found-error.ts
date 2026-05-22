export class ResourceNotFoundError extends Error {
  constructor(resource?: string) {
    super(resource ? `${resource} não encontrado` : 'Recurso não encontrado')
  }
}
