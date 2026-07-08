import { useState, useEffect } from "react";
import { AudioSample, User } from "./types";
import { getFirestoreSamples, addFirestoreSample, deleteFirestoreSample } from "./firebase";
import Navbar from "./components/Navbar";
import AuthCard from "./components/AuthCard";
import SampleCard from "./components/SampleCard";
import AdminPanel from "./components/AdminPanel";
import OrderModal from "./components/OrderModal";
import { Music, Headphones, Flame, ArrowRight, ShieldCheck, Zap, Disc, Loader2 } from "lucide-react";

export default function App() {
  // Authentication State
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("dj_vocal_adda_user");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        if (u && u.email) {
          u.isAdmin = u.email.trim().toLowerCase() === "tiwarigautam819@gmail.com";
        }
        return u;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Live Catalog State (persisted inside Firestore)
  const [samples, setSamples] = useState<AudioSample[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // UI Navigation states
  const [isAdminView, setIsAdminView] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  
  // Ordering flow state
  const [selectedOrderSample, setSelectedOrderSample] = useState<AudioSample | null>(null);

  // Load samples on init
  useEffect(() => {
    async function fetchSamples() {
      try {
        setIsLoading(true);
        const loadedSamples = await getFirestoreSamples();
        setSamples(loadedSamples);
      } catch (err) {
        console.error("Error fetching samples: ", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSamples();
  }, []);

  // Sync user state to localStorage
  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem("dj_vocal_adda_user", JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdminView(false);
    setCurrentlyPlayingId(null);
    localStorage.removeItem("dj_vocal_adda_user");
  };

  // Admin Catalog Modification Handlers
  const handleAddSample = async (newSample: AudioSample) => {
    try {
      const added = await addFirestoreSample({
        title: newSample.title,
        audioUrl: newSample.audioUrl,
        category: newSample.category,
        duration: newSample.duration,
        plays: newSample.plays,
      });
      setSamples((prev) => [added, ...prev]);
    } catch (e) {
      console.error("Failed to add sample:", e);
    }
  };

  const handleDeleteSample = async (id: string) => {
    try {
      await deleteFirestoreSample(id);
      setSamples((prev) => prev.filter((s) => s.id !== id));
      if (currentlyPlayingId === id) {
        setCurrentlyPlayingId(null);
      }
    } catch (e) {
      console.error("Failed to delete sample:", e);
    }
  };

  const handleResetSamples = async () => {
    try {
      setIsLoading(true);
      const loaded = await getFirestoreSamples();
      setSamples(loaded);
      setCurrentlyPlayingId(null);
    } catch (err) {
      console.error("Error refreshing: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayToggle = (sampleId: string | null) => {
    setCurrentlyPlayingId(sampleId);
  };

  // Order Flow triggers
  const handleOrderClick = (sample: AudioSample) => {
    // Open customizer order modal on-screen
    setSelectedOrderSample(sample);
  };

  // Category filter lists
  const categories: string[] = ["All"];
  samples.forEach((s: AudioSample) => {
    const cat = s.category || "DJ Vocal";
    if (!categories.includes(cat)) {
      categories.push(cat);
    }
  });

  // Filter & Search samples
  const filteredSamples = samples.filter((sample) => {
    const matchesCategory = selectedCategory === "All" || sample.category === selectedCategory;
    const matchesSearch = sample.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (sample.category && sample.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#06030c] text-white font-sans flex flex-col justify-between selection:bg-pink-500 selection:text-white">
      {/* Global Background Neon Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[50%] bg-purple-900/15 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[60%] bg-pink-900/10 rounded-full blur-[140px]"></div>
        <div className="absolute top-[40%] left-[40%] w-[40%] h-[40%] bg-purple-950/10 rounded-full blur-[130px]"></div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col flex-1">
        
        {/* Navigation bar */}
        <Navbar 
          user={user} 
          onLogout={handleLogout} 
          isAdminView={isAdminView} 
          onToggleAdminView={(isView) => {
            setIsAdminView(isView);
            setCurrentlyPlayingId(null);
          }} 
        />

        {/* Master Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 md:px-8">
          
          {/* Guest/Auth View */}
          {!user ? (
            <div className="py-8 md:py-16">
              <AuthCard onLogin={handleLogin} />
            </div>
          ) : (
            
            /* Admin Panel View */
            isAdminView && user.isAdmin ? (
              <AdminPanel
                samples={samples}
                onAddSample={handleAddSample}
                onDeleteSample={handleDeleteSample}
                onResetSamples={handleResetSamples}
              />
            ) : (
              
              /* User Dashboard / Vocal Gallery View */
              <div className="space-y-10 animate-fade-in" id="dashboard-gallery">
                
                {/* Hero Showcase Section */}
                <div className="bg-gradient-to-r from-purple-950/40 via-pink-950/20 to-purple-950/40 border border-purple-900/40 rounded-3xl p-6 md:p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/5 rounded-full blur-2xl pointer-events-none"></div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-8 space-y-4">
                      <div className="flex items-center space-x-2 text-pink-400 font-mono text-xs uppercase tracking-widest font-bold">
                        <Flame className="w-4 h-4 animate-pulse" />
                        <span>India's #1 DJ Tag Creator</span>
                      </div>
                      
                      <h2 className="font-display font-black text-3xl md:text-5xl text-white tracking-tight leading-tight uppercase">
                        Get Custom Vocals <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500">
                          That Make You Stand Out
                        </span>
                      </h2>
                      
                      <p className="text-sm md:text-base text-purple-300 max-w-2xl leading-relaxed">
                        Select a style, preview real-time demos, and enter your name. Our professional voice over artists will generate your custom DJ vocal tag in ultra-crisp studio quality!
                      </p>

                      <div className="flex flex-wrap gap-4 pt-2">
                        <div className="flex items-center space-x-2 text-xs text-purple-300 font-semibold bg-purple-950/40 border border-purple-900/40 px-3.5 py-2 rounded-xl">
                          <Zap className="w-4 h-4 text-pink-400" />
                          <span>Delivery in 24 Hours</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-purple-300 font-semibold bg-purple-950/40 border border-purple-900/40 px-3.5 py-2 rounded-xl">
                          <ShieldCheck className="w-4 h-4 text-purple-400" />
                          <span>HD 320kbps Quality</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Vinyl / Equalizer graphic */}
                    <div className="md:col-span-4 flex justify-center">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-all duration-700"></div>
                        <div className="w-36 h-36 md:w-44 md:h-44 bg-[#0a0515] border-4 border-purple-900/40 rounded-full flex items-center justify-center relative animate-[spin_10s_linear_infinite] shadow-2xl">
                          <Disc className="w-16 h-16 text-purple-500/60" />
                          {/* Inner center label */}
                          <div className="absolute w-12 h-12 bg-pink-500 rounded-full border-2 border-purple-950 flex items-center justify-center">
                            <Headphones className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filter and Search Bar Container */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0c081a]/60 border border-purple-950 p-4 rounded-2xl">
                  {/* Category Pills */}
                  <div className="flex items-center space-x-1.5 overflow-x-auto pb-1.5 md:pb-0 scrollbar-none">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        id={`btn-category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all uppercase tracking-wider font-display ${
                          selectedCategory === cat
                            ? "bg-purple-600 text-white shadow-md shadow-purple-500/15"
                            : "bg-purple-950/30 text-purple-400 border border-purple-900/30 hover:bg-purple-900/30"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Search bar input */}
                  <div className="w-full md:w-72">
                    <input
                      id="input-search-samples"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search audio samples..."
                      className="w-full bg-[#0a0515] border border-purple-900/40 rounded-xl py-2 px-4 text-xs text-white placeholder-purple-400/30 focus:outline-none focus:border-purple-500 transition-all"
                    />
                  </div>
                </div>

                {/* Grid Gallery */}
                <div>
                  <h3 className="font-display font-bold text-xl text-white mb-6 uppercase tracking-wider flex items-center space-x-2">
                    <Music className="w-5 h-5 text-purple-500" />
                    <span>Select style reference & order ({filteredSamples.length})</span>
                  </h3>

                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-[#120c24]/10 border border-purple-950/40 rounded-2xl">
                      <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-3" />
                      <p className="text-purple-400 text-sm">Loading DJ vocal samples catalog...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredSamples.map((sample) => (
                        <SampleCard
                          key={sample.id}
                          sample={sample}
                          currentlyPlayingId={currentlyPlayingId}
                          onPlayToggle={handlePlayToggle}
                          onOrderClick={handleOrderClick}
                        />
                      ))}

                      {filteredSamples.length === 0 && (
                        <div className="col-span-full text-center py-16 bg-[#120c24]/30 border border-purple-950 rounded-2xl">
                          <p className="text-purple-400">No vocal samples in catalog yet.</p>
                          {(selectedCategory !== "All" || searchQuery !== "") && (
                            <button
                              onClick={() => {
                                setSelectedCategory("All");
                                setSearchQuery("");
                              }}
                              className="mt-3 text-xs text-pink-400 font-semibold underline"
                            >
                              Clear all filters
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Creative features section to build professional trust */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                  <div className="bg-[#120c24]/55 border border-purple-950 p-5 rounded-2xl space-y-2">
                    <span className="text-pink-500 font-bold text-xl">01</span>
                    <h4 className="font-display font-semibold text-white">Choose Reference</h4>
                    <p className="text-xs text-purple-400 leading-relaxed">
                      Listen to high-quality studio samples and select a style that matches your music genre perfectly.
                    </p>
                  </div>
                  <div className="bg-[#120c24]/55 border border-purple-950 p-5 rounded-2xl space-y-2">
                    <span className="text-purple-500 font-bold text-xl">02</span>
                    <h4 className="font-display font-semibold text-white">Instant UPI Pay</h4>
                    <p className="text-xs text-purple-400 leading-relaxed">
                      Pay safe and instant ₹49 via secure UPI QR code or link generator in less than 30 seconds.
                    </p>
                  </div>
                  <div className="bg-[#120c24]/55 border border-purple-950 p-5 rounded-2xl space-y-2">
                    <span className="text-pink-500 font-bold text-xl">03</span>
                    <h4 className="font-display font-semibold text-white">Submit to WhatsApp</h4>
                    <p className="text-xs text-purple-400 leading-relaxed">
                      Customize your DJ name. It will directly connect you to our WhatsApp line with your sample style!
                    </p>
                  </div>
                </div>

              </div>
            )
          )}
        </main>
      </div>

      {/* Persistent Order Modal popup */}
      {selectedOrderSample && (
        <OrderModal
          sample={selectedOrderSample}
          onClose={() => setSelectedOrderSample(null)}
        />
      )}

      {/* Simple Footer */}
      <footer className="bg-[#04020a] border-t border-purple-950 py-6 px-4 md:px-8 text-center text-xs text-purple-500/80 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span>&copy; 2026 DJ Vocal Adda. All rights reserved.</span>
            <span className="hidden sm:inline text-purple-700">|</span>
            <span className="text-pink-400 font-medium">Mere by ❤ Gautam Tiwari</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hover:text-purple-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-purple-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-purple-300 cursor-pointer">Support Helpdesk</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
