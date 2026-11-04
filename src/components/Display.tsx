import React, { useRef, useEffect } from 'react';
import { Copy, Check, HardDrive } from 'lucide-react';
import { DisplaySizeOption } from '../services/settings';

interface DisplayProps {
  expression: string;
  result: string;
  isEvaluated: boolean;
  angleUnit: 'deg' | 'rad';
  autoSaveEnabled: boolean;
  fontSizeOption: DisplaySizeOption;
  onCopy: () => void;
  copied: boolean;
  errorMessage?: string;
}

export const Display: React.FC<DisplayProps> = ({
  expression,
  result,
  isEvaluated,
  angleUnit,
  autoSaveEnabled,
  fontSizeOption,
  onCopy,
  copied,
  errorMessage,
}) => {
  const exprContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll expression to right on new input
  useEffect(() => {
    if (exprContainerRef.current) {
      exprContainerRef.current.scrollLeft = exprContainerRef.current.scrollWidth;
    }
  }, [expression]);

  const resultFontSizeClass = {
    small: 'text-3xl sm:text-4xl',
    medium: 'text-4xl sm:text-5xl',
    large: 'text-5xl sm:text-6xl',
  }[fontSizeOption];

  const exprFontSizeClass = {
    small: 'text-base sm:text-lg',
    medium: 'text-lg sm:text-xl',
    large: 'text-xl sm:text-2xl',
  }[fontSizeOption];

  return (
    <div className="w-full relative rounded-2xl bg-[#091122]/95 border border-[#1a2947] p-4 flex flex-col justify-between shadow-inner backdrop-blur-md overflow-hidden min-h-[145px]">
      {/* Top Status Bar Inside Display */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-1 select-none">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/40 text-cyan-400 font-mono text-[10px] font-bold tracking-wider">
            {angleUnit.toUpperCase()}
          </span>
          {autoSaveEnabled && (
            <span className="flex items-center gap-1 text-[11px] text-cyan-400/90 font-medium">
              <HardDrive className="w-3 h-3 text-cyan-400" />
              <span>Auto-File</span>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onCopy}
          className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-cyan-300 transition-colors px-2 py-0.5 rounded hover:bg-slate-800/60"
          title="Copy Result"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 opacity-70" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Expression Row */}
      <div
        ref={exprContainerRef}
        className={`w-full overflow-x-auto whitespace-nowrap scrollbar-none text-right font-mono text-slate-400 transition-all py-1 ${exprFontSizeClass}`}
      >
        {expression || '0'}
      </div>

      {/* Main Result Row */}
      <div className="w-full flex items-baseline justify-end gap-1 mt-1">
        {errorMessage ? (
          <div className="text-rose-400 font-semibold text-lg sm:text-xl font-mono text-right animate-pulse">
            {errorMessage}
          </div>
        ) : (
          <div
            onClick={onCopy}
            className={`font-mono font-bold tracking-tight text-right text-slate-50 cursor-pointer hover:text-cyan-300 transition-colors overflow-x-auto whitespace-nowrap scrollbar-none select-all ${resultFontSizeClass} ${
              isEvaluated ? 'text-cyan-300' : ''
            }`}
          >
            {result || '0'}
          </div>
        )}
      </div>
    </div>
  );
};
