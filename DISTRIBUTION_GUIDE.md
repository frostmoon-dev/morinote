# Distribution Guide - Sharing Morinote with Friends

## Quick Start (The Simple Way!)

### First Time Setup

1. **Create a GitHub account** (if you don't have one): https://github.com

2. **Create a new repository** called `morinote`
   - Make it **public** (so friends can download)
   - Don't initialize with README (your code is already here)

3. **Upload your code** to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/morinote.git
   git push -u origin main
   ```

4. **Update package.json** with your GitHub info:
   - Open `package.json`
   - Find `"owner": "YOUR_GITHUB_USERNAME"`
   - Replace with your actual GitHub username

### Building Your App

Run this single command:
```bash
npm run publish-app
```

This will:
1. Install all needed packages
2. Build the React app
3. Create the Windows installer
4. Show you where the files are

The installer will be in the `release/` folder!

---

## Sharing with Friends

### Method 1: GitHub Releases (Recommended - Auto Updates!)

**Step 1:** Create a release
1. Go to your GitHub repo
2. Click "Releases" → "Create a new release"
3. Tag: `v1.0.0`
4. Title: "Morinote v1.0.0 - First Release!"
5. Upload these files from `release/` folder:
   - `Morinote Setup 1.0.0.exe`
   - `latest.yml`
6. Click "Publish release"

**Step 2:** Share the link
Send your friends:
```
https://github.com/YOUR_USERNAME/morinote/releases/latest
```

They just download the .exe and run it!

### Method 2: Direct File Sharing

If you just want to quickly share:
1. Find the file: `release/Morinote Setup 1.0.0.exe`
2. Upload to Google Drive / Dropbox / WeTransfer
3. Share the link

⚠️ **Note:** This method doesn't support auto-updates!

---

## For Your Friends: Installation Instructions

You can copy-paste these instructions to send to your friends:

---

### How to Install Morinote

**Step 1:** Download
- Click the download link I sent you
- Download "Morinote Setup 1.0.0.exe"

**Step 2:** Install
- Run the downloaded file
- Windows might show a "SmartScreen" warning (this is normal for unsigned apps)
  - Click "More info"
  - Click "Run anyway"
- Follow the installation wizard

**Step 3:** Launch
- Morinote will open automatically after installation
- You can also find it in your Start Menu

**Step 4:** Enjoy!
- The app checks for updates automatically
- When a new version is available, you'll get a notification
- Just click "Download Now" and then "Restart" - super easy!

---

## Updating Your App

When you want to release a new version:

### Step 1: Update Version Number
In `package.json`, change:
```json
"version": "1.0.0"  →  "version": "1.0.1"
```

### Step 2: Build
```bash
npm run publish-app
```

### Step 3: Create GitHub Release
- Same as before, but with new version tag `v1.0.1`
- Upload the new files from `release/`

### Step 4: Tell Your Friends
That's it! Their apps will auto-detect the update within 24 hours, or when they restart the app.

---

## Building for Other Platforms

### macOS

On a Mac, run:
```bash
npm install
npm run build
npm run package:mac
```

Then create a release with the `.dmg` file.

### Linux

On Linux, run:
```bash
npm install
npm run build
npm run package:linux
```

Then create a release with the `.AppImage` file.

### All Platforms at Once (Advanced)

If you want to build for all platforms from one computer:
```bash
npm run package:all
```

⚠️ **Note:** This requires Docker or a CI service like GitHub Actions.

---

## Customization Ideas

### Change the App Icon
1. Create a 512x512 PNG image
2. Save as `public/yume.png`
3. Rebuild the app

### Change the App Name
In `package.json`:
```json
"productName": "My Cool App"
```

### Change Where Files Are Saved
In `main.js`, you can customize data paths.

---

## Troubleshooting

### "npm: command not found"
You need to install Node.js: https://nodejs.org

### Build fails with errors
Try:
```bash
rm -rf node_modules
npm install
npm run build
npm run package
```

### Friends can't install - "Windows protected your PC"
This is normal for unsigned apps. They need to:
1. Click "More info"
2. Click "Run anyway"

To avoid this, you can code-sign your app (costs money, ~$200/year).

### Updates aren't working
Check:
- [ ] Version number increased?
- [ ] `latest.yml` uploaded to GitHub release?
- [ ] Release tag has `v` prefix? (e.g., `v1.0.1`)
- [ ] Repository is public?

---

## File Sizes

Typical sizes:
- Installer: ~80-150 MB (includes Electron runtime)
- Installed app: ~200-300 MB

Why so big? Electron bundles a full Chrome browser. This lets it work on any Windows computer without dependencies!

---

## Privacy & Security Notes

- **No data collection**: Morinote doesn't send any data to servers
- **Local storage**: All notes are saved on the user's computer
- **No account needed**: No sign-ups, no tracking
- **Open source**: Friends can see the code on GitHub

---

## Quick Command Reference

```bash
# Development
npm run dev        # Start dev server (for coding)
npm run electron   # Test the app locally

# Building
npm run build      # Build React app
npm run package    # Create installer (Windows)
npm run publish-app # Complete build process

# Package for other platforms
npm run package:mac    # macOS
npm run package:linux  # Linux
npm run package:all    # All platforms
```

---

## Success Checklist

Before sharing with friends:

- [ ] Tested the app locally (`npm run electron`)
- [ ] Updated version number in `package.json`
- [ ] Updated GitHub username in `package.json` publish section
- [ ] Built successfully (`npm run publish-app`)
- [ ] Created GitHub release
- [ ] Uploaded both `.exe` and `latest.yml` files
- [ ] Tested installation on a different computer
- [ ] Wrote release notes describing what's new

---

## Making It Official

Want to distribute more widely?

1. **Get a code signing certificate** ($200-300/year)
   - Removes Windows SmartScreen warnings
   - Makes it look more professional

2. **Create a website** (free with GitHub Pages)
   - Landing page with screenshots
   - Download button
   - Documentation

3. **Add to Microsoft Store** (Optional, $19 one-time fee)
   - Easier for users to find and install
   - Auto-updates built in

But for friends? GitHub releases are perfect! 🎉

---

## Need More Help?

Check out:
- `AUTO_UPDATE_GUIDE.md` - Detailed auto-update info
- `README.md` - Project overview
- [Electron Builder Docs](https://www.electron.build/)
- [electron-updater Docs](https://www.electron.build/auto-update)

Happy sharing! 🚀
