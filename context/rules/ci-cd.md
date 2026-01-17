# CI/CD Rules

## Platform
*   **CI/CD**: GitHub Actions
*   **Runtime**: Bun
*   **Deployment**: Cloudflare Pages (via NuxtHub)
*   **Database**: PostgreSQL (managed by NuxtHub)

## Workflow Structure

### Jobs (Sequential with Dependencies)
1.  **lint** - ESLint validation
2.  **typecheck** - TypeScript type checking
3.  **test** - Unit tests (Vitest)
4.  **audit** - Security audit of dependencies
5.  **build** - Deployment to Cloudflare (runs only if all checks pass)

### Triggers
*   Only `push` to `main` branch
*   No PR triggers or preview deployments

## Mandates
1.  **All checks must pass**: Deployment only happens if lint, typecheck, test, and audit all succeed
2.  **Security first**: `bun audit` is mandatory before deployment
3.  **Type safety**: TypeScript errors block deployment
4.  **Zero configuration**: Use NuxtHub's built-in Cloudflare integration

## Required Secrets
*   `CLOUDFLARE_API_TOKEN` - Generated in Cloudflare dashboard (Cloudflare Pages > Edit permissions)

## Deployment Command
```bash
bun run nuxthub deploy
```

This command automatically:
- Builds the application
- Deploys to Cloudflare Pages
- Sets up environment variables
- Configures the database connection
