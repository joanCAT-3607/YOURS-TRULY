import React, { useState } from 'react';
import { JOURNAL_PROMPTS } from '../data/mockData';
import { JournalEntry, JournalPrompt } from '../types';

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveJournal: (entry: JournalEntry) => void;
}

export const JournalModal: React.FC<JournalModalProps> = ({
  isOpen,
  onClose,
  onSaveJournal,
}) => {
  const [selectedPrompt, setSelectedPrompt] = useState<JournalPrompt>(JOURNAL_PROMPTS[0]);
  const [content, setContent] = useState('');
  const [isReflecting, setIsReflecting] = useState(false);
  const [aiReflection, setAiReflection] = useState<{ reflection: string; affirmation: string } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleGetReflection = async () => {
    if (!content.trim()) return;
    setIsReflecting(true);
    try {
      const res = await fetch('/api/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: selectedPrompt.prompt,
          content: content.trim(),
        }),
      });
      const data = await res.json();
      setAiReflection(data);
    } catch {
      setAiReflection({
        reflection: "Taking a moment to put heavy thoughts into words is a grounding act of self-compassion.",
        affirmation: "You are allowed to move at your own pace today.",
      });
    } finally {
      setIsReflecting(false);
    }
  };

  const handleSave = () => {
    if (!content.trim()) return;
    onSaveJournal({
      id: `journal-${Date.now()}`,
      promptId: selectedPrompt.id,
      promptText: selectedPrompt.prompt,
      content: content.trim(),
      timestamp: Date.now(),
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0d1c2e]/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#fcfdf6] rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white flex flex-col no-scrollbar animate-fadeIn">
        {/* Top Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f5e9] text-[#2e7d32] text-xs font-semibold uppercase tracking-wider mb-1.5">
              <span className="material-symbols-outlined text-[16px]">edit_note</span>
              <span>Sanctuary Journal</span>
            </div>
            <h2 className="font-heading text-xl md:text-2xl font-bold text-[#1b5e20]">
              Journaling Prompts
            </h2>
            <p className="text-xs text-[#52634f]">
              Thoughtful, low-pressure prompts to untangle your mind.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#43483e] hover:bg-[#e8f5e9] transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Prompt Category Carousel / Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
          {JOURNAL_PROMPTS.map((p) => {
            const isSelected = selectedPrompt.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPrompt(p);
                  setAiReflection(null);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#386a20] text-white shadow-xs'
                    : 'bg-white text-[#43483e] border border-[#dee5d8] hover:bg-[#e8f5e9]'
                }`}
              >
                {p.category}
              </button>
            );
          })}
        </div>

        {/* Selected Prompt Banner */}
        <div className="p-4 rounded-2xl bg-[#e8f5e9] border border-[#c8e6c9] mb-4">
          <span className="text-[11px] font-bold text-[#2e7d32] uppercase tracking-wider block mb-1">
            {selectedPrompt.category} Prompt
          </span>
          <p className="font-heading text-sm md:text-base font-semibold text-[#1b5e20] leading-relaxed">
            "{selectedPrompt.prompt}"
          </p>
        </div>

        {/* Journal Writing Area */}
        <div className="mb-4">
          <textarea
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write freely here. No judgment, no grading, no right answers..."
            className="w-full bg-white border border-[#c2c8bd] focus:border-[#2e7d32] rounded-2xl p-4 text-sm font-body text-[#1a1c19] placeholder-[#72796f] outline-none focus:ring-2 focus:ring-[#b7f397] transition-all resize-none shadow-2xs leading-relaxed"
          />
        </div>

        {/* AI Reflection Result */}
        {aiReflection && (
          <div className="p-4 rounded-2xl bg-white border border-[#b7f397] shadow-xs mb-4 animate-fadeIn">
            <div className="flex items-center gap-2 mb-1.5 text-[#2e7d32]">
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              <span className="font-heading text-xs font-bold uppercase tracking-wider">
                Empathetic Reflection from Yours Truly
              </span>
            </div>
            <p className="font-body text-xs md:text-sm text-[#43483e] leading-relaxed mb-2">
              {aiReflection.reflection}
            </p>
            <div className="p-2.5 rounded-xl bg-[#f0f2eb] text-xs font-semibold text-[#1b5e20] italic">
              ✨ "{aiReflection.affirmation}"
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#dee5d8]">
          <button
            type="button"
            onClick={handleGetReflection}
            disabled={!content.trim() || isReflecting}
            className="px-4 py-2 rounded-full bg-[#f0f2eb] hover:bg-[#e8f5e9] text-[#1b5e20] text-xs font-semibold border border-[#c2c8bd] flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px] text-[#386a20]">
              auto_awesome
            </span>
            <span>{isReflecting ? 'Reflecting...' : 'Ask Yours Truly to Reflect'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold text-[#43483e] hover:bg-[#eaede6]"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!content.trim() || savedSuccess}
              className="px-6 py-2 rounded-full bg-[#386a20] hover:bg-[#2e7d32] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">
                {savedSuccess ? 'check_circle' : 'save'}
              </span>
              <span>{savedSuccess ? 'Saved to Sanctuary' : 'Save Reflection'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
