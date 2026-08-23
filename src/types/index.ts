export type VisibilityLevel = "PUBLIC" | "COUPLE_ONLY" | "PRIVATE";

export type UserRole = "guest" | "partner1" | "partner2" | "admin";

export interface CoupleProfile {
  partner1Name: string;
  partner2Name: string;
  partner1Avatar: string;
  partner2Avatar: string;
  weddingDate: string; // YYYY-MM-DD
  relationshipStartDate: string; // YYYY-MM-DD
  heroTagline: string;
  heroQuote: string;
  heroImage: string;
  coverImage: string;
  location: string;
}

export interface Album {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  createdAt: string;
}

export interface Memory {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  date: string;
  location: string;
  albumId: string;
  tags: string[];
  isFavorite: boolean;
  visibility: VisibilityLevel;
  author: string;
  createdAt: string;
  storagePath?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  createdBy?: string;
}

export interface TimelineEvent {
  id: string;
  year: string;
  date: string;
  title: string;
  description: string;
  location?: string;
  imageUrl?: string;
  videoUrl?: string;
  visibility: VisibilityLevel;
}

export interface LoveLetter {
  id: string;
  title: string;
  content: string;
  sender: "partner1" | "partner2";
  recipient: "partner1" | "partner2" | "both";
  date: string;
  unlockDate?: string; // ISO string YYYY-MM-DD or datetime
  imageUrl?: string;
  isDraft: boolean;
  visibility: VisibilityLevel;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  category:
    | "anniversary"
    | "birthday"
    | "date_night"
    | "vacation"
    | "family"
    | "reminder";
  description?: string;
  location?: string;
}

export interface DateNightIdea {
  id: string;
  title: string;
  description: string;
  category:
    | "At Home"
    | "Outdoors"
    | "Romantic"
    | "Cheap"
    | "Adventure"
    | "Relaxing"
    | "Weekend";
  icon?: string;
}

export interface CoupleGoal {
  id: string;
  title: string;
  description: string;
  category:
    | "Home"
    | "Travel"
    | "Finance"
    | "Relationship"
    | "Personal"
    | "Adventure";
  targetYear: string;
  progress: number; // 0-100
  status: "in_progress" | "achieved";
  imageUrl?: string;
}

export interface BucketListItem {
  id: string;
  title: string;
  isCompleted: boolean;
  completedDate?: string;
  memoryPhotoUrl?: string;
  note?: string;
}

export interface FutureMemory {
  id: string;
  title: string;
  icon: string;
  placeholderDescription: string;
  isUnlocked: boolean;
  targetYear?: string;
  memoryId?: string;
}

export interface LoveReason {
  id: string;
  author: "partner1" | "partner2";
  reason: string;
  date: string;
  photoUrl?: string;
}

export interface SharedNote {
  id: string;
  title: string;
  content: string;
  category: string;
  isPinned: boolean;
  checklistItems?: { id: string; text: string; done: boolean }[];
  updatedAt: string;
}

export interface SongItem {
  id: string;
  title: string;
  artist: string;
  category:
    | "Our Song"
    | "Wedding Songs"
    | "Travel Songs"
    | "Songs We Love"
    | "Memories";
  linkUrl?: string;
  audioPreviewUrl?: string;
  albumCover?: string;
}

export interface Surprise {
  id: string;
  sender: "partner1" | "partner2";
  recipient: "partner1" | "partner2";
  title: string;
  surpriseType:
    | "love_message"
    | "photo"
    | "letter"
    | "date_invitation"
    | "memory";
  content: string;
  imageUrl?: string;
  unlockDate: string;
  isOpened: boolean;
}

export interface GuestMessage {
  id: string;
  authorName: string;
  relationship: string;
  message: string;
  photoUrl?: string;
  date: string;
  status: "approved" | "pending" | "hidden";
  isPinned: boolean;
}

export interface SessionState {
  role: UserRole;
  isLoggedIn: boolean;
  activePartner: "partner1" | "partner2";
}

export interface DailyQuestion {
  id: string;
  questionText: string;
  savedAnswer?: string;
  answerDate?: string;
}

export interface ChatMessage {
  id: string;
  sender: "partner1" | "partner2";
  text: string;
  photoUrl?: string;
  timestamp: string;
  reaction?: string;
}
