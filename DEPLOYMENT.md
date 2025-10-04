# Deployment Guide

**Last Updated:** 2025-01-04
**Target:** https://dipedilans.github.io
**Repository:** dipedilans/dipedilans.github.io
**Platform:** GitHub Pages (Static HTML)

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Daily Deployment Workflow](#daily-deployment-workflow)
4. [GitHub Pages Configuration](#github-pages-configuration)
5. [Local Development & Testing](#local-development--testing)
6. [Troubleshooting](#troubleshooting)
7. [Migration to diogo-costa-silva](#migration-to-diogo-costa-silva)
8. [Custom Domain Setup](#custom-domain-setup)
9. [Rollback Procedures](#rollback-procedures)

---

## Prerequisites

### Required Tools
- ✅ Git (version 2.0+)
- ✅ GitHub CLI (`gh`) - installed at `/opt/homebrew/bin/gh`
- ✅ Text editor (VS Code recommended)

### Verify Installation
```bash
# Check git
git --version
# Expected: git version 2.x.x

# Check GitHub CLI
gh --version
# Expected: gh version 2.x.x

# Check git aliases
alias | grep gset
# Expected: gset-dcs and gset-dd aliases
```

### Git Identity Aliases

Located in `~/.zshrc`:

```bash
# Diogo Costa Silva identity (diogo-costa-silva account)
alias gset-dcs='git config user.name "Diogo Silva" \
                && git config user.email "92042225+diogo-costa-silva@users.noreply.github.com"'

# Dipe Dilans identity (dipedilans account)
alias gset-dd='git config user.name "Dipe Dilans" \
               && git config user.email "157709256+dipedilans@users.noreply.github.com"'
```

---

## Initial Setup

### Step 1: Set Git Identity

**Always use dipedilans identity for this project:**

```bash
# Run in project directory
cd /Users/diogosilva/Developer/Projects/Websites/website-v3

# Set dipedilans identity
gset-dd

# Verify
git config user.name
# Expected: Dipe Dilans

git config user.email
# Expected: 157709256+dipedilans@users.noreply.github.com
```

### Step 2: Check Current Remote

```bash
# View current remote
git remote -v

# Expected output (if already configured):
# origin  git@github.com:dipedilans/dipedilans.github.io.git (fetch)
# origin  git@github.com:dipedilans/dipedilans.github.io.git (push)
```

### Step 3: Create GitHub Repository

**⚠️ IMPORTANT:** For user site, repo MUST be named `dipedilans.github.io`

**Option A: If repo doesn't exist (first time)**
```bash
# Authenticate with GitHub (if not already)
gh auth login

# Create public repository
gh repo create dipedilans.github.io \
  --public \
  --description "Personal Portfolio Website - Platform Engineering & Big Data" \
  --homepage "https://dipedilans.github.io"

# Add remote
git remote add origin git@github.com:dipedilans/dipedilans.github.io.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Option B: If repo exists (replacing existing content)**
```bash
# ⚠️ WARNING: This will overwrite existing repo content

# Backup existing repo (recommended)
gh repo clone dipedilans/dipedilans.github.io dipedilans.github.io.backup

# Force push new content
git remote set-url origin git@github.com:dipedilans/dipedilans.github.io.git
git push -u origin main --force
```

### Step 4: Enable GitHub Pages

**Via GitHub CLI:**
```bash
gh api repos/dipedilans/dipedilans.github.io/pages \
  -X POST \
  -f source[branch]=main \
  -f source[path]=/
```

**Or via Web Interface:**
1. Go to https://github.com/dipedilans/dipedilans.github.io/settings/pages
2. **Source:** Deploy from a branch
3. **Branch:** `main`
4. **Folder:** `/ (root)`
5. Click **Save**

### Step 5: Verify Deployment

```bash
# Check GitHub Actions build status
gh run list --repo dipedilans/dipedilans.github.io

# Wait ~1-2 minutes, then visit:
open https://dipedilans.github.io
```

---

## Daily Deployment Workflow

### Standard Update Process

```bash
# 1. Set identity (if not already set in session)
gset-dd

# 2. Check status
git status

# 3. Stage changes
git add .

# 4. Commit with descriptive message
git commit -m "feat: add new project to portfolio"
# or
git commit -m "fix: mobile menu pointer-events bug"
# or
git commit -m "docs: update about page content"

# 5. Push to GitHub (triggers auto-build)
git push origin main

# 6. Monitor build (optional)
gh run watch

# 7. Verify live site (after ~2 min)
open https://dipedilans.github.io
```

### Commit Message Convention

```
type: brief description (max 50 chars)

[optional body]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - CSS/visual changes (no code logic)
- `refactor` - Code restructuring
- `perf` - Performance improvements
- `test` - Testing
- `chore` - Maintenance tasks

**Examples:**
```bash
git commit -m "feat: add testimonials carousel"
git commit -m "fix: correct mobile navigation z-index"
git commit -m "docs: update skills section content"
git commit -m "style: improve card hover animations"
git commit -m "perf: lazy load below-fold images"
```

---

## GitHub Pages Configuration

### Deployment Process

**Automatic on GitHub:**
1. You push code → GitHub Pages updates
2. Static HTML files served directly (no build step)
3. Site deployed to https://dipedilans.github.io
4. Deployment logs available in Settings > Pages

**Deployment time:** ~30-60 seconds (faster than Jekyll!)

### Why No Build Process?

✅ **Pure HTML** - All pages are static HTML
✅ **Instant deploy** - No Jekyll/SSG build step
✅ **Can't fail** - HTML can't have build errors
✅ **Maximum simplicity** - What you commit is what gets served

### Viewing Deployment Status

```bash
# Check if Pages is enabled
gh api repos/dipedilans/dipedilans.github.io/pages

# View repository (shows deployment status)
gh repo view dipedilans/dipedilans.github.io --web
```

---

## Local Development & Testing

### Live Server (Only Option Needed)

**Static HTML preview with live reload:**

```bash
# Use VS Code Live Server extension
# Right-click any HTML file → "Open with Live Server"
# Server starts at http://127.0.0.1:5500
```

**✅ Benefits:**
- ✅ Instant preview - No build step
- ✅ Live reload on file changes
- ✅ Exactly what GitHub Pages will serve
- ✅ Test HTML, CSS, JavaScript immediately

**Testing checklist:**
- ✅ All pages render correctly
- ✅ Header/footer appear on each page
- ✅ Navigation works (all links)
- ✅ Mobile responsive
- ✅ Dark/light theme toggle
- ✅ JavaScript modules load
- ✅ Data loads from JSON files

### Alternative: Python HTTP Server

```bash
# Navigate to project root
cd /Users/diogosilva/Developer/Projects/Websites/website-v3

# Start simple HTTP server
python3 -m http.server 8000

# Visit http://localhost:8000
# Press Ctrl+C to stop
```

**When to use:** If Live Server isn't available

---

## Troubleshooting

### Issue: Changes not appearing on live site

**Symptoms:** Pushed code but site unchanged

**Solutions:**
```bash
# 1. Check deployment status
gh api repos/dipedilans/dipedilans.github.io/pages

# 2. Hard refresh browser (clear cache)
# Mac: Cmd+Shift+R
# Windows: Ctrl+Shift+R

# 3. Wait longer (deployments can take 1-2 minutes)
# Check again after 3 minutes

# 4. Verify correct branch deployed
gh api repos/dipedilans/dipedilans.github.io/pages | jq '.source'
# Should show: {"branch": "main", "path": "/"}

# 5. Check if push was successful
git log --oneline -1
git push origin main  # Try pushing again if needed
```

### Issue: HTML syntax errors

**Symptoms:** Page looks broken or doesn't load

**Common causes:**
1. **Unclosed HTML tags**
   ```html
   <div class="container">
       <!-- ❌ Missing closing </div> -->
   ```

2. **Invalid HTML structure**
   ```html
   <!-- ❌ Wrong -->
   <ul><div></div></ul>

   <!-- ✅ Correct -->
   <ul><li></li></ul>
   ```

3. **JavaScript errors**
   ```javascript
   // Check browser console (F12)
   // Look for red errors
   ```

**Fix:**
```bash
# Validate HTML locally
npx html-validate "*.html"

# Check browser console for JavaScript errors
# Open page → F12 → Console tab

# Fix errors and redeploy
git add .
git commit -m "fix: correct HTML syntax errors"
git push origin main
```

### Issue: Wrong git identity used

**Symptoms:** Commit shows wrong author

**Fix:**
```bash
# Verify current identity
git config user.name
git config user.email

# If wrong, reset
gset-dd  # For dipedilans
# or
gset-dcs  # For diogo-costa-silva

# Amend last commit with correct author
git commit --amend --reset-author --no-edit

# Force push (if already pushed)
git push --force origin main
```

### Issue: 404 on GitHub Pages

**Symptoms:** Site shows "404 - File not found"

**Checks:**
```bash
# 1. Verify repo name is EXACTLY dipedilans.github.io
gh repo view dipedilans/dipedilans.github.io

# 2. Verify GitHub Pages is enabled
gh api repos/dipedilans/dipedilans.github.io/pages

# 3. Check if index.html exists in root
ls -la index.html

# 4. Wait 5 minutes after first push (DNS propagation)
```

### Issue: CSS/JS not loading

**Symptoms:** Site loads but no styling/functionality

**Cause:** Incorrect file paths

**Fix:** Use relative paths from HTML file location
```html
<!-- ❌ Wrong (absolute path won't work) -->
<link rel="stylesheet" href="/assets/css/main.css">

<!-- ✅ Correct (relative path) -->
<link rel="stylesheet" href="assets/css/main.css">

<!-- For subdirectories, adjust accordingly -->
<!-- If HTML is in /pages/, use: -->
<link rel="stylesheet" href="../assets/css/main.css">
```

**Verify paths:**
```bash
# Check browser console (F12) for 404 errors
# Open Network tab to see failed resource loads
# Fix paths and refresh
```

---

## Migration to diogo-costa-silva

### When to Migrate

Migrate when website is mature and professional:
- ✅ Content complete (real projects, polished copy)
- ✅ All features working
- ✅ Lighthouse score >90
- ✅ Tested across browsers
- ✅ Ready for job applications/professional use

### Migration Options

#### Option 1: GitHub Repository Transfer (Recommended)

**Pros:**
- Preserves ALL history, stars, issues
- Automatic redirect from old URL
- Clean and official

**Steps:**
```bash
# 1. Go to repo settings
open https://github.com/dipedilans/dipedilans.github.io/settings

# 2. Scroll to "Danger Zone" → "Transfer ownership"
# 3. Enter new owner: diogo-costa-silva
# 4. Confirm transfer

# 5. On local machine, update remote
git remote set-url origin git@github.com:diogo-costa-silva/diogo-costa-silva.github.io.git

# 6. Set new identity
gset-dcs

# 7. Site is now at https://diogo-costa-silva.github.io
```

#### Option 2: Create New Repo + Push

**Pros:**
- Fresh start
- Keep dipedilans site as archive

**Steps:**
```bash
# 1. Create new repo
gh auth login  # Login as diogo-costa-silva
gh repo create diogo-costa-silva.github.io --public

# 2. Add new remote
git remote add professional git@github.com:diogo-costa-silva/diogo-costa-silva.github.io.git

# 3. Push to new repo
git push professional main

# 4. Enable GitHub Pages on new repo
gh api repos/diogo-costa-silva/diogo-costa-silva.github.io/pages \
  -X POST \
  -f source[branch]=main \
  -f source[path]=/

# 5. New site live at https://diogo-costa-silva.github.io
```

#### Option 3: Custom Domain (Best Long-term)

**Pros:**
- URL stays same even if you change repos
- Professional (e.g., diogosilva.dev)
- Easy to migrate backend

**Steps:**
1. **Buy domain** (Namecheap, Google Domains, etc.)
2. **Add CNAME file** to repo:
   ```bash
   echo "diogosilva.dev" > CNAME
   git add CNAME
   git commit -m "feat: add custom domain"
   git push origin main
   ```

3. **Configure DNS** (at domain registrar):
   ```
   Type: CNAME
   Host: www
   Value: dipedilans.github.io

   Type: A (4 records)
   Host: @
   Values:
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
   ```

4. **Enable HTTPS** in GitHub Pages settings

5. **Site accessible at:**
   - https://diogosilva.dev
   - https://www.diogosilva.dev

Now you can migrate repo anytime without changing public URL!

---

## Custom Domain Setup

### Step-by-Step Guide

#### 1. Choose Domain

**Recommendations:**
- `diogosilva.dev` - Professional, short
- `diogo-silva.com` - Full name
- `diogosilva.io` - Tech-focused

**Registrars:**
- Namecheap - ~$12/year .dev
- Google Domains - ~$12/year
- Cloudflare - At-cost pricing

#### 2. Add CNAME File

```bash
# Create CNAME file in root
echo "diogosilva.dev" > CNAME

# Commit
git add CNAME
git commit -m "feat: add custom domain support"
git push origin main
```

#### 3. Configure DNS

**At your domain registrar:**

**A Records (root domain):**
```
Type: A
Name: @
TTL: 3600
Value: 185.199.108.153

(Repeat for 185.199.109.153, 185.199.110.153, 185.199.111.153)
```

**CNAME Record (www subdomain):**
```
Type: CNAME
Name: www
TTL: 3600
Value: dipedilans.github.io
```

#### 4. Enable HTTPS

```bash
# Wait 24-48 hours for DNS propagation
# Then enable HTTPS in GitHub settings:
open https://github.com/dipedilans/dipedilans.github.io/settings/pages

# Check "Enforce HTTPS"
```

#### 5. Test

```bash
# Test DNS propagation
dig diogosilva.dev +short
# Should show GitHub IPs

# Visit site
open https://diogosilva.dev
open https://www.diogosilva.dev

# Both should work!
```

---

## Rollback Procedures

### Rollback Last Commit (Not Pushed)

```bash
# Undo last commit, keep changes
git reset --soft HEAD~1

# Undo last commit, discard changes
git reset --hard HEAD~1
```

### Rollback After Push

```bash
# Find commit to rollback to
git log --oneline

# Revert to specific commit (creates new commit)
git revert <commit-hash>
git push origin main

# Or force reset (⚠️ dangerous, rewrites history)
git reset --hard <commit-hash>
git push --force origin main
```

### Restore from Backup

```bash
# If you made backup (recommended before force push)
cd /path/to/backup
git push origin main --force
```

### Emergency: Take Site Down

```bash
# Option 1: Disable GitHub Pages
gh api repos/dipedilans/dipedilans.github.io/pages -X DELETE

# Option 2: Make repo private (disables Pages automatically)
gh repo edit dipedilans/dipedilans.github.io --visibility private

# Option 3: Push placeholder
echo "<h1>Site under maintenance</h1>" > index.html
git add index.html
git commit -m "chore: maintenance mode"
git push origin main
```

---

## Deployment Checklist

### Before First Deploy
- [ ] `gset-dd` identity set
- [ ] Repo created: `dipedilans.github.io`
- [ ] GitHub Pages enabled
- [ ] HTML files validated (no syntax errors)
- [ ] All links tested locally (Live Server)
- [ ] All resource paths correct (CSS, JS, images)

### Before Each Deploy
- [ ] Code tested locally (Live Server)
- [ ] No console errors (check F12)
- [ ] Mobile responsive verified
- [ ] Dark/light theme working
- [ ] All navigation links work
- [ ] JSON data loads correctly
- [ ] Commit message follows convention
- [ ] Correct git identity (`git config user.email`)

### After Deploy
- [ ] Wait 1-2 minutes for deployment
- [ ] Visit live site
- [ ] Test navigation on all pages
- [ ] Test on mobile device (real)
- [ ] Check Lighthouse score (target: >90 desktop, >85 mobile)

---

## Quick Reference

### Essential Commands

```bash
# Set identity
gset-dd

# Deploy
git add .
git commit -m "type: description"
git push origin main

# View deployment status
gh api repos/dipedilans/dipedilans.github.io/pages

# View live site
open https://dipedilans.github.io

# Local preview (use VS Code Live Server extension)
# Or: python3 -m http.server 8000
```

### Important URLs

- **Live Site:** https://dipedilans.github.io
- **Repository:** https://github.com/dipedilans/dipedilans.github.io
- **GitHub Actions:** https://github.com/dipedilans/dipedilans.github.io/actions
- **Settings:** https://github.com/dipedilans/dipedilans.github.io/settings
- **Pages Settings:** https://github.com/dipedilans/dipedilans.github.io/settings/pages

### Support

**Issues?** Check:
1. Browser console errors (F12)
2. Network tab for 404s (F12)
3. HTML validation errors
4. ARCHITECTURE.md for architecture questions
5. CLAUDE.md for development guidelines

---

**Document maintained by:** Claude Code AI Assistant
**Next steps:** Follow daily deployment workflow or proceed with migration when ready.
