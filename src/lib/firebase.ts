import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import {
  Auth,
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword,
  updateProfile,
  User,
} from "firebase/auth";
import {
  Database,
  get,
  getDatabase,
  onDisconnect,
  onValue,
  ref,
  remove,
  set,
} from "firebase/database";
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import {
  deleteObject,
  FirebaseStorage,
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  UploadTask,
} from "firebase/storage";
import { CoupleProfile, UserRole } from "../types";

// Read Firebase Config from Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

export const configuredCoupleId = import.meta.env.VITE_FIREBASE_COUPLE_ID || "";

// Check if valid credentials are set
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "your_api_key_here" &&
  (firebaseConfig.databaseURL || firebaseConfig.projectId),
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Database | null = null;
let firestore: Firestore | null = null;
let storage: FirebaseStorage | null = null;
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getDatabase(app);
    firestore = getFirestore(app);
    storage = getStorage(app);
    console.log("⚡ Firebase initialized successfully");
  } catch (err) {
    console.warn(
      "Firebase initialization failed, falling back to local mode:",
      err,
    );
  }
} else {
  console.info(
    "ℹ️ Firebase credentials not provided in .env - App running in local fallback mode. Realtime database will use local storage.",
  );
}

export interface AuthUserInfo {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  activePartner: "partner1" | "partner2";
  emailVerified: boolean;
  provider: string;
  coupleId: string | null;
}

export function getCurrentCoupleId(): string | null {
  return configuredCoupleId || null;
}

function currentUid(): string | null {
  return auth?.currentUser?.uid || null;
}

async function saveUserProfile(user: User, role: UserRole): Promise<void> {
  if (!firestore) return;
  const userRef = doc(firestore, "users", user.uid);
  const existing = await getDoc(userRef);
  await setDoc(
    userRef,
    {
      uid: user.uid,
      displayName: user.displayName || "",
      email: user.email,
      photoURL: user.photoURL,
      provider: user.providerData[0]?.providerId || "password",
      emailVerified: user.emailVerified,
      role,
      coupleId: existing.exists()
        ? existing.data().coupleId || configuredCoupleId || null
        : configuredCoupleId || null,
      createdAt: existing.exists()
        ? existing.data().createdAt
        : serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function refreshAuthUser(): Promise<AuthUserInfo | null> {
  if (!auth?.currentUser) return null;
  await reload(auth.currentUser);
  const user = auth.currentUser;
  const role = getStoredPartnerAssignment(user.email);
  await saveUserProfile(user, role);
  return toAuthUserInfo(user, role);
}

function toAuthUserInfo(user: User, role: UserRole): AuthUserInfo {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    role,
    activePartner: role === "partner2" ? "partner2" : "partner1",
    emailVerified: user.emailVerified,
    provider: user.providerData[0]?.providerId || "password",
    coupleId: configuredCoupleId || null,
  };
}

export async function resendVerificationEmail(): Promise<void> {
  if (auth?.currentUser && !auth.currentUser.emailVerified)
    await sendEmailVerification(auth.currentUser);
}

export async function changePassword(password: string): Promise<void> {
  if (!auth?.currentUser) throw new Error("You must be signed in.");
  await updatePassword(auth.currentUser, password);
}

export async function deleteCurrentAccount(): Promise<void> {
  if (!auth?.currentUser) throw new Error("You must be signed in.");
  await deleteUser(auth.currentUser);
}

// Store current partner assignment in localStorage to persist per browser
const PARTNER_ASSIGNMENT_KEY = "our_story_user_partner_role";

export function getStoredPartnerAssignment(
  email?: string | null,
): "partner1" | "partner2" {
  if (email) {
    const savedMapping = localStorage.getItem(`partner_role_${email}`);
    if (savedMapping === "partner1" || savedMapping === "partner2") {
      return savedMapping;
    }
  }
  const saved = localStorage.getItem(PARTNER_ASSIGNMENT_KEY);
  return saved === "partner2" ? "partner2" : "partner1";
}

export function setStoredPartnerAssignment(
  role: "partner1" | "partner2",
  email?: string | null,
): void {
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
  partnerRole: "partner1" | "partner2",
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
      activePartner: partnerRole,
      emailVerified: true,
      provider: "password",
      coupleId: configuredCoupleId || null,
    };
    return mockUser;
  }

  const res = await createUserWithEmailAndPassword(auth, email, pass);
  if (name && auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName: name });
  }
  await saveUserProfile(res.user, partnerRole);
  if (!res.user.emailVerified) await sendEmailVerification(res.user);
  setStoredPartnerAssignment(partnerRole, email);

  return {
    uid: res.user.uid,
    email: res.user.email,
    displayName: name || res.user.displayName,
    photoURL: res.user.photoURL,
    role: partnerRole,
    activePartner: partnerRole,
    emailVerified: res.user.emailVerified,
    provider: res.user.providerData[0]?.providerId || "password",
    coupleId: configuredCoupleId || null,
  };
}

