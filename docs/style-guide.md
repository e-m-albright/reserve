---
title: Documentation Style Guide
---

# Documentation Style Guide

Guidelines for writing and maintaining documentation in this project.

## Formatting

### Headers
- Use `#` for main title (one per file)
- Use `##` for major sections
- Use `###` for subsections
- Don't skip header levels

### Code Blocks
- Use triple backticks with language identifier
- Include file paths in comments when relevant
- Keep examples concise and runnable

```typescript
// apps/api/src/index.ts
export default {
  async fetch(request: Request): Promise<Response> {
    return new Response('Hello');
  }
};
```

### Lists
- Use `-` for unordered lists
- Use `1.` for ordered lists
- Indent nested lists with 2 spaces

### Links
- Use descriptive link text
- Link to other docs when relevant
- Use relative paths: `[Link](./other-file.md)`

## Content Guidelines

### Clarity
- Write for your audience (developers, users, admins)
- Use simple, direct language
- Avoid jargon unless necessary
- Explain acronyms on first use

### Structure
- Start with an overview
- Use headings to organize content
- Break long sections into smaller pieces
- Include examples

### Accuracy
- Keep documentation up-to-date with code
- Review docs when code changes
- Mark deprecated content clearly
- Include version numbers when relevant

## File Naming

- Use lowercase with hyphens: `getting-started.md`
- Be descriptive: `authentication.md` not `auth.md`
- Use `README.md` for directory indexes
- Avoid spaces and special characters

## Common Patterns

### Setup Instructions
```markdown
## Prerequisites
- Item 1
- Item 2

## Installation
1. Step one
2. Step two

## Verification
Run this command to verify:
\`\`\`bash
command here
\`\`\`
```

### Code Examples
```markdown
## Example

Here's how to use it:

\`\`\`typescript
// Example code
const example = 'value';
\`\`\`

**Note**: Important caveat or warning.
```

### Warnings and Notes
- Use `> **Warning**:` for warnings
- Use `> **Note**:` for notes
- Use `> **Tip**:` for tips

## Review Checklist

Before submitting documentation:
- [ ] Spelling and grammar checked
- [ ] Code examples tested
- [ ] Links verified
- [ ] Headers properly nested
- [ ] Consistent formatting
- [ ] Up-to-date with code
