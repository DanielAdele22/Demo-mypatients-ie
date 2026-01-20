# Contributing to MYPatients.ie

Thank you for your interest in contributing to MYPatients.ie! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Making Changes](#making-changes)
- [Testing Requirements](#testing-requirements)
- [Security Considerations](#security-considerations)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

This project adheres to the Contributor Covenant Code of Conduct. By participating, you are expected to uphold this code. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## Getting Started

1. **Fork the repository** to your GitHub account
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/Demo-mypatients-ie.git
   cd Demo-mypatients-ie
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/DanielAdele22/Demo-mypatients-ie.git
   ```

## Development Setup

### Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- Git
- A text editor (VS Code recommended)

### Initial Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp config/env.example .env
   ```
   Then edit `.env` with your local configuration.

3. **Generate security keys**:
   ```bash
   npm run generate-keys
   ```
   Copy the generated keys to your `.env` file.

4. **Start the development server**:
   ```bash
   npm run dev
   ```

The application should now be running at `http://localhost:3000`.

## Project Structure

```
Demo-mypatients-ie/
├── .github/              # GitHub configuration
│   ├── ISSUE_TEMPLATE/   # Issue templates
│   └── workflows/        # GitHub Actions workflows
├── config/               # Configuration files
│   ├── security-config.js
│   └── env.example
├── docs/                 # Documentation
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── SECURITY.md
├── public/               # Static files
│   └── index.html
├── src/                  # Source code
│   ├── server.js         # Main server file
│   └── utils/            # Utility functions
├── .gitignore
├── CHANGELOG.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
└── package.json
```

## Coding Standards

### JavaScript Style Guide

- Use ES6+ features where appropriate
- Use `const` and `let` instead of `var`
- Use arrow functions for callbacks
- Use template literals for string interpolation
- Follow 2-space indentation
- Use semicolons
- Use meaningful variable and function names
- Add JSDoc comments for functions and classes

### Code Quality

- Run ESLint before committing:
  ```bash
  npm run lint
  ```
- Ensure your code passes all existing tests
- Write tests for new features
- Keep functions small and focused
- Avoid deeply nested code
- Handle errors properly with try-catch blocks

### Security Best Practices

- Never commit sensitive data (API keys, passwords, etc.)
- Always validate and sanitize user input
- Use parameterized queries for database operations
- Follow OWASP security guidelines
- Keep dependencies up to date
- Use HTTPS in production
- Implement proper authentication and authorization

## Making Changes

### Branch Naming

Use descriptive branch names following these patterns:
- `feature/description` - for new features
- `fix/description` - for bug fixes
- `docs/description` - for documentation updates
- `refactor/description` - for code refactoring
- `test/description` - for adding tests

Example: `feature/add-patient-search` or `fix/login-validation`

### Commit Messages

Write clear, descriptive commit messages:
- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters
- Reference issues and pull requests when relevant

Good examples:
```
Add patient search functionality

Implement search feature that allows filtering patients by:
- Name
- Patient ID
- Date of birth
- Insurance provider

Closes #123
```

### Keep Your Fork Updated

Before starting new work, sync with upstream:
```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## Testing Requirements

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### Writing Tests

- Write unit tests for new functions and modules
- Write integration tests for API endpoints
- Ensure tests are independent and can run in any order
- Use descriptive test names that explain what is being tested
- Aim for good code coverage (>80%)

Example test structure:
```javascript
describe('Patient API', () => {
  describe('GET /api/patients/:id', () => {
    it('should return patient data for valid ID', async () => {
      // Test implementation
    });

    it('should return 404 for non-existent patient', async () => {
      // Test implementation
    });

    it('should return 401 for unauthenticated requests', async () => {
      // Test implementation
    });
  });
});
```

## Security Considerations

This is a healthcare application dealing with sensitive patient data. Special attention must be paid to security:

### Required Security Checks

1. **Input Validation**
   - Validate all user input
   - Sanitize data to prevent XSS
   - Use prepared statements to prevent SQL injection

2. **Authentication & Authorization**
   - Implement proper role-based access control
   - Verify user permissions for each action
   - Use secure session management

3. **Data Protection**
   - Encrypt sensitive data at rest
   - Use HTTPS for data in transit
   - Follow HIPAA guidelines for PHI (Protected Health Information)

4. **Security Testing**
   - Run security checks before committing:
     ```bash
     npm run security-check
     ```
   - Check for vulnerable dependencies
   - Test for common security vulnerabilities

### HIPAA Compliance

When working with patient data:
- Ensure all access is logged (audit trail)
- Implement proper data backup and recovery
- Follow minimum necessary principle
- Encrypt all PHI (Protected Health Information)
- Implement automatic session timeout

## Pull Request Process

1. **Create a Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Select your feature branch
   - Fill out the PR template completely

2. **PR Requirements**
   - [ ] Code follows the style guide
   - [ ] All tests pass
   - [ ] New tests added for new features
   - [ ] Documentation updated (if applicable)
   - [ ] Security checks passed
   - [ ] No merge conflicts
   - [ ] Commit messages are clear and descriptive

3. **Review Process**
   - At least one maintainer review is required
   - Address all review comments
   - Keep the PR focused and avoid scope creep
   - Be responsive to feedback

4. **After Approval**
   - Maintainers will merge your PR
   - Your changes will be included in the next release
   - Delete your feature branch after merge

## Reporting Issues

### Bug Reports

Use the bug report template and include:
- Clear description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, Node version)
- Error messages or logs

### Feature Requests

Use the feature request template and include:
- Clear description of the feature
- Use case and benefits
- Proposed implementation (if you have ideas)
- Examples from other applications (if relevant)

### Security Vulnerabilities

**DO NOT** create a public issue for security vulnerabilities. Instead:
1. Email security@mypatients.ie (if available)
2. Or use GitHub's security advisory feature
3. Provide details privately
4. Allow time for a patch before public disclosure

## Questions?

- Check existing documentation in the `docs/` folder
- Search existing issues and discussions
- Create a new issue with the "question" label
- Reach out to maintainers

## License

By contributing to MYPatients.ie, you agree that your contributions will be licensed under the MIT License.

## Thank You!

Your contributions make this project better. We appreciate your time and effort! 🙏
