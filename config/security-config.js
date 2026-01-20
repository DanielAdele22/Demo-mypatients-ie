/**
 * MYPatients.ie - Security Configuration
 * 
 * This module sets up comprehensive security for a healthcare application
 * following HIPAA compliance requirements
 */

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const crypto = require('crypto');

/**
 * Security Middleware Configuration
 */
class SecurityConfig {
    /**
     * Initialize Helmet for security headers
     */
    static helmet() {
        return helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                    fontSrc: ["'self'", "https://fonts.gstatic.com"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", "data:", "https:"],
                    connectSrc: ["'self'"],
                    frameSrc: ["'none'"],
                    objectSrc: ["'none'"],
                    upgradeInsecureRequests: [],
                },
            },
            hsts: {
                maxAge: 31536000, // 1 year
                includeSubDomains: true,
                preload: true,
            },
            frameguard: {
                action: 'deny', // Prevent clickjacking
            },
            noSniff: true, // Prevent MIME type sniffing
            xssFilter: true,
            referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
        });
    }

    /**
     * CORS Configuration - Strict for healthcare data
     */
    static cors() {
        const whitelist = process.env.CORS_ORIGIN ? 
            process.env.CORS_ORIGIN.split(',') : 
            ['http://localhost:3000'];

        return cors({
            origin: function (origin, callback) {
                // Allow requests with no origin (mobile apps, curl, etc.)
                if (!origin) return callback(null, true);
                
                if (whitelist.indexOf(origin) !== -1) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            credentials: true, // Allow cookies
            optionsSuccessStatus: 200,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        });
    }

    /**
     * Rate Limiting - Prevent brute force attacks
     */
    static rateLimiter() {
        return rateLimit({
            windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
            max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
            message: 'Too many requests from this IP, please try again later.',
            standardHeaders: true,
            legacyHeaders: false,
            // Store in Redis for production (handles distributed systems)
            // store: new RedisStore({ client: redisClient }),
        });
    }

    /**
     * Strict rate limiting for authentication endpoints
     */
    static authRateLimiter() {
        return rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 5, // Only 5 login attempts per 15 minutes
            message: 'Too many login attempts, please try again after 15 minutes.',
            skipSuccessfulRequests: true, // Don't count successful logins
        });
    }

    /**
     * NoSQL Injection Prevention
     */
    static mongoSanitize() {
        return mongoSanitize({
            replaceWith: '_',
            onSanitize: ({ req, key }) => {
                console.warn(`Potential NoSQL injection attempt detected: ${key}`);
            },
        });
    }

    /**
     * XSS Attack Prevention
     */
    static xssClean() {
        return xss();
    }

    /**
     * HTTP Parameter Pollution Prevention
     */
    static hpp() {
        return hpp({
            whitelist: ['sort', 'fields', 'page', 'limit'], // Allow these duplicate params
        });
    }

    /**
     * Generate CSRF Token
     */
    static generateCsrfToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    /**
     * Validate CSRF Token
     */
    static validateCsrfToken(token, sessionToken) {
        if (!token || !sessionToken) return false;
        return crypto.timingSafeEqual(
            Buffer.from(token),
            Buffer.from(sessionToken)
        );
    }

    /**
     * Encrypt sensitive data (for HIPAA compliance)
     */
    static encrypt(text) {
        const algorithm = 'aes-256-gcm';
        const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
        const iv = crypto.randomBytes(16);

        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const authTag = cipher.getAuthTag();

        return {
            encrypted,
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex'),
        };
    }

    /**
     * Decrypt sensitive data
     */
    static decrypt(encryptedData) {
        const algorithm = 'aes-256-gcm';
        const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
        const iv = Buffer.from(encryptedData.iv, 'hex');
        const authTag = Buffer.from(encryptedData.authTag, 'hex');

        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }

    /**
     * Hash sensitive data (one-way, for storing)
     */
    static hash(data) {
        return crypto
            .createHash('sha256')
            .update(data)
            .digest('hex');
    }

    /**
     * Audit Log Middleware (HIPAA requirement)
     */
    static auditLogger() {
        return (req, res, next) => {
            const logEntry = {
                timestamp: new Date().toISOString(),
                userId: req.user?.id || 'anonymous',
                userRole: req.user?.role || 'unknown',
                action: req.method,
                resource: req.originalUrl,
                ip: req.ip || req.connection.remoteAddress,
                userAgent: req.get('user-agent'),
                status: res.statusCode,
            };

            // Log to file or database
            if (process.env.AUDIT_LOG_ENABLED === 'true') {
                // In production, use a proper logging service (Winston, Bunyan, etc.)
                console.log('[AUDIT]', JSON.stringify(logEntry));
            }

            next();
        };
    }

    /**
     * Session Configuration (secure)
     */
    static sessionConfig() {
        return {
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true, // Prevent XSS
                secure: process.env.NODE_ENV === 'production', // HTTPS only in production
                sameSite: 'strict', // CSRF protection
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
            },
            name: 'sessionId', // Don't use default 'connect.sid'
            // For production, use Redis store:
            // store: new RedisStore({ client: redisClient }),
        };
    }

    /**
     * Input Validation Helper
     */
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Password Strength Validation
     */
    static validatePasswordStrength(password) {
        // Minimum 8 characters, at least one uppercase, one lowercase, one number, one special char
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    /**
     * Sanitize filename for uploads
     */
    static sanitizeFilename(filename) {
        return filename
            .replace(/[^a-zA-Z0-9.-]/g, '_')
            .replace(/\.{2,}/g, '.')
            .substring(0, 255);
    }
}

module.exports = SecurityConfig;
