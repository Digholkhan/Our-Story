import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import { CoupleProfile, UserRole } from "../types";

function readEnv(name: string): string {
  const value = String(import.meta.env[name] || "").trim();
  return value.replace(/^(['"])(.*)\1$/, "$2").trim();
}

const supabaseUrl = readEnv("VITE_SUPABASE_URL");
const supabaseAnonKey = readEnv("VITE_SUPABASE_ANON_KEY");
const configuredCoupleId = readEnv("VITE_SUPABASE_COUPLE_ID");
const mediaBucket = readEnv("VITE_SUPABASE_BUCKET") || "couple-media";

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && configuredCoupleId,
);

let supabase: SupabaseClient | null = null;
if (isSupabaseConfigured) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  console.log("Supabase initialized successfully");
} else {
  console.warn(
    "Supabase is not configured. Provide VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, and VITE_SUPABASE_COUPLE_ID.",
  );
}

const PARTNER_ASSIGNMENT_KEY = "our_story_user_partner_role";

type PartnerRole = "partner1" | "partner2";

let realtimeSubscriptionId = 0;

export interface AuthUserInfo {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  activePartner: PartnerRole;
  emailVerified: boolean;
  provider: string;
  coupleId: string | null;
}

interface NodeRecord {
  couple_id: string;
  node_path: string;
  payload: unknown;
  updated_by: string | null;
  updated_at: string;
}

interface PresenceRecord {
  user_id: string;
  couple_id: string;
  state: "online" | "offline";
  last_changed: string;
}

export function getCurrentCoupleId(): string | null {
  return configuredCoupleId || null;
}

function partnerFromRole(role: UserRole): PartnerRole {
  return role === "partner2" ? "partner2" : "partner1";
}

export function getStoredPartnerAssignment(email?: string | null): PartnerRole {
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
  role: PartnerRole,
  email?: string | null,
): void {
  localStorage.setItem(PARTNER_ASSIGNMENT_KEY, role);
  if (email) {
    localStorage.setItem(`partner_role_${email}`, role);
  }
}

function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, and VITE_SUPABASE_COUPLE_ID in Vercel and redeploy.",
    );
  }
  return supabase;
}

function userToAuthInfo(user: User, role: UserRole): AuthUserInfo {
  const provider =
    (user.app_metadata?.provider as string | undefined) || "password";
  const displayName =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    (user.user_metadata?.display_name as string | undefined) ||
    user.email?.split("@")[0] ||
    null;

  return {
    uid: user.id,
    email: user.email || null,
    displayName,
    photoURL: (user.user_metadata?.avatar_url as string | undefined) || null,
    role,
    activePartner: partnerFromRole(role),
    emailVerified: Boolean(user.email_confirmed_at),
    provider,
    coupleId: configuredCoupleId || null,
  };
}

async function saveUserProfile(user: User, role: UserRole): Promise<void> {
  const client = requireSupabase();
  const payload = {
    id: user.id,
    email: user.email,
    display_name:
      (user.user_metadata?.full_name as string | undefined) ||
      (user.user_metadata?.name as string | undefined) ||
      null,
    photo_url: (user.user_metadata?.avatar_url as string | undefined) || null,
    provider: (user.app_metadata?.provider as string | undefined) || "password",
    email_verified: Boolean(user.email_confirmed_at),
    role,
    couple_id: configuredCoupleId,
    updated_at: new Date().toISOString(),
  };

  const { error } = await client.from("app_users").upsert(payload);
  if (error) {
    throw new Error(`Unable to save user profile: ${error.message}`);
  }
}

export async function refreshAuthUser(): Promise<AuthUserInfo | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) return null;
  const role = getStoredPartnerAssignment(data.user.email);
  await saveUserProfile(data.user, role);
  return userToAuthInfo(data.user, role);
}

export async function resendVerificationEmail(): Promise<void> {
  if (!supabase) return;
  const { data } = await supabase.auth.getUser();
  if (!data.user?.email) return;
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: data.user.email,
  });
  if (error) throw error;
}

export async function changePassword(password: string): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.auth.updateUser({ password });
  if (error) throw error;
}

export async function deleteCurrentAccount(): Promise<void> {
  throw new Error(
    "Supabase account deletion needs a secure server endpoint with service role key.",
  );
}

export async function signUpWithEmail(
  email: string,
  pass: string,
  name: string,
  partnerRole: PartnerRole,
): Promise<AuthUserInfo> {
  const client = requireSupabase();
  const { data, error } = await client.auth.signUp({
    email,
    password: pass,
    options: {
      data: { full_name: name, partner_role: partnerRole },
      emailRedirectTo: window.location.origin,
    },
  });
  if (error) throw error;
  if (!data.user) throw new Error("Sign up failed.");

  setStoredPartnerAssignment(partnerRole, email);
  if (data.session) {
    await saveUserProfile(data.user, partnerRole);
  }
  return userToAuthInfo(data.user, partnerRole);
}

