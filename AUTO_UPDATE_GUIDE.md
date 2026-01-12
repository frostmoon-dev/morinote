# Auto-Update Guide for Morinote

## Overview

Morinote uses **electron-updater** to provide automatic updates to your friends. When you publish a new version, users will be notified and can download the update with just a few clicks!

## How It Works

### For Users (Your Friends)

1. **Automatic Check**: When they open Morinote, it automatically checks for updates after 3 seconds
2. **Notification**: If an update is available, a dialog appears asking if they want to download it
3. **Download**: They click "Download Now" and the update downloads in the background
4. **Install**: Once downloaded, they can restart the app to install the update
5. **Done**: The app updates itself automatically!

### For You (The Developer)

You need to:
1. Build your app
2. Create a GitHub release
3. Upload the installer files
4. Users automatically get notified!

---

## Step-by-Step: Publishing Your First Update

### Prerequisites

1. **GitHub Repository**: Your project should be on GitHub
2. **GitHub Personal Access Token**: You'll need this to publish releases

### Step 1: Update the Version Number

Before building, update the version in `package.json`:

```json
{
  "version": "1.0.1"  // Change this (was 1.0.0)
}
```

**Version numbering guide:**
- `1.0.0` → `1.0.1` = Bug fixes
- `1.0.0` → `1.1.0` = New features
- `1.0.0` → `2.0.0` = Major changes

### Step 2: Update GitHub Repository Info

In `package.json`, find the `publish` section and update with YOUR info:

```json
"publish": {
  "provider": "github",
  "owner": "YOUR_GITHUB_USERNAME",  // Replace this!
  "repo": "morinote"                 // Your repo name
}
```

### Step 3: Build the App

Run these commands in order:

```bash
# 1. Install dependencies (if you haven't already)
npm install

# 2. Build the React app
npm run build

# 3. Package the Electron app
npm run package
```

This creates installer files in the `release/` folder.

### Step 4: Create a GitHub Release

#### Option A: Using GitHub Website (Easier for beginners)

1. Go to your GitHub repository
2. Click "Releases" on the right sidebar
3. Click "Create a new release"
4. **Tag version**: Enter `v1.0.1` (must match package.json version with a 'v' prefix)
5. **Release title**: Enter something like "Version 1.0.1 - Bug Fixes"
6. **Description**: Describe what's new:
   ```
   ## What's New
   - Fixed login bug
   - Improved performance
   - Updated theme colors
   ```
7. **Attach files**: Drag and drop files from `release/` folder:
   - `Morinote Setup 1.0.1.exe` (Windows installer)
   - `latest.yml` (Update metadata - IMPORTANT!)
8. Click "Publish release"

#### Option B: Using Command Line (Advanced)

First, install GitHub CLI:
```bash
npm install -g github-cli
```

Then create a release:
```bash
# Create release and upload files
gh release create v1.0.1 \
  ./release/*.exe \
  ./release/latest.yml \
  --title "Version 1.0.1" \
  --notes "Bug fixes and improvements"
```

### Step 5: Test the Update

1. Install the OLD version on a test computer
2. Publish the new release (as above)
3. Open the app
4. Wait for the update notification
5. Click "Download Now"
6. Click "Restart Now" when download completes
7. Verify the new version is installed!

---

## Important Files

### `latest.yml`
This file tells the updater what version is available. **ALWAYS** include this in your release!

### `.exe` Installer
The actual Windows installer that users download.

---

## Troubleshooting

### "No updates available" even though I published a release

**Check:**
1. Is the version in `package.json` higher than the installed version?
2. Did you upload `latest.yml` to the GitHub release?
3. Did you tag the release with `v` prefix? (e.g., `v1.0.1`)
4. Is the repository info correct in `package.json`?

### Users can't download the update

**Check:**
1. Is your GitHub repository public? (Private repos need authentication)
2. Are the release assets publicly accessible?
3. Did you mark the release as "latest"?

### Error: "Could not get code signature for running application"

This is normal in development mode. Updates only work in production (packaged) builds.

---

## Advanced: GitHub Actions (Automatic Building)

Want to automate the build process? Create `.github/workflows/build.yml`:

```yaml
name: Build and Release

on:
  push:
    tags:
      - 'v*'  # Triggers on version tags like v1.0.1

jobs:
  build:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - run: npm install
      - run: npm run build
      - run: npm run package

      - name: Release
        uses: softprops/action-gh-release@v1
        with:
          files: |
            release/*.exe
            release/latest.yml
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Now just push a tag and it builds automatically:
```bash
git tag v1.0.1
git push origin v1.0.1
```

---

## Distribution Tips

### For Your Friends

**Easy Installation Method:**

1. Create a simple download page (can be in your README)
2. Add a big "Download Morinote" button linking to the latest release
3. Include simple instructions:
   ```
   1. Click the .exe file to download
   2. Run the installer
   3. That's it! Future updates are automatic.
   ```

### Alternative: Direct Download Link

You can create a direct link to always get the latest version:
```
https://github.com/YOUR_USERNAME/morinote/releases/latest/download/Morinote-Setup-1.0.0.exe
```

---

## Quick Reference

### Commands
```bash
npm run build      # Build React app
npm run package    # Create installer
npm run electron   # Test in development
```

### Checklist Before Release
- [ ] Update version in package.json
- [ ] Test the app locally
- [ ] Run `npm run build`
- [ ] Run `npm run package`
- [ ] Create GitHub release with version tag
- [ ] Upload .exe and latest.yml files
- [ ] Test update on old version

---

## Need Help?

Common questions:

**Q: Do I need to sign the app?**
A: Not required for friends, but recommended for public distribution. Code signing prevents Windows SmartScreen warnings.

**Q: Can I host updates somewhere other than GitHub?**
A: Yes! You can use AWS S3, your own server, or other providers. Update the `publish` config in package.json.

**Q: How do I make updates for Mac/Linux?**
A: Same process! Just run `npm run package` on those platforms, or use electron-builder's multi-platform support.

**Q: What if I want to skip a version?**
A: Users can still manually download any version from your releases page.

---

## Summary

**Publishing a new version:**
1. Update version number
2. Build: `npm run build && npm run package`
3. Create GitHub release with tag
4. Upload files
5. Done!

Your friends' apps will automatically notify them of the update. Simple and ADHD-friendly! 🎉
