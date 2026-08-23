import { useCallback, useEffect, useState } from "react";
import {
  AuthUserInfo,
  subscribeToAuth,
  subscribeToPresence,
  subscribeToRealtimeNode,
  uploadCoupleFile,
} from "./lib/firebase";
import { StoryStorage } from "./lib/storage";
import {
  Album,
  BucketListItem,
  CalendarEvent,
  ChatMessage,
  CoupleGoal,
  CoupleProfile,
  DateNightIdea,
  FutureMemory,
  GuestMessage,
  LoveLetter,
  LoveReason,
  Memory,
  SessionState,
  SharedNote,
  SongItem,
  Surprise,
  TimelineEvent,
} from "./types";

// UI Components
import { AmbientAudioPlayer } from "./components/ui/AmbientAudioPlayer";
import { Navbar } from "./components/ui/Navbar";
import { ParticlesCanvas } from "./components/ui/ParticlesCanvas";

// Page Components
import { BucketListView } from "./components/bucket-list/BucketListView";
import { CoupleCalendarView } from "./components/calendar/CoupleCalendarView";
import { CoupleChatView } from "./components/chat/CoupleChatView";
import { Dashboard } from "./components/dashboard/Dashboard";
import { DateNightGenerator } from "./components/date-night/DateNightGenerator";
import { CoupleGoalsView } from "./components/goals/CoupleGoalsView";
import { LandingPage } from "./components/landing/LandingPage";
import { LoveLettersView } from "./components/letters/LoveLettersView";
import { WriteLetterModal } from "./components/letters/WriteLetterModal";
import { LoveReasonsView } from "./components/love-reasons/LoveReasonsView";
import { AddMemoryModal } from "./components/memory/AddMemoryModal";
import { MemoriesGallery } from "./components/memory/MemoriesGallery";
import { AddGuestMessageModal } from "./components/messages/AddGuestMessageModal";
import { GuestMessageWall } from "./components/messages/GuestMessageWall";
import { SharedNotesView } from "./components/notes/SharedNotesView";
import { PlaylistView } from "./components/playlist/PlaylistView";
import { SurprisesView } from "./components/surprises/SurprisesView";
import { TimelineView } from "./components/timeline/TimelineView";
import { ReplaySlideshowModal } from "./components/wedding-day/ReplaySlideshowModal";
import { WeddingDayShowcase } from "./components/wedding-day/WeddingDayShowcase";

// Auth & Admin
import { AdminSetupModal } from "./components/admin/AdminSetupModal";
import { LoginModal } from "./components/auth/LoginModal";