export async function signInWithEmail(
  email: string,
  pass: string,
  partnerRole: PartnerRole,
): Promise<AuthUserInfo> {
  const client = requireSupabase();
  // Set this before signInWithPassword triggers onAuthStateChange.
  setStoredPartnerAssignment(partnerRole, email);
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password: pass,
  });
  if (error) throw error;
  if (!data.user) throw new Error("Sign in failed.");

  const role = partnerRole;
  await client.auth.updateUser({ data: { partner_role: role } });
  setStoredPartnerAssignment(role, data.user.email);
  await saveUserProfile(data.user, role);
  return userToAuthInfo(data.user, role);
}

export async function resetPasswordEmail(email: string): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin,
  });
  if (error) throw error;
}

export async function logoutSupabaseUser(): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export function subscribeToAuth(
  callback: (user: AuthUserInfo | null) => void,
): () => void {
  if (!supabase) {
    callback(null);
    return () => {};
  }

  supabase.auth.getUser().then(({ data }) => {
    if (!data.user) {
      callback(null);
      return;
    }
    const pendingRole = localStorage.getItem("pending_partner_role");
    const resolvedRole =
      pendingRole === "partner1" || pendingRole === "partner2"
        ? pendingRole
        : getStoredPartnerAssignment(data.user.email);
    if (pendingRole) localStorage.removeItem("pending_partner_role");
    setStoredPartnerAssignment(resolvedRole, data.user.email);
    void saveUserProfile(data.user, resolvedRole as PartnerRole)
      .catch((err) => console.error(err))
      .finally(() =>
        callback(userToAuthInfo(data.user!, resolvedRole as UserRole)),
      );
  });

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    const authUser = session?.user;
    if (!authUser) {
      callback(null);
      return;
    }
    const pendingRole = localStorage.getItem("pending_partner_role");
    const resolvedRole =
      pendingRole === "partner1" || pendingRole === "partner2"
        ? pendingRole
        : getStoredPartnerAssignment(authUser.email);
    if (pendingRole) localStorage.removeItem("pending_partner_role");
    setStoredPartnerAssignment(resolvedRole, authUser.email);

    void saveUserProfile(authUser, resolvedRole as PartnerRole)
      .catch((err) => console.error(err))
      .finally(() =>
        callback(userToAuthInfo(authUser, resolvedRole as UserRole)),
      );
  });

  return () => subscription.unsubscribe();
}

