# Crypto Checkout Flow - Complete Migration Guide

## Overview
This document outlines all files and configurations needed to migrate the crypto checkout flow to a new Next.js project.

---

## 📋 Files to Copy

### 1. **Core Components** (`app/components/`)
```
✅ CryptoPayment.tsx          - Main crypto payment component (BTC, ETH, USDT, USDC)
✅ BitcoinPayment.tsx          - Legacy Bitcoin-only payment component
✅ Header.tsx                  - Site header (optional, for navigation)
✅ Particles.tsx               - Background animation effect (optional)
```

### 2. **Page Templates** (`app/`)
```
✅ gauntlet-activation/
   ├── page.tsx                - Crypto checkout page with form
   └── pending/
       └── page.tsx            - Success/pending page after payment

✅ challenge/
   └── cryptopending/
       └── page.tsx            - Alternative pending page

✅ access/
   └── page.tsx                - Auth page (if using Firebase auth)
```

### 3. **API Routes** (`app/api/`)
```
✅ crypto/
   ├── prices/
   │   └── route.ts            - Fetch real-time crypto prices from CoinGecko
   └── submit-order/
       └── route.ts            - Submit crypto order to Firebase

✅ send-crypto-emails/
   └── route.ts                - Send order confirmation emails
```

### 4. **Library Files** (`lib/`)
```
✅ firebase.ts                 - Firebase client SDK setup
✅ firebase-admin.ts           - Firebase Admin SDK setup (for API routes)
✅ email.ts                    - Email service with Resend (crypto email functions)
✅ bitcoin.ts                  - Bitcoin utilities (if using BitcoinPayment component)
```

### 5. **Admin Dashboard** (`app/admin/`)
```
✅ crypto-orders/
   └── page.tsx                - Admin page to manage crypto orders
```

### 6. **Configuration Files**
```
✅ package.json                - Dependencies (see section below)
✅ .env.local                  - Environment variables (see section below)
✅ tailwind.config.js          - Tailwind CSS config (if not already present)
✅ tsconfig.json               - TypeScript config (if not already present)
```

---

## 📦 Required Dependencies

Add these to your `package.json`:

