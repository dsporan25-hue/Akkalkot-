import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Check, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallButton: React.FC<{ lang?: 'en' | 'bn' }> = ({ lang = 'en' }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  if (isInstalled) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold transition-all active:scale-95"
        title="Install Android App / PWA"
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">
          {lang === 'bn' ? 'অ্যাপ ইনস্টল' : 'Install App'}
        </span>
      </button>

      {showGuide && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-base">
                  {lang === 'bn' ? 'অ্যান্ড্রয়েড ইনস্টল নির্দেশিকা' : 'Install on Android / Phone'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed space-y-2">
              {isIOS ? (
                <>
                  1. Tap the <strong>Share</strong> button (box with arrow) at the bottom of Safari.<br />
                  2. Scroll down and tap <strong>Add to Home Screen</strong>.<br />
                  3. Tap <strong>Add</strong> in the top right.
                </>
              ) : (
                <>
                  {lang === 'bn' ? (
                    <>
                      ১. আপনার ক্রোম ব্রাউজারের উপরে ডানদিকের তিনটি ডট (⋮) বাটনে চাপ দিন।<br />
                      ২. <strong>"Add to Home Screen"</strong> বা <strong>"Install App"</strong> সিলেক্ট করুন।<br />
                      ৩. অ্যাপটি আপনার ফোনের অ্যাপ ড্রয়ারে ইনস্টল হয়ে যাবে এবং অফলাইনেও চলবে!
                    </>
                  ) : (
                    <>
                      1. Open the browser menu (⋮) in the top-right corner.<br />
                      2. Select <strong>"Install App"</strong> or <strong>"Add to Home screen"</strong>.<br />
                      3. Poran Smart Calculator will be added to your home screen with offline daily storage!
                    </>
                  )}
                </>
              )}
            </p>

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="mt-4 w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
            >
              {lang === 'bn' ? 'ঠিক আছে' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
