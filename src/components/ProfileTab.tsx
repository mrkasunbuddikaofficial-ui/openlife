/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { User, Post, Ad } from '../types';
import { ShieldCheck, Award, FileText, Settings, Key, LogOut, CheckCircle, HelpCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface ProfileTabProps {
  currentUser: User;
  users: User[];
  posts: Post[];
  ads: Ad[];
  onLogout: () => void;
  onSwitchUser: (userId: string) => void;
  onChangePassword: (oldPass: string, newPass: string) => boolean;
  onGoToVerification: () => void;
  onDeletePost: (id: string) => void;
  onDeleteAd: (id: string) => void;
}

export default function ProfileTab({
  currentUser,
  users,
  posts,
  ads,
  onLogout,
  onSwitchUser,
  onChangePassword,
  onGoToVerification,
  onDeletePost,
  onDeleteAd,
}: ProfileTabProps) {
  const [profileSubTab, setProfileSubTab] = useState<'posts' | 'ads' | 'settings'>('posts');

  // Change Password States
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<{ success?: boolean; error?: string } | null>(null);

  const myPosts = posts.filter((p) => p.userId === currentUser.id);
  const myAds = ads.filter((a) => a.userId === currentUser.id);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordStatus({ error: 'All fields are required.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ error: 'New password and confirmation do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordStatus({ error: 'New password must be at least 6 characters.' });
      return;
    }

    const success = onChangePassword(oldPassword, newPassword);
    if (success) {
      setPasswordStatus({ success: true });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordStatus({ error: 'Incorrect current password.' });
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto px-1 md:px-0 font-sans text-neutral-300 animate-fade-in">
      {/* HERO / AVATAR HEADER */}
      <div className="bg-[#121212]/95 border border-neutral-900 rounded-xl p-6 shadow-xl relative overflow-hidden">
        {/* Top Gold Stripe */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-600 via-[#d4af37] to-red-600" />
        
        <div className="flex flex-col md:flex-row items-center gap-6 justify-between relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-5">
            {/* Circular Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-neutral-800 border-2 border-neutral-700 flex items-center justify-center font-bold text-3xl text-white shadow-lg overflow-hidden uppercase">
                {currentUser.username[0]}
              </div>
              {currentUser.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-black text-[#d4af37] w-7 h-7 rounded-full flex items-center justify-center border-2 border-[#d4af37] text-xs font-bold" title="Gold Verified Badge">
                  ✅
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="text-center md:text-left space-y-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <h1 className="text-2xl font-bold text-white font-display flex items-center justify-center md:justify-start gap-1">
                  {currentUser.username}
                  {currentUser.isVerified && (
                    <span className="text-[#d4af37] text-sm font-bold">✅</span>
                  )}
                </h1>

                {/* Badge/Rank */}
                <span className="px-2.5 py-0.5 border border-[#d4af37]/30 text-[#d4af37] text-[10px] tracking-widest font-bold uppercase rounded-full bg-[#d4af37]/5 w-max mx-auto md:mx-0">
                  {currentUser.role}
                </span>
              </div>

              <p className="text-xs text-neutral-400">{currentUser.email}</p>

              {/* Badges List */}
              <div className="flex flex-wrap gap-1 justify-center md:justify-start pt-1.5">
                {currentUser.badges.map((b) => (
                  <span
                    key={b}
                    className="bg-[#8b0000]/10 text-[#d4af37] border border-[#8b0000]/30 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase font-mono tracking-wider flex items-center gap-1"
                  >
                    🏆 {b}
                  </span>
                ))}
                {currentUser.badges.length === 0 && (
                  <span className="text-[10px] text-neutral-600 italic">No prestigious badges yet</span>
                )}
              </div>
            </div>
          </div>

          {/* Verification Callout Box */}
          <div className="bg-neutral-900/80 border border-neutral-850 p-4 rounded-xl text-center md:text-right max-w-sm w-full space-y-2">
            <div className="flex items-center gap-2 justify-center md:justify-end text-sm">
              <span className="text-neutral-400 font-semibold">Verification:</span>
              {currentUser.isVerified ? (
                <span className="text-green-500 font-bold flex items-center gap-1 bg-green-950/20 px-2 py-0.5 rounded border border-green-800/20 text-xs">
                  ✅ GOLD VERIFIED
                </span>
              ) : (
                <span className="text-amber-500 font-bold flex items-center gap-1 bg-amber-950/20 px-2 py-0.5 rounded border border-amber-800/20 text-xs">
                  ⚠️ UNVERIFIED
                </span>
              )}
            </div>

            {!currentUser.isVerified ? (
              <button
                onClick={onGoToVerification}
                className="w-full py-2 bg-[#8b0000] hover:bg-red-800 text-white font-bold rounded-lg text-xs tracking-wider transition uppercase cursor-pointer"
              >
                Apply for Gold Badge ✅
              </button>
            ) : (
              <p className="text-[10px] text-neutral-500 italic">
                You have full premium access to commenting, messaging, advertising, and challenge participation.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* QUICK DEMO SWITCHER */}
      <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center text-xs">
        <div className="flex items-center gap-2 text-neutral-400">
          <RefreshCw className="w-4 h-4 text-[#d4af37] animate-spin-slow shrink-0" />
          <span>
            <strong>Interactive Sandbox Switcher:</strong> Switch role contexts easily to experience submissions, requests, and approvals!
          </span>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {users.map((u) => (
            <button
              key={u.id}
              onClick={() => onSwitchUser(u.id)}
              className={`px-2.5 py-1 rounded border text-[10px] font-mono transition cursor-pointer ${currentUser.id === u.id ? 'bg-[#d4af37] text-black border-[#d4af37] font-bold' : 'bg-neutral-900 border-neutral-800 hover:text-white'}`}
            >
              {u.username}
            </button>
          ))}
        </div>
      </div>

      {/* SUB PROFILE TABS (My Posts | My Ads | Change Pass) */}
      <div className="bg-[#121212] border border-neutral-900 rounded-xl overflow-hidden shadow-xl">
        <div className="flex border-b border-neutral-900 bg-neutral-950/30">
          <button
            onClick={() => setProfileSubTab('posts')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition border-b-2 ${profileSubTab === 'posts' ? 'border-[#8b0000] text-white bg-[#121212]' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
          >
            My Posts ({myPosts.length})
          </button>
          <button
            onClick={() => setProfileSubTab('ads')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition border-b-2 ${profileSubTab === 'ads' ? 'border-[#8b0000] text-white bg-[#121212]' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
          >
            My Ads ({myAds.length})
          </button>
          <button
            onClick={() => setProfileSubTab('settings')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition border-b-2 ${profileSubTab === 'settings' ? 'border-[#8b0000] text-white bg-[#121212]' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
          >
            Settings & Passcode
          </button>
        </div>

        <div className="p-5">
          {/* POSTS LISTING */}
          {profileSubTab === 'posts' && (
            <div className="space-y-4">
              {myPosts.length === 0 ? (
                <p className="text-xs text-neutral-500 italic text-center py-8">You have not published any feed posts yet.</p>
              ) : (
                myPosts.map((post) => (
                  <div key={post.id} className="bg-[#050505] border border-neutral-850 p-4 rounded-xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {post.mediaUrl && (
                        <div className="w-12 h-12 rounded bg-cover bg-center overflow-hidden border border-neutral-900 shrink-0" style={{ backgroundImage: `url('${post.mediaUrl}')` }} />
                      )}
                      <div>
                        <p className="text-xs text-white font-semibold line-clamp-1">{post.text}</p>
                        <span className="text-[10px] text-neutral-500 font-mono">{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onDeletePost(post.id)}
                      className="px-3 py-1 bg-neutral-900 border border-neutral-800 hover:bg-red-950/20 hover:border-red-900 text-red-400 rounded-lg text-[10px] font-semibold transition cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ADS LISTING */}
          {profileSubTab === 'ads' && (
            <div className="space-y-4">
              {myAds.length === 0 ? (
                <p className="text-xs text-neutral-500 italic text-center py-8">You have not published any advertisements yet.</p>
              ) : (
                myAds.map((ad) => (
                  <div key={ad.id} className="bg-[#050505] border border-neutral-850 p-4 rounded-xl flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-white">{ad.title}</h4>
                      <p className="text-[10px] text-neutral-400 mt-1 flex gap-2 font-mono">
                        <span>📍 {ad.location}</span>
                        <span>👥 Role: {ad.role}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => onDeleteAd(ad.id)}
                      className="px-3 py-1 bg-neutral-900 border border-neutral-800 hover:bg-red-950/20 hover:border-red-900 text-red-400 rounded-lg text-[10px] font-semibold transition cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* CHANGE PASSWORD SETTINGS */}
          {profileSubTab === 'settings' && (
            <div className="max-w-md space-y-6">
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="border-b border-neutral-900 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-[#d4af37]" />
                    Change Secret Passcode
                  </h3>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Maintain security on your adult sanctuary profile</p>
                </div>

                {passwordStatus && (
                  <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${passwordStatus.success ? 'bg-green-950/20 border border-green-800/30 text-green-400' : 'bg-red-950/20 border border-red-800/30 text-red-400'}`}>
                    {passwordStatus.success ? '✓ Passcode updated successfully!' : passwordStatus.error}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-neutral-500 uppercase block ml-1">Current Passcode</label>
                  <input
                    required
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#050505] border border-neutral-800 rounded-xl p-2.5 text-xs text-white placeholder-neutral-700 focus:outline-none focus:border-[#8b0000]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase block ml-1">New Passcode</label>
                    <input
                      required
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full bg-[#050505] border border-neutral-800 rounded-xl p-2.5 text-xs text-white placeholder-neutral-700 focus:outline-none focus:border-[#8b0000]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase block ml-1">Confirm New Passcode</label>
                    <input
                      required
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#050505] border border-neutral-800 rounded-xl p-2.5 text-xs text-white placeholder-neutral-700 focus:outline-none focus:border-[#8b0000]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#8b0000] hover:bg-red-800 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition cursor-pointer"
                >
                  Save Passcode Changes
                </button>
              </form>

              <div className="border-t border-neutral-900 pt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Log Out Session</h4>
                    <p className="text-[10px] text-neutral-500 mt-0.5">End your encrypted session on this device</p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="px-4 py-2 bg-neutral-900 hover:bg-red-950/20 text-neutral-400 hover:text-red-400 border border-neutral-800 hover:border-red-900 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Log Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
