import { LogOut, Music, ShieldAlert, User as UserIcon } from "lucide-react";
import { User } from "../types";

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  isAdminView: boolean;
  onToggleAdminView: (isAdmin: boolean) => void;
}

export default function Navbar({
  user,
  onLogout,
  isAdminView,
  onToggleAdminView,
}: NavbarProps) {
  return (
    <nav id="app-navbar" className="bg-[#0b0717]/85 backdrop-blur-md border-b border-purple-900/40 sticky top-0 z-50 px-4 py-3 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Brand */}
        <div 
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => onToggleAdminView(false)}
        >
          <div className="bg-gradient-to-tr from-purple-600 to-pink-500 p-2 rounded-xl shadow-lg shadow-purple-500/20">
            <Music className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-lg md:text-xl text-white tracking-wider bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
              DJ VOCAL ADDA
            </span>
            <div className="text-[10px] text-purple-400/80 font-mono tracking-widest uppercase hidden sm:block">
              Premium Voice Tags
            </div>
          </div>
        </div>

        {/* User Actions */}
        {user ? (
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Admin toggle if user is admin */}
            {user.isAdmin && (
              <button
                id="btn-admin-panel-toggle"
                onClick={() => onToggleAdminView(!isAdminView)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
                  isAdminView
                    ? "bg-pink-600 text-white shadow-lg shadow-pink-500/25"
                    : "bg-purple-950/60 text-purple-300 border border-purple-800/50 hover:bg-purple-900/50"
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>{isAdminView ? "Exit Admin" : "Admin Panel"}</span>
              </button>
            )}

            {/* User badge */}
            <div className="hidden md:flex items-center space-x-2 bg-purple-950/40 border border-purple-900/40 px-3 py-1.5 rounded-lg">
              <UserIcon className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-purple-200 font-medium">
                {user.email}
              </span>
              {user.isAdmin && (
                <span className="bg-pink-500/20 border border-pink-500/30 text-pink-400 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                  Admin
                </span>
              )}
            </div>

            {/* Logout button */}
            <button
              id="btn-logout"
              onClick={onLogout}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs md:text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-purple-400 font-mono animate-pulse">
              ● MIXING LIVE
            </span>
          </div>
        )}
      </div>
    </nav>
  );
}
