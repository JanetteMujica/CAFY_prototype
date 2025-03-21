# eCarePD Project: Running and Deployment Guide

This guide will help you run the eCarePD project locally, push changes to GitHub, and deploy to GitHub Pages.

## Running the Project Locally

### 1. Starting the Development Server

To run the project in your browser:

```bash
# Navigate to your project directory if not already there
cd CAFY_prototype

# Start the development server
npm run dev
```

This will start a local development server, typically at http://localhost:5173/ (Vite's default port).

- Open this URL in your browser to see the application
- The development server offers hot module replacement, so changes will be reflected immediately
- Check the console output for any errors

### 2. Troubleshooting Common Issues

If you encounter errors:

```bash
# Make sure all dependencies are installed
npm install

# If you're having issues with React Router
npm install react-router-dom

# Clear any cached files (sometimes helpful)
npm run dev -- --force
```

## Pushing to GitHub

### 1. Committing Your Changes

After making changes to your project:

```bash
# Check which files have been changed
git status

# Add all changed files to staging
git add .

# Alternatively, add specific files
git add src/App.jsx src/pages/HomePage/HomePage.jsx

# Commit your changes with a descriptive message
git commit -m "Implement HomePage component and fix navigation"
```

### 2. Pushing to GitHub

```bash
# Push your changes to the main branch
git push origin main
```

## Deploying to GitHub Pages

### 1. Update vite.config.js

Make sure your `vite.config.js` file includes the base path for GitHub Pages:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	base: '/CAFY_prototype/',
});
```

### 2. Update package.json

Ensure your `package.json` includes the GitHub Pages configuration:

```json
{
	"name": "cafy-app",
	"private": true,
	"version": "0.0.0",
	"type": "module",
	"homepage": "https://janettemujica.github.io/CAFY_prototype",
	"scripts": {
		"dev": "vite",
		"build": "vite build",
		"lint": "eslint .",
		"preview": "vite preview",
		"predeploy": "npm run build",
		"deploy": "gh-pages -d dist"
	}
	// ... rest of your package.json
}
```

### 3. Deploy to GitHub Pages

```bash
# Build and deploy in one command
npm run deploy
```

This command:

- Runs the build process to create optimized files
- Creates or updates a `gh-pages` branch in your repository
- Pushes the contents of your `dist` folder to this branch

### 4. Check Your Deployment

- Go to your repository on GitHub
- Click on "Settings" → "Pages"
- You should see a message indicating your site is published
- Your site will be available at: https://janettemujica.github.io/CAFY_prototype/

## Complete Workflow (Summary)

```bash
# 1. Make changes to your code

# 2. Test locally
npm run dev

# 3. Commit changes
git add .
git commit -m "Description of changes"

# 4. Push to GitHub
git push origin main

# 5. Deploy to GitHub Pages
npm run deploy
```

### Notes on Deployment

- It may take a few minutes for changes to appear on GitHub Pages after deployment
- If you see a blank page, check browser console for path issues
- For React Router to work correctly with GitHub Pages, you may need to use `HashRouter` instead of `BrowserRouter` or configure a 404.html redirect

## Updating an Existing Deployment

If you've already deployed once and want to update:

```bash
# Push latest code to GitHub
git push origin main

# Deploy the latest version
npm run deploy
```
