import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail, ShieldAlert } from "lucide-react";
import { User } from "../types";

interface AuthCardProps {
  onLogin: (user: User) => void;
}

export default function AuthCard({ onLogin }: AuthCardProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // Determine if admin
    // Both tiwarigautam819@gmail.com and singha26890@gmail.com are allowed as admin
    const emailLower = email.trim().toLowerCase();
    const isUserAdmin = emailLower === "tiwarigautam819@gmail.com" || emailLower === "singha26890@gmail.com";

    onLogin({
      email: email.trim(),
      isAdmin: isUserAdmin,
    });
  };

  return (
    <div className="w-full max-w-md mx-auto" id="auth-container">
      {/* Headphone and equalizer header from the user's reference mockup */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="relative mb-2">
          {/* Neon Glow Circle Behind Headphone */}
          <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full"></div>
          
          {/* Headphone SVG logo styled like the reference image */}
          <svg
            className="w-20 h-20 text-purple-500 relative z-10"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Headphones Arch */}
            <path d="M15 55 A 35 35 0 0 1 85 55" strokeWidth="4.5" />
            
            {/* Left ear cup */}
            <rect x="10" y="48" width="10" height="20" rx="4" fill="currentColor" stroke="none" />
            {/* Right ear cup */}
            <rect x="80" y="48" width="10" height="20" rx="4" fill="currentColor" stroke="none" />
            
            {/* Equalizer lines in the center */}
            <line x1="30" y1="40" x2="30" y2="60" stroke="#f43f5e" strokeWidth="4" />
            <line x1="40" y1="30" x2="40" y2="70" stroke="#a855f7" strokeWidth="4" />
            <line x1="50" y1="20" x2="50" y2="80" stroke="#d946ef" strokeWidth="4" />
            <line x1="60" y1="30" x2="60" y2="70" stroke="#a855f7" strokeWidth="4" />
            <line x1="70" y1="40" x2="70" y2="60" stroke="#f43f5e" strokeWidth="4" />
          </svg>
        </div>

        <h1 className="font-display font-black text-3xl md:text-4xl text-white tracking-widest leading-none">
          DJ<span className="text-purple-500">VOICE</span>ADDA
        </h1>
        <div className="flex items-center space-x-1 mt-1 text-pink-500 font-mono text-[10px] uppercase tracking-widest font-bold">
          <span>—</span>
          <span>DJ Tag Generator</span>
          <span>—</span>
        </div>

        <h2 className="mt-4 font-display font-semibold text-lg md:text-xl text-purple-200 uppercase tracking-wider">
          Create Professional
        </h2>
        <div className="relative mt-1">
          <span className="font-display font-black text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-purple-400 uppercase tracking-tight animate-neon block">
            DJ TAGS
          </span>
        </div>
        <div className="mt-2 bg-purple-900/40 border border-purple-500/30 px-4 py-1.5 rounded-full">
          <span className="text-xs text-purple-100 font-bold uppercase tracking-wider font-mono">
            In Seconds!
          </span>
        </div>
      </div>

      {/* Main Auth Form Container */}
      <div className="bg-[#120c24] border border-purple-900/60 rounded-3xl p-6 md:p-8 shadow-2xl shadow-purple-950/45 relative overflow-hidden">
        {/* Decorative corner light */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-white font-display">
            {isSignUp ? "Create Account" : "Welcome Back!"}
          </h3>
          <p className="text-xs text-purple-300/80 mt-1">
            {isSignUp
              ? "Sign up to access and create your customized voice tags."
              : "Sign in to continue to DJVoiceAdda"}
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs flex items-center space-x-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field */}
          <div>
            <label className="block text-xs font-semibold text-purple-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-purple-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="input-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-[#0a0515] border border-purple-900/50 rounded-xl py-3 pl-11 pr-4 text-white text-sm placeholder-purple-400/40 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-purple-300 uppercase tracking-wider">
                Password
              </label>
              {!isSignUp && (
                <button
                  type="button"
                  className="text-xs text-purple-400 hover:text-purple-300 font-medium"
                  onClick={() => alert("Password reset link has been sent (simulation).")}
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-purple-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="input-password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-[#0a0515] border border-purple-900/50 rounded-xl py-3 pl-11 pr-11 text-white text-sm placeholder-purple-400/40 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-purple-400 hover:text-purple-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Settings checkboxes */}
          <div className="flex flex-col space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer text-xs text-purple-200">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-purple-900 bg-[#0a0515] text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
                />
                <span>Remember me</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="btn-auth-submit"
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-purple-500/20 active:scale-[0.98] transition-all uppercase tracking-wider font-display text-sm mt-2"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        {/* Toggle Form type link */}
        <div className="text-center mt-6">
          <p className="text-xs text-purple-300">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              id="btn-toggle-auth"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="text-pink-400 hover:text-pink-300 font-bold underline ml-1"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>

        {/* Security Badge from mockup */}
        <div className="mt-8 pt-4 border-t border-purple-900/30 flex items-center justify-center space-x-2.5 text-[10px] text-purple-400/80">
          <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.9c0-.773.541-1.42 1.304-1.574A12.006 12.006 0 0110 1c2.404 0 4.67.712 6.53 1.926a1.597 1.597 0 011.304 1.574V10c0 4.887-3.23 9.387-8.118 10.792a1.442 1.442 0 01-.432.06c-.144 0-.29-.02-.432-.06C5.23 19.387 2 14.887 2 10V4.9c0-.022.007-.044.022-.06c.014-.016.036-.024.058-.024c.022 0 .044.008.058.024c.015.016.022.038.022.06zM10 3a1 1 0 011 1v4a1 1 0 11-2 0V4a1 1 0 011-1zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <div className="text-left font-sans">
            <div className="font-bold uppercase tracking-wider text-purple-300">Secure & Encrypted</div>
            <div>Your payment details and data are safe with us</div>
          </div>
        </div>
      </div>
    </div>
  );
}
