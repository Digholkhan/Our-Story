import React, { useMemo } from 'react';
import {
  Heart, Camera, Mail, Target, Globe, Calendar as CalIcon, Dices, Gift,
  StickyNote, Music, Sparkles, Bookmark, CheckSquare, Star, Clock, ArrowRight,
  MessageCircle, BookOpen, MessageSquare
} from 'lucide-react';
import {
  CoupleProfile, SessionState, Memory, LoveLetter, CoupleGoal, CalendarEvent,
  BucketListItem, FutureMemory, LoveReason, Surprise, ChatMessage
} from '../../types';
import { DAILY_QUESTIONS } from '../../lib/seedData';

interface DashboardProps {
  profile: CoupleProfile;
  session: SessionState;
  memories: Memory[];
  letters: LoveLetter[];
  goals: CoupleGoal[];
  calendar: CalendarEvent[];
  bucketList: BucketListItem[];
  futureMemories: FutureMemory[];
  loveReasons: LoveReason[];
  surprises: Surprise[];
  chatMessages: ChatMessage[];
  onSelectTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  session,
  memories,
  letters,
  goals,
  calendar,
  bucketList,
  futureMemories,
  loveReasons,
  surprises,
  chatMessages,
  onSelectTab,
}) => {
  const currentName = session.activePartner === 'partner1' ? profile.partner1Name : profile.partner2Name;

  // Greeting
  const hour = new Date().getHours();
  const greetingTime = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Daily question
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const dailyQuestion = DAILY_QUESTIONS[dayOfYear % DAILY_QUESTIONS.length];

  // On This Day
  const today = new Date();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();
  const onThisDayMemories = memories.filter((m) => {
    const d = new Date(m.date);
    return d.getMonth() === todayMonth && d.getDate() === todayDate && d.getFullYear() < today.getFullYear();
  });

  // Upcoming events (next 30 days)
  const upcoming = calendar
    .filter((e) => {
      const evtDate = new Date(e.date);
      const diff = evtDate.getTime() - today.getTime();
      return diff >= 0 && diff < 30 * 86400000;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  // Random old memory
  const randomMemory = useMemo(() => {
    if (memories.length === 0) return null;
    return memories[Math.floor(Math.random() * memories.length)];
  }, [memories.length]);

  // Stats
  const stats = [
    { icon: <Camera className="w-5 h-5 text-rose-600" />, count: memories.length, label: 'Memories' },
    { icon: <Mail className="w-5 h-5 text-rose-600" />, count: letters.length, label: 'Love Letters' },
    { icon: <MessageSquare className="w-5 h-5 text-rose-600" />, count: chatMessages.length, label: 'Whispers' },
    { icon: <Target className="w-5 h-5 text-rose-600" />, count: goals.length, label: 'Shared Goals' },
    { icon: <Globe className="w-5 h-5 text-rose-600" />, count: new Set(memories.map((m) => m.location).filter(Boolean)).size, label: 'Places Visited' },
    { icon: <Gift className="w-5 h-5 text-rose-600" />, count: surprises.filter(s => s.recipient === session.activePartner && !s.isOpened).length, label: 'Surprises' },
  ];

  // Dashboard nav items
  const navItems = [
    { label: 'Couple Chat 💬', tab: 'chat', icon: <MessageCircle className="w-5 h-5 text-rose-700" />, highlight: true },
    { label: 'Memories 📸', tab: 'memories', icon: <Camera className="w-5 h-5" /> },
    { label: 'Our Story ⏳', tab: 'timeline', icon: <BookOpen className="w-5 h-5" /> },
    { label: 'Wedding Day 💍', tab: 'wedding-day', icon: <Heart className="w-5 h-5" /> },
    { label: 'Calendar 📅', tab: 'calendar', icon: <CalIcon className="w-5 h-5" /> },
    { label: 'Letters 💌', tab: 'letters', icon: <Mail className="w-5 h-5" /> },
    { label: 'Goals ✨', tab: 'goals', icon: <Target className="w-5 h-5" /> },
    { label: 'Bucket List 🌎', tab: 'bucket-list', icon: <CheckSquare className="w-5 h-5" /> },
    { label: 'Date Night 🎲', tab: 'date-night', icon: <Dices className="w-5 h-5" /> },
    { label: 'Surprise Box 🎁', tab: 'surprises', icon: <Gift className="w-5 h-5" /> },
    { label: 'Reasons I Love You 💖', tab: 'love-reasons', icon: <Heart className="w-5 h-5" /> },
    { label: 'Notes 📝', tab: 'notes', icon: <StickyNote className="w-5 h-5" /> },
    { label: 'Our Songs 🎵', tab: 'playlist', icon: <Music className="w-5 h-5" /> },
    { label: 'Guest Messages ❤️', tab: 'messages', icon: <MessageSquare className="w-5 h-5" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 relative z-10">
      {/* Welcome Banner */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-stone-200/90 text-center space-y-4 shadow-sm">
        <div className="flex items-center justify-center gap-3">
          <img
            src={profile.partner1Avatar}
            alt={profile.partner1Name}
            className="w-14 h-14 rounded-full object-cover border-2 border-rose-300 shadow-sm"
          />
          <Heart className="w-6 h-6 text-rose-500 fill-current animate-pulse" />
          <img
            src={profile.partner2Avatar}
            alt={profile.partner2Name}
            className="w-14 h-14 rounded-full object-cover border-2 border-rose-300 shadow-sm"
          />
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-stone-900">
          {greetingTime}, {profile.partner1Name.split(' ')[0]} & {profile.partner2Name.split(' ')[0]} ❤️
        </h1>
        <p className="text-stone-600 text-sm sm:text-base font-serif italic max-w-xl mx-auto">
          "Your next memory might be your favorite one."
        </p>

        <div className="pt-2 flex items-center justify-center gap-3">
          <span className="px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            Logged in as {currentName}
          </span>
          <button
            onClick={() => onSelectTab('chat')}
            className="px-5 py-1.5 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Open Couple Chat 💬</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="glass-card p-5 rounded-3xl border border-stone-200/80 text-center space-y-1.5 hover:border-rose-300 transition-all">
            <div className="mx-auto w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">{s.icon}</div>
            <span className="block font-serif text-2xl font-bold text-stone-900">{s.count}</span>
            <span className="block text-[10px] text-stone-500 uppercase tracking-wider font-medium">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Daily Question */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-stone-200/80 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">Today's Couple Question</span>
        </div>
        <p className="font-serif text-2xl sm:text-3xl text-stone-800 italic leading-relaxed">
          "{dailyQuestion.questionText}"
        </p>
        <p className="text-xs text-stone-400">Share your thoughts together tonight over tea ❤️</p>
      </div>

      {/* On This Day */}
      {onThisDayMemories.length > 0 && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-rose-200/80 space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-rose-600" />
            <span className="text-xs uppercase tracking-widest text-rose-800 font-semibold">
              On This Day — {todayMonth + 1}/{todayDate}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {onThisDayMemories.slice(0, 2).map((m) => (
              <div key={m.id} className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-stone-200">
                  <img src={m.imageUrl} alt={m.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-xs text-rose-700 font-mono">{m.date}</span>
                  <h4 className="font-serif text-lg font-bold text-stone-800">{m.title}</h4>
                  <p className="text-xs text-stone-500 line-clamp-1">{m.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Random Old Memory */}
      {randomMemory && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-stone-200/80 flex flex-col sm:flex-row gap-6 items-center hover:border-rose-300 transition-all cursor-pointer" onClick={() => onSelectTab('memories')}>
          <div className="w-full sm:w-44 h-44 rounded-2xl overflow-hidden shrink-0 border border-stone-200">
            <img src={randomMemory.imageUrl} alt={randomMemory.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 space-y-2">
            <span className="text-xs uppercase tracking-widest text-rose-800 font-semibold">
              ✨ A Cherished Moment From The Past
            </span>
            <h3 className="font-serif text-2xl font-bold text-stone-900">{randomMemory.title}</h3>
            <p className="text-stone-600 text-sm italic font-serif line-clamp-2">"{randomMemory.caption}"</p>
            <span className="text-xs text-stone-400 block pt-1">{randomMemory.date} • {randomMemory.location}</span>
          </div>
        </div>
      )}

      {/* Upcoming Events */}
      {upcoming.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-stone-800">Upcoming Shared Dates</h2>
            <button onClick={() => onSelectTab('calendar')} className="text-rose-800 hover:text-rose-600 text-xs font-semibold flex items-center gap-1">
              View Calendar <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map((evt) => (
              <div key={evt.id} className="glass-card p-5 rounded-2xl border border-stone-200/80 flex items-center gap-3">
                <CalIcon className="w-5 h-5 text-rose-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-stone-800 text-sm truncate">{evt.title}</h4>
                  <span className="text-[11px] text-stone-400">{evt.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Future Memories */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-stone-800">Memories We Haven't Made Yet ✨</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {futureMemories.map((fm) => (
            <div key={fm.id} className={`glass-card p-6 rounded-3xl border text-center space-y-2 transition-all ${
              fm.isUnlocked ? 'border-emerald-300 bg-emerald-50/50' : 'border-stone-200/80 border-dashed'
            }`}>
              <span className="text-4xl block">{fm.icon}</span>
              <h4 className="font-serif text-lg font-bold text-stone-800">{fm.title}</h4>
              <p className="text-xs text-stone-500 leading-relaxed">{fm.placeholderDescription}</p>
              {fm.targetYear && (
                <span className="text-[10px] text-rose-700 font-mono font-medium block">Target: {fm.targetYear}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dashboard Navigation Grid */}
      <div className="space-y-4 pt-6 border-t border-stone-200/80">
        <h2 className="font-serif text-2xl font-bold text-stone-800">Your Private Space Modules</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => onSelectTab(item.tab)}
              className={`glass-card p-6 rounded-3xl border flex flex-col items-center justify-center gap-2.5 text-center transition-all active:scale-95 ${
                item.highlight
                  ? 'border-rose-300 bg-rose-50/60 shadow-sm hover:border-rose-400'
                  : 'border-stone-200/80 hover:border-rose-300'
              }`}
            >
              <div className="p-3 rounded-full bg-white border border-stone-200/60 text-rose-700 shadow-xs">
                {item.icon}
              </div>
              <span className="text-xs font-semibold text-stone-800">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
