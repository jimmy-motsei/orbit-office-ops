# 🚀 Supabase Setup - Interactive Guide

**Time Required:** 15 minutes
**Goal:** Get 3 Supabase credentials for Vercel deployment

---

## ✅ Step 1: API Secrets (COMPLETE!)

I've already generated these for you:

### **API_SECRET_KEY:**
```
vSsZHFOjqC+ot9cd4yx//A7L/EyHoUQ8M+FbyWgMg0c=
```

### **CRON_SECRET:**
```
87asE7r4fOVHlN9CexNEvfP0BPIc+mXAOZ53IqDmBYk=
```

✅ **2 of 6 variables ready!**

---

## 🗄️ Step 2: Access Supabase (5 minutes)

### **2.1: Open Supabase**
1. Open your browser
2. Go to: **https://supabase.com**
3. Click **"Sign In"** (top right)

### **2.2: Sign In Options**
- **Have GitHub account?** → Sign in with GitHub (recommended)
- **Have Google account?** → Sign in with Google
- **Neither?** → Create account with email

### **2.3: After Sign In**
You'll land on the Supabase Dashboard

**Do you see:**
- **Existing projects listed?** → Check if "Orbit" exists
- **"No projects yet" message?** → Continue to Step 3

---

## 📦 Step 3: Create Orbit Project (3 minutes)

### **3.1: Click "New Project"**
- Big green button or "+ New project"

### **3.2: Fill in Project Details**

**Organization:** (Select your personal org or create one)

**Project Name:** 
```
Orbit
```

**Database Password:** 
- Click "Generate a password" (SAVE THIS!)
- Or create your own strong password
- **IMPORTANT:** Copy and save this password somewhere safe!

**Region:** 
- Choose closest to you:
  - `US East (N. Virginia)` - For US East Coast
  - `US West (N. California)` - For US West Coast
  - `Europe (Frankfurt)` - For Europe
  - `Southeast Asia (Singapore)` - For Asia

**Pricing Plan:**
- Select **"Free"** (perfect for Orbit!)
  - 500MB database
  - 50,000 monthly active users
  - Unlimited API requests

### **3.3: Click "Create new project"**

⏳ **WAIT 2-3 MINUTES** while Supabase sets up your database

You'll see a loading screen: "Setting up your project..."

---

## 🔑 Step 4: Get Your Credentials (2 minutes)

### **4.1: Navigate to API Settings**
Once your project is ready:

1. In the **left sidebar**, click the **⚙️ Settings** icon (at bottom)
2. Click **"API"** in the Settings submenu

You'll see a page with API credentials

### **4.2: Copy Project URL**

Look for: **"Project URL"**
- Format: `https://abcdefghijk.supabase.co`
- Click the **📋 copy icon** next to it
- Paste it here or in a text file:

```
NEXT_PUBLIC_SUPABASE_URL=
```

### **4.3: Copy anon public Key**

Look for: **"Project API keys"** section
- Find row labeled: **"anon public"**
- It's a LONG string starting with `eyJh...`
- Click the **📋 copy icon**
- Paste it here:

```
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### **4.4: Copy service_role Key** (⚠️ SECRET!)

In the same **"Project API keys"** section:
- Find row labeled: **"service_role"**
- Click **"Reveal"** button first (⚠️ Important!)
- It's also a LONG string starting with `eyJh...` (different from anon)
- Click the **📋 copy icon**
- Paste it here:

```
SUPABASE_SERVICE_ROLE_KEY=
```

✅ **Now you have 5 of 6 variables!**

---

## 🗃️ Step 5: Set Up Database Tables (5 minutes)

### **5.1: Navigate to SQL Editor**
1. In the **left sidebar**, click **"SQL Editor"**
2. Click **"New Query"** button (top right)

### **5.2: Copy the Migration SQL**

I'll help you with this! The SQL file is: 
`supabase/migrations/001_initial_schema.sql`

Let me show you the content...

---

## 📋 Summary: What You Need to Get

From Supabase Dashboard → Settings → API:

1. ✅ **Project URL** (from "Project URL" section)
2. ✅ **anon public key** (from "Project API keys", anon public row)
3. ✅ **service_role key** (from "Project API keys", service_role row - click "Reveal")

Already Generated:
4. ✅ **GOOGLE_API_KEY** = `AIzaSyAcWneTlMBryrN5x42IVGtUL0yNA3YJC4g`
5. ✅ **API_SECRET_KEY** = `vSsZHFOjqC+ot9cd4yx//A7L/EyHoUQ8M+FbyWgMg0c=`
6. ✅ **CRON_SECRET** = `87asE7r4fOVHlN9CexNEvfP0BPIc+mXAOZ53IqDmBYk=`

---

## 🎯 Current Status

**Ready to proceed?**
- ✅ API secrets generated
- ⏳ Waiting for you to access Supabase
- ⏳ Need 3 credentials from Supabase

**Next Steps:**
1. Open https://supabase.com and sign in
2. Create/access "Orbit" project
3. Get the 3 credentials
4. Come back and share them with me

I'll then help you:
- Run the database migration
- Add all variables to Vercel
- Complete the deployment!

---

**Let me know when you:**
- ✅ Have accessed Supabase
- ✅ Have created/found the Orbit project
- ✅ Have the 3 credentials copied

Then we'll proceed with the database migration! 🚀
