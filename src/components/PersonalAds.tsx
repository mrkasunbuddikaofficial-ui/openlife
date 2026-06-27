/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Ad, User } from '../types';
import { FileText, Search, PlusCircle, AlertCircle, MapPin, Send, HelpCircle, ShieldAlert, Mail, Image as ImageIcon } from 'lucide-react';

interface PersonalAdsProps {
  ads: Ad[];
  currentUser: User;
  onAddAd: (title: string, description: string, role: string, location: string, contact: string, imageUrl?: string) => void;
}

export default function PersonalAds({ ads, currentUser, onAddAd }: PersonalAdsProps) {
  const [filterRole, setFilterRole] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [adRole, setAdRole] = useState('SUB');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [adImage, setAdImage] = useState<string>('');

  const [errorToast, setErrorToast] = useState<string | null>(null);

  const handleAdImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      showToast('🚫 Please select a valid image file (PNG/JPG/WEBP).');
    }
  };

  const handlePublishAd = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser.isVerified) {
      showToast('🚫 Access Denied: Only Gold Verified ✅ members can publish ads.');
      return;
    }

    if (!title.trim() || !description.trim() || !location.trim() || !contact.trim()) {
      showToast('Please fill out all fields.');
      return;
    }

    onAddAd(title.trim(), description.trim(), adRole, location.trim(), contact.trim(), adImage || undefined);
    
    setTitle('');
    setDescription('');
    setLocation('');
    setContact('');
    setAdImage('');
    setShowForm(false);
    showToast('✨ Personal advertisement published successfully to the Board!');
  };

  const showToast = (msg: string) => {
    setErrorToast(msg);
    setTimeout(() => setErrorToast(null), 4000);
  };

  // Filter ads
  const filteredAds = ads.filter((ad) => {
    const matchesRole = filterRole === 'All' || ad.role === filterRole;
    const matchesSearch =
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto px-1 md:px-0 font-sans text-neutral-300">
      {/* ERROR / NOTIFICATION TOAST */}
      {errorToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-11/12 bg-neutral-900 border border-neutral-850 text-xs p-4 rounded-xl shadow-2xl flex items-center gap-2.5 text-white animate-slide-down font-medium">
          <AlertCircle className="w-4.5 h-4.5 text-[#d4af37]" />
          <span>{errorToast}</span>
        </div>
      )}

      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#121212]/50 border border-neutral-900 rounded-xl p-5 shadow-xl">
        <div>
          <h2 className="text-2xl font-bold text-white font-display flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#d4af37]" />
            Personal Advertisements
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Browse and connect with other verified members for structured arrangements, scenes, and mutual dynamics.
          </p>
        </div>

        <button
          onClick={() => {
            if (!currentUser.isVerified) {
              showToast('🚫 Get Verified: Publishing personal ads is restricted to verified ✅ members.');
              return;
            }
            setShowForm(!showForm);
          }}
          className="px-4 py-2.5 bg-[#8b0000] hover:bg-red-800 text-[#d4af37] font-bold rounded-xl text-xs tracking-wider transition flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" /> PLACE PERSONAL AD
        </button>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-[#121212] border border-neutral-900 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {['All', 'Mistress/DOM', 'Master', 'SUB', 'Slave'].map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition tracking-wide shrink-0 cursor-pointer ${filterRole === role ? 'bg-[#8b0000] text-white' : 'bg-neutral-900 text-neutral-500 hover:text-neutral-300'}`}
            >
              {role}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search location, keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#050505] border border-neutral-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#8b0000] transition"
          />
        </div>
      </div>

      {/* PUBLISH AD MODAL FORM */}
      {showForm && currentUser.isVerified && (
        <form onSubmit={handlePublishAd} className="bg-[#121212] border border-neutral-850 rounded-xl p-5 space-y-4 animate-fade-in shadow-2xl relative">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#d4af37]" />
          <h3 className="text-sm font-bold text-[#d4af37] uppercase tracking-wider">Draft Advertisement Listing</h3>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-neutral-500 uppercase block ml-1">Advertisement Title</label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Seeking loyal SUB in Berlin for protocol trials"
              className="w-full bg-[#050505] border border-neutral-800 rounded-xl p-2.5 text-xs text-white placeholder-neutral-700 focus:outline-none focus:border-[#8b0000]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-neutral-500 uppercase block ml-1 font-semibold text-[#d4af37]">Description / Expectations</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail your requirements, interests, rules, experience level, and what kind of arrangement you are looking for..."
              className="w-full bg-[#050505] border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-neutral-700 focus:outline-none focus:border-[#8b0000]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-neutral-500 uppercase block ml-1">Advertisement Image (Optional Direct Device Upload)</label>
            <div className="border border-dashed border-neutral-800 hover:border-[#8b0000]/50 rounded-xl p-4 bg-[#050505] text-center transition relative cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={handleAdImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {adImage ? (
                <div className="space-y-2">
                  <img src={adImage} className="max-h-[150px] mx-auto rounded object-cover border border-neutral-900" />
                  <p className="text-[10px] text-[#d4af37] font-semibold truncate">Direct image selected</p>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setAdImage(''); }}
                    className="text-[9px] text-red-500 hover:underline"
                  >
                    Remove and select another
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <ImageIcon className="w-6 h-6 text-neutral-600 mx-auto group-hover:text-[#d4af37] transition" />
                  <p className="text-[11px] font-semibold text-neutral-400">Click or Drag & Drop Image File</p>
                  <p className="text-[9px] text-neutral-600 font-mono">Select PNG, JPG, or WEBP from your device</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-neutral-500 uppercase block ml-1">Target Role</label>
              <select
                value={adRole}
                onChange={(e) => setAdRole(e.target.value)}
                className="w-full bg-[#050505] border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#8b0000]"
              >
                <option value="Mistress/DOM">Mistress/DOM</option>
                <option value="Master">Master</option>
                <option value="SUB">SUB</option>
                <option value="Slave">Slave</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-neutral-500 uppercase block ml-1">Location / Scope</label>
              <input
                required
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. London / Online"
                className="w-full bg-[#050505] border border-neutral-800 rounded-xl p-2.5 text-xs text-white placeholder-neutral-700 focus:outline-none focus:border-[#8b0000]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-neutral-500 uppercase block ml-1">Direct Contact Handle</label>
              <input
                required
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="e.g. Telegram: @handle"
                className="w-full bg-[#050505] border border-neutral-800 rounded-xl p-2.5 text-xs text-white placeholder-neutral-700 focus:outline-none focus:border-[#8b0000]"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs text-neutral-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#8b0000] hover:bg-red-800 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition"
            >
              Publish Listing
            </button>
          </div>
        </form>
      )}

      {/* LIST OF PERSONAL ADS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAds.length === 0 ? (
          <div className="col-span-2 bg-[#121212]/50 border border-neutral-900 rounded-xl p-8 text-center text-neutral-500">
            <FileText className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
            <p className="text-sm font-semibold">No personal advertisements found</p>
            <p className="text-xs text-neutral-600 mt-1">Try adjusting your filters or search keywords</p>
          </div>
        ) : (
          filteredAds.map((ad) => (
            <div
              key={ad.id}
              className="bg-[#121212]/90 border border-neutral-900 rounded-xl p-5 shadow-xl flex flex-col justify-between hover:border-neutral-800 transition relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-neutral-900" />
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[9px] font-mono text-[#d4af37] uppercase tracking-widest bg-[#d4af37]/5 border border-[#d4af37]/10 px-2 py-0.5 rounded-full block w-max mb-1">
                      {ad.role} ad
                    </span>
                    <h3 className="text-base font-bold text-white leading-snug">
                      {ad.title}
                    </h3>
                  </div>
                  <span className="text-[10px] text-neutral-600 font-mono shrink-0">
                    {new Date(ad.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {ad.imageUrl && (
                  <div className="rounded-xl overflow-hidden border border-neutral-950 bg-neutral-950 max-h-[220px] w-full flex items-center justify-center">
                    <img
                      src={ad.imageUrl}
                      alt="Ad visual"
                      className="w-full h-auto object-cover max-h-[220px]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                <p className="text-xs text-neutral-400 leading-relaxed font-sans whitespace-pre-wrap">
                  {ad.description}
                </p>

                <div className="space-y-2 border-t border-neutral-900/50 pt-3">
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <MapPin className="w-3.5 h-3.5 text-[#8b0000]" />
                    <span>{ad.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 bg-[#050505] p-2.5 rounded-lg border border-neutral-900 font-mono">
                    <Mail className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span className="text-neutral-300 font-semibold">{ad.contact}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-neutral-900/30 pt-3 flex items-center justify-between text-[10px] text-neutral-500">
                <span>By verified user: @{ad.username}</span>
                <span className="text-[#8b0000] font-bold">18+ RESTRICTED</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
