import React from 'react';
import { Heart, Lock, Key, Plus, Sparkles, UserCheck, Shield, MessageCircle } from 'lucide-react';
import { CoupleProfile, SessionState } from '../../types';

interface NavbarProps {
  profile: CoupleProfile;
  session: SessionState;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLogin: () => void;
  onOpenAddMemory: () => void;
  onOpenAdminSetup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  session,
  activeTab,
  setActiveTab,
  onOpenLogin,
  onOpenAddMemory,
  onOpenAdminSetup,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo - Screenshot Matched Serif: "Our Story" */}
        <button
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-2 group text-left focus:outline-none"
        >
          <span className="font-serif text-2xl sm:text-3xl text-stone-900 tracking-normal font-normal group-hover:text-rose-800 transition-colors">
            Our Story
          </span>
        </button>

        {/* Center Navigation Links - Screenshot Matched */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-stone-700">
          <button
            onClick={() => setActiveTab('landing')}
            className={`transition-colors hover:text-rose-800 ${
              activeTab === 'landing' ? 'text-stone-900 font-semibold border-b-2 border-stone-900 pb-0.5' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`transition-colors hover:text-rose-800 ${
              activeTab === 'timeline' ? 'text-stone-900 font-semibold border-b-2 border-stone-900 pb-0.5' : ''
            }`}
          >
            Our Story
          </button>
          <button
            onClick={() => setActiveTab('memories')}
            className={`transition-colors hover:text-rose-800 ${
              activeTab === 'memories' ? 'text-stone-900 font-semibold border-b-2 border-stone-900 pb-0.5' : ''
            }`}
          >
            Memories
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`transition-colors hover:text-rose-800 ${
              activeTab === 'messages' ? 'text-stone-900 font-semibold border-b-2 border-stone-900 pb-0.5' : ''
            }`}
          >
            Messages
          </button>

          {/* Couple Dashboard / Private Space */}
          {session.isLoggedIn && (
            <>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`transition-colors hover:text-rose-800 flex items-center gap-1.5 ${
                  activeTab === 'dashboard' ? 'text-rose-800 font-semibold border-b-2 border-rose-800 pb-0.5' : ''
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>Couple Space</span>
              </button>

              <button
                onClick={() => setActiveTab('chat')}
                className={`transition-colors hover:text-rose-800 flex items-center gap-1.5 ${
                  activeTab === 'chat' ? 'text-rose-800 font-semibold border-b-2 border-rose-800 pb-0.5' : ''
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5 text-rose-500" />
                <span>Chat 💬</span>
              </button>
            </>
          )}
        </nav>

        {/* Action Controls & SIGN IN Pill Button (Screenshot 1 & 2 Matched) */}
        <div className="flex items-center gap-3">
          {session.isLoggedIn ? (
            <>
              <button
                onClick={onOpenAddMemory}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Memory</span>
              </button>

              <button
                onClick={onOpenLogin}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium border border-stone-300 transition-all"
                title="Manage Couple Session"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {session.activePartner === 'partner1' ? profile.partner1Name.split(' ')[0] : profile.partner2Name.split(' ')[0]}
                </span>
              </button>
            </>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-6 py-2 rounded-full border border-stone-300 hover:border-stone-800 text-stone-800 hover:text-stone-950 text-xs font-medium tracking-widest uppercase transition-all"
            >
              SIGN IN
            </button>
          )}

          {/* Admin / Gift Setup button */}
          <button
            onClick={onOpenAdminSetup}
            className="p-2.5 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors"
            title="Wedding Gift Setup & Customization"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navbar */}
      <div className="md:hidden flex items-center justify-around py-2.5 px-2 border-t border-stone-200/80 bg-white/95 text-xs text-stone-700">
        <button
          onClick={() => setActiveTab('landing')}
          className={`px-2 py-1 ${activeTab === 'landing' ? 'text-rose-800 font-bold' : ''}`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-2 py-1 ${activeTab === 'timeline' ? 'text-rose-800 font-bold' : ''}`}
        >
          Our Story
        </button>
        <button
          onClick={() => setActiveTab('memories')}
          className={`px-2 py-1 ${activeTab === 'memories' ? 'text-rose-800 font-bold' : ''}`}
        >
          Memories
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-2 py-1 ${activeTab === 'messages' ? 'text-rose-800 font-bold' : ''}`}
        >
          Messages
        </button>
        {session.isLoggedIn && (
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-2 py-1 ${activeTab === 'chat' ? 'text-rose-800 font-bold' : ''}`}
          >
            Chat 💬
          </button>
        )}
      </div>
    </header>
  );
};
