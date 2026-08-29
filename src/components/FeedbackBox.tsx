import React, { useState } from 'react';
import { FeedbackEntry, UserProfile } from '../types';

interface FeedbackBoxProps {
  userProfile?: UserProfile;
  feedbackList: FeedbackEntry[];
  onSaveFeedback: (feedback: Omit<FeedbackEntry, 'id' | 'timestamp'>) => void;
  onClearFeedback?: () => void;
}

const CATEGORIES = [
  { id: 'suggestion', label: '💡 Feature Idea', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'wellness', label: '🌿 Sanctuary & Chat', color: 'bg-green-50 text-green-700 border-green-200' },
  { id: 'teen_buddy', label: '⚡ Neon Buddy', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { id: 'games', label: '🫧 Mini-Games & Audio', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'issue', label: '🐞 Bug / Glitch', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'other', label: '💬 General Note', color: 'bg-stone-50 text-stone-700 border-stone-200' },
] as const;

const RATINGS = [
  { value: 1, emoji: '😞', label: 'Needs Work' },
  { value: 2, emoji: '😕', label: 'Could Improve' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '😊', label: 'Helpful' },
  { value: 5, emoji: '✨', label: 'Sanctuary!' },
];

export const FeedbackBox: React.FC<FeedbackBoxProps> = ({
  userProfile,
  feedbackList,
  onSaveFeedback,
}) => {
  const userName = userProfile?.name || 'Taylor';

  const [rating, setRating] = useState<number>(5);
  const [category, setCategory] = useState<FeedbackEntry['category']>('suggestion');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSaveFeedback({
      rating,
      category,
      message: message.trim(),
      authorName: isAnonymous ? 'Anonymous Student' : userName,
    });

    setMessage('');
    setJustSubmitted(true);
  };

  return (
    <div
      id="student-feedback-box"
      className="w-full max-w-xl mx-auto mt-10 p-5 sm:p-6 bg-white/95 rounded-3xl border border-[#dce3d5] shadow-md shadow-[#2e7d32]/5 text-left relative overflow-hidden backdrop-blur-xs transition-all"
    >
      {/* Decorative subtle background accents */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#e8f5e9]/50 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#e8f5e9] text-[#2e7d32] flex items-center justify-center border border-[#c8e6c9] shadow-2xs">
            <span className="material-symbols-outlined text-[20px]">rate_review</span>
          </div>
          <div>
            <h3 className="font-heading text-base sm:text-lg font-bold text-[#1a241e]">
              Student Feedback & Ideas
            </h3>
            <p className="text-xs text-[#52634f]">
              Help shape Yours Truly • Saved locally & 100% offline
            </p>
          </div>
        </div>

        {feedbackList.length > 0 && (
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#f0f2eb] hover:bg-[#dcedc8] text-[#2e7d32] border border-[#dee5d8] transition-all flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">
              {showHistory ? 'expand_less' : 'history'}
            </span>
            <span>{showHistory ? 'Hide' : `Logs (${feedbackList.length})`}</span>
          </button>
        )}
      </div>

      {/* Success Notification */}
      {justSubmitted ? (
        <div className="p-5 rounded-2xl bg-[#e8f5e9] border border-[#a5d6a7] text-center space-y-2.5 animate-fadeIn">
          <div className="w-11 h-11 mx-auto rounded-full bg-[#2e7d32] text-white flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-[22px]">check</span>
          </div>
          <h4 className="font-heading text-sm sm:text-base font-bold text-[#1b5e20]">
            Thank You for Sharing! 💚
          </h4>
          <p className="text-xs text-[#2e7d32] max-w-sm mx-auto leading-relaxed">
            Your suggestion was logged into your sanctuary memory. We appreciate your voice in making this space calmer and more comforting.
          </p>
          <div className="pt-2 flex justify-center gap-2">
            <button
              onClick={() => setJustSubmitted(false)}
              className="px-4 py-1.5 rounded-full bg-white text-[#2e7d32] hover:bg-[#f1f8e9] text-xs font-semibold border border-[#c8e6c9] shadow-2xs transition-all cursor-pointer"
            >
              Write Another Note
            </button>
            <button
              onClick={() => {
                setJustSubmitted(false);
                setShowHistory(true);
              }}
              className="px-4 py-1.5 rounded-full bg-[#2e7d32] text-white hover:bg-[#1b5e20] text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            >
              View My Logs
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {/* Experience Rating Emoji Bar */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#52634f] mb-2">
              How is your sanctuary experience today?
            </label>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {RATINGS.map((r) => {
                const isSelected = rating === r.value;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRating(r.value)}
                    className={`py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#e8f5e9] border-[#2e7d32] text-[#1b5e20] shadow-2xs scale-[1.02]'
                        : 'bg-[#fafafa] border-[#dee5d8] text-[#55624c] hover:bg-white hover:border-[#a5d6a7]'
                    }`}
                  >
                    <span className="text-xl sm:text-2xl mb-0.5">{r.emoji}</span>
                    <span className="text-[10px] sm:text-[11px] font-medium leading-tight text-center">
                      {r.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Chips */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#52634f] mb-1.5">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? `${cat.color} font-semibold ring-2 ring-[#2e7d32]/30 shadow-2xs`
                        : 'bg-[#fafafa] text-[#52634f] border-[#dee5d8] hover:bg-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback Message Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#52634f] mb-1.5">
              Your Feedback or Feature Request
            </label>
            <textarea
              id="feedback-message-textarea"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What's helping you most? What would you like added (new soundscapes, mini-games, study buddy tools, campus resources)?"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#fafafa] focus:bg-white border border-[#dee5d8] focus:border-[#2e7d32] focus:ring-2 focus:ring-[#2e7d32]/20 text-xs sm:text-sm text-[#1a1c19] placeholder:text-[#8d9588] outline-hidden transition-all resize-none"
              required
            />
          </div>

          {/* Anonymous toggle & Submit button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded text-[#2e7d32] focus:ring-[#2e7d32] border-[#dee5d8]"
              />
              <span className="text-xs text-[#52634f]">
                Post anonymously {isAnonymous ? '(Student identity hidden)' : `(as ${userName})`}
              </span>
            </label>

            <button
              id="submit-feedback-btn"
              type="submit"
              disabled={!message.trim()}
              className="px-5 py-2.5 rounded-full bg-[#386a20] hover:bg-[#2e7d32] disabled:opacity-45 disabled:hover:bg-[#386a20] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>Send Feedback</span>
            </button>
          </div>
        </form>
      )}

      {/* Historical feedback entries drawer */}
      {showHistory && (
        <div className="mt-5 pt-4 border-t border-[#dee5d8] space-y-2.5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2e7d32]">
              Your Logged Feedback ({feedbackList.length})
            </h4>
            <span className="text-[11px] text-[#72796f]">Stored securely in browser memory</span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {feedbackList.map((entry) => {
              const catObj = CATEGORIES.find((c) => c.id === entry.category);
              const ratingObj = RATINGS.find((r) => r.value === entry.rating);
              const date = new Date(entry.timestamp).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={entry.id}
                  className="p-3 rounded-2xl bg-[#fafafa] border border-[#e0e6db] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{ratingObj?.emoji || '✨'}</span>
                      <span className="font-semibold text-[#1a1c19]">{entry.authorName}</span>
                      {catObj && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${catObj.color}`}>
                          {catObj.label}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#72796f]">{date}</span>
                  </div>
                  <p className="text-[#333d31] leading-relaxed pl-1 italic">
                    "{entry.message}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
