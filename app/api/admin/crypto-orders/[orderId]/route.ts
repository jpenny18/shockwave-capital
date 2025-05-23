import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { sendChallengeEmail } from '@/lib/email';

export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { status } = await request.json();

    // Update order status in Firebase
    const orderRef = db.collection('crypto-orders').doc(params.orderId);
    await orderRef.update({ 
      status,
      updatedAt: new Date().toISOString()
    });

    // Get the updated order
    const orderDoc = await orderRef.get();
    const order = orderDoc.data();

    // If order is marked as completed, send success email
    if (status === 'COMPLETED' && order) {
      await sendChallengeEmail({
        type: order.challengeType,
        amount: order.challengeAmount,
        platform: order.platform,
        email: order.customerEmail,
        name: order.customerName
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating crypto order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    // Delete the order from Firebase
    await db.collection('crypto-orders').doc(params.orderId).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting crypto order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
} 