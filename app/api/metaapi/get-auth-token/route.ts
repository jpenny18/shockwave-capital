import { NextRequest, NextResponse } from 'next/server';

// MetaAPI auth token - you'll need to set this to your actual token
const METAAPI_AUTH_TOKEN = process.env.METAAPI_AUTH_TOKEN || 'your-metaapi-auth-token-here';
const BASE_URL = 'https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { accountId, transactionId } = body;

    // Validation
    if (!accountId || !transactionId) {
      return NextResponse.json(
        { error: 'Missing required parameters: accountId and transactionId are required' },
        { status: 400 }
      );
    }

    // Check if MetaAPI token is configured
    if (METAAPI_AUTH_TOKEN === 'your-metaapi-auth-token-here') {
      console.log('MetaAPI token not configured, returning mock auth token for development');
      
      // For development purposes, return a mock response
      // Replace this with actual MetaAPI integration once token is configured
      const mockAuthToken = `mock-token-${Date.now()}-${Math.random().toString(36).substr(2, 16)}`;
      
      return NextResponse.json({
        authToken: mockAuthToken,
        message: 'Mock auth token generated successfully (MetaAPI token not configured)',
        warning: 'This is a mock response. Please configure METAAPI_AUTH_TOKEN environment variable for production use.'
      });
    }

    const url = `${BASE_URL}/users/current/accounts/${accountId}/auth-token`;
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'auth-token': METAAPI_AUTH_TOKEN,
      'transaction-id': transactionId
    };

    console.log('Getting MetaAPI auth token for account:', {
      accountId,
      transactionId: transactionId.substring(0, 8) + '...'
    });

    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('MetaAPI get auth token error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      return NextResponse.json(
        { 
          error: errorData.message || `MetaAPI request failed with status ${response.status}`,
          details: errorData
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('MetaAPI auth token retrieved successfully for account:', accountId);

    return NextResponse.json({
      authToken: data.token,
      message: 'Auth token retrieved successfully'
    });

  } catch (error: any) {
    console.error('Error getting MetaAPI auth token:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 