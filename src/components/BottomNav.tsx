/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, Trophy, FileText, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isVerified: boolean;
  userRole: string;
}

export default function BottomNav({ activeTab, setActiveTab, isVerified, userRole }: BottomNavProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'challenge', label: 'Challenges', icon: Trophy },
    { id: 'ads', label: 'Ads', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0f0f]/95 border-t border-neutral-900/80 backdrop-blur-md py-2 px-4 flex justify-around items-center md:hidden shadow-xl rounded-t-xl">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            id={`nav-tab-${item.id}`}
            onClick={() => setActiveTab(item.id)}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 cursor-pointer active:scale-95"
          >
            <div className={`p-1.5 rounded-full transition-colors duration-200 ${isActive ? 'bg-[#8b0000] text-[#d4af37]' : 'text-neutral-500 hover:text-neutral-300'}`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <span className={`text-[10px] mt-0.5 font-medium tracking-wide transition-colors ${isActive ? 'text-[#d4af37] font-semibold' : 'text-neutral-500'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
