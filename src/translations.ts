/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TranslationSet {
  // Login Page
  portalTitle: string;
  erpTitle: string;
  tagline: string;
  taglineHighlight: string;
  desc: string;
  serverStatus: string;
  optimal: string;
  welcomeBack: string;
  loginSub: string;
  fieldAccount: string;
  fieldEmail: string;
  fieldPassword: string;
  forgotKey: string;
  authButton: string;
  authButtonLoading: string;
  quickFill: string;
  demoCredentials: string;
  fieldAccountPlaceholder: string;
  fieldEmailPlaceholder: string;
  fieldPasswordPlaceholder: string;
  loginErrorAlertTitle: string;
  loginErrorAlertDesc: string;

  // Sidebar Menu
  overview: string;
  inventory: string;
  logs: string;
  settings: string;
  coreModules: string;
  systemLink: string;
  secureStatus: string;
  terminateSession: string;
  operatorRole: string;

  // Dashboard / General Headers
  liveConsole: string;
  appUrlConnected: string;
  overviewHeader: string;
  inventoryHeader: string;
  logsHeader: string;
  settingsHeader: string;
  searchPlaceholder: string;
  alertsTitle: string;
  justNow: string;
  provisionButton: string;

  // Overview / Alert Box
  supplyChainWarning: string;
  supplyChainWarningDesc: string;
  restockAllButton: string;
  restockSuccessAlert: string;
  restockSafeAlert: string;

  // Summary Widgets
  widgetValuation: string;
  widgetValuationChange: string;
  widgetActiveVolume: string;
  widgetItemsCount: string;
  widgetSupplyAlert: string;
  widgetCriticalDepletion: string;
  widgetFulfillmentIndex: string;
  widgetSafeThresholds: string;
  widgetLowCount: string;

  // Graphs and Matrix
  allocationTitle: string;
  allocationDesc: string;
  currencyUnit: string;
  healthMatrixTitle: string;
  healthMatrixDesc: string;
  fullyStocked: string;
  depletingStock: string;
  totalCritical: string;
  fulfillmentDisclaimer: string;

  // Audit Logs
  liveStreamTitle: string;
  liveStreamDesc: string;
  resetLogState: string;
  loggedBy: string;
  clearLogBtn: string;
  clearLogTitle: string;
  logsFlushSuccess: string;
  emptyLogsMessage: string;

  // Sidebar operator detail
  operatorLabel: string;
  accountKeyLabel: string;
  departmentLabel: string;
  departmentValue: string;

  // Inventory Table
  colSku: string;
  colCategory: string;
  colPrice: string;
  colStock: string;
  colStatus: string;
  colRevision: string;
  colActions: string;
  minLabel: string;
  statusInStock: string;
  statusLowStock: string;
  statusOutOfStock: string;
  retireConfirm: string;
  tableEmpty: string;
  tableSummary: string;

  // Settings
  thresholdTitle: string;
  thresholdDesc: string;
  thresholdLabel: string;
  thresholdLimitDesc: string;
  reportingCurrency: string;
  autoReorderLabel: string;
  saveConfigBtn: string;
  saveConfigSuccess: string;
  diagnosticsTitle: string;
  diagnosticsDesc: string;
  activeGateway: string;
  dbLatency: string;
  sslCertificate: string;
  uptimeTracker: string;
  encryptionDisclaimer: string;

  // Add Item Modal
  modalTitle: string;
  modalSku: string;
  modalCategory: string;
  modalName: string;
  modalStock: string;
  modalMinAlert: string;
  modalPrice: string;
  modalCancel: string;
  modalConfirm: string;

  // Categories
  catElectronics: string;
  catHardware: string;
  catOfficeSupplies: string;
  catRawMaterials: string;
  catSoftwareLicenses: string;
}

