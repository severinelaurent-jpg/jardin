import React from 'react';
import { 
  Sprout, 
  CloudCheck, 
  CloudOff, 
  LogIn, 
  LogOut, 
  Rocket, 
  LayoutDashboard, 
  Layers, 
  Leaf, 
  CheckSquare, 
  ShoppingBag, 
  BookOpen,
  Sparkles
} from 'lucide-react';
import { useGarden } from '../context/GardenContext';

export type ActiveTab = 'dashboard' | 'plots' | 'plants' | 'tasks' | 'harvests' | 'journal';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenVercelModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenVercelModal
}) => {
  const { user, loginWithGoogle, logout, authLoading, isFirebaseConnected } = useGarden();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'plots', label: 'Parcelles', icon: <Layers className="w-4 h-4" /> },
    { id: 'plants', label: 'Potager & Cultures', icon: <Leaf className="w-4 h-4" /> },
    { id: 'tasks', label: 'Tâches & Arrosages', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'harvests', label: 'Récoltes', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'journal', label: 'Journal de bord', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-emerald-900/95 backdrop-blur border-b border-emerald-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center text-emerald-950 shadow-inner">
              <Sprout className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Mon Jardinier
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-700/60 text-emerald-200 border border-emerald-600/50 font-normal">
                  v1.0
                </span>
              </span>
              <p className="text-xs text-emerald-200/80 hidden sm:block">
                Suivi de potager synchronisé Firebase & prêt pour Vercel
              </p>
            </div>
          </div>

          {/* Action buttons (Vercel + Auth) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Vercel Publication Helper Button */}
            <button
              onClick={onOpenVercelModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 border border-emerald-600/60 transition-colors shadow-sm"
              title="Guide de publication sur Vercel"
            >
              <Rocket className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline">Publier sur</span>
              <span>Vercel</span>
            </button>

            {/* Cloud Sync Status Pill */}
            <div className="hidden lg:flex items-center space-x-1 text-xs px-2.5 py-1 rounded-full bg-emerald-950/50 border border-emerald-700/50">
              {isFirebaseConnected && user ? (
                <>
                  <CloudCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Firebase connecté</span>
                </>
              ) : (
                <>
                  <CloudOff className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-200">Mode Local</span>
                </>
              )}
            </div>

            {/* Auth Button */}
            {authLoading ? (
              <div className="w-8 h-8 rounded-full bg-emerald-800 animate-pulse" />
            ) : user ? (
              <div className="flex items-center space-x-2">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Utilisateur'}
                    className="w-8 h-8 rounded-full border border-emerald-400"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                    {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition"
                  title="Se déconnecter"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-semibold shadow transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Connexion Google</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <nav className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none text-sm pt-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-sm font-semibold'
                    : 'text-emerald-200/90 hover:text-white hover:bg-emerald-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
