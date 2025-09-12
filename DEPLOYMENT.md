# GitHub Pages Deployment

This repository is configured to automatically deploy the demo to GitHub Pages.

## Setup Instructions

1. **Enable GitHub Pages in your repository:**

   - Go to your repository on GitHub
   - Navigate to Settings → Pages
   - Under "Source", select "GitHub Actions"

2. **The deployment will happen automatically:**
   - Every push to the `main` or `master` branch will trigger a deployment
   - The demo will be available at: `https://eliav2.github.io/react-responsive-overflow-list/`

## Manual Deployment

If you want to test the deployment locally or manually:

```bash
# Build the library
pnpm run build

# Build the demo for production (with correct base path)
pnpm run demo:build:prod

# The built files will be in ./demo/dist/
```

## Configuration Details

- **Base Path**: The demo is configured with base path `/react-responsive-overflow-list/` for GitHub Pages
- **Build Process**: Uses Vite with React and TypeScript
- **Deployment**: GitHub Actions workflow automatically builds and deploys on push to main/master

## Troubleshooting

If the deployment fails:

1. Check the GitHub Actions tab in your repository
2. Ensure GitHub Pages is enabled in repository settings
3. Verify the workflow file is in `.github/workflows/deploy-demo.yml`
4. Make sure the repository name matches the base path in `vite.config.ts`
