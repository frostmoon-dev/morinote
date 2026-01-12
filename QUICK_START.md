# Quick Start Guide

## For Developers

### First Time Setup
```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. In another terminal, run Electron
npm run electron
```

### Building for Distribution
```bash
# One command to build everything!
npm run publish-app

# Output will be in: release/Morinote Setup 1.0.0.exe
```

### Publishing Updates
```bash
# 1. Update version in package.json
# 2. Build
npm run publish-app

# 3. Create GitHub release with tag v1.0.x
# 4. Upload files from release/ folder
```

---

## For Users (Your Friends)

### Installation
1. Download `Morinote Setup.exe`
2. Run the installer
3. Click through the setup wizard
4. Launch Morinote!

### Getting Updates
- Updates happen automatically!
- You'll see a notification when an update is available
- Click "Download Now" then "Restart"

---

## Project Structure
```
morinote/
├── src/
│   ├── styles/
│   │   └── variables.css    ← Theme colors here!
│   ├── components/          ← React components
│   └── App.jsx              ← Main app
├── main.js                  ← Electron main process
├── package.json             ← Version & config
└── AUTO_UPDATE_GUIDE.md     ← Detailed guide
```

---

## Commands Cheat Sheet

```bash
# Development
npm run dev         # Start Vite dev server
npm run electron    # Run the Electron app
npm run build       # Build React app

# Building
npm run package          # Build Windows installer
npm run package:mac      # Build macOS installer
npm run package:linux    # Build Linux AppImage
npm run publish-app      # Complete build process

# Distribution
# See DISTRIBUTION_GUIDE.md for details
```

---

## Important Files

| File | What It Does |
|------|-------------|
| `package.json` | Version number & config |
| `main.js` | Electron app & auto-updater |
| `src/styles/variables.css` | All theme colors |
| `AUTO_UPDATE_GUIDE.md` | How to publish updates |
| `DISTRIBUTION_GUIDE.md` | How to share with friends |
| `THEME_GUIDE.md` | Color psychology & ADHD design |

---

## Need Help?

1. **Auto-updates**: Read `AUTO_UPDATE_GUIDE.md`
2. **Distributing to friends**: Read `DISTRIBUTION_GUIDE.md`
3. **Customizing colors**: Read `THEME_GUIDE.md`
4. **Bugs**: Check GitHub issues or create a new one

---

## Version Update Checklist

Before releasing a new version:

- [ ] Update version in `package.json`
- [ ] Test locally with `npm run electron`
- [ ] Run `npm run publish-app`
- [ ] Create GitHub release with `v1.0.x` tag
- [ ] Upload `.exe` and `latest.yml` files
- [ ] Write release notes
- [ ] Test installation on clean computer

---

## Theme Colors Quick Reference

**Light Mode:**
- Background: `#f5f7fa` (soft blue-grey)
- Accent: `#6cb4c2` (calming teal)
- Text: `#2d3748` (readable grey)

**Dark Mode:**
- Background: `#1e2636` (soft navy)
- Accent: `#7dd3e0` (bright teal)
- Text: `#e8eef5` (soft white)

See `THEME_GUIDE.md` for full color palette!

---

## Troubleshooting

### Build fails
```bash
rm -rf node_modules
npm install
npm run publish-app
```

### Updates not working
- Check version number increased
- Verify `latest.yml` uploaded
- Confirm GitHub repo is public

### App won't start
- Check if port 5173 is in use
- Try `npm run dev` to see errors
- Check console for error messages

---

## What's Next?

1. **Customize the theme**: Edit `src/styles/variables.css`
2. **Add features**: Modify components in `src/components/`
3. **Share with friends**: Follow `DISTRIBUTION_GUIDE.md`
4. **Set up auto-updates**: Follow `AUTO_UPDATE_GUIDE.md`

---

Happy coding! 🚀
