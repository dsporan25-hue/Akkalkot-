export type Language = 'en' | 'bn';

export interface Translations {
  appName: string;
  appSubtitle: string;
  fileManager: string;
  settings: string;
  dailyFiles: string;
  today: string;
  yesterday: string;
  totalCalculations: string;
  noRecordsYet: string;
  noRecordsDesc: string;
  searchPlaceholder: string;
  deleteConfirmTitle: string;
  deleteConfirmMessage: string;
  deleteDayMessage: string;
  cancel: string;
  delete: string;
  clearAll: string;
  copiedToClipboard: string;
  loadedIntoCalc: string;
  exportPdf: string;
  exportJson: string;
  importJson: string;
  exportCsv: string;
  share: string;
  copy: string;
  apply: string;
  close: string;
  // Settings
  theme: string;
  themeDark: string;
  themeLight: string;
  themeNeon: string;
  buttonSound: string;
  vibrationFeedback: string;
  displayFontSize: string;
  buttonSize: string;
  sizeSmall: string;
  sizeMedium: string;
  sizeLarge: string;
  sizeXLarge: string;
  autoSaveTitle: string;
  autoSaveDesc: string;
  angleUnit: string;
  deg: string;
  rad: string;
  language: string;
  backupRestore: string;
  backupDesc: string;
  clearHistory: string;
  clearHistoryConfirm: string;
  aboutApp: string;
  version: string;
  developer: string;
  apkGuideTitle: string;
  apkGuideDesc: string;
  // Modes & Tools
  basicMode: string;
  scientificMode: string;
  calculusMode: string;
  unitConverter: string;
  currencyConverter: string;
  // Calculus
  derivative: string;
  integral: string;
  functionFx: string;
  evalAtX: string;
  lowerBound: string;
  upperBound: string;
  calculate: string;
  result: string;
  // Converters
  from: string;
  to: string;
  amount: string;
  convert: string;
  exchangeRateNotice: string;
  refreshRates: string;
  useInCalc: string;
  // Install
  installApp: string;
  installed: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'Poran Smart Calculator',
    appSubtitle: 'Automatic Daily File Storage & Scientific Engine',
    fileManager: 'File Manager',
    settings: 'Settings',
    dailyFiles: 'Daily Calculation Files',
    today: 'Today',
    yesterday: 'Yesterday',
    totalCalculations: 'calculations',
    noRecordsYet: 'No calculations recorded yet',
    noRecordsDesc: 'Perform any calculation to automatically save it in today’s daily file.',
    searchPlaceholder: 'Search calculations by expression or result...',
    deleteConfirmTitle: 'Confirm Deletion',
    deleteConfirmMessage: 'Are you sure you want to delete this calculation record?',
    deleteDayMessage: 'Are you sure you want to delete all calculations for this date?',
    cancel: 'Cancel',
    delete: 'Delete',
    clearAll: 'Clear All History',
    copiedToClipboard: 'Copied to clipboard!',
    loadedIntoCalc: 'Loaded into calculator display!',
    exportPdf: 'Print / Export PDF',
    exportJson: 'Backup JSON',
    importJson: 'Restore JSON',
    exportCsv: 'Export CSV',
    share: 'Share',
    copy: 'Copy',
    apply: 'Apply',
    close: 'Close',
    theme: 'Theme',
    themeDark: 'Dark Navy',
    themeLight: 'Clean Light',
    themeNeon: 'Cyber Neon',
    buttonSound: 'Button Click Sound',
    vibrationFeedback: 'Haptic Vibration',
    displayFontSize: 'Display Text Size',
    buttonSize: 'Keypad Button Size',
    sizeSmall: 'Small',
    sizeMedium: 'Medium',
    sizeLarge: 'Large',
    sizeXLarge: 'Extra Large',
    autoSaveTitle: 'Automatic File Saving',
    autoSaveDesc: 'Automatically organize completed calculations into daily files.',
    angleUnit: 'Trigonometry Angle Mode',
    deg: 'Degrees (DEG)',
    rad: 'Radians (RAD)',
    language: 'Language / ভাষা',
    backupRestore: 'Data Backup & Restore',
    backupDesc: 'Export all daily calculation records or restore from a backup file.',
    clearHistory: 'Clear Calculation Files',
    clearHistoryConfirm: 'Are you sure you want to erase all daily calculation files permanently?',
    aboutApp: 'About Poran Smart Calculator',
    version: 'Version 1.0.0 (Android Ready)',
    developer: 'Poran Technologies (ismartporan@gmail.com)',
    apkGuideTitle: 'How to install as APK / Android App',
    apkGuideDesc: 'This app is a Progressive Web App (PWA) ready for Android installation and APK generation via Capacitor or Bubblewrap.',
    basicMode: 'Standard',
    scientificMode: 'Scientific',
    calculusMode: 'Calculus Tools',
    unitConverter: 'Unit Converter',
    currencyConverter: 'Currency Converter',
    derivative: 'Differentiation (d/dx)',
    integral: 'Definite Integral (∫)',
    functionFx: 'Function f(x)',
    evalAtX: 'Evaluate at x =',
    lowerBound: 'Lower limit a =',
    upperBound: 'Upper limit b =',
    calculate: 'Calculate',
    result: 'Result',
    from: 'From',
    to: 'To',
    amount: 'Value / Amount',
    convert: 'Convert',
    exchangeRateNotice: 'Live benchmark rates updated automatically.',
    refreshRates: 'Refresh Rates',
    useInCalc: 'Send to Calculator',
    installApp: 'Install Android App',
    installed: 'App Installed'
  },
  bn: {
    appName: 'পরাণ স্মার্ট ক্যালকুলেটর',
    appSubtitle: 'স্বয়ংক্রিয় দৈনিক ফাইল সংরক্ষণ ও বৈজ্ঞানিক ইঞ্জিন',
    fileManager: 'ফাইল ম্যানেজার',
    settings: 'সেটিংস',
    dailyFiles: 'দৈনিক গণনার ফাইলসমূহ',
    today: 'আজ',
    yesterday: 'গতকাল',
    totalCalculations: 'টি গণনা',
    noRecordsYet: 'এখনও কোনো গণনার রেকর্ড নেই',
    noRecordsDesc: 'যেকোনো হিসাব সম্পন্ন করলেই তা স্বয়ংক্রিয়ভাবে আজকের ফাইলে সংরক্ষিত হবে।',
    searchPlaceholder: 'হিসাব বা ফলাফল লিখে খুঁজুন...',
    deleteConfirmTitle: 'মুছে ফেলার নিশ্চিতকরণ',
    deleteConfirmMessage: 'আপনি কি নিশ্চিত যে এই গণনার রেকর্ডটি মুছে ফেলতে চান?',
    deleteDayMessage: 'আপনি কি এই তারিখের সব হিসাব মুছে ফেলতে চান?',
    cancel: 'বাতিল',
    delete: 'মুছে ফেলুন',
    clearAll: 'সকল ইতিহাস মুছুন',
    copiedToClipboard: 'ক্লিপবোর্ডে কপি করা হয়েছে!',
    loadedIntoCalc: 'ক্যালকুলেটরে লোড করা হয়েছে!',
    exportPdf: 'প্রিন্ট / PDF এক্সপোর্ট',
    exportJson: 'ব্যাকআপ JSON',
    importJson: 'রিস্টোর JSON',
    exportCsv: 'CSV এক্সপোর্ট',
    share: 'শেয়ার',
    copy: 'কপি',
    apply: 'প্রয়োগ করুন',
    close: 'বন্ধ করুন',
    theme: 'থিম (Theme)',
    themeDark: 'ডার্ক নেভি (Dark Navy)',
    themeLight: 'লাইট (Light)',
    themeNeon: 'নিয়ন (Neon)',
    buttonSound: 'বোতামের শব্দ (Sound)',
    vibrationFeedback: 'ভাইব্রেশন ফিডব্যাক (Vibration)',
    displayFontSize: 'ডিসপ্লে ফন্ট সাইজ',
    buttonSize: 'বোতামের সাইজ',
    sizeSmall: 'ছোট',
    sizeMedium: 'মাঝারি',
    sizeLarge: 'বড়',
    sizeXLarge: 'অতি বড়',
    autoSaveTitle: 'অটোমেটিক ফাইল সেভ',
    autoSaveDesc: 'প্রতিটি সম্পন্ন হিসাব স্বয়ংক্রিয়ভাবে দৈনিক ফাইলে গুছিয়ে রাখে।',
    angleUnit: 'ত্রিকোণমিতি অ্যাঙ্গেল মোড',
    deg: 'ডিগ্রি (DEG)',
    rad: 'রেডিয়ান (RAD)',
    language: 'ভাষা / Language',
    backupRestore: 'ডাটা ব্যাকআপ ও রিস্টোর',
    backupDesc: 'সকল দৈনিক ফাইল এক্সপোর্ট করুন অথবা ব্যাকআপ ফাইল থেকে ফিরিয়ে আনুন।',
    clearHistory: 'সব হিস্ট্রি পরিষ্কার করুন',
    clearHistoryConfirm: 'আপনি কি নিশ্চিত যে সমস্ত দৈনিক গণনার ফাইল মুছে ফেলবেন?',
    aboutApp: 'পরাণ ক্যালকুলেটর সম্পর্কে',
    version: 'ভার্সন ১.০.০ (অ্যান্ড্রয়েড রেডি)',
    developer: 'পরাণ টেকনোলজিস (ismartporan@gmail.com)',
    apkGuideTitle: 'কীভাবে APK / অ্যান্ড্রয়েড অ্যাপ হিসেবে ইনস্টল করবেন',
    apkGuideDesc: 'এই অ্যাপটি প্রগ্রেসিভ ওয়েব অ্যাপ (PWA) এবং ক্যাপাসিটর / বাবলর‌্যাপ দিয়ে সরাসরি APK বানানো যায়।',
    basicMode: 'সাধারণ',
    scientificMode: 'সায়েন্টিফিক',
    calculusMode: 'ক্যালকুলাস টুলস',
    unitConverter: 'একক রূপান্তর',
    currencyConverter: 'মুদ্রা রূপান্তর',
    derivative: 'অন্তরীকরণ (d/dx)',
    integral: 'নির্দিষ্ট সমাকলন (∫)',
    functionFx: 'ফাংশন f(x)',
    evalAtX: 'x এর মান =',
    lowerBound: 'নিম্নসীমা a =',
    upperBound: 'উর্ধ্বসীমা b =',
    calculate: 'হিসাব করুন',
    result: 'ফলাফল',
    from: 'থেকে',
    to: 'তে',
    amount: 'পরিমাণ / মান',
    convert: 'রূপান্তর করুন',
    exchangeRateNotice: 'আন্তর্জাতিক এক্সচেঞ্জ রেট সর্বশেষ আপডেট অনুসারে।',
    refreshRates: 'রেট রিফ্রেশ',
    useInCalc: 'ক্যালকুলেটরে পাঠান',
    installApp: 'অ্যান্ড্রয়েড অ্যাপ ইনস্টল',
    installed: 'ইনস্টল সম্পন্ন'
  }
};
