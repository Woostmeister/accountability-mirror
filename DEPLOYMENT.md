# Deploying Accountability Mirror to Vercel

This guide will help you deploy your Accountability Mirror app to Vercel for free, making it accessible to anyone on the internet.

## What You'll Need

1. A GitHub account (free)
2. A Vercel account (free - sign up with GitHub)

## Step-by-Step Deployment

### 1. Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `accountability-mirror`
3. Description: "AI-powered health and fitness accountability coach"
4. Choose **Public** (so others can see the code)
5. Click **Create repository**

### 2. Upload Your Files to GitHub

**Option A: Use GitHub Web Interface (Easiest)**

1. On your new repository page, click **"uploading an existing file"**
2. Drag and drop these files:
   - `accountability-mirror-single.html`
   - `vercel.json`
   - `api/claude.js` (create `api` folder first)
   - `README.md`
   - `.gitignore`
3. Click **Commit changes**

**Option B: Use Git Command Line**

```bash
# In your project folder
git init
git add .
git commit -m "Initial commit: Accountability Mirror"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/accountability-mirror.git
git push -u origin main
```

### 3. Deploy to Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"** and choose **"Continue with GitHub"**
3. Once logged in, click **"Add New Project"**
4. Import your `accountability-mirror` repository
5. Vercel will auto-detect the settings
6. Click **"Deploy"**
7. Wait 30-60 seconds...
8. Done! 🎉

### 4. Your App is Live!

Vercel will give you a URL like: `https://accountability-mirror.vercel.app`

You can:
- Share this URL with anyone
- They can use it immediately with their own API key
- Free forever (Vercel free tier is generous)

### 5. (Optional) Add Custom Domain

1. Buy a domain (e.g., `accountabilitymirror.app` from Namecheap ~£10/year)
2. In Vercel, go to your project → Settings → Domains
3. Add your domain
4. Follow Vercel's DNS instructions
5. Now your app is at `accountabilitymirror.app`!

## How It Works (BYOK Model)

**For Users:**
1. Visit your deployed app
2. Click Settings
3. Enter their Anthropic API key (they get from https://console.anthropic.com)
4. Start using it immediately

**Costs:**
- **You:** £0 (Vercel is free)
- **Users:** ~£0.003 per message (~£5 lasts 6+ months)

## Updating Your App

When you make changes:

1. Update files in GitHub
2. Vercel auto-deploys within seconds
3. Users get updates automatically

## What Users See

When they visit your URL, they see:
1. Welcome message
2. Settings button
3. Clear instructions to add their API key
4. Link to get API key from Anthropic

## Privacy & Security

- ✅ API keys stored in user's browser only (localStorage)
- ✅ Keys never sent to your server
- ✅ Keys sent directly to Anthropic API via serverless function
- ✅ No database, no tracking, no data storage

## Support & Community

Consider creating:
- **GitHub Issues** for bug reports
- **Discussions tab** for questions
- **Discord/Slack** for community

## Analytics (Optional)

Add free analytics to see usage:
1. Vercel Analytics (built-in, free)
2. Google Analytics (free)
3. Plausible (privacy-focused, free tier)

---

## Troubleshooting

**"Failed to fetch" error:**
- Check browser console for details
- Verify API key is correct
- Check Anthropic account has credits

**Deployment failed:**
- Check `vercel.json` is in root directory
- Check `api` folder contains `claude.js`
- Check all files are committed to GitHub

**Need help?**
- Vercel Docs: https://vercel.com/docs
- Anthropic Docs: https://docs.anthropic.com

---

## Next Steps

Consider adding:
- Terms of Service
- Privacy Policy
- FAQ page
- Blog for updates
- Email list for announcements

Good luck! 🚀