export async function signInWithEmail(
  email: string,
  pass: string,
  partnerRole?: "partner1" | "partner2",
): Promise<AuthUserInfo> {
  if (!auth) {
    const role = partnerRole || getStoredPartnerAssignment(email);
    setStoredPartnerAssignment(role, email);
    return {
      uid: `local-${Date.now()}`,
      email,
      displayName: email.split("@")[0],
      photoURL: null,
      role: role,
      activePartner: role,
      emailVerified: true,
      provider: "password",
      coupleId: configuredCoupleId || null,
    };
  }

  const res = await signInWithEmailAndPassword(auth, email, pass);
  const assignedRole =
    partnerRole || getStoredPartnerAssignment(res.user.email);
  setStoredPartnerAssignment(assignedRole, res.user.email);
  await saveUserProfile(res.user, assignedRole);

  return {
    uid: res.user.uid,
    email: res.user.email,
    displayName: res.user.displayName,
    photoURL: res.user.photoURL,
    role: assignedRole,
    activePartner: assignedRole,
    emailVerified: res.user.emailVerified,
    provider: res.user.providerData[0]?.providerId || "password",
    coupleId: configuredCoupleId || null,
  };
}

export async function signInWithGoogle(
  partnerRole?: "partner1" | "partner2",
): Promise<AuthUserInfo> {
  if (!auth) {
    const role =
      partnerRole || getStoredPartnerAssignment("google-user@gmail.com");
    setStoredPartnerAssignment(role, "google-user@gmail.com");
    return {
      uid: `local-google-${Date.now()}`,
      email: "google-user@gmail.com",
      displayName: "Gmail User",
      photoURL: null,
      role: role,
      activePartner: role,
      emailVerified: true,
      provider: "google.com",
      coupleId: configuredCoupleId || null,
    };
  }

  const res = await signInWithPopup(auth, googleProvider);
  const assignedRole =
    partnerRole || getStoredPartnerAssignment(res.user.email);
  setStoredPartnerAssignment(assignedRole, res.user.email);
  await saveUserProfile(res.user, assignedRole);

  return {
    uid: res.user.uid,
    email: res.user.email,
    displayName: res.user.displayName,
    photoURL: res.user.photoURL,
    role: assignedRole,
    activePartner: assignedRole,
    emailVerified: res.user.emailVerified,
    provider: res.user.providerData[0]?.providerId || "google.com",
    coupleId: configuredCoupleId || null,
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
  callback: (user: AuthUserInfo | null) => void,
): () => void {
  if (!auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, (firebaseUser: User | null) => {
    if (firebaseUser) {
      const role = getStoredPartnerAssignment(firebaseUser.email);
      void saveUserProfile(firebaseUser, role);
      callback(toAuthUserInfo(firebaseUser, role));
    } else {
      callback(null);
    }
  });
}

const PRIVATE_COLLECTIONS = new Set([
  "albums",
  "memories",
  "timeline",
  "letters",
  "calendarEvents",
  "dateIdeas",
  "goals",
  "bucketList",
  "futureMemories",
  "loveReasons",
  "notes",
  "songs",
  "surprises",
  "chatMessages",
]);

function coupleCollection(name: string) {
  const coupleId = getCurrentCoupleId();
  if (!firestore || !coupleId) return null;
  return collection(firestore, "couples", coupleId, name);
}

export function subscribeToCoupleCollection<T>(
  name: string,
  onData: (data: T[]) => void,
): () => void {
  const source = coupleCollection(name);
  if (!source || !currentUid()) return () => onData([]);
  return onSnapshot(
    query(source, orderBy("createdAt", "desc"), limit(200)),
    (snapshot) => {
      onData(
        snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as T),
      );
    },
    (error) => console.error(`Firestore subscription error [${name}]:`, error),
  );
}

export function subscribeToCoupleProfile(
  onData: (data: CoupleProfile | null) => void,
): () => void {
  if (!firestore || !getCurrentCoupleId() || !currentUid()) return () => {};
  return onSnapshot(
    doc(firestore, "couples", getCurrentCoupleId()!, "settings", "profile"),
    (snapshot) => {
      onData(snapshot.exists() ? (snapshot.data() as CoupleProfile) : null);
    },
    (error) => console.error("Firestore profile subscription error:", error),
  );
}

