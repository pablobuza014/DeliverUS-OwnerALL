class ApiError extends Error {
  constructor (message, code) {
    super(message)
    this.code = code
  }
}
class ValidationError extends Error {
  constructor (message, code, errors) {
    super(message)
    this.code = code
    this.errors = errors
  }
}
class LoginError extends Error {
  constructor (errors) {
    super('Invalid credentials')
    this.code = 401
    this.errors = errors
  }
}

function handleError (error) {
  if (!error.response) {
    throw new ApiError(error.message)
  }
  if (error.response.status === 422) {
    throw new ValidationError(error.response.statusText, error.response.status, error.response.data.errors)
  } else if (error.response.status === 401 && error.response.config.url.includes('/login')) {
    throw new LoginError(error.response.data.errors)
  } else {
    throw new ApiError(error.response.statusText || error.message, error.response.status)
  }
}

export { ApiError, ValidationError, LoginError, handleError }
