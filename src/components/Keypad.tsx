import React from 'react';
import { Delete, ArrowLeftRight } from 'lucide-react';
import { ButtonSizeOption } from '../services/settings';

interface KeypadProps {
  onDigit: (digit: string) => void;
  onOperator: (op: string) => void;
  onScientific: (fn: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onToggleSign: () => void;
  onEquals: () => void;
  onPercent: () => void;
  onDecimal: () => void;
  buttonSize: ButtonSizeOption;
  isScientificExpanded: boolean;
  onToggleScientific: () => void;
  angleUnit: 'deg' | 'rad';
  onToggleAngleUnit: () => void;
  bengaliDigits?: boolean;
}

export const Keypad: React.FC<KeypadProps> = ({
  onDigit,
  onOperator,
  onScientific,
  onClear,
  onBackspace,
  onToggleSign,
  onEquals,
  onPercent,
  onDecimal,
  buttonSize,
  isScientificExpanded,
  onToggleScientific,
  angleUnit,
  onToggleAngleUnit,
}) => {
  // Height and font scaling based on buttonSize setting
  const sizeClasses = {
    medium: 'h-13 text-lg rounded-xl',
    large: 'h-15 text-xl rounded-2xl',
    xlarge: 'h-17 text-2xl rounded-2xl',
  }[buttonSize];

  const sciSizeClasses = {
    medium: 'h-10 text-xs rounded-lg',
    large: 'h-11 text-sm rounded-xl',
    xlarge: 'h-12 text-sm rounded-xl',
  }[buttonSize];

  return (
    <div className="w-full flex flex-col gap-2 select-none">
      {/* Top Utility Bar for Keypad: Scientific Toggle & Angle Mode */}
      <div className="flex items-center justify-between px-1 text-xs">
        <button
          type="button"
          onClick={onToggleScientific}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-cyan-400 font-medium transition-colors border border-cyan-500/20 active:scale-95"
        >
          <span className="text-[11px] font-mono font-semibold tracking-wider">
            {isScientificExpanded ? '▲ HIDE SCIENTIFIC' : '▼ SCIENTIFIC (fx)'}
          </span>
        </button>

        <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={onToggleAngleUnit}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
              angleUnit === 'deg'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            DEG
          </button>
          <button
            type="button"
            onClick={onToggleAngleUnit}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
              angleUnit === 'rad'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            RAD
          </button>
        </div>
      </div>

      {/* Expandable Scientific Keypad Section */}
      {isScientificExpanded && (
        <div className="grid grid-cols-5 gap-1.5 p-2 rounded-2xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150">
          <button
            type="button"
            onClick={() => onScientific('sin(')}
            className={`calc-press ${sciSizeClasses} font-mono font-semibold bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-slate-800`}
          >
            sin
          </button>
          <button
            type="button"
            onClick={() => onScientific('cos(')}
            className={`calc-press ${sciSizeClasses} font-mono font-semibold bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-slate-800`}
          >
            cos
          </button>
          <button
            type="button"
            onClick={() => onScientific('tan(')}
            className={`calc-press ${sciSizeClasses} font-mono font-semibold bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-slate-800`}
          >
            tan
          </button>
          <button
            type="button"
            onClick={() => onScientific('π')}
            className={`calc-press ${sciSizeClasses} font-serif font-bold bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-slate-800`}
          >
            π
          </button>
          <button
            type="button"
            onClick={() => onScientific('e')}
            className={`calc-press ${sciSizeClasses} font-serif font-bold bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-slate-800`}
          >
            e
          </button>

          <button
            type="button"
            onClick={() => onScientific('ln(')}
            className={`calc-press ${sciSizeClasses} font-mono font-semibold bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-slate-800`}
          >
            ln
          </button>
          <button
            type="button"
            onClick={() => onScientific('log(')}
            className={`calc-press ${sciSizeClasses} font-mono font-semibold bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-slate-800`}
          >
            log
          </button>
          <button
            type="button"
            onClick={() => onScientific('√(')}
            className={`calc-press ${sciSizeClasses} font-mono font-semibold bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-slate-800`}
          >
            √
          </button>
          <button
            type="button"
            onClick={() => onScientific('^')}
            className={`calc-press ${sciSizeClasses} font-mono font-semibold bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-slate-800`}
          >
            x^y
          </button>
          <button
            type="button"
            onClick={() => onScientific('!')}
            className={`calc-press ${sciSizeClasses} font-mono font-semibold bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-slate-800`}
          >
            n!
          </button>

          <button
            type="button"
            onClick={() => onScientific('(')}
            className={`calc-press ${sciSizeClasses} font-mono font-bold bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800`}
          >
            (
          </button>
          <button
            type="button"
            onClick={() => onScientific(')')}
            className={`calc-press ${sciSizeClasses} font-mono font-bold bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800`}
          >
            )
          </button>
          <button
            type="button"
            onClick={() => onScientific('asin(')}
            className={`calc-press ${sciSizeClasses} font-mono text-[11px] font-semibold bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-slate-800`}
          >
            sin⁻¹
          </button>
          <button
            type="button"
            onClick={() => onScientific('acos(')}
            className={`calc-press ${sciSizeClasses} font-mono text-[11px] font-semibold bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-slate-800`}
          >
            cos⁻¹
          </button>
          <button
            type="button"
            onClick={() => onScientific('atan(')}
            className={`calc-press ${sciSizeClasses} font-mono text-[11px] font-semibold bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-slate-800`}
          >
            tan⁻¹
          </button>
        </div>
      )}

      {/* Primary Keypad Grid: 4 columns */}
      <div className="grid grid-cols-4 gap-2.5">
        {/* Row 1 */}
        <button
          type="button"
          onClick={onClear}
          className={`calc-press ${sizeClasses} font-bold text-rose-400 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/40 shadow-sm flex items-center justify-center`}
        >
          AC
        </button>
        <button
          type="button"
          onClick={onBackspace}
          className={`calc-press ${sizeClasses} font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 flex items-center justify-center`}
          title="Backspace"
        >
          <Delete className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={onPercent}
          className={`calc-press ${sizeClasses} font-bold text-cyan-400 bg-slate-850 hover:bg-slate-800 border border-cyan-500/20 flex items-center justify-center`}
        >
          %
        </button>
        <button
          type="button"
          onClick={() => onOperator('÷')}
          className={`calc-press ${sizeClasses} font-bold text-2xl text-cyan-300 bg-slate-800/90 hover:bg-slate-700 border border-cyan-500/30 flex items-center justify-center shadow-sm`}
        >
          ÷
        </button>

        {/* Row 2 */}
        <button
          type="button"
          onClick={() => onDigit('7')}
          className={`calc-press ${sizeClasses} font-semibold text-slate-100 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 flex items-center justify-center`}
        >
          7
        </button>
        <button
          type="button"
          onClick={() => onDigit('8')}
          className={`calc-press ${sizeClasses} font-semibold text-slate-100 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 flex items-center justify-center`}
        >
          8
        </button>
        <button
          type="button"
          onClick={() => onDigit('9')}
          className={`calc-press ${sizeClasses} font-semibold text-slate-100 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 flex items-center justify-center`}
        >
          9
        </button>
        <button
          type="button"
          onClick={() => onOperator('×')}
          className={`calc-press ${sizeClasses} font-bold text-2xl text-cyan-300 bg-slate-800/90 hover:bg-slate-700 border border-cyan-500/30 flex items-center justify-center shadow-sm`}
        >
          ×
        </button>

        {/* Row 3 */}
        <button
          type="button"
          onClick={() => onDigit('4')}
          className={`calc-press ${sizeClasses} font-semibold text-slate-100 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 flex items-center justify-center`}
        >
          4
        </button>
        <button
          type="button"
          onClick={() => onDigit('5')}
          className={`calc-press ${sizeClasses} font-semibold text-slate-100 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 flex items-center justify-center`}
        >
          5
        </button>
        <button
          type="button"
          onClick={() => onDigit('6')}
          className={`calc-press ${sizeClasses} font-semibold text-slate-100 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 flex items-center justify-center`}
        >
          6
        </button>
        <button
          type="button"
          onClick={() => onOperator('−')}
          className={`calc-press ${sizeClasses} font-bold text-2xl text-cyan-300 bg-slate-800/90 hover:bg-slate-700 border border-cyan-500/30 flex items-center justify-center shadow-sm`}
        >
          −
        </button>

        {/* Row 4 */}
        <button
          type="button"
          onClick={() => onDigit('1')}
          className={`calc-press ${sizeClasses} font-semibold text-slate-100 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 flex items-center justify-center`}
        >
          1
        </button>
        <button
          type="button"
          onClick={() => onDigit('2')}
          className={`calc-press ${sizeClasses} font-semibold text-slate-100 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 flex items-center justify-center`}
        >
          2
        </button>
        <button
          type="button"
          onClick={() => onDigit('3')}
          className={`calc-press ${sizeClasses} font-semibold text-slate-100 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 flex items-center justify-center`}
        >
          3
        </button>
        <button
          type="button"
          onClick={() => onOperator('+')}
          className={`calc-press ${sizeClasses} font-bold text-2xl text-cyan-300 bg-slate-800/90 hover:bg-slate-700 border border-cyan-500/30 flex items-center justify-center shadow-sm`}
        >
          +
        </button>

        {/* Row 5 */}
        <button
          type="button"
          onClick={onToggleSign}
          className={`calc-press ${sizeClasses} font-semibold text-slate-300 bg-slate-850 hover:bg-slate-800 border border-slate-700/50 flex items-center justify-center`}
          title="Toggle Positive/Negative"
        >
          <ArrowLeftRight className="w-4 h-4 mr-0.5 opacity-70" />
          <span>±</span>
        </button>
        <button
          type="button"
          onClick={() => onDigit('0')}
          className={`calc-press ${sizeClasses} font-semibold text-slate-100 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 flex items-center justify-center`}
        >
          0
        </button>
        <button
          type="button"
          onClick={onDecimal}
          className={`calc-press ${sizeClasses} font-bold text-2xl text-slate-100 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 flex items-center justify-center`}
        >
          .
        </button>
        <button
          type="button"
          onClick={onEquals}
          className={`calc-press ${sizeClasses} font-bold text-3xl bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25 border border-cyan-300/40 flex items-center justify-center transition-all`}
        >
          =
        </button>
      </div>
    </div>
  );
};
