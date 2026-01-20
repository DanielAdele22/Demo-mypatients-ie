# MYPatients.ie

A secure patient management system demo with admin dashboard and patient portal.

## Features

- **Secure Login System** - Role-based authentication for admins and patients
- **Admin Dashboard** - View all patients, filter, search, and manage records
- **Patient Portal** - Patients can view their own appointments, documents, and medical reports
- **Dark/Light Mode** - Toggle between themes with preference saved
- **Security Features**:
  - XSS prevention with input sanitization
  - Content Security Policy headers
  - Rate limiting on login attempts
  - Role-based access control
  - Audit logging

## Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Patient | `P-10001` (any Patient ID) | `patient123` |

## Live Demo

Visit: [https://YOUR_USERNAME.github.io/mypatients-ie](https://YOUR_USERNAME.github.io/mypatients-ie)

## Security Notice

This is a **demonstration project** with mock data. In a production environment:
- Never store API keys in client-side code
- Use HTTPS and secure backend authentication
- Implement proper database encryption (HIPAA compliance)
- Use environment variables for sensitive configuration

## License

MIT License - Feel free to use and modify.
