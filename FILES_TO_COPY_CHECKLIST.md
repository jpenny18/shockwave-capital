# 📋 Crypto Checkout - Files Copy Checklist

Quick reference for copying files to new project. Check off each item as you copy it.

---

## Core Components (app/components/)

- [ ] `CryptoPayment.tsx` - Main crypto payment component
- [ ] `BitcoinPayment.tsx` - Legacy Bitcoin payment (optional)
- [ ] `Header.tsx` - Navigation header (optional)
- [ ] `Particles.tsx` - Background animation (optional)

---

## Page Templates (app/)

### Main Checkout Flow
- [ ] `gauntlet-activation/page.tsx` - Checkout form and payment
- [ ] `gauntlet-activation/pending/page.tsx` - Payment pending confirmation

### Alternative Pending Pages
- [ ] `challenge/cryptopending/page.tsx` - Alternative pending page

### Auth (if using Firebase Auth)
- [ ] `access/page.tsx` - Authentication page

---

## API Routes (app/api/)

### Crypto Operations
- [ ] `crypto/prices/route.ts` - Fetch real-time crypto prices
- [ ] `crypto/submit-order/route.ts` - Submit order to Firebase

### Email Services
- [ ] `send-crypto-emails/route.ts` - Send order confirmation emails

---

## Library Files (lib/)

- [ ] `firebase.ts` - Firebase client SDK configuration
- [ ] `firebase-admin.ts` - Firebase Admin SDK configuration
- [ ] `email.ts` - Email service with Resend integration
- [ ] `bitcoin.ts` - Bitcoin utilities (if using BitcoinPayment)

---

## Admin Dashboard (app/admin/)

- [ ] `crypto-orders/page.tsx` - Order management dashboard

---

## Configuration Files

