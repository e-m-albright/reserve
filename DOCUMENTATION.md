# Documentation Guide

This document explains how documentation is organized in this project and explores modern documentation tools and alternatives.

## Current Approach: Organized Markdown

We use **plain Markdown files** organized in a `docs/` directory structure. This approach:

- ✅ **Simple** - No build step, works everywhere
- ✅ **Version controlled** - Docs live with code
- ✅ **Fast** - No compilation needed
- ✅ **Portable** - Works with any Markdown viewer
- ✅ **GitHub-friendly** - Renders beautifully on GitHub

## Documentation Structure

```
docs/
├── getting-started/     # Onboarding and setup
│   ├── README.md
│   └── setup.md
├── architecture/        # System design and decisions
│   ├── README.md
│   ├── decisions.md
│   ├── authentication.md
│   └── ...
├── development/         # Developer guides
│   ├── README.md
│   └── recipes.md
├── operations/          # Deployment and operations
│   ├── README.md
│   └── secrets.md
└── reference/           # API and configuration reference
    └── README.md
```

## Modern Documentation Tools (2025)

If you want to enhance documentation in the future, here are modern alternatives:

### Lightweight Options

#### 1. **mdBook** (Recommended for Technical Docs)
- **What**: Rust-based book generator (like GitBook)
- **Best for**: Technical documentation, API docs, books
- **Pros**: Fast builds, simple, great for versioned docs
- **Cons**: Less UI customization
- **Setup**: `cargo install mdbook` or `brew install mdbook`
- **Example**: [Rust Book](https://doc.rust-lang.org/book/)

#### 2. **Dory**
- **What**: Minimal MDX-focused static site generator
- **Best for**: Simple docs sites with MDX support
- **Pros**: Very lightweight, Preact-based, no SSR complexity
- **Cons**: Smaller ecosystem

#### 3. **DocuNext**
- **What**: Next.js + MDX + Tailwind docs generator
- **Best for**: If you're already using Next.js
- **Pros**: Familiar stack, good customization
- **Cons**: Requires Next.js knowledge

### Full-Featured Options

#### 4. **Docusaurus** (Meta)
- **What**: React-based static site generator
- **Best for**: Large documentation sites, versioning, i18n
- **Pros**: Versioning, search, plugin ecosystem, great for teams
- **Cons**: More setup, requires React knowledge
- **Example**: [React Native Docs](https://reactnative.dev/)

#### 5. **Fumadocs**
- **What**: Next.js + MDX docs framework
- **Best for**: Modern Next.js projects
- **Pros**: Built-in search, theming, interactive components
- **Cons**: Next.js dependency

#### 6. **Mintlify**
- **What**: Hosted docs platform
- **Best for**: Teams wanting hosted solution
- **Pros**: Great UI, GitHub integration, collaboration
- **Cons**: Proprietary, pricing scales

### Specialized Tools

#### 7. **mdBook** (for API Docs)
- Already mentioned above - excellent for API documentation

#### 8. **Fern Platform**
- **What**: MDX + OpenAPI platform
- **Best for**: API documentation with OpenAPI schemas
- **Pros**: Great for API docs, interactive

## Recommendation for This Project

### Current: Stick with Organized Markdown ✅

For now, **organized Markdown files** are perfect because:
- Small project, simple needs
- No build complexity
- Works immediately
- Easy to maintain

### Future: Consider mdBook

If documentation grows, consider **mdBook** because:
- ✅ Lightweight and fast
- ✅ Great for technical docs
- ✅ Versioning support
- ✅ No JavaScript/React overhead
- ✅ Can generate PDFs
- ✅ Simple setup

### Setup mdBook (Optional)

```bash
# Install
cargo install mdbook
# or
brew install mdbook

# Initialize
mdbook init docs

# Serve locally
mdbook serve

# Build
mdbook build
```

## Documentation Best Practices

### Structure
- ✅ Organize by audience and topic
- ✅ Keep folder depth shallow (3-5 levels max)
- ✅ Use clear, descriptive filenames
- ✅ Include README.md in each directory

### Content
- ✅ Write for your audience (developers, users, admins)
- ✅ Keep files focused and modular
- ✅ Cross-link related topics
- ✅ Include code examples
- ✅ Keep it up-to-date

### Maintenance
- ✅ Review docs with code changes
- ✅ Archive deprecated content
- ✅ Use consistent formatting
- ✅ Add diagrams when helpful

## Tools for Markdown Enhancement

Even with plain Markdown, you can enhance:

### VS Code Extensions
- **Markdown All in One** - Preview, formatting, TOC
- **Markdown Preview Enhanced** - Advanced preview
- **markdownlint** - Linting

### CLI Tools
- **markdownlint** - Lint Markdown files
- **markdown-toc** - Generate table of contents
- **mdbook** - Generate book-style docs

### GitHub Features
- **GitHub Pages** - Host docs automatically
- **GitHub Wiki** - Alternative docs location
- **GitHub Discussions** - Q&A and community

## Migration Path

If you want to upgrade later:

1. **Start small**: Keep current structure
2. **Add mdBook**: Convert to mdBook format gradually
3. **Enhance**: Add search, versioning as needed
4. **Scale**: Move to Docusaurus if team grows

## Resources

- [mdBook Documentation](https://rust-lang.github.io/mdBook/)
- [Docusaurus Documentation](https://docusaurus.io/)
- [Documentation Best Practices](https://www.writethedocs.org/guide/)
- [Markdown Guide](https://www.markdownguide.org/)
