import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Calendar, MapPin, ArrowRight, MessageCircle, Play, Camera, Compass, Plus, GlassWater, Award, CheckCircle2, Clock } from 'lucide-react';
import { CoupleProfile, TimelineEvent, Memory, GuestMessage } from '../../types';
import { CountdownTimer } from '../ui/CountdownTimer';

interface LandingPageProps {
  profile: CoupleProfile;
  timeline: TimelineEvent[];
  memories: Memory[];
  guestMessages: GuestMessage[];
  onEnterStory: () => void;
  onOpenReplay: () => void;
  onSelectTab: (tab: string) => void;
  onOpenAddMessage: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  profile,
  timeline,
  memories,
  guestMessages,
  onEnterStory,
  onOpenReplay,
  onSelectTab,
  onOpenAddMessage,
}) => {
  const [loveCount, setLoveCount] = useState(1248);
  const [hasSentLove, setHasSentLove] = useState(false);
  const [toastCount, setToastCount] = useState(384);
  const [hasToasted, setHasToasted] = useState(false);

  // Mini-Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number | null>>({
    0: null,
    1: null,
    2: null,
  });

  const quizQuestions = [
    {
      q: 'Where did Farjana & Nasif first meet in 2019?',
      options: ['Dhaka University Campus', 'A Coffee Shop', 'At a Wedding', 'At the Airport'],
      correct: 0,
      note: 'They first connected at a campus cultural gathering!',
    },
    {
      q: 'Where was the dream proposal in 2024?',
      options: ['Cox’s Bazar Beach', 'Overlooking the Eiffel Tower in Paris', 'In the Sylhet Tea Gardens', 'On a Rooftop in Dhaka'],
      correct: 1,
      note: 'Nasif proposed under the sparkling lights of the Eiffel Tower!',
    },
    {
      q: 'What is their favorite shared weekend activity?',
      options: ['Cooking dinner & movie marathons', 'Rock climbing', 'Skydiving', 'Silent reading only'],
      correct: 0,
      note: 'They love cooking handmade pasta and streaming movies together!',
    },
  ];

  const handleSendLove = () => {
    setLoveCount((prev) => prev + 1);
    setHasSentLove(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#e11d48', '#fb7185', '#fda4af', '#f43f5e']
    });
  };

  const handleRaiseToast = () => {
    setToastCount((prev) => prev + 1);
    setHasToasted(true);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#e5b326', '#ffd700', '#f7e7ce', '#b8860b']
    });
  };

  const publicMemories = memories.filter((m) => m.visibility === 'PUBLIC').slice(0, 6);
  const publicTimeline = timeline.filter((t) => t.visibility === 'PUBLIC').slice(0, 4);
  const approvedMessages = guestMessages.filter((m) => m.status === 'approved').slice(0, 3);

  const formattedWeddingDate = new Date(profile.weddingDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).toUpperCase();

  return (
    <div className="space-y-24 pb-20">
      {/* 1. SCREENSHOT-MATCHED FULL BLEED CINEMATIC HERO BANNER */}
      <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center text-center px-4 overflow-hidden -mt-20">
        {/* Full Bleed Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={profile.heroImage}
            alt={`${profile.partner1Name} & ${profile.partner2Name}`}
            className="w-full h-full object-cover object-center scale-105 filter brightness-[0.88] contrast-[1.02]"
          />
          {/* Warm romantic golden dusk overlay and dark vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/70" />
        </div>

        {/* Center Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-6 pt-24 pb-16">
          {/* Top Tag: OUR STORY ❤️ */}
          <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm tracking-[0.25em] uppercase text-stone-200/90 font-medium">
            <span>OUR STORY</span>
            <span className="text-rose-400">❤️</span>
          </div>

          {/* Couple Names with Elegant Two-Line Break & Ampersand */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-stone-100 tracking-wide leading-[1.2] max-w-3xl mx-auto drop-shadow-sm">
            <span className="block">{profile.partner1Name}</span>
            <span className="block text-2xl sm:text-4xl text-rose-300 font-serif italic my-1 font-light">&</span>
            <span className="block">{profile.partner2Name}</span>
          </h1>

          {/* Date & Location */}
          <p className="text-xs sm:text-sm tracking-[0.25em] uppercase text-stone-200/90 font-medium">
            {formattedWeddingDate} &nbsp;·&nbsp; {profile.location.toUpperCase()}
          </p>

          {/* Romantic Quote */}
          <p className="font-serif italic text-base sm:text-xl text-stone-200/95 max-w-2xl mx-auto leading-relaxed pt-2 font-light">
            "{profile.heroQuote}"
          </p>

          {/* Enter Our Story Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onEnterStory}
              className="px-8 py-3.5 rounded-full border border-white/60 hover:border-white text-white hover:bg-white/10 text-xs sm:text-sm font-medium tracking-[0.2em] uppercase transition-all flex items-center gap-2.5 backdrop-blur-xs active:scale-95 shadow-sm"
            >
              <span>ENTER OUR STORY</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenReplay}
              className="px-6 py-3.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-medium tracking-wider flex items-center gap-2 backdrop-blur-xs transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current text-rose-300" />
              <span>Replay Slideshow</span>
            </button>
          </div>

          {/* Countdown timer pill */}
          <div className="pt-6">
            <CountdownTimer weddingDateStr={profile.weddingDate} />
          </div>
        </div>
      </section>

      {/* 2. OUR MEMORIES — SHARED WITH THE WORLD */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-8">
        <div className="space-y-3 max-w-2xl mx-auto">
          <div className="text-xs tracking-[0.25em] uppercase text-stone-500 font-semibold flex items-center justify-center gap-1.5">
            <span>OUR MEMORIES</span>
            <span>📷</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-stone-900">
            Shared with the world
          </h2>

          <p className="text-stone-600 font-serif text-sm sm:text-base leading-relaxed">
            The first public memories are on their way. Everything private stays behind our door.
          </p>

          <div className="pt-2">
            <button
              onClick={() => onSelectTab('memories')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-rose-900 hover:text-rose-700 transition-colors"
            >
              <span>OPEN THE GALLERY</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Public Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 text-left">
          {publicMemories.map((mem) => (
            <div
              key={mem.id}
              onClick={() => onSelectTab('memories')}
              className="glass-card rounded-3xl overflow-hidden group cursor-pointer hover:shadow-romantic transition-all duration-300 border border-stone-200/80 bg-white"
            >
              <div className="h-64 overflow-hidden relative bg-stone-100">
                <img
                  src={mem.imageUrl}
                  alt={mem.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-medium text-stone-700 border border-stone-200">
                  {mem.date}
                </div>
              </div>
              <div className="p-6 space-y-2">
                <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-rose-800 transition-colors">
                  {mem.title}
                </h3>
                <p className="text-stone-600 text-xs line-clamp-2 leading-relaxed">
                  {mem.caption}
                </p>
                {mem.location && (
                  <div className="text-[11px] text-stone-500 flex items-center gap-1 pt-1">
                    <MapPin className="w-3 h-3 text-rose-600" />
                    <span>{mem.location}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. MESSAGES FROM THE PEOPLE WE LOVE ❤️ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-8">
        <div className="space-y-2">
          <div className="text-xs tracking-[0.25em] uppercase text-stone-500 font-semibold flex items-center justify-center gap-1.5">
            <span>MESSAGES FROM THE PEOPLE WE LOVE</span>
            <span className="text-rose-500">❤️</span>
          </div>
        </div>

        {/* 3-Card Grid Matching Screenshot 2 with Deep Crisp Text */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {approvedMessages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white p-7 sm:p-8 rounded-3xl border border-stone-200/80 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow"
            >
              <p className="font-serif italic text-stone-900 text-base sm:text-lg leading-relaxed font-normal">
                "{msg.message}"
              </p>
              <div className="pt-2">
                <span className="text-xs tracking-[0.18em] uppercase font-bold text-stone-900 block">
                  {msg.authorName}
                </span>
                <span className="text-[11px] text-rose-800 uppercase tracking-wider font-semibold block mt-0.5">
                  {msg.relationship}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Leave Us A Message link */}
        <div className="pt-2">
          <button
            onClick={onOpenAddMessage}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-rose-900 hover:text-rose-700 transition-colors"
          >
            <span>LEAVE US A MESSAGE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4. INTERACTIVE VIEWER EXPERIENCE: SEND LOVE & RAISE A TOAST 🥂 */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-stone-200/90 shadow-sm bg-white text-center space-y-8">
          <div className="space-y-2 max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-[0.25em] text-rose-800 font-semibold">
              Share Your Warmth & Blessings ✨
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-normal text-stone-900">
              Celebrate with Farjana & Nasif
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm font-light">
              Tap below to send a burst of love or virtually raise a toast to the newlyweds!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
            {/* Send Love Button */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleSendLove}
                className="px-8 py-4 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-800 font-bold text-sm shadow-xs flex items-center gap-2.5 transition-all active:scale-95 group"
              >
                <Heart className={`w-5 h-5 text-rose-600 fill-current ${hasSentLove ? 'animate-ping' : 'group-hover:scale-125'} transition-transform`} />
                <span>Send Love & Hugs</span>
              </button>
              <span className="text-xs text-stone-500 font-mono block">
                ❤️ {loveCount.toLocaleString()} Blessings Sent
              </span>
            </div>

            {/* Raise a Toast Button */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleRaiseToast}
                className="px-8 py-4 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-sm shadow-xs flex items-center gap-2.5 transition-all active:scale-95 group"
              >
                <span className="text-lg">🥂</span>
                <span>Raise a Virtual Toast</span>
              </button>
              <span className="text-xs text-stone-500 font-mono block">
                🍾 {toastCount.toLocaleString()} Toasts Raised
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FUN VIEWER MINI-QUIZ: "How Well Do You Know the Couple?" */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <div className="text-xs tracking-[0.25em] uppercase text-stone-500 font-semibold flex items-center justify-center gap-1.5">
            <span>FOR WEDDING GUESTS & FRIENDS</span>
            <span>✨</span>
          </div>
          <h3 className="font-serif text-3xl sm:text-4xl font-normal text-stone-900">
            How Well Do You Know Farjana & Nasif?
          </h3>
          <p className="text-stone-600 text-xs sm:text-sm max-w-lg mx-auto font-light">
            Take this sweet 3-question mini-quiz to test your couple knowledge!
          </p>
        </div>

        <div className="space-y-4">
          {quizQuestions.map((qItem, qIdx) => {
            const selected = quizAnswers[qIdx];
            const isAnswered = selected !== null;
            const isCorrect = selected === qItem.correct;

            return (
              <div
                key={qIdx}
                className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200/80 shadow-xs space-y-4 text-stone-800"
              >
                <h4 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                  {qIdx + 1}. {qItem.q}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {qItem.options.map((opt, optIdx) => {
                    const isOptionSelected = selected === optIdx;
                    let optStyle = 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700';

                    if (isAnswered) {
                      if (optIdx === qItem.correct) {
                        optStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                      } else if (isOptionSelected) {
                        optStyle = 'bg-rose-50 border-rose-400 text-rose-900';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isAnswered}
                        onClick={() => {
                          setQuizAnswers({ ...quizAnswers, [qIdx]: optIdx });
                          if (optIdx === qItem.correct) {
                            confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
                          }
                        }}
                        className={`p-3 rounded-2xl text-xs sm:text-sm text-left border transition-all ${optStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <p className={`text-xs pt-1 font-medium ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {isCorrect ? '✓ Correct! ' : '♡ Almost! '}
                    {qItem.note}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. OUR STORY TIMELINE HIGHLIGHTS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-3">
          <div className="text-xs tracking-[0.25em] uppercase text-stone-500 font-semibold">
            THE CHAPTERS OF OUR LOVE
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-stone-900">
            Our Story Timeline
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {publicTimeline.map((item, idx) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-4 group hover:border-rose-300 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-rose-900 font-semibold">
                  <span>{item.year}</span>
                  <span className="text-[10px] text-stone-400">{item.location}</span>
                </div>
                {item.imageUrl && (
                  <div className="h-36 rounded-2xl overflow-hidden bg-stone-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  {item.title}
                </h3>
                <p className="text-stone-600 text-xs leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>
              <div className="pt-2 text-right">
                <span className="text-[10px] text-stone-400 font-mono">Chapter #{idx + 1}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => onSelectTab('timeline')}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-rose-900 hover:text-rose-700 transition-colors"
          >
            <span>VIEW FULL TIMELINE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 7. FINAL HOMEPAGE MESSAGE */}
      <section className="max-w-3xl mx-auto px-4 text-center space-y-6 pt-16 border-t border-stone-200/80">
        <h3 className="font-serif text-3xl sm:text-4xl font-normal text-stone-900">
          “Our story isn’t finished.”
        </h3>

        <p className="font-serif text-base sm:text-xl text-stone-700 leading-relaxed italic max-w-xl mx-auto font-light">
          “Every photograph, every adventure, every laugh, every difficult day, every celebration, and every ordinary moment becomes part of our story.”
        </p>

        <div className="space-y-2 pt-4">
          <Heart className="w-7 h-7 text-rose-600 fill-rose-500/30 mx-auto animate-pulse" />
          <span className="font-serif italic text-2xl sm:text-3xl text-rose-900 block">
            To be continued...
          </span>
        </div>
      </section>
    </div>
  );
};
