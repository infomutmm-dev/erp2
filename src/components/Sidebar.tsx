/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  LayoutDashboard, 
  Package, 
  History, 
  LogOut, 
  Building2, 
  CircleDot, 
  SlidersHorizontal 
} from 'lucide-react';
import { User } from '../types';
import { translations } from '../translations';

interface SidebarProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  lang: 'en' | 'ar';
}

export default function Sidebar({ user, activeTab, setActiveTab, onLogout, lang }: SidebarProps) {
  const t = translations[lang];

  const menuItems = [
    { id: 'overview', name: t.overview, icon: LayoutDashboard },
    { id: 'inventory', name: t.inventory, icon: Package },
    { id: 'logs', name: t.logs, icon: History },
    { id: 'settings', name: t.settings, icon: SlidersHorizontal },
  ];

  return (
    <aside 
      id="erp-sidebar" 
      className="w-68 bg-slate-900 border-e border-slate-800 text-slate-300 flex flex-col justify-between shrink-0 h-screen sticky top-0"
    >
      {/* Top Brand Logo Section */}
      <div className="p-6 border-b border-slate-800 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-teal-500/10 p-2 rounded-xl border border-teal-500/20">
            <Building2 className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide uppercase">{t.erpTitle}</h2>
            <span className="text-[10px] text-teal-400 font-medium font-mono">{lang === 'ar' ? 'لوحة المشغل' : 'OPERATOR CONSOLE'}</span>
          </div>
        </div>

        {/* Console Health status indicator */}
        <div className="bg-slate-850 border border-slate-800 rounded-xl px-3 py-2 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">{t.systemLink}</span>
          <div className="flex items-center gap-1.5">
            <CircleDot className="w-3 h-3 text-emerald-500 fill-emerald-500 animate-pulse" />
            <span className="text-[11px] font-semibold text-emerald-400">{t.secureStatus}</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 px-3 mb-2">
          {t.coreModules}
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer text-start ${
                isActive 
                  ? 'bg-teal-600/90 text-white shadow-sm' 
                  : 'hover:bg-slate-800 hover:text-slate-100 text-slate-400'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-teal-200' : 'text-slate-500'}`} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* User Session Profile & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex flex-col gap-4">
        <div className="flex items-center gap-3 bg-slate-900/55 p-2 rounded-xl border border-slate-800">
          {/* Custom fallback avatar icon with high-contrast colors */}
          <div className="w-10 h-10 rounded-lg bg-teal-800/80 border border-teal-500/30 flex items-center justify-center font-bold text-white text-sm shrink-0">
            {user.name ? user.name.split(' ').map(n => n ? n[0] : 'U').join('') : 'U'}
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-white truncate">{user.name}</div>
            <div className="text-[10px] text-slate-400 truncate">{t.operatorRole}</div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-rose-950/40 hover:text-rose-400 active:bg-rose-950/60 rounded-xl text-xs font-bold transition-all text-slate-400 border border-slate-700/60 cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>{t.terminateSession}</span>
        </button>
      </div>
    </aside>
  );
}
