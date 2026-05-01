import React, { useState, useEffect, useCallback } from 'react';
import { 
  Target, AlertTriangle, CheckCircle2, Play, Pause, 
  RotateCcw, Plus, Trash2, Flame, Globe, Crosshair,
  BrainCircuit, Skull, ShieldAlert, Activity, BellRing, Maximize,
  Smartphone, BarChart3
} from 'lucide-react';

// === 🛑 PASTE YOUR GOOGLE GEMINI API KEY HERE 🛑 ===
// Get one for free at: https://aistudio.google.com/
const GEMINI_API_KEY = "AIzaSyBcksMBeZGPa28fPjS1683tJlJWXW_pcC8"; 

// --- Custom Hook for Local Storage ---
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

// --- TRANSLATIONS ---
const TRANSLATIONS = {
  en: {
    appTitle: "WAR ROOM",
    tabs: { dash: "Dash", drill: "Drill", missions: "Missions", audit: "Audit", ai: "AI" },
    realityCheck: "Harsh Reality Check",
    dayProgress: "Day Extinguished",
    gone: "GONE",
    timeLeftDesc: (left) => `You have ${left}% of today remaining. You are bleeding time.`,
    deepWork: "THE DRILL",
    stopMultitasking: "No distractions. No excuses. Execute the mission.",
    focus: "EXECUTE",
    break: "RECOVER",
    highImpact: "Active Missions",
    taskPlaceholder: "What must be done right now?",
    add: "ADD",
    noTasks: "Your mission list is empty. Are you quitting already?",
    aiTitle: "AI Drill Sergeant",
    aiSubtitle: "Report your status. Stop lying to yourself.",
    aiInputPlaceholder: "e.g., 'I feel lazy today. I've been scrolling for 2 hours.'",
    aiAnalyzeBtn: "SUBMIT FOR ANALYSIS",
    aiAnalyzing: "ANALYZING YOUR EXCUSES...",
    sessionsCompleted: "Drills Survived",
    permissionsRequired: "Enable Notifications",
    permissionsDesc: "We need notification access to track you. Do not hide.",
    grantAccess: "GRANT ACCESS",
    nuclearMode: "NUCLEAR MODE",
    screenTimeTitle: "Screen Time Toxicity Audit",
    stSocial: "Social Media / Scrolling (Hrs)",
    stVideo: "Video / Streaming (Hrs)",
    stGame: "Gaming / Meaningless Escapism (Hrs)",
    stAnalyze: "CALCULATE TOXICITY",
    stResultTitle: "TOXICITY REPORT",
    weaknessDetected: "WEAKNESS DETECTED: You left the War Room.",
    drillComplete: "DRILL COMPLETE. Take your pathetic 5 minutes.",
    breakComplete: "BREAK OVER. Get back on the frontline."
  },
  ku: {
    appTitle: "ژووری جەنگ",
    tabs: { dash: "داشبۆرد", drill: "ڕاهێنان", missions: "ئەرکەکان", audit: "پێداچوونەوە", ai: "AI" },
    realityCheck: "ڕاستییە تاڵەکان",
    dayProgress: "ڕۆژی لەناوچوو",
    gone: "ڕۆیشت",
    timeLeftDesc: (left) => `${left}% ی ئەمڕۆت ماوە. کاتت بەفیڕۆ دەڕوات.`,
    deepWork: "ڕاهێنانەکە",
    stopMultitasking: "بێ سەرقاڵبوون. بێ بیانوو. ئەرکەکە جێبەجێ بکە.",
    focus: "جێبەجێکردن",
    break: "چاکبوونەوە",
    highImpact: "ئەرکە چالاکەکان",
    taskPlaceholder: "دەبێت ئێستا چی بکرێت؟",
    add: "زیادکردن",
    noTasks: "لیستی ئەرکەکانت خاڵییە. ئایا هەر لە ئێستاوە خۆت بەدەستەوە دەدەیت؟",
    aiTitle: "ڕاهێنەری AI",
    aiSubtitle: "ڕاپۆرتی بارودۆخت بدە. واز لە درۆکردن لەگەڵ خۆت بهێنە.",
    aiInputPlaceholder: "نموونە: 'ئەمڕۆ تەمەڵم. ٢ کاتژمێرە مۆبایل بەکاردەهێنم.'",
    aiAnalyzeBtn: "بینێرە بۆ شیکردنەوە",
    aiAnalyzing: "شیکردنەوەی بیانووەکانت...",
    sessionsCompleted: "ڕاهێنانە تەواوکراوەکان",
    permissionsRequired: "ئاگادارکردنەوەکان چالاک بکە",
    permissionsDesc: "پێویستمان بە دەسەڵاتی ئاگادارکردنەوەیە بۆ چاودێریکردنت. خۆت مەشێرەوە.",
    grantAccess: "پێدانی دەسەڵات",
    nuclearMode: "دۆخی ئەتۆمی",
    screenTimeTitle: "پێداچوونەوەی ژەهراویبوونی کاتی شاشە",
    stSocial: "تۆڕە کۆمەڵایەتییەکان / سکڕۆڵکردن (کاتژمێر)",
    stVideo: "ڤیدیۆ / ستریمین (کاتژمێر)",
    stGame: "یاریکردن / ڕاکردن لە ڕاستی (کاتژمێر)",
    stAnalyze: "هەژمارکردنی ژەهراویبوون",
    stResultTitle: "ڕاپۆرتی ژەهراویبوون",
    weaknessDetected: "لاوازی دۆزرایەوە: تۆ ژووری جەنگت جێهێشت.",
    drillComplete: "ڕاهێنان تەواو بوو. ٥ خولەکەی خۆت وەربگرە.",
    breakComplete: "پشوو تەواو بوو. بگەڕێوە سەر هێڵی پێشەوە."
  }
};

