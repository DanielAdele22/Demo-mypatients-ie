# MYPatients.ie - Security Documentation

## 🔐 Security Implementation Guide

This document outlines the security measures implemented in the MYPatients.ie application to ensure HIPAA compliance and protect sensitive patient data.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Environment Setup](#environment-setup)
3. [Security Features](#security-features)
4. [HIPAA Compliance](#hipaa-compliance)
5. [Best Practices](#best-practices)
6. [Security Checklist](#security-checklist)

---

## Quick Start

### 1. Generate Security Keys

```bash
# Install dependencies
npm install

# Generate secure random keys
node generate-keys.js
```

This will output secure keys that you need to copy into your `.env` file.

### 2. Create Environment File

```bash
# Copy the example file
cp .env.example .env

# Edit .env and paste your generated keys
nano .env
```

### 3. Start the Server

```bash
# Development
npm run dev

# Production
npm start
```

---

## Environment Setup

### Critical Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `SESSION_SECRET` | Session encryption key | ✅ | Generated 64-char hex |
| `JWT_SECRET` | JWT token signing key | ✅ | Generated 64-char hex |
| `ENCRYPTION_KEY` | Data encryption key | ✅ | Generated 64-char hex |
| `DB_PASSWORD` | Database password | ✅ | Strong password |
| `NODE_ENV` | Environment mode | ✅ | development/production |

### Never Commit These Files

- `.env` - Contains all secrets
- `node_modules/` - Dependencies
- `uploads/` - User uploaded files
- `*.log` - Log files
- `*.key`, `*.pem` - SSL certificates

---

## Security Features

### 1. **Helmet - Security Headers**

Protects against common web vulnerabilities:

- ✅ Content Security Policy (CSP)
- ✅ HTTP Strict Transport Security (HSTS)
- ✅ X-Frame-Options (Clickjacking protection)
- ✅ X-Content-Type-Options (MIME sniffing prevention)
- ✅ Referrer Policy

```javascript
app.use(SecurityConfig.helmet());
```

### 2. **Rate Limiting**

Prevents brute force and DoS attacks:

- **General API**: 100 requests per 15 minutes
- **Login endpoint**: 5 attempts per 15 minutes
- **Registration**: Standard rate limit

```javascript
app.use('/api/', SecurityConfig.rateLimiter());
app.post('/api/auth/login', SecurityConfig.authRateLimiter(), ...);
```

### 3. **Input Validation & Sanitization**

Prevents injection attacks:

- ✅ NoSQL injection prevention
- ✅ XSS (Cross-Site Scripting) protection
- ✅ HTTP Parameter Pollution prevention
- ✅ Email validation
- ✅ Password strength validation

```javascript
app.use(SecurityConfig.mongoSanitize());
app.use(SecurityConfig.xssClean());
app.use(SecurityConfig.hpp());
```

### 4. **CORS Protection**

Restricts which domains can access your API:

```javascript
// Only allow specific origins
CORS_ORIGIN=https://mypatients.ie,https://www.mypatients.ie
```

### 5. **Session Security**

Secure session management:

- ✅ HTTP-only cookies (prevents XSS)
- ✅ Secure flag (HTTPS only in production)
- ✅ SameSite strict (CSRF protection)
- ✅ Session expiration (24 hours)
- ✅ Redis store for distributed systems

### 6. **Data Encryption**

Encrypt sensitive patient data:

```javascript
// Encrypt sensitive data before storing
const encrypted = SecurityConfig.encrypt(patientSSN);
// Store: encrypted.encrypted, encrypted.iv, encrypted.authTag

// Decrypt when needed
const decrypted = SecurityConfig.decrypt({
    encrypted: data.encrypted,
    iv: data.iv,
    authTag: data.authTag
});
```

### 7. **Password Hashing**

Never store plain-text passwords:

```javascript
const bcrypt = require('bcrypt');

// Hash password (registration)
const saltRounds = 12;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Verify password (login)
const isValid = await bcrypt.compare(password, hashedPassword);
```

### 8. **File Upload Security**

Secure medical record uploads:

- ✅ File type validation (JPEG, PNG, PDF only)
- ✅ File size limits (10MB)
- ✅ Filename sanitization
- ✅ Virus scanning (recommended in production)
- ✅ S3 upload with encryption

### 9. **Audit Logging**

Track all access to patient data (HIPAA requirement):

```javascript
// Automatically logs:
// - User ID
// - Action performed
// - Resource accessed
// - Timestamp
// - IP address
// - User agent
```

### 10. **CSRF Protection**

Prevent Cross-Site Request Forgery:

```javascript
// Generate token
const csrfToken = SecurityConfig.generateCsrfToken();

// Validate token
const isValid = SecurityConfig.validateCsrfToken(token, sessionToken);
```

---

## HIPAA Compliance

### Required Security Measures

#### ✅ Access Control
- User authentication (username/password)
- Role-based access control (RBAC)
- Unique user identification
- Automatic logoff after inactivity

#### ✅ Audit Controls
- Audit logging of all PHI access
- Track who accessed what and when
- Retain logs for 6 years minimum

#### ✅ Integrity
- Protect against unauthorized modification
- Use checksums/hashes
- Version control for records

#### ✅ Transmission Security
- Encrypt data in transit (HTTPS/TLS)
- Use VPN for remote access
- Secure messaging for PHI

#### ✅ Encryption
- Encrypt data at rest (database, files)
- Use AES-256 encryption
- Secure key management

### PHI (Protected Health Information)

Always encrypt these fields:

- Social Security Numbers
- Medical Record Numbers
- Insurance Policy Numbers
- Health Plan Beneficiary Numbers
- Device Identifiers
- Biometric Identifiers
- Full-face Photos
- Any other unique identifying number

---

## Best Practices

### 🔑 Key Management

1. **Use a secrets manager** in production:
   - AWS Secrets Manager
   - Azure Key Vault
   - HashiCorp Vault

2. **Rotate keys regularly**:
   - Every 90 days recommended
   - Immediately if compromised

3. **Different keys per environment**:
   - Development keys ≠ Production keys

### 🔒 Password Policy

Enforce strong passwords:

```javascript
// Minimum requirements:
// - 8 characters minimum
// - At least one uppercase letter
// - At least one lowercase letter
// - At least one number
// - At least one special character
SecurityConfig.validatePasswordStrength(password);
```

### 🛡️ Database Security

1. **Use prepared statements** (prevent SQL injection)
2. **Enable SSL/TLS** for database connections
3. **Encrypt backups**
4. **Restrict database access** (firewall rules)
5. **Regular backups** with encryption

### 📧 Email Security

For password reset, notifications:

1. Use **verified email providers** (SendGrid, AWS SES)
2. **Don't include sensitive data** in emails
3. Use **time-limited tokens** for password reset
4. **Rate limit** email sending

### 🌐 HTTPS/SSL

Always use HTTPS in production:

```nginx
# Nginx example
server {
    listen 443 ssl http2;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
}
```

### 🔍 Security Monitoring

1. **Set up alerts** for:
   - Failed login attempts
   - Unusual access patterns
   - Large data exports
   - System errors

2. **Regular security audits**:
   ```bash
   npm audit
   npm run security-check
   ```

3. **Penetration testing**:
   - Quarterly recommended
   - After major changes

---

## Security Checklist

### Before Going to Production

- [ ] All environment variables set in `.env`
- [ ] `.env` file is in `.gitignore`
- [ ] Strong, unique passwords for all accounts
- [ ] Database password is strong (20+ characters)
- [ ] SSL/TLS certificates installed
- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] CORS configured with specific origins
- [ ] Rate limiting enabled
- [ ] Audit logging enabled
- [ ] File upload restrictions in place
- [ ] Session timeout configured
- [ ] Password strength requirements enforced
- [ ] Two-factor authentication implemented (recommended)
- [ ] Backup system in place
- [ ] Disaster recovery plan documented
- [ ] Security monitoring enabled
- [ ] HIPAA compliance review completed
- [ ] Penetration testing performed
- [ ] Legal review of privacy policy
- [ ] Staff security training completed

### Monthly Maintenance

- [ ] Review audit logs for suspicious activity
- [ ] Check for dependency updates (`npm audit`)
- [ ] Verify backups are working
- [ ] Review access control lists
- [ ] Update documentation

### Quarterly Maintenance

- [ ] Rotate security keys
- [ ] Penetration testing
- [ ] Security policy review
- [ ] Staff retraining
- [ ] Compliance audit

---

## Common Security Mistakes to Avoid

❌ **DON'T**:
- Store passwords in plain text
- Use weak encryption (MD5, SHA1)
- Trust user input without validation
- Store sensitive data in localStorage
- Log sensitive information
- Use default credentials
- Expose error details to users
- Commit `.env` files to Git
- Use HTTP in production
- Share credentials via email/chat

✅ **DO**:
- Use bcrypt for password hashing
- Use AES-256 for data encryption
- Validate and sanitize all inputs
- Use secure HTTP-only cookies
- Log access attempts (not the data)
- Change all default passwords
- Show generic error messages
- Use environment variables
- Enforce HTTPS everywhere
- Use a password manager

---

## Support & Resources

### Security Tools

- [Snyk](https://snyk.io/) - Dependency vulnerability scanning
- [OWASP ZAP](https://www.zaproxy.org/) - Web application security scanner
- [Burp Suite](https://portswigger.net/burp) - Security testing
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Check for vulnerabilities

### HIPAA Resources

- [HHS HIPAA Guidelines](https://www.hhs.gov/hipaa/index.html)
- [HIPAA Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/index.html)
- [OCR Audit Protocol](https://www.hhs.gov/hipaa/for-professionals/compliance-enforcement/audit/protocol/index.html)

### Contact

For security concerns or to report vulnerabilities:
- Email: security@mypatients.ie
- Do NOT post security issues publicly

---

**Last Updated**: January 2024  
**Version**: 1.0.0

---

**⚠️ IMPORTANT**: This is a starting point. Always consult with security professionals and legal advisors for your specific healthcare application needs.