function App() {
  // =================== STATE ===================
  const [profile, setProfile] = useState<CoupleProfile>(
    StoryStorage.getProfile(),
  );
  const [albums, setAlbums] = useState<Album[]>(StoryStorage.getAlbums());
  const [memories, setMemories] = useState<Memory[]>(
    StoryStorage.getMemories(),
  );
  const [timeline, setTimeline] = useState<TimelineEvent[]>(
    StoryStorage.getTimeline(),
  );
  const [letters, setLetters] = useState<LoveLetter[]>(
    StoryStorage.getLetters(),
  );
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(
    StoryStorage.getCalendar(),
  );
  const [dateIdeas, setDateIdeas] = useState<DateNightIdea[]>(
    StoryStorage.getDateIdeas(),
  );
  const [goals, setGoals] = useState<CoupleGoal[]>(StoryStorage.getGoals());
  const [bucketList, setBucketList] = useState<BucketListItem[]>(
    StoryStorage.getBucketList(),
  );
  const [futureMemories, setFutureMemories] = useState<FutureMemory[]>(
    StoryStorage.getFutureMemories(),
  );
  const [loveReasons, setLoveReasons] = useState<LoveReason[]>(
    StoryStorage.getLoveReasons(),
  );
  const [notes, setNotes] = useState<SharedNote[]>(StoryStorage.getNotes());
  const [songs, setSongs] = useState<SongItem[]>(StoryStorage.getSongs());
  const [surprises, setSurprises] = useState<Surprise[]>(
    StoryStorage.getSurprises(),
  );
  const [guestMessages, setGuestMessages] = useState<GuestMessage[]>(
    StoryStorage.getGuestMessages(),
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(
    StoryStorage.getChatMessages(),
  );
  const [session, setSession] = useState<SessionState>(
    StoryStorage.getSession(),
  );
  const [authUser, setAuthUser] = useState<AuthUserInfo | null>(null);

  // UI State
  const [activeTab, setActiveTab] = useState<string>("landing");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showAddMemoryModal, setShowAddMemoryModal] = useState(false);
  const [showAddMessageModal, setShowAddMessageModal] = useState(false);
  const [showWriteLetterModal, setShowWriteLetterModal] = useState(false);
  const [showReplaySlideshow, setShowReplaySlideshow] = useState(false);

  // =================== FIREBASE REALTIME SUBSCRIPTIONS ===================
  useEffect(() => {
    if (!authUser?.emailVerified || !authUser.coupleId) return;
    // Couple-scoped realtime listeners start after Firebase Auth resolves.
    const unsubProfile = subscribeToRealtimeNode<CoupleProfile>(
      "profile",
      (val) => {
        if (val) setProfile(val);
      },
    );

    const unsubAlbums = subscribeToRealtimeNode<Album[]>("albums", (val) => {
      if (val) setAlbums(val);
    });

    const unsubMemories = subscribeToRealtimeNode<Memory[]>(
      "memories",
      (val) => {
        if (val) setMemories(val);
      },
    );

    const unsubTimeline = subscribeToRealtimeNode<TimelineEvent[]>(
      "timeline",
      (val) => {
        if (val) setTimeline(val);
      },
    );

    const unsubLetters = subscribeToRealtimeNode<LoveLetter[]>(
      "letters",
      (val) => {
        if (val) setLetters(val);
      },
    );

    const unsubCalendar = subscribeToRealtimeNode<CalendarEvent[]>(
      "calendarEvents",
      (val) => {
        if (val) setCalendarEvents(val);
      },
    );

    const unsubDateIdeas = subscribeToRealtimeNode<DateNightIdea[]>(
      "dateIdeas",
      (val) => {
        if (val) setDateIdeas(val);
      },
    );

    const unsubGoals = subscribeToRealtimeNode<CoupleGoal[]>("goals", (val) => {
      if (val) setGoals(val);
    });

    const unsubBucketList = subscribeToRealtimeNode<BucketListItem[]>(
      "bucketList",
      (val) => {
        if (val) setBucketList(val);
      },
    );

    const unsubFutureMemories = subscribeToRealtimeNode<FutureMemory[]>(
      "futureMemories",
      (val) => {
        if (val) setFutureMemories(val);
      },
    );

    const unsubLoveReasons = subscribeToRealtimeNode<LoveReason[]>(
      "loveReasons",
      (val) => {
        if (val) setLoveReasons(val);
      },
    );

    const unsubNotes = subscribeToRealtimeNode<SharedNote[]>("notes", (val) => {
      if (val) setNotes(val);
    });

    const unsubSongs = subscribeToRealtimeNode<SongItem[]>("songs", (val) => {
      if (val) setSongs(val);
    });

    const unsubSurprises = subscribeToRealtimeNode<Surprise[]>(
      "surprises",
      (val) => {
        if (val) setSurprises(val);
      },
    );

    const unsubGuestMessages = subscribeToRealtimeNode<GuestMessage[]>(
      "guestMessages",
      (val) => {
        if (val) setGuestMessages(val);
      },
    );

    const unsubChatMessages = subscribeToRealtimeNode<ChatMessage[]>(
      "chatMessages",
      (val) => {
        if (val) setChatMessages(val);
      },
    );

    return () => {
      unsubProfile();
      unsubAlbums();
      unsubMemories();
      unsubTimeline();
      unsubLetters();
      unsubCalendar();
      unsubDateIdeas();
      unsubGoals();
      unsubBucketList();
      unsubFutureMemories();
      unsubLoveReasons();
      unsubNotes();
      unsubSongs();
      unsubSurprises();
      unsubGuestMessages();
      unsubChatMessages();
    };
  }, [authUser]);

  useEffect(() => {
    const unsubAuth = subscribeToAuth((user) => {
      setAuthUser(user);
      if (user) {
        const newSession: SessionState = {
          role: user.emailVerified ? user.role : "guest",
          isLoggedIn: user.emailVerified,
          activePartner: user.activePartner,
        };
        setSession(newSession);
        StoryStorage.setSession(newSession);
      } else {
        setSession({
          role: "guest",
          isLoggedIn: false,
          activePartner: "partner1",
        });
      }
    });
    return unsubAuth;
  }, []);

  useEffect(() => {
    if (!authUser?.emailVerified || !authUser.coupleId) return;
    return subscribeToPresence(authUser.coupleId, () => {});
  }, [authUser]);

  // =================== HANDLERS ===================

  // Auth
  const handleLogin = useCallback(
    (partner: "partner1" | "partner2", _email?: string) => {
      const newSession: SessionState = {
        role: partner === "partner1" ? "partner1" : "partner2",
        isLoggedIn: true,
        activePartner: partner,
      };
      setSession(newSession);
      StoryStorage.setSession(newSession);
    },
    [],
  );

  const handleLogout = useCallback(() => {
    const newSession: SessionState = {
      role: "guest",
      isLoggedIn: false,
      activePartner: "partner1",
    };
    setSession(newSession);
    setAuthUser(null);
    StoryStorage.setSession(newSession);
    setActiveTab("landing");
  }, []);

  // Profile
  const handleSaveProfile = useCallback((p: CoupleProfile) => {
    setProfile(p);
    StoryStorage.setProfile(p);
  }, []);

  // Memories
  const handleSaveMemory = useCallback(
    async (mem: Memory, imageFile?: File) => {
      try {
        const savedMemory = imageFile
          ? {
              ...mem,
              ...(await uploadCoupleFile(`memories/${mem.id}`, imageFile)),
            }
          : mem;
        StoryStorage.saveMemory(savedMemory);
        setMemories(StoryStorage.getMemories());
      } catch (error) {
        console.error("Unable to save memory:", error);
        alert(
          error instanceof Error ? error.message : "Unable to save memory.",
        );
      }
    },
    [],
  );

  const handleDeleteMemory = useCallback((id: string) => {
    StoryStorage.deleteMemory(id);
    setMemories(StoryStorage.getMemories());
  }, []);

  const handleToggleFavorite = useCallback(
    (id: string) => {
      const mem = memories.find((m) => m.id === id);
      if (!mem) return;
      const updated = { ...mem, isFavorite: !mem.isFavorite };
      StoryStorage.saveMemory(updated);
      setMemories(StoryStorage.getMemories());
    },
    [memories],
  );

  // Albums
  const handleCreateAlbum = useCallback(
    (name: string, description?: string): Album => {
      const newAlbum: Album = {
        id: `alb-${Date.now()}`,
        name,
        description,
        createdAt: new Date().toISOString().split("T")[0],
      };
      StoryStorage.saveAlbum(newAlbum);
      setAlbums(StoryStorage.getAlbums());
      return newAlbum;
    },
    [],
  );

  const handleDeleteAlbum = useCallback((id: string) => {
    StoryStorage.deleteAlbum(id);
    setAlbums(StoryStorage.getAlbums());
  }, []);

  // Timeline
  const handleSaveTimelineEvent = useCallback((evt: TimelineEvent) => {
    StoryStorage.saveTimelineEvent(evt);
    setTimeline(StoryStorage.getTimeline());
  }, []);

  const handleDeleteTimelineEvent = useCallback((id: string) => {
    StoryStorage.deleteTimelineEvent(id);
    setTimeline(StoryStorage.getTimeline());
  }, []);

  // Letters
  const handleSaveLetter = useCallback((letter: LoveLetter) => {
    StoryStorage.saveLetter(letter);
    setLetters(StoryStorage.getLetters());
  }, []);

  const handleDeleteLetter = useCallback((id: string) => {
    StoryStorage.deleteLetter(id);
    setLetters(StoryStorage.getLetters());
  }, []);

  // Calendar
  const handleSaveCalendarEvent = useCallback((evt: CalendarEvent) => {
    StoryStorage.saveCalendarEvent(evt);
    setCalendarEvents(StoryStorage.getCalendar());
  }, []);

  const handleDeleteCalendarEvent = useCallback((id: string) => {
    StoryStorage.deleteCalendarEvent(id);
    setCalendarEvents(StoryStorage.getCalendar());
  }, []);

  // Date Ideas
  const handleSaveDateIdea = useCallback((idea: DateNightIdea) => {
    StoryStorage.saveDateIdea(idea);
    setDateIdeas(StoryStorage.getDateIdeas());
  }, []);

  // Goals
  const handleSaveGoal = useCallback((goal: CoupleGoal) => {
    StoryStorage.saveGoal(goal);
    setGoals(StoryStorage.getGoals());
  }, []);

  const handleDeleteGoal = useCallback((id: string) => {
    StoryStorage.deleteGoal(id);
    setGoals(StoryStorage.getGoals());
  }, []);

  // Bucket List
  const handleSaveBucketItem = useCallback((item: BucketListItem) => {
    StoryStorage.saveBucketItem(item);
    setBucketList(StoryStorage.getBucketList());
  }, []);

  const handleDeleteBucketItem = useCallback((id: string) => {
    StoryStorage.deleteBucketItem(id);
    setBucketList(StoryStorage.getBucketList());
  }, []);

  const handleConvertBucketToMemory = useCallback(
    (item: BucketListItem) => {
      if (!item.memoryPhotoUrl) return;
      const newMemory: Memory = {
        id: `mem-bl-${Date.now()}`,
        title: `✓ Bucket List: ${item.title}`,
        caption:
          item.note || `We checked off "${item.title}" from our bucket list!`,
        imageUrl: item.memoryPhotoUrl,
        date: item.completedDate || new Date().toISOString().split("T")[0],
        location: "",
        albumId: "alb-4",
        tags: ["Bucket List", "Achievement"],
        isFavorite: false,
        visibility: "COUPLE_ONLY",
        author:
          session.activePartner === "partner1"
            ? profile.partner1Name
            : profile.partner2Name,
        createdAt: new Date().toISOString(),
      };
      StoryStorage.saveMemory(newMemory);
      setMemories(StoryStorage.getMemories());
    },
    [session, profile],
  );

  // Love Reasons
  const handleSaveLoveReason = useCallback((reason: LoveReason) => {
    StoryStorage.saveLoveReason(reason);
    setLoveReasons(StoryStorage.getLoveReasons());
  }, []);

  const handleDeleteLoveReason = useCallback((id: string) => {
    StoryStorage.deleteLoveReason(id);
    setLoveReasons(StoryStorage.getLoveReasons());
  }, []);

  // Notes
  const handleSaveNote = useCallback((note: SharedNote) => {
    StoryStorage.saveNote(note);
    setNotes(StoryStorage.getNotes());
  }, []);

  const handleDeleteNote = useCallback((id: string) => {
    StoryStorage.deleteNote(id);
    setNotes(StoryStorage.getNotes());
  }, []);

  // Songs
  const handleSaveSong = useCallback((song: SongItem) => {
    StoryStorage.saveSong(song);
    setSongs(StoryStorage.getSongs());
  }, []);

  const handleDeleteSong = useCallback((id: string) => {
    StoryStorage.deleteSong(id);
    setSongs(StoryStorage.getSongs());
  }, []);

  // Surprises
  const handleSaveSurprise = useCallback((surprise: Surprise) => {
    StoryStorage.saveSurprise(surprise);
    setSurprises(StoryStorage.getSurprises());
  }, []);

  // Guest Messages
  const handleSaveGuestMessage = useCallback((msg: GuestMessage) => {
    StoryStorage.saveGuestMessage(msg);
    setGuestMessages(StoryStorage.getGuestMessages());
  }, []);

  const handleDeleteGuestMessage = useCallback((id: string) => {
    StoryStorage.deleteGuestMessage(id);
    setGuestMessages(StoryStorage.getGuestMessages());
  }, []);

  // Chat Messages
  const handleSaveChatMessage = useCallback((msg: ChatMessage) => {
    StoryStorage.saveChatMessage(msg);
    setChatMessages(StoryStorage.getChatMessages());
  }, []);

  const handleDeleteChatMessage = useCallback((id: string) => {
    StoryStorage.deleteChatMessage(id);
    setChatMessages(StoryStorage.getChatMessages());
  }, []);

  const handleAddChatReaction = useCallback(
    (msgId: string, emoji: string) => {
      const msg = chatMessages.find((m) => m.id === msgId);
      if (msg) {
        const updated = { ...msg, reaction: emoji };
        StoryStorage.saveChatMessage(updated);
        setChatMessages(StoryStorage.getChatMessages());
      }
    },
    [chatMessages],
  );

  // Admin Reset
  const handleResetData = useCallback(() => {
    StoryStorage.resetAllData();
    setProfile(StoryStorage.getProfile());
    setAlbums(StoryStorage.getAlbums());
    setMemories(StoryStorage.getMemories());
    setTimeline(StoryStorage.getTimeline());
    setLetters(StoryStorage.getLetters());
    setCalendarEvents(StoryStorage.getCalendar());
    setDateIdeas(StoryStorage.getDateIdeas());
    setGoals(StoryStorage.getGoals());
    setBucketList(StoryStorage.getBucketList());
    setFutureMemories(StoryStorage.getFutureMemories());
    setLoveReasons(StoryStorage.getLoveReasons());
    setNotes(StoryStorage.getNotes());
    setSongs(StoryStorage.getSongs());
    setSurprises(StoryStorage.getSurprises());
    setGuestMessages(StoryStorage.getGuestMessages());
    setChatMessages(StoryStorage.getChatMessages());
  }, []);

  // Wedding memories filter for slideshow
  const weddingMemories = memories.filter(
    (m) => m.albumId === "alb-wedding-day" || m.tags.includes("Wedding"),
  );

  // Render view router
  const renderActiveView = () => {
    switch (activeTab) {
      case "landing":
        return (
          <LandingPage
            profile={profile}
            timeline={timeline}
            memories={memories}
            guestMessages={guestMessages}
            onEnterStory={() => setActiveTab("timeline")}
            onOpenReplay={() => setShowReplaySlideshow(true)}
            onSelectTab={(tab: string) => setActiveTab(tab)}
            onOpenAddMessage={() => setShowAddMessageModal(true)}
          />
        );

      case "timeline":
        return (
          <TimelineView
            timeline={timeline}
            session={session}
            onSaveEvent={handleSaveTimelineEvent}
            onDeleteEvent={handleDeleteTimelineEvent}
          />
        );

      case "memories":
        return (
          <MemoriesGallery
            albums={albums}
            memories={memories}
            session={session}
            onOpenAddMemory={() => setShowAddMemoryModal(true)}
            onToggleFavorite={handleToggleFavorite}
            onDeleteMemory={handleDeleteMemory}
            onSaveMemory={handleSaveMemory}
            onCreateAlbum={handleCreateAlbum}
            onDeleteAlbum={handleDeleteAlbum}
          />
        );

      case "messages":
        return (
          <GuestMessageWall
            messages={guestMessages}
            session={session}
            onOpenAddModal={() => setShowAddMessageModal(true)}
            onTogglePinMessage={(id: string) => {
              const msg = guestMessages.find((m) => m.id === id);
              if (msg)
                handleSaveGuestMessage({ ...msg, isPinned: !msg.isPinned });
            }}
            onToggleHideMessage={(id: string) => {
              const msg = guestMessages.find((m) => m.id === id);
              if (msg) {
                const nextStatus =
                  msg.status === "hidden" ? "approved" : "hidden";
                handleSaveGuestMessage({ ...msg, status: nextStatus });
              }
            }}
            onDeleteMessage={handleDeleteGuestMessage}
          />
        );

      case "wedding-day":
        return (
          <WeddingDayShowcase
            profile={profile}
            memories={weddingMemories}
            onOpenReplay={() => setShowReplaySlideshow(true)}
            onSelectPhoto={() => {}}
          />
        );

      case "dashboard":
        return session.isLoggedIn ? (
          <Dashboard
            profile={profile}
            session={session}
            memories={memories}
            letters={letters}
            goals={goals}
            calendar={calendarEvents}
            bucketList={bucketList}
            futureMemories={futureMemories}
            loveReasons={loveReasons}
            surprises={surprises}
            chatMessages={chatMessages}
            onSelectTab={(tab: string) => setActiveTab(tab)}
          />
        ) : null;

      case "chat":
        return session.isLoggedIn ? (
          <CoupleChatView
            messages={chatMessages}
            session={session}
            profile={profile}
            onSendMessage={handleSaveChatMessage}
            onDeleteMessage={handleDeleteChatMessage}
            onAddReaction={handleAddChatReaction}
          />
        ) : null;

      case "letters":
        return session.isLoggedIn ? (
          <LoveLettersView
            letters={letters}
            session={session}
            onOpenWriteModal={() => setShowWriteLetterModal(true)}
            onDeleteLetter={handleDeleteLetter}
          />
        ) : null;

      case "calendar":
        return session.isLoggedIn ? (
          <CoupleCalendarView
            events={calendarEvents}
            session={session}
            onSaveEvent={handleSaveCalendarEvent}
            onDeleteEvent={handleDeleteCalendarEvent}
          />
        ) : null;

      case "date-ideas":
        return session.isLoggedIn ? (
          <DateNightGenerator
            ideas={dateIdeas}
            session={session}
            onSaveIdea={handleSaveDateIdea}
            onLogAsMemory={(idea: DateNightIdea) => {
              const newMemory: Memory = {
                id: `mem-date-${Date.now()}`,
                title: `Date Night: ${idea.title}`,
                caption: idea.description,
                imageUrl: "/hero-wedding.jpg",
                date: new Date().toISOString().split("T")[0],
                location: "",
                albumId: "alb-3",
                tags: ["Date Night", idea.category],
                isFavorite: false,
                visibility: "COUPLE_ONLY",
                author:
                  session.activePartner === "partner1"
                    ? profile.partner1Name
                    : profile.partner2Name,
                createdAt: new Date().toISOString(),
              };
              handleSaveMemory(newMemory);
            }}
          />
        ) : null;

      case "goals":
        return session.isLoggedIn ? (
          <CoupleGoalsView
            goals={goals}
            session={session}
            onSaveGoal={handleSaveGoal}
            onDeleteGoal={handleDeleteGoal}
          />
        ) : null;

      case "bucket-list":
        return session.isLoggedIn ? (
          <BucketListView
            bucketList={bucketList}
            session={session}
            onSaveItem={handleSaveBucketItem}
            onDeleteItem={handleDeleteBucketItem}
            onConvertToMemory={handleConvertBucketToMemory}
          />
        ) : null;

      case "love-reasons":
        return session.isLoggedIn ? (
          <LoveReasonsView
            reasons={loveReasons}
            session={session}
            profile={profile}
            onSaveReason={handleSaveLoveReason}
            onDeleteReason={handleDeleteLoveReason}
          />
        ) : null;

      case "notes":
        return session.isLoggedIn ? (
          <SharedNotesView
            notes={notes}
            session={session}
            onSaveNote={handleSaveNote}
            onDeleteNote={handleDeleteNote}
          />
        ) : null;

      case "playlist":
        return session.isLoggedIn ? (
          <PlaylistView
            songs={songs}
            session={session}
            onSaveSong={handleSaveSong}
            onDeleteSong={handleDeleteSong}
          />
        ) : null;

      case "surprises":
        return session.isLoggedIn ? (
          <SurprisesView
            surprises={surprises}
            session={session}
            profile={profile}
            onSaveSurprise={handleSaveSurprise}
          />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative bg-[#FAF7F2] text-stone-900 selection:bg-rose-200 selection:text-rose-900">
      {/* Floating Background Particles */}
      <ParticlesCanvas />

      {/* Ambient Romantic Music Synthesizer Player */}
      <AmbientAudioPlayer />

      {/* Navbar */}
      <Navbar
        profile={profile}
        session={session}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogin={() => setShowLoginModal(true)}
        onOpenAddMemory={() => setShowAddMemoryModal(true)}
        onOpenAdminSetup={() => setShowAdminModal(true)}
      />

      {/* Main Content Area */}
      <main className="relative z-10">{renderActiveView()}</main>

      {/* ========== MODALS ========== */}

      {showLoginModal && (
        <LoginModal
          profile={profile}
          session={session}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
          onLogout={handleLogout}
          authUser={authUser}
        />
      )}

      {showAdminModal && session.isLoggedIn && (
        <AdminSetupModal
          profile={profile}
          onClose={() => setShowAdminModal(false)}
          onSaveProfile={handleSaveProfile}
          onResetData={handleResetData}
        />
      )}

      {showAddMemoryModal && session.isLoggedIn && (
        <AddMemoryModal
          albums={albums}
          onClose={() => setShowAddMemoryModal(false)}
          onSaveMemory={handleSaveMemory}
          onCreateAlbum={(name: string) => handleCreateAlbum(name)}
          activePartner={
            session.activePartner === "partner1"
              ? profile.partner1Name
              : profile.partner2Name
          }
        />
      )}

      {showAddMessageModal && (
        <AddGuestMessageModal
          onClose={() => setShowAddMessageModal(false)}
          onSubmitMessage={handleSaveGuestMessage}
        />
      )}

      {showWriteLetterModal && session.isLoggedIn && (
        <WriteLetterModal
          session={session}
          onClose={() => setShowWriteLetterModal(false)}
          onSaveLetter={handleSaveLetter}
        />
      )}

      {showReplaySlideshow && weddingMemories.length > 0 && (
        <ReplaySlideshowModal
          weddingMemories={weddingMemories}
          onClose={() => setShowReplaySlideshow(false)}
        />
      )}
    </div>
  );
}

export default App;
