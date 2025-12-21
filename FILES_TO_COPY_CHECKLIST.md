# 📋 Files to Copy - Quick Reference Checklist

## Complete file list for replicating the Shockwave Capital crypto payment + MetaAPI system

---

## ✅ COMPONENTS (6 files)
Copy from: `app/components/`

```
☐ CryptoPayment.tsx           # Crypto payment interface with QR codes
☐ PricingTable.tsx             # Challenge pricing comparison table
☐ StripeCardForm.tsx           # Card payment form (optional)
☐ PaymentProcessor.tsx         # Payment processing wrapper
☐ Header.tsx                   # Navigation header
☐ Particles.tsx                # Background animation effect
```

---

## ✅ USER PAGES (7 files)
Copy from: `app/challenge/` and `app/dashboard/`

```
☐ app/challenge/page.tsx                      # Main challenge selection page
☐ app/challenge/payment/page.tsx              # Payment method selection
☐ app/challenge/cryptopending/page.tsx        # Crypto payment pending page
☐ app/challenge/success/page.tsx              # Payment success page
☐ app/dashboard/accounts/page.tsx             # User accounts list
☐ app/dashboard/accounts/[accountId]/page.tsx # Individual account detail
☐ app/dashboard/layout.tsx                    # Dashboard layout wrapper
```

---

## ✅ ADMIN PAGES (4 files)
Copy from: `app/admin/`

```
☐ app/admin/crypto-orders/page.tsx            # Crypto orders management
☐ app/admin/accounts/page.tsx                 # All accounts management (large)
☐ app/admin/accounts/[accountId]/page.tsx     # Individual account admin
☐ app/admin/layout.tsx                         # Admin layout wrapper
```

---

## ✅ API ROUTES - CRYPTO (4 files)
Copy from: `app/api/crypto/` and `app/api/send-crypto-emails/`

```
☐ app/api/crypto/submit-order/route.ts        # Create crypto order in Firebase
☐ app/api/crypto/prices/route.ts              # Fetch live crypto prices (CoinGecko)
☐ app/api/send-crypto-emails/route.ts         # Send crypto order emails
☐ app/api/admin/crypto-orders/[orderId]/route.ts  # Update/delete crypto order
```

---

## ✅ API ROUTES - METAAPI (4 files)
Copy from: `app/api/metaapi/`

```
☐ app/api/metaapi/create-account/route.ts     # Create MetaAPI account
☐ app/api/metaapi/enable-features/route.ts    # Enable MetaStats + Risk Management
☐ app/api/metaapi/metrics/route.ts            # Fetch trading metrics (LARGE FILE)
☐ app/api/metaapi/risk-trackers/route.ts      # Manage risk trackers (GET/POST/DELETE)
```

---

## ✅ API ROUTES - AUTH (5 files)
Copy from: `app/api/auth/`

```
☐ app/api/auth/check-auth/route.ts            # Check if user is authenticated
☐ app/api/auth/create-session/route.ts        # Create session cookie
☐ app/api/auth/verify-session/route.ts        # Verify session cookie
☐ app/api/auth/logout/route.ts                # Logout user
☐ app/api/auth/set-admin/route.ts             # Set admin role
```

---

## ✅ API ROUTES - OTHER (6 files)
Copy from: `app/api/`

```
☐ app/api/create-payment-intent/route.ts      # Create Stripe payment intent
☐ app/api/send-order-emails/route.ts          # Send order emails
☐ app/api/send-template-email/route.ts        # Send template-based emails
☐ app/api/send-challenge-emails/route.ts      # Send challenge emails
☐ app/api/webhook/route.ts                    # Stripe webhook handler
☐ app/api/accounts/route.ts                   # Account management API
```

---

## ✅ LIBRARY FILES (5 files)
Copy from: `lib/`

```
☐ lib/firebase.ts              # Client-side Firebase (auth, firestore, storage)
☐ lib/firebase-admin.ts        # Server-side Firebase Admin SDK
☐ lib/email.ts                 # Email sending functions (Resend)
☐ lib/stripe.ts                # Stripe utilities (if exists)
☐ lib/bitcoin.ts               # Crypto utilities (if exists)
```