export const translations: Record<'en' | 'ar', TranslationSet> = {
  en: {
    portalTitle: 'Enterprise Portal',
    erpTitle: 'NEXUS ERP',
    tagline: 'Streamline operations.',
    taglineHighlight: 'Maximize precision.',
    desc: 'An eye-safe, ultra-high efficiency workspace engineered to unify supply chains, accounts, and live analytics.',
    serverStatus: 'Server Status',
    optimal: 'Optimal',
    welcomeBack: 'Welcome back',
    loginSub: 'Verify your enterprise credentials to access the central operations control.',
    fieldAccount: 'ERP Account Number',
    fieldEmail: 'Email Address',
    fieldPassword: 'Security Password',
    forgotKey: 'Forgot Key?',
    authButton: 'Authenticate Console',
    authButtonLoading: 'Authenticating...',
    quickFill: 'Quick Fill',
    demoCredentials: 'Demo Environment Credentials',
    fieldAccountPlaceholder: 'e.g. ERP-88290',
    fieldEmailPlaceholder: 'operator@nexus-erp.com',
    fieldPasswordPlaceholder: '••••••••••••',
    loginErrorAlertTitle: 'Authentication Warning',
    loginErrorAlertDesc: 'Please fill in all security fields.',

    overview: 'Control Overview',
    inventory: 'ERP Inventory',
    logs: 'Operational Logs',
    settings: 'Console Config',
    coreModules: 'Core Modules',
    systemLink: 'System Link',
    secureStatus: 'SECURE',
    terminateSession: 'Terminate Session',
    operatorRole: 'Authorized Console Operator',

    liveConsole: 'ERP Live Console',
    appUrlConnected: 'APP_URL Connected',
    overviewHeader: 'Operations Dashboard',
    inventoryHeader: 'Inventory Management Registry',
    logsHeader: 'System Audit Trail',
    settingsHeader: 'Enterprise Configuration',
    searchPlaceholder: 'Search items, SKUs...',
    alertsTitle: 'Operational Alerts',
    justNow: 'Just now',
    provisionButton: 'Provision Item',

    supplyChainWarning: 'Supply Chain Warning Flagged',
    supplyChainWarningDesc: 'Several inventory SKUs are falling below their minimum safety threshold levels.',
    restockAllButton: 'Express Restock All',
    restockSuccessAlert: 'Successfully triggered express restock for {count} items.',
    restockSafeAlert: 'All items are currently at safe operating stock thresholds.',

    widgetValuation: 'Inventory Valuation',
    widgetValuationChange: '+4.8% from last week',
    widgetActiveVolume: 'Active Stock Volume',
    widgetItemsCount: 'Across {count} listed items',
    widgetSupplyAlert: 'Supply Alert Status',
    widgetCriticalDepletion: 'critical depletion',
    widgetFulfillmentIndex: 'Fulfillment Index',
    widgetSafeThresholds: 'Safe operational thresholds',
    widgetLowCount: '{count} Low',

    allocationTitle: 'Financial Allocation by Category',
    allocationDesc: 'Valuation of inventory holding sizes per department.',
    currencyUnit: 'USD ($)',
    healthMatrixTitle: 'Operational Health Matrix',
    healthMatrixDesc: 'Distribution of stock items by immediate supply health.',
    fullyStocked: 'Fully Stocked Items',
    depletingStock: 'Depleting Stock Alerts',
    totalCritical: 'Total Critical Outage',
    fulfillmentDisclaimer: 'Fulfillment scores are synchronized with live stock level revisions.',

    liveStreamTitle: 'Live Operation Stream',
    liveStreamDesc: 'Real-time ERP events and adjustments audit trail.',
    resetLogState: 'Reset Log State',
    loggedBy: 'Logged by',
    clearLogBtn: 'Flush Session Logs',
    clearLogTitle: 'Security Logging Status: ACTIVE (Secure Hash Loop)',
    logsFlushSuccess: 'System logs successfully flushed for active session security.',
    emptyLogsMessage: 'No system logs match the active filter options.',

    operatorLabel: 'Operator:',
    accountKeyLabel: 'Account Key:',
    departmentLabel: 'Department:',
    departmentValue: 'Logistics & Systems',

    colSku: 'Item Details & SKU',
    colCategory: 'Category',
    colPrice: 'Financial Unit Price',
    colStock: 'Fulfillment Stock',
    colStatus: 'Status Tag',
    colRevision: 'Audit Revision',
    colActions: 'Actions',
    minLabel: 'Min:',
    statusInStock: 'In Stock',
    statusLowStock: 'Low Stock',
    statusOutOfStock: 'Out of Stock',
    retireConfirm: 'Are you sure you want to retire {name} ({sku}) from inventory?',
    tableEmpty: 'No active stock records matching current query parameters.',
    tableSummary: 'Displaying {filtered} of {total} total inventory items.',

    thresholdTitle: 'Operational Threshold Parameters',
    thresholdDesc: 'Fine-tune inventory alerts and system currency defaults below.',
    thresholdLabel: 'Auto Low-Stock Warn Limit (Units)',
    thresholdLimitDesc: 'Flag items as "Low Stock" automatically if quantity drops below this margin limit.',
    reportingCurrency: 'Reporting Currency',
    autoReorderLabel: 'Automatic Stock Reorder Proposals',
    saveConfigBtn: 'Save Configuration',
    saveConfigSuccess: 'Operational parameter configurations updated and synchronized.',
    diagnosticsTitle: 'Diagnostics Readout',
    diagnosticsDesc: 'Live operational status indicators.',
    activeGateway: 'Active Gateway',
    dbLatency: 'Database Latency',
    sslCertificate: 'SSL Certificate',
    uptimeTracker: 'Uptime Tracker',
    encryptionDisclaimer: 'Console connection encrypted securely with double-salted hashes.',

    modalTitle: 'PROVISION NEW INVENTORY ASSET',
    modalSku: 'Inventory SKU Code',
    modalCategory: 'ERP Asset Category',
    modalName: 'ERP Asset / Product Name',
    modalStock: 'Initial Stock Qty',
    modalMinAlert: 'Min Alert Stock Qty',
    modalPrice: 'Unit Price (USD $)',
    modalCancel: 'Cancel',
    modalConfirm: 'Confirm Provisioning',

    catElectronics: 'Electronics',
    catHardware: 'Hardware',
    catOfficeSupplies: 'Office Supplies',
    catRawMaterials: 'Raw Materials',
    catSoftwareLicenses: 'Software Licenses',
  },
  ar: {
    portalTitle: 'بوابة المؤسسة',
    erpTitle: 'نيكسوس ERP',
    tagline: 'تبسيط وتسهيل العمليات.',
    taglineHighlight: 'مضاعفة مستويات الدقة والتحكم.',
    desc: 'بيئة عمل متكاملة مريحة للعين، فائقة الكفاءة ومهندسة خصيصاً لتوحيد سلاسل الإمداد، الحسابات، والتحليلات الفورية.',
    serverStatus: 'حالة الخادم',
    optimal: 'مثالية',
    welcomeBack: 'أهلاً بك مجدداً',
    loginSub: 'يرجى التحقق من بيانات الاعتماد الخاصة بك للوصول إلى لوحة التحكم المركزية للعمليات.',
    fieldAccount: 'رقم حساب ERP',
    fieldEmail: 'البريد الإلكتروني',
    fieldPassword: 'كلمة مرور الأمان',
    forgotKey: 'نسيت كلمة المرور؟',
    authButton: 'المصادقة وتسجيل الدخول',
    authButtonLoading: 'جاري المصادقة والتحقق...',
    quickFill: 'تعبئة تلقائية',
    demoCredentials: 'بيانات الاعتماد لبيئة العرض التجريبية',
    fieldAccountPlaceholder: 'مثال: ERP-88290',
    fieldEmailPlaceholder: 'operator@nexus-erp.com',
    fieldPasswordPlaceholder: '••••••••••••',
    loginErrorAlertTitle: 'تحذير أمني ومصادقة',
    loginErrorAlertDesc: 'يرجى ملء كافة حقول الأمان المطلوبة.',

    overview: 'ملخص العمليات والتحكم',
    inventory: 'مخزون المؤسسة ERP',
    logs: 'سجلات العمليات',
    settings: 'تكوين النظام والمعايير',
    coreModules: 'الوحدات الأساسية',
    systemLink: 'رابط النظام',
    secureStatus: 'مؤمن وآمن',
    terminateSession: 'إنهاء الجلسة الآمنة',
    operatorRole: 'مشغل وحدة التحكم المصرح له',

    liveConsole: 'لوحة تحكم ERP الفورية',
    appUrlConnected: 'متصل بعنوان التطبيق APP_URL',
    overviewHeader: 'لوحة مراقبة العمليات الفورية',
    inventoryHeader: 'سجل إدارة مخزون وموارد المؤسسة',
    logsHeader: 'مسار التدقيق ومراجعة النظام',
    settingsHeader: 'إعدادات وتكوين النظام',
    searchPlaceholder: 'البحث عن العناصر، الرموز SKU...',
    alertsTitle: 'تنبيهات العمليات الحية',
    justNow: 'الآن',
    provisionButton: 'تزويد وإضافة عنصر جديد',

    supplyChainWarning: 'تم رصد إنذار في سلاسل الإمداد',
    supplyChainWarningDesc: 'العديد من عناصر المخزون تنخفض كمياتها الحالية عن مستوى حد الأمان المحدد.',
    restockAllButton: 'إعادة تزويد سريع للكل',
    restockSuccessAlert: 'تم تشغيل تزويد سريع بنجاح لـ {count} من العناصر المتأثرة.',
    restockSafeAlert: 'كافة العناصر حالياً تقع ضمن حدود الأمان المثالية للتشغيل.',

    widgetValuation: 'إجمالي تقييم المخزون',
    widgetValuationChange: '+4.8% مقارنة بالأسبوع الماضي',
    widgetActiveVolume: 'حجم المخزون النشط',
    widgetItemsCount: 'موزعة على {count} من العناصر المسجلة',
    widgetSupplyAlert: 'حالة تنبيهات التوريد',
    widgetCriticalDepletion: 'نفاد مخزون حرج بالكامل',
    widgetFulfillmentIndex: 'مؤشر الإنجاز والتشغيل',
    widgetSafeThresholds: 'عتبات التشغيل الآمن للمخازن',
    widgetLowCount: '{count} منخفض',

    allocationTitle: 'التخصيص المالي حسب الفئة',
    allocationDesc: 'تقييم الحصص المالية لحجم الاحتفاظ بالمخزون لكل قسم.',
    currencyUnit: 'دولار أمريكي ($)',
    healthMatrixTitle: 'مصفوفة الصحة التشغيلية للـ ERP',
    healthMatrixDesc: 'توزيع عناصر المخزون حسب مدى جودة وتوفر التوريد الفوري.',
    fullyStocked: 'العناصر المتوفرة بالكامل',
    depletingStock: 'تنبيهات انخفاض المخزون',
    totalCritical: 'العناصر المنفدة تماماً',
    fulfillmentDisclaimer: 'يتم مزامنة درجات الإنجاز وتحديثها مع تعديلات مستويات المخزون الحية.',

    liveStreamTitle: 'البث المباشر للعمليات',
    liveStreamDesc: 'مسار تدقيق مستمر وفوري لكافة أحداث وتعديلات نظام الـ ERP.',
    resetLogState: 'إعادة ضبط السجل',
    loggedBy: 'سجل بواسطة',
    clearLogBtn: 'تفريغ سجلات الجلسة الحالية',
    clearLogTitle: 'حالة سجلات الحماية: نشطة ومؤمنة (تشفير متسلسل)',
    logsFlushSuccess: 'تم مسح سجلات الجلسة بنجاح لضمان أعلى مستويات الأمان والخصوصية.',
    emptyLogsMessage: 'لا توجد سجلات نظام تطابق فلاتر البحث النشطة حالياً.',

    operatorLabel: 'المشغل الحالي:',
    accountKeyLabel: 'رقم الحساب:',
    departmentLabel: 'القسم والإدارة:',
    departmentValue: 'اللوجستيات والأنظمة',

    colSku: 'تفاصيل العنصر ورمز SKU',
    colCategory: 'الفئة',
    colPrice: 'سعر الوحدة المالي',
    colStock: 'مخزون التلبية والتوريد',
    colStatus: 'حالة التوفر',
    colRevision: 'آخر مراجعة وتدقيق',
    colActions: 'الإجراءات والتحكم',
    minLabel: 'الحد الأدنى:',
    statusInStock: 'متوفر',
    statusLowStock: 'منخفض',
    statusOutOfStock: 'منفد',
    retireConfirm: 'هل أنت متأكد من رغبتك في إخراج وتصفية العنصر {name} ({sku}) من المخازن نهائياً؟',
    tableEmpty: 'لا توجد سجلات مخزون تطابق معايير ومحددات البحث النشطة حالياً.',
    tableSummary: 'يتم عرض {filtered} من أصل {total} من عناصر الموارد المخزنية.',

    thresholdTitle: 'معايير وعتبات التشغيل للمؤسسة',
    thresholdDesc: 'ضبط وتخصيص تنبيهات المخزن وقيم العملة الافتراضية للنظام أدناه.',
    thresholdLabel: 'حد التنبيه التلقائي للمخزون المنخفض (بالوحدات)',
    thresholdLimitDesc: 'تمييز العناصر تلقائياً بحالة "مخزون منخفض" إذا انخفضت الكمية عن هذا الحد.',
    reportingCurrency: 'عملة التقارير المالية',
    autoReorderLabel: 'مقترحات إعادة الطلب الآلي للموارد',
    saveConfigBtn: 'حفظ التكوين والمعايير',
    saveConfigSuccess: 'تم حفظ وتحديث معايير التشغيل ومزامنتها بنجاح مع قاعدة البيانات.',
    diagnosticsTitle: 'قراءة التشخيصات الفورية للنظام',
    diagnosticsDesc: 'مؤشرات الأداء والحالة الحية للبنية التحتية.',
    activeGateway: 'بوابة الاتصال النشطة',
    dbLatency: 'زمن استجابة قاعدة البيانات',
    sslCertificate: 'شهادة حماية وتشفير الاتصال',
    uptimeTracker: 'معدل جهوزية الخدمة والاتصال',
    encryptionDisclaimer: 'اتصال وحدة التحكم مشفر بالكامل عبر خوارزميات التشفير المتقدمة.',

    modalTitle: 'تزويد وتسجيل مورد مخزني جديد',
    modalSku: 'رمز SKU الخاص بالمنتج',
    modalCategory: 'فئة مورد المؤسسة ERP',
    modalName: 'اسم المنتج / المورد المالي',
    modalStock: 'كمية المخزون الابتدائية',
    modalMinAlert: 'كمية حد الأمان للتنبيه',
    modalPrice: 'سعر الوحدة (دولار أمريكي $)',
    modalCancel: 'إلغاء الأمر',
    modalConfirm: 'تأكيد الإضافة والتسجيل',

    catElectronics: 'الإلكترونيات',
    catHardware: 'المعدات والصلب',
    catOfficeSupplies: 'المستلزمات المكتبية',
    catRawMaterials: 'المواد الخام والمصادر',
    catSoftwareLicenses: 'تراخيص البرمجيات والأنظمة',
  }
};
