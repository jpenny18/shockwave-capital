import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendChallengeEmail } from '@/lib/email';

export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch admin status
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { isAdmin: true }
    });

    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { status } = await request.json();

    // Update order status
    const order = await prisma.cryptoOrder.update({
      where: { id: params.orderId },
      data: { status }
    });

    // If order is marked as completed, send success email
    if (status === 'COMPLETED') {
      await sendChallengeEmail({
        type: order.challengeType,
        amount: order.challengeAmount,
        platform: order.platform,
        email: order.customerEmail,
        name: order.customerName
      });
    }

    return NextResponse.json(order);
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
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch admin status
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { isAdmin: true }
    });

    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete the order
    await prisma.cryptoOrder.delete({
      where: { id: params.orderId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting crypto order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
} 