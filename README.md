# MYPatients.ie - Secure Setup Guide

## 🚀 Quick Setup (5 Minutes)

Follow these steps to set up a secure environment for your patient management system.

---

## Step 1: Install Dependencies

```bash
npm install
```

This installs all the security packages needed for your application.

---

## Step 2: Generate Security Keys

```bash
node generate-keys.js
```

**Output Example:**
```
==============================================
MYPatients.ie - Security Key Generator
==============================================

Copy these values to your .env file:

# Session & Authentication
SESSION_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
JWT_SECRET=z6y5x4w3v2u1t0s9r8q7p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1
ENCRYPTION_KEY=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z

# Database & Cache
DB_PASSWORD=Xk9$mP2#qL8@vN5!wR3^yT7&zQ1*bF6%
REDIS_PASSWORD=Qw9$eR2#tY8@uI5!oP3^aS7&dF1*gH6%

# Backup
BACKUP_ENCRYPTION_KEY=6z5y4x3w2v1u0t9s8r7q6p5o4n3m2l1k0j9i8h7g6f5e4d3c2b1a
==============================================
```

**Important**: These are random examples. Your actual keys will be different!

---

## Step 3: Create Your .env File

```bash
# Copy the example file
cp .env.example .env
```

Now edit the `.env` file and paste the keys you just generated:

```bash
# Open in your favorite editor
nano .env
# or
code .env
# or
vim .env
```

---

## Step 4: Update Your .env File

Replace the placeholder values with your generated keys:

```env
NODE_ENV=development
APP_PORT=3000
APP_URL=http://localhost:3000

# PASTE YOUR GENERATED KEYS HERE
SESSION_SECRET=your-generated-session-secret
JWT_SECRET=your-generated-jwt-secret
ENCRYPTION_KEY=your-generated-encryption-key

# Database (update with your actual credentials)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mypatients_db
DB_USER=postgres
DB_PASSWORD=your-generated-db-password

# Email (update with your SMTP settings)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@mypatients.ie

# Add other settings as needed
```

---

## Step 5: Verify Security Setup

Check that your `.env` file is properly excluded from Git:

```bash
git status
```

You should **NOT** see `.env` in the list. If you do:

```bash
git rm --cached .env
git add .gitignore
git commit -m "Ensure .env is not tracked"
```

---

## Step 6: Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

You should see:

```
============================================
🏥 MYPatients.ie Server
============================================
Environment: development
Port: 3000
URL: http://localhost:3000

Security Features Enabled:
✅ Helmet (Security Headers)
✅ CORS Protection
✅ Rate Limiting
✅ XSS Protection
✅ NoSQL Injection Prevention
✅ CSRF Protection
✅ Secure Sessions
✅ Audit Logging
✅ Input Validation
✅ File Upload Security
============================================
```

---

## 🔐 Security Checklist

Before deploying to production, make sure:

- [ ] ✅ Environment variables are set
- [ ] ✅ `.env` is in `.gitignore`
- [ ] ✅ Strong database password (20+ chars)
- [ ] ✅ Different keys for dev/staging/production
- [ ] ✅ HTTPS/SSL certificate installed
- [ ] ✅ Firewall configured
- [ ] ✅ Regular backups enabled
- [ ] ✅ Audit logging enabled

---

## 📁 File Structure

```
mypatients-ie/
├── .env                      # YOUR SECRETS (DO NOT COMMIT!)
├── .env.example              # Template for .env
├── .gitignore                # Prevents committing secrets
├── package.json              # Dependencies
├── generate-keys.js          # Security key generator
├── security-config.js        # Security configuration
├── server.js                 # Main server file
├── SECURITY.md               # Detailed security docs
├── README.md                 # This file
└── demo_patient_checklist.html  # Your frontend
```

---

## 🆘 Common Issues

### Problem: "Environment variable not found"

**Solution**: Make sure your `.env` file exists and has the correct variable names.

```bash
# Check if .env exists
ls -la .env

# Verify it has content
cat .env
```

### Problem: "Port already in use"

**Solution**: Change the port in `.env`:

```env
APP_PORT=3001
```

### Problem: "Cannot find module 'helmet'"

**Solution**: Install dependencies:

```bash
npm install
```

---

## 📚 Next Steps

1. **Read the full security documentation**: `SECURITY.md`
2. **Set up your database**: Create the database and tables
3. **Implement authentication**: Add user registration/login
4. **Configure email**: Set up SMTP for notifications
5. **Set up file storage**: Configure AWS S3 for medical records
6. **Enable HTTPS**: Get SSL certificate (Let's Encrypt)
7. **Deploy to production**: Use PM2 or Docker

---

## 🔒 Security Reminders

### ⚠️ NEVER commit these files:
- `.env` - Contains all your secrets
- `node_modules/` - Dependencies (large)
- `uploads/` - User files
- `*.log` - Log files

### ✅ ALWAYS do this:
- Use different keys for dev/production
- Enable HTTPS in production
- Keep dependencies updated (`npm audit`)
- Review audit logs regularly
- Back up your database daily

---

## 📧 Support

Need help? Check:

1. **Security Documentation**: See `SECURITY.md`
2. **Code Comments**: Check the inline comments in the code
3. **Package Documentation**: Visit npm package pages

---

## 🎉 You're All Set!

Your secure patient management system is ready for development. Remember to:

- Keep your `.env` file safe
- Never share your secrets
- Update dependencies regularly
- Follow HIPAA compliance guidelines

**Happy coding! 🏥**
