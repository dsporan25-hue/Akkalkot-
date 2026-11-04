/**
 * Poran Smart Calculator - Storage Engine
 * Persistent storage using IndexedDB with fallback/dual-sync in localStorage.
 * Automatically organizes all completed calculations into daily files.
 */

export interface CalculationRecord {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  dateString: string; // YYYY-MM-DD
  timeString: string; // HH:mm:ss a
  type: 'basic' | 'scientific' | 'calculus' | 'unit' | 'currency';
  meta?: Record<string, string>;
}

export interface DailyCalculationFile {
  dateString: string; // Key: YYYY-MM-DD
  fileName: string;   // e.g., "calc_2026-11-04.dat"
  itemCount: number;
  lastUpdated: number;
  records: CalculationRecord[];
}

const DB_NAME = 'poran_calculator_db';
const DB_VERSION = 1;
const STORE_NAME = 'daily_files';
const LOCAL_STORAGE_KEY = 'poran_calculator_daily_files_backup';

class CalculatorStorage {
  private dbPromise: Promise<IDBDatabase | null>;

  constructor() {
    this.dbPromise = this.initIndexedDB();
  }

  private initIndexedDB(): Promise<IDBDatabase | null> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return Promise.resolve(null);
    }

    return new Promise((resolve) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'dateString' });
          }
        };

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = () => {
          console.warn('IndexedDB unavailable, using localStorage sync fallback.');
          resolve(null);
        };
      } catch (e) {
        console.warn('IndexedDB open error:', e);
        resolve(null);
      }
    });
  }

  // Helper for localStorage fallback
  private getLocalBackup(): Record<string, DailyCalculationFile> {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  private setLocalBackup(data: Record<string, DailyCalculationFile>) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  /**
   * Automatically saves a completed calculation into today's daily file.
   * No manual save button needed.
   */
  async autoSaveCalculation(
    expression: string,
    result: string,
    type: CalculationRecord['type'] = 'basic',
    meta?: Record<string, string>
  ): Promise<CalculationRecord> {
    const now = new Date();
    const dateString = this.formatDate(now);
    const timeString = this.formatTime(now);

    const record: CalculationRecord = {
      id: `calc_${now.getTime()}_${Math.random().toString(36).substring(2, 7)}`,
      expression,
      result,
      timestamp: now.getTime(),
      dateString,
      timeString,
      type,
      meta,
    };

    const db = await this.dbPromise;
    let dailyFile: DailyCalculationFile;

    if (db) {
      dailyFile = await new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(dateString);

        req.onsuccess = () => {
          let file: DailyCalculationFile = req.result;
          if (!file) {
            file = {
              dateString,
              fileName: `calc_${dateString.replace(/-/g, '_')}.dat`,
              itemCount: 0,
              lastUpdated: now.getTime(),
              records: [],
            };
          }
          // Avoid duplicate instant double-taps
          const last = file.records[file.records.length - 1];
          if (last && last.expression === expression && last.result === result && (now.getTime() - last.timestamp < 1000)) {
            resolve(file);
            return;
          }

          file.records.push(record);
          file.itemCount = file.records.length;
          file.lastUpdated = now.getTime();
          store.put(file);
          resolve(file);
        };

        req.onerror = () => {
          resolve(this.saveToLocalStorageFallback(record, dateString, now.getTime()));
        };
      });
    } else {
      dailyFile = this.saveToLocalStorageFallback(record, dateString, now.getTime());
    }

    // Mirror to localStorage for dual-layer persistence
    const backup = this.getLocalBackup();
    backup[dateString] = dailyFile;
    this.setLocalBackup(backup);

    return record;
  }

  private saveToLocalStorageFallback(
    record: CalculationRecord,
    dateString: string,
    timestamp: number
  ): DailyCalculationFile {
    const backup = this.getLocalBackup();
    let file = backup[dateString];
    if (!file) {
      file = {
        dateString,
        fileName: `calc_${dateString.replace(/-/g, '_')}.dat`,
        itemCount: 0,
        lastUpdated: timestamp,
        records: [],
      };
    }
    file.records.push(record);
    file.itemCount = file.records.length;
    file.lastUpdated = timestamp;
    backup[dateString] = file;
    this.setLocalBackup(backup);
    return file;
  }

  /**
   * Retrieves all daily files ordered newest-first.
   */
  async getAllDailyFiles(): Promise<DailyCalculationFile[]> {
    const db = await this.dbPromise;

    if (db) {
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();

        req.onsuccess = () => {
          const files: DailyCalculationFile[] = req.result || [];
          if (files.length === 0) {
            // Check if localStorage has records to populate
            const local = Object.values(this.getLocalBackup());
            if (local.length > 0) {
              this.syncToIndexedDB(local);
              resolve(local.sort((a, b) => b.lastUpdated - a.lastUpdated));
              return;
            }
          }
          resolve(files.sort((a, b) => b.lastUpdated - a.lastUpdated));
        };

        req.onerror = () => {
          const local = Object.values(this.getLocalBackup());
          resolve(local.sort((a, b) => b.lastUpdated - a.lastUpdated));
        };
      });
    } else {
      const local = Object.values(this.getLocalBackup());
      return local.sort((a, b) => b.lastUpdated - a.lastUpdated);
    }
  }

  private async syncToIndexedDB(files: DailyCalculationFile[]) {
    const db = await this.dbPromise;
    if (!db) return;
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      files.forEach((f) => store.put(f));
    } catch (e) {
      console.warn('Sync to indexedDB failed:', e);
    }
  }

  /**
   * Get a specific daily file by dateString (YYYY-MM-DD).
   */
  async getDailyFile(dateString: string): Promise<DailyCalculationFile | null> {
    const db = await this.dbPromise;
    if (db) {
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(dateString);
        req.onsuccess = () => resolve(req.result || this.getLocalBackup()[dateString] || null);
        req.onerror = () => resolve(this.getLocalBackup()[dateString] || null);
      });
    }
    return this.getLocalBackup()[dateString] || null;
  }

  /**
   * Delete an entire daily file.
   */
  async deleteDailyFile(dateString: string): Promise<boolean> {
    const db = await this.dbPromise;
    if (db) {
      await new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(dateString);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      });
    }
    const backup = this.getLocalBackup();
    delete backup[dateString];
    this.setLocalBackup(backup);
    return true;
  }

  /**
   * Delete an individual calculation record from a day's file.
   */
  async deleteCalculationRecord(dateString: string, recordId: string): Promise<boolean> {
    const file = await this.getDailyFile(dateString);
    if (!file) return false;

    file.records = file.records.filter((r) => r.id !== recordId);
    file.itemCount = file.records.length;

    if (file.itemCount === 0) {
      return this.deleteDailyFile(dateString);
    }

    const db = await this.dbPromise;
    if (db) {
      await new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(file);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      });
    }
    const backup = this.getLocalBackup();
    backup[dateString] = file;
    this.setLocalBackup(backup);
    return true;
  }

  /**
   * Search across all daily files for matching expression or result.
   */
  async searchCalculations(query: string): Promise<{ dateString: string; record: CalculationRecord }[]> {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return [];

    const files = await this.getAllDailyFiles();
    const matches: { dateString: string; record: CalculationRecord }[] = [];

    for (const file of files) {
      for (const rec of file.records) {
        if (
          rec.expression.toLowerCase().includes(cleanQuery) ||
          rec.result.toLowerCase().includes(cleanQuery) ||
          rec.timeString.toLowerCase().includes(cleanQuery)
        ) {
          matches.push({ dateString: file.dateString, record: rec });
        }
      }
    }
    return matches;
  }

  /**
   * Clears all history files permanently.
   */
  async clearAllHistory(): Promise<void> {
    const db = await this.dbPromise;
    if (db) {
      await new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.clear();
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      });
    }
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }

  /**
   * Export all daily files as JSON backup.
   */
  async exportJSONBackup(): Promise<string> {
    const files = await this.getAllDailyFiles();
    const payload = {
      app: 'Poran Smart Calculator',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      dailyFiles: files,
    };
    return JSON.stringify(payload, null, 2);
  }

  /**
   * Restore daily files from JSON backup.
   */
  async restoreFromJSON(jsonString: string): Promise<{ success: boolean; count: number }> {
    try {
      const data = JSON.parse(jsonString);
      if (!data.dailyFiles || !Array.isArray(data.dailyFiles)) {
        return { success: false, count: 0 };
      }

      const files: DailyCalculationFile[] = data.dailyFiles;
      const backup = this.getLocalBackup();

      for (const file of files) {
        if (file.dateString && Array.isArray(file.records)) {
          backup[file.dateString] = file;
        }
      }
      this.setLocalBackup(backup);
      await this.syncToIndexedDB(files);

      return { success: true, count: files.length };
    } catch (e) {
      console.error('Import parse error:', e);
      return { success: false, count: 0 };
    }
  }

  // Utility helpers
  formatDate(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatTime(d: Date): string {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  }

  formatFriendlyDate(dateString: string, lang: 'en' | 'bn' = 'en'): string {
    const today = this.formatDate(new Date());
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = this.formatDate(yesterdayDate);

    if (dateString === today) {
      return lang === 'bn' ? 'আজ' : 'Today';
    }
    if (dateString === yesterday) {
      return lang === 'bn' ? 'গতকাল' : 'Yesterday';
    }

    try {
      const [y, m, d] = dateString.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  }
}

export const calculatorStorage = new CalculatorStorage();
