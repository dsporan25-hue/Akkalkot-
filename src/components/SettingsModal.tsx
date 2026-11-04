import React, { useRef, useState } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Vibrate,
  Type,
  Grid,
  HardDrive,
  Globe,
  Download,
  Upload,
  Trash2,
  Info,
  Smartphone,
  CheckCircle,
  HelpCircle,
  Moon,
  Sun,
  Zap
} from 'lucide-react';
import {
  AppSettings,
  ThemeOption,
  DisplaySizeOption,
  ButtonSizeOption,
  AngleUnitOption,
  AppLanguage,
} from '../services/settings';
import { translations } from '../services/i18n';
import { calculatorStorage } from '../services/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onHistoryCleared: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onHistoryCleared,
}) => {
  const t = translations[settings.language];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showApkGuide, setShowApkGuide] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isOpen) return null;

  const handleBackupExport = async () => {
    const json = await calculatorStorage.exportJSONBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `poran_calc_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBackupImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const res = await calculatorStorage.restoreFromJSON(text);
      if (res.success) {
        setImportStatus(
          settings.language === 'bn'
            ? `সফলভাবে ${res.count} টি ফাইলের ব্যাকআপ লোড করা হয়েছে!`
            : `Successfully restored ${res.count} daily files!`
        );
        onHistoryCleared();
      } else {
        setImportStatus(
          settings.language === 'bn' ? 'ফাইলটি সঠিক ব্যাকআপ ফরম্যাট নয়।' : 'Invalid backup JSON file format.'
        );
      }
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearHistory = async () => {
    await calculatorStorage.clearAllHistory();
    setShowClearConfirm(false);
    onHistoryCleared();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[92vh] flex flex-col rounded-3xl bg-[#091122] border border-[#1e2f52] shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40">
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <span>{t.settings}</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Settings Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 text-sm">
          {/* 1. Theme Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-cyan-400" />
              <span>{t.theme}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'dark', label: t.themeDark, icon: Moon, desc: 'Navy & Black' },
                { id: 'light', label: t.themeLight, icon: Sun, desc: 'Clean Slate' },
                { id: 'neon', label: t.themeNeon, icon: Zap, desc: 'Cyber Cyan' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onUpdateSettings({ theme: item.id as ThemeOption })}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                    settings.theme === item.id
                      ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-xs font-semibold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Sound & Vibration Feedback */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Feedback & Haptics
            </label>
            <div className="space-y-2">
              {/* Sound Toggle */}
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400">
                    {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">{t.buttonSound}</div>
                    <div className="text-xs text-slate-400">Tactile audio click on every tap</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                  className={`w-11 h-6 rounded-full p-1 transition-colors ${
                    settings.soundEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Vibration Toggle */}
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400">
                    <Vibrate className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">{t.vibrationFeedback}</div>
                    <div className="text-xs text-slate-400">Physical haptic response on touch</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ vibrationEnabled: !settings.vibrationEnabled })}
                  className={`w-11 h-6 rounded-full p-1 transition-colors ${
                    settings.vibrationEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.vibrationEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 3. Display Font Size & Button Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Display Font Size */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Type className="w-4 h-4 text-cyan-400" />
                <span>{t.displayFontSize}</span>
              </label>
              <div className="flex rounded-xl bg-slate-900/90 p-1 border border-slate-800">
                {(['small', 'medium', 'large'] as DisplaySizeOption[]).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => onUpdateSettings({ displayFontSize: sz })}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                      settings.displayFontSize === sz
                        ? 'bg-cyan-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {sz === 'small' ? t.sizeSmall : sz === 'medium' ? t.sizeMedium : t.sizeLarge}
                  </button>
                ))}
              </div>
            </div>

            {/* Button Size */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Grid className="w-4 h-4 text-cyan-400" />
                <span>{t.buttonSize}</span>
              </label>
              <div className="flex rounded-xl bg-slate-900/90 p-1 border border-slate-800">
                {(['medium', 'large', 'xlarge'] as ButtonSizeOption[]).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => onUpdateSettings({ buttonSize: sz })}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                      settings.buttonSize === sz
                        ? 'bg-cyan-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {sz === 'medium' ? t.sizeMedium : sz === 'large' ? t.sizeLarge : t.sizeXLarge}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Automatic File Save (Mandatory) */}
          <div className="p-3 rounded-2xl bg-cyan-950/20 border border-cyan-800/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <span>{t.autoSaveTitle}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                    DEFAULT ON
                  </span>
                </div>
                <div className="text-xs text-slate-300">{t.autoSaveDesc}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ autoSave: !settings.autoSave })}
              className={`w-11 h-6 rounded-full p-1 transition-colors ${
                settings.autoSave ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.autoSave ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 5. Language & Angle Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Language Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>{t.language}</span>
              </label>
              <div className="flex rounded-xl bg-slate-900/90 p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ language: 'en' })}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    settings.language === 'en'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ language: 'bn' })}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    settings.language === 'bn'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  বাংলা (Bengali)
                </button>
              </div>
            </div>

            {/* Angle Unit */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {t.angleUnit}
              </label>
              <div className="flex rounded-xl bg-slate-900/90 p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ angleUnit: 'deg' })}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    settings.angleUnit === 'deg'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  DEG (°)
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ angleUnit: 'rad' })}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    settings.angleUnit === 'rad'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  RAD (rad)
                </button>
              </div>
            </div>
          </div>

          {/* 6. Backup & Restore Data */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t.backupRestore}
            </label>
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="text-xs text-slate-300 leading-relaxed">{t.backupDesc}</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleBackupExport}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t.exportJson}</span>
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleBackupImport}
                  accept=".json"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t.importJson}</span>
                </button>
              </div>

              {importStatus && (
                <div className="text-xs text-cyan-400 font-medium bg-cyan-950/40 p-2 rounded-lg border border-cyan-800/40">
                  {importStatus}
                </div>
              )}
            </div>
          </div>

          {/* 7. Clear History Button */}
          <div>
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-rose-950/20 hover:bg-rose-950/40 border border-rose-800/30 text-rose-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t.clearHistory}</span>
            </button>
          </div>

          {/* 8. Android APK & PWA Guide (Answers user request) */}
          <div className="rounded-2xl bg-slate-900/80 border border-cyan-500/20 p-3.5 space-y-2">
            <div
              onClick={() => setShowApkGuide(!showApkGuide)}
              className="flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2 font-semibold text-slate-200 text-xs">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>{t.apkGuideTitle}</span>
              </div>
              <HelpCircle className="w-4 h-4 text-cyan-400 opacity-80" />
            </div>

            {showApkGuide && (
              <div className="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-800 animate-in fade-in">
                <p className="leading-relaxed">
                  {settings.language === 'bn' ? (
                    <>
                      <strong>অ্যান্ড্রয়েড APK বানানোর নিয়মাবলী:</strong><br />
                      ১. এই ক্যালকুলেটরটি একটি পূর্ণাঙ্গ PWA। যেকোনো ব্রাউজারে (যেমন Chrome) ওপেন করে <strong>"Add to Home Screen"</strong> বা <strong>"Install App"</strong> চাপলেই এটি অ্যান্ড্রয়েড অ্যাপের মতো হোমস্ক্রিনে চলে আসবে।<br />
                      ২. আপনি চাইলে Capacitor দিয়ে সরাসরি <code>.apk</code> তৈরি করতে পারেন:
                      <br />
                      <code className="block bg-slate-950 p-2 rounded mt-1 font-mono text-[11px] text-cyan-300">
                        npm install @capacitor/core @capacitor/cli @capacitor/android<br />
                        npx cap init PoranCalc com.poran.calculator<br />
                        npx cap add android<br />
                        npx cap build
                      </code>
                    </>
                  ) : (
                    <>
                      <strong>Android Installation & APK Generation:</strong><br />
                      1. Instant PWA install: Tap <strong>"Install App"</strong> or open your mobile browser menu and select <strong>"Add to Home screen"</strong>.<br />
                      2. Native APK build with Capacitor:
                      <br />
                      <code className="block bg-slate-950 p-2 rounded mt-1 font-mono text-[11px] text-cyan-300">
                        npm install @capacitor/core @capacitor/cli @capacitor/android<br />
                        npx cap init PoranCalc com.poran.calculator<br />
                        npx cap add android &amp;&amp; npx cap build
                      </code>
                    </>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* 9. About App */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-850 flex items-center justify-between text-xs text-slate-400">
            <div>
              <div className="font-semibold text-slate-200">{t.aboutApp}</div>
              <div className="text-[11px]">{t.version}</div>
              <div className="text-[11px] text-cyan-400/90">{t.developer}</div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Ready</span>
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
          >
            {t.close}
          </button>
        </div>
      </div>

      {/* Confirmation for clearing all history */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl">
            <h3 className="text-base font-bold text-white">{t.clearHistory}</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {t.clearHistoryConfirm}
            </p>
            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleClearHistory}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white transition-colors"
              >
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
