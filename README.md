# 🍄 Super Dad World - A Father's Day Interactive Experience

A beautiful, interactive journey through childhood memories with Dad, featuring Mario-style mini-games and photo revelations for each life stage.

![Super Dad World](https://img.shields.io/badge/Status-Ready%20for%20Deployment-brightgreen)
![Version](https://img.shields.io/badge/Version-2.0-blue)

## ✨ Features

- **7 Life Stages**: From Baby Years to Late Teens
- **Interactive Mini-Games**: Mario-style platformers for each level
- **Photo Gallery**: Beautiful memory collection with emotional descriptions
- **Character Selection**: Choose between Mario, Luigi, or Donkey Kong
- **Progressive Unlocking**: Complete levels to unlock memories
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Offline Support**: Service worker for offline functionality

## 🎨 Design Elements

- **Color Scheme**: Black, Blue, and Grey theme
- **8-bit Pixel Art**: Authentic Mario Bros aesthetic
- **Smooth Animations**: Mario-style button interactions and transitions
- **Modern UI**: Clean, responsive layout with retro gaming feel

## 🎮 How to Play

1. **Choose Your Character**: Mario, Luigi, or Donkey Kong
2. **Complete Mini-Games**: Collect coins and reach the flag
3. **Unlock Memories**: Reveal photos from each life stage
4. **Collect All Memories**: Complete all 7 levels
5. **View Gallery**: Browse your beautiful photo collection

## 🚀 Quick Start

### Local Development

```bash
# Start a local server
python3 -m http.server 8000

# Or use Node.js
npx serve .

# Or use PHP
php -S localhost:8000
```

Visit `http://localhost:8000` to play!

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. **Fork/Clone this repository**
2. **Install Vercel CLI** (optional):

   ```bash
   npm i -g vercel
   ```

3. **Deploy via GitHub**:

   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub account
   - Import this repository
   - Deploy automatically!

4. **Or deploy via CLI**:
   ```bash
   vercel --prod
   ```

### Deploy to Netlify

1. **Drag & Drop**: Simply drag the project folder to [netlify.com/drop](https://netlify.com/drop)
2. **Or via Git**: Connect your repository on [netlify.com](https://netlify.com)

### Deploy to GitHub Pages

1. **Enable GitHub Pages** in repository settings
2. **Set source** to main branch
3. **Access** via `https://yourusername.github.io/repositoryname`

## 🎯 Game Reset Options

The game automatically resets progress when:

- **Hard refresh** (Ctrl+F5 or Cmd+Shift+R)
- **URL parameter**: Add `?reset=true` to the URL
- **New Game button**: Click "New Game" on the start screen

## 🛠️ Project Structure

```
super-dad-world/
├── index.html              # Main game file
├── assets/
│   ├── css/
│   │   └── styles.css      # All game styles
│   ├── js/
│   │   ├── game.js         # Main game logic
│   │   ├── mario-minigame.js # Mini-game engine
│   │   └── init.js         # Initialization
│   ├── images/             # Photo assets by level
│   └── audio/              # Sound effects
├── sw.js                   # Service worker
├── vercel.json             # Vercel configuration
└── README.md               # This file
```

## 🎨 Customization

### Adding Your Own Photos

1. **Replace photos** in `assets/images/[level-folder]/`
2. **Update filenames** in `assets/js/game.js` (photoFilenames object)
3. **Customize descriptions** in the same file (photoDescriptions object)

### Modifying Game Difficulty

Edit `assets/js/mario-minigame.js`:

- **Character speeds**: Modify `getCharacterStats()`
- **Coin requirements**: Adjust `getCoinsNeeded()`
- **Level layouts**: Update `generatePlatforms()`

## 📱 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 60+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers

## 🎵 Audio

- Background music: "Hey You" by Pink Floyd (instrumental)
- Sound effects: Classic Mario-style coins and completions
- Auto-muted by default with toggle control

## 📄 License

This project is created for personal use as a Father's Day gift. Please respect copyrights for any music or assets used.

## 💝 About

Created with love as a special Father's Day interactive experience. A journey through time celebrating the incredible bond between father and child.

---

**Ready to deploy and share the love! 🚀💙**

_Made with love and pixels - a Mario Bros tribute to an amazing dad_
