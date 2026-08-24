import {
  CoupleProfile,
  Album,
  Memory,
  TimelineEvent,
  LoveLetter,
  CalendarEvent,
  DateNightIdea,
  CoupleGoal,
  BucketListItem,
  FutureMemory,
  LoveReason,
  SharedNote,
  SongItem,
  Surprise,
  GuestMessage,
  SessionState,
  ChatMessage
} from '../types';
import {
  INITIAL_PROFILE,
  INITIAL_ALBUMS,
  INITIAL_MEMORIES,
  INITIAL_TIMELINE,
  INITIAL_LETTERS,
  INITIAL_CALENDAR,
  INITIAL_DATE_IDEAS,
  INITIAL_GOALS,
  INITIAL_BUCKET_LIST,
  INITIAL_FUTURE_MEMORIES,
  INITIAL_LOVE_REASONS,
  INITIAL_NOTES,
  INITIAL_SONGS,
  INITIAL_SURPRISES,
  INITIAL_GUEST_MESSAGES,
  INITIAL_CHAT_MESSAGES
} from './seedData';
import {
  saveToRealtimeNode,
  seedRealtimeDBIfEmpty
} from './supabase';

const KEYS = {
  PROFILE: 'our_story_profile_v2',
  ALBUMS: 'our_story_albums_v2',
  MEMORIES: 'our_story_memories_v2',
  TIMELINE: 'our_story_timeline_v2',
  LETTERS: 'our_story_letters_v2',
  CALENDAR: 'our_story_calendar_v2',
  DATE_IDEAS: 'our_story_date_ideas_v2',
  GOALS: 'our_story_goals_v2',
  BUCKET_LIST: 'our_story_bucket_list_v2',
  FUTURE_MEMORIES: 'our_story_future_memories_v2',
  LOVE_REASONS: 'our_story_love_reasons_v2',
  NOTES: 'our_story_notes_v2',
  SONGS: 'our_story_songs_v2',
  SURPRISES: 'our_story_surprises_v2',
  GUEST_MESSAGES: 'our_story_guest_messages_v2',
  CHAT_MESSAGES: 'our_story_chat_messages_v2',
  SESSION: 'our_story_session_v2'
};

