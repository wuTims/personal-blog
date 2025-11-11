# Cloudflare Workers Deployment Guide

This project is configured to deploy to Cloudflare Workers using TanStack Start.

## Prerequisites

- A Cloudflare account
- pnpm package manager

## Configuration Files

### vite.config.ts
The Vite configuration includes the `@cloudflare/vite-plugin` which enables Cloudflare Workers integration. The cloudflare plugin must be placed before the TanStack Start plugin.

### wrangler.jsonc
Contains Cloudflare Workers configuration:
- `name`: Your worker name (wutims-blog)
- `compatibility_date`: Cloudflare runtime compatibility date
- `compatibility_flags`: Enables Node.js compatibility
- `main`: Entry point for the TanStack Start server
- `dev`: Development server configuration
  - `ip`: Binds to 0.0.0.0 (all network interfaces) for Docker/remote access
  - `port`: Port 8787 for the preview server

## Available Scripts

### Local Development
```bash
pnpm dev
```
Runs the standard Vite development server with hot module reloading.

### Local Preview (Cloudflare Workers)
```bash
pnpm preview
```
Builds the project and runs it locally using Wrangler's development server on port 8787. This simulates the Cloudflare Workers environment on your machine, allowing you to test Workers-specific features before deploying.

**Accessing from Docker/Remote Environments:**
The preview server is configured to bind to `0.0.0.0:8787`, making it accessible from:
- Docker containers: `http://localhost:8787`
- Remote dev environments (GitHub Codespaces, VS Code Remote, etc.): Use the forwarded port
- Local machine in Docker: `http://host.docker.internal:8787` (from within container)

### Production Deployment
```bash
pnpm deploy
```
Builds and deploys your application to Cloudflare Workers.

### TypeScript Type Generation
```bash
pnpm cf-typegen
```
Generates TypeScript types for Cloudflare Workers bindings.

## First-Time Deployment Setup

### Method 1: API Token (Recommended for Local Development & CI/CD)

This method is recommended for local development, Docker containers, and automated deployments.

#### 1. Create a Cloudflare API Token

1. Go to [Cloudflare Dashboard - API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use the "Edit Cloudflare Workers" template
4. Click "Continue to summary" and then "Create Token"
5. **Copy the token immediately** (you won't be able to see it again)

#### 2. Get Your Account ID

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Find your Account ID in the right sidebar
3. Copy the Account ID

#### 3. Set Up Local Environment

Copy the example environment file and fill in your values:
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```bash
CLOUDFLARE_API_TOKEN=your_token_here
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
```

**Important:** The `.env` file is already in `.gitignore` and will not be committed to version control.

#### 4. Deploy

Your environment variables will be automatically loaded by Wrangler:
```bash
pnpm deploy
```

### Method 2: Interactive Login (Alternative)

If you prefer browser-based authentication:

#### 1. Login to Cloudflare

```bash
pnpm dlx wrangler login
```

This will open a browser window for you to authenticate.

#### 2. Verify Authentication

```bash
pnpm dlx wrangler whoami
```

#### 3. Deploy

```bash
pnpm deploy
```

Wrangler will:
- Build your application
- Upload it to Cloudflare
- Provide you with a URL where your app is live

## Development Workflow

### Local Development
For rapid development with HMR:
```bash
pnpm dev
```

### Testing Cloudflare Workers Features
When you need to test Workers-specific features (KV, D1, R2, etc.):
```bash
pnpm preview
```

### Deploying to Production
When ready to deploy:
```bash
pnpm deploy
```

## Docker & CI/CD Deployment

When deploying from Docker containers or CI/CD pipelines, use environment variables:

### Docker
```bash
docker run \
  -e CLOUDFLARE_API_TOKEN=your_token \
  -e CLOUDFLARE_ACCOUNT_ID=your_account_id \
  your-image pnpm deploy
```

Or use an `.env` file:
```bash
docker run --env-file .env your-image pnpm deploy
```

### Docker Compose
```yaml
services:
  app:
    build: .
    env_file:
      - .env
    ports:
      - "8787:8787"  # For preview server
```

### CI/CD (GitLab, CircleCI, etc.)
Store your tokens as secrets in your CI/CD platform and inject them as environment variables:

```yaml
deploy:
  script:
    - pnpm install
    - pnpm deploy
  environment:
    CLOUDFLARE_API_TOKEN: $CLOUDFLARE_API_TOKEN
    CLOUDFLARE_ACCOUNT_ID: $CLOUDFLARE_ACCOUNT_ID
```

## Security Best Practices

1. **Never commit tokens** to version control
2. **Use `.env` for local development** (already in `.gitignore`)
3. **Use secrets management** for CI/CD (GitHub Secrets, GitLab Variables, etc.)
4. **Rotate tokens periodically** from the Cloudflare dashboard
5. **Use scoped tokens** with minimal required permissions (Workers Edit only)
6. **Use `.env.example`** to document required environment variables without exposing secrets

## Troubleshooting

### Build Scripts Warning
If you see warnings about ignored build scripts (esbuild, sharp, workerd), you can approve them:
```bash
pnpm approve-builds
```

### Authentication Issues

**Using API Tokens:**
1. Verify your `.env` file exists and contains valid values
2. Check token permissions at https://dash.cloudflare.com/profile/api-tokens
3. Ensure the token hasn't expired or been revoked
4. Verify Account ID matches your Cloudflare account

**Using Interactive Login:**
1. Logout and login again:
   ```bash
   pnpm dlx wrangler logout
   pnpm dlx wrangler login
   ```
2. Check your authentication status:
   ```bash
   pnpm dlx wrangler whoami
   ```

### Environment Variables Not Loading
If Wrangler isn't picking up your `.env` file:
1. Ensure the file is named exactly `.env` (not `.env.txt`)
2. Check that environment variables are set correctly (no quotes around values in the file)
3. Restart your terminal session
4. Manually export variables:
   ```bash
   export CLOUDFLARE_API_TOKEN=your_token
   export CLOUDFLARE_ACCOUNT_ID=your_account_id
   ```

### Port Access Issues (Docker/Remote)
If you can't access the preview server at port 8787:
1. Ensure port 8787 is forwarded in your environment
2. Check that the `dev.ip` setting in `wrangler.jsonc` is set to `"0.0.0.0"`
3. Verify Docker port mapping if running in a container: `-p 8787:8787`
4. For VS Code Remote/Codespaces: Check the "Ports" tab and ensure 8787 is forwarded

## Additional Resources

- [TanStack Start Cloudflare Workers Guide](https://tanstack.com/start/latest/docs/framework/react/guide/hosting#cloudflare-workers--official-partner)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
