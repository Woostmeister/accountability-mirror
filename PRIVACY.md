# Privacy & Data Storage - What You Need to Know

## Where Your Data Lives

**Everything is stored in YOUR BROWSER ONLY** - specifically in something called "localStorage".

### What This Means:

✅ **Your data NEVER leaves your device**
- API key
- Settings (age, weight, goals, medications)
- Daily macros
- Conversation history (last 10 messages only)

✅ **We don't have a database** - there's nowhere for your data to go

✅ **Total privacy** - nobody can see your data, not even us

### Important Limitations:

⚠️ **Each browser is separate**
- Chrome on your laptop = separate storage
- Safari on your phone = separate storage
- Firefox on work computer = separate storage
- **You'll need to set up each one separately**

⚠️ **Clearing browser data = losing everything**
- If you clear your browser cache/cookies, your data is GONE
- There's no "recover account" - it just deletes
- **Export your settings before clearing!** (feature coming soon)

⚠️ **Private/Incognito mode doesn't save**
- Data disappears when you close the window
- Use normal browser mode

⚠️ **No sync between devices**
- Laptop and phone don't share data
- Each device is independent
- You'll enter different foods on each

### What Persists:

📁 **Saved between sessions:**
- Your API key
- All your settings
- Today's macros
- Past days' macros (for weekly totals)

🔄 **Resets daily:**
- Today's food log
- Conversation history

❌ **Never saved:**
- Chat messages (only last 10 kept for context)
- Photos you upload (processed immediately, not stored)

## Your API Key

**Your API key goes directly from your browser to Anthropic** - we never see it.

### Security:

✅ Stored only in your browser (localStorage)
✅ Sent encrypted (HTTPS) directly to Anthropic's servers
✅ Never passes through our servers
✅ Never logged or recorded anywhere

### If You Lose It:

If you clear your browser data or switch browsers:
1. Go to Settings
2. Re-enter your API key (get it from https://console.anthropic.com)
3. Re-enter your profile settings
4. Your historical macro data is gone (it was in localStorage)
5. Start fresh!

## Pro Tip: Use One Main Browser

Pick ONE browser/device as your "main" one:
- Always use that for tracking
- Keep your data in one place
- Easier to maintain weekly history

## Questions?

**"Can I export my data?"**
- Not yet, but we're adding this feature!
- You can manually copy from Settings for now

**"Why not use a database/account system?"**
- Privacy first - we don't want your health data
- Simplicity - no passwords, no login, no security breaches
- Cost - no servers to maintain

**"What if I want to switch browsers?"**
- You'll need to re-enter your settings
- Historical data won't transfer
- Weekly totals will reset

**"Is my API key safe?"**
- Yes! It's encrypted in your browser
- Sent over HTTPS (encrypted connection)
- Only you and Anthropic see it
- Even we can't access it

## The Trade-off

**Privacy & Simplicity** = **No Cloud Sync**

We chose maximum privacy over convenience. Your health data, medications, and weight loss journey stay on YOUR device only.

If you want cloud sync and multi-device access, you'd need to:
- Create an account
- Store data in our database
- Trust us with your health data
- Risk data breaches

We chose NOT to do this. Your privacy > our convenience.

---

**Still confused?** Think of it like:
- **Notes app on your phone** - doesn't sync to your laptop unless you use iCloud
- **Calculator** - doesn't remember your calculations on other devices
- **This app** - doesn't sync your health data anywhere

Simple, private, local. Just how health data should be. 🔒
