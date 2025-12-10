# ✅ Orbit Deployment Checklist

Use this checklist to deploy Orbit to Vercel and install it on your Mac.

## 📋 Pre-Deployment Checklist

- [ ] **Supabase account created** at https://supabase.com
- [ ] **Supabase project created** and database migrations run
- [ ] **OpenAI API key** obtained from https://platform.openai.com/api-keys
- [ ] **Vercel account** created at https://vercel.com (free tier is fine)
- [ ] **GitHub repository** is up to date with latest code

## 🔧 Environment Variables to Prepare

Generate these before deploying:

```bash
# Generate random secure keys (run in terminal):
openssl rand -base64 32  # For API_SECRET_KEY
openssl rand -base64 32  # For CRON_SECRET
```

Collect these from your accounts:
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - From Supabase → Settings → API
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - From Supabase → Settings → API
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - From Supabase → Settings → API
- [ ] `OPENAI_API_KEY` - From OpenAI → API Keys
- [ ] `API_SECRET_KEY` - Generated above
- [ ] `CRON_SECRET` - Generated above

## 🚀 Deployment Steps

### Step 1: Push to GitHub
```bash
cd /Users/ramoloimotsei/orbit-office-ops
git push -u origin main
```

### Step 2: Deploy to Vercel

**Option A: Via Vercel Dashboard (Easier)**
- [ ] Go to https://vercel.com/new
- [ ] Import `orbit-office-ops` repository
- [ ] Add all environment variables (from list above)
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete
- [ ] Note your deployment URL (e.g., `orbit-office-ops.vercel.app`)

**Option B: Via Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add OPENAI_API_KEY production
vercel env add API_SECRET_KEY production
vercel env add CRON_SECRET production

# Deploy to production
vercel --prod
```

### Step 3: Verify Deployment
- [ ] Visit your deployment URL
- [ ] Check that the page loads without errors
- [ ] Verify the Orbit icon appears in the browser tab
- [ ] Open browser DevTools → Application → Manifest
- [ ] Confirm manifest.json is loaded correctly
- [ ] Check that icons are visible in the manifest

### Step 4: Test PWA Installation

**On Safari:**
- [ ] Open deployment URL in Safari
- [ ] Click Share button → "Add to Dock"
- [ ] Verify Orbit icon appears correctly
- [ ] Click "Add"
- [ ] Launch from Dock to test

**On Chrome/Arc:**
- [ ] Open deployment URL
- [ ] Look for install icon (⊕) in address bar
- [ ] Click "Install Orbit"
- [ ] Verify installation completes
- [ ] Launch from Applications to test

### Step 5: Configure Apple Reminders Bridge (Optional)
- [ ] Navigate to `scripts/` folder
- [ ] Create Python virtual environment: `python3 -m venv venv`
- [ ] Activate: `source venv/bin/activate`
- [ ] Install dependencies: `pip install -r requirements.txt`
- [ ] Edit `reminders_bridge.py` with your deployment URL
- [ ] Add `API_SECRET_KEY` to the script
- [ ] Test: `python reminders_bridge.py`
- [ ] Set up macOS automation (optional)

## 🎯 Post-Deployment Tasks

- [ ] **Update README.md** with your deployment URL
- [ ] **Test all API endpoints** (ingest, process, sync-rules)
- [ ] **Configure OAuth** for Gmail/Outlook (if needed)
- [ ] **Set up monitoring** in Vercel dashboard
- [ ] **Test offline functionality** (turn off WiFi and reload)
- [ ] **Share with team** or start using!

## 🔍 Verification Tests

Run these to ensure everything works:

### 1. PWA Features
- [ ] App installs on Mac without errors
- [ ] Icon displays correctly in Dock/Applications
- [ ] App opens in standalone window (no browser UI)
- [ ] Service worker registers successfully (check DevTools → Application)
- [ ] Basic offline functionality works

### 2. API Endpoints
- [ ] `/` - Homepage loads
- [ ] `/dashboard` - Dashboard loads
- [ ] `/api/sync-rules` - Responds (test with Postman)
- [ ] `/api/ingest-email` - Responds
- [ ] `/api/process-emails` - Responds

### 3. Database Connection
- [ ] Supabase connection works
- [ ] Can read from database
- [ ] Can write to database
- [ ] Migrations applied correctly

## 🐛 Troubleshooting

### Build Fails
- ✅ Check environment variables are set correctly
- ✅ Review Vercel deployment logs
- ✅ Ensure Supabase database is accessible
- ✅ Verify all dependencies are in package.json

### PWA Won't Install
- ✅ Verify HTTPS is enabled (Vercel does this automatically)
- ✅ Check manifest.json is accessible at `/manifest.json`
- ✅ Verify all icons exist in `/public/icons/`
- ✅ Clear browser cache and try again
- ✅ Try a different browser

### Icons Don't Show
- ✅ Regenerate icons: `./scripts/generate-icons.sh`
- ✅ Check icon paths in manifest.json
- ✅ Verify icons are committed to Git
- ✅ Clear app cache and reinstall

### Service Worker Issues
- ✅ Check service worker registration in DevTools
- ✅ Ensure `/sw.js` is accessible
- ✅ Verify headers in vercel.json are correct
- ✅ Try unregistering and re-registering service worker

## 📱 Using Your Installed App

After successful installation:

1. **Launch**: Click Orbit icon in Dock or Applications
2. **Pin to Dock**: Right-click → Options → Keep in Dock
3. **Spotlight**: Press ⌘+Space, type "Orbit"
4. **Updates**: App updates automatically on next launch

## 📚 Documentation

- **Full deployment guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **PWA installation guide**: [PWA_INSTALL.md](./PWA_INSTALL.md)
- **Project setup**: [SETUP.md](./SETUP.md)
- **Main README**: [README.md](./README.md)

## 🎉 Success!

Once all checkboxes are complete:
- ✅ Orbit is live on Vercel
- ✅ You can access it from anywhere
- ✅ It's installed on your Mac as a native-like app
- ✅ You can start managing your work with Orbit!

---

**Your deployment URL**: `https://_____________________.vercel.app`

**Deployment date**: _______________

**Notes**:
_______________________________________________
_______________________________________________
_______________________________________________
