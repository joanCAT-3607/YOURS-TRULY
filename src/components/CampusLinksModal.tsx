import React from 'react';
import { CAMPUS_RESOURCES, ASSETS } from '../data/mockData';

interface CampusLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CampusLinksModal: React.FC<CampusLinksModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0d1c2e]/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#fcfdf6] rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white flex flex-col no-scrollbar animate-fadeIn">
        {/* Header with image */}
        <div className="relative h-28 -mx-6 -mt-6 md:-mx-8 md:-mt-8 mb-6 rounded-t-3xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url('${ASSETS.campusCourtyard}')` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-5">
            <div className="text-white">
              <h2 className="font-heading text-xl md:text-2xl font-bold">
                Campus Mental Health Sanctuary
              </h2>
              <p className="text-xs text-white/90">
                Direct, confidential access to university and crisis services
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Urgent Hotline Highlight Banner */}
        <div className="p-4 rounded-2xl bg-[#ffdad6] border border-[#ba1a1a]/30 mb-6 flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">emergency</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-sm md:text-base font-bold text-[#93000a]">
                National 24/7 Suicide & Crisis Lifeline
              </h3>
              <span className="text-[10px] uppercase font-bold bg-[#ba1a1a] text-white px-2 py-0.5 rounded-full">
                24/7 Free
              </span>
            </div>
            <p className="text-xs text-[#410002] mt-0.5">
              Call or text <strong>988</strong> anytime for immediate, confidential human support. Text <strong>HOME</strong> to <strong>741741</strong> for Crisis Text Line.
            </p>
            <a
              href="tel:988"
              className="inline-flex items-center gap-1.5 mt-2 px-4 py-1.5 rounded-full bg-[#ba1a1a] text-white text-xs font-semibold hover:bg-[#93000a] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">call</span>
              <span>Call 988 Now</span>
            </a>
          </div>
        </div>

        {/* Directory Cards */}
        <div className="space-y-3.5 flex-1">
          {CAMPUS_RESOURCES.map((resource) => (
            <div
              key={resource.id}
              className="p-4 rounded-2xl bg-white border border-[#dee5d8] shadow-2xs hover:border-[#b7f397] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#e8f5e9] text-[#2e7d32] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[20px]">
                    {resource.icon}
                  </span>
                </div>
                <div>
                  <h4 className="font-heading text-sm md:text-base font-bold text-[#1b5e20]">
                    {resource.title}
                  </h4>
                  <p className="text-xs text-[#52634f] mt-0.5">
                    {resource.subtitle}
                  </p>
                  <span className="inline-block mt-1 text-xs font-semibold text-[#1a1c19] bg-[#f0f2eb] px-2 py-0.5 rounded-md">
                    {resource.contact}
                  </span>
                </div>
              </div>

              <div className="self-end sm:self-center shrink-0">
                {resource.type === 'phone' ? (
                  <a
                    href={`tel:${resource.contact.replace(/[^\d]/g, '')}`}
                    className="px-4 py-1.5 rounded-full bg-[#b7f397] hover:bg-[#9cd67e] text-[#042100] text-xs font-semibold flex items-center gap-1 transition-all"
                  >
                    <span className="material-symbols-outlined text-[15px]">call</span>
                    <span>{resource.actionLabel}</span>
                  </a>
                ) : (
                  <button
                    onClick={() => alert(`Connecting with ${resource.title}. Help is available.`)}
                    className="px-4 py-1.5 rounded-full bg-[#eaede6] hover:bg-[#dcedc8] text-[#1b5e20] text-xs font-semibold flex items-center gap-1 transition-all"
                  >
                    <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                    <span>{resource.actionLabel}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#dee5d8] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-[#386a20] text-white text-xs font-semibold shadow-xs hover:bg-[#2e7d32] transition-colors"
          >
            Close Sanctuary Directory
          </button>
        </div>
      </div>
    </div>
  );
};
