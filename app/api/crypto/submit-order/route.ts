import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { challengeData, cryptoDetails } = body;

    // Create crypto order in Firebase
    const orderData: any = {
      status: 'PENDING',
      cryptoType: cryptoDetails.type,
      cryptoAmount: cryptoDetails.amount.toString(),
      cryptoAddress: cryptoDetails.address,
      usdAmount: cryptoDetails.usdAmount,
      verificationPhrase: cryptoDetails.verificationPhrase,
      addOns: challengeData.addOns || [],
      customerEmail: challengeData.formData.email,
      customerName: `${challengeData.formData.firstName} ${challengeData.formData.lastName}`,
      customerPhone: challengeData.formData.phone,
      customerCountry: challengeData.formData.country,
      customerDiscordUsername: challengeData.formData.discordUsername || null,
      discountCode: challengeData.discount?.code || null,
      discountId: challengeData.discount?.id || null,
      originalAmount: challengeData.discount ? Math.round(challengeData.price / (1 - challengeData.discount.value / 100)) : challengeData.price,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Check if this is a subscription-based order or legacy single account order
    if (challengeData.subscriptionTier) {
      // New subscription-based order with multiple accounts
      orderData.subscriptionTier = challengeData.subscriptionTier;
      orderData.subscriptionPrice = challengeData.subscriptionPrice;
      orderData.accountsCount = challengeData.accountsCount;
      orderData.accounts = challengeData.accounts;
    } else {
      // Legacy single account order (for backward compatibility)
      orderData.challengeType = challengeData.type;
      orderData.challengeAmount = challengeData.amount;
      orderData.platform = challengeData.platform;
    }

    // If this is a fund trader application, include the application data
    if (challengeData.applicationData) {
      orderData.applicationData = challengeData.applicationData;
      orderData.applicationType = 'fund-trader';
    }

    const orderRef = await db.collection('crypto-orders').add(orderData);

    return NextResponse.json({ success: true, orderId: orderRef.id });
  } catch (error) {
    console.error('Error submitting crypto order:', error);
    return NextResponse.json(
      { error: 'Failed to submit order' },
      { status: 500 }
    );
  }
} 