# 🚀 Deploying Orbit to Vercel

This guide will walk you through deploying Orbit as a Progressive Web App (PWA) on Vercel.

## Prerequisites

- ✅ A [Vercel account](https://vercel.com/signup) (free tier works)
- ✅ A [Supabase account](https://supabase.com)
- ✅ An [OpenAI API key](https://platform.openai.com/api-keys)
- ✅ The Vercel CLI installed: `npm install -g vercel`

## Step 1: Set Up Supabase

1. **Create a new Supabase project** at https://app.supabase.com
2. **Run the database migrations**:
   - Go to the SQL Editor in your Supabase dashboard
   - Run the SQL from `supabase/migrations/001_initial_schema.sql`
3. **Get your credentials**:
   - Project URL: Found in Settings → API
   - Anon key: Found in Settings → API
   - Service role key: Found in Settings → API (keep this secret!)

## Step 2: Prepare Environment Variables

You'll need these environment variables for Vercel. **Keep these secure!**

```env
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# OpenAI (REQUIRED)
OPENAI_API_KEY=sk-your_openai_api_key_here

# API Security (REQUIRED)
API_SECRET_KEY=generate_a_random_secure_key_here
CRON_SECRET=generate_another_random_secure_key_here

# OAuth Providers (OPTIONAL - can add later)
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
MICROSOFT_CLIENT_ID=your_microsoft_oauth_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_oauth_client_secret
MICROSOFT_TENANT_ID=your_microsoft_tenant_id
```

**To generate random secure keys:**
```bash
# On macOS/Linux
openssl rand -base64 32
```

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from the project directory**:
   ```bash
   cd /Users/ramoloimotsei/orbit-office-ops
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project? **No** (first time)
   - Which scope? Select your Vercel account
   - Link to existing project? **No**
   - What's your project's name? **orbit-office-ops** (or your preferred name)
   - In which directory is your code located? **./** (press Enter)
   - Want to override settings? **No** (press Enter)

5. **Add environment variables**:
   ```bash
   # Add each variable one by one
   vercel env add NEXT_PUBLIC_SUPABASE_URL production
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
   vercel env add SUPABASE_SERVICE_ROLE_KEY production
   vercel env add OPENAI_API_KEY production
   vercel env add API_SECRET_KEY production
   vercel env add CRON_SECRET production
   ```

6. **Deploy to production**:
   ```bash
   vercel --prod
   ```

### Option B: Deploy via Vercel Dashboard

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Add PWA configuration and deployment setup"
   git push origin main
   ```

2. **Import project in Vercel**:
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your `orbit-office-ops` repository
   - Configure your project settings

3. **Add environment variables**:
   - In the deployment setup, add all the environment variables from Step 2
   - Click "Deploy"

## Step 4: Verify Your Deployment

1. **Check the deployment URL**: Vercel will give you a URL like `https://orbit-office-ops.vercel.app`

2. **Test the PWA features**:
   - Open the URL in Safari or Chrome
   - Check if you can install it as an app (look for the install icon in the address bar)
   - Verify the icon appears correctly

## Step 5: Install the App on Your Mac

### Using Safari:

1. Open your deployed app in **Safari** (e.g., `https://orbit-office-ops.vercel.app`)
2. Click the **Share button** (box with arrow pointing up)
3. Select **"Add to Dock"** or **"Add to Home Screen"**
4. The app will be installed with the Orbit icon

### Using Chrome:

1. Open your deployed app in **Chrome**
2. Click the **Install icon** (⊕) in the address bar
3. Click **"Install"**
4. The app will be added to your Applications folder and Dock

### Using Arc or Brave:

1. Open your deployed app
2. Look for the install prompt or check the browser menu
3. Select **"Install Orbit"** or similar option

## Step 6: Set Up the Apple Reminders Bridge

To sync rules from Apple Reminders:

1. **Navigate to the scripts directory**:
   ```bash
   cd /Users/ramoloimotsei/orbit-office-ops/scripts
   ```

2. **Set up Python virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Edit `reminders_bridge.py`** and update:
   - `API_ENDPOINT`: Set to your Vercel deployment URL + `/api/sync-rules`
   - `API_SECRET_KEY`: Use the same key you set in Vercel environment variables

4. **Test the script**:
   ```bash
   python reminders_bridge.py
   ```

5. **Set up automation** (optional):
   - Open **Automator** on macOS
   - Create a new **Calendar Alarm**
   - Add a "Run Shell Script" action
   - Schedule it to run daily

## Step 7: Update Your Deployment URL

After deployment, update your Python bridge script:

```python
# In scripts/reminders_bridge.py
API_ENDPOINT = "https://your-actual-deployment-url.vercel.app/api/sync-rules"
```

## Troubleshooting

### Build fails on Vercel
- **Check environment variables**: Make sure all required variables are set
- **Check logs**: View the deployment logs in Vercel dashboard
- **Verify database**: Ensure Supabase migrations have been run

### PWA won't install
- **Check HTTPS**: PWA requires HTTPS (Vercel provides this by default)
- **Check manifest**: Verify `/manifest.json` is accessible
- **Clear cache**: Clear browser cache and try again

### Icons not showing
- **Check icon paths**: Verify all icons are in `/public/icons/`
- **Regenerate icons**: Run `./scripts/generate-icons.sh` if needed
- **Check manifest**: Ensure manifest.json references correct icon paths

## Next Steps

1. **Configure OAuth** for Gmail and Outlook integration
2. **Set up monitoring** in Vercel dashboard
3. **Configure custom domain** (optional)
4. **Set up analytics** (optional)

## Useful Commands

```bash
# View deployment logs
vercel logs

# Check deployment status
vercel ls

# Open deployment in browser
vercel open

# Redeploy
vercel --prod

# Check environment variables
vercel env ls
```

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env.local` to Git (it's in `.gitignore`)
- Keep your `SUPABASE_SERVICE_ROLE_KEY` secret
- Use strong random values for `API_SECRET_KEY` and `CRON_SECRET`
- Rotate keys regularly if they're compromised

## Support

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Supabase Documentation**: https://supabase.com/docs

---

**Your Orbit app is now live! 🎉**

Access it at: `https://your-deployment-url.vercel.app`
