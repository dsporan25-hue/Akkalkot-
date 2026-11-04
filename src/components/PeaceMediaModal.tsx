import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Plus,
  Youtube,
  Heart,
  Share2,
  Trash2,
  Search,
  ExternalLink,
  Sparkles,
  Music2
} from 'lucide-react';

export interface PeaceMediaItem {
  id: string;
  category: 'thakur' | 'sayedee' | 'custom';
  title: string;
  speaker: string;
  youtubeId: string;
  youtubeUrl: string;
  duration?: string;
  description?: string;
}

const DEFAULT_MEDIA_ITEMS: PeaceMediaItem[] = [
  // ঠাকুরের শান্তি (Thakur / Swami Samarth Akkalkot Peace)
  {
    id: 'thakur_1',
    category: 'thakur',
    title: 'শ্রী স্বামী সমর্থ তারক মন্ত্র - পরম শান্তি ও মন শান্ত করার জপ',
    speaker: 'শ্রী স্বামী সমর্থ মহারাজ (আক্কেলকোট)',
    youtubeId: 'qQjHkR-3l1U',
    youtubeUrl: 'https://www.youtube.com/watch?v=qQjHkR-3l1U',
    duration: '১৫ মিনিট',
    description: 'আক্কেলকোট ঠাকুরের শান্তির তারক মন্ত্র। মানসিক দুশ্চিন্তা ও অশান্তি দূর করার অনন্য আধ্যাত্মিক জপ।',
  },
  {
    id: 'thakur_2',
    category: 'thakur',
    title: 'ঠাকুরের শান্তির বাণী ও শান্ত সকালের ভজন',
    speaker: 'আক্কেলকোট ধাম সাধকবৃন্দ',
    youtubeId: 'Y8i9wU0oR4I',
    youtubeUrl: 'https://www.youtube.com/watch?v=Y8i9wU0oR4I',
    duration: '২০ মিনিট',
    description: 'হৃদয় শীতল করা আধ্যাত্মিক সুর ও মানসিক শান্তির ধ্যান।',
  },
  {
    id: 'thakur_3',
    category: 'thakur',
    title: 'শ্রী স্বামী সমর্থ স্তোত্র ও ভক্তি সঙ্গীত',
    speaker: 'আক্কেলকোট আধ্যাত্মিক পরিষদ',
    youtubeId: '04i5h-P1N5g',
    youtubeUrl: 'https://www.youtube.com/watch?v=04i5h-P1N5g',
    duration: '১২ মিনিট',
    description: 'ঠাকুরের চরণে আত্মনিবেদন ও মানসিক স্বস্তির অনুপম স্তোত্র।',
  },

  // সাঈদীর ইউটিউব বয়ান (Allama Delwar Hossain Sayedee YouTube Waz)
  {
    id: 'sayedee_1',
    category: 'sayedee',
    title: 'মনের অশান্তি ও দুশ্চিন্তা দূর করার উপায় - অসাধারণ নসীহত',
    speaker: 'আল্লামা দেলোয়ার হোসেন সাঈদী',
    youtubeId: 'w5m_P8sP2l4',
    youtubeUrl: 'https://www.youtube.com/watch?v=w5m_P8sP2l4',
    duration: '৩৫ মিনিট',
    description: 'কুরআন ও সুন্নাহর আলোকে মানুষের জীবনে কিভাবে প্রকৃত শান্তি ও প্রশান্তি নেমে আসে সেই আলোচনা।',
  },
  {
    id: 'sayedee_2',
    category: 'sayedee',
    title: 'পিতা-মাতার সম্মান ও পরিবারের সুখ-শান্তি',
    speaker: 'আল্লামা দেলোয়ার হোসেন সাঈদী',
    youtubeId: 'k1-3P9w9r7E',
    youtubeUrl: 'https://www.youtube.com/watch?v=k1-3P9w9r7E',
    duration: '৪২ মিনিট',
    description: 'পারিবারিক জীবনে ভালোবাসা ও শান্তি বজায় রাখার ঐতিহাসিক ও কালজয়ী বয়ান।',
  },
  {
    id: 'sayedee_3',
    category: 'sayedee',
    title: 'সূরা আর-রহমান তাফসীর - নেয়ামত ও শান্তির সন্ধান',
    speaker: 'আল্লামা দেলোয়ার হোসেন সাঈদী',
    youtubeId: 'L29oR8j1w0M',
    youtubeUrl: 'https://www.youtube.com/watch?v=L29oR8j1w0M',
    duration: '৫০ মিনিট',
    description: 'সূরা আর-রহমানের মধুর তাফসীর ও মহান প্রতিপালকের অশেষ অনুগ্রহ।',
  },
  {
    id: 'sayedee_4',
    category: 'sayedee',
    title: 'ধৈর্য ও শোকর - মুমিনের জীবনের প্রশান্তি',
    speaker: 'আল্লামা দেলোয়ার হোসেন সাঈদী',
    youtubeId: 'P03k8m2L5jQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=P03k8m2L5jQ',
    duration: '২৮ মিনিট',
    description: 'জীবনের কঠিন সময়ে ধৈর্য ধারণ এবং হৃদয়ে আল্লাহর শান্তির সন্ধান।',
  },
];

