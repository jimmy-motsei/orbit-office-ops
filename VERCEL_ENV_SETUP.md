# 🔧 Vercel Environment Variables Setup

## ❌ Deployment Failed - Missing Environment Variables

The deployment failed because Supabase environment variables are not configured in Vercel yet.

---

## ✅ Quick Fix (5 minutes)

### **Step 1: Access Vercel Dashboard**
🔗 **Go to:** https://vercel.com/maru-online/orbit-office-ops/settings/environment-variables

Or navigate manually:
1. Go to https://vercel.com
2. Select `orbit-office-ops` project
3. Click **Settings** tab
4. Click **Environment Variables** in sidebar

---

### **Step 2: Add Required Environment Variables**

Click "Add New" for each variable below:

#### **1. NEXT_PUBLIC_SUPABASE_URL**
- **Environment:** Production, Preview, Development (check all)
- **Value:** Your Supabase URL (from `.env.local`)
  ```
  https://xxxxxxxxxxxxx.supabase.co
  ```

#### **2. NEXT_PUBLIC_SUPABASE_ANON_KEY**
- **Environment:** Production, Preview, Development (check all)
- **Value:** Your Supabase anon key (from `.env.local`)
  ```
  eyJh...
  ```

#### **3. SUPABASE_SERVICE_ROLE_KEY**
- **Environment:** Production, Preview, Development (check all)
- **Value:** Your Supabase service role key (from `.env.local`)
  ```
  eyJh...
  ```

#### **4. GOOGLE_API_KEY**
- **Environment:** Production, Preview, Development (check all)
- **Value:** Your Google Gemini API key (from `.env.local`)
  ```
  AIza...
  ```

#### **5. API_SECRET_KEY**
- **Environment:** Production, Preview, Development (check all)
- **Value:** Your API secret key (from `.env.local`)
  ```
  your-secret-password-here
  ```

#### **6. CRON_SECRET**
- **Environment:** Production, Preview, Development (check all)
- **Value:** Your cron secret (from `.env.local`)
  ```
  your-cron-secret-here
  ```

---

### **Step 3: Optional Email Integration Variables**

If you want email ingestion to work immediately, also add:

#### **7. GOOGLE_CLIENT_ID** (Optional)
- Gmail OAuth client ID

#### **8. GOOGLE_CLIENT_SECRET** (Optional)
- Gmail OAuth client secret

#### **9. GOOGLE_REFRESH_TOKEN** (Optional)
- Gmail OAuth refresh token

#### **10. MICROSOFT_CLIENT_ID** (Optional)
- Outlook OAuth client ID

#### **11. MICROSOFT_CLIENT_SECRET** (Optional)
- Outlook OAuth client secret

#### **12. MICROSOFT_TENANT_ID** (Optional)
- Microsoft tenant ID

#### **13. MICROSOFT_REFRESH_TOKEN** (Optional)
- Outlook OAuth refresh token

---

### **Step 4: Redeploy**

After adding environment variables:

**Option A: Automatic (Recommended)**
- The deployment will automatically trigger when you save env vars
- Wait 2-3 minutes for build to complete

**Option B: Manual**
- Go to **Deployments** tab
- Click the failed deployment
- Click **Redeploy** button

---

## 📋 Environment Variables Checklist

- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] GOOGLE_API_KEY
- [ ] API_SECRET_KEY
- [ ] CRON_SECRET
- [ ] GOOGLE_CLIENT_ID (optional)
- [ ] GOOGLE_CLIENT_SECRET (optional)
- [ ] GOOGLE_REFRESH_TOKEN (optional)
- [ ] MICROSOFT_CLIENT_ID (optional)
- [ ] MICROSOFT_CLIENT_SECRET (optional)
- [ ] MICROSOFT_TENANT_ID (optional)
- [ ] MICROSOFT_REFRESH_TOKEN (optional)

---

## 🔍 Where to Find These Values

### **Supabase Credentials**
1. Go to https://supabase.com/dashboard
2. Select your Orbit project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** (click "reveal") → `SUPABASE_SERVICE_ROLE_KEY`

### **Google Gemini API Key**
1. Go to https://aistudio.google.com/apikey
2. Click **Create API Key**
3. Copy the key → `GOOGLE_API_KEY`

### **API Secrets**
These are in your local `.env.local` file:
```bash
cat .env.local | grep SECRET
```

---

## 📱 After Environment Variables Are Added

Your deployment will automatically rebuild and you'll get:

✅ **Production URL:** https://orbit-office-ops.vercel.app
✅ **Dashboard URL:** https://orbit-office-ops.vercel.app/dashboard
✅ **Inspection Link:** https://vercel.com/maru-online/orbit-office-ops

---

## 🎯 Next Steps After Successful Deployment

1. ✅ Visit your production URL
2. ✅ Test the dashboard
3. ✅ Set up custom domain (orbit.maruonline.com)
4. ✅ Link from Maru Online Office Automation page

---

## 🐛 Troubleshooting

### Build Still Fails?
- Check all env vars are saved correctly
- Ensure no typos in variable names
- Verify Supabase credentials are from correct project

### Can't Find Supabase Project?
- Create new Supabase project
- Run migration: `supabase/migrations/001_initial_schema.sql`
- Get new credentials

### Need to Update Env Var?
- Go back to Environment Variables page
- Click the pencil icon next to the variable
- Update value and save

---

**Current Status:** ⏳ Waiting for environment variables to be configured

**Estimated Time to Complete:** 5-10 minutes
