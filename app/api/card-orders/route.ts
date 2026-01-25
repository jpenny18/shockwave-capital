import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET(req: Request) {
  try {
    // Fetch all card orders from Firebase Admin SDK (bypasses security rules)
    const ordersSnapshot = await db.collection('card-orders')
      .orderBy('createdAt', 'desc')
      .get();

    const orders = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching card orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Create card order in Firebase
    const orderData: any = {
      status: body.status || 'COMPLETED',
      paymentMethod: 'card',
      paymentStatus: body.paymentStatus || 'completed',
      customerEmail: body.customerEmail,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerCountry: body.customerCountry,
      customerDiscordUsername: body.customerDiscordUsername || null,
      addOns: body.addOns || [],
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: body.updatedAt || new Date().toISOString()
    };

    // Check if this is a subscription-based order or legacy single account order
    if (body.subscriptionTier) {
      // New subscription-based order with multiple accounts
      orderData.subscriptionTier = body.subscriptionTier;
      orderData.subscriptionPrice = body.subscriptionPrice;
      orderData.subscriptionPlanId = body.subscriptionPlanId;
      orderData.accountsCount = body.accountsCount;
      orderData.accounts = body.accounts;
      
      // Use totalAmount if provided (for completed orders), otherwise use subscriptionPrice
      orderData.totalAmount = body.totalAmount || body.subscriptionPrice;
    } else {
      // Legacy single account order (for backward compatibility)
      orderData.challengeType = body.challengeType;
      orderData.challengeAmount = body.challengeAmount;
      orderData.platform = body.platform;
      orderData.totalAmount = body.totalAmount;
    }

    // Only include receiptId and planId if they exist (not undefined)
    if (body.receiptId !== undefined) {
      orderData.receiptId = body.receiptId;
    }
    if (body.planId !== undefined) {
      orderData.planId = body.planId;
    }

    const orderRef = await db.collection('card-orders').add(orderData);

    return NextResponse.json({ success: true, orderId: orderRef.id });
  } catch (error) {
    console.error('Error submitting card order:', error);
    return NextResponse.json(
      { error: 'Failed to submit order' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { orderId, ...updateData } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const orderRef = db.collection('card-orders').doc(orderId);
    await orderRef.update({
      ...updateData,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error('Error updating card order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const orderRef = db.collection('card-orders').doc(orderId);
    await orderRef.delete();

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error('Error deleting card order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}
