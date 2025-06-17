
````markdown
# Contributing to nest-devops-starter

Thank you for considering contributing to **nest-devops-starter**! 🎉  
This guide will help you understand how to contribute, report issues, and submit improvements.

---

## Table of Contents

- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Code Style](#code-style)
- [Branching Strategy](#branching-strategy)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)
- [Reporting Issues](#reporting-issues)
- [Contact](#contact)

---

## Getting Started

1. **Fork** the repository.
2. **Clone** your fork:
   ```bash
   git clone https://github.com/bradlab/nest-devops-starter.git
   cd nest-devops-starter
````

3. Install dependencies:

   ```bash
   npm install
   ```
4. Start development server:

   ```bash
   npm run start:dev
   ```

---

## How to Contribute

We welcome:

* 🔧 Bug fixes
* 🧩 Feature requests and enhancements
* 🧪 Improvements to testing or DevOps workflows
* 📝 Documentation updates

---

## Code Style

We follow the default NestJS + ESLint + Prettier configuration.

To format your code:

```bash
npm run lint
npm run format
```

Before committing, make sure your code passes all linting and tests:

```bash
npx tsc
npm run test
npm run lint
```

---

## Branching Strategy

* `main`: Stable production-ready code
* `develop`: Active development branch
* Feature branches: `feature/your-description`
* Bugfix branches: `fix/your-description`

---

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

Examples:

* `feat(auth): add JWT token support`
* `fix(api): handle 500 error on /users`
* `docs: update README with new setup steps`

---

## Pull Requests

1. Create your branch from `develop`.
2. Make sure your code is linted, tested, and formatted.
3. Open a PR to `develop` with a clear title and description.
4. Link related issues in the PR description if applicable.

Your PR will be reviewed and merged after approval.

---

## Reporting Issues

To report a bug or request a feature, [open a GitHub Issue](https://github.com/bradlab/nest-devops-starter/issues/new/choose).

Please include:

* A clear title and description
* Steps to reproduce (for bugs)
* Expected behavior
* Screenshots or logs if possible

---

## Contact

Maintainer: [@bradlab](https://github.com/bradlab)
You can also reach out by creating a new discussion or opening an issue.

---

Thanks for helping us improve **nest-devops-starter**! 🚀

```
