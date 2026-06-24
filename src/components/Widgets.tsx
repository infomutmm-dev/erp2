/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ERPItem } from '../types';
import { 
  TrendingUp, 
  AlertTriangle, 
  ShieldAlert, 
  Package, 
  CircleDollarSign, 
  Cpu,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { translations } from '../translations';

interface WidgetsProps {
  items: ERPItem[];
  lang: 'en' | 'ar';
}

export default function Widgets({ items, lang }: WidgetsProps) {
  const t = translations[lang];

  // Real-time calculations from state
  const totalStockItems = items.reduce((sum, item) => sum + item.stock, 0);
  const totalValue = items.reduce((sum, item) => sum + (item.stock * item.unitPrice), 0);
  const lowStockCount = items.filter(item => item.stock > 0 && item.stock <= item.minStockLevel).length;
  const outOfStockCount = items.filter(item => item.stock === 0).length;

  const categoryDistribution = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + (item.stock * item.unitPrice);
    return acc;
  }, {} as Record<string, number>);

  const maxVal = Math.max(...Object.values(categoryDistribution), 1);

  // Soft indicator for efficiency or system health based on stock warning levels
  const healthPercentage = Math.round(
    ((items.length - (lowStockCount * 0.5) - outOfStockCount) / items.length) * 100
  );

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

  return (
    <div id="erp-widgets" className="space-y-6">
      
      {/* 4-Grid Dynamic Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Valuation */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between relative overflow-hidden group">
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">{t.widgetValuation}</span>
            <div className="text-2xl font-bold font-mono text-slate-900">
              ${totalValue.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <ArrowUpRight className={`w-3.5 h-3.5 ${lang === 'ar' ? '-scale-x-100' : ''}`} />
              <span>{t.widgetValuationChange}</span>
            </div>
          </div>
          <div className="bg-teal-50 text-teal-600 p-3 rounded-xl border border-teal-100 group-hover:scale-105 transition-transform">
            <CircleDollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Units Count */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between relative overflow-hidden group">
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">{t.widgetActiveVolume}</span>
            <div className="text-2xl font-bold font-mono text-slate-900">
              {totalStockItems.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}{' '}
              <span className="text-xs text-slate-400 font-sans">{lang === 'ar' ? 'وحدة' : 'units'}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
              <Package className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.widgetItemsCount.replace('{count}', String(items.length))}</span>
            </div>
          </div>
          <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl border border-indigo-100 group-hover:scale-105 transition-transform">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Stock Safety Warnings */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between relative overflow-hidden group">
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">{t.widgetSupplyAlert}</span>
            <div className="text-2xl font-bold font-mono text-slate-900 flex items-baseline gap-2">
              <span>{(lowStockCount + outOfStockCount).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span>
              {lowStockCount > 0 && (
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md font-sans">
                  {t.widgetLowCount.replace('{count}', String(lowStockCount))}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-600">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{outOfStockCount.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')} {t.widgetCriticalDepletion}</span>
            </div>
          </div>
          <div className={`p-3 rounded-xl border transition-transform group-hover:scale-105 ${
            lowStockCount + outOfStockCount > 0 
              ? 'bg-amber-50 text-amber-600 border-amber-100' 
              : 'bg-emerald-50 text-emerald-600 border-emerald-100'
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: ERP Fulfillment Index */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between relative overflow-hidden group">
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">{t.widgetFulfillmentIndex}</span>
            <div className="text-2xl font-bold font-mono text-slate-900">
              {healthPercentage.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}%
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{t.widgetSafeThresholds}</span>
            </div>
          </div>
          {/* Circular SVG Gauge for eye-catching visual feedback */}
          <div className="relative w-12 h-12 shrink-0 group-hover:scale-105 transition-transform">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="18"
                className="stroke-slate-100"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r="18"
                className="stroke-teal-500"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 18}`}
                strokeDashoffset={`${2 * Math.PI * 18 * (1 - healthPercentage / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold font-mono text-teal-700">
              {healthPercentage.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}%
            </span>
          </div>
        </div>

      </div>

      {/* Visual Section: Two Column Grid with Category Chart and Live Stock Status Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category Financial Allocation Chart */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-800">{t.allocationTitle}</h4>
              <p className="text-xs text-slate-500">{t.allocationDesc}</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-1.5 flex items-center gap-1.5 text-xs text-slate-600">
              <Layers className="w-3.5 h-3.5 text-teal-600" />
              <span className="font-semibold">{t.currencyUnit}</span>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {Object.entries(categoryDistribution).map(([category, val]) => {
              const pct = (val / maxVal) * 100;
              return (
                <div key={category} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700">{getCategoryTranslation(category)}</span>
                    <span className="font-mono text-slate-500 font-medium">
                      ${val.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${Math.max(pct, 3)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Operational Status Distribution */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm lg:col-span-5 flex flex-col justify-between">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-800">{t.healthMatrixTitle}</h4>
            <p className="text-xs text-slate-500">{t.healthMatrixDesc}</p>
          </div>

          <div className="my-6 space-y-4">
            {/* Custom Circular Segment View / Progress blocks */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-emerald-500 rounded-full" />
                  <span>{t.fullyStocked}</span>
                </div>
                <span>{items.filter(i => i.status === 'In Stock').length.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')} {lang === 'ar' ? 'عناصر' : 'items'}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-amber-500 rounded-full" />
                  <span>{t.depletingStock}</span>
                </div>
                <span>{lowStockCount.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')} {lang === 'ar' ? 'عناصر' : 'items'}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-rose-500 rounded-full" />
                  <span>{t.totalCritical}</span>
                </div>
                <span>{outOfStockCount.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')} {lang === 'ar' ? 'عناصر' : 'items'}</span>
              </div>
            </div>

            {/* Segmented Progress bar */}
            <div className="h-4.5 w-full bg-slate-100 rounded-xl overflow-hidden flex">
              <div 
                className="bg-emerald-50 h-full transition-all duration-300" 
                style={{ width: `${(items.filter(i => i.status === 'In Stock').length / items.length) * 100}%` }}
                title="In Stock"
              />
              <div 
                className="bg-amber-500 h-full transition-all duration-300" 
                style={{ width: `${(lowStockCount / items.length) * 100}%` }}
                title="Low Stock"
              />
              <div 
                className="bg-rose-500 h-full transition-all duration-300" 
                style={{ width: `${(outOfStockCount / items.length) * 100}%` }}
                title="Out of Stock"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2.5 text-xs text-slate-500">
            <ShieldAlert className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{t.fulfillmentDisclaimer}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
