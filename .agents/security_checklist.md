# Security & PII Checklist

## Authentication & Authorization

* [ ] Is the route protected by a session check?
* [ ] Are we using Secure/HttpOnly cookies?
* [ ] Is there a Rate Limiter on this endpoint?

## Data Protection

* [ ] Are we logging PII (Emails, IDs, Phone numbers)? **(MUST BE NO)**
* [ ] Is sensitive data encrypted at rest in the DB?
* [ ] Are all inputs sanitized to prevent SQL Injection / XSS?

## Production Readiness

* [ ] Are environment variables validated at runtime?
* [ ] Is the CORS policy restricted to known origins?
* [ ] Does the schema migration have a rollback script?

