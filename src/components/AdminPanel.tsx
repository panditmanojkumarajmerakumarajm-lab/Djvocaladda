import React, { useState } from "react";
import { AudioSample } from "../types";
import { PlusCircle, Trash2, RotateCcw, Link, FileAudio, Check, Music } from "lucide-react";
import { DEFAULT_SAMPLES } from "../data";

interface AdminPanelProps {
  samples: AudioSample[];
  onAddSample: (sample: AudioSample) => void;
  onDeleteSample: (id: string) => void;
  onResetSamples: () => void;
}

export default function AdminPanel({
  samples,
  onAddSample,
  onDeleteSample,
  onResetSamples,
}: AdminPanelProps) {
  const [title, setTitle] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [category, setCategory] = useState("Voice Drops");
  const [successMsg, setSuccessMsg] = useState("");
  const [mockFileName, setMockFileName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    // Use a default workable sample URL if not provided
    const finalUrl = audioUrl.trim() || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3";

    const newSample: AudioSample = {
      id: "sample-" + Date.now(),
      title: title.trim(),
      audioUrl: finalUrl,
      category: category,
      duration: "0:30",
      plays: 0,
    };

    onAddSample(newSample);
    
    // Clear form & show success
    setTitle("");
    setAudioUrl("");
    setMockFileName("");
    setSuccessMsg("Vocal sample added successfully!");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  // Mock file upload to generate sample details
  const handleMockFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMockFileName(file.name);
      
      // Auto fill title if empty
      const cleanName = file.name
        .replace(/\.[^/.]+$/, "") // strip extension
        .replace(/[_-]/g, " "); // replace underscores/dashes with space
      
      if (!title) {
        setTitle(cleanName);
      }

      // Generate a mock but working URL for this sample
      // Let's cycle through SoundHelix songs or create a consistent mock URL
      const randomId = Math.floor(Math.random() * 8) + 1;
      setAudioUrl(`https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${randomId}.mp3`);
    }
  };

  return (
    <div id="admin-panel-container" className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-900/40 pb-5">
        <div>
          <h2 className="font-display font-bold text-2xl text-white">
            Secure Admin Dashboard
          </h2>
          <p className="text-sm text-purple-300">
            Add and manage the DJ vocal audio samples catalog.
          </p>
        </div>
        <button
          id="btn-reset-catalog"
          onClick={() => {
            if (confirm("Are you sure you want to reset to default samples? This will clear custom ones.")) {
              onResetSamples();
            }
          }}
          className="flex items-center space-x-1.5 px-4 py-2 bg-purple-950/60 border border-purple-800 hover:bg-purple-900/60 text-purple-300 rounded-xl text-xs font-semibold transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Catalog to Defaults</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-5 bg-[#120c24] border border-purple-900/50 rounded-2xl p-6 shadow-xl shadow-purple-950/40">
          <h3 className="font-display font-semibold text-lg text-white mb-4 flex items-center space-x-2">
            <PlusCircle className="w-5 h-5 text-purple-500" />
            <span>Add New Audio Sample</span>
          </h3>

          {successMsg && (
            <div className="mb-4 bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded-xl text-xs flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-purple-300 uppercase tracking-wider mb-1.5">
                Vocal/Sample Title *
              </label>
              <input
                id="input-sample-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Male Hype Voice - 'Make Some Noise!'"
                className="w-full bg-[#0a0515] border border-purple-900/50 rounded-xl py-2.5 px-3.5 text-white text-sm placeholder-purple-400/30 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-xs font-semibold text-purple-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                id="select-sample-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0a0515] border border-purple-900/50 rounded-xl py-2.5 px-3.5 text-white text-sm focus:outline-none focus:border-purple-500"
              >
                <option value="Voice Drops">Voice Drops</option>
                <option value="Vocal Hooks">Vocal Hooks</option>
                <option value="Female Vocals">Female Vocals</option>
                <option value="Male Vocals">Male Vocals</option>
                <option value="SFX Transitions">SFX Transitions</option>
                <option value="Exclusive Tags">Exclusive Tags</option>
              </select>
            </div>

            {/* Mock File Upload Input */}
            <div>
              <label className="block text-xs font-semibold text-purple-300 uppercase tracking-wider mb-1.5">
                Audio File (Mock Upload)
              </label>
              <div className="relative">
                <input
                  id="input-file-mock"
                  type="file"
                  accept="audio/*"
                  onChange={handleMockFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="input-file-mock"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-purple-900/60 hover:border-purple-500/60 bg-[#0a0515] rounded-xl p-4 cursor-pointer text-center group transition-all"
                >
                  <FileAudio className="w-8 h-8 text-purple-400 group-hover:text-purple-300 mb-2 transition-all" />
                  <span className="text-xs text-purple-200 font-medium">
                    {mockFileName ? mockFileName : "Choose file or drag here"}
                  </span>
                  <span className="text-[10px] text-purple-400/60 mt-1">
                    Select any file to automatically extract details & URL
                  </span>
                </label>
              </div>
            </div>

            {/* URL input */}
            <div>
              <label className="block text-xs font-semibold text-purple-300 uppercase tracking-wider mb-1.5">
                Sample Audio URL
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-purple-400/50">
                  <Link className="w-4 h-4" />
                </span>
                <input
                  id="input-sample-url"
                  type="url"
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  placeholder="e.g. https://domain.com/sample.mp3"
                  className="w-full bg-[#0a0515] border border-purple-900/50 rounded-xl py-2.5 pl-9 pr-3.5 text-white text-sm placeholder-purple-400/30 focus:outline-none focus:border-purple-500"
                />
              </div>
              <p className="text-[10px] text-purple-400/70 mt-1">
                Leave blank to automatically assign a playable, high-quality audio file loop.
              </p>
            </div>

            <button
              id="btn-add-sample-submit"
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center space-x-2 text-sm mt-4 shadow-lg shadow-purple-500/10"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add to Live Catalog</span>
            </button>
          </form>
        </div>

        {/* List Column */}
        <div className="lg:col-span-7 bg-[#120c24] border border-purple-900/50 rounded-2xl p-6 shadow-xl shadow-purple-950/40">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg text-white">
              Live Audio Catalog ({samples.length})
            </h3>
            <span className="text-xs text-purple-400 font-mono">
              Saved in local session
            </span>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-2">
            {samples.map((sample) => (
              <div
                key={sample.id}
                className="flex items-center justify-between bg-[#0a0515] border border-purple-950/50 p-3 rounded-xl hover:border-purple-900/60 transition-all"
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="bg-purple-900/30 p-2.5 rounded-lg border border-purple-800/20 text-purple-400">
                    <Music className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-sm font-semibold text-white truncate">
                      {sample.title}
                    </h4>
                    <div className="flex items-center space-x-2 text-xs text-purple-400 mt-0.5">
                      <span className="bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded text-[10px]">
                        {sample.category}
                      </span>
                      <span className="truncate max-w-[200px] font-mono text-[10px] text-purple-500">
                        {sample.audioUrl}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  id={`btn-delete-sample-${sample.id}`}
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete "${sample.title}"?`)) {
                      onDeleteSample(sample.id);
                    }
                  }}
                  className="p-2 text-purple-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  title="Delete sample"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {samples.length === 0 && (
              <div className="text-center py-12 text-purple-400">
                <p>No vocal samples in catalog.</p>
                <button
                  onClick={onResetSamples}
                  className="mt-3 text-xs text-pink-400 underline font-semibold"
                >
                  Reset to default samples list
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
