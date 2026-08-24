import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Heart, ArrowRight, Play, MapPin } from 'lucide-react';
import { CoupleProfile, TimelineEvent, Memory, GuestMessage } from '../../types';
import { CountdownTimer } from '../ui/CountdownTimer';

interface LandingPageProps {
  profile: CoupleProfile;
  timeline: TimelineEvent[];
  memories: Memory[];
  guestMessages: GuestMessage[];
  loveCount: number;
  toastCount: number;
  hasSentLove: boolean;
  hasToasted: boolean;
  onEnterStory: () => void;
  onOpenReplay: () => void;
  onSelectTab: (tab: string) => void;
  onOpenAddMessage: () => void;
  onSendLove: () => void;
  onRaiseToast: () => void;
}

// ── Scroll-reveal wrapper ───────────────────────────────────────────────────
const ScrollReveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// ── Section label chip ──────────────────────────────────────────────────────
const SectionLabel: React.FC<{ text: string; emoji?: string }> = ({ text, emoji }) => (
  <div className="text-xs tracking-[0.25em] uppercase text-stone-500 font-semibold flex items-center justify-center gap-1.5">
    <span>{text}</span>
    {emoji && <span>{emoji}</span>}
  </div>
);

// ── Section heading ─────────────────────────────────────────────────────────
const SectionHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="font-serif text-3xl sm:text-5xl font-normal text-stone-900 leading-tight">
    {children}
  </h2>
);

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
export const LandingPage: React.FC<LandingPageProps> = ({
  profile,
  timeline,
  memories,
  guestMessages,
  loveCount,
  toastCount,
  hasSentLove,
  hasToasted,
  onEnterStory,
  onOpenReplay,
  onSelectTab,
  onOpenAddMessage,
  onSendLove,
  onRaiseToast,
}) => {
  // Mini-Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number | null>>({
    0: null, 1: null, 2: null,
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
      options: ['Cox\'s Bazar Beach', 'Overlooking the Eiffel Tower in Paris', 'In the Sylhet Tea Gardens', 'On a Rooftop in Dhaka'],
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

  const handleSendLoveWithConfetti = () => {
    onSendLove();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#e11d48', '#fb7185', '#fda4af', '#f43f5e'],
    });
  };

  const handleRaiseToastWithConfetti = () => {
    onRaiseToast();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#e5b326', '#ffd700', '#f7e7ce', '#b8860b'],
    });
  };

  const publicMemories = memories.filter((m) => m.visibility === 'PUBLIC').slice(0, 6);
  const publicTimeline = timeline.filter((t) => t.visibility === 'PUBLIC').slice(0, 4);
  const approvedMessages = guestMessages.filter((m) => m.status === 'approved').slice(0, 3);

  const formattedWeddingDate = new Date(profile.weddingDate).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  }).toUpperCase();

  return (
    <div className="space-y-20 pb-20">

      {/* ── 1. HERO SECTION ──────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center text-center px-4 overflow-hidden -mt-20">

        {/* Full-bleed background with slow zoom */}
        <div className="absolute inset-0 z-0">
          <img
            src={profile.heroImage}
            alt={`${profile.partner1Name} & ${profile.partner2Name}`}
            className="animate-slow-zoom absolute inset-0 size-full object-cover"
          />
          {/* Dark cinematic vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/70" />
          {/* Light pinkish romantic tint */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-900/20 via-transparent to-pink-900/15" />
        </div>

        {/* Right-side floating bubbles (hidden on mobile) */}
        <div className="hidden lg:block absolute right-8 inset-y-0 z-5 pointer-events-none overflow-hidden w-32">
          {[
            { size: 'w-6 h-6',  bottom: '15%', cls: 'animate-bubble-1' },
            { size: 'w-10 h-10', bottom: '8%',  cls: 'animate-bubble-2' },
            { size: 'w-4 h-4',  bottom: '20%', cls: 'animate-bubble-3' },
            { size: 'w-8 h-8',  bottom: '5%',  cls: 'animate-bubble-4' },
          ].map((b, i) => (
            <div
              key={i}
              className={`absolute right-4 rounded-full border border-rose-300/40 bg-rose-200/20 backdrop-blur-sm ${b.size} ${b.cls}`}
              style={{ bottom: b.bottom }}
            />
          ))}
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-6 pt-24 pb-16">
          <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm tracking-[0.25em] uppercase text-stone-200/90 font-medium">
            <span>OUR STORY</span>
            <span className="text-rose-400">❤️</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-stone-100 tracking-wide leading-[1.2] max-w-3xl mx-auto drop-shadow-sm">
            <span className="block">{profile.partner1Name}</span>
            <span className="block text-2xl sm:text-4xl text-rose-300 font-serif italic my-1 font-extralight">&</span>
            <span className="block">{profile.partner2Name}</span>
          </h1>

          <p className="text-xs sm:text-sm tracking-[0.25em] uppercase text-stone-200/90 font-light">
            {formattedWeddingDate} &nbsp;·&nbsp; {profile.location.toUpperCase()}
          </p>

          <p className="font-serif italic text-base sm:text-xl text-stone-200/95 max-w-2xl mx-auto leading-relaxed pt-2 font-extralight">
            "{profile.heroQuote}"
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onEnterStory}
              className="px-8 py-3.5 rounded-full border border-white/60 hover:border-white text-white hover:bg-white/10 text-xs sm:text-sm font-medium tracking-[0.2em] uppercase transition-all flex items-center gap-2.5 backdrop-blur-sm active:scale-95 shadow-sm"
            >
              <span>ENTER OUR STORY</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenReplay}
              className="px-6 py-3.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-light tracking-wider flex items-center gap-2 backdrop-blur-sm transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current text-rose-300" />
              <span>Replay Slideshow</span>
            </button>
          </div>

          <div className="pt-6">
            <CountdownTimer weddingDateStr={profile.weddingDate} />
          </div>
        </div>
      </section>

      {/* ── 2. MEMORIES GALLERY ──────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-8">
        <ScrollReveal className="space-y-3 max-w-2xl mx-auto">
          <SectionLabel text="OUR MEMORIES" emoji="📷" />
          <SectionHeading>Shared with the world</SectionHeading>
          <p className="text-stone-500 font-serif text-sm sm:text-base leading-relaxed font-light">
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
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 text-left">
          {publicMemories.map((mem, i) => (
            <ScrollReveal key={mem.id} delay={i * 80}>
              <div
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
                  <h3 className="font-serif text-xl font-semibold text-stone-900 group-hover:text-rose-800 transition-colors">
                    {mem.title}
                  </h3>
                  <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed font-light">
                    {mem.caption}
                  </p>
                  {mem.location && (
                    <div className="text-[11px] text-stone-400 flex items-center gap-1 pt-1">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      <span>{mem.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── 3. GUEST MESSAGES ────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-8">
        <ScrollReveal className="space-y-2">
          <SectionLabel text="MESSAGES FROM THE PEOPLE WE LOVE" emoji="❤️" />
          <SectionHeading>Words from our loved ones</SectionHeading>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {approvedMessages.map((msg, i) => (
            <ScrollReveal key={msg.id} delay={i * 80}>
              <div className="glass-card bg-white p-7 sm:p-8 rounded-3xl border border-stone-200/80 flex flex-col justify-between space-y-6 hover:shadow-romantic transition-all duration-300">
                <p className="font-serif italic text-stone-800 text-base sm:text-lg leading-relaxed font-light">
                  "{msg.message}"
                </p>
                <div className="pt-2">
                  <span className="text-xs tracking-[0.18em] uppercase font-semibold text-stone-900 block">
                    {msg.authorName}
                  </span>
                  <span className="text-[11px] text-rose-700 uppercase tracking-wider font-medium block mt-0.5">
                    {msg.relationship}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenAddMessage}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-rose-900 hover:text-rose-700 transition-colors"
            >
              <span>LEAVE US A MESSAGE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectTab('messages')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium tracking-[0.15em] uppercase text-stone-500 hover:text-stone-800 transition-colors"
            >
              <span>VIEW ALL MESSAGES</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </ScrollReveal>
      </section>

      {/* ── 4. SEND LOVE & TOAST ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-stone-200/90 shadow-sm bg-white text-center space-y-8">
            <div className="space-y-2 max-w-xl mx-auto">
              <span className="text-xs uppercase tracking-[0.25em] text-rose-800 font-semibold">
                Share Your Warmth & Blessings ✨
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-light text-stone-900">
                Celebrate with Farjana & Nasif
              </h3>
              <p className="text-stone-500 text-xs sm:text-sm font-light">
                Tap below to send a burst of love or virtually raise a toast to the newlyweds!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
              {/* Send Love */}
              <div className="space-y-2 text-center">
                <button
                  type="button"
                  onClick={handleSendLoveWithConfetti}
                  className="px-8 py-4 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-800 font-semibold text-sm shadow-sm flex items-center gap-2.5 transition-all active:scale-95 group"
                >
                  <Heart className={`w-5 h-5 text-rose-600 fill-current ${hasSentLove ? 'animate-pulse' : 'group-hover:scale-125'} transition-transform`} />
                  <span>Send Love & Hugs</span>
                </button>
                <span className="text-xs text-stone-400 font-mono block">
                  ❤️ {loveCount.toLocaleString()} Blessings Sent
                </span>
              </div>

              {/* Raise a Toast */}
              <div className="space-y-2 text-center">
                <button
                  type="button"
                  onClick={handleRaiseToastWithConfetti}
                  className="px-8 py-4 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-semibold text-sm shadow-sm flex items-center gap-2.5 transition-all active:scale-95 group"
                >
                  <span className="text-lg">🥂</span>
                  <span>Raise a Virtual Toast</span>
                </button>
                <span className="text-xs text-stone-400 font-mono block">
                  🍾 {toastCount.toLocaleString()} Toasts Raised
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── 5. MINI QUIZ ─────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <ScrollReveal className="text-center space-y-2">
          <SectionLabel text="FOR WEDDING GUESTS & FRIENDS" emoji="✨" />
          <SectionHeading>How Well Do You Know Farjana & Nasif?</SectionHeading>
          <p className="text-stone-500 text-xs sm:text-sm max-w-lg mx-auto font-light">
            Take this sweet 3-question mini-quiz to test your couple knowledge!
          </p>
        </ScrollReveal>

        <div className="space-y-4">
          {quizQuestions.map((qItem, qIdx) => {
            const selected = quizAnswers[qIdx];
            const isAnswered = selected !== null;
            const isCorrect = selected === qItem.correct;

            return (
              <ScrollReveal key={qIdx} delay={qIdx * 80}>
                <div className="glass-card bg-white p-6 sm:p-7 rounded-3xl border border-stone-200/80 space-y-4 text-stone-800">
                  <h4 className="font-serif text-lg sm:text-xl font-semibold text-stone-900">
                    {qIdx + 1}. {qItem.q}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {qItem.options.map((opt, optIdx) => {
                      const isOptionSelected = selected === optIdx;
                      let optStyle = 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-600 font-light';
                      if (isAnswered) {
                        if (optIdx === qItem.correct) optStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold';
                        else if (isOptionSelected) optStyle = 'bg-rose-50 border-rose-400 text-rose-900';
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
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* ── 6. TIMELINE HIGHLIGHTS ───────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        <ScrollReveal className="text-center space-y-3">
          <SectionLabel text="THE CHAPTERS OF OUR LOVE" />
          <SectionHeading>Our Story Timeline</SectionHeading>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {publicTimeline.map((item, idx) => (
            <ScrollReveal key={item.id} delay={idx * 80}>
              <div className="glass-card bg-white p-6 rounded-3xl border border-stone-200/80 flex flex-col justify-between space-y-4 group hover:border-rose-300 hover:shadow-romantic transition-all duration-300">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-rose-800 font-semibold">
                    <span>{item.year}</span>
                    <span className="text-[10px] text-stone-400 font-light">{item.location}</span>
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
                  <h3 className="font-serif text-lg font-semibold text-stone-900">{item.title}</h3>
                  <p className="text-stone-500 text-xs leading-relaxed line-clamp-3 font-light">
                    {item.description}
                  </p>
                </div>
                <div className="pt-2 text-right">
                  <span className="text-[10px] text-stone-400 font-mono">Chapter #{idx + 1}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="text-center pt-2">
          <button
            onClick={() => onSelectTab('timeline')}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-rose-900 hover:text-rose-700 transition-colors"
          >
            <span>VIEW FULL TIMELINE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </ScrollReveal>
      </section>

      {/* ── 7. CLOSING MESSAGE ───────────────────────────────────────────── */}
      <ScrollReveal>
        <section className="max-w-3xl mx-auto px-4 text-center space-y-6 pt-16 border-t border-stone-200/80">
          <h3 className="font-serif text-3xl sm:text-4xl font-light text-stone-900">
            "Our story isn't finished."
          </h3>
          <p className="font-serif text-base sm:text-xl text-stone-600 leading-relaxed italic max-w-xl mx-auto font-extralight">
            "Every photograph, every adventure, every laugh, every difficult day, every celebration,
            and every ordinary moment becomes part of our story."
          </p>
          <div className="space-y-2 pt-4">
            <Heart className="w-7 h-7 text-rose-600 fill-rose-500/30 mx-auto animate-pulse" />
            <span className="font-serif italic text-2xl sm:text-3xl text-rose-900 block font-light">
              To be continued...
            </span>
          </div>
        </section>
      </ScrollReveal>

    </div>
  );
};
