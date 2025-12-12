# 🔑 Step-by-Step: Getting All Environment Variables

**Goal:** Get all 6 environment variables and add them to Vercel
**Time Required:** 15-20 minutes

---

## 📋 The 6 Variables You Need

1. ✅ **GOOGLE_API_KEY** - You already have: `AIzaSyAcWneTlMBryrN5x42IVGtUL0yNA3YJC4g`
2. ❌ **NEXT_PUBLIC_SUPABASE_URL** - Need to get from Supabase
3. ❌ **NEXT_PUBLIC_SUPABASE_ANON_KEY** - Need to get from Supabase
4. ❌ **SUPABASE_SERVICE_ROLE_KEY** - Need to get from Supabase
5. ⚠️ **API_SECRET_KEY** - Need to create (any strong password)
6. ⚠️ **CRON_SECRET** - Need to create (any strong password)

---

## 🗄️ PART 1: Supabase Setup (Variables 2, 3, 4)

### **Step 1.1: Open Supabase**
1. Open your browser
2. Go to: **https://supabase.com**
3. Click **"Sign In"** (top right)
4. Sign in with GitHub (or create account if you don't have one)

### **Step 1.2: Check if You Have an Existing Project**
After signing in:
- **If you see a project** called "Orbit" or similar → Skip to Step 1.4
- **If you see "No projects yet"** → Continue to Step 1.3

### **Step 1.3: Create New Supabase Project (if needed)**
1. Click **"New Project"** button
2. Fill in these details:
   - **Name:** `Orbit`
   - **Database Password:** Create a strong password (save this somewhere!)
   - **Region:** Choose closest to you (e.g., "US East" or "EU West")
   - **Pricing Plan:** Select **"Free"** (perfect for Orbit)
3. Click **"Create new project"**
4. ⏳ **WAIT 2-3 minutes** (Supabase is setting up your database)
5. You'll see a loading screen, then you'll land on your project dashboard

### **Step 1.4: Get Your Supabase Credentials**
On your Supabase project dashboard:

1. On the **left sidebar**, click the **Settings** icon (⚙️ gear icon at bottom)
2. Click **"API"** in the Settings submenu
3. You'll see a page with API credentials

**Now copy these 3 values:**

#### **A) Project URL** → This is `NEXT_PUBLIC_SUPABASE_URL`
- Look for section: **"Project URL"**
- Example: `https://abcdefghijk.supabase.co`
- Click the **copy icon** next to it
- Paste it somewhere (Notes app, text file)

#### **B) anon public** → This is `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Look for section: **"Project API keys"**
- Find the row labeled: **"anon public"**
- It starts with: `eyJh...` (very long string)
- Click the **copy icon** next to it
- Paste it somewhere safe

#### **C) service_role** → This is `SUPABASE_SERVICE_ROLE_KEY`
- In the same **"Project API keys"** section
- Find the row labeled: **"service_role"**
- Click **"Reveal"** button first (⚠️ Important: this is secret!)
- It also starts with: `eyJh...` (different from anon key)
- Click the **copy icon**
- Paste it somewhere safe

**✅ Checkpoint:** You should now have 3 Supabase values saved!

---

### **Step 1.5: Set Up Database Tables**
Before Orbit can work, we need to create the database structure.

1. In Supabase, on the **left sidebar**, click **"SQL Editor"**
2. Click **"New Query"** button (top right)
3. **Open a new tab** in your code editor and open this file:
   ```
   /Users/ramoloimotsei/orbit-office-ops/supabase/migrations/001_initial_schema.sql
   ```
4. **Copy the ENTIRE contents** of that file
5. Go back to Supabase SQL Editor
6. **Paste** the SQL code into the editor
7. Click **"Run"** button (bottom right)
8. You should see: ✅ **"Success. No rows returned"**

**✅ Checkpoint:** Database tables are now created!

---

## 🔐 PART 2: Create API Secrets (Variables 5, 6)

These are just strong passwords you create yourself.

### **Step 2.1: Generate Random Secrets**

**Option A: Use Terminal (Recommended)**
1. Open Terminal app
2. Run this command:
   ```bash
   openssl rand -base64 32
   ```
3. Copy the output (this is your `API_SECRET_KEY`)
4. Save it somewhere
5. Run the command AGAIN:
   ```bash
   openssl rand -base64 32
   ```
6. Copy the output (this is your `CRON_SECRET`)
7. Save it somewhere

**Option B: Create Your Own**
1. Create a strong password like: `MyOrb1tSup3rS3cr3tK3y2025!`
2. Use this for `API_SECRET_KEY`
3. Create another different one for `CRON_SECRET`

**✅ Checkpoint:** You now have API_SECRET_KEY and CRON_SECRET!

---

## 🎯 PART 3: Add All Variables to Vercel

Now let's add all 6 variables to Vercel.

### **Step 3.1: Open Vercel Environment Variables Page**
1. Go to: **https://vercel.com/maru-online/orbit-office-ops/settings/environment-variables**
2. You should see "Environment Variables" page

### **Step 3.2: Add Each Variable**

For **EACH** of the 6 variables below, do this:

1. Click **"Add New"** button
2. Fill in:
   - **Key:** (exact name from list below)
   - **Value:** (paste the value you saved)
   - **Environments:** Check **ALL THREE** boxes:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
3. Click **"Save"**
4. Repeat for next variable

---

### **Variable 1: GOOGLE_API_KEY**
- **Key:** `GOOGLE_API_KEY`
- **Value:** `AIzaSyAcWneTlMBryrN5x42IVGtUL0yNA3YJC4g`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development
- Click **"Save"**

---

### **Variable 2: NEXT_PUBLIC_SUPABASE_URL**
- **Key:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** Paste the Supabase Project URL (from Step 1.4.A)
  - Example: `https://abcdefghijk.supabase.co`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development
- Click **"Save"**

---

### **Variable 3: NEXT_PUBLIC_SUPABASE_ANON_KEY**
- **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** Paste the Supabase anon key (from Step 1.4.B)
  - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (very long)
- **Environments:** ✅ Production, ✅ Preview, ✅ Development
- Click **"Save"**

---

### **Variable 4: SUPABASE_SERVICE_ROLE_KEY**
- **Key:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** Paste the Supabase service_role key (from Step 1.4.C)
  - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (different from anon)
- **Environments:** ✅ Production, ✅ Preview, ✅ Development
- Click **"Save"**

---

### **Variable 5: API_SECRET_KEY**
- **Key:** `API_SECRET_KEY`
- **Value:** Paste the secret you created (from Step 2.1)
  - Example: `tK8vQm3xP9zL2nR4jB7sA1cD6fE0hG5i`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development
- Click **"Save"**

---

### **Variable 6: CRON_SECRET**
- **Key:** `CRON_SECRET`
- **Value:** Paste the secret you created (from Step 2.1)
  - Example: `yW9mN2vB8cX4lK7pQ3fR6aS1dG5hJ0k`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development
- Click **"Save"**

---

## 🚀 PART 4: Trigger Redeploy

### **Step 4.1: Automatic Redeploy (Recommended)**
Vercel should automatically redeploy when you save environment variables.

**Wait 2-3 minutes**, then:
1. Go to: **https://vercel.com/maru-online/orbit-office-ops**
2. Click **"Deployments"** tab
3. You should see a new deployment in progress
4. Wait for ✅ **"Ready"** status

### **Step 4.2: Manual Redeploy (if automatic didn't work)**
1. Go to: **https://vercel.com/maru-online/orbit-office-ops**
2. Click **"Deployments"** tab
3. Click the **most recent deployment** (top of the list)
4. Click the **"⋮"** (three dots) menu in top right
5. Click **"Redeploy"**
6. Click **"Redeploy"** again to confirm
7. Wait for ✅ **"Ready"** status (2-3 minutes)

---

## ✅ SUCCESS! What You'll See

After successful deployment, you should see:

1. **Green checkmark** ✅ next to deployment
2. **"Ready"** status
3. **Production URL:** `https://orbit-office-ops.vercel.app`

### **Test Your Deployment:**
1. Click the deployment URL
2. You should see the Orbit homepage
3. Go to: `https://orbit-office-ops.vercel.app/dashboard`
4. You should see the dashboard (might be empty - that's OK!)

---

## 🐛 Troubleshooting

### **Build Still Fails?**

**Check the build logs:**
1. Click the failed deployment
2. Click **"View Build Logs"**
3. Look for error messages

**Common issues:**
- ❌ **Typo in variable name** → Check spelling exactly matches
- ❌ **Wrong Supabase key** → Make sure you copied anon vs service_role correctly
- ❌ **Database tables not created** → Re-run Step 1.5

### **Can't Find Supabase Project?**
- Go to: https://supabase.com/dashboard
- Make sure you're signed in
- You should see your projects listed

### **"Reveal" Button Doesn't Work for service_role?**
- Make sure you're on the correct Supabase project
- Try refreshing the page
- The key should be very long (starts with `eyJh...`)

---

## 📝 Checklist

Use this to track your progress:

### Supabase Setup
- [ ] Logged into Supabase
- [ ] Created/accessed Orbit project
- [ ] Copied Project URL
- [ ] Copied anon public key
- [ ] Revealed and copied service_role key
- [ ] Ran SQL migration script

### API Secrets
- [ ] Generated API_SECRET_KEY
- [ ] Generated CRON_SECRET

### Vercel Configuration
- [ ] Added GOOGLE_API_KEY
- [ ] Added NEXT_PUBLIC_SUPABASE_URL
- [ ] Added NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] Added SUPABASE_SERVICE_ROLE_KEY
- [ ] Added API_SECRET_KEY
- [ ] Added CRON_SECRET

### Deployment
- [ ] Triggered redeploy
- [ ] Build succeeded ✅
- [ ] Visited production URL
- [ ] Dashboard loads

---

## 🎓 Quick Reference

**Supabase Dashboard:** https://supabase.com/dashboard
**Vercel Project:** https://vercel.com/maru-online/orbit-office-ops
**Vercel Env Vars:** https://vercel.com/maru-online/orbit-office-ops/settings/environment-variables

**Your Production URL (after deployment):**
`https://orbit-office-ops.vercel.app`

**Your Dashboard URL:**
`https://orbit-office-ops.vercel.app/dashboard`

---

## 🎉 Next Steps After Success

Once deployment is successful:

1. ✅ Test the dashboard
2. ✅ Set up custom domain: `orbit.maruonline.com`
3. ✅ Configure email OAuth (optional, for now)
4. ✅ Link from Maru Online Office Automation page
5. ✅ Share with clients!

---

**Need help? Just ask!** 🚀
