import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  updateDoc, 
  Timestamp,
  getDocs,
  query,
  where,
  setDoc
} from 'firebase/firestore';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
  UserCredential
} from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Verify Firebase config is loaded
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.error('Firebase configuration is missing required values. Check your .env.local file.');
}

// Initialize Firebase
let app: FirebaseApp;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);

/**
 * Interface for user data to be stored in Firestore
 */
export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;
  status: 'active' | 'inactive';
  notes?: string;
  totalSpent?: number;
  orderCount?: number;
  lastOrderDate?: Timestamp;
}

/**
 * Interface for order data to be stored in Firestore
 */
export interface OrderData {
  userId?: string | null;
  customerEmail: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  discordUsername?: string;
  challengeType: string;
  challengeAmount: string;
  platform: string;
  totalAmount: number;
  paymentMethod: 'card' | 'crypto';
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed';
  paymentIntentId?: string;
  transactionId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Interface for MetaAPI account mapping in Firestore
 */
export interface UserMetaApiAccount {
  userId: string;
  accountId: string;
  accountToken: string;
  accountType: 'standard' | 'instant';
  accountSize: number;
  platform: 'mt4' | 'mt5';
  status: 'active' | 'inactive' | 'passed' | 'failed' | 'funded';
  step: 1 | 2 | 3; // 1 = Step 1, 2 = Step 2, 3 = Funded
  startDate: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastMetricsUpdate?: Timestamp;
  trackerId?: string; // Risk management tracker ID
  fundedDate?: Timestamp; // Date when account became funded
}

/**
 * Interface for cached MetaAPI metrics in Firestore
 */
export interface CachedMetrics {
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
  maxDailyDrawdown: number; // Maximum daily drawdown achieved during the challenge
  currentProfit: number;
  tradingDays: number;
  lastUpdated: Timestamp;
  // Additional cached data from enhanced metrics
  accountName?: string;
  broker?: string;
  server?: string;
  wonTrades?: number;
  lostTrades?: number;
  lastTrades?: any[];
  lastEquityChart?: any[];
  lastObjectives?: any;
  lastRiskEvents?: any[]; // Risk events from MetaAPI Risk Management
  lastPeriodStats?: any[]; // Period statistics from MetaAPI Risk Management
  lastTrackers?: any[]; // Risk management trackers
}

/**
 * Register a new user with email and password
 * @param email User's email
 * @param password User's password
 * @param userData Additional user data
 * @returns Firebase UserCredential
 */
export async function registerUser(
  email: string, 
  password: string, 
  userData: Partial<UserData>
): Promise<UserCredential> {
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Add display name if provided
    if (userData.displayName) {
      await updateProfile(user, {
        displayName: userData.displayName
      });
    }
    
    // Store additional user data in Firestore
    const now = Timestamp.now();
    const userDoc = {
      uid: user.uid,
      email: user.email || email,
      displayName: userData.displayName || '',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      phone: '',
      country: '',
      createdAt: now,
      updatedAt: now,
      status: 'active' as const,
      totalSpent: 0,
      orderCount: 0
    };
    
    await setDoc(doc(db, 'users', user.uid), userDoc);
    
    return userCredential;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

/**
 * Sign in a user with email and password
 * @param email User's email
 * @param password User's password
 * @returns Firebase UserCredential
 */
export async function signInUser(email: string, password: string): Promise<UserCredential> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Update last login timestamp in Firestore
    const userRef = doc(db, 'users', userCredential.user.uid);
    await updateDoc(userRef, {
      lastLoginAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    return userCredential;
  } catch (error) {
    console.error('Error signing in user:', error);
    throw error;
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

/**
 * Send a password reset email to the user
 * @param email User's email
 */
export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
}

/**
 * Get the current authenticated user
 * @returns Promise that resolves with the current user
 */
export function getCurrentUser(): Promise<FirebaseUser | null> {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      (error) => {
        reject(error);
      }
    );
  });
}

/**
 * Get a user from Firestore by ID
 * @param userId The user ID to retrieve
 * @returns The user data
 */
export async function getUser(userId: string): Promise<UserData | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserData;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error retrieving user:', error);
    throw error;
  }
}

/**
 * Get all users from Firestore
 * @returns Array of users
 */
export async function getAllUsers(): Promise<UserData[]> {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    
    const users: UserData[] = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data() as UserData);
    });
    
    return users;
  } catch (error) {
    console.error('Error retrieving users:', error);
    throw error;
  }
}

/**
 * Update a user's data in Firestore
 * @param userId The user ID to update
 * @param userData The user data to update
 */
export async function updateUser(userId: string, userData: Partial<UserData>): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

/**
 * Create a new order in Firestore
 * @param orderData Order data to be stored
 * @returns The created order's ID
 */
export async function createOrder(orderData: Omit<OrderData, 'createdAt' | 'updatedAt'>) {
  try {
    const now = Timestamp.now();
    
    const orderRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      createdAt: now,
      updatedAt: now,
    });
    
    // If order has a userId, update the user's order stats
    if (orderData.userId) {
      const userRef = doc(db, 'users', orderData.userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data() as UserData;
        await updateDoc(userRef, {
          totalSpent: (userData.totalSpent || 0) + orderData.totalAmount,
          orderCount: (userData.orderCount || 0) + 1,
          lastOrderDate: now,
          updatedAt: now
        });
      }
    }
    
    return orderRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

