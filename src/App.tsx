/**
 * Poran Smart Calculator
 * Complete Android-ready Smart Calculator Application
 * Automatic Daily Calculation File Manager, Scientific & Calculus Engine,
 * Unit & Currency Converters, and Persistent Settings.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Folder,
  Settings as SettingsIcon,
  Sparkles,
  Calculator,
  Binary,
  ArrowRightLeft,
  HardDrive,
  Copy,
  Check,
  RotateCcw,
  Youtube
} from 'lucide-react';
import { Display } from './components/Display';
import { Keypad } from './components/Keypad';
import { FileManager } from './components/FileManager';
import { SettingsModal } from './components/SettingsModal';
import { CalculusPanel } from './components/CalculusPanel';
import { ConverterPanel } from './components/ConverterPanel';
import { PeaceMediaModal } from './components/PeaceMediaModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { MathEngine } from './services/mathEngine';
import {
  calculatorStorage,
  CalculationRecord,
  DailyCalculationFile,
} from './services/storage';
import {
  AppSettings,
  loadSettings,
  saveSettings,
  applyThemeClass,
} from './services/settings';
import { audioHaptics } from './services/audioHaptics';
import { translations } from './services/i18n';

export default function App() {
  // Settings & preferences
  const [settings, setSettings] = useState<AppSettings>(() => {
    const s = loadSettings();
    applyThemeClass(s.theme);
    return s;
  });

  const t = translations[settings.language];

  // Calculator core state
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [isScientificExpanded, setIsScientificExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  // Modals & Panels
  const [showFileManager, setShowFileManager] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCalculus, setShowCalculus] = useState(false);
  const [showConverter, setShowConverter] = useState(false);
  const [showPeaceMedia, setShowPeaceMedia] = useState(false);

  // Daily file count badge
  const [todayRecordCount, setTodayRecordCount] = useState(0);

  // Update today's count
  const refreshTodayCount = useCallback(async () => {
    const todayStr = calculatorStorage.formatDate(new Date());
    const file = await calculatorStorage.getDailyFile(todayStr);
    setTodayRecordCount(file ? file.itemCount : 0);
  }, []);

  useEffect(() => {
    applyThemeClass(settings.theme);
    refreshTodayCount();
  }, [settings.theme, refreshTodayCount]);

  // Audio & Haptic Feedback helper
  const triggerFeedback = useCallback(
    (type: 'num' | 'op' | 'equal' | 'clear' | 'backspace' = 'num') => {
      if (settings.soundEnabled) {
        audioHaptics.playClick(type);
      }
      if (settings.vibrationEnabled) {
        audioHaptics.triggerVibration(type === 'equal' ? 30 : 15);
      }
    },
    [settings.soundEnabled, settings.vibrationEnabled]
  );

  // Core Math Actions
  const handleDigit = useCallback(
    (digit: string) => {
      triggerFeedback('num');
      setErrorMessage(undefined);

      if (isEvaluated) {
        setExpression(digit);
        setResult(digit);
        setIsEvaluated(false);
        return;
      }

      setExpression((prev) => {
        if (prev === '0') return digit;
        return prev + digit;
      });
    },
    [isEvaluated, triggerFeedback]
  );

  const handleOperator = useCallback(
    (op: string) => {
      triggerFeedback('op');
      setErrorMessage(undefined);

      if (isEvaluated) {
        setExpression(result + ' ' + op + ' ');
        setIsEvaluated(false);
        return;
      }

      setExpression((prev) => {
        if (!prev) {
          if (op === '−') return '-';
          return '0 ' + op + ' ';
        }
        // If trailing operator, replace it
        if (/ [+\−×÷] $/.test(prev)) {
          return prev.slice(0, -3) + ' ' + op + ' ';
        }
        return prev + ' ' + op + ' ';
      });
    },
    [isEvaluated, result, triggerFeedback]
  );

  const handleScientific = useCallback(
    (fn: string) => {
      triggerFeedback('op');
      setErrorMessage(undefined);

      if (isEvaluated) {
        setExpression(fn === 'π' || fn === 'e' ? fn : `${fn}${result}`);
        setIsEvaluated(false);
        return;
      }

      setExpression((prev) => {
        if (prev === '0' && fn !== '^' && fn !== '!' && fn !== ')') return fn;
        return prev + fn;
      });
    },
    [isEvaluated, result, triggerFeedback]
  );

  const handleClear = useCallback(() => {
    triggerFeedback('clear');
    setExpression('');
    setResult('0');
    setIsEvaluated(false);
    setErrorMessage(undefined);
  }, [triggerFeedback]);

  const handleBackspace = useCallback(() => {
    triggerFeedback('backspace');
    setErrorMessage(undefined);

    if (isEvaluated) {
      handleClear();
      return;
    }

    setExpression((prev) => {
      if (!prev) return '';
      // Remove trailing space and operator if present
      if (/ [+\−×÷] $/.test(prev)) {
        return prev.slice(0, -3);
      }
      return prev.slice(0, -1);
    });
  }, [isEvaluated, handleClear, triggerFeedback]);

  const handleToggleSign = useCallback(() => {
    triggerFeedback('op');
    setErrorMessage(undefined);

    if (isEvaluated) {
      const num = parseFloat(result);
      if (!isNaN(num)) {
        const flipped = String(-num);
        setExpression(flipped);
        setResult(flipped);
      }
      return;
    }

    setExpression((prev) => {
      if (!prev || prev === '0') return '-';
      if (prev.startsWith('-')) return prev.substring(1);
      return '-' + prev;
    });
  }, [isEvaluated, result, triggerFeedback]);

  const handleDecimal = useCallback(() => {
    triggerFeedback('num');
    setErrorMessage(undefined);

    if (isEvaluated) {
      setExpression('0.');
      setResult('0.');
      setIsEvaluated(false);
      return;
    }

    setExpression((prev) => {
      if (!prev) return '0.';
      const lastToken = prev.split(/[\s+\−×÷]/).pop() || '';
      if (lastToken.includes('.')) return prev;
      return prev + '.';
    });
  }, [isEvaluated, triggerFeedback]);

  const handlePercent = useCallback(() => {
    triggerFeedback('op');
    setErrorMessage(undefined);

    setExpression((prev) => {
      if (!prev) return '0%';
      return prev + '%';
    });
  }, [triggerFeedback]);

  // Equals / Calculate Action: Evaluates and Automatically Saves to Daily File
  const handleEquals = useCallback(async () => {
    triggerFeedback('equal');
    if (!expression.trim()) return;

    const res = MathEngine.evaluate(expression, { angleUnit: settings.angleUnit });

    if (!res.success) {
      setErrorMessage(
        settings.language === 'bn' && res.result === 'Cannot divide by zero'
          ? '০ দিয়ে ভাগ করা সম্ভব নয়'
          : res.result
      );
      return;
    }

    setResult(res.result);
    setIsEvaluated(true);
    setErrorMessage(undefined);

    // AUTOMATIC CALCULATION FILE MANAGER (Mandatory requirement):
    // "Automatically save every completed calculation. No manual Save button required."
    if (settings.autoSave) {
      const isSci = /[sin|cos|tan|ln|log|√|\^|!|π|e]/.test(expression);
      await calculatorStorage.autoSaveCalculation(
        expression,
        res.result,
        isSci ? 'scientific' : 'basic'
      );
      refreshTodayCount();
    }
  }, [expression, settings.angleUnit, settings.autoSave, settings.language, refreshTodayCount, triggerFeedback]);

  // Toggle angle unit (DEG / RAD)
  const handleToggleAngleUnit = useCallback(() => {
    const nextUnit: 'deg' | 'rad' = settings.angleUnit === 'deg' ? 'rad' : 'deg';
    const updated: AppSettings = { ...settings, angleUnit: nextUnit };
    setSettings(updated);
    saveSettings(updated);
    triggerFeedback('num');
  }, [settings, triggerFeedback]);

  // Copy result to clipboard
  const handleCopyResult = useCallback(() => {
    const textToCopy = isEvaluated ? result : result !== '0' ? result : expression || '0';
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }, [isEvaluated, result, expression]);

  // When a record is selected from File Manager
  const handleSelectCalculation = useCallback((calc: CalculationRecord) => {
    setExpression(calc.expression);
    setResult(calc.result);
    setIsEvaluated(true);
    setErrorMessage(undefined);
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if an input is focused (e.g. inside search or calculus inputs)
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === '+') {
        handleOperator('+');
      } else if (e.key === '-') {
        handleOperator('−');
      } else if (e.key === '*' || e.key === 'x') {
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (e.key === '%') {
        handlePercent();
      } else if (e.key === '.') {
        handleDecimal();
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      } else if (e.key === '(' || e.key === ')') {
        handleScientific(e.key);
      } else if (e.key === '^') {
        handleScientific('^');
      } else if (e.key === '!') {
        handleScientific('!');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleOperator, handlePercent, handleDecimal, handleEquals, handleBackspace, handleClear, handleScientific]);

  return (
    <div className="min-h-screen w-full bg-[#060a12] text-slate-100 flex flex-col justify-between p-2 sm:p-4 select-none">
      {/* Top Application Bar (Ergonomic Top Bar Contract) */}
      <header className="w-full max-w-md mx-auto flex items-center justify-between px-3 py-2.5 rounded-2xl bg-[#091122]/90 border border-[#162440] shadow-md backdrop-blur-md">
        {/* Left: File Manager Folder Icon Trigger */}
        <button
          type="button"
          onClick={() => setShowFileManager(true)}
          className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold transition-all active:scale-95"
          title={t.fileManager}
        >
          <Folder className="w-4 h-4 fill-cyan-400/20" />
          <span className="hidden xs:inline">{t.fileManager}</span>
          {todayRecordCount > 0 && (
            <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-cyan-400 text-slate-950 font-mono text-[10px] font-bold">
              {todayRecordCount}
            </span>
          )}
        </button>

        {/* Center: Brand Name & Title */}
        <div className="text-center">
          <div className="text-xs sm:text-sm font-bold tracking-tight text-white flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>PORAN</span>
            <span className="text-cyan-400 font-extrabold">CALC</span>
          </div>
          <div className="text-[10px] text-slate-400 hidden sm:block">
            Smart Daily Storage
          </div>
        </div>

        {/* Right: Actions & Settings Icon Trigger */}
        <div className="flex items-center gap-1.5">
          <PWAInstallButton lang={settings.language} />

          <button
            type="button"
            onClick={() => setShowSettings(true)}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700/60 flex items-center justify-center transition-all active:scale-95"
            title={t.settings}
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Handheld Physical-Inspired Calculator Container */}
      <main className="w-full max-w-md mx-auto my-auto flex flex-col gap-3 py-2">
        {/* Mode Quick Toolbar: Tools for Calculus, Unit/Currency Converters & Peace Media */}
        <div className="flex flex-col gap-1.5 px-1">
          <div className="flex items-center gap-1.5 flex-1">
            <button
              type="button"
              onClick={() => setShowCalculus(true)}
              className="flex-1 py-1.5 px-2 rounded-xl bg-[#0e172a] hover:bg-[#1e293b] border border-slate-800 text-slate-300 hover:text-cyan-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <Binary className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.calculusMode}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowConverter(true)}
              className="flex-1 py-1.5 px-2 rounded-xl bg-[#0e172a] hover:bg-[#1e293b] border border-slate-800 text-slate-300 hover:text-cyan-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.unitConverter} / Forex</span>
            </button>
          </div>

          {/* Dedicated Peace & YouTube Media Button requested by user */}
          <button
            type="button"
            onClick={() => setShowPeaceMedia(true)}
            className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-red-950/30 via-slate-900 to-cyan-950/30 hover:from-red-900/40 hover:to-cyan-900/40 border border-slate-800 hover:border-cyan-500/50 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98"
          >
            <Youtube className="w-4 h-4 text-red-500" />
            <span>{settings.language === 'bn' ? 'ঠাকুরের শান্তি ও সাঈদীর বয়ান (ইউটিউব)' : 'Peace Chants & Sayedee Waz (YouTube)'}</span>
          </button>
        </div>

        {/* Real Physical-Feel Calculator Body */}
        <div className="w-full rounded-3xl bg-[#0a1120] border border-[#1a2947] p-3.5 sm:p-4 shadow-2xl flex flex-col gap-3 backdrop-blur-xl">
          {/* LCD / OLED Display Screen */}
          <Display
            expression={expression}
            result={result}
            isEvaluated={isEvaluated}
            angleUnit={settings.angleUnit}
            autoSaveEnabled={settings.autoSave}
            fontSizeOption={settings.displayFontSize}
            onCopy={handleCopyResult}
            copied={copied}
            errorMessage={errorMessage}
          />

          {/* Keypad Matrix */}
          <Keypad
            onDigit={handleDigit}
            onOperator={handleOperator}
            onScientific={handleScientific}
            onClear={handleClear}
            onBackspace={handleBackspace}
            onToggleSign={handleToggleSign}
            onEquals={handleEquals}
            onPercent={handlePercent}
            onDecimal={handleDecimal}
            buttonSize={settings.buttonSize}
            isScientificExpanded={isScientificExpanded}
            onToggleScientific={() => setIsScientificExpanded(!isScientificExpanded)}
            angleUnit={settings.angleUnit}
            onToggleAngleUnit={handleToggleAngleUnit}
            bengaliDigits={settings.bengaliDigits}
          />
        </div>
      </main>

      {/* Footer Branding & Android Readiness Note */}
      <footer className="w-full max-w-md mx-auto text-center py-1 text-[11px] text-slate-500 flex items-center justify-between px-3">
        <span className="flex items-center gap-1">
          <HardDrive className="w-3 h-3 text-cyan-400/60" />
          <span>Auto-file organizer active</span>
        </span>
        <span className="text-slate-400 font-mono text-[10px]">
          v1.0.0 · Poran Tech
        </span>
      </footer>

      {/* Automatic Calculation File Manager Modal */}
      <FileManager
        isOpen={showFileManager}
        onClose={() => {
          setShowFileManager(false);
          refreshTodayCount();
        }}
        onSelectCalculation={handleSelectCalculation}
        lang={settings.language}
      />

      {/* Full Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onUpdateSettings={(newVals) => {
          const updated = { ...settings, ...newVals };
          setSettings(updated);
          saveSettings(updated);
        }}
        onHistoryCleared={refreshTodayCount}
      />

      {/* Calculus Panel */}
      <CalculusPanel
        isOpen={showCalculus}
        onClose={() => setShowCalculus(false)}
        onSendToCalc={(val) => {
          setExpression(val);
          setResult(val);
          setIsEvaluated(true);
        }}
        lang={settings.language}
        angleUnit={settings.angleUnit}
        autoSave={settings.autoSave}
      />

      {/* Converter Panel (Units & Forex) */}
      <ConverterPanel
        isOpen={showConverter}
        onClose={() => setShowConverter(false)}
        onSendToCalc={(val) => {
          setExpression(val);
          setResult(val);
          setIsEvaluated(true);
        }}
        lang={settings.language}
        autoSave={settings.autoSave}
      />

      {/* Peace & Spiritual YouTube Media Modal (ঠাকুরের শান্তি ও সাঈদীর বয়ান) */}
      <PeaceMediaModal
        isOpen={showPeaceMedia}
        onClose={() => setShowPeaceMedia(false)}
        lang={settings.language}
      />
    </div>
  );
}
