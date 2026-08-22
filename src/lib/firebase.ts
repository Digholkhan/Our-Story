import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile
} from 'firebase/auth';
import {
  getDatabase,
  Database,
  ref,
  onValue,
  set,
  remove,
  get
} from 'firebase/database';
import { UserRole } from '../types';

// Read Firebase Config from Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

// Check if valid credentials are set
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'your_api_key_here' &&
  (firebaseConfig.databaseURL || firebaseConfig.projectId)
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Database | null = null;
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getDatabase(app);
    console.log('⚡ Firebase initialized successfully');
  } catch (err) {
    console.warn('Firebase initialization failed, falling back to local mode:', err);
  }
} else {
  console.info('ℹ️ Firebase credentials not provided in .env - App running in local fallback mode. Realtime database will use local storage.');
}

export interface AuthUserInfo {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  activePartner: 'partner1' | 'partner2';
}

// Store current partner assignment in localStorage to persist per browser
const PARTNER_ASSIGNMENT_KEY = 'our_story_user_partner_role';

export function getStoredPartnerAssignment(email?: string | null): 'partner1' | 'partner2' {
  if (email) {
    const savedMapping = localStorage.getItem(`partner_role_${email}`);
    if (savedMapping === 'partner1' || savedMapping === 'partner2') {
      return savedMapping;
    }
  }
  const saved = localStorage.getItem(PARTNER_ASSIGNMENT_KEY);
  return saved === 'partner2' ? 'partner2' : 'partner1';
}

export function setStoredPartnerAssignment(role: 'partner1' | 'partner2', email?: string | null): void {
  localStorage.setItem(PARTNER_ASSIGNMENT_KEY, role);
  if (email) {
    localStorage.setItem(`partner_role_${email}`, role);
  }
}

// ================= AUTHENTICATION HELPERS =================

export async function signUpWithEmail(
  email: string,
  pass: string,
  name: string,
  partnerRole: 'partner1' | 'partner2'
): Promise<AuthUserInfo> {
  if (!auth) {
    // Local fallback sign up
    setStoredPartnerAssignment(partnerRole, email);
    const mockUser: AuthUserInfo = {
      uid: `local-${Date.now()}`,
      email,
      displayName: name,
      photoURL: null,
      role: partnerRole,
      activePartner: partnerRole
    };
    return mockUser;
  }

  const res = await createUserWithEmailAndPassword(auth, email, pass);
  if (name && auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName: name });
  }
  setStoredPartnerAssignment(partnerRole, email);

  return {
    uid: res.user.uid,
    email: res.user.email,
    displayName: name || res.user.displayName,
    photoURL: res.user.photoURL,
    role: partnerRole,
    activePartner: partnerRole
  };
}

export async function signInWithEmail(
  email: string,
  pass: string,
  partnerRole?: 'partner1' | 'partner2'
): Promise<AuthUserInfo> {
  if (!auth) {
    const role = partnerRole || getStoredPartnerAssignment(email);
    setStoredPartnerAssignment(role, email);
    return {
      uid: `local-${Date.now()}`,
      email,
      displayName: email.split('@')[0],
      photoURL: null,
      role: role,
      activePartner: role
    };
  }

  const res = await signInWithEmailAndPassword(auth, email, pass);
  const assignedRole = partnerRole || getStoredPartnerAssignment(res.user.email);
  setStoredPartnerAssignment(assignedRole, res.user.email);

  return {
    uid: res.user.uid,
    email: res.user.email,
    displayName: res.user.displayName,
    photoURL: res.user.photoURL,
    role: assignedRole,
    activePartner: assignedRole
  };
}

export async function signInWithGoogle(
  partnerRole?: 'partner1' | 'partner2'
): Promise<AuthUserInfo> {
  if (!auth) {
    const role = partnerRole || getStoredPartnerAssignment('google-user@gmail.com');
    setStoredPartnerAssignment(role, 'google-user@gmail.com');
    return {
      uid: `local-google-${Date.now()}`,
      email: 'google-user@gmail.com',
      displayName: 'Gmail User',
      photoURL: null,
      role: role,
      activePartner: role
    };
  }

  const res = await signInWithPopup(auth, googleProvider);
  const assignedRole = partnerRole || getStoredPartnerAssignment(res.user.email);
  setStoredPartnerAssignment(assignedRole, res.user.email);

  return {
    uid: res.user.uid,
    email: res.user.email,
    displayName: res.user.displayName,
    photoURL: res.user.photoURL,
    role: assignedRole,
    activePartner: assignedRole
  };
}

export async function resetPasswordEmail(email: string): Promise<void> {
  if (!auth) {
    console.log(`[Local Fallback] Password reset requested for ${email}`);
    return;
  }
  await sendPasswordResetEmail(auth, email);
}

export async function logoutFirebaseUser(): Promise<void> {
  if (auth) {
    await signOut(auth);
  }
}

export function subscribeToAuth(
  callback: (user: AuthUserInfo | null) => void
): () => void {
  if (!auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, (firebaseUser: User | null) => {
    if (firebaseUser) {
      const role = getStoredPartnerAssignment(firebaseUser.email);
      callback({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        role: role,
        activePartner: role
      });
    } else {
      callback(null);
    }
  });
}

// ================= REALTIME DATABASE HELPERS =================

export function subscribeToRealtimeNode<T>(
  nodePath: string,
  onData: (data: T | null) => void
): () => void {
  if (!db) {
    return () => {};
  }

  const nodeRef = ref(db, nodePath);
  return onValue(nodeRef, (snapshot) => {
    if (snapshot.exists()) {
      onData(snapshot.val() as T);
    } else {
      onData(null);
    }
  }, (err) => {
    console.error(`Realtime DB subscription error on node [${nodePath}]:`, err);
  });
}

export async function saveToRealtimeNode<T>(
  nodePath: string,
  data: T
): Promise<void> {
  if (!db) {
    return;
  }
  try {
    const nodeRef = ref(db, nodePath);
    await set(nodeRef, data);
  } catch (err) {
    console.error(`Error saving data to Realtime DB [${nodePath}]:`, err);
  }
}

export async function deleteRealtimeNode(nodePath: string): Promise<void> {
  if (!db) {
    return;
  }
  try {
    const nodeRef = ref(db, nodePath);
    await remove(nodeRef);
  } catch (err) {
    console.error(`Error removing node from Realtime DB [${nodePath}]:`, err);
  }
}

// Seed Realtime DB if nodes are empty
export async function seedRealtimeDBIfEmpty(
  seedDataMap: Record<string, any>
): Promise<void> {
  if (!db) return;

  for (const [nodePath, seedValue] of Object.entries(seedDataMap)) {
    try {
      const nodeRef = ref(db, nodePath);
      const snapshot = await get(nodeRef);
      if (!snapshot.exists() || snapshot.val() === null) {
        await set(nodeRef, seedValue);
        console.log(`🌱 Realtime DB seeded node: [${nodePath}]`);
      }
    } catch (err) {
      console.warn(`Failed to seed Realtime DB node [${nodePath}]:`, err);
    }
  }
}
