import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export async function GET(request: NextRequest) {
  try {
    const ordersRef = db.collection('card-orders');
    const snapshot = await ordersRef.orderBy('createdAt', 'desc').get();
    
    const orders = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?._seconds 
          ? new Date(data.createdAt._seconds * 1000).toISOString()
          : data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt?._seconds
          ? new Date(data.updatedAt._seconds * 1000).toISOString()
          : data.updatedAt || new Date().toISOString(),
      };
    });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error('Error fetching card orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch card orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const orderData = {
      ...body,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await db.collection('card-orders').add(orderData);
    
    return NextResponse.json(
      { success: true, orderId: docRef.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating card order:', error);
    return NextResponse.json(
      { error: 'Failed to create card order' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, ...updateData } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    await db.collection('card-orders').doc(orderId).update({
      ...updateData,
      updatedAt: Timestamp.now(),
    });

    return NextResponse.json(
      { success: true, message: 'Order updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating card order:', error);
    return NextResponse.json(
      { error: 'Failed to update card order' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    await db.collection('card-orders').doc(orderId).delete();

    return NextResponse.json(
      { success: true, message: 'Order deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting card order:', error);
    return NextResponse.json(
      { error: 'Failed to delete card order' },
      { status: 500 }
    );
  }
}