/**
 * Get an order from Firestore by ID
 * @param orderId The ID of the order to retrieve
 * @returns The order data
 */
export async function getOrder(orderId: string) {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (orderSnap.exists()) {
      return { id: orderSnap.id, ...orderSnap.data() } as OrderData & { id: string };
    } else {
      throw new Error(`Order with ID ${orderId} not found`);
    }
  } catch (error) {
    console.error('Error retrieving order:', error);
    throw error;
  }
}

/**
 * Update an order's payment status in Firestore
 * @param orderId The ID of the order to update
 * @param paymentStatus The new payment status
 * @param paymentIntentId Optional payment intent ID to store
 * @param transactionId Optional transaction ID to store
 */
export async function updateOrderPaymentStatus(
  orderId: string,
  paymentStatus: OrderData['paymentStatus'],
  paymentIntentId?: string,
  transactionId?: string
) {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const updateData: Partial<OrderData> = {
      paymentStatus,
      updatedAt: Timestamp.now(),
    };
    
    if (paymentIntentId) {
      updateData.paymentIntentId = paymentIntentId;
    }
    
    if (transactionId) {
      updateData.transactionId = transactionId;
    }
    
    await updateDoc(orderRef, updateData);
  } catch (error) {
    console.error('Error updating order payment status:', error);
    throw error;
  }
}

/**
 * Get orders by payment intent ID
 * @param paymentIntentId The payment intent ID to search for
 * @returns Array of matching orders
 */
export async function getOrdersByPaymentIntentId(paymentIntentId: string) {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('paymentIntentId', '==', paymentIntentId));
    const querySnapshot = await getDocs(q);
    
    const orders: Array<OrderData & { id: string }> = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as OrderData & { id: string });
    });
    
    return orders;
  } catch (error) {
    console.error('Error retrieving orders by payment intent ID:', error);
    throw error;
  }
}

/**
 * Get user's MetaAPI account mapping
 */
export async function getUserMetaApiAccount(userId: string): Promise<UserMetaApiAccount | null> {
  try {
    const accountsRef = collection(db, 'userMetaApiAccounts');
    const q = query(accountsRef, where('userId', '==', userId), where('status', '==', 'active'));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as UserMetaApiAccount;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user MetaAPI account:', error);
    throw error;
  }
}

/**
 * Get all MetaAPI accounts for a user
 */
export async function getAllUserMetaApiAccounts(userId: string): Promise<UserMetaApiAccount[]> {
  try {
    const accountsRef = collection(db, 'userMetaApiAccounts');
    const q = query(accountsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const accounts: UserMetaApiAccount[] = [];
    querySnapshot.forEach((doc) => {
      accounts.push(doc.data() as UserMetaApiAccount);
    });
    
    return accounts;
  } catch (error) {
    console.error('Error fetching user MetaAPI accounts:', error);
    throw error;
  }
}

/**
 * Create or update user's MetaAPI account mapping
 */
export async function setUserMetaApiAccount(data: Omit<UserMetaApiAccount, 'createdAt' | 'updatedAt'>): Promise<void> {
  try {
    const accountsRef = collection(db, 'userMetaApiAccounts');
    
    // Check if this specific accountId already exists for this user (to prevent duplicates)
    const duplicateQuery = query(
      accountsRef, 
      where('userId', '==', data.userId),
      where('accountId', '==', data.accountId)
    );
    const duplicateSnapshot = await getDocs(duplicateQuery);
    
    if (!duplicateSnapshot.empty) {
      // Update existing account with same accountId
      const docId = duplicateSnapshot.docs[0].id;
      await updateDoc(doc(db, 'userMetaApiAccounts', docId), {
        ...data,
        updatedAt: Timestamp.now()
      });
    } else {
      // Create new account (allow multiple accounts per user)
      await addDoc(accountsRef, {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    }
  } catch (error) {
    console.error('Error setting user MetaAPI account:', error);
    throw error;
  }
}

/**
 * Get cached metrics for an account
 */
export async function getCachedMetrics(accountId: string): Promise<CachedMetrics | null> {
  try {
    const metricsRef = doc(db, 'cachedMetrics', accountId);
    const metricsSnap = await getDoc(metricsRef);
    
    if (metricsSnap.exists()) {
      return metricsSnap.data() as CachedMetrics;
    }
    return null;
  } catch (error) {
    console.error('Error fetching cached metrics:', error);
    throw error;
  }
}

/**
 * Update cached metrics for an account
 */
export async function updateCachedMetrics(accountId: string, metrics: Omit<CachedMetrics, 'lastUpdated'>): Promise<void> {
  try {
    const metricsRef = doc(db, 'cachedMetrics', accountId);
    await setDoc(metricsRef, {
      ...metrics,
      lastUpdated: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating cached metrics:', error);
    throw error;
  }
}

export { app, db, auth, Timestamp }; 