import React, { useState } from 'react';

interface PrivacyScreenProps {
  onClearAllData: () => void;
  onBack: () => void;
}

export const PrivacyScreen: React.FC<PrivacyScreenProps> = ({
  onClearAllData,
  onBack,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [clearedNotice, setClearedNotice] = useState(false);

  const handleConfirmClear = () => {
    onClearAllData();
    setShowConfirmModal(false);
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 3000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-28 md:pb-12 animate-fadeIn">
      {/* Top Header Section */}
      <section className="mb-8 md:mb-12 text-center md:text-left max-w-2xl">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#dcfce7] text-[#15803d] mb-4 shadow-xs">
          <span className="material-symbols-outlined text-[32px] fill-icon">
            shield_lock
          </span>
        </div>

        <h2 className="font-heading text-2xl md:text-4xl font-bold text-[#052e16] mb-3 tracking-tight">
          Your Sanctuary is Secure.
        </h2>

        <p className="font-body text-[#166534] text-base md:text-lg leading-relaxed">
          We believe your mental health journey is entirely your own. Our architecture is designed to protect your privacy first, ensuring your thoughts remain strictly between you and Yours Truly.
        </p>

        {clearedNotice && (
          <div className="mt-4 p-3 rounded-xl bg-[#dcfce7] border border-[#86efac] text-[#166534] text-sm font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            All local chats, reflections, and mood logs have been permanently erased.
          </div>
        )}
      </section>

      {/* Bento Grid Layout for Security Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        {/* End-to-End Encryption Card */}
        <article className="bg-white rounded-2xl p-6 card-shadow border border-white flex flex-col">
          <div className="w-12 h-12 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#15803d] mb-4 shadow-2xs">
            <span className="material-symbols-outlined text-[24px] fill-icon">
              lock
            </span>
          </div>
          <h3 className="font-heading text-lg md:text-xl font-bold text-[#052e16] mb-2">
            End-to-End Encryption
          </h3>
          <p className="font-body text-sm md:text-base text-[#166534] flex-grow leading-relaxed">
            Every message, mood log, and reflection is encrypted before it leaves your device. Only you possess the key to read your chats. We cannot see them, and neither can anyone else.
          </p>
        </article>

        {/* Anonymous by Default Card */}
        <article className="bg-white rounded-2xl p-6 card-shadow border border-white flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#bbf7d0]/40 rounded-bl-[100px] pointer-events-none -z-0"></div>
          <div className="w-12 h-12 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#15803d] mb-4 relative z-10 shadow-2xs">
            <span className="material-symbols-outlined text-[24px] fill-icon">
              visibility_off
            </span>
          </div>
          <h3 className="font-heading text-lg md:text-xl font-bold text-[#052e16] mb-2 relative z-10">
            Anonymous by Default
          </h3>
          <p className="font-body text-sm md:text-base text-[#166534] flex-grow relative z-10 leading-relaxed">
            Your digital identity is completely separated from your real-world identity. We don't require names, phone numbers, or social media links. You are simply a voice in a safe space.
          </p>
        </article>

        {/* No Third-Party Access Card */}
        <article className="bg-white rounded-2xl p-6 card-shadow border border-white flex flex-col">
          <div className="w-12 h-12 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#15803d] mb-4 shadow-2xs">
            <span className="material-symbols-outlined text-[24px] fill-icon">
              block
            </span>
          </div>
          <h3 className="font-heading text-lg md:text-xl font-bold text-[#052e16] mb-2">
            No Third-Party Access
          </h3>
          <p className="font-body text-sm md:text-base text-[#166534] flex-grow leading-relaxed">
            Your data is never sold, rented, or shared with advertisers, brokers, or external entities. The sanctuary remains closed to outside influence.
          </p>
        </article>

        {/* Delete Anytime Card */}
        <article className="bg-white rounded-2xl p-6 card-shadow border border-white flex flex-col">
          <div className="w-12 h-12 rounded-full bg-[#fee2e2] flex items-center justify-center text-[#dc2626] mb-4 shadow-2xs">
            <span className="material-symbols-outlined text-[24px] fill-icon">
              delete_forever
            </span>
          </div>
          <h3 className="font-heading text-lg md:text-xl font-bold text-[#052e16] mb-2">
            Delete Anytime
          </h3>
          <p className="font-body text-sm md:text-base text-[#166534] flex-grow mb-6 leading-relaxed">
            You hold total control over your history. With a single tap, you can permanently erase all your data from our servers. No retention periods, no hidden archives.
          </p>
          <button
            id="privacy-clear-data-btn"
            onClick={() => setShowConfirmModal(true)}
            className="mt-auto self-start bg-transparent border border-[#dc2626] text-[#dc2626] hover:bg-[#fef2f2] font-heading font-semibold text-xs py-2.5 px-5 rounded-full transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
            <span>Clear Data Now</span>
          </button>
        </article>
      </div>

      {/* Footer Link */}
      <div className="mt-12 text-center pb-6">
        <p className="font-body text-sm md:text-base text-[#15803d]">
          For a detailed breakdown of our practices, read our{' '}
          <button
            onClick={() => setShowPolicyModal(true)}
            className="text-[#16a34a] font-semibold underline hover:text-[#15803d] transition-colors cursor-pointer"
          >
            Full Privacy Policy
          </button>
          .
        </p>
      </div>

      {/* Confirmation Modal for Clearing Data */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[#dee5d8] space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#fee2e2] text-[#dc2626] flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">warning</span>
            </div>
            <h3 className="font-heading text-xl font-bold text-[#052e16]">
              Clear all sanctuary data?
            </h3>
            <p className="font-body text-sm text-[#43483e] leading-relaxed">
              This will permanently delete all chat messages, mood check-ins, and journal reflections stored on this device. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-2.5 rounded-full border border-[#c2c8bd] text-sm font-semibold text-[#43483e] hover:bg-[#f0f2eb]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClear}
                className="px-5 py-2.5 rounded-full bg-[#dc2626] hover:bg-[#b91c1c] text-white text-sm font-semibold shadow-xs"
              >
                Yes, Permanently Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Privacy Policy Modal */}
      {showPolicyModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-[#dee5d8] space-y-4 no-scrollbar">
            <div className="flex justify-between items-center pb-2 border-b border-[#dee5d8]">
              <h3 className="font-heading text-xl font-bold text-[#052e16] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#15803d]">shield</span>
                Yours Truly Privacy Commitment
              </h3>
              <button
                onClick={() => setShowPolicyModal(false)}
                className="p-1 rounded-full text-[#72796f] hover:bg-[#eaede6]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3 font-body text-sm text-[#43483e] leading-relaxed">
              <h4 className="font-bold text-[#052e16] text-base">1. Student Sanctuary Guarantee</h4>
              <p>
                Yours Truly is designed from the ground up as a stress-free, judgment-free zone. We do not sell user data, track cross-platform identifiers, or share confidential reflections with universities, employers, or advertisers.
              </p>

              <h4 className="font-bold text-[#052e16] text-base">2. Local & Zero-Knowledge Storage</h4>
              <p>
                Your journal logs, check-ins, and focus history reside securely in your browser cache with client-side isolation. You can erase this data at any moment with a single click.
              </p>

              <h4 className="font-bold text-[#052e16] text-base">3. AI Conversation Processing</h4>
              <p>
                Chat prompts are processed via state-of-the-art empathetic Gemini language models solely to synthesize compassionate responses in real-time. Conversations are not used for public model training.
              </p>

              <h4 className="font-bold text-[#052e16] text-base">4. Crisis Escalation</h4>
              <p>
                Yours Truly is an empathetic companion, not a replacement for licensed medical care. In acute emergencies, we connect users directly to 24/7 human crisis resources such as the 988 Suicide & Crisis Lifeline.
              </p>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setShowPolicyModal(false)}
                className="px-6 py-2 rounded-full bg-[#15803d] text-white text-sm font-semibold shadow-xs"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