- [ ] `.env.local` - Environment variables (create new, don't copy)
- [ ] Update `package.json` with new dependencies
- [ ] Verify `tailwind.config.js` has correct colors
- [ ] Verify `tsconfig.json` for TypeScript config

---

## Post-Copy Tasks

### Environment Setup
- [ ] Create `.env.local` with all required variables
- [ ] Set up Firebase project (get credentials)
- [ ] Set up Resend account (get API key)
- [ ] Verify domain in Resend

### Code Updates
- [ ] Update crypto wallet addresses in `CryptoPayment.tsx` (line ~29)
- [ ] Update email sender address in `email.ts` (multiple locations)
- [ ] Update brand colors in components (if needed)
- [ ] Update redirect paths to match your project structure

### Firebase Configuration
- [ ] Create Firestore database
- [ ] Create `crypto-orders` collection
- [ ] Create `users` collection (if using auth)
- [ ] Set up security rules
- [ ] Enable Firebase Authentication (if needed)

### Install Dependencies
```bash
npm install firebase firebase-admin qrcode.react random-words resend lucide-react
```

### Testing Checklist
- [ ] Test crypto price fetching
- [ ] Test all 4 cryptocurrency options
- [ ] Test form validation
- [ ] Test QR code generation
- [ ] Test order creation in Firebase
- [ ] Test email sending (admin + customer)
- [ ] Test admin dashboard
- [ ] Test order status updates
- [ ] Test mobile responsiveness
- [ ] Test error handling

---

## Quick File Count

Total files to copy: **15 files** (12 required + 3 optional)

### Required (12)
- Components: 1 (CryptoPayment.tsx)
- Pages: 2 (gauntlet-activation pages)
- API Routes: 3 (prices, submit-order, send-emails)
- Libraries: 3 (firebase, firebase-admin, email)
- Admin: 1 (crypto-orders page)
- Config: 2 (env setup, package.json updates)

### Optional (3)
- BitcoinPayment.tsx (alternative payment component)
- Header.tsx (navigation)
- Particles.tsx (visual effects)

---

## Priority Order

Copy in this order for fastest setup:

1. **Level 1 (Core)** - Get basic functionality working
   - [ ] `lib/firebase.ts`
   - [ ] `lib/firebase-admin.ts`
   - [ ] `lib/email.ts`
   - [ ] `app/api/crypto/prices/route.ts`
   - [ ] `app/api/crypto/submit-order/route.ts`
   - [ ] `.env.local` (create new)

2. **Level 2 (Frontend)** - Add user-facing components
   - [ ] `app/components/CryptoPayment.tsx`
   - [ ] `app/gauntlet-activation/page.tsx`
   - [ ] `app/gauntlet-activation/pending/page.tsx`

3. **Level 3 (Email)** - Enable notifications
   - [ ] `app/api/send-crypto-emails/route.ts`

4. **Level 4 (Admin)** - Add management interface
   - [ ] `app/admin/crypto-orders/page.tsx`

5. **Level 5 (Polish)** - Optional enhancements
   - [ ] `app/components/Header.tsx`
   - [ ] `app/components/Particles.tsx`

---

## File Locations Reference

```
Source Project: shockwave-capital/
Target Project: your-new-project/

app/
├── components/
│   ├── CryptoPayment.tsx          → app/components/CryptoPayment.tsx
│   ├── BitcoinPayment.tsx         → app/components/BitcoinPayment.tsx
│   ├── Header.tsx                 → app/components/Header.tsx
│   └── Particles.tsx              → app/components/Particles.tsx
├── gauntlet-activation/
│   ├── page.tsx                   → app/gauntlet-activation/page.tsx
│   └── pending/page.tsx           → app/gauntlet-activation/pending/page.tsx
├── challenge/cryptopending/
│   └── page.tsx                   → app/challenge/cryptopending/page.tsx
├── access/
│   └── page.tsx                   → app/access/page.tsx
├── admin/crypto-orders/
│   └── page.tsx                   → app/admin/crypto-orders/page.tsx
└── api/
    ├── crypto/
    │   ├── prices/route.ts        → app/api/crypto/prices/route.ts
    │   └── submit-order/route.ts  → app/api/crypto/submit-order/route.ts
    └── send-crypto-emails/
        └── route.ts               → app/api/send-crypto-emails/route.ts

lib/
├── firebase.ts                    → lib/firebase.ts
├── firebase-admin.ts              → lib/firebase-admin.ts
├── email.ts                       → lib/email.ts
└── bitcoin.ts                     → lib/bitcoin.ts
```

---

## Verification Commands

After copying all files, run these to verify:

```bash
# Check all files exist
ls app/components/CryptoPayment.tsx
ls app/gauntlet-activation/page.tsx
ls app/api/crypto/prices/route.ts
ls lib/firebase.ts

# Check dependencies installed
npm list firebase firebase-admin qrcode.react random-words resend

# Check environment variables
cat .env.local | grep "FIREBASE"
cat .env.local | grep "RESEND"

# Test build
npm run build

# Test dev server
npm run dev
```

---

## Common Mistakes to Avoid

- ❌ Copying `.env.local` directly (contains production secrets)
- ❌ Forgetting to update wallet addresses
- ❌ Not updating email sender addresses
- ❌ Skipping Firebase security rules setup
- ❌ Not verifying domain in Resend
- ❌ Missing dependencies installation
- ❌ Wrong import paths in components
- ❌ Forgetting to create Firestore collections

---

## Success Indicators

You've successfully copied everything when:

✅ `npm run dev` starts without errors
✅ `/gauntlet-activation` page loads
✅ Crypto prices display (non-zero values)
✅ QR codes generate when selecting crypto
✅ Form submission creates Firebase document
✅ Emails are received (check spam folder)
✅ `/admin/crypto-orders` shows orders
✅ No TypeScript errors in IDE
✅ Build completes successfully
✅ All tests pass

---

**Estimated Time:** 30-60 minutes for complete setup
**Difficulty:** Intermediate (requires Firebase & API setup knowledge)
**Support:** See main migration guide for detailed instructions
