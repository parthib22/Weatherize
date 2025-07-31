# GitHub Pages Setup Guide

Follow these steps exactly to get your Weatherize app deployed on GitHub Pages:

## Step 1: Get Your API Keys

### OpenWeatherMap API Key

1. Go to https://openweathermap.org/api
2. Sign up for a free account
3. Go to "API keys" section
4. Copy your API key

### OpenCage Geocoding API Key

1. Go to https://opencagedata.com/api
2. Sign up for a free account
3. Go to your dashboard
4. Copy your API key

### Unsplash API Key

1. Go to https://unsplash.com/developers
2. Sign up and create a new app
3. Copy your "Access Key"

## Step 2: Add Secrets to GitHub Repository

1. Go to your GitHub repository
2. Click on **Settings** (in the repository, not your account)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret** for each of these:

   **Secret 1:**

   - Name: `OPENWEATHER_API_KEY`
   - Value: [Paste your OpenWeatherMap API key]
   - Click "Add secret"

   **Secret 2:**

   - Name: `OPENCAGE_API_KEY`
   - Value: [Paste your OpenCage API key]
   - Click "Add secret"

   **Secret 3:**

   - Name: `UNSPLASH_API_KEY`
   - Value: [Paste your Unsplash Access Key]
   - Click "Add secret"

## Step 3: Configure GitHub Pages

1. In your repository, go to **Settings** → **Pages**
2. Under "Source", select **"GitHub Actions"**
3. Click **Save**

## Step 4: Trigger Deployment

1. Make any small change to your repository (like editing README.md)
2. Commit and push:

   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push origin master
   ```

3. Go to the **Actions** tab in your repository
4. You should see a workflow running called "Deploy to GitHub Pages"
5. Wait for it to complete (green checkmark)
6. Your site will be available at: `https://[your-username].github.io/Weatherize`

## Step 5: Troubleshooting

### If the workflow fails:

1. Check the **Actions** tab for error messages
2. Make sure all 3 secrets are added correctly
3. Verify the secret names match exactly (case-sensitive)

### If the site loads but shows "CONFIG is not defined":

1. Check that the workflow completed successfully
2. Verify the config.js file was created during deployment
3. Check browser console for specific errors

### Common Issues:

- **Secret names must match exactly**: `OPENWEATHER_API_KEY`, `OPENCAGE_API_KEY`, `UNSPLASH_API_KEY`
- **Use "GitHub Actions" as source** in Pages settings, not "Deploy from branch"
- **Wait for workflow completion** before testing the site

## Expected Result

Once everything is set up correctly:

- Your site will be live at `https://[your-username].github.io/Weatherize`
- It will automatically redeploy when you push changes to the master branch
- API keys will be securely injected during deployment
- The app will work exactly like your local version

---

**Need Help?**
Check the Actions tab in your repository for detailed logs if something goes wrong.
