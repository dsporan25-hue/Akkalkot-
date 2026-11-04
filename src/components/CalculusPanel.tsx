import React, { useState } from 'react';
import { X, Play, ArrowUpRight, Check, HardDrive } from 'lucide-react';
import { MathEngine } from '../services/mathEngine';
import { translations, Language } from '../services/i18n';
import { calculatorStorage } from '../services/storage';

interface CalculusPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSendToCalc: (val: string) => void;
  lang: Language;
  angleUnit: 'deg' | 'rad';
  autoSave: boolean;
}

export const CalculusPanel: React.FC<CalculusPanelProps> = ({
  isOpen,
  onClose,
  onSendToCalc,
  lang,
  angleUnit,
  autoSave,
}) => {
  const t = translations[lang];
  const [tab, setTab] = useState<'diff' | 'int'>('diff');

  // Differentiation state
  const [diffFunc, setDiffFunc] = useState('x^2 + 3*x');
  const [diffX, setDiffX] = useState('2');
  const [diffResult, setDiffResult] = useState<{ value: string; step: string } | null>(null);

  // Integration state
  const [intFunc, setIntFunc] = useState('2*x + 1');
  const [intA, setIntA] = useState('0');
  const [intB, setIntB] = useState('3');
  const [intResult, setIntResult] = useState<{ value: string; step: string } | null>(null);

  const [savedStatus, setSavedStatus] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleComputeDiff = async () => {
    setErrorMsg(null);
    try {
      const x0 = parseFloat(diffX);
      if (isNaN(x0)) throw new Error('Please enter a valid numeric value for x');

      const res = MathEngine.differentiate(diffFunc, x0, angleUnit);
      setDiffResult({
        value: res.formatted,
        step: `d/dx [${diffFunc}] evaluated at x = ${x0}`,
      });

      if (autoSave) {
        await calculatorStorage.autoSaveCalculation(
          `d/dx(${diffFunc})|_{x=${x0}}`,
          res.formatted,
          'calculus'
        );
        setSavedStatus(lang === 'bn' ? 'ফাইলে সেভ হয়েছে!' : 'Saved to daily file!');
        setTimeout(() => setSavedStatus(null), 2000);
      }
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Calculation error');
    }
  };

  const handleComputeInt = async () => {
    setErrorMsg(null);
    try {
      const a = parseFloat(intA);
      const b = parseFloat(intB);
      if (isNaN(a) || isNaN(b)) throw new Error('Please enter valid numeric limits a and b');

      const res = MathEngine.integrate(intFunc, a, b, 600, angleUnit);
      setIntResult({
        value: res.formatted,
        step: `∫[${a} to ${b}] (${intFunc}) dx`,
      });

      if (autoSave) {
        await calculatorStorage.autoSaveCalculation(
          `∫[${a}, ${b}] (${intFunc}) dx`,
          res.formatted,
          'calculus'
        );
        setSavedStatus(lang === 'bn' ? 'ফাইলে সেভ হয়েছে!' : 'Saved to daily file!');
        setTimeout(() => setSavedStatus(null), 2000);
      }
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Calculation error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[92vh] flex flex-col rounded-3xl bg-[#091122] border border-[#1e2f52] shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40">
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span>{t.calculusMode}</span>
            </h2>
            <div className="text-xs text-slate-400">
              Numerical Differentiation & Definite Integration
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3 pb-2 border-b border-slate-800/60 bg-slate-900/30">
          <div className="flex rounded-xl bg-slate-950/80 p-1 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setTab('diff');
                setErrorMsg(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                tab === 'diff'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.derivative}
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('int');
                setErrorMsg(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                tab === 'int'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.integral}
            </button>
          </div>
        </div>

        {/* Body Form */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {tab === 'diff' ? (
            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {t.functionFx}
                </label>
                <input
                  type="text"
                  value={diffFunc}
                  onChange={(e) => setDiffFunc(e.target.value)}
                  placeholder="e.g. x^2 + 3*x or sin(x)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-500/50"
                />
                <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-400">
                  <span>Quick presets:</span>
                  {['x^2 + 3*x', 'sin(x)', '3*x^3 - 5*x', 'e^x'].map((fn) => (
                    <button
                      key={fn}
                      type="button"
                      onClick={() => setDiffFunc(fn)}
                      className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono transition-colors"
                    >
                      {fn}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {t.evalAtX}
                </label>
                <input
                  type="number"
                  step="any"
                  value={diffX}
                  onChange={(e) => setDiffX(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <button
                type="button"
                onClick={handleComputeDiff}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-500/20 active:scale-98"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{t.calculate}</span>
              </button>

              {diffResult && (
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-2 animate-in fade-in">
                  <div className="text-xs text-slate-400 font-mono">{diffResult.step}</div>
                  <div className="text-2xl font-bold font-mono text-cyan-300">
                    = {diffResult.value}
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-850">
                    <button
                      type="button"
                      onClick={() => {
                        onSendToCalc(diffResult.value);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{t.useInCalc}</span>
                    </button>
                    {savedStatus && (
                      <span className="text-xs text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        {savedStatus}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {t.functionFx}
                </label>
                <input
                  type="text"
                  value={intFunc}
                  onChange={(e) => setIntFunc(e.target.value)}
                  placeholder="e.g. 2*x + 1 or x^2"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-500/50"
                />
                <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-400">
                  <span>Quick presets:</span>
                  {['2*x + 1', 'x^2', 'sin(x)', '3*x^2 + 2'].map((fn) => (
                    <button
                      key={fn}
                      type="button"
                      onClick={() => setIntFunc(fn)}
                      className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono transition-colors"
                    >
                      {fn}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {t.lowerBound}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={intA}
                    onChange={(e) => setIntA(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {t.upperBound}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={intB}
                    onChange={(e) => setIntB(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleComputeInt}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-500/20 active:scale-98"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{t.calculate}</span>
              </button>

              {intResult && (
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-2 animate-in fade-in">
                  <div className="text-xs text-slate-400 font-mono">{intResult.step}</div>
                  <div className="text-2xl font-bold font-mono text-cyan-300">
                    = {intResult.value}
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-850">
                    <button
                      type="button"
                      onClick={() => {
                        onSendToCalc(intResult.value);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{t.useInCalc}</span>
                    </button>
                    {savedStatus && (
                      <span className="text-xs text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        {savedStatus}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs font-mono">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <HardDrive className="w-3 h-3 text-cyan-400" />
            <span>Auto-saves to Daily Files</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
