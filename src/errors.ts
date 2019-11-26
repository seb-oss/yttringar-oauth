export function badRequest(message: string) {
  const error = new Error(message)
  error.name = 'BadRequest'
  throw error
}

export function unauthorized(message: string) {
  const error = new Error(message)
  error.name = 'Unauthorized'
  throw error
}