export interface UploadResult {
  downloadURL: string;
  storagePath: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

export async function uploadCoupleFile(
  path: string,
  file: File,
  onProgress?: (progress: number) => void,
): Promise<UploadResult> {
  const client = requireSupabase();
  const { data: authData } = await client.auth.getUser();
  if (!authData.user || !getCurrentCoupleId()) {
    throw new Error("Sign in before uploading media.");
  }
  if (
    ![
      "image/jpeg",
      "image/png",
      "image/webp",
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
    ].includes(file.type)
  ) {
    throw new Error("Unsupported file type.");
  }
  if (file.size > 25 * 1024 * 1024) {
    throw new Error("File must be 25 MB or smaller.");
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const fullPath = `couples/${getCurrentCoupleId()}/${path}/${authData.user.id}-${Date.now()}-${safeName}`;

  onProgress?.(20);
  const { error } = await client.storage
    .from(mediaBucket)
    .upload(fullPath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  onProgress?.(100);
  const { data } = client.storage.from(mediaBucket).getPublicUrl(fullPath);

  return {
    downloadURL: data.publicUrl,
    storagePath: fullPath,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
  };
}

export async function deleteCoupleFile(path: string): Promise<void> {
  if (!supabase || !path) return;
  const { error } = await supabase.storage.from(mediaBucket).remove([path]);
  if (error) throw error;
}

async function readNode<T>(nodePath: string): Promise<T | null> {
  const client = requireSupabase();
  const coupleId = getCurrentCoupleId();
  if (!coupleId) return null;
  const { data, error } = await client
    .from("couple_nodes")
    .select("payload")
    .eq("couple_id", coupleId)
    .eq("node_path", nodePath)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return (data.payload as T) || null;
}

export function subscribeToRealtimeNode<T>(
  nodePath: string,
  onData: (data: T | null) => void,
): () => void {
  if (!supabase || !getCurrentCoupleId()) {
    return () => {};
  }

  const coupleId = getCurrentCoupleId()!;
  void readNode<T>(nodePath)
    .then((data) => onData(data))
    .catch((err) => console.error(`Failed reading node ${nodePath}:`, err));

  const channel = supabase
    .channel(
      `couple-nodes-${encodeURIComponent(coupleId)}-${encodeURIComponent(nodePath)}-${++realtimeSubscriptionId}`,
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "couple_nodes",
        filter: `couple_id=eq.${coupleId}`,
      },
      (payload) => {
        const next = payload.new as NodeRecord | undefined;
        const prev = payload.old as NodeRecord | undefined;

        if (payload.eventType === "DELETE") {
          if (prev?.node_path === nodePath) onData(null);
          return;
        }

        if (next?.node_path === nodePath) {
          onData((next.payload as T) || null);
        }
      },
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}

export async function saveToRealtimeNode<T>(
  nodePath: string,
  data: T,
  bypassAuth: boolean = false,
): Promise<void> {
  const client = requireSupabase();
  const coupleId = getCurrentCoupleId();
  if (!coupleId) {
    throw new Error("Couple ID is not configured.");
  }
  const { data: authData } = await client.auth.getUser();
  if (!bypassAuth && !authData?.user) {
    throw new Error("Sign in to save couple data.");
  }

  const payload: any = {
    couple_id: coupleId,
    node_path: nodePath,
    payload: data,
    updated_at: new Date().toISOString(),
  };

  if (authData?.user) {
    payload.updated_by = authData.user.id;
  }

  const { error } = await client.from("couple_nodes").upsert(payload);
  if (error) throw new Error(`Unable to save ${nodePath}: ${error.message}`);
}

export async function deleteRealtimeNode(nodePath: string): Promise<void> {
  const client = requireSupabase();
  const coupleId = getCurrentCoupleId();
  if (!coupleId) return;

  const { error } = await client
    .from("couple_nodes")
    .delete()
    .eq("couple_id", coupleId)
    .eq("node_path", nodePath);

  if (error) throw error;
}

export async function seedRealtimeDBIfEmpty(
  seedDataMap: Record<string, unknown>,
): Promise<void> {
  if (!supabase || !getCurrentCoupleId()) return;

  for (const [nodePath, seedValue] of Object.entries(seedDataMap)) {
    try {
      const existing = await readNode(nodePath);
      if (existing == null) {
        await saveToRealtimeNode(nodePath, seedValue);
      }
    } catch (err) {
      console.warn(`Failed to seed node [${nodePath}]`, err);
    }
  }
}

export async function saveCoupleProfile(profile: CoupleProfile): Promise<void> {
  await saveToRealtimeNode("profile", profile);
}

export async function saveCoupleDocument<T extends { id: string }>(
  name: string,
  item: T,
): Promise<void> {
  const current = (await readNode<Array<T>>(name)) || [];
  const idx = current.findIndex((entry) => entry.id === item.id);
  if (idx >= 0) current[idx] = item;
  else current.unshift(item);
  await saveToRealtimeNode(name, current);
}

export async function deleteCoupleDocument(
  name: string,
  id: string,
): Promise<void> {
  const current = (await readNode<Array<{ id: string }>>(name)) || [];
  await saveToRealtimeNode(
    name,
    current.filter((entry) => entry.id !== id),
  );
}

export function subscribeToCoupleCollection<T>(
  name: string,
  onData: (data: T[]) => void,
): () => void {
  return subscribeToRealtimeNode<T[]>(name, (data) => onData(data || []));
}

export function subscribeToCoupleProfile(
  onData: (data: CoupleProfile | null) => void,
): () => void {
  return subscribeToRealtimeNode<CoupleProfile>("profile", onData);
}

export function subscribeToPresence(
  coupleId: string,
  onData: (data: { state: string; lastChanged: number } | null) => void,
): () => void {
  if (!supabase) return () => {};

  let userId = "";
  void supabase.auth.getUser().then(async ({ data }) => {
    if (!data.user) return;
    userId = data.user.id;
    const record: PresenceRecord = {
      user_id: userId,
      couple_id: coupleId,
      state: "online",
      last_changed: new Date().toISOString(),
    };
    await supabase.from("presence_status").upsert(record);
  });

  const channel = supabase
    .channel(`presence-${coupleId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "presence_status",
        filter: `couple_id=eq.${coupleId}`,
      },
      (payload) => {
        const next = payload.new as PresenceRecord | undefined;
        if (!next) return;
        onData({
          state: next.state,
          lastChanged: new Date(next.last_changed).getTime(),
        });
      },
    )
    .subscribe();

  return () => {
    if (userId) {
      void supabase.from("presence_status").upsert({
        user_id: userId,
        couple_id: coupleId,
        state: "offline",
        last_changed: new Date().toISOString(),
      });
    }
    void supabase.removeChannel(channel);
  };
}
