import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Key,
  Lock,
  LogOut,
  Mail,
  RefreshCw,
  User,
  UserCheck,
  X,
} from "lucide-react";
import React, { useState } from "react";
import {
  AuthUserInfo,
  logoutFirebaseUser,
  refreshAuthUser,
  resendVerificationEmail,
  resetPasswordEmail,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from "../../lib/firebase";
import { CoupleProfile, SessionState } from "../../types";

interface LoginModalProps {
  profile: CoupleProfile;
  session: SessionState;
  onClose: () => void;
  onLogin: (partner: "partner1" | "partner2", email?: string) => void;
  onLogout: () => void;
  authUser?: AuthUserInfo | null;
}

type AuthMode = "signin" | "signup" | "reset";

export const LoginModal: React.FC<LoginModalProps> = ({
  profile,
  session,
  onClose,
  onLogin,
  onLogout,
  authUser,
}) => {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [selectedPartner, setSelectedPartner] = useState<
    "partner1" | "partner2"
  >("partner1");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const clearMessages = () => {
    setError("");
    setSuccessMessage("");
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      const user = await signInWithEmail(email, password, selectedPartner);
      onLogin(user.activePartner, user.email || undefined);
      setSuccessMessage("Successfully signed in!");
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      setError(
        err.message || "Failed to sign in. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      const user = await signUpWithEmail(
        email,
        password,
        name,
        selectedPartner,
      );
      onLogin(user.activePartner, user.email || undefined);
      setSuccessMessage("Account created successfully!");
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    clearMessages();
    setLoading(true);
    try {
      const user = await signInWithGoogle(selectedPartner);
      onLogin(user.activePartner, user.email || undefined);
      setSuccessMessage("Signed in with Gmail successfully!");
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      setError(err.message || "Gmail Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      await resetPasswordEmail(email);
      setSuccessMessage(
        `Password reset link sent to ${email}. Please check your Gmail/Email inbox!`,
      );
    } catch (err: any) {
      setError(err.message || "Failed to send password reset email.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = async () => {
    try {
      await logoutFirebaseUser();
    } catch (err) {
      console.warn("Firebase logout error:", err);
    }
    onLogout();
    onClose();
  };

  const handleResendVerification = async () => {
    clearMessages();
    try {
      await resendVerificationEmail();
      setSuccessMessage("Verification email sent. Please check your inbox.");
    } catch (err: any) {
      setError(err.message || "Unable to resend verification email.");
    }
  };

  const handleRefreshVerification = async () => {
    clearMessages();
    try {
      const refreshed = await refreshAuthUser();
      if (refreshed?.emailVerified)
        setSuccessMessage("Email verified. Couple Space is now unlocked.");
      else
        setError(
          "Your email is not verified yet. Open the verification email, then try again.",
        );
    } catch (err: any) {
      setError(err.message || "Unable to refresh verification status.");
    }
  };

  // LOGGED IN STATE
  if (session.isLoggedIn || authUser) {
    const currentEmail = authUser?.email || "Logged In";
    const activeAvatar =
      session.activePartner === "partner1"
        ? profile.partner1Avatar
        : profile.partner2Avatar;
    const activeName =
      session.activePartner === "partner1"
        ? profile.partner1Name
        : profile.partner2Name;

    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border border-stone-200/90 space-y-6 animate-scaleIn shadow-2xl bg-white">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                Account & Session
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-stone-100 text-stone-400"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-rose-100 p-1 border-2 border-rose-300 relative shadow-sm">
              <img
                src={activeAvatar}
                alt="Partner Avatar"
                className="w-full h-full rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>

            <div>
              <p className="text-stone-900 text-lg font-serif font-bold">
                Logged in as <span className="text-rose-700">{activeName}</span>
              </p>
              <p className="text-xs text-stone-500 font-medium truncate max-w-xs mx-auto">
                📧 {currentEmail}
              </p>
              <span className="inline-block mt-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs text-emerald-700 font-medium">
                ● Live Firebase Connected
              </span>
              {authUser &&
                authUser.provider === "password" &&
                !authUser.emailVerified && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-left space-y-2">
                    <p className="text-xs font-semibold text-amber-900">
                      Please verify your email
                    </p>
                    <p className="text-[11px] text-amber-800">
                      Private couple features stay locked until verification is
                      complete.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleResendVerification}
                        className="text-[11px] text-rose-700 font-semibold hover:underline"
                      >
                        Resend email
                      </button>
                      <button
                        onClick={handleRefreshVerification}
                        className="text-[11px] text-stone-700 font-semibold hover:underline"
                      >
                        Refresh status
                      </button>
                    </div>
                  </div>
                )}
            </div>

            {/* Switch Active Partner */}
            <div className="glass-card p-4 rounded-2xl border border-stone-200/80 space-y-3 bg-stone-50">
              <p className="text-xs text-stone-600 font-semibold uppercase tracking-wider">
                Switch Partner Persona:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onLogin("partner1", currentEmail)}
                  className={`p-3 rounded-2xl text-xs font-semibold border transition-all flex items-center justify-center gap-2 ${
                    session.activePartner === "partner1"
                      ? "bg-rose-700 border-rose-700 text-white shadow-sm"
                      : "bg-white border-stone-200 text-stone-700 hover:border-stone-300"
                  }`}
                >
                  <span>{profile.partner1Name.split(" ")[0]}</span>
                </button>
                <button
                  onClick={() => onLogin("partner2", currentEmail)}
                  className={`p-3 rounded-2xl text-xs font-semibold border transition-all flex items-center justify-center gap-2 ${
                    session.activePartner === "partner2"
                      ? "bg-rose-700 border-rose-700 text-white shadow-sm"
                      : "bg-white border-stone-200 text-stone-700 hover:border-stone-300"
                  }`}
                >
                  <span>{profile.partner2Name.split(" ")[0]}</span>
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogoutClick}
            className="w-full py-3 rounded-full bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all border border-stone-300"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Account</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border border-stone-200/90 space-y-6 animate-scaleIn shadow-2xl bg-white max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-rose-600" />
            <div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                {mode === "signin" && "Welcome Back ❤️"}
                {mode === "signup" && "Create Account ✨"}
                {mode === "reset" && "Reset Password 🔒"}
              </h3>
              <p className="text-xs text-stone-500">
                Realtime database synchronized
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-400"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-stone-100 p-1 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => {
              setMode("signin");
              clearMessages();
            }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              mode === "signin"
                ? "bg-white text-rose-700 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode("signup");
              clearMessages();
            }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              mode === "signup"
                ? "bg-white text-rose-700 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => {
              setMode("reset");
              clearMessages();
            }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              mode === "reset"
                ? "bg-white text-rose-700 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Reset
          </button>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2 text-emerald-800 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Partner Selection (for Sign in & Sign up) */}
        {mode !== "reset" && (
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-600 mb-2">
              Select Couple Persona
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedPartner("partner1")}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                  selectedPartner === "partner1"
                    ? "bg-rose-50 border-rose-400 text-rose-900 shadow-xs"
                    : "bg-white border-stone-200 text-stone-600 hover:border-stone-300"
                }`}
              >
                <img
                  src={profile.partner1Avatar}
                  alt={profile.partner1Name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-rose-300"
                />
                <span className="text-xs font-semibold">
                  {profile.partner1Name.split(" ")[0]}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPartner("partner2")}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                  selectedPartner === "partner2"
                    ? "bg-rose-50 border-rose-400 text-rose-900 shadow-xs"
                    : "bg-white border-stone-200 text-stone-600 hover:border-stone-300"
                }`}
              >
                <img
                  src={profile.partner2Avatar}
                  alt={profile.partner2Name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-rose-300"
                />
                <span className="text-xs font-semibold">
                  {profile.partner2Name.split(" ")[0]}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Gmail Google Authentication Button */}
        {mode !== "reset" && (
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-3 shadow-xs transition-all disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.27v3.15C3.25 21.3 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.24c-.25-.75-.38-1.55-.38-2.37s.13-1.62.38-2.37V6.35H1.27C.46 7.96 0 9.91 0 12s.46 4.04 1.27 5.65l4.01-3.41z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.35l4.01 3.41c.95-2.85 3.6-4.96 6.72-4.96z"
              />
            </svg>
            <span>Continue with Gmail (Google Auth)</span>
          </button>
        )}

        {mode !== "reset" && (
          <div className="relative flex items-center justify-center">
            <div className="border-t border-stone-200 w-full"></div>
            <span className="bg-white px-3 text-[10px] text-stone-400 uppercase font-semibold">
              Or with Email
            </span>
          </div>
        )}

        {/* SIGN IN FORM */}
        {mode === "signin" && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 focus:border-rose-400 text-xs text-stone-900 placeholder-stone-400 outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold uppercase text-stone-600">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setMode("reset")}
                  className="text-[11px] text-rose-600 hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 focus:border-rose-400 text-xs text-stone-900 placeholder-stone-400 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold tracking-wide shadow-sm transition-all flex items-center justify-center gap-2 uppercase disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              <span>Sign In to Couple Space ❤️</span>
            </button>
          </form>
        )}

        {/* SIGN UP FORM */}
        {mode === "signup" && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">
                Your Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 focus:border-rose-400 text-xs text-stone-900 placeholder-stone-400 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 focus:border-rose-400 text-xs text-stone-900 placeholder-stone-400 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">
                Create Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 focus:border-rose-400 text-xs text-stone-900 placeholder-stone-400 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold tracking-wide shadow-sm transition-all flex items-center justify-center gap-2 uppercase disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              <span>Create Account & Sync Live ✨</span>
            </button>
          </form>
        )}

        {/* RESET PASSWORD FORM */}
        {mode === "reset" && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <p className="text-xs text-stone-600">
              Enter your registered Gmail or email address below and we will
              send you a password reset link.
            </p>
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">
                Your Registered Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 focus:border-rose-400 text-xs text-stone-900 placeholder-stone-400 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold tracking-wide shadow-sm transition-all flex items-center justify-center gap-2 uppercase disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Mail className="w-4 h-4" />
              )}
              <span>Send Reset Password Email 📧</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