const STORAGE_KEY = 'poran_peace_media_v1';

interface PeaceMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: 'en' | 'bn';
}

export const PeaceMediaModal: React.FC<PeaceMediaModalProps> = ({
  isOpen,
  onClose,
  lang = 'bn',
}) => {
  const [mediaItems, setMediaItems] = useState<PeaceMediaItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return DEFAULT_MEDIA_ITEMS;
  });

  const [activeTab, setActiveTab] = useState<'all' | 'thakur' | 'sayedee'>('all');
  const [search, setSearch] = useState('');
  const [playingItem, setPlayingItem] = useState<PeaceMediaItem | null>(null);

  // Form to add custom/brother's video
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSpeaker, setNewSpeaker] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState<'thakur' | 'sayedee' | 'custom'>('sayedee');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mediaItems));
    } catch {
      // ignore
    }
  }, [mediaItems]);

  if (!isOpen) return null;

  // Extract YouTube ID from URL or bare ID
  const extractYouTubeId = (urlOrId: string): string => {
    const clean = urlOrId.trim();
    if (clean.length === 11 && !clean.includes('/') && !clean.includes('.')) {
      return clean;
    }
    const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : clean;
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    const ytId = extractYouTubeId(newUrl);
    const newItem: PeaceMediaItem = {
      id: `custom_${Date.now()}`,
      category: newCategory,
      title: newTitle.trim(),
      speaker: newSpeaker.trim() || (newCategory === 'thakur' ? 'ঠাকুরের শান্তি' : 'আল্লামা সাঈদী'),
      youtubeId: ytId,
      youtubeUrl: `https://www.youtube.com/watch?v=${ytId}`,
      duration: 'ইউটিউব ভিডিও',
      description: 'ইউজার কর্তৃক আপলোডকৃত ভিডিও সংগ্রহ।',
    };

    setMediaItems([newItem, ...mediaItems]);
    setNewTitle('');
    setNewSpeaker('');
    setNewUrl('');
    setShowAddForm(false);
  };

  const handleDeleteItem = (id: string) => {
    setMediaItems(mediaItems.filter((i) => i.id !== id));
    if (playingItem?.id === id) {
      setPlayingItem(null);
    }
  };

  const filteredItems = mediaItems.filter((item) => {
    const matchTab = activeTab === 'all' || item.category === activeTab;
    const matchSearch =
      !search.trim() ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.speaker.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-[#091122] border border-[#1e2f52] shadow-2xl overflow-hidden text-slate-100">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Youtube className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>শান্তির বাণী ও বয়ান সংগ্রহ</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                  আক্কেলকোট ও সাঈদী
                </span>
              </h2>
              <div className="text-xs text-slate-400">
                ঠাকুরের শান্তি ও আল্লামা দেলোয়ার হোসেন সাঈদীর ইউটিউব বয়ান
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন ভিডিও যোগ করুন</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Playing Video Screen */}
        {playingItem && (
          <div className="p-3 bg-black border-b border-slate-800 animate-in fade-in">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
              <iframe
                src={`https://www.youtube.com/embed/${playingItem.youtubeId}?autoplay=1&rel=0`}
                title={playingItem.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
            <div className="flex items-center justify-between mt-2.5 px-1">
              <div>
                <h4 className="text-sm font-semibold text-white truncate max-w-md">
                  {playingItem.title}
                </h4>
                <p className="text-xs text-cyan-400">{playingItem.speaker}</p>
              </div>
              <button
                type="button"
                onClick={() => setPlayingItem(null)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
              >
                প্লেয়ার বন্ধ করুন
              </button>
            </div>
          </div>
        )}

        {/* Add New Video Form Drawer */}
        {showAddForm && (
          <form
            onSubmit={handleAddVideo}
            className="p-4 bg-slate-950/90 border-b border-cyan-500/30 space-y-3 animate-in fade-in"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-cyan-300">
              <span>ভাইয়ের জন্য বা নিজের পছন্দের নতুন ইউটিউব ভিডিও আপলোড করুন</span>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                placeholder="ভিডিওর শিরোনাম (Title)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <input
                type="text"
                placeholder="বক্তা বা শিল্পী (যেমন: আল্লামা সাঈদী / ঠাকুর)"
                value={newSpeaker}
                onChange={(e) => setNewSpeaker(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-center">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="ইউটিউব লিংক বা ভিডিও আইডি (যেমন: https://youtube.com/watch?v=...)"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as 'thakur' | 'sayedee' | 'custom')}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="sayedee">সাঈদীর বয়ান</option>
                <option value="thakur">ঠাকুরের শান্তি</option>
                <option value="custom">অন্যান্য / ভাইয়ের পছন্দ</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </form>
        )}

        {/* Filter Tabs and Search Bar */}
        <div className="p-3 border-b border-slate-850 bg-slate-900/40 flex flex-col sm:flex-row gap-2.5 items-center justify-between">
          <div className="flex rounded-xl bg-slate-950/80 p-1 border border-slate-800 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'all'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              সবগুলো ({mediaItems.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('thakur')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'thakur'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ঠাকুরের শান্তি ({mediaItems.filter((i) => i.category === 'thakur').length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sayedee')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'sayedee'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              সাঈদীর বয়ান ({mediaItems.filter((i) => i.category === 'sayedee').length})
            </button>
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ভিডিও খুঁজুন..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Video List Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              কোনো ভিডিও পাওয়া যায়নি। নতুন ভিডিও যোগ করতে উপরের বাটনে চাপ দিন।
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="group p-3 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Thumbnail / Play Button */}
                  <div
                    onClick={() => setPlayingItem(item)}
                    className="relative w-20 h-14 rounded-xl overflow-hidden bg-slate-950 flex-shrink-0 cursor-pointer border border-slate-800 group-hover:border-cyan-400"
                  >
                    <img
                      src={`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
                      <Play className="w-5 h-5 text-white fill-white drop-shadow" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300">
                        {item.category === 'thakur'
                          ? 'ঠাকুরের শান্তি'
                          : item.category === 'sayedee'
                          ? 'সাঈদীর বয়ান'
                          : 'ইউটিউব'}
                      </span>
                      {item.duration && (
                        <span className="text-[10px] text-slate-400">{item.duration}</span>
                      )}
                    </div>
                    <h3
                      onClick={() => setPlayingItem(item)}
                      className="text-xs sm:text-sm font-semibold text-white hover:text-cyan-300 cursor-pointer truncate mt-0.5"
                    >
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate">{item.speaker}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => setPlayingItem(item)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>প্লে করুন</span>
                  </button>

                  <a
                    href={item.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="ইউটিউবে খুলুন"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  {item.id.startsWith('custom_') && (
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>আক্কেলকোট ধাম ও দেলোয়ার হোসেন সাঈদী শান্তি কালেকশন</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
