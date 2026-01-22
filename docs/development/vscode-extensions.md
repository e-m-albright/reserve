---
title: VS Code Extension Configuration
---

# VS Code Extension Configuration

This project uses ESLint 9 (flat config) and Tailwind CSS 4, which require specific VS Code extension settings.

## Required Extensions

Install the recommended extensions:

1. **ESLint** (`dbaeumer.vscode-eslint`) - For linting
2. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`) - For Tailwind autocomplete
3. **Prettier** (`esbenp.prettier-vscode`) - For code formatting
4. **TypeScript** (`ms-vscode.vscode-typescript-next`) - Enhanced TypeScript support

VS Code should prompt you to install these when opening the workspace. Or install manually:

```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-typescript-next
```

## Configuration

Settings are configured in `.vscode/settings.json`:

### ESLint 9 Flat Config

The ESLint extension is configured to use flat config format:

```json
{
  "eslint.experimental.useFlatConfig": true,
  "eslint.workingDirectories": [
    { "pattern": "./apps/*" },
    { "pattern": "./packages/*" }
  ],
  "eslint.options": {
    "cache": true,
    "cacheLocation": ".eslintcache"
  }
}
```

### Tailwind CSS 4 IntelliSense

Tailwind CSS 4 uses a CSS-first approach, but the IntelliSense extension needs the config file path:

```json
{
  "tailwindCSS.experimental.configFile": "./apps/web/tailwind.config.ts",
  "tailwindCSS.files.exclude": [
    "**/.next/**",
    "**/node_modules/**",
    "**/.wrangler/**",
    "**/.turbo/**"
  ]
}
```

## Troubleshooting

### Extension Hanging

If ESLint or Tailwind CSS IntelliSense extensions hang:

1. **Reload VS Code Window**: `Cmd+Shift+P` → "Developer: Reload Window"
2. **Check Extension Versions**:
   - ESLint extension should be v3.0.0+
   - Tailwind CSS IntelliSense should be v0.14.3+ (for Tailwind CSS 4 support)
3. **Clear ESLint Cache**: Delete `.eslintcache` if it exists
4. **Restart Extension Host**: `Cmd+Shift+P` → "Developer: Restart Extension Host"
5. **Check Output Panel**: View → Output → Select "ESLint" or "Tailwind CSS IntelliSense" to see errors

### ESLint Not Working

- Ensure `eslint.config.mjs` files exist in each workspace (`apps/*`, `packages/*`)
- Check that ESLint is enabled: `"eslint.enable": true` in settings
- Verify flat config is enabled: `"eslint.experimental.useFlatConfig": true`

### Tailwind IntelliSense Not Working

- Ensure `tailwind.config.ts` exists at `apps/web/tailwind.config.ts`
- Check that `globals.css` imports Tailwind: `@import 'tailwindcss';`
- Verify the config file path in settings matches your project structure
- Update Tailwind CSS IntelliSense extension to v0.14.3+ for Tailwind CSS 4 support

### Performance Issues

If extensions are slow:

1. **Exclude build directories** in settings (already configured)
2. **Enable ESLint cache** (already configured)
3. **Limit file watchers**: VS Code → Preferences → Settings → Search "files.watcherExclude"
4. **Disable unnecessary extensions**

## See Also

- [ESLint Flat Config Migration](https://eslint.org/docs/latest/use/configure/configuration-files-new)
- [Tailwind CSS Editor Setup](https://tailwindcss.com/docs/editor-setup)
- [VS Code ESLint Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