const QUOTES = {
  en: [
    "No one is coming to save you. Get up.",
    "Procrastination is arrogance. You think you have time.",
    "Suffering is a test. Distraction is a failure.",
    "Stop negotiating with your weaker self."
  ],
  ku: [
    "هیچ کەسێک نایەت بۆ ڕزگارکردنت. هەستە.",
    "دواخستن لەخۆباییبوونە. پێت وایە کاتت هەیە.",
    "ئازارکێشان تاقیکردنەوەیە. سەرقاڵبوون شکستە.",
    "وازبهێنە لە دانوستان لەگەڵ لایەنە لاوازەکەی خۆت."
  ]
};

// --- AUDIO ALARM ---
const playHarshAlarm = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const playBeep = (time) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, ctx.currentTime + time);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + time + 0.2);
      gain.gain.setValueAtTime(0.5, ctx.currentTime + time);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + time + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + time);
      osc.stop(ctx.currentTime + time + 0.2);
    };
    playBeep(0); playBeep(0.3); playBeep(0.6);
  } catch (e) {
    console.log("Audio not supported or blocked.");
  }
};

export default function App() {
  // --- Persistent Local State ---
  const [lang, setLang] = useLocalStorage('warroom_lang', 'en');
  const [tasks, setTasks] = useLocalStorage('warroom_tasks', []);
  const [dailyStats, setDailyStats] = useLocalStorage('warroom_stats', { date: new Date().toDateString(), drills: 0 });
  const [screenTime, setScreenTime] = useLocalStorage('warroom_screentime', { social: "", video: "", game: "" });
  
  // --- UI & Timer State ---
  const [activeTab, setActiveTab] = useState('dash'); 
  const [newTask, setNewTask] = useState("");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState('focus'); 
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // --- AI State ---
  const [aiInput, setAiInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [quote, setQuote] = useState('');
  const [toxicityReport, setToxicityReport] = useState("");
  
  // --- System State ---
  const [notificationsGranted, setNotificationsGranted] = useState(false);
  const [toasts, setToasts] = useState([]);

  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'ku';

  // --- Date Check for Resetting Stats ---
  useEffect(() => {
    if (dailyStats.date !== new Date().toDateString()) {
      setDailyStats({ date: new Date().toDateString(), drills: 0 });
    }
  }, [dailyStats, setDailyStats]);

  // --- Toast Manager ---
  const showToast = useCallback((message, type = 'error') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  // --- Push Notifications ---
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      showToast("Notifications not supported on this device.", "warning");
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setNotificationsGranted(true);
      showToast("Access Granted. We are watching.", "success");
    } else {
      showToast("Access Denied. You are hiding from accountability.", "error");
    }
  };

  const sendPushNotification = useCallback((title, body) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body, icon: "https://cdn-icons-png.flaticon.com/512/1157/1157062.png" });
    }
  }, []);

  // --- Initialization ---
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "granted") {
      setNotificationsGranted(true);
    }
    const currentQuotes = QUOTES[lang];
    setQuote(currentQuotes[Math.floor(Math.random() * currentQuotes.length)]);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [lang]);

  // --- Timer & Tab Switch Detection ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isTimerRunning && timerMode === 'focus') {
        sendPushNotification(t.appTitle, t.weaknessDetected);
        showToast(t.weaknessDetected, "error");
        playHarshAlarm();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    let interval = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      handleTimerComplete();
    }
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isTimerRunning, timeLeft, timerMode, t, sendPushNotification, showToast]);

  const handleTimerComplete = () => {
    playHarshAlarm();
    if (timerMode === 'focus') {
      sendPushNotification(t.appTitle, t.drillComplete);
      showToast(t.drillComplete, "success");
      setDailyStats(prev => ({ ...prev, drills: prev.drills + 1 }));
      setTimerMode('break');
      setTimeLeft(5 * 60);
    } else {
      sendPushNotification(t.appTitle, t.breakComplete);
      showToast(t.breakComplete, "error");
      setTimerMode('focus');
      setTimeLeft(25 * 60);
    }
  };

  // --- Actions ---
  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), text: newTask, completed: false }]);
    setNewTask("");
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => showToast("Fullscreen restricted by browser.", "warning"));
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  // --- AI API Helper ---
  const callGeminiAPI = async (prompt, systemInstruction) => {
    if (!GEMINI_API_KEY) {
      showToast("API Key Missing! Add it to App.jsx to use AI features.", "error");
      return "ERROR: Missing API Key. Go to App.jsx and add your GEMINI_API_KEY.";
    }
    
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] }
    };

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Failure.";
    } catch (err) {
      console.error(err);
      return "Connection failed. Check API Key or Network.";
    }
  };

  // --- Screen Time Analysis ---
  const handleToxicityAudit = async () => {
    const total = Number(screenTime.social) + Number(screenTime.video) + Number(screenTime.game);
    if (total === 0) {
      showToast("Enter your actual wasted time.", "warning");
      return;
    }
    
    setIsAiLoading(true);
    setToxicityReport("");
    
    const prompt = `The user has wasted the following hours today:
    Social Media: ${screenTime.social} hrs
    Video/Streaming: ${screenTime.video} hrs
    Gaming: ${screenTime.game} hrs
    Total: ${total} hrs.`;

    const systemPrompt = `Act as a brutal, military-style discipline coach. Tear apart their screen time usage. Explain the long term damage this is doing to their life, brain, and goals. Give them a Toxicity Score out of 100. Tell them HOW to fix this specific weakness. Respond entirely in ${lang === 'en' ? 'English' : 'Kurdish Sorani'}. Keep it to 3 harsh paragraphs.`;

    const response = await callGeminiAPI(prompt, systemPrompt);
    setToxicityReport(response);
    setIsAiLoading(false);
  };

  // --- AI Interrogation ---
  const handleAIAnalysis = async () => {
    if (!aiInput.trim()) return;
    setIsAiLoading(true);
    setAiResponse("");

    const totalWasted = Number(screenTime.social) + Number(screenTime.video) + Number(screenTime.game);
    const systemPrompt = `You are an elite, brutal discipline coach. 
    1. Destroy the user's excuses based on their report.
    2. Give them a strict 3-step immediate action plan to build discipline based on their failure.
    Respond in ${lang === 'en' ? 'English' : 'Kurdish Sorani'}. Be demanding and uncompromising.`;

    const userPrompt = `[BACKGROUND DATA] Drills Survived Today: ${dailyStats.drills} | Wasted Screen Time Logged: ${totalWasted} hours.
    [USER REPORT] ${aiInput}`;

    const response = await callGeminiAPI(userPrompt, systemPrompt);
    setAiResponse(response);
    setIsAiLoading(false);
  };

  const getDayProgress = () => {
    const passedSeconds = (currentTime.getHours() * 3600) + (currentTime.getMinutes() * 60) + currentTime.getSeconds();
    return ((passedSeconds / 86400) * 100).toFixed(1);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className={`min-h-screen bg-black text-slate-200 font-sans sm:p-2 md:p-4 overflow-hidden ${isRTL ? 'font-arabic' : ''}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* --- TOAST OVERLAY --- */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className={`pointer-events-auto flex items-center gap-3 p-4 rounded border-l-4 shadow-2xl font-mono text-sm max-w-sm animate-in slide-in-from-right-8 fade-in ${toast.type === 'error' ? 'bg-red-950 border-red-500 text-red-200' : 'bg-neutral-900 border-neutral-500 text-neutral-200'}`}>
            <AlertTriangle size={18} className={toast.type === 'error' ? 'text-red-500' : 'text-neutral-400'} />
            {toast.message}
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto flex flex-col h-full sm:h-[95vh] border-0 sm:border-2 border-red-900/30 sm:rounded-xl overflow-hidden shadow-2xl shadow-red-900/20 bg-neutral-950 relative">
        
        {/* --- HEADER --- */}
        <header className="bg-neutral-900 p-3 sm:px-6 flex justify-between items-center border-b border-red-900/50 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <Skull className="text-red-600 animate-pulse" size={24} />
            <h1 className="text-lg sm:text-2xl font-black tracking-tighter text-red-500 uppercase">{t.appTitle}</h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={toggleFullscreen}
              className="hidden sm:flex text-xs items-center gap-1 bg-red-950 text-red-400 hover:text-red-300 hover:bg-red-900 px-3 py-1.5 rounded transition-colors uppercase font-bold"
            >
              <Maximize size={14} /> {t.nuclearMode}
            </button>
            <div className="hidden md:block text-sm font-mono text-neutral-400 font-bold border border-neutral-800 px-3 py-1 rounded bg-black">
              {currentTime.toLocaleTimeString(lang === 'ku' ? 'ar-IQ' : 'en-US')}
            </div>
            <button 
              onClick={() => setLang(lang === 'en' ? 'ku' : 'en')}
              className="text-xs sm:text-sm flex items-center gap-1 sm:gap-2 bg-neutral-800 hover:bg-neutral-700 text-slate-300 px-3 py-1.5 rounded transition-colors uppercase font-bold"
            >
              <Globe size={14} /> {lang === 'en' ? 'KU' : 'EN'}
            </button>
          </div>
        </header>

        {/* --- MAIN CONTENT --- */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 pb-24 sm:pb-6 custom-scrollbar bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dash' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
              {!notificationsGranted && (
                <div className="bg-orange-950/40 border border-orange-900/50 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-orange-400">
                    <BellRing size={24} className="animate-bounce" />
                    <div>
                      <h3 className="font-bold text-sm uppercase">{t.permissionsRequired}</h3>
                      <p className="text-xs text-orange-500/80">{t.permissionsDesc}</p>
                    </div>
                  </div>
                  <button onClick={requestNotificationPermission} className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-black px-4 py-2 rounded uppercase whitespace-nowrap">
                    {t.grantAccess}
                  </button>
                </div>
              )}

              <div className="bg-red-950/10 border-l-4 border-red-600 p-5">
                <p className="text-lg sm:text-2xl font-black uppercase tracking-tight text-red-500/90 leading-tight">"{quote}"</p>
              </div>

              <div className="bg-black p-5 sm:p-8 rounded-xl border border-neutral-800 shadow-xl">
                <h2 className="text-sm font-bold text-neutral-500 mb-3 uppercase tracking-widest flex items-center gap-2">
                  <Activity size={16} /> {t.realityCheck}
                </h2>
                <div className="flex justify-between font-mono text-sm mb-2">
                  <span className="text-red-600 font-black text-xl">{getDayProgress()}% {t.gone}</span>
                </div>
                <div className="w-full h-10 bg-neutral-900 rounded border-2 border-neutral-800 overflow-hidden relative">
                  <div 
                    className="h-full bg-red-600 transition-all duration-1000 flex items-center justify-end pr-2 overflow-hidden"
                    style={{ width: `${getDayProgress()}%` }}
                  ></div>
                </div>
                <p className="text-xs sm:text-sm text-neutral-400 mt-4 font-mono uppercase leading-relaxed">
                  {t.timeLeftDesc((100 - getDayProgress()).toFixed(1))}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: THE DRILL */}
          {activeTab === 'drill' && (
            <div className="h-full flex flex-col justify-center items-center animate-in fade-in zoom-in-95 duration-300">
              <div className="text-center w-full max-w-md">
                 <div className="inline-flex items-center gap-2 bg-red-950/30 px-5 py-2 rounded-full border border-red-900/50 mb-8 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                    <Flame size={18} className="text-red-500" />
                    <span className="text-sm font-black text-red-500 uppercase tracking-widest">{t.sessionsCompleted}: {dailyStats.drills}</span>
                 </div>

                <div className="flex gap-2 mb-8 bg-black p-1.5 rounded border border-neutral-800">
                  <button 
                    onClick={() => { setTimerMode('focus'); setTimeLeft(25 * 60); setIsTimerRunning(false); }}
                    className={`flex-1 py-3 text-xs sm:text-sm font-black uppercase tracking-widest rounded transition-all ${timerMode === 'focus' ? 'bg-red-600 text-white' : 'text-neutral-600 hover:text-neutral-400'}`}
                  >
                    {t.focus}
                  </button>
                  <button 
                    onClick={() => { setTimerMode('break'); setTimeLeft(5 * 60); setIsTimerRunning(false); }}
                    className={`flex-1 py-3 text-xs sm:text-sm font-black uppercase tracking-widest rounded transition-all ${timerMode === 'break' ? 'bg-blue-800 text-blue-100' : 'text-neutral-600 hover:text-neutral-400'}`}
                  >
                    {t.break}
                  </button>
                </div>

                <div className={`text-[6rem] sm:text-[8rem] leading-none font-black font-mono tracking-tighter mb-12 transition-all duration-500 ${isTimerRunning ? (timerMode === 'focus' ? 'text-red-500 drop-shadow-[0_0_40px_rgba(220,38,38,0.5)] scale-105' : 'text-blue-500 scale-105') : 'text-neutral-700'}`}>
                  {formatTime(timeLeft)}
                </div>

                <div className="flex justify-center gap-6">
                  <button 
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${isTimerRunning ? 'bg-neutral-900 text-neutral-500 border-2 border-neutral-800 hover:bg-neutral-800' : 'bg-red-600 text-white hover:bg-red-500 hover:scale-105 shadow-[0_0_30px_rgba(220,38,38,0.4)]'}`}
                  >
                    {isTimerRunning ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className={isRTL ? 'mr-2' : 'ml-2'} />}
                  </button>
                  <button 
                    onClick={() => { setIsTimerRunning(false); setTimeLeft(timerMode === 'focus' ? 25*60 : 5*60); }}
                    className="w-24 h-24 rounded-full bg-black text-neutral-600 flex items-center justify-center hover:bg-neutral-900 border-2 border-neutral-800 transition-colors"
                  >
                    <RotateCcw size={32} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MISSIONS */}
          {activeTab === 'missions' && (
            <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300 max-w-3xl mx-auto">
              <div className="bg-black p-4 sm:p-6 rounded-xl border border-neutral-800 flex flex-col h-full min-h-[400px]">
                <h2 className="text-sm font-bold text-neutral-500 mb-6 uppercase tracking-widest flex items-center gap-2">
                  <Crosshair size={18} className="text-red-600" /> {t.highImpact}
                </h2>
                <form onSubmit={addTask} className="flex gap-2 mb-6">
                  <input 
                    type="text" 
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder={t.taskPlaceholder} 
                    className="flex-1 bg-neutral-900 border border-neutral-800 rounded px-4 py-4 text-sm text-neutral-200 focus:outline-none focus:border-red-600 transition-colors font-mono"
                  />
                  <button type="submit" className="bg-red-600 text-white px-8 rounded font-black uppercase tracking-wider hover:bg-red-500 transition-colors">
                    {t.add}
                  </button>
                </form>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {tasks.length === 0 ? (
                    <div className="text-center text-neutral-700 py-16 text-sm font-mono uppercase border-2 border-dashed border-neutral-800 rounded">
                      {t.noTasks}
                    </div>
                  ) : (
                    tasks.map(task => (
                      <div key={task.id} className={`group flex items-center justify-between p-4 rounded border transition-all ${task.completed ? 'bg-neutral-950 border-neutral-900 opacity-30' : 'bg-neutral-900 border-neutral-800 hover:border-red-900'}`}>
                        <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => toggleTask(task.id)}>
                          <div className={`w-6 h-6 rounded flex flex-shrink-0 items-center justify-center transition-colors ${task.completed ? 'bg-red-900 text-black' : 'bg-black border border-neutral-700'}`}>
                            {task.completed && <CheckCircle2 size={16} />}
                          </div>
                          <span className={`text-sm sm:text-base font-mono ${task.completed ? 'line-through text-neutral-600' : 'text-neutral-300'}`}>
                            {task.text}
                          </span>
                        </div>
                        <button onClick={() => deleteTask(task.id)} className="text-neutral-600 hover:text-red-500 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity p-2">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SCREEN TIME AUDIT */}
          {activeTab === 'audit' && (
            <div className="h-full flex flex-col animate-in fade-in slide-in-from-left-4 duration-300 max-w-3xl mx-auto">
               <div className="bg-black p-4 sm:p-6 rounded-xl border border-neutral-800 flex flex-col h-full min-h-[400px]">
                 <h2 className="text-sm font-bold text-orange-500 mb-6 uppercase tracking-widest flex items-center gap-2">
                  <Smartphone size={18} /> {t.screenTimeTitle}
                </h2>
                
                <div className="space-y-4 mb-8">
                  {[
                    { id: 'social', label: t.stSocial, val: screenTime.social },
                    { id: 'video', label: t.stVideo, val: screenTime.video },
                    { id: 'game', label: t.stGame, val: screenTime.game }
                  ].map(item => (
                    <div key={item.id} className="flex justify-between items-center bg-neutral-900 p-3 rounded border border-neutral-800">
                      <label className="text-xs sm:text-sm text-neutral-400 uppercase font-mono">{item.label}</label>
                      <input 
                        type="number" min="0" max="24" placeholder="0" value={item.val}
                        onChange={(e) => setScreenTime({...screenTime, [item.id]: e.target.value})}
                        className="bg-black border border-neutral-700 rounded w-16 sm:w-20 px-2 py-2 text-orange-500 text-center font-black focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  ))}
                  <button onClick={handleToxicityAudit} disabled={isAiLoading} className="w-full bg-orange-700 hover:bg-orange-600 disabled:bg-neutral-800 disabled:text-neutral-600 text-white py-4 rounded font-black uppercase tracking-widest transition-colors mt-4">
                    {isAiLoading ? <BarChart3 className="animate-spin inline mr-2"/> : <Activity className="inline mr-2"/>}
                    {t.stAnalyze}
                  </button>
                </div>

                {toxicityReport && (
                  <div className="flex-1 bg-neutral-950 border border-orange-900/30 rounded p-5 overflow-y-auto custom-scrollbar animate-in slide-in-from-bottom-4">
                    <h3 className="text-orange-500 font-black uppercase mb-4 border-b border-orange-900/50 pb-2">{t.stResultTitle}</h3>
                    <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-orange-200/80">
                      {toxicityReport}
                    </p>
                  </div>
                )}
               </div>
            </div>
          )}

          {/* TAB 5: AI INTERROGATION */}
          {activeTab === 'ai' && (
            <div className="h-full flex flex-col animate-in fade-in zoom-in-95 duration-300 max-w-3xl mx-auto">
               <div className="bg-black p-4 sm:p-6 rounded-xl border border-neutral-800 flex flex-col h-full min-h-[400px]">
                  <div className="flex items-center gap-3 mb-6 border-b border-neutral-900 pb-4">
                    <div className="p-3 bg-red-950/50 rounded text-red-500 border border-red-900/50">
                      <BrainCircuit size={28} />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-red-500 uppercase tracking-widest">{t.aiTitle}</h2>
                      <p className="text-xs text-neutral-500 font-mono uppercase">{t.aiSubtitle}</p>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col">
                    {!aiResponse && !isAiLoading ? (
                      <div className="flex-1 flex flex-col justify-center">
                        <textarea 
                          value={aiInput}
                          onChange={(e) => setAiInput(e.target.value)}
                          placeholder={t.aiInputPlaceholder}
                          className="w-full h-40 sm:h-56 bg-neutral-900 border border-neutral-800 rounded p-5 text-sm text-neutral-300 focus:outline-none focus:border-red-600 resize-none font-mono mb-4"
                        ></textarea>
                        <button onClick={handleAIAnalysis} disabled={!aiInput.trim()} className="w-full bg-red-600 hover:bg-red-500 disabled:bg-neutral-900 disabled:text-neutral-700 text-white py-5 rounded font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                           {t.aiAnalyzeBtn}
                        </button>
                      </div>
                    ) : isAiLoading ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-red-600 space-y-6">
                        <BrainCircuit size={64} className="animate-pulse" />
                        <p className="font-mono text-sm tracking-widest animate-bounce">{t.aiAnalyzing}</p>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col">
                         <div className="flex-1 bg-neutral-900 border border-red-900/30 rounded p-6 overflow-y-auto mb-4 custom-scrollbar">
                           <p className="whitespace-pre-wrap font-mono text-sm sm:text-base leading-relaxed text-red-400">
                             {aiResponse}
                           </p>
                         </div>
                         <button onClick={() => { setAiResponse(""); setAiInput(""); }} className="w-full bg-black border border-neutral-800 hover:bg-neutral-900 text-neutral-400 py-4 rounded font-black uppercase tracking-widest transition-colors">
                          RESET
                        </button>
                      </div>
                    )}
                  </div>
               </div>
            </div>
          )}

        </div>

        {/* --- BOTTOM NAVIGATION TABS --- */}
        <nav className="bg-black border-t border-neutral-900 p-2 sm:p-3 flex-shrink-0 relative z-40">
          <div className="flex justify-between sm:justify-center sm:gap-2 max-w-2xl mx-auto">
            {[
              { id: 'dash', icon: Target, label: t.tabs.dash },
              { id: 'drill', icon: ShieldAlert, label: t.tabs.drill },
              { id: 'missions', icon: Crosshair, label: t.tabs.missions },
              { id: 'audit', icon: Smartphone, label: t.tabs.audit },
              { id: 'ai', icon: BrainCircuit, label: t.tabs.ai }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-3 flex-1 sm:flex-none py-2 px-1 sm:px-6 sm:py-3 rounded transition-all ${
                  activeTab === tab.id 
                    ? 'text-red-500 bg-red-950/30 font-black border border-red-900/30' 
                    : 'text-neutral-600 hover:text-neutral-300 hover:bg-neutral-900 border border-transparent'
                }`}
              >
                <tab.icon size={20} className={activeTab === tab.id ? 'drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]' : ''} />
                <span className="text-[9px] sm:text-xs uppercase tracking-widest font-mono">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <style dangerouslySetInnerHTML={{__html: `
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #450a0a; border-radius: 2px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #7f1d1d; }
        `}} />
      </div>
    </div>
  );
}