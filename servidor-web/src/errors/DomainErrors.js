class DomainError extends Error { 
  constructor(msg, status) { super(msg); this.status = status; } 
}
class NotFoundError extends DomainError { 
  constructor(msg) { super(msg, 404); } 
}
module.exports = { DomainError, NotFoundError };