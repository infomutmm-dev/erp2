/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Building2, Eye, EyeOff, Lock, Mail, ShieldAlert, ArrowRight, UserCheck, Sparkles, Languages } from 'lucide-react';
import { DEFAULT_CREDENTIALS } from '../data';
import { translations } from '../translations';

interface LoginProps {
  onLoginSuccess: (accountNumber: string, email: string) => void;
  lang: 'en' | 'ar';
  setLang: (lang: 'en' | 'ar') => void;
}

export default function Login({ onLoginSuccess, lang, setLang }: LoginProps) {
  const [accountNumber, setAccountNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const t = translations[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!accountNumber.trim() || !email.trim() || !password.trim()) {
      setError(t.loginErrorAlertDesc);
      return;
    }

    setLoading(true);

    // Simulate network authentication delay for premium enterprise UX
    setTimeout(() => {
      onLoginSuccess(accountNumber, email);
      setLoading(false);
    }, 850);
  };

  const handleAutofill = () => {
    setAccountNumber(DEFAULT_CREDENTIALS.accountNumber);
    setEmail(DEFAULT_CREDENTIALS.email);
    setPassword(DEFAULT_CREDENTIALS.password);
    setError(null);
  };

  return (
    <div 
      id="login-container" 
      dir={lang === 'ar' ? 'rtl' : 'ltr'} 
      className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 font-sans transition-all duration-300 relative"
    >
      {/* Floating Eye-Friendly Language Switcher */}
      <div className="absolute top-6 end-6 z-30">
        <div className="bg-white/95 backdrop-blur-sm border border-slate-200/80 shadow-sm rounded-full p-1 flex gap-1 items-center">
          <Languages className="w-4 h-4 text-slate-400 ms-2.5" />
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
              lang === 'en' 
                ? 'bg-teal-600 text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLang('ar')}
            className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
              lang === 'ar' 
                ? 'bg-teal-600 text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            العربية
          </button>
        </div>
      </div>

      <div 
        id="login-card-wrapper" 
        className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 grid md:grid-cols-12 min-h-[600px]"
      >
        {/* Left Side: Dynamic Branding Panel */}
        <div 
          id="branding-panel" 
          className="md:col-span-5 bg-gradient-to-br from-teal-800 via-teal-900 to-slate-900 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden"
        >
          {/* Ambient background glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="bg-teal-500/15 p-2.5 rounded-2xl border border-teal-400/20">
                <Building2 className="w-6 h-6 text-teal-300" />
              </div>
              <div>
                <span className="font-semibold tracking-wider text-xs uppercase text-teal-300/80">{t.portalTitle}</span>
                <h1 className="text-xl font-bold tracking-tight text-white">{t.erpTitle}</h1>
              </div>
            </div>
          </div>

          {/* Central message */}
          <div className="relative z-10 my-12 md:my-0">
            <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-400/20 px-3 py-1.5 rounded-full text-xs font-medium text-teal-200 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Core Operational Engine</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight mb-4">
              {t.tagline} <br />
              <span className="text-teal-300">{t.taglineHighlight}</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              {t.desc}
            </p>
          </div>

          {/* Footer stats */}
          <div className="relative z-10 pt-4 border-t border-teal-800/60 flex items-center justify-between text-xs text-teal-300/70">
            <span>{t.serverStatus}: <strong className="text-teal-400">{t.optimal}</strong></span>
            <span>v4.22.6</span>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div id="form-panel" className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight mb-1">
              {t.welcomeBack}
            </h3>
            <p className="text-sm text-slate-500 mb-8">
              {t.loginSub}
            </p>

            {error && (
              <div id="login-error-alert" className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 text-rose-800 text-xs">
                <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0 text-rose-600" />
                <div>
                  <span className="font-semibold">{t.loginErrorAlertTitle}</span>
                  <p className="mt-0.5 text-rose-700/90">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Account Number Input */}
              <div className="space-y-1.5">
                <label htmlFor="account-number" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  {t.fieldAccount}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none">
                    <Building2 className="h-4.5 w-4.5 text-slate-400" />
                  </div>
                  <input
                    id="account-number"
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder={t.fieldAccountPlaceholder}
                    className="block w-full ps-10.5 pe-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all text-start"
                  />
                </div>
              </div>

              {/* Email Address Input */}
              <div className="space-y-1.5">
                <label htmlFor="email-address" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  {t.fieldEmail}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none">
                    <Mail className="h-4.5 w-4.5 text-slate-400" />
                  </div>
                  <input
                    id="email-address"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.fieldEmailPlaceholder}
                    className="block w-full ps-10.5 pe-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all text-start"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    {t.fieldPassword}
                  </label>
                  <a href="#reset" onClick={(e) => { e.preventDefault(); alert('Please use the quick-fill credentials below to sign in instantly.'); }} className="text-xs text-teal-600 font-medium hover:underline">
                    {t.forgotKey}
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4.5 w-4.5 text-slate-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.fieldPasswordPlaceholder}
                    className="block w-full ps-10.5 pe-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all text-start"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 end-0 pe-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                id="login-submit-button"
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-xl font-medium text-sm transition-all shadow-sm focus:outline-none focus:ring-4 focus:ring-teal-500/20 disabled:opacity-75 cursor-pointer mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{t.authButton}</span>
                    <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>
            </form>

            {/* Quick autofill helper widget */}
            <div 
              id="autofill-helper" 
              className="mt-8 p-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>{t.demoCredentials}</span>
                </div>
                <button
                  onClick={handleAutofill}
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  {t.quickFill}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-slate-600 font-mono">
                <div>
                  <span className="text-slate-400 font-sans block text-[10px] uppercase font-bold tracking-wider">{t.fieldAccount}</span>
                  {DEFAULT_CREDENTIALS.accountNumber}
                </div>
                <div>
                  <span className="text-slate-400 font-sans block text-[10px] uppercase font-bold tracking-wider">{t.fieldEmail}</span>
                  {DEFAULT_CREDENTIALS.email}
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 font-sans block text-[10px] uppercase font-bold tracking-wider">{t.fieldPassword}</span>
                  {DEFAULT_CREDENTIALS.password}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
