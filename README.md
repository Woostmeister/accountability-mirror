# Accountability Mirror

[![Live Demo](https://img.shields.io/badge/Live%20Demo-accountability--mirror.vercel.app-blue?style=for-the-badge&logo=vercel)](https://accountability-mirror.vercel.app)

A conversational AI-powered health and fitness accountability system with medication safety checking, photo-based food tracking, and intelligent weekly calorie budgeting.

## 🚀 Quick Start

### Option 1: Use the Web Version (Easiest)

**Just visit:** https://accountability-mirror.vercel.app

1. Open **Settings** (bottom-left on desktop, tap ☰ menu on mobile)
2. Get your API key at [console.anthropic.com](https://console.anthropic.com) (~2 minutes)
3. Enter your API key and profile details
4. Start tracking!

**Cost:** ~£0.003 per message. £5 lasts 6+ months.

👉 **[Getting Started Guide](GETTING-STARTED.md)** - Complete step-by-step instructions

### Option 2: Run Locally (For Privacy/Development)

See [Local Setup](#local-setup) below for running on your own computer.

---

## Features

- **Conversational AI Coach**: Real-time advice, motivation, and support from Claude AI
- **Macro Tracking**: Automatic calculation of protein, carbs, fat, and calories from natural language
- **Photo Upload**: Upload food labels or supplement bottles for automatic macro extraction and safety checks
- **Voice Input**: Hands-free logging with speech recognition (mobile & desktop)
- **Mobile-Responsive**: Optimized interface for phones, tablets, and desktop
- **Calorie Deficit Tracking**: Set maintenance calories and target deficit for weight loss
- **Medication Safety**: Built-in drug-supplement interaction checking (especially for Tamoxifen and other medications)
- **Supplement Analysis**: Evidence-based supplement recommendations with contraindication warnings
- **Privacy First**: All data stored locally, API calls only for AI responses
- **Export/Import**: Back up your settings and restore on any device

## What Makes This Special

- 🔒 **Medication Safety**: Specifically aware of Tamoxifen interactions (curcumin, black pepper, ashwagandha, etc.)
- 📷 **Vision AI**: Upload photos of food labels or supplement bottles for instant analysis
- 💊 **Supplement Checking**: Reviews your entire supplement regime for dangerous interactions
- 🎯 **Smart Deficit Tracking**: Calculates projected weight loss based on your calorie deficit
- 🇬🇧 **UK-Focused**: Uses UK foods, terminology, and available products

## ⚠️ Important: Data Privacy

**All your data is stored in YOUR BROWSER ONLY for maximum privacy.**

**💾 Back Up Your Data:**
1. Open Settings → Click **"Export Settings"**
2. Save the backup file somewhere safe (Desktop, OneDrive, etc.)
3. To restore: Click **"Import Settings"** and select your backup file

**What this means:**
- ✅ Total privacy - your data never leaves your device
- ✅ No accounts, no passwords, no servers storing your health data
- ✅ Export/import to switch browsers or devices
- ⚠️ **Without a backup, clearing browser data means starting over**
- ❌ No cloud sync by design
- ❌ Each browser stores data separately

**Recommended:** Export your settings after initial setup and whenever you make changes.

See [PRIVACY.md](PRIVACY.md) for complete details.

---

## Local Setup

### Prerequisites

- **Python 3** (you probably already have this on Windows/Mac)
- **Claude API Key** (recommended) or OpenAI API key

### 1. Get an API Key

**Claude (Anthropic) - Recommended:**
- Go to https://console.anthropic.com/
- Create an account or sign in
- Navigate to API Keys → Create Key
- Copy your API key (starts with `sk-ant-`)
- Cost: ~£0.003 per message (very cheap for personal use)

**ChatGPT (OpenAI) - Alternative:**
- Go to https://platform.openai.com/
- Create account → API Keys → Create Key
- Cost: ~£0.03 per message for GPT-4

### 2. Download the Files

You need these 3 files in the same folder:
- `accountability-mirror-single.html` - The web app
- `server.py` - Local proxy server
- `START_MIRROR.bat` - Easy launcher (Windows) or just run `python server.py` (Mac/Linux)

### 3. Run It

**Windows:**
1. Double-click `START_MIRROR.bat`
2. Browser opens automatically
3. Keep the black window open while using

**Mac/Linux:**
1. Open terminal in the folder
2. Run: `python3 server.py`
3. Open browser to: http://localhost:8000

### 4. First-Time Setup

1. Click **⚙ Settings**
2. Enter your **API Key**
3. Set your **Macro Targets** (protein, carbs, fat)
4. Set **Maintenance Calories** and **Daily Calorie Goal**
5. Add your **Age, Weight, Goals**
6. **IMPORTANT**: Add your **Medications** (e.g., "Tamoxifen 20mg daily")
7. List your **Current Supplements**
8. Click **Save Settings**

## Usage

### Daily Tracking

**Log food naturally:**
```
"Had scrambled eggs on toast for breakfast"
"Just ate chicken stir-fry with rice and veg"
"Grabbed a protein shake"
```

**Upload photos:**
- Click the 📷 camera button
- Upload food label, supplement bottle, or meal photo
- AI reads it and extracts macros automatically

**Get advice:**
```
"Really fancy a takeaway but trying to stay on track"
"Too tired for the gym, what should I do?"
"What should I eat for lunch to hit my protein target?"
```

### Medication Safety

**Check supplements:**
- Click "Check my supplements" button
- Upload photo of new supplement you're considering
- Ask: "Is creatine safe with Tamoxifen?"

**AI will warn you about:**
- Black pepper/piperine (reduces Tamoxifen effectiveness)
- Curcumin/turmeric supplements
- Ashwagandha (hormonal effects)
- St John's Wort
- Any other contraindications

### Quick Actions

- **How's today?** - Daily summary and suggestions
- **Meal suggestions** - Based on current macros
- **About supplements** - Evidence-based recommendations
- **Check my supplements** - Safety review of your regime

## File Structure

```
accountability-mirror/
├── accountability-mirror-single.html   # Main web app (all-in-one)
├── server.py                          # Python proxy server
├── START_MIRROR.bat                   # Windows launcher
├── README.md                          # This file
└── .gitignore                         # Git ignore file
```

## Security & Privacy

- ✅ API key stored locally in browser localStorage (not in code)
- ✅ All your health data stays on your computer
- ✅ No cloud storage, no accounts, no tracking
- ✅ API calls only go to Claude/OpenAI for AI responses
- ✅ Safe to commit code to GitHub (doesn't contain your API key)

**What NOT to commit to GitHub:**
- Your API key (it's not in the code, but don't paste it there!)
- Screenshots showing your API key
- Any localStorage dumps

## Why a Local Server?

Browsers block direct API calls from local HTML files (CORS policy). The Python server acts as a simple proxy, allowing the app to work seamlessly while keeping your API key secure.

## Troubleshooting

**"Failed to fetch" error:**
- Make sure the server is running (black window still open)
- Restart: Close window, double-click `START_MIRROR.bat` again

**"Unsupported method (POST)" error:**
- You're using the wrong server
- Use `server.py` NOT `python -m http.server`

**Settings won't save:**
- Check browser console (F12) for errors
- Make sure you're running via server (localhost:8000)

**API errors:**
- Verify API key is correct (starts with `sk-ant-` for Claude)
- Check you have credits in your Anthropic account
- Try the other AI provider if one isn't working

## Cost

**Typical personal use with Claude:**
- ~£0.003 per message
- £5 credit lasts months
- Much cheaper than gym trainer or nutritionist!

## Pushing to GitHub

### First Time Setup

1. **Create a new GitHub repository:**
   - Go to github.com → New repository
   - Name it (e.g., "accountability-mirror")
   - Don't initialize with README (you already have one)

2. **In your folder, open terminal/command prompt:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Accountability Mirror app"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/accountability-mirror.git
   git push -u origin main
   ```

3. **Done!** Your code is now on GitHub.

### Updating After Changes

```bash
git add .
git commit -m "Description of what you changed"
git push
```

### What Gets Committed

✅ **Included** (safe):
- HTML, Python, batch files
- README, .gitignore
- Any documentation

❌ **Excluded** (by .gitignore):
- Your API key
- Personal settings
- Temporary files
- System files

## Future Enhancements (Ideas)

- Manual macro entry option
- Historical tracking and trends
- Exercise logging
- Weekly/monthly summaries
- Export data to CSV
- Mobile app version
- Voice input
- Integration with fitness trackers

## Credits

Built with vanilla JavaScript and Python. Uses Claude AI for conversational intelligence and vision capabilities.

Fonts: JetBrains Mono (monospace) and Crimson Pro (serif)

## License

Free to use and modify for personal use. If you improve it, consider sharing your changes!

---

**Note:** This is a personal health tool, not medical advice. Always consult your doctor before starting new supplements or making major diet changes, especially if you're on medication like Tamoxifen.
