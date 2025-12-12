# 🚀 Orbit Hosting & Integration Strategy

**For:** Maru Online Office Automation Service
**Target Page:** https://maruonline.com/services/office-automation
**Date:** December 12, 2025

---

## 📍 Hosting Options

### **Option 1: Subdomain (Recommended)** ⭐⭐⭐⭐⭐

**URL:** `https://orbit.maruonline.com`

**Pros:**
- Professional appearance
- Maintains Maru brand identity
- Easy to remember
- SEO benefits (ranks under maruonline.com domain)
- Can be white-labeled for clients

**Setup:**
1. Deploy to Vercel (as planned)
2. Get Vercel deployment URL (e.g., `orbit-office-ops.vercel.app`)
3. In your domain provider (where maruonline.com is registered):
   - Create CNAME record: `orbit.maruonline.com` → `orbit-office-ops.vercel.app`
4. In Vercel dashboard:
   - Add custom domain: `orbit.maruonline.com`
   - Vercel automatically provisions SSL certificate

**Estimated Time:** 15 minutes

---

### **Option 2: Subdirectory with Vercel Rewrites** ⭐⭐⭐⭐

**URL:** `https://maruonline.com/orbit`

**Pros:**
- Appears as part of main site
- Clean URL structure
- Good for demo/showcase purposes

**Cons:**
- More complex setup
- Requires Next.js rewrites in main Maru site

**Setup:**
1. Deploy Orbit to Vercel
2. Add this to `maru-next/next.config.ts`:
```typescript
module.exports = {
  async rewrites() {
    return [
      {
        source: '/orbit/:path*',
        destination: 'https://orbit-office-ops.vercel.app/:path*',
      },
    ];
  },
};
```

**Estimated Time:** 20 minutes

---

### **Option 3: Separate Vercel Project** ⭐⭐⭐

**URL:** `https://orbit-maru.vercel.app` or custom domain like `https://orbit.app`

**Pros:**
- Fastest to deploy (can do it right now)
- No DNS configuration needed initially
- Can upgrade to custom domain later

**Cons:**
- Less professional for client-facing tool
- Vercel branding in URL

**Setup:**
1. Deploy to Vercel
2. Use provided `.vercel.app` URL
3. Link from Office Automation page

**Estimated Time:** 10 minutes

---

## 🎯 Recommended Approach

### **Phase 1: Quick Deploy (Today)** ⚡
Use **Option 3** to get it live immediately:
- Deploy to Vercel as `orbit-office-ops.vercel.app`
- Test all functionality
- Get client feedback

### **Phase 2: Production Domain (This Week)** 🌐
Upgrade to **Option 1** (subdomain):
- Configure `orbit.maruonline.com`
- Professional URL for client demos
- Can be featured on Office Automation page

---

## 🔗 Integration with Maru Online Office Automation Page

### **Where to Place Orbit Link**

#### **1. Hero Section CTA**
Replace or add alongside "Get Your Free AI Readiness Assessment":

```markdown
[Try Orbit - AI Work Manager](https://orbit.maruonline.com)
```

**Button Text Options:**
- "Try Our AI Work Manager"
- "See Orbit in Action"
- "Launch Orbit Demo"
- "Experience Smart Scheduling"

---

#### **2. New "Live Demo" Section**
Add a dedicated section showcasing Orbit:

```markdown
## Experience Our AI-Powered Work OS

**Orbit** is our intelligent work operating system that automatically:
- Aggregates emails from all your inboxes
- Uses AI to estimate task duration and priority
- Schedules work 1-2 weeks in advance
- Adapts to your custom rules and preferences

[Launch Orbit](https://orbit.maruonline.com) | [Watch Demo Video]
```

---

#### **3. Use Case Example**
Add to "How We Find Hours Hidden in Your Operations":

```markdown
### Real Example: Orbit Work Manager

One of our automation solutions, **Orbit**, saves executives 
5+ hours per week by automatically:
- Processing 100+ daily emails
- Creating prioritized task lists
- Scheduling work around deadlines
- Eliminating manual calendar planning

[Try Orbit Free](https://orbit.maruonline.com)
```

---

#### **4. Pricing Tiers Enhancement**
Add Orbit as a feature badge in pricing:

**Starter Tier:**
- ✨ Includes 1 month free access to Orbit Work Manager

**Growth Tier:**
- ✨ Unlimited Orbit licenses for your team

**Enterprise Tier:**
- ✨ White-labeled Orbit for your organization

---

## 🎨 Branding Recommendations

### **Update Orbit to Match Maru Brand**

1. **Color Scheme**
   - Current: Cyan/Blue gradient
   - Maru: [Check maruonline.com colors]
   - Recommendation: Keep Orbit branding but add "by Maru Online" subtitle

2. **Logo/Wordmark**
   - Add "by Maru Online" beneath Orbit logo
   - Include Maru logo in footer

3. **Tagline**
   - "Orbit by Maru Online - Your AI Work Operating System"

4. **Homepage Updates**
   - Link back to maruonline.com/services/office-automation
   - Add "Powered by Maru Online" in footer
   - Include testimonials from Office Automation clients

---

## 🚀 Deployment Steps (Right Now)

### **Quick Deploy to Vercel (10 minutes)**

