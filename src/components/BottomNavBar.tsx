import React from 'react';
import { ActiveTab } from '../types';

interface BottomNavBarProps {
  activeTab: ActiveTab | 'welcome' | 'privacy';
  setActiveTab: (tab: ActiveTab) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const tabs: { key: ActiveTab; label: string; icon: string }[] = [
    { key: 'home', label: 'Home', icon: 'home' },
    { key: 'chat', label: 'Chat', icon: 'chat_bubble' },
    { key: 'insights', label: 'Insights', icon: 'analytics' },
    { key: 'resources', label: 'Resources', icon: 'auto_stories' },
  ];

  return (
    <nav
      id="bottom-navbar"
      className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-2.5 pb-safe bg-[#fdfdf5]/95 backdrop-blur-lg border-t border-[#e8eae0] shadow-[0_-4px_20px_0_rgba(56,106,32,0.06)] rounded-t-2xl z-50"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            id={`bottom-nav-${tab.key}`}
            onClick={() => setActiveTab(tab.key)}
            className={`flex flex-col items-center justify-center transition-all duration-200 ${
              isActive
                ? 'bg-[#b7f397] text-[#042100] rounded-full px-5 py-1.5 shadow-xs scale-100 font-semibold'
                : 'text-[#43483e] hover:bg-[#e8f5e9]/60 px-3 py-1.5 rounded-xl'
            }`}
          >
            <span
              className={`material-symbols-outlined mb-0.5 text-[22px] ${
                isActive ? 'fill-icon' : ''
              }`}
            >
              {tab.icon}
            </span>
            <span className="text-[11px] tracking-wide font-medium leading-none">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
