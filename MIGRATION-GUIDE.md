# Migration Guide: Source → Deploy Architecture

This guide walks you through migrating from a monolithic repository to a **source → deploy** architecture.

## Overview

**Current State:**
- Repository: `diogo-costa-silva.github.io`
- Contains: Source code + deployment configuration
- Deploys: Directly to GitHub Pages

**Target State:**
- Source repository: `webfolio-v1-vanilla` (development happens here)
- Deploy repository: `diogo-costa-silva.github.io` (receives automated deployments)
- Workflow: `webfolio-v1-vanilla` → GitHub Actions → `diogo-costa-silva.github.io` → GitHub Pages

## Prerequisites

- GitHub account with admin access to `diogo-costa-silva.github.io`
- Git configured locally
- GitHub CLI (`gh`) installed (optional, but recommended)

## Step-by-Step Migration

### Step 1: Create Personal Access Token (PAT)

1. Go to GitHub Settings: https://github.com/settings/tokens
2. Click **"Tokens (classic)"** → **"Generate new token (classic)"**
3. Configure token:
   - **Note:** `Portfolio Deployment Token`
   - **Expiration:** Choose duration (recommend: No expiration or 1 year)
   - **Scopes:** Check **`repo`** (Full control of private repositories)
4. Click **"Generate token"**
5. **IMPORTANT:** Copy the token immediately (it won't be shown again!)
6. Store it securely (e.g., password manager)

### Step 2: Create New Source Repository

#### Option A: Using GitHub Web Interface

1. Go to https://github.com/new
2. Repository name: `webfolio-v1-vanilla`
3. Description: `Portfolio website v1 - Vanilla HTML/CSS/JS (source repository)`
4. Visibility: **Public** or **Private** (your choice)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click **"Create repository"**

#### Option B: Using GitHub CLI

```bash
gh repo create diogo-costa-silva/webfolio-v1-vanilla \
  --public \
  --description "Portfolio website v1 - Vanilla HTML/CSS/JS (source repository)"
```

### Step 3: Clone Current Repository to New Location

```bash
# Navigate to your projects directory
cd ~/Developer/Projects/Websites

# Clone current repo with a new name
git clone https://github.com/diogo-costa-silva/diogo-costa-silva.github.io webfolio-v1-vanilla

# Enter the new directory
cd webfolio-v1-vanilla
```

### Step 4: Update Git Remote

```bash
# Remove the old remote
git remote remove origin

# Add new remote pointing to webfolio-v1-vanilla
git remote add origin https://github.com/diogo-costa-silva/webfolio-v1-vanilla.git

# Verify the remote is correct
git remote -v
# Should show:
# origin  https://github.com/diogo-costa-silva/webfolio-v1-vanilla.git (fetch)
# origin  https://github.com/diogo-costa-silva/webfolio-v1-vanilla.git (push)
```

### Step 5: Copy Deployment Workflow to Source Repo

The workflow file has already been created in your current repo. Move it to the new source repo:

```bash
# You should be in ~/Developer/Projects/Websites/webfolio-v1-vanilla

# The file .github/workflows/deploy-from-source.yml should already be here
# Verify it exists
ls -la .github/workflows/deploy-from-source.yml

# If it doesn't exist, you'll need to create it (see Step 5b)
```

**Step 5b: Create Workflow File (if needed)**

If the workflow file doesn't exist, create it:

```bash
mkdir -p .github/workflows
```

Then create `.github/workflows/deploy-from-source.yml` with this content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout source repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Configure Git
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"

      - name: Deploy to GitHub Pages repository
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
          TARGET_REPO: diogo-costa-silva/diogo-costa-silva.github.io
        run: |
          echo "Deploying to ${TARGET_REPO}..."

          # Clone target repository
          git clone https://x-access-token:${DEPLOY_TOKEN}@github.com/${TARGET_REPO}.git pages-repo

          # Remove old content (except .git and .github)
          cd pages-repo
          shopt -s dotglob
          for file in *; do
            if [[ "$file" != ".git" ]]; then
              rm -rf "$file"
            fi
          done

          # Copy new content from source
          cp -r ../* . 2>/dev/null || true
          cp -r ../.[!.]* . 2>/dev/null || true

          # Remove source repository workflows (not needed in Pages repo)
          rm -rf .github/workflows/deploy-from-source.yml

          # Keep only the Pages workflow if it exists
          if [ -d ".github/workflows" ]; then
            # If workflows dir exists, keep only static.yml
            find .github/workflows -type f ! -name 'static.yml' -delete
          fi

          # Show what changed
          git status

          # Commit and push if there are changes
          git add -A
          if git diff-staged --quiet; then
            echo "No changes to deploy"
          else
            SOURCE_COMMIT=$(git -C .. rev-parse --short HEAD)
            SOURCE_MESSAGE=$(git -C .. log -1 --pretty=%B)
            git commit -m "Deploy from webfolio-v1-vanilla @ ${SOURCE_COMMIT}

${SOURCE_MESSAGE}

Deployed by GitHub Actions"
            git push origin main
            echo "Successfully deployed to ${TARGET_REPO}"
          fi
```

### Step 6: Configure Git Identity

```bash
# Verify your Git identity is correct for this repo
git config user.name
git config user.email

# If needed, set it (use your alias if you have one)
gset-dcs  # If you have the alias configured
# OR manually:
git config user.name "Diogo Silva"
git config user.email "your-email@example.com"
```

### Step 7: Push to New Source Repository

```bash
# Stage all files
git add -A

# Commit
git commit -m "chore: initial commit for webfolio-v1-vanilla source repository"

# Push to new remote (this will NOT trigger deployment yet - secret is not configured)
git push -u origin main
```

### Step 8: Add Secret to Source Repository

#### Option A: Using GitHub Web Interface

1. Go to: https://github.com/diogo-costa-silva/webfolio-v1-vanilla/settings/secrets/actions
2. Click **"New repository secret"**
3. Name: `DEPLOY_TOKEN`
4. Secret: Paste the Personal Access Token from Step 1
5. Click **"Add secret"**

#### Option B: Using GitHub CLI

```bash
# Make sure you're in the webfolio-v1-vanilla directory
cd ~/Developer/Projects/Websites/webfolio-v1-vanilla

# Add the secret (you'll be prompted to paste the token)
gh secret set DEPLOY_TOKEN

# Verify it was added
gh secret list
```

### Step 9: Test Deployment

Now test that the automated deployment works:

```bash
# Make a small test change
echo "<!-- Migration test $(date) -->" >> index.html

# Commit and push
git add index.html
git commit -m "test: verify deployment workflow from source repo"
git push origin main

# Watch the workflow run
gh run watch

# Or view in browser:
# https://github.com/diogo-costa-silva/webfolio-v1-vanilla/actions
```

**Expected behavior:**
1. Workflow runs in `webfolio-v1-vanilla`
2. Workflow pushes to `diogo-costa-silva.github.io`
3. GitHub Pages deploys from `diogo-costa-silva.github.io`
4. Site updates at https://diogo-costa-silva.github.io

### Step 10: Clean Up Deployment Repository (Optional)

Now that the source repo is handling deployment, you can optionally clean up the deployment repo:

```bash
# Go back to original repo directory
cd ~/Developer/Projects/Websites/diogo-costa-silva.github.io

# Pull the changes that were pushed by the workflow
git pull origin main

# The workflow file should now show the deployed version
# You can verify everything looks correct

# Optional: Remove the deployment workflow from this repo since it's now redundant
# (The source repo handles deployment, this repo just needs the static.yml for Pages)
git rm .github/workflows/deploy-from-source.yml
git commit -m "chore: remove deployment workflow (now deployed from source repo)"
git push origin main
```

### Step 11: Update Local Development Workflow

From now on, **all development happens in `webfolio-v1-vanilla`**:

```bash
# Your new workflow:
cd ~/Developer/Projects/Websites/webfolio-v1-vanilla

# Make changes, test locally with Live Server

# Commit and push
git add .
git commit -m "feat: your feature description"
git push origin main

# Monitor deployment
gh run watch
```

## Verification Checklist

After migration, verify:

- [ ] Source repository exists: https://github.com/diogo-costa-silva/webfolio-v1-vanilla
- [ ] Secret `DEPLOY_TOKEN` is configured in source repo
- [ ] Workflow file exists: `webfolio-v1-vanilla/.github/workflows/deploy-from-source.yml`
- [ ] Test push to source repo triggers workflow
- [ ] Workflow successfully pushes to `diogo-costa-silva.github.io`
- [ ] GitHub Pages deploys updated content
- [ ] Website loads correctly: https://diogo-costa-silva.github.io
- [ ] CLAUDE.md is updated with new architecture

## Troubleshooting

### Workflow Fails: "Authentication Failed"

**Problem:** Workflow can't push to deployment repo

**Solutions:**
1. Verify `DEPLOY_TOKEN` secret exists in source repo:
   ```bash
   gh secret list
   ```
2. Check token has `repo` scope
3. Verify token hasn't expired
4. Regenerate token and update secret if needed

### Workflow Succeeds But Pages Don't Update

**Problem:** Deployment repo receives push but Pages doesn't rebuild

**Solutions:**
1. Check GitHub Pages settings in deployment repo:
   - Go to: https://github.com/diogo-costa-silva/diogo-costa-silva.github.io/settings/pages
   - Ensure "Source" is set to "GitHub Actions"
2. Check if `.github/workflows/static.yml` exists in deployment repo
3. Verify no errors in Pages deployment workflow

### Content Not Copying Correctly

**Problem:** Some files missing in deployment repo

**Solutions:**
1. Check workflow logs for copy errors
2. Verify files aren't in `.gitignore`
3. Check if hidden files are excluded unintentionally

### Want to Revert Migration

If you need to go back to the original setup:

```bash
# In diogo-costa-silva.github.io repo
cd ~/Developer/Projects/Websites/diogo-costa-silva.github.io

# Restore original workflow (if you still have it in history)
git log --all --oneline -- .github/workflows/static.yml
git checkout <commit-hash> -- .github/workflows/static.yml

# Commit and push
git add .github/workflows/static.yml
git commit -m "revert: restore direct deployment workflow"
git push origin main

# Disable deployment in source repo
# Go to webfolio-v1-vanilla and rename/delete the workflow
```

## Future: Switching to Different Stack

When you want to switch to React/Next.js/etc.:

### Option A: New Repository (Recommended)

```bash
# 1. Create new repo
gh repo create diogo-costa-silva/webfolio-v2-react --public

# 2. Develop your React site in that repo

# 3. Copy workflow and secret
gh secret set DEPLOY_TOKEN -R diogo-costa-silva/webfolio-v2-react

# 4. Add deploy-from-source.yml to v2-react (update TARGET_REPO if needed)

# 5. Push to v2-react → automatically deploys to diogo-costa-silva.github.io

# 6. Archive v1-vanilla
gh repo archive diogo-costa-silva/webfolio-v1-vanilla
```

### Option B: Same Repository, Different Branches

```bash
# In webfolio-v1-vanilla
git checkout -b archive/vanilla-v1
git push origin archive/vanilla-v1

# On main branch, develop React version
git checkout main
# ... develop React version ...

# Workflow continues to deploy from main branch
```

## Additional Resources

- GitHub Actions Documentation: https://docs.github.com/en/actions
- Creating PAT: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
- GitHub Pages: https://docs.github.com/en/pages

## Support

If you encounter issues:
1. Check workflow logs: `gh run view --log`
2. Review this guide's Troubleshooting section
3. Check GitHub Actions status: https://www.githubstatus.com/

---

**Migration completed successfully! 🎉**

Your new workflow:
1. Develop in `webfolio-v1-vanilla`
2. Push to GitHub
3. Automatic deployment to `diogo-costa-silva.github.io`
4. Live site updates

No more manual deployment configuration needed!