function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to storage:`, err);
  }
}

export class StoryStorage {
  // Session State
  static getSession(): SessionState {
    return getStored<SessionState>(KEYS.SESSION, {
      role: 'guest',
      isLoggedIn: false,
      activePartner: 'partner1'
    });
  }

  static setSession(session: SessionState): void {
    setStored(KEYS.SESSION, session);
  }

  // Seed remote data store on startup if empty
  static async seedCloudIfEmpty(): Promise<void> {
    const seedMap = {
      profile: this.getProfile(),
      albums: this.getAlbums(),
      memories: this.getMemories(),
      timeline: this.getTimeline(),
      letters: this.getLetters(),
      calendarEvents: this.getCalendar(),
      dateIdeas: this.getDateIdeas(),
      goals: this.getGoals(),
      bucketList: this.getBucketList(),
      futureMemories: this.getFutureMemories(),
      loveReasons: this.getLoveReasons(),
      notes: this.getNotes(),
      songs: this.getSongs(),
      surprises: this.getSurprises(),
      guestMessages: this.getGuestMessages(),
      chatMessages: this.getChatMessages()
    };
    await seedRealtimeDBIfEmpty(seedMap);
  }

  // Profile
  static getProfile(): CoupleProfile {
    const profile = getStored<CoupleProfile>(KEYS.PROFILE, INITIAL_PROFILE);
    if (!profile.partner1Name || profile.partner1Name === 'Sarah') {
      profile.partner1Name = 'Farjana Akter';
    }
    if (!profile.partner2Name || profile.partner2Name === 'Naim') {
      profile.partner2Name = 'Md Nasif Kamran';
    }
    const OLD_HERO_URLS = [
      'https://images.unsplash.com/photo-1583939003579',
      'https://images.unsplash.com/photo-15839',
    ];
    if (OLD_HERO_URLS.some(u => profile.heroImage?.startsWith(u))) {
      profile.heroImage = '/hero-wedding.jpg';
    }
    const OLD_AVATAR_P1 = 'https://images.unsplash.com/photo-1534528741775';
    const OLD_AVATAR_P2 = 'https://images.unsplash.com/photo-1507003211169';
    if (profile.partner1Avatar?.startsWith(OLD_AVATAR_P1)) {
      profile.partner1Avatar = '/kamran-avatar.jpg';
    }
    if (profile.partner2Avatar?.startsWith(OLD_AVATAR_P2)) {
      profile.partner2Avatar = '/kamran-avatar.jpg';
    }
    setStored(KEYS.PROFILE, profile);
    return profile;
  }

  static setProfile(profile: CoupleProfile): void {
    setStored(KEYS.PROFILE, profile);
    saveToRealtimeNode('profile', profile);
  }

  // Albums
  static getAlbums(): Album[] {
    return getStored<Album[]>(KEYS.ALBUMS, INITIAL_ALBUMS);
  }

  static saveAlbum(album: Album): void {
    const albums = this.getAlbums();
    const idx = albums.findIndex((a) => a.id === album.id);
    if (idx >= 0) {
      albums[idx] = album;
    } else {
      albums.unshift(album);
    }
    setStored(KEYS.ALBUMS, albums);
    saveToRealtimeNode('albums', albums);
  }

  static deleteAlbum(albumId: string): void {
    const albums = this.getAlbums().filter((a) => a.id !== albumId);
    setStored(KEYS.ALBUMS, albums);
    saveToRealtimeNode('albums', albums);
  }

  // Memories
  static getMemories(): Memory[] {
    return getStored<Memory[]>(KEYS.MEMORIES, INITIAL_MEMORIES);
  }

  static setMemories(memories: Memory[]): void {
    setStored(KEYS.MEMORIES, memories);
  }

  static async saveMemories(memories: Memory[]): Promise<void> {
    this.setMemories(memories);
    await saveToRealtimeNode('memories', memories);
  }

  static async saveMemory(memory: Memory): Promise<void> {
    const memories = this.getMemories();
    const idx = memories.findIndex((m) => m.id === memory.id);
    if (idx >= 0) {
      memories[idx] = memory;
    } else {
      memories.unshift(memory);
    }
    await this.saveMemories(memories);
  }

  static deleteMemory(memoryId: string): void {
    const memories = this.getMemories().filter((m) => m.id !== memoryId);
    setStored(KEYS.MEMORIES, memories);
    saveToRealtimeNode('memories', memories);
  }

  // Timeline
  static getTimeline(): TimelineEvent[] {
    const events = getStored<TimelineEvent[]>(KEYS.TIMELINE, INITIAL_TIMELINE);
    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  static setTimeline(events: TimelineEvent[]): void {
    setStored(KEYS.TIMELINE, events);
  }

  static async saveTimeline(events: TimelineEvent[]): Promise<void> {
    this.setTimeline(events);
    await saveToRealtimeNode('timeline', events);
  }

  static saveTimelineEvent(event: TimelineEvent): void {
    const events = getStored<TimelineEvent[]>(KEYS.TIMELINE, INITIAL_TIMELINE);
    const idx = events.findIndex((e) => e.id === event.id);
    if (idx >= 0) {
      events[idx] = event;
    } else {
      events.push(event);
    }
    void this.saveTimeline(events);
  }

  static deleteTimelineEvent(id: string): void {
    const events = getStored<TimelineEvent[]>(KEYS.TIMELINE, INITIAL_TIMELINE).filter((e) => e.id !== id);
    setStored(KEYS.TIMELINE, events);
    saveToRealtimeNode('timeline', events);
  }

  // Letters
  static getLetters(): LoveLetter[] {
    return getStored<LoveLetter[]>(KEYS.LETTERS, INITIAL_LETTERS);
  }

  static saveLetter(letter: LoveLetter): void {
    const letters = this.getLetters();
    const idx = letters.findIndex((l) => l.id === letter.id);
    if (idx >= 0) {
      letters[idx] = letter;
    } else {
      letters.unshift(letter);
    }
    setStored(KEYS.LETTERS, letters);
    saveToRealtimeNode('letters', letters);
  }

  static deleteLetter(id: string): void {
    const letters = this.getLetters().filter((l) => l.id !== id);
    setStored(KEYS.LETTERS, letters);
    saveToRealtimeNode('letters', letters);
  }

  // Calendar
  static getCalendar(): CalendarEvent[] {
    return getStored<CalendarEvent[]>(KEYS.CALENDAR, INITIAL_CALENDAR);
  }

  static saveCalendarEvent(event: CalendarEvent): void {
    const events = this.getCalendar();
    const idx = events.findIndex((e) => e.id === event.id);
    if (idx >= 0) {
      events[idx] = event;
    } else {
      events.push(event);
    }
    setStored(KEYS.CALENDAR, events);
    saveToRealtimeNode('calendarEvents', events);
  }

  static deleteCalendarEvent(id: string): void {
    const events = this.getCalendar().filter((e) => e.id !== id);
    setStored(KEYS.CALENDAR, events);
    saveToRealtimeNode('calendarEvents', events);
  }

  // Date Night Ideas
  static getDateIdeas(): DateNightIdea[] {
    return getStored<DateNightIdea[]>(KEYS.DATE_IDEAS, INITIAL_DATE_IDEAS);
  }

  static saveDateIdea(idea: DateNightIdea): void {
    const ideas = this.getDateIdeas();
    ideas.unshift(idea);
    setStored(KEYS.DATE_IDEAS, ideas);
    saveToRealtimeNode('dateIdeas', ideas);
  }

  // Goals
  static getGoals(): CoupleGoal[] {
    return getStored<CoupleGoal[]>(KEYS.GOALS, INITIAL_GOALS);
  }

  static saveGoal(goal: CoupleGoal): void {
    const goals = this.getGoals();
    const idx = goals.findIndex((g) => g.id === goal.id);
    if (idx >= 0) {
      goals[idx] = goal;
    } else {
      goals.unshift(goal);
    }
    setStored(KEYS.GOALS, goals);
    saveToRealtimeNode('goals', goals);
  }

  static deleteGoal(id: string): void {
    const goals = this.getGoals().filter((g) => g.id !== id);
    setStored(KEYS.GOALS, goals);
    saveToRealtimeNode('goals', goals);
  }

  // Bucket List
  static getBucketList(): BucketListItem[] {
    return getStored<BucketListItem[]>(KEYS.BUCKET_LIST, INITIAL_BUCKET_LIST);
  }

  static saveBucketItem(item: BucketListItem): void {
    const list = this.getBucketList();
    const idx = list.findIndex((i) => i.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.unshift(item);
    }
    setStored(KEYS.BUCKET_LIST, list);
    saveToRealtimeNode('bucketList', list);
  }

  static deleteBucketItem(id: string): void {
    const list = this.getBucketList().filter((i) => i.id !== id);
    setStored(KEYS.BUCKET_LIST, list);
    saveToRealtimeNode('bucketList', list);
  }

  // Future Memories
  static getFutureMemories(): FutureMemory[] {
    return getStored<FutureMemory[]>(KEYS.FUTURE_MEMORIES, INITIAL_FUTURE_MEMORIES);
  }

  static saveFutureMemory(item: FutureMemory): void {
    const list = this.getFutureMemories();
    const idx = list.findIndex((f) => f.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.push(item);
    }
    setStored(KEYS.FUTURE_MEMORIES, list);
    saveToRealtimeNode('futureMemories', list);
  }

  // Love Reasons
  static getLoveReasons(): LoveReason[] {
    return getStored<LoveReason[]>(KEYS.LOVE_REASONS, INITIAL_LOVE_REASONS);
  }

  static saveLoveReason(reason: LoveReason): void {
    const list = this.getLoveReasons();
    list.unshift(reason);
    setStored(KEYS.LOVE_REASONS, list);
    saveToRealtimeNode('loveReasons', list);
  }

  static deleteLoveReason(id: string): void {
    const list = this.getLoveReasons().filter((r) => r.id !== id);
    setStored(KEYS.LOVE_REASONS, list);
    saveToRealtimeNode('loveReasons', list);
  }

  // Shared Notes
  static getNotes(): SharedNote[] {
    return getStored<SharedNote[]>(KEYS.NOTES, INITIAL_NOTES);
  }

  static saveNote(note: SharedNote): void {
    const notes = this.getNotes();
    const idx = notes.findIndex((n) => n.id === note.id);
    if (idx >= 0) {
      notes[idx] = note;
    } else {
      notes.unshift(note);
    }
    setStored(KEYS.NOTES, notes);
    saveToRealtimeNode('notes', notes);
  }

  static deleteNote(id: string): void {
    const notes = this.getNotes().filter((n) => n.id !== id);
    setStored(KEYS.NOTES, notes);
    saveToRealtimeNode('notes', notes);
  }

  // Songs
  static getSongs(): SongItem[] {
    return getStored<SongItem[]>(KEYS.SONGS, INITIAL_SONGS);
  }

  static saveSong(song: SongItem): void {
    const songs = this.getSongs();
    songs.unshift(song);
    setStored(KEYS.SONGS, songs);
    saveToRealtimeNode('songs', songs);
  }

  static deleteSong(id: string): void {
    const songs = this.getSongs().filter((s) => s.id !== id);
    setStored(KEYS.SONGS, songs);
    saveToRealtimeNode('songs', songs);
  }

  // Surprises
  static getSurprises(): Surprise[] {
    return getStored<Surprise[]>(KEYS.SURPRISES, INITIAL_SURPRISES);
  }

  static saveSurprise(surprise: Surprise): void {
    const surprises = this.getSurprises();
    const idx = surprises.findIndex((s) => s.id === surprise.id);
    if (idx >= 0) {
      surprises[idx] = surprise;
    } else {
      surprises.unshift(surprise);
    }
    setStored(KEYS.SURPRISES, surprises);
    saveToRealtimeNode('surprises', surprises);
  }

  // Guest Messages
  static getGuestMessages(): GuestMessage[] {
    return getStored<GuestMessage[]>(KEYS.GUEST_MESSAGES, INITIAL_GUEST_MESSAGES);
  }

  static saveGuestMessage(msg: GuestMessage): void {
    const messages = this.getGuestMessages();
    const idx = messages.findIndex((m) => m.id === msg.id);
    if (idx >= 0) {
      messages[idx] = msg;
    } else {
      messages.unshift(msg);
    }
    setStored(KEYS.GUEST_MESSAGES, messages);
    saveToRealtimeNode('guestMessages', messages);
  }

  static deleteGuestMessage(id: string): void {
    const messages = this.getGuestMessages().filter((m) => m.id !== id);
    setStored(KEYS.GUEST_MESSAGES, messages);
    saveToRealtimeNode('guestMessages', messages);
  }

  // Chat Messages
  static getChatMessages(): ChatMessage[] {
    return getStored<ChatMessage[]>(KEYS.CHAT_MESSAGES, INITIAL_CHAT_MESSAGES);
  }

  static saveChatMessage(msg: ChatMessage): void {
    const messages = this.getChatMessages();
    const idx = messages.findIndex((m) => m.id === msg.id);
    if (idx >= 0) {
      messages[idx] = msg;
    } else {
      messages.push(msg);
    }
    setStored(KEYS.CHAT_MESSAGES, messages);
    saveToRealtimeNode('chatMessages', messages);
  }

  static deleteChatMessage(id: string): void {
    const messages = this.getChatMessages().filter((m) => m.id !== id);
    setStored(KEYS.CHAT_MESSAGES, messages);
    saveToRealtimeNode('chatMessages', messages);
  }

  // Reset demo data to defaults
  static resetAllData(): void {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  }
}