---

## ✅ ROOT FILES (6 files)
Copy from root directory:

```
☐ middleware.ts                # Authentication middleware
☐ next.config.js               # Next.js configuration
☐ tailwind.config.js           # Tailwind CSS config
☐ postcss.config.js            # PostCSS config
☐ tsconfig.json                # TypeScript config
☐ package.json                 # Dependencies list
```

---

## ✅ DOCUMENTATION (2 files)
Copy from: `docs/`

```
☐ docs/METAAPI_INTEGRATION.md # MetaAPI integration docs
☐ CRYPTO_METAAPI_SYSTEM_BREAKDOWN.md # Complete system breakdown
```

---

## ✅ CONFIGURATION FILES TO CREATE

### 1. `.env.local` (Create from template)
```bash
# Firebase (Client)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (Server)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# MetaAPI
METAAPI_AUTH_TOKEN=

# Resend Email
RESEND_API_KEY=

# Stripe (Optional)
NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY=
STRIPE_TEST_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

### 2. `.gitignore` (Verify includes)
```
.env.local
.env*.local
node_modules/
.next/
```

---

## 🔢 FILE COUNT SUMMARY

| Category | Count |
|----------|-------|
| Components | 6 |
| User Pages | 7 |
| Admin Pages | 4 |
| API Routes | 19 |
| Libraries | 5 |
| Root Files | 6 |
| Documentation | 2 |
| **TOTAL FILES** | **49** |

---

## 📦 NPM PACKAGES TO INSTALL

```bash
npm install firebase firebase-admin resend stripe @stripe/stripe-js @stripe/react-stripe-js metaapi.cloud-sdk qrcode.react random-words lucide-react react-firebase-hooks react-apexcharts apexcharts react-hot-toast axios date-fns uuid web3 ethers

npm install -D typescript @types/node @types/react @types/react-dom @types/uuid tailwindcss postcss autoprefixer
```

---

## 🔑 CRYPTO WALLET ADDRESSES TO UPDATE

In `app/components/CryptoPayment.tsx` (lines 29-34):

```typescript
const CRYPTO_ADDRESSES: CryptoAddress = {
  BTC: 'YOUR_BTC_ADDRESS',  // Bitcoin
  ETH: 'YOUR_ETH_ADDRESS',  // Ethereum
  USDT: 'YOUR_USDT_TRC20_ADDRESS',  // Tether (TRC20)
  USDC: 'YOUR_USDC_SOLANA_ADDRESS'  // USD Coin (Solana)
};
```

---

## 📧 EMAIL ADDRESSES TO UPDATE

Search and replace in:
- `lib/email.ts`
- All API routes that send emails

Replace: `support@shockwave-capital.com`
With: `your-email@yourdomain.com`

---

## 🎨 BRANDING TO UPDATE

### Company Name
Search for "Shockwave Capital" and replace throughout:
- All page titles
- Email templates
- Legal disclaimers
- Header components
- Footer components

### Logo/Images
Replace in `public/` directory:
- `/logo.png`
- `/shockwavechallenge.png`
- `/shockwave1step.png`
- `/shockwaveinstant.png`
- `/shockwavegauntlet.png`

### Colors
Main brand color: `#0FF1CE` (cyan/teal)
Search and replace if changing brand colors.

---

## 🗄️ FIREBASE COLLECTIONS TO CREATE

Create these collections in Firebase Console:

```
☐ crypto-orders          # Crypto payment orders
☐ orders                 # All orders (card + crypto)
☐ users                  # User accounts
☐ userMetaApiAccounts    # MetaAPI account mappings
☐ cachedMetrics          # Trading metrics cache
☐ discounts              # Discount codes
☐ kycSubmissions         # KYC documents
☐ withdrawalRequests     # Payout requests
```

---

## 🔐 FIREBASE SECURITY RULES

**Important**: Set up Firestore security rules to:
- Allow users to read only their own data
- Allow admins to read/write all data
- Protect sensitive fields (tokens, passwords)
- Rate limit operations

Example rule structure:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Orders - user can read their own
    match /orders/{orderId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Crypto orders - admin only
    match /crypto-orders/{orderId} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // MetaAPI accounts - user can read their own
    match /userMetaApiAccounts/{accountId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Cached metrics - users can read their own account metrics
    match /cachedMetrics/{accountId} {
      allow read: if request.auth != null;
      allow write: if false; // Only server can write
    }
  }
}
```

---

## 🧪 TESTING CHECKLIST

### 1. Crypto Payment Flow
```
☐ User selects challenge on /challenge
☐ User fills form and selects crypto payment
☐ Crypto prices load correctly
☐ QR code generates
☐ Verification phrase appears
☐ Order submits to Firebase
☐ Emails send (check spam folder)
☐ Admin sees order in /admin/crypto-orders
☐ Admin can mark as completed
☐ Status update emails send
```

### 2. MetaAPI Integration
```
☐ Create MetaAPI account via API
☐ Account appears in Firebase
☐ Enable features API works
☐ Metrics API fetches data
☐ Risk trackers created automatically
☐ User sees account in dashboard
☐ Metrics display correctly
☐ Trading objectives calculate correctly
☐ Equity chart renders
☐ Trades list populates
```

### 3. Admin Functions
```
☐ Admin can view all crypto orders
☐ Admin can filter/search orders
☐ Admin can update order status
☐ Admin can delete orders
☐ Admin can view all accounts
☐ Admin can create MetaAPI accounts
☐ Admin can update account status
```

---

## ⚠️ CRITICAL NOTES BEFORE LAUNCHING

1. **MetaAPI Costs**: MetaAPI is a paid service. Calculate costs based on:
   - Number of accounts
   - Metrics API calls
   - Risk Management API usage
   - Factor into your pricing model

2. **Crypto Manual Verification**: 
   - No automatic blockchain verification
   - Admin must manually verify payments
   - Consider implementing blockchain API integration

3. **Email Domain Verification**:
   - Verify your domain with Resend
   - Test all email templates
   - Check SPF/DKIM records
   - Monitor delivery rates

4. **Rate Limiting**:
   - MetaAPI has rate limits
   - CoinGecko has rate limits (use cache)
   - Implement request queuing if needed

5. **Error Monitoring**:
   - Set up Sentry or similar
   - Monitor Firebase usage
   - Track API errors
   - Set up alerts

6. **Backup Strategy**:
   - Firebase has automatic backups
   - Export important data regularly
   - Keep copy of order/account data
   - Document recovery procedures

7. **Legal Compliance**:
   - Update terms of service
   - Update privacy policy
   - Add proper disclaimers
   - Consult legal counsel for your jurisdiction

8. **Performance**:
   - Metrics cached for 15 minutes (adjustable)
   - Consider CDN for static assets
   - Optimize images
   - Monitor bundle size

---

## 🚀 DEPLOYMENT CHECKLIST

```
☐ All files copied and customized
☐ Environment variables configured
☐ Firebase project created
☐ Firebase collections created
☐ Firebase security rules deployed
☐ MetaAPI account created
☐ Resend domain verified
☐ Crypto wallets configured
☐ Email templates tested
☐ Payment flow tested end-to-end
☐ MetaAPI integration tested
☐ Admin functions tested
☐ Error monitoring configured
☐ Analytics configured
☐ Legal pages updated
☐ Production environment variables set
☐ Deploy to Vercel/hosting platform
☐ Test production deployment
☐ Monitor for errors
```

---

## 📞 SUPPORT & RESOURCES

### External Services Setup
- **Firebase**: https://console.firebase.google.com
- **MetaAPI**: https://app.metaapi.cloud
- **Resend**: https://resend.com
- **Stripe**: https://dashboard.stripe.com (optional)

### Documentation
- **MetaAPI Docs**: https://metaapi.cloud/docs
- **Firebase Docs**: https://firebase.google.com/docs
- **Resend Docs**: https://resend.com/docs
- **Next.js Docs**: https://nextjs.org/docs

### Helpful Links
- CoinGecko API: https://www.coingecko.com/en/api
- Tailwind CSS: https://tailwindcss.com/docs
- TypeScript: https://www.typescriptlang.org/docs

---

*Last Updated: 2025-12-03*
*For: New Prop Firm Project Setup*

