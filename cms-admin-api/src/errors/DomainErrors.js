class DomainError extends Error { constructor(msg, status) { super(msg); this.status = status; } }
class NotFoundError extends DomainError { constructor(msg) { super(msg, 404); } }
class ConflictError extends DomainError { constructor(msg) { super(msg, 409); } }
class ValidationError extends DomainError { constructor(msg) { super(msg, 400); } }
module.exports = { DomainError, NotFoundError, ConflictError, ValidationError };