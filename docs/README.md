---
title: Documentation Index
---

# Documentation Index

Welcome to the Reserve project documentation. This directory contains all project documentation organized by topic and audience.

## Quick Links

- **[Getting Started](./getting-started/README.md)** - Setup and installation
- **[Architecture](./architecture/README.md)** - System design and decisions
- **[Development](./development/README.md)** - Developer guides and recipes
- **[Operations](./operations/README.md)** - Deployment, monitoring, and maintenance
- **[Reference](./reference/README.md)** - API references and configuration

## Documentation Structure

```
docs/
├── getting-started/     # Onboarding and setup
├── architecture/        # System design and decisions
├── development/        # Developer guides
├── operations/         # Deployment and operations
└── reference/          # API and configuration reference
```

## Contributing

When adding new documentation:
1. Place files in the appropriate directory
2. Update the relevant README.md index
3. Follow the [style guide](./style-guide.md)
4. Link from the main README.md if it's important

## Documentation Tools

This project uses plain Markdown files for simplicity. For future enhancements, consider:
- **mdBook** - Lightweight, Rust-based book generator
- **Docusaurus** - Full-featured React-based docs site
- **Mintlify** - Hosted docs platform with GitHub integration

See [DOCUMENTATION.md](../DOCUMENTATION.md) for more details on documentation tools and alternatives.