```bash
# 1. Navigate to project
cd /Users/ramoloimotsei/orbit-office-ops

# 2. Install Vercel CLI (if not already)
npm install -g vercel

# 3. Login to Vercel
vercel login

# 4. Deploy to preview
vercel

# 5. Deploy to production
vercel --prod
```

### **Configure Environment Variables**
After deployment, in Vercel dashboard add:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key
GOOGLE_API_KEY=your_gemini_key
API_SECRET_KEY=your_secret
CRON_SECRET=your_cron_secret
```

---

## 🎯 Marketing Copy for Office Automation Page

### **Option A: Hero CTA**
```
Stop Drowning in Email—Let AI Plan Your Day

[Try Orbit - AI Work Manager] [Learn More]
```

### **Option B: Feature Callout**
```
INTRODUCING ORBIT

The AI work manager that turns 100+ daily emails into 
a perfectly scheduled week—automatically.

✓ Multi-inbox aggregation (Gmail, Outlook)
✓ AI task estimation & prioritization  
✓ Smart scheduling with deadline awareness
✓ Custom rules via Apple Reminders

[Launch Orbit] [Watch 2-min Demo]
```

### **Option C: Use Case Story**
```
"Orbit cut my email processing time from 2 hours to 15 minutes."
— Executive using Maru's Office Automation

Our AI analyzes your emails, estimates task duration, assigns 
priorities, and schedules everything 2 weeks in advance.

[Try Orbit Free] [Read Case Study]
```

---

## 📊 Access Models

### **1. Public Demo (Immediate)**
- Anyone can access orbit.maruonline.com
- View-only demo dashboard with sample data
- Sign-up required for full features

### **2. Client Access (Short-term)**
- Clients from Office Automation service get free accounts
- Part of Starter/Growth/Enterprise packages
- Includes setup and training

### **3. SaaS Model (Long-term)**
- Public product alongside consulting services
- Freemium or paid tiers
- White-label for enterprise clients

---

## 🔐 Security Considerations for Public Hosting

### **Before Going Live:**
1. ✅ Add authentication (Supabase Auth or NextAuth)
2. ✅ Rate limiting on API endpoints
3. ✅ Row-level security on Supabase tables
4. ✅ Input validation on all forms
5. ✅ CORS configuration
6. ✅ Content Security Policy headers

### **Demo Mode:**
- Create read-only demo account
- Use sample data (not real emails)
- Disable email ingestion for demo users

---

## 📅 Timeline

### **This Week:**
- [ ] **Day 1:** Deploy to Vercel (orbit-office-ops.vercel.app)
- [ ] **Day 2:** Configure environment variables & test
- [ ] **Day 3:** Set up orbit.maruonline.com subdomain
- [ ] **Day 4:** Add authentication (Supabase Auth)
- [ ] **Day 5:** Create demo mode with sample data
- [ ] **Day 6:** Update Office Automation page with Orbit link
- [ ] **Day 7:** Soft launch to existing clients

### **Next Week:**
- [ ] Collect feedback from initial users
- [ ] Iterate based on feedback
- [ ] Create demo video
- [ ] Write case study
- [ ] Full marketing push

---

## 💡 Positioning Strategy

### **Orbit as the "Flagship Demo"**
Position Orbit as proof that Maru Online practices what it preaches:

> "We built Orbit for ourselves—because we needed an AI system 
> to manage our own overwhelming inbox. Now we're sharing it 
> with clients who face the same challenge.
>
> It's not just a demo. It's the actual tool we use daily to 
> stay on top of 200+ client emails, project deadlines, and 
> strategic work."

This creates **authenticity** and **trust**.

---

## 🎬 Next Actions

### **Immediate (Today):**
1. ✅ Deploy Orbit to Vercel
2. ✅ Get live URL (orbit-office-ops.vercel.app)
3. ✅ Test deployment thoroughly

### **This Week:**
4. 🔧 Add basic authentication
5. 🎨 Update branding to include "by Maru Online"
6. 🌐 Configure orbit.maruonline.com subdomain
7. 📝 Create demo account with sample data
8. 🔗 Add link to Office Automation page

### **Next Week:**
9. 📹 Record demo video
10. 📊 Create landing page/marketing copy
11. 🚀 Announce to existing clients
12. 📈 Monitor usage and iterate

---

## 📞 Support Plan

### **For Orbit Users:**
- Email support: orbit@maruonline.com
- Link to Office Automation service for custom automation
- Self-service documentation
- Video tutorials

---

## 💰 Monetization Ideas (Future)

1. **Free Tier:** Basic features, 1 email account
2. **Pro Tier ($15/month):** Multiple accounts, custom rules
3. **Enterprise:** White-label, team features, priority support
4. **Lead Magnet:** Free access → upsell Office Automation consulting

---

## ✅ Recommended Decision

**Deploy Now → Test with Clients → Refine → Public Launch**

1. **Week 1:** Deploy to `orbit-office-ops.vercel.app`
2. **Week 2:** Configure `orbit.maruonline.com` + add auth
3. **Week 3:** Soft launch to Office Automation clients
4. **Week 4:** Add to website + public demo

This approach:
- ✅ Gets it live quickly
- ✅ Allows testing with real users
- ✅ Minimizes risk
- ✅ Creates marketing momentum

---

**Want me to start the Vercel deployment now?** 🚀
