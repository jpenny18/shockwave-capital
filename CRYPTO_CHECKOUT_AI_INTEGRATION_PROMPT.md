# AI Integration Prompt: Crypto Checkout Flow

## Objective
Set up a complete, functional cryptocurrency checkout system in a Next.js 14+ project with TypeScript, supporting BTC, ETH, USDT (TRC20), and USDC (Solana) payments, with Firebase backend and automated email notifications.

---

## Project Context
This is a Next.js 14 App Router project with:
- TypeScript
- Tailwind CSS for styling
- Firebase (Firestore + Auth)
- Resend for email delivery
- Dark theme UI (#0D0D0D background, #0FF1CE accent color)

---

## Required Integrations

### 1. **File Structure Setup**
Create the following directory structure and copy all files from the source project:

```
app/
├── components/
│   ├── CryptoPayment.tsx
│   ├── Header.tsx
│   └── Particles.tsx
├── gauntlet-activation/
│   ├── page.tsx
│   └── pending/
│       └── page.tsx
├── challenge/
│   └── cryptopending/
│       └── page.tsx
├── admin/
│   └── crypto-orders/
│       └── page.tsx
├── api/
│   ├── crypto/
│   │   ├── prices/
│   │   │   └── route.ts
│   │   └── submit-order/
│   │       └── route.ts
│   └── send-crypto-emails/
│       └── route.ts
lib/
├── firebase.ts
├── firebase-admin.ts
└── email.ts
```

### 2. **Dependencies Installation**
Install these exact packages:

```bash
npm install firebase@^10.10.0 firebase-admin@^13.3.0 qrcode.react@^3.2.0 random-words@^2.0.1 resend@^4.5.1 lucide-react@^0.503.0
```

### 3. **Environment Variables Configuration**
Set up `.env.local` with these variables:

```bash
# Firebase Client (Frontend)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (Backend API Routes)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# Email Service (Resend)
RESEND_API_KEY=
```

### 4. **Critical Customizations Required**

#### A. Update Crypto Wallet Addresses
In `app/components/CryptoPayment.tsx`, replace the addresses at line ~29:

```typescript
const CRYPTO_ADDRESSES: CryptoAddress = {
  BTC: 'YOUR_BITCOIN_ADDRESS',      // bc1... or 1... or 3...
  ETH: 'YOUR_ETHEREUM_ADDRESS',     // 0x...
  USDT: 'YOUR_USDT_TRC20_ADDRESS',  // T... (TRON network)
  USDC: 'YOUR_USDC_SOLANA_ADDRESS'  // Base58 encoded (Solana)
};
```

#### B. Update Email Sender Address
In `lib/email.ts`, find all instances of `from: 'support@shockwave-capital.com'` and replace with your verified domain:

```typescript
from: 'support@your-domain.com',
```

Also update the support email in the email templates (~line 221, 498, etc.).

#### C. Configure Redirect Paths
The crypto checkout uses these paths - ensure they exist or update:
- Success redirect: `/gauntlet-activation/pending` (or customize in page)
- Crypto pending: `/challenge/cryptopending`
- Dashboard: `/dashboard`
- Access/Auth: `/access`

### 5. **Firebase Configuration**

#### A. Firestore Collections
Create these collections with the specified structure:

**Collection: `crypto-orders`**
```typescript
{
  id: string;                    // Document ID (auto)
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  cryptoType: 'BTC' | 'ETH' | 'USDT' | 'USDC';
  cryptoAmount: string;
  cryptoAddress: string;
  usdAmount: number;
  verificationPhrase: string;
  challengeType?: string;
  challengeAmount?: string;
  platform?: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  customerCountry: string;
  customerDiscordUsername?: string;
  addOns?: string[];
  createdAt: string;
  updatedAt: string;
}
```

#### B. Security Rules
Apply these Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /crypto-orders/{orderId} {
      allow create: if true;
      allow read: if false;
      allow update, delete: if false;
    }
    
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 6. **Resend Email Setup**
1. Sign up at resend.com
2. Add and verify your domain
3. Generate API key
4. Add API key to `.env.local`
5. Update sender addresses in `lib/email.ts`

### 7. **API Routes Configuration**

Ensure these routes are accessible and working:

**`/api/crypto/prices`** - Fetches live crypto prices from CoinGecko
- GET request
- Returns: `{ BTC: number, ETH: number, USDT: number, USDC: number }`
- Caches for 15 minutes
- Falls back to hardcoded prices if API fails

**`/api/crypto/submit-order`** - Saves order to Firebase
- POST request
- Body: `{ challengeData, cryptoDetails }`
- Returns: `{ success: boolean, orderId: string }`

**`/api/send-crypto-emails`** - Sends order emails
- POST request
- Body: Order data with customer info
- Sends to both admin and customer

### 8. **Component Integration**

#### Page Usage Example
To use the crypto checkout on any page:

```tsx
'use client';

import CryptoPayment from '@/app/components/CryptoPayment';
import { useState, useEffect } from 'react';

export default function CheckoutPage() {
  const [cryptoPrices, setCryptoPrices] = useState({ BTC: 0, ETH: 0, USDT: 1, USDC: 1 });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetch('/api/crypto/prices')
      .then(res => res.json())
      .then(data => setCryptoPrices(data));
  }, []);

  const challengeData = {
    type: 'Your Product Type',
    amount: '$10k',
    platform: 'MT5',
    formData: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      country: 'United States',
      discordUsername: 'johndoe#1234'
    },
    price: 99,  // USD price
    addOns: []
  };

  return (
    <div>
      <CryptoPayment
        challengeData={challengeData}
        successRedirectPath="/success"
        onProcessingStateChange={setIsProcessing}
        cryptoPrices={cryptoPrices}
      />
    </div>
  );
}
```

### 9. **Admin Dashboard Access**

Navigate to `/admin/crypto-orders` to:
- View all crypto orders in real-time
- Filter by status, crypto type, customer info
- Mark orders as COMPLETED or CANCELLED
- View detailed order information
- Copy customer details
- Track order timestamps

**Features:**
- Real-time updates via Firebase listener
- Search by email, name, verification phrase
- Expandable rows for full order details
- Status badges (PENDING/COMPLETED/CANCELLED)
- Action buttons for order management

### 10. **Styling Integration**

The components use Tailwind with these key colors:
- Background: `#0D0D0D`, `#121212`, `#151515`
- Accent: `#0FF1CE` (cyan)
- Text: White, gray-400, gray-300
- Borders: `#2F2F2F`

Ensure your `tailwind.config.js` includes these or update the components accordingly.

### 11. **Testing Checklist**

After integration, test these flows:

**Frontend Flow:**
1. [ ] Form accepts all required fields
2. [ ] Crypto prices load from API
3. [ ] All 4 cryptocurrencies can be selected
4. [ ] QR codes generate for each crypto
5. [ ] Wallet addresses display correctly
6. [ ] Copy buttons work for addresses
7. [ ] Verification phrase generates (10 random words)
8. [ ] Typing verification phrase enables submit button
9. [ ] Submit creates order in Firebase
10. [ ] Redirect to pending page works

**Backend Flow:**
1. [ ] Order saves to `crypto-orders` collection
2. [ ] Admin email sends successfully
3. [ ] Customer email sends successfully
4. [ ] Order appears in admin dashboard
5. [ ] Order status can be updated from dashboard
6. [ ] Completion email triggers when marking COMPLETED

**Edge Cases:**
1. [ ] CoinGecko API failure falls back to cached/default prices
2. [ ] Email send failures don't block order creation
3. [ ] Duplicate submissions are handled
4. [ ] Invalid verification phrase blocks submission
5. [ ] Mobile responsiveness works

### 12. **Common Issues & Solutions**

**Issue: Firebase Admin not initializing**
- Check private key format (must include \n characters)
- Verify project ID matches in both client and admin configs

**Issue: Crypto prices always showing 0**
- Check CoinGecko API rate limits
- Verify `/api/crypto/prices` is accessible
- Check browser console for CORS errors

**Issue: Emails not sending**
- Verify Resend API key is valid
- Check domain is verified in Resend
- Confirm sender email matches verified domain

**Issue: QR code not rendering**
- Ensure `qrcode.react` is installed
- Check for console errors
- Verify crypto URIs are properly formatted

**Issue: Orders not showing in admin**
- Check Firestore security rules allow read for admin
- Verify Firebase listener is set up correctly
- Check browser console for errors

### 13. **Production Deployment Notes**

Before deploying:
1. ✅ Update all wallet addresses to production addresses
2. ✅ Configure production Firebase project
3. ✅ Set up production Resend domain
4. ✅ Test all environment variables
5. ✅ Enable Firebase billing (if using heavily)
6. ✅ Set up monitoring/error tracking
7. ✅ Test with small crypto amounts first
8. ✅ Document your crypto transaction verification process
9. ✅ Set up backup for Firebase data
10. ✅ Configure rate limiting on API routes

### 14. **Security Recommendations**

1. **Never expose private keys or admin credentials to client**
2. **Verify all crypto transactions manually on blockchain before fulfillment**
3. **Implement rate limiting on order creation API**
4. **Add CAPTCHA to prevent spam orders**
5. **Log all order status changes with timestamps**
6. **Set up alerting for suspicious activity**
7. **Regularly backup Firestore data**
8. **Use separate Firebase projects for dev/staging/prod**
9. **Implement IP-based fraud detection if needed**
10. **Store wallet private keys in secure vault (not in code)**

### 15. **Maintenance & Monitoring**

Set up monitoring for:
- CoinGecko API uptime and rate limits
- Firebase read/write quotas
- Resend email delivery rates
- Order conversion funnel
- Failed email attempts
- Blockchain confirmation times
- Customer support tickets related to payments

---

## Integration Success Criteria

✅ User can complete full checkout flow without errors
✅ Order appears in Firebase with correct data
✅ Both admin and customer receive emails
✅ Admin can view and manage orders in dashboard
✅ Crypto prices update in real-time
✅ QR codes generate correctly for all cryptos
✅ Mobile experience is smooth
✅ Error states are handled gracefully
✅ Order status updates trigger correct emails

---

## Quick Start Command Sequence

```bash
# 1. Install dependencies
npm install firebase firebase-admin qrcode.react random-words resend lucide-react

# 2. Copy all files from source (maintain structure)

# 3. Create .env.local with all variables

# 4. Update wallet addresses in CryptoPayment.tsx

# 5. Update email addresses in email.ts

# 6. Set up Firebase project and get credentials

# 7. Set up Resend and verify domain

# 8. Run dev server
npm run dev

# 9. Test checkout flow at /gauntlet-activation

# 10. Check admin dashboard at /admin/crypto-orders
```

---

## Expected Behavior

### User Journey:
1. User lands on checkout page → Sees product details and form
2. User fills form → Selects crypto → Sees live price
3. User sees QR code + address → Copies address
4. User types verification phrase → Enables submit button
5. User clicks "I've Sent Payment" → Order created in Firebase
6. User sees pending page → Receives email confirmation
7. Admin verifies transaction → Marks order complete
8. User receives completion email → Gets account credentials

### Admin Journey:
1. Admin receives email notification of new order
2. Admin checks crypto wallet for incoming transaction
3. Admin verifies transaction on blockchain explorer
4. Admin opens admin dashboard
5. Admin finds order and views details
6. Admin marks order as COMPLETED
7. System sends completion email to customer
8. Admin manually sends product/credentials (or automate)

---

## Customization Options

Feel free to modify:
- Form fields (add/remove as needed)
- Product types and pricing
- Email templates (branding, content, styling)
- Success/pending page designs
- Admin dashboard columns/filters
- Crypto currencies supported (add/remove)
- Verification phrase length
- Price lock duration (currently 15 min)

---

This should provide everything needed for a complete, functional crypto checkout integration. Test thoroughly in development before deploying to production.