export async function saveCoupleDocument<T extends { id: string }>(
  name: string,
  item: T,
): Promise<void> {
  const source = coupleCollection(name);
  const uid = currentUid();
  if (!source || !uid) throw new Error("Sign in to save couple data.");
  const itemRef = doc(source, item.id);
  const existing = await getDoc(itemRef);
  await setDoc(
    itemRef,
    {
      ...item,
      createdBy: (item as T & { createdBy?: string }).createdBy || uid,
      createdAt: existing.exists()
        ? existing.data().createdAt
        : serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function saveCoupleProfile(profile: CoupleProfile): Promise<void> {
  if (!firestore || !getCurrentCoupleId() || !currentUid())
    throw new Error("Sign in to save couple data.");
  await setDoc(
    doc(firestore, "couples", getCurrentCoupleId()!, "settings", "profile"),
    {
      ...profile,
      updatedAt: serverTimestamp(),
      updatedBy: currentUid(),
    },
    { merge: true },
  );
}

export async function deleteCoupleDocument(
  name: string,
  id: string,
): Promise<void> {
  const source = coupleCollection(name);
  if (!source || !currentUid())
    throw new Error("Sign in to delete couple data.");
  await deleteDoc(doc(source, id));
}

export interface UploadResult {
  downloadURL: string;
  storagePath: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

export function uploadCoupleFile(
  path: string,
  file: File,
  onProgress?: (progress: number) => void,
): Promise<UploadResult> {
  if (!storage || !currentUid() || !getCurrentCoupleId())
    return Promise.reject(new Error("Sign in before uploading media."));
  if (
    ![
      "image/jpeg",
      "image/png",
      "image/webp",
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
    ].includes(file.type)
  )
    return Promise.reject(new Error("Unsupported file type."));
  if (file.size > 25 * 1024 * 1024)
    return Promise.reject(new Error("File must be 25 MB or smaller."));
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const fullPath = `${path}/${currentUid()}-${Date.now()}-${safeName}`;
  const task: UploadTask = uploadBytesResumable(
    storageRef(storage, fullPath),
    file,
    { contentType: file.type },
  );
  return new Promise((resolve, reject) => {
    task.on(
      "state_changed",
      (snapshot) =>
        onProgress?.((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
      reject,
      async () => {
        resolve({
          downloadURL: await getDownloadURL(task.snapshot.ref),
          storagePath: fullPath,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        });
      },
    );
  });
}

export async function deleteCoupleFile(path: string): Promise<void> {
  if (storage && path) await deleteObject(storageRef(storage, path));
}

export function subscribeToPresence(
  coupleId: string,
  onData: (data: { state: string; lastChanged: number } | null) => void,
): () => void {
  if (!db || !currentUid()) return () => {};
  const presenceRef = ref(db, `status/${currentUid()}`);
  const connectedRef = ref(db, ".info/connected");
  const stopConnection = onValue(connectedRef, async (snapshot) => {
    if (snapshot.val() !== true) return;
    await onDisconnect(presenceRef).set({
      state: "offline",
      coupleId,
      lastChanged: Date.now(),
    });
    await set(presenceRef, {
      state: "online",
      coupleId,
      lastChanged: Date.now(),
    });
  });
  const stopPresence = onValue(presenceRef, (snapshot) =>
    onData(snapshot.exists() ? snapshot.val() : null),
  );
  return () => {
    stopConnection();
    stopPresence();
    void set(presenceRef, {
      state: "offline",
      coupleId,
      lastChanged: Date.now(),
    });
  };
}

// ================= REALTIME DATABASE HELPERS =================

export function subscribeToRealtimeNode<T>(
  nodePath: string,
  onData: (data: T | null) => void,
): () => void {
  if (isFirebaseConfigured && nodePath === "profile")
    return subscribeToCoupleProfile(
      onData as (data: CoupleProfile | null) => void,
    );
  if (isFirebaseConfigured && PRIVATE_COLLECTIONS.has(nodePath)) {
    return subscribeToCoupleCollection<T>(nodePath, (items) =>
      onData(items as T),
    );
  }
  if (!db) {
    return () => {};
  }

  const nodeRef = ref(db, nodePath);
  return onValue(
    nodeRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onData(snapshot.val() as T);
      } else {
        onData(null);
      }
    },
    (err) => {
      console.error(
        `Realtime DB subscription error on node [${nodePath}]:`,
        err,
      );
    },
  );
}

export async function saveToRealtimeNode<T>(
  nodePath: string,
  data: T,
): Promise<void> {
  if (isFirebaseConfigured && nodePath === "profile") {
    await saveCoupleProfile(data as CoupleProfile);
    return;
  }
  if (
    isFirebaseConfigured &&
    PRIVATE_COLLECTIONS.has(nodePath) &&
    Array.isArray(data)
  ) {
    const source = coupleCollection(nodePath);
    if (!source || !currentUid())
      throw new Error("Sign in to save couple data.");
    const batch = writeBatch(firestore!);
    const nextIds = new Set<string>();
    for (const item of data as Array<{ id: string }>) {
      nextIds.add(item.id);
      batch.set(
        doc(source, item.id),
        {
          ...item,
          createdBy: (item as { createdBy?: string }).createdBy || currentUid(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
    }
    const snapshot = await getDoc(
      doc(firestore!, "couples", getCurrentCoupleId()!, "_indexes", nodePath),
    );
    const previousIds = (snapshot.data()?.ids || []) as string[];
    previousIds
      .filter((id) => !nextIds.has(id))
      .forEach((id) => batch.delete(doc(source, id)));
    batch.set(
      doc(firestore!, "couples", getCurrentCoupleId()!, "_indexes", nodePath),
      { ids: [...nextIds], updatedAt: serverTimestamp() },
    );
    await batch.commit();
    return;
  }
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
  seedDataMap: Record<string, any>,
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
