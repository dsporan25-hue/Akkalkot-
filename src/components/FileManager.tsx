import React, { useState, useEffect } from 'react';
import {
  Folder,
  ChevronRight,
  ChevronDown,
  Trash2,
  Copy,
  Share2,
  Printer,
  Download,
  Search,
  X,
  Clock,
  ArrowUpRight,
  AlertTriangle,
  FileText
} from 'lucide-react';
import {
  calculatorStorage,
  DailyCalculationFile,
  CalculationRecord,
} from '../services/storage';
import { translations, Language } from '../services/i18n';

interface FileManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCalculation: (calc: CalculationRecord) => void;
  lang: Language;
}

export const FileManager: React.FC<FileManagerProps> = ({
  isOpen,
  onClose,
  onSelectCalculation,
  lang,
}) => {
  const t = translations[lang];
  const [dailyFiles, setDailyFiles] = useState<DailyCalculationFile[]>([]);
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Deletion Confirmation Modal state
  const [confirmDelete, setConfirmDelete] = useState<{
    type: 'file' | 'record' | 'all';
    dateString?: string;
    recordId?: string;
  } | null>(null);

  // Printable report preview state
  const [printDate, setPrintDate] = useState<string | null>(null);

  const loadFiles = async () => {
    const files = await calculatorStorage.getAllDailyFiles();
    setDailyFiles(files);
    // Expand the most recent date by default if available
    if (files.length > 0 && Object.keys(expandedDates).length === 0) {
      setExpandedDates({ [files[0].dateString]: true });
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadFiles();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleExpand = (dateString: string) => {
    setExpandedDates((prev) => ({
      ...prev,
      [dateString]: !prev[dateString],
    }));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleShare = async (calc: CalculationRecord) => {
    const text = `${calc.expression} = ${calc.result} (${calc.dateString} ${calc.timeString})`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Poran Smart Calculator Record',
          text,
        });
      } catch {
        handleCopy(text, calc.id);
      }
    } else {
      handleCopy(text, calc.id);
    }
  };

  const triggerDelete = async () => {
    if (!confirmDelete) return;

    if (confirmDelete.type === 'file' && confirmDelete.dateString) {
      await calculatorStorage.deleteDailyFile(confirmDelete.dateString);
    } else if (confirmDelete.type === 'record' && confirmDelete.dateString && confirmDelete.recordId) {
      await calculatorStorage.deleteCalculationRecord(confirmDelete.dateString, confirmDelete.recordId);
    } else if (confirmDelete.type === 'all') {
      await calculatorStorage.clearAllHistory();
    }

    setConfirmDelete(null);
    await loadFiles();
  };

  const handlePrintDailyReport = (file: DailyCalculationFile) => {
    setPrintDate(file.dateString);
    setTimeout(() => {
      window.print();
    }, 250);
  };

  const handleExportCSV = (file: DailyCalculationFile) => {
    const rows = [
      ['Date', 'Time', 'Expression', 'Result', 'Type'],
      ...file.records.map((r) => [r.dateString, r.timeString, `"${r.expression.replace(/"/g, '""')}"`, `"${r.result}"`, r.type]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${file.fileName.replace('.dat', '')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered files when searching
  const filteredFiles = dailyFiles
    .map((file) => {
      if (!searchQuery.trim()) return file;
      const q = searchQuery.toLowerCase();
      const matchedRecords = file.records.filter(
        (r) =>
          r.expression.toLowerCase().includes(q) ||
          r.result.toLowerCase().includes(q) ||
          r.timeString.toLowerCase().includes(q)
      );
      if (matchedRecords.length > 0 || file.dateString.includes(q)) {
        return {
          ...file,
          records: matchedRecords.length > 0 ? matchedRecords : file.records,
        };
      }
      return null;
    })
    .filter(Boolean) as DailyCalculationFile[];

  const totalCalculationsCount = dailyFiles.reduce((acc, f) => acc + f.itemCount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl bg-[#091122] border border-[#1e2f52] shadow-2xl overflow-hidden text-slate-100">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                {t.fileManager}
              </h2>
              <div className="text-xs text-slate-400">
                {dailyFiles.length} {lang === 'bn' ? 'টি দৈনিক ফাইল' : 'daily files'} · {totalCalculationsCount} {t.totalCalculations}
              </div>
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

        {/* Search Bar */}
        <div className="px-5 py-3 border-b border-slate-800/60 bg-slate-900/30">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Main Files Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {filteredFiles.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center px-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-500 mb-3">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-base font-semibold text-slate-300">{t.noRecordsYet}</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1">{t.noRecordsDesc}</p>
            </div>
          ) : (
            filteredFiles.map((file) => {
              const isExpanded = expandedDates[file.dateString] || Boolean(searchQuery);
              const friendlyDate = calculatorStorage.formatFriendlyDate(file.dateString, lang);

              return (
                <div
                  key={file.dateString}
                  className="rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-hidden transition-all shadow-sm"
                >
                  {/* Daily File Header Bar */}
                  <div
                    onClick={() => toggleExpand(file.dateString)}
                    className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-850/60 transition-colors select-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-950/70 border border-cyan-800/50 flex items-center justify-center text-cyan-400 font-mono text-xs">
                        <Folder className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-100">{friendlyDate}</span>
                          <span className="text-xs text-slate-400 font-mono">({file.dateString})</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>{file.fileName}</span>
                          <span>·</span>
                          <span className="text-cyan-400 font-medium">
                            {file.records.length} {t.totalCalculations}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {/* Export PDF Button */}
                      <button
                        type="button"
                        onClick={() => handlePrintDailyReport(file)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
                        title={t.exportPdf}
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      {/* Export CSV Button */}
                      <button
                        type="button"
                        onClick={() => handleExportCSV(file)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
                        title={t.exportCsv}
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      {/* Delete File Button with Confirmation */}
                      <button
                        type="button"
                        onClick={() => setConfirmDelete({ type: 'file', dateString: file.dateString })}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                        title={t.delete}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Expand/Collapse Chevron */}
                      <button
                        type="button"
                        onClick={() => toggleExpand(file.dateString)}
                        className="p-1.5 text-slate-400 hover:text-white"
                      >
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded File Contents: Individual Calculation Records */}
                  {isExpanded && (
                    <div className="border-t border-slate-800/80 bg-slate-950/40 p-2 sm:p-3 space-y-2">
                      {file.records.map((calc) => (
                        <div
                          key={calc.id}
                          className="group p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/70 hover:border-cyan-500/40 transition-all flex flex-col gap-1.5"
                        >
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span className="flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3 text-cyan-400/70" />
                              {calc.timeString}
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300 font-mono uppercase">
                              {calc.type}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="font-mono text-xs sm:text-sm text-slate-400 truncate">
                                {calc.expression}
                              </div>
                              <div className="font-mono text-base sm:text-lg font-bold text-cyan-300 tracking-tight truncate">
                                = {calc.result}
                              </div>
                            </div>

                            {/* Quick Action Buttons */}
                            <div className="flex items-center gap-1">
                              {/* Load back into calculator display */}
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectCalculation(calc);
                                  onClose();
                                }}
                                className="px-2 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-800/50 text-cyan-300 text-xs font-medium flex items-center gap-1 transition-colors"
                                title={t.loadedIntoCalc}
                              >
                                <ArrowUpRight className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{t.apply}</span>
                              </button>

                              {/* Copy result */}
                              <button
                                type="button"
                                onClick={() => handleCopy(`${calc.expression} = ${calc.result}`, calc.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                title={t.copy}
                              >
                                {copiedId === calc.id ? (
                                  <span className="text-[10px] text-emerald-400 font-medium">✓</span>
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>

                              {/* Share */}
                              <button
                                type="button"
                                onClick={() => handleShare(calc)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                title={t.share}
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete single record */}
                              <button
                                type="button"
                                onClick={() =>
                                  setConfirmDelete({
                                    type: 'record',
                                    dateString: file.dateString,
                                    recordId: calc.id,
                                  })
                                }
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                                title={t.delete}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Bar */}
        <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>IndexedDB + Offline File Storage Active</span>
          </div>

          {dailyFiles.length > 0 && (
            <button
              type="button"
              onClick={() => setConfirmDelete({ type: 'all' })}
              className="text-rose-400/90 hover:text-rose-300 font-medium transition-colors"
            >
              {t.clearAll}
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal (Prevents accidental loss) */}
      {confirmDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">{t.deleteConfirmTitle}</h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              {confirmDelete.type === 'file'
                ? t.deleteDayMessage
                : confirmDelete.type === 'all'
                ? t.clearHistoryConfirm
                : t.deleteConfirmMessage}
            </p>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={triggerDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white transition-colors"
              >
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Print Container for PDF Generation */}
      {printDate && (
        <div className="print-only fixed inset-0 bg-white text-black p-8 hidden z-100 font-mono">
          <div className="border-b-2 border-black pb-4 mb-4">
            <h1 className="text-2xl font-bold">PORAN SMART CALCULATOR - DAILY REPORT</h1>
            <p className="text-sm">Date: {printDate} | Generated: {new Date().toLocaleString()}</p>
          </div>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-black text-left">
                <th className="py-2">Time</th>
                <th className="py-2">Expression</th>
                <th className="py-2 text-right">Result</th>
                <th className="py-2 text-center">Type</th>
              </tr>
            </thead>
            <tbody>
              {dailyFiles
                .find((f) => f.dateString === printDate)
                ?.records.map((r) => (
                  <tr key={r.id} className="border-b border-gray-300">
                    <td className="py-2 text-gray-700">{r.timeString}</td>
                    <td className="py-2 font-medium">{r.expression}</td>
                    <td className="py-2 font-bold text-right">{r.result}</td>
                    <td className="py-2 text-center text-xs uppercase">{r.type}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="mt-8 text-xs text-gray-500 text-center">
            Report generated by Poran Smart Calculator · Android Ready
          </div>
        </div>
      )}
    </div>
  );
};
