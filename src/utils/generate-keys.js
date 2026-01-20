#!/usr/bin/env node

/**
 * MYPatients.ie - Security Key Generator
 * 
 * This script generates cryptographically secure random keys
 * for use in your .env file
 * 
 * Usage: node generate-keys.js
 */

const crypto = require('crypto');

console.log('\n==============================================');
console.log('MYPatients.ie - Security Key Generator');
console.log('==============================================\n');

// Generate various keys
const sessionSecret = crypto.randomBytes(32).toString('hex');
const jwtSecret = crypto.randomBytes(32).toString('hex');
const encryptionKey = crypto.randomBytes(32).toString('hex');
const backupEncryptionKey = crypto.randomBytes(32).toString('hex');

// Generate a strong database password
function generateStrongPassword(length = 24) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let password = '';
    const randomBytes = crypto.randomBytes(length);
    
    for (let i = 0; i < length; i++) {
        password += charset[randomBytes[i] % charset.length];
    }
    
    return password;
}

const dbPassword = generateStrongPassword();
const redisPassword = generateStrongPassword();

console.log('Copy these values to your .env file:\n');
console.log('# Session & Authentication');
console.log(`SESSION_SECRET=${sessionSecret}`);
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`ENCRYPTION_KEY=${encryptionKey}`);
console.log('');

console.log('# Database & Cache');
console.log(`DB_PASSWORD=${dbPassword}`);
console.log(`REDIS_PASSWORD=${redisPassword}`);
console.log('');

console.log('# Backup');
console.log(`BACKUP_ENCRYPTION_KEY=${backupEncryptionKey}`);
console.log('');

console.log('==============================================');
console.log('⚠️  IMPORTANT SECURITY NOTES:');
console.log('==============================================');
console.log('1. NEVER commit these keys to version control');
console.log('2. Store production keys in a secure vault (AWS Secrets Manager, Azure Key Vault, etc.)');
console.log('3. Rotate these keys regularly (every 90 days recommended)');
console.log('4. Use different keys for development, staging, and production');
console.log('5. Keep a secure backup of production keys in case of emergency');
console.log('6. For HIPAA compliance, encrypt all patient data at rest');
console.log('==============================================\n');

// Additional: Generate a sample JWT token structure
console.log('Sample JWT Token Payload Structure:');
console.log(JSON.stringify({
    userId: 'PAT-12345',
    email: 'user@example.com',
    role: 'patient',
    permissions: ['read:own_records', 'update:own_profile'],
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
}, null, 2));
console.log('');

// Show how to use crypto for password hashing
console.log('\n==============================================');
console.log('Password Hashing Example (use bcrypt in production):');
console.log('==============================================');
console.log(`
const bcrypt = require('bcrypt');
const saltRounds = 12; // Higher = more secure but slower

async function hashPassword(password) {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

async function verifyPassword(password, hash) {
    const match = await bcrypt.compare(password, hash);
    return match;
}
`);
