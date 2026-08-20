import React, { useState } from 'react';
import { X, Key, LogOut, UserCheck, Shield, Users } from 'lucide-react';
import { SessionState, CoupleProfile } from '../../types';

interface LoginModalProps {
  profile: CoupleProfile;
  session: SessionState;
  onClose: () => void;
  onLogin: (partner: 'partner1' | 'partner2', password: string) => void;
  onLogout: () => void;
}

const COUPLE_PASSWORD = 'ourstory2026';

export const LoginModal: React.FC<LoginModalProps> = ({
  profile,
  session,
  onClose,
  onLogin,
  onLogout,
}) => {
  const [selectedPartner, setSelectedPartner] = useState<'partner1' | 'partner2'>('partner1');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === COUPLE_PASSWORD) {
      onLogin(selectedPartner, password);
      onClose();
    } else {
      setError('Incorrect password. Hint: ourstory2026');
    }
  };

  if (session.isLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border border-stone-200/90 space-y-6 animate-scaleIn shadow-2xl bg-white">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="font-serif text-2xl font-bold text-stone-900">Couple Session</h3>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-100 text-stone-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 p-1 border-2 border-rose-300">
              <img
                src={session.activePartner === 'partner1' ? profile.partner1Avatar : profile.partner2Avatar}
                alt="Partner Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <p className="text-stone-900 text-lg font-serif font-bold">
                Logged in as{' '}
                <span className="text-rose-700">
                  {session.activePartner === 'partner1' ? profile.partner1Name : profile.partner2Name}
                </span>
              </p>
              <span className="text-xs text-emerald-600 font-medium">● Active Couple Session</span>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-stone-200/80 space-y-3 bg-stone-50">
              <p className="text-xs text-stone-600 font-semibold uppercase">Switch Active Partner:</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onLogin('partner1', COUPLE_PASSWORD)}
                  className={`p-3 rounded-2xl text-xs font-semibold border transition-all ${
                    session.activePartner === 'partner1'
                      ? 'bg-rose-700 border-rose-700 text-white shadow-xs'
                      : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                  }`}
                >
                  {profile.partner1Name.split(' ')[0]}
                </button>
                <button
                  onClick={() => onLogin('partner2', COUPLE_PASSWORD)}
                  className={`p-3 rounded-2xl text-xs font-semibold border transition-all ${
                    session.activePartner === 'partner2'
                      ? 'bg-rose-700 border-rose-700 text-white shadow-xs'
                      : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                  }`}
                >
                  {profile.partner2Name.split(' ')[0]}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full py-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all border border-stone-300"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border border-stone-200/90 space-y-6 animate-scaleIn shadow-2xl bg-white">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-rose-600" />
            <div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                Couple Sign In 🔐
              </h3>
              <p className="text-xs text-stone-500">Access your private couple space</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-100 text-stone-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-stone-800">
          {/* Partner Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-600 mb-2">
              Who is logging in?
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedPartner('partner1')}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                  selectedPartner === 'partner1'
                    ? 'bg-rose-50 border-rose-400 text-rose-900 shadow-xs'
                    : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                <img
                  src={profile.partner1Avatar}
                  alt={profile.partner1Name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-rose-300"
                />
                <span className="text-xs font-semibold">{profile.partner1Name.split(' ')[0]}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPartner('partner2')}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                  selectedPartner === 'partner2'
                    ? 'bg-rose-50 border-rose-400 text-rose-900 shadow-xs'
                    : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                <img
                  src={profile.partner2Avatar}
                  alt={profile.partner2Name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-rose-300"
                />
                <span className="text-xs font-semibold">{profile.partner2Name.split(' ')[0]}</span>
              </button>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">
              Couple Password
            </label>
            <input
              type="password"
              required
              placeholder="Enter password (ourstory2026)"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 focus:border-rose-400 text-sm text-stone-900 placeholder-stone-400 outline-none"
            />
            {error && <p className="text-rose-600 text-xs mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold tracking-wide shadow-sm transition-all active:scale-95 uppercase"
          >
            Enter Our Private Space ❤️
          </button>

          <p className="text-center text-[11px] text-stone-400">
            Default password: <span className="text-stone-700 font-mono font-semibold">ourstory2026</span>
          </p>
        </form>
      </div>
    </div>
  );
};
