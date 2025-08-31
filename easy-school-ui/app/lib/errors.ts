// lib/errors.ts
export class UnauthorizedError extends Error {
  status = 401 as const;
  constructor(msg = 'Unauthorized') { super(msg); this.name = 'UnauthorizedError'; }
}
export class ForbiddenError extends Error {
  status = 403 as const;
  constructor(msg = 'Forbidden') { super(msg); this.name = 'ForbiddenError'; }
}
