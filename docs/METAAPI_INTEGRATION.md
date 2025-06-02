# MetaAPI Integration Documentation

## Overview

This document describes the MetaAPI integration for the Shockwave Capital trading dashboard, which provides live metrics tracking for trading accounts.

## System Architecture

### Components

1. **MetaAPI Extended Service** (`lib/metaapi-extended.ts`)

   - Wraps MetaAPI, MetaStats, and Risk Management APIs
   - Provides unified interface for account metrics
   - Handles data transformation and caching

2. **User Dashboard** (`app/dashboard/accounts/[accountId]/page.tsx`)

   - Displays live trading metrics
   - Shows trading objectives progress
   - Renders equity growth charts
   - Lists trading journal entries

3. **Admin Interface** (`app/admin/accounts/page.tsx`)

   - Search users by email
   - Configure MetaAPI account mappings
   - Manage account statuses

4. **Firebase Integration** (`lib/firebase.ts`)
   - Stores user-to-MetaAPI account mappings
   - Caches metrics to reduce API calls
   - Manages account configurations

## Key Features

### User Dashboard Features

#### 1. Key Metrics Display

- Balance
- Equity
- Average Profit/Loss
- Number of Trades
- Average Risk-Reward Ratio (RRR)
- Lots
- Expectancy
- Win Rate
- Profit Factor

#### 2. Trading Objectives (3x3 Grid)

- Minimum Trading Days
- Maximum Drawdown (%)
- Maximum Daily Drawdown (%)
- Profit Target (%)

Each objective shows:

- Target value
- Current value
- Pass/Fail status

#### 3. Trading Journal

- All opened and closed positions
- Trade details (symbol, type, volume, prices, profit)
- Real-time status updates

#### 4. Equity Growth Chart

- Interactive ApexCharts visualization
- Balance vs Equity over time
- Responsive design

#### 5. Account Information

- Account status
- Start date
- Account size
- Account type (Standard/Instant)
- Platform (MT4/MT5)
- Last update timestamp

### Admin Features

1. **User Search**

   - Email-based search
   - Auto-complete functionality
   - Display existing account mappings

2. **Account Configuration**
   - MetaAPI Account ID
   - MetaAPI Token (secure input)
   - Account type selection
   - Account size configuration
   - Platform selection
   - Status management
   - Challenge step tracking

## Data Flow

1. **User Authentication**

   - User logs in via Firebase Auth
   - System checks for MetaAPI account mapping

2. **Data Fetching**

   - Check cached metrics (30-minute TTL)
   - If stale, fetch from MetaAPI:
     - Account metrics
     - Trade history
     - Equity chart data
     - Account information

3. **Data Processing**

   - Calculate derived metrics (win rate, RRR)
   - Evaluate trading objectives
   - Format data for display

4. **Caching**
   - Store metrics in Firebase
   - Update last fetch timestamp
   - Reduce API calls

## Configuration

### Environment Variables

Add to `.env.local`:

```bash
# MetaAPI Configuration
NEXT_PUBLIC_METAAPI_TOKEN=your_metaapi_token
```

### Firebase Collections

#### userMetaApiAccounts

```typescript
{
  userId: string;
  accountId: string;
  accountToken: string;
  accountType: 'standard' | 'instant';
  accountSize: number;
  platform: 'mt4' | 'mt5';
  status: 'active' | 'inactive' | 'passed' | 'failed';
  step: 1 | 2;
  startDate: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastMetricsUpdate?: Timestamp;
  trackerId?: string;
}
```

#### cachedMetrics

```typescript
{
  accountId: string;
  balance: number;
  equity: number;
  averageProfit: number;
  averageLoss: number;
  numberOfTrades: number;
  averageRRR: number;
  lots: number;
  expectancy: number;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  dailyDrawdown: number;
  currentProfit: number;
  tradingDays: number;
  lastUpdated: Timestamp;
}
```

## Usage

### For Users

1. Purchase a trading challenge
2. Admin configures MetaAPI account
3. Navigate to Dashboard > My Accounts
4. Click on account to view metrics
5. Metrics auto-refresh every 30 minutes
6. Manual refresh available

### For Admins

1. Navigate to Admin > MetaAPI Accounts
2. Search for user by email
3. Select user from results
4. Enter MetaAPI credentials:
   - Account ID (from MetaAPI dashboard)
   - Account Token (from MetaAPI)
5. Configure account settings
6. Save configuration

## Security Considerations

1. **Token Storage**

   - MetaAPI tokens stored encrypted in Firebase
   - Never exposed to client-side code
   - Per-user token isolation

2. **Access Control**

   - Users can only view their own accounts
   - Admin-only account configuration
   - Firebase security rules enforce access

3. **Rate Limiting**
   - 30-minute cache reduces API calls
   - Manual refresh throttling
   - Graceful error handling

## Error Handling

1. **Connection Failures**

   - Display user-friendly error messages
   - Fallback to cached data when available
   - Retry mechanism with exponential backoff

2. **Invalid Credentials**

   - Clear error messages for admins
   - Account status updates
   - Logging for debugging

3. **API Limits**
   - Respect MetaAPI rate limits
   - Queue requests when necessary
   - Display loading states

## Monitoring

1. **Metrics to Track**

   - API call frequency
   - Cache hit rates
   - Error rates
   - User engagement

2. **Alerts**
   - Failed API connections
   - Expired tokens
   - High error rates
   - Cache failures

## Future Enhancements

1. **Real-time Updates**

   - WebSocket integration for live data
   - Push notifications for objectives

2. **Advanced Analytics**

   - Custom date ranges
   - Performance comparisons
   - Export functionality

3. **Multi-Account Support**

   - Multiple accounts per user
   - Account switching
   - Consolidated views

4. **Risk Management**
   - Automated drawdown alerts
   - Risk tracker integration
   - Custom risk parameters