```json
{
  "dependencies": {
    "firebase": "^10.10.0",
    "firebase-admin": "^13.3.0",
    "qrcode.react": "^3.2.0",
    "random-words": "^2.0.1",
    "resend": "^4.5.1",
    "lucide-react": "^0.503.0",
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

**Install command:**
```bash
npm install firebase firebase-admin qrcode.react random-words resend lucide-react
```

---

## 🔧 Environment Variables

Create/update your `.env.local` file:

```bash
# Firebase Client (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (Server-side only)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account@your_project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Resend Email Service
RESEND_API_KEY=re_your_resend_api_key
```

---

## 🗄️ Firebase Collections Structure

### Collection: `crypto-orders`
```typescript
{
  id: string;                          // Auto-generated document ID
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  cryptoType: 'BTC' | 'ETH' | 'USDT' | 'USDC';
  cryptoAmount: string;                // Amount of crypto to be sent
  cryptoAddress: string;               // Your wallet address
  usdAmount: number;                   // USD value at time of order
  verificationPhrase: string;          // Random words for verification
  
  // Challenge/Product Details
  challengeType?: string;              // e.g., "Gauntlet Activation"
  challengeAmount?: string;            // e.g., "$10k", "$25k"
  platform?: string;                   // e.g., "MT5", "MT4"
  
  // Customer Information
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  customerCountry: string;
  customerDiscordUsername?: string;
  
  // Optional Fields
  addOns?: string[];                   // Array of add-on identifiers
  discountCode?: string;
  discountId?: string;
  originalAmount?: number;
  
  // Timestamps
  createdAt: string;                   // ISO date string
  updatedAt: string;                   // ISO date string
}
```

### Collection: `users` (if using Firebase Auth)
```typescript
{
  uid: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // ... other user fields
}
```

---

## 🔐 Crypto Wallet Addresses

**IMPORTANT:** Update the wallet addresses in `app/components/CryptoPayment.tsx`:

```typescript
const CRYPTO_ADDRESSES: CryptoAddress = {
  BTC: 'bc1q4zs3mwhv50vgfp05pawdp0s2w8qfd0h824464u',  // ⚠️ REPLACE WITH YOUR BTC ADDRESS
  ETH: '0x54634008a757D262f0fD05213595dEE77a82026B',  // ⚠️ REPLACE WITH YOUR ETH ADDRESS
  USDT: 'TLVMLJhSmWTTtitpeF5Gvv2j4avXVZ3EMd',         // ⚠️ REPLACE WITH YOUR USDT (TRC20) ADDRESS
  USDC: '8ShmNrRPeN1KaCixPhPWPQTvZJn9a8s7oqsCdhoJgeJj'  // ⚠️ REPLACE WITH YOUR USDC (Solana) ADDRESS
};
```

---

## 🎨 Styling Requirements

The crypto checkout uses Tailwind CSS with a dark theme. Ensure your `tailwind.config.js` includes:

```javascript
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Your brand colors
        primary: '#0FF1CE',
        // ... other colors
      },
    },
  },
  plugins: [],
}
```

---

## 📧 Email Configuration (Resend)

1. Sign up at [resend.com](https://resend.com)
2. Add and verify your domain
3. Create an API key
4. Update `RESEND_API_KEY` in `.env.local`
5. Update the `from` email address in `lib/email.ts`:
   ```typescript
   from: 'support@your-domain.com',  // Update this
   ```

---

## 🔥 Firebase Setup

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Firestore Database
4. Enable Authentication (if using auth)

### Step 2: Get Client Credentials
1. Project Settings → General → Your apps
2. Add a web app
3. Copy the config object to `.env.local` as `NEXT_PUBLIC_*` variables

### Step 3: Get Admin Credentials
1. Project Settings → Service Accounts
2. Generate new private key
3. Copy the values to `.env.local` as `FIREBASE_ADMIN_*` variables

### Step 4: Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Crypto orders - Admin write, no read
    match /crypto-orders/{orderId} {
      allow read: if false;  // Only through admin SDK
      allow write: if true;  // Allow order creation from client
    }
    
    // Users - User can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🚀 Integration Steps

1. **Install Dependencies**
   ```bash
   npm install firebase firebase-admin qrcode.react random-words resend lucide-react
   ```

2. **Copy All Files**
   - Copy all files listed in the "Files to Copy" section
   - Maintain the same directory structure

3. **Configure Environment**
   - Set up `.env.local` with all required variables
   - Update crypto wallet addresses in `CryptoPayment.tsx`
   - Update email addresses in `lib/email.ts`

4. **Set Up Firebase**
   - Create Firebase project
   - Enable Firestore
   - Set up security rules
   - Get credentials

5. **Configure Resend**
   - Sign up and verify domain
   - Get API key

6. **Test the Flow**
   - Navigate to your crypto checkout page
   - Fill in the form
   - Select a cryptocurrency
   - Verify QR code and address display
   - Submit the form
   - Check Firebase for order creation
   - Check emails are sent

7. **Admin Dashboard**
   - Navigate to `/admin/crypto-orders`
   - Verify orders are displayed
   - Test order status updates

---

## 🔍 How It Works

### User Flow
1. User fills out form with personal details
2. User selects crypto payment option (BTC, ETH, USDT, or USDC)
3. System fetches live crypto prices from CoinGecko API
4. System displays:
   - QR code with payment URI
   - Wallet address (with copy button)
   - Exact crypto amount to send
   - Verification phrase (random words)
5. User types verification phrase to confirm they've read instructions
6. User sends crypto to displayed address
7. User clicks "I've Sent the Payment"
8. System creates order in Firebase with status "PENDING"
9. System sends emails:
   - Admin notification with order details
   - Customer confirmation with order summary
10. User redirected to pending page

### Admin Flow
1. Admin receives email notification
2. Admin checks crypto wallet for incoming transaction
3. Admin verifies transaction matches order details
4. Admin marks order as "COMPLETED" in dashboard
5. System sends customer "Payment Confirmed" email
6. Admin manually sends account credentials (or automates this separately)

---

## 🛡️ Security Considerations

1. **API Keys**: Never expose Firebase Admin or Resend keys to client
2. **Wallet Addresses**: Store in server environment for additional security
3. **Order Verification**: Always verify crypto transactions manually on blockchain
4. **Price Locking**: Prices are locked for 15 minutes (implement refresh logic)
5. **Firestore Rules**: Restrict read/write access appropriately
6. **Email Verification**: Validate email addresses before sending

---

## 🐛 Troubleshooting

### Crypto prices not loading
- Check CoinGecko API rate limits (429 errors)
- Verify `/api/crypto/prices` route is accessible
- Check browser console for errors

### Orders not saving to Firebase
- Verify Firebase Admin credentials in `.env.local`
- Check Firestore security rules
- Look for errors in server console

### Emails not sending
- Verify Resend API key
- Check domain verification in Resend dashboard
- Verify "from" email address is correct

### QR code not displaying
- Ensure `qrcode.react` is installed
- Check console for errors
- Verify crypto amount calculations

---

## 📱 Mobile Responsiveness

The crypto checkout is fully responsive. Key breakpoints:
- Mobile: Form stacks vertically
- Tablet: Side-by-side layout begins
- Desktop: Full multi-column layout

Test on:
- iPhone (Safari)
- Android (Chrome)
- iPad
- Desktop browsers

---

## 🎯 Customization Points

### Branding
- Update colors in Tailwind config
- Replace logo in Header component
- Modify email templates in `lib/email.ts`

### Payment Options
- Add/remove cryptocurrencies in `CryptoPayment.tsx`
- Update `CRYPTO_ADDRESSES` object
- Modify crypto selector UI

### Form Fields
- Customize form fields in gauntlet-activation page
- Update validation logic
- Modify Firebase order structure

### Pricing
- Update product prices
- Add discount logic
- Implement dynamic pricing

---

## 📊 Analytics & Monitoring

Consider adding:
- Google Analytics for conversion tracking
- Error monitoring (Sentry, LogRocket)
- Firebase Analytics for user behavior
- Custom admin dashboard metrics

---

## ✅ Pre-Launch Checklist

- [ ] All dependencies installed
- [ ] Environment variables configured
- [ ] Firebase project created and configured
- [ ] Resend domain verified
- [ ] Crypto wallet addresses updated
- [ ] Test order placed successfully
- [ ] Emails received (admin + customer)
- [ ] Order appears in Firebase
- [ ] Order appears in admin dashboard
- [ ] Mobile responsive testing complete
- [ ] Payment amounts calculate correctly
- [ ] QR codes display properly
- [ ] Verification phrase working
- [ ] Pending page displays correctly

---

## 🆘 Support Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Resend Documentation](https://resend.com/docs)
- [CoinGecko API](https://www.coingecko.com/en/api/documentation)
- [QR Code React](https://github.com/zpao/qrcode.react)

---

**Last Updated:** January 2026
**Version:** 1.0.0
