/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { User, ERPItem } from './types';
import { INITIAL_ERP_ITEMS } from './data';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import { Menu, X } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('nexus_erp_authenticated') === 'true';
  });

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('nexus_erp_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [items, setItems] = useState<ERPItem[]>(() => {
    const savedItems = localStorage.getItem('nexus_erp_items');
    if (savedItems) {
      try {
        return JSON.parse(savedItems);
      } catch (e) {
        return INITIAL_ERP_ITEMS;
      }
    }
    return INITIAL_ERP_ITEMS;
  });

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Internationalization language state
  const [lang, setLang] = useState<'en' | 'ar'>(() => {
    return (localStorage.getItem('nexus_erp_lang') as 'en' | 'ar') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('nexus_erp_lang', lang);
  }, [lang]);

  // Sync items to localStorage for persistent state tracking
  useEffect(() => {
    localStorage.setItem('nexus_erp_items', JSON.stringify(items));
  }, [items]);

  const handleLoginSuccess = (accountNumber: string, email: string) => {
    const activeSessionUser: User = {
      accountNumber,
      email,
      name: email.split('@')[0].split('.').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' '),
      role: 'Authorized Console Operator',
      department: 'Logistics & Systems',
    };
    
    setUser(activeSessionUser);
    setIsAuthenticated(true);
    localStorage.setItem('nexus_erp_authenticated', 'true');
    localStorage.setItem('nexus_erp_user', JSON.stringify(activeSessionUser));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('nexus_erp_authenticated');
    localStorage.removeItem('nexus_erp_user');
    setActiveTab('overview');
  };

  if (!isAuthenticated || !user) {
    return <Login onLoginSuccess={handleLoginSuccess} lang={lang} setLang={setLang} />;
  }

  return (
    <div 
      id="erp-app-shell" 
      dir={lang === 'ar' ? 'rtl' : 'ltr'} 
      className="flex min-h-screen bg-slate-50 relative"
    >
      
      {/* Desktop Sidebar Layout */}
      <div id="desktop-sidebar-container" className="hidden md:flex">
        <Sidebar 
          user={user} 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsMobileSidebarOpen(false);
          }} 
          onLogout={handleLogout} 
          lang={lang}
        />
      </div>

      {/* Mobile Drawer Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          id="mobile-sidebar-overlay" 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 md:hidden animate-in fade-in duration-150"
          onClick={() => setIsMobileSidebarOpen(false)}
        >
          <div 
            id="mobile-sidebar-wrapper" 
            className="w-68 h-full bg-slate-900 relative flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button for mobile drawer */}
            <button 
              onClick={() => setIsMobileSidebarOpen(false)}
              className={`absolute top-5 p-1 bg-slate-800 text-slate-300 rounded-lg border border-slate-700/60 cursor-pointer ${
                lang === 'ar' ? 'left-4' : 'right-4'
              }`}
            >
              <X className="w-4.5 h-4.5" />
            </button>
            
            <Sidebar 
              user={user} 
              activeTab={activeTab} 
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setIsMobileSidebarOpen(false);
              }} 
              onLogout={handleLogout} 
              lang={lang}
            />
          </div>
        </div>
      )}

      {/* Main Application Segment Container */}
      <div id="main-segment-container" className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Header top-strip for toggling menu drawer */}
        <div id="mobile-top-strip" className="md:hidden flex items-center justify-between px-6 py-3.5 bg-white border-b border-slate-100 z-10 sticky top-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">
              {lang === 'ar' ? 'نظام نكسس' : 'Nexus ERP'}
            </span>
          </div>
          <button 
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-1.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg flex items-center gap-1.5 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Menu className="w-4 h-4 text-slate-600" />
            <span>{lang === 'ar' ? 'لوحة التحكم' : 'Operational Console'}</span>
          </button>
        </div>

        <Dashboard 
          user={user} 
          items={items} 
          setItems={setItems} 
          onLogout={handleLogout} 
          activeTab={activeTab} 
          lang={lang}
          setLang={setLang}
        />
      </div>

    </div>
  );
}
