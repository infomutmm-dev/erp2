/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Bell, 
  Database, 
  RefreshCw,
  Trash2,
  X,
  AlertTriangle,
  ShieldAlert,
  Layers
} from 'lucide-react';
import { User, ERPItem, ActivityLog } from '../types';
import Widgets from './Widgets';
import { INITIAL_ACTIVITY_LOGS } from '../data';
import { translations } from '../translations';

interface DashboardProps {
  user: User;
  items: ERPItem[];
  setItems: React.Dispatch<React.SetStateAction<ERPItem[]>>;
  onLogout: () => void;
  activeTab: string;
  lang: 'en' | 'ar';
  setLang: (lang: 'en' | 'ar') => void;
}

export default function Dashboard({ user, items, setItems, onLogout, activeTab, lang, setLang }: DashboardProps) {
  const t = translations[lang];

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modals & form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSku, setNewSku] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<'Electronics' | 'Hardware' | 'Office Supplies' | 'Raw Materials' | 'Software Licenses'>('Electronics');
  const [newStock, setNewStock] = useState('10');
  const [newMinStock, setNewMinStock] = useState('15');
  const [newPrice, setNewPrice] = useState('99.99');

  // Logs state
  const [logs, setLogs] = useState<ActivityLog[]>(INITIAL_ACTIVITY_LOGS);
  const [logTypeFilter, setLogTypeFilter] = useState('All');

  // Notification states
  const [notifications, setNotifications] = useState([
    { id: 1, text: lang === 'ar' ? 'تنبيه مستوى المخزون: AL-T6061 نفد حالياً من المخازن.' : 'Stock level alert: AL-T6061 is currently out of stock.', unread: true },
    { id: 2, text: lang === 'ar' ? 'تم تحديث مخزون لوحة الترانزستور بنجاح بواسطة المشغل.' : 'Transistor board inventory successfully updated by Operator.', unread: false },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Settings state
  const [lowStockThreshold, setLowStockThreshold] = useState(25);
  const [currencySymbol, setCurrencySymbol] = useState('USD');
  const [autoReorderEnabled, setAutoReorderEnabled] = useState(true);

  // Add items handler
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSku.trim() || !newName.trim()) return;

    const stockNum = parseInt(newStock) || 0;
    const minStockNum = parseInt(newMinStock) || 0;
    const priceNum = parseFloat(newPrice) || 0.0;

    let computedStatus: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
    if (stockNum === 0) computedStatus = 'Out of Stock';
    else if (stockNum <= minStockNum) computedStatus = 'Low Stock';

    const newItem: ERPItem = {
      id: String(Date.now()),
      sku: newSku.toUpperCase().trim(),
      name: newName.trim(),
      category: newCategory,
      stock: stockNum,
      minStockLevel: minStockNum,
      unitPrice: priceNum,
      status: computedStatus,
      lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setItems([newItem, ...items]);

    // Record system log
    const newLog: ActivityLog = {
      id: String(Date.now() + 1),
      timestamp: lang === 'ar' ? 'الآن' : 'Just now',
      user: user.name,
      action: lang === 'ar' ? 'تهيئة أصل' : 'Item Provisioned',
      details: lang === 'ar' ? `تم إضافة عنصر مخزون جديد: ${newItem.name} (${newItem.sku}).` : `Added new ERP inventory item ${newItem.name} (${newItem.sku}).`,
      type: 'success',
    };
    setLogs([newLog, ...logs]);

    // Reset Form
    setNewSku('');
    setNewName('');
    setNewStock('10');
    setNewMinStock('15');
    setNewPrice('99.99');
    setIsAddModalOpen(false);
  };

  // Stock alteration handler
  const adjustStock = (id: string, amount: number) => {
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          const nextStock = Math.max(0, item.stock + amount);
          let nextStatus: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
          if (nextStock === 0) nextStatus = 'Out of Stock';
          else if (nextStock <= item.minStockLevel) nextStatus = 'Low Stock';

          // Log adjusting activity
          const adjustLog: ActivityLog = {
            id: String(Date.now()),
            timestamp: lang === 'ar' ? 'الآن' : 'Just now',
            user: user.name,
            action: lang === 'ar' ? 'تعديل المخزون' : 'Stock Adjustment',
            details: lang === 'ar' 
              ? `تم تحديث المخزون يدوياً لـ ${item.sku} من ${item.stock} إلى ${nextStock}.`
              : `Manually updated stock for ${item.sku} from ${item.stock} to ${nextStock}.`,
            type: nextStatus === 'Out of Stock' ? 'error' : (nextStatus === 'Low Stock' ? 'warning' : 'success'),
          };
          setLogs(prevLogs => [adjustLog, ...prevLogs]);

          return {
            ...item,
            stock: nextStock,
            status: nextStatus,
            lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
          };
        }
        return item;
      })
    );
  };

  // Delete item handler
  const deleteItem = (id: string, sku: string, name: string) => {
    const confirmMsg = lang === 'ar' 
      ? `هل أنت متأكد من رغبتك في إيقاف ${name} (${sku}) من المخزون؟`
      : `Are you sure you want to retire ${name} (${sku}) from inventory?`;
    if (confirm(confirmMsg)) {
      setItems(prevItems => prevItems.filter(item => item.id !== id));
      
      const deleteLog: ActivityLog = {
        id: String(Date.now()),
        timestamp: lang === 'ar' ? 'الآن' : 'Just now',
        user: user.name,
        action: lang === 'ar' ? 'إيقاف منتج' : 'Item Retired',
        details: lang === 'ar' 
          ? `تم إيقاف العنصر ${sku} بشكل دائم من القوائم.`
          : `Permanently retired item ${sku} from enterprise listing.`,
        type: 'warning',
      };
      setLogs(prevLogs => [deleteLog, ...prevLogs]);
    }
  };

  // Restock All Depleted / Low Stock items helper
  const handleRestockAllAlerts = () => {
    let count = 0;
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.stock <= item.minStockLevel) {
          count++;
          const newStockQty = item.minStockLevel * 2; // Restock to double the min safety level
          return {
            ...item,
            stock: newStockQty,
            status: 'In Stock',
            lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
          };
        }
        return item;
      })
    );

    if (count > 0) {
      const restockLog: ActivityLog = {
        id: String(Date.now()),
        timestamp: lang === 'ar' ? 'الآن' : 'Just now',
        user: lang === 'ar' ? 'مجدول النظام الآلي' : 'System Automated Scheduler',
        action: lang === 'ar' ? 'إعادة تموين مجمعة' : 'Bulk Restocking',
        details: lang === 'ar' 
          ? `تمت إعادة تموين ${count} من العناصر المنبهة بنجاح إلى الحدود الآمنة.`
          : `Successfully restocked ${count} flagged alert items to safe threshold levels.`,
        type: 'success',
      };
      setLogs(prevLogs => [restockLog, ...prevLogs]);
      alert(lang === 'ar' ? `تم تفعيل تموين سريع لـ ${count} عناصر بنجاح.` : `Successfully triggered express restock for ${count} items.`);
    } else {
      alert(lang === 'ar' ? 'جميع العناصر حالياً في مستويات آمنة.' : 'All items are currently at safe operating stock thresholds.');
    }
  };

  // Filter lists based on search and selected categories
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredLogs = logs.filter(log => {
    if (logTypeFilter === 'All') return true;
    return log.type === logTypeFilter;
  });

  const getCategoryTranslation = (cat: string) => {
    switch (cat) {
      case 'Electronics': return t.catElectronics;
      case 'Hardware': return t.catHardware;
      case 'Office Supplies': return t.catOfficeSupplies;
      case 'Raw Materials': return t.catRawMaterials;
      case 'Software Licenses': return t.catSoftwareLicenses;
      default: return cat;
    }
  };

  const getStatusTranslation = (st: string) => {
    switch (st) {
      case 'In Stock': return t.statusInStock;
      case 'Low Stock': return t.statusLowStock;
      case 'Out of Stock': return t.statusOutOfStock;
      default: return st;
    }
  };

  return (
    <div id="dashboard-wrapper" dir={lang === 'ar' ? 'rtl' : 'ltr'} className="flex-1 bg-slate-50 min-h-screen font-sans flex flex-col">
      
      {/* Upper Global Header */}
      <header className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-20">
        
        {/* Module Title / Date */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">{t.liveConsole}</span>
            <span className="text-xs text-slate-400 font-mono">APP_URL Connected</span>
          </div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight mt-1 capitalize text-start">
            {activeTab === 'overview' && t.overviewHeader}
            {activeTab === 'inventory' && t.inventoryHeader}
            {activeTab === 'logs' && t.logsHeader}
            {activeTab === 'settings' && t.settingsHeader}
          </h2>
        </div>

        {/* Search, Notifications and Quick Add Bar */}
        <div className="flex items-center gap-4">
          
          {/* Universal Search (Visible in inventory and overview) */}
          {(activeTab === 'overview' || activeTab === 'inventory') && (
            <div className="relative hidden md:block">
              <Search className="absolute inset-y-0 start-3 h-4 w-4 text-slate-400 my-auto" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="ps-9 pe-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all w-60 text-start"
              />
            </div>
          )}

          {/* Language Switcher in Header */}
          <div className="bg-slate-100/80 p-1 rounded-xl flex gap-1 items-center">
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                lang === 'en' 
                  ? 'bg-teal-600 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('ar')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                lang === 'ar' 
                  ? 'bg-teal-600 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              AR
            </button>
          </div>

          {/* Notifications Button */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                // Mark all read
                if (!showNotifications) {
                  setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
                }
              }}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {notifications.some(n => n.unread) && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute end-0 mt-2.5 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl z-30 py-3 overflow-hidden">
                <div className="px-4 pb-2 border-b border-slate-50 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{t.alertsTitle}</span>
                  <span className="text-[10px] text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-md font-semibold">{lang === 'ar' ? 'مباشر' : 'Live'}</span>
                </div>
                <div className="divide-y divide-slate-50 max-h-60 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-3.5 hover:bg-slate-50 transition-colors text-start">
                      <p className="text-xs text-slate-600 leading-relaxed">{notif.text}</p>
                      <span className="text-[9px] text-slate-400 block mt-1 font-mono">{lang === 'ar' ? 'نظام تلقائي' : 'System Automated'} • {lang === 'ar' ? 'الآن' : 'Just now'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Button */}
          {activeTab === 'inventory' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.provisionButton}</span>
            </button>
          )}

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Quick alert reminder if there is low stock */}
            {items.some(item => item.stock <= item.minStockLevel) && (
              <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3 text-start">
                  <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl border border-amber-200">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-800">{t.supplyChainWarning}</h4>
                    <p className="text-[11px] text-amber-700/85 mt-0.5">
                      {t.supplyChainWarningDesc}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRestockAllAlerts}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  {t.restockAllButton}
                </button>
              </div>
            )}

            {/* Statistical Widgets Row */}
            <Widgets items={items} lang={lang} />

            {/* Quick overview of latest activity trail & alerts summary */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Activity Logs on Main screen */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                  <div className="space-y-0.5 text-start">
                    <h3 className="text-sm font-bold text-slate-800">{t.liveStreamTitle}</h3>
                    <p className="text-xs text-slate-500">{t.liveStreamDesc}</p>
                  </div>
                  <button 
                    onClick={() => setLogs(INITIAL_ACTIVITY_LOGS)} 
                    className="text-xs text-slate-500 hover:text-slate-700 font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    {t.resetLogState}
                  </button>
                </div>

                <div className="space-y-3">
                  {logs.slice(0, 4).map((log) => {
                    const colors = {
                      info: 'bg-indigo-50 text-indigo-700 border-indigo-100',
                      success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                      warning: 'bg-amber-50 text-amber-700 border-amber-100',
                      error: 'bg-rose-50 text-rose-700 border-rose-100',
                    };

                    const logTypeTranslation = (tp: string) => {
                      if (tp === 'success') return lang === 'ar' ? 'نجاح' : 'success';
                      if (tp === 'warning') return lang === 'ar' ? 'تحذير' : 'warning';
                      if (tp === 'error') return lang === 'ar' ? 'خطأ' : 'error';
                      return lang === 'ar' ? 'معلومات' : 'info';
                    };

                    const logActionTranslation = (act: string) => {
                      if (act === 'Item Provisioned') return lang === 'ar' ? 'تهيئة أصل' : 'Item Provisioned';
                      if (act === 'Stock Adjustment') return lang === 'ar' ? 'تعديل مخزون' : 'Stock Adjustment';
                      if (act === 'Item Retired') return lang === 'ar' ? 'إيقاف منتج' : 'Item Retired';
                      if (act === 'Bulk Restocking') return lang === 'ar' ? 'تموين مجمّع' : 'Bulk Restocking';
                      return act;
                    };

                    return (
                      <div key={log.id} className="p-3 rounded-xl border border-slate-50 bg-slate-50/20 hover:bg-slate-50/40 transition-colors flex items-start gap-3 text-xs text-start">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border uppercase shrink-0 ${colors[log.type]}`}>
                          {logTypeTranslation(log.type)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-4">
                            <span className="font-bold text-slate-700 truncate">{logActionTranslation(log.action)}</span>
                            <span className="text-[10px] text-slate-400 font-mono shrink-0">{log.timestamp}</span>
                          </div>
                          <p className="text-slate-500 mt-1 leading-relaxed">{log.details}</p>
                          <span className="text-[10px] text-slate-400 mt-0.5 block font-medium">{t.loggedBy} {log.user}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick info panel / active operator session info */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950 text-white rounded-2xl p-6 shadow-sm lg:col-span-4 flex flex-col justify-between text-start">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-teal-500/10 border border-teal-400/20 px-2.5 py-1 rounded-full text-[10px] font-bold text-teal-300">
                    <Database className="w-3.5 h-3.5 text-teal-400" />
                    <span>{lang === 'ar' ? 'حالة قاعدة البيانات' : 'Database Status'}</span>
                  </div>
                  <h3 className="text-base font-extrabold tracking-tight mt-3 text-white">{lang === 'ar' ? 'لوحة تحكم ERP نشطة' : 'ERP Console Active'}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-2">
                    {lang === 'ar' ? 'نظام التشغيل مسجل الدخول بموجب حساب محطة مؤمن ومعتمد. تجري مزامنة البيانات النشطة بنجاح.' : 'Operating system logged in under securely verified terminal account. Active data synchronization is running on local cache storage successfully.'}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-800/60 mt-6 space-y-3.5 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>{t.operatorLabel}</span>
                    <strong className="text-white font-medium">{user.name}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>{t.accountKeyLabel}</span>
                    <strong className="text-white font-mono font-medium">{user.accountNumber}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>{t.departmentLabel}</span>
                    <strong className="text-teal-400 font-medium">{lang === 'ar' ? 'تجهيزات المستودعات' : user.department}</strong>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: INVENTORY MANAGER REGISTRY */}
        {activeTab === 'inventory' && (
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden space-y-6">
            
            {/* Table Filters Header */}
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-50/40">
              
              <div className="flex items-center gap-3 text-start">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">{lang === 'ar' ? 'التصنيف' : 'Categorization'}</span>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Electronics', 'Hardware', 'Raw Materials', 'Office Supplies', 'Software Licenses'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        categoryFilter === cat 
                          ? 'bg-teal-600 text-white shadow-sm' 
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {cat === 'All' ? (lang === 'ar' ? 'الكل' : 'All') : getCategoryTranslation(cat)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 justify-start">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">{lang === 'ar' ? 'حالة التوريد' : 'Supply Status'}</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all cursor-pointer"
                >
                  <option value="All">{lang === 'ar' ? 'كل الحالات' : 'All Statuses'}</option>
                  <option value="In Stock">{t.statusInStock}</option>
                  <option value="Low Stock">{t.statusLowStock}</option>
                  <option value="Out of Stock">{t.statusOutOfStock}</option>
                </select>
              </div>

            </div>

            {/* Main Registry Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-start text-xs">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="px-6 py-4 text-start">{t.colSku}</th>
                    <th className="px-6 py-4 text-start">{t.colCategory}</th>
                    <th className="px-6 py-4 text-start">{t.colPrice}</th>
                    <th className="px-6 py-4 text-center">{t.colStock}</th>
                    <th className="px-6 py-4 text-start">{t.colStatus}</th>
                    <th className="px-6 py-4 text-start">{t.colRevision}</th>
                    <th className="px-6 py-4 text-end">{t.colActions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => {
                      const isLow = item.stock <= item.minStockLevel && item.stock > 0;
                      const isOut = item.stock === 0;

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                          
                          {/* Sku and Name */}
                          <td className="px-6 py-4 text-start">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800 text-sm">{item.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono tracking-wider mt-0.5">{item.sku}</span>
                            </div>
                          </td>

                          {/* Category Tag */}
                          <td className="px-6 py-4 text-start">
                            <span className="font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                              {getCategoryTranslation(item.category)}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="px-6 py-4 font-mono font-bold text-slate-700 text-sm text-start">
                            ${item.unitPrice.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', { minimumFractionDigits: 2 })}
                          </td>

                          {/* Stock adjusting widget */}
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-3 w-32 mx-auto">
                              <button
                                onClick={() => adjustStock(item.id, -1)}
                                className="w-7 h-7 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-bold flex items-center justify-center transition-colors cursor-pointer text-sm"
                              >
                                -
                              </button>
                              <div className="text-center font-bold font-mono text-sm min-w-[2.5rem] text-slate-800">
                                {item.stock.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                                <span className="block text-[9px] text-slate-400 font-sans font-semibold">{t.minLabel} {item.minStockLevel.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span>
                              </div>
                              <button
                                onClick={() => adjustStock(item.id, 5)}
                                className="w-7 h-7 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-bold flex items-center justify-center transition-colors cursor-pointer text-sm"
                                title="+5 Units"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          {/* Status Tag */}
                          <td className="px-6 py-4 text-start">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase ${
                              isOut 
                                ? 'bg-rose-50 text-rose-700 border-rose-100' 
                                : isLow 
                                  ? 'bg-amber-50 text-amber-700 border-amber-100' 
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isOut ? 'bg-rose-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                              {getStatusTranslation(item.status)}
                            </span>
                          </td>

                          {/* Revision date */}
                          <td className="px-6 py-4 font-mono text-slate-400 text-[10px] text-start">
                            {item.lastUpdated}
                          </td>

                          {/* Deletion actions */}
                          <td className="px-6 py-4 text-end">
                            <button
                              onClick={() => deleteItem(item.id, item.sku, item.name)}
                              className="p-1.5 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-100 text-slate-400 rounded-lg transition-colors cursor-pointer"
                              title="Retire Item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>

                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-xs font-semibold">
                        {t.tableEmpty}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Quick table diagnostics bar */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between text-[11px] text-slate-400 font-semibold px-6">
              <span>{t.tableSummary.replace('{filtered}', String(filteredItems.length)).replace('{total}', String(items.length))}</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full" /> {t.statusInStock} {items.filter(i => i.stock > i.minStockLevel).length.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-500 rounded-full" /> {t.statusLowStock} {items.filter(i => i.stock > 0 && i.stock <= i.minStockLevel).length.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-rose-500 rounded-full" /> {t.statusOutOfStock} {items.filter(i => i.stock === 0).length.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: SYSTEM AUDIT TRAIL LOGS */}
        {activeTab === 'logs' && (
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-6">
            
            {/* Logs Filter options */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-4">
              <div className="space-y-1 text-start">
                <h3 className="text-sm font-bold text-slate-800">{t.logsHeader}</h3>
                <p className="text-xs text-slate-500">{lang === 'ar' ? 'سجلات عمليات وتحديثات غير قابلة للتغيير محفوظة في ذاكرة الجلسة.' : 'Immutable operations, updates, and access logs recorded in secure session buffer.'}</p>
              </div>

              <div className="flex items-center gap-3 justify-start">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">{lang === 'ar' ? 'نوع السجل' : 'Log Type Filter'}</span>
                <select
                  value={logTypeFilter}
                  onChange={(e) => setLogTypeFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-600 px-3 py-2 rounded-xl text-xs font-bold focus:outline-none focus:border-teal-500 transition-all cursor-pointer"
                >
                  <option value="All">{lang === 'ar' ? 'جميع مستويات الخطورة' : 'All Severity Levels'}</option>
                  <option value="info">{lang === 'ar' ? 'سجلات المعلومات' : 'Info Logs'}</option>
                  <option value="success">{lang === 'ar' ? 'سجلات النجاح' : 'Success Logs'}</option>
                  <option value="warning">{lang === 'ar' ? 'سجلات التحذير' : 'Warning Logs'}</option>
                  <option value="error">{lang === 'ar' ? 'سجلات الأخطاء' : 'Error Logs'}</option>
                </select>
              </div>
            </div>

            {/* List of Logs */}
            <div className="space-y-3">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => {
                  const colors = {
                    info: 'bg-indigo-50 text-indigo-700 border-indigo-100',
                    success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                    warning: 'bg-amber-50 text-amber-700 border-amber-100',
                    error: 'bg-rose-50 text-rose-700 border-rose-100',
                  };

                  const logTypeTranslation = (tp: string) => {
                    if (tp === 'success') return lang === 'ar' ? 'نجاح' : 'success';
                    if (tp === 'warning') return lang === 'ar' ? 'تحذير' : 'warning';
                    if (tp === 'error') return lang === 'ar' ? 'خطأ' : 'error';
                    return lang === 'ar' ? 'معلومات' : 'info';
                  };

                  const logActionTranslation = (act: string) => {
                    if (act === 'Item Provisioned') return lang === 'ar' ? 'تهيئة أصل' : 'Item Provisioned';
                    if (act === 'Stock Adjustment') return lang === 'ar' ? 'تعديل مخزون' : 'Stock Adjustment';
                    if (act === 'Item Retired') return lang === 'ar' ? 'إيقاف منتج' : 'Item Retired';
                    if (act === 'Bulk Restocking') return lang === 'ar' ? 'تموين مجمّع' : 'Bulk Restocking';
                    return act;
                  };

                  return (
                    <div 
                      key={log.id} 
                      className="p-4 rounded-xl border border-slate-100 bg-slate-50/10 hover:bg-slate-50/30 transition-colors flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs text-start"
                    >
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border uppercase shrink-0 ${colors[log.type]}`}>
                        {logTypeTranslation(log.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4">
                          <span className="font-bold text-slate-800 text-sm">{logActionTranslation(log.action)}</span>
                          <span className="text-xs text-slate-400 font-mono">{log.timestamp}</span>
                        </div>
                        <p className="text-slate-500 mt-1 leading-relaxed">{log.details}</p>
                      </div>
                      <div className="text-[11px] text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 shrink-0 font-medium font-mono text-end">
                        {lang === 'ar' ? 'المرجع:' : 'Ref:'} {log.id} <br />
                        <span className="text-[10px] text-slate-500 font-sans">{log.user}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs font-semibold">
                  {t.emptyLogsMessage}
                </div>
              )}
            </div>

            {/* Log clearing helper */}
            <div className="flex justify-between items-center text-xs text-slate-400 font-semibold border-t border-slate-50 pt-4">
              <span>{t.clearLogTitle}</span>
              <button 
                onClick={() => {
                  setLogs([]);
                  alert(lang === 'ar' ? 'تم مسح سجلات الجلسة للأمان.' : 'System logs successfully flushed for active session security.');
                }}
                className="text-rose-600 hover:text-rose-700 font-bold hover:underline cursor-pointer"
              >
                {t.clearLogBtn}
              </button>
            </div>

          </div>
        )}

        {/* TAB 4: SYSTEM SETTINGS */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* System Parameters Panel */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 md:col-span-8 space-y-6 text-start">
              <div className="border-b border-slate-50 pb-4">
                <h3 className="text-sm font-bold text-slate-800">{t.thresholdTitle}</h3>
                <p className="text-xs text-slate-500">{t.thresholdDesc}</p>
              </div>

              <div className="space-y-5">
                
                {/* Parameter 1: Low Stock Threshold */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t.thresholdLabel}
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={lowStockThreshold}
                      onChange={(e) => setLowStockThreshold(parseInt(e.target.value))}
                      className="flex-1 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-600"
                    />
                    <span className="font-mono font-bold bg-slate-100 px-3 py-1.5 rounded-lg text-xs text-slate-700 w-12 text-center">
                      {lowStockThreshold.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    {t.thresholdLimitDesc}
                  </p>
                </div>

                {/* Parameter 2: Currency */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {t.reportingCurrency}
                    </label>
                    <select
                      value={currencySymbol}
                      onChange={(e) => setCurrencySymbol(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-600 px-3 py-2.5 rounded-xl text-xs font-bold focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all cursor-pointer"
                    >
                      <option value="USD">{lang === 'ar' ? 'دولار أمريكي (USD)' : 'United States Dollar (USD)'}</option>
                      <option value="EUR">{lang === 'ar' ? 'يورو (EUR)' : 'Euro (EUR)'}</option>
                      <option value="GBP">{lang === 'ar' ? 'جنيه إسترليني (GBP)' : 'Pound Sterling (GBP)'}</option>
                      <option value="JPY">{lang === 'ar' ? 'ين ياباني (JPY)' : 'Japanese Yen (JPY)'}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {t.autoReorderLabel}
                    </label>
                    <div className="flex items-center h-[42px] px-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <input
                        id="auto-reorder-checkbox"
                        type="checkbox"
                        checked={autoReorderEnabled}
                        onChange={(e) => setAutoReorderEnabled(e.target.checked)}
                        className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500 cursor-pointer"
                      />
                      <label htmlFor="auto-reorder-checkbox" className="ms-2.5 text-xs font-bold text-slate-600 cursor-pointer">
                        {lang === 'ar' ? 'تفعيل المشغل التلقائي' : 'Enable Auto Trigger'}
                      </label>
                    </div>
                  </div>
                </div>

              </div>

              <div className="border-t border-slate-50 pt-5">
                <button 
                  onClick={() => alert(lang === 'ar' ? 'تم تحديث بارامترات التكوين بنجاح.' : 'Operational parameter configurations updated and synchronized.')}
                  className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  {t.saveConfigBtn}
                </button>
              </div>
            </div>

            {/* System Diagnostics panel */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 md:col-span-4 space-y-6 flex flex-col justify-between text-start">
              <div className="space-y-4">
                <div className="border-b border-slate-50 pb-3">
                  <h3 className="text-sm font-bold text-slate-800">{t.diagnosticsTitle}</h3>
                  <p className="text-xs text-slate-500">{t.diagnosticsDesc}</p>
                </div>

                <div className="space-y-3 font-mono text-[11px] text-slate-500">
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                    <span>{t.activeGateway}</span>
                    <strong className="text-slate-800">Cloud Run Ingress</strong>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                    <span>{t.dbLatency}</span>
                    <strong className="text-emerald-600">0.8ms (Local Cache)</strong>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                    <span>{t.sslCertificate}</span>
                    <strong className="text-emerald-600">AES_256_GCM</strong>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                    <span>{t.uptimeTracker}</span>
                    <strong className="text-slate-800">100.00%</strong>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2.5 text-xs text-slate-500">
                <Database className="w-4.5 h-4.5 text-teal-600 shrink-0" />
                <span>{t.encryptionDisclaimer}</span>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* MODAL: Provision New Stock Item */}
      {isAddModalOpen && (
        <div id="add-item-modal" className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-lg w-full overflow-hidden text-start">
            
            <div className="bg-gradient-to-r from-teal-800 to-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-teal-400" />
                <span className="font-bold text-xs tracking-wide uppercase">{t.modalTitle}</span>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="p-6 space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* SKU Code */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t.modalSku}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EL-TX850"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all font-mono"
                  />
                </div>

                {/* Category Selection */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t.modalCategory}
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all font-semibold cursor-pointer"
                  >
                    <option value="Electronics">{t.catElectronics}</option>
                    <option value="Hardware">{t.catHardware}</option>
                    <option value="Office Supplies">{t.catOfficeSupplies}</option>
                    <option value="Raw Materials">{t.catRawMaterials}</option>
                    <option value="Software Licenses">{t.catSoftwareLicenses}</option>
                  </select>
                </div>
              </div>

              {/* Item Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t.modalName}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'ar' ? 'مثل: كابل ألياف ضوئية مزدوج الاتجاه' : 'e.g. Fiber Optic Cable Duplex'}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Stock Quantity */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t.modalStock}
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all font-mono"
                  />
                </div>

                {/* Min Stock level */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t.modalMinAlert}
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newMinStock}
                    onChange={(e) => setNewMinStock(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all font-mono"
                  />
                </div>

                {/* Unit price */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t.modalPrice}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  {t.modalCancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  {t.modalConfirm}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
