/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Post, Ad, VerificationRequest, PasswordResetRequest } from '../types';
import { Users, FileText, CheckCircle2, ShieldAlert, Award, AlertCircle, XCircle, Key, RefreshCw, PlusCircle, Check, Trash2 } from 'lucide-react';

interface AdminPanelProps {
  users: User[];
  posts: Post[];
  ads: Ad[];
  verificationRequests: VerificationRequest[];
  resetRequests: PasswordResetRequest[];
  onToggleUserStatus: (userId: string) => void;
  onChangeUserRank: (userId: string, rank: 'Best' | 'Better' | 'Normal' | 'Fake') => void;
  onCreateUser: (username: string, email: string, gender: string, role: string, rank: 'Best' | 'Better' | 'Normal' | 'Fake') => void;
  onResetUserPassword: (userId: string, newPass: string) => void;
  onDeletePost: (postId: string) => void;
  onDeleteAd: (adId: string) => void;
  onApproveVerification: (reqId: string, userId: string) => void;
  onRejectVerification: (reqId: string) => void;
  onCompleteResetRequest: (reqId: string, username: string, tempPass: string) => void;
}

export default function AdminPanel({
  users,
  posts,
  ads,
  verificationRequests,
  resetRequests,
  onToggleUserStatus,
  onChangeUserRank,
  onCreateUser,
  onResetUserPassword,
  onDeletePost,
  onDeleteAd,
  onApproveVerification,
  onRejectVerification,
  onCompleteResetRequest,
}: AdminPanelProps) {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'users' | 'content' | 'verifications' | 'resets'>('dashboard');

  // Create User Form state
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newGender, setNewGender] = useState('Female');
  const [newRole, setNewRole] = useState('SUB');
  const [newRank, setNewRank] = useState<'Best' | 'Better' | 'Normal' | 'Fake'>('Normal');

  // Edit Passwords state map
  const [userPasswords, setUserPasswords] = useState<{ [userId: string]: string }>({});

  // Reset WhatsApp Requests form state map
  const [resetPassMap, setResetPassMap] = useState<{ [reqId: string]: string }>({});

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newEmail.trim()) {
      showToast('⚠️ Please enter username and email.');
      return;
    }
    onCreateUser(newUsername.trim(), newEmail.trim(), newGender, newRole, newRank);
    setNewUsername('');
    setNewEmail('');
    showToast('👤 New role-based user account provisioned successfully!');
  };

  const handleUpdatePasswordClick = (userId: string, username: string) => {
    const pass = userPasswords[userId] || '';
    if (!pass.trim()) {
      showToast('⚠️ Passcode field cannot be empty.');
      return;
    }
    onResetUserPassword(userId, pass.trim());
    setUserPasswords({ ...userPasswords, [userId]: '' });
    showToast(`🔑 Passcode updated successfully for user ${username}!`);
  };

  const handleResetRequestSubmit = (req: PasswordResetRequest) => {
    const tempPass = resetPassMap[req.id] || '';
    if (!tempPass.trim()) {
      showToast('⚠️ Please type a temporary passcode.');
      return;
    }
    onCompleteResetRequest(req.id, req.username, tempPass.trim());
    setResetPassMap({ ...resetPassMap, [req.id]: '' });
    showToast(`🔑 Passcode reset completed for ${req.username}! WhatsApp notification dispatched.`);
  };

  return (
    <div id="admin-panel" className="pb-20 max-w-6xl mx-auto px-2 md:px-0 font-sans text-neutral-300 animate-fade-in flex flex-col lg:flex-row gap-6">
      {/* SUCCESS/ADMIN TOAST */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-11/12 bg-neutral-900 border border-[#d4af37]/40 text-sm p-4 rounded-xl shadow-2xl flex items-center gap-2 text-[#d4af37] animate-slide-down font-semibold">
          <span>{toast}</span>
        </div>
      )}

      {/* SIDEBAR FOR DESKTOP, HEADER FOR MOBILE */}
      <aside className="w-full lg:w-64 bg-[#121212]/95 border border-neutral-900 rounded-xl p-5 shrink-0 h-fit space-y-4 shadow-xl">
        <div className="border-b border-neutral-900 pb-3">
          <h2 className="text-lg font-bold text-white font-display">Admin Console</h2>
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37]">Platform Oversight</p>
        </div>

        <nav className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: ShieldAlert },
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'content', label: 'Content Board', icon: Trash2 },
            { id: 'verifications', label: 'Verifications', icon: CheckCircle2 },
            { id: 'resets', label: 'Passcode Resets', icon: Key },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wide transition shrink-0 cursor-pointer ${isActive ? 'bg-[#8b0000] text-[#d4af37] border-l-4 border-[#d4af37]' : 'text-neutral-500 hover:text-neutral-300 bg-transparent'}`}
              >
                <Icon className="w-4.5 h-4.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 bg-[#121212]/90 border border-neutral-900 rounded-xl p-5 md:p-6 shadow-xl space-y-6 min-h-[500px]">
        {/* VIEW 1: DASHBOARD OVERVIEW */}
        {activeSection === 'dashboard' && (
          <div className="space-y-6">
            <div className="border-b border-neutral-900 pb-3">
              <h3 className="text-xl font-bold text-white font-display">System Health & Live Analytics</h3>
              <p className="text-xs text-neutral-500">Real-time engagement activity log across Open Life servers</p>
            </div>

            {/* BENTO STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#050505] border border-neutral-850 p-5 rounded-xl space-y-1 relative overflow-hidden group">
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#8b0000]" />
                <span className="text-[10px] font-mono text-neutral-500 uppercase block tracking-widest">Real-Time Engagement</span>
                <h4 className="text-4xl font-extrabold text-white font-display">14,204</h4>
                <span className="text-[10px] text-green-500 font-bold block">+12.4% vs last cycle</span>
              </div>

              <div className="bg-[#050505] border border-neutral-850 p-5 rounded-xl space-y-1 relative overflow-hidden">
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#d4af37]" />
                <span className="text-[10px] font-mono text-neutral-500 uppercase block tracking-widest">Active Members</span>
                <h4 className="text-4xl font-extrabold text-[#d4af37] font-display">1.2M</h4>
                <span className="text-[10px] text-neutral-500 font-mono block">Across all niche channels</span>
              </div>

              <div className="bg-[#050505] border border-neutral-850 p-5 rounded-xl space-y-1 relative overflow-hidden">
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-neutral-800" />
                <span className="text-[10px] font-mono text-neutral-500 uppercase block tracking-widest">Live Server Load</span>
                <h4 className="text-4xl font-extrabold text-neutral-400 font-display">14%</h4>
                <span className="text-[10px] text-neutral-500 font-mono block">Node API latency 42ms</span>
              </div>
            </div>

            {/* Platform Health indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#050505] border border-neutral-850 p-4 rounded-xl space-y-3 text-xs">
                <h4 className="font-bold text-white uppercase tracking-wider font-display">Platform Telemetry</h4>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[10px] text-neutral-500 mb-1">
                      <span>Server Uptime</span>
                      <span className="text-[#d4af37]">99.98%</span>
                    </div>
                    <div className="h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 w-[99%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] text-neutral-500 mb-1">
                      <span>Database Synced Logs</span>
                      <span className="text-green-500">Normal</span>
                    </div>
                    <div className="h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-[85%]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#050505] border border-neutral-850 p-4 rounded-xl flex flex-col justify-between text-xs">
                <h4 className="font-bold text-white uppercase tracking-wider font-display">Admin Quick stats</h4>
                <div className="grid grid-cols-2 gap-2 text-center text-neutral-400 mt-2">
                  <div className="bg-neutral-900/50 p-2.5 rounded-lg border border-neutral-900">
                    <span className="text-white font-bold block text-lg">{users.length}</span>
                    <span>Total Accounts</span>
                  </div>
                  <div className="bg-neutral-900/50 p-2.5 rounded-lg border border-neutral-900">
                    <span className="text-[#d4af37] font-bold block text-lg">
                      {verificationRequests.filter(r => r.status === 'pending').length}
                    </span>
                    <span>Pending Review</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: USER MANAGEMENT */}
        {activeSection === 'users' && (
          <div className="space-y-6">
            <div className="border-b border-neutral-900 pb-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
              <div>
                <h3 className="text-lg font-bold text-white font-display">👥 User Management Console</h3>
                <p className="text-xs text-neutral-500">Configure role privileges, status activations, ranks and passcodes</p>
              </div>
            </div>

            {/* CREATE ACCOUNT INLINE FORM */}
            <form onSubmit={handleCreateUserSubmit} className="bg-[#050505] border border-neutral-850 p-4 rounded-xl space-y-4 text-xs">
              <h4 className="font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-1">
                <PlusCircle className="w-4 h-4" /> Provision New Member Account
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  required
                  type="text"
                  placeholder="Username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="bg-neutral-900 border border-neutral-850 rounded-lg p-2 text-white placeholder-neutral-600 focus:outline-none"
                />
                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="bg-neutral-900 border border-neutral-850 rounded-lg p-2 text-white placeholder-neutral-600 focus:outline-none"
                />
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="bg-neutral-900 border border-neutral-850 rounded-lg p-2 text-white focus:outline-none"
                >
                  <option value="Mistress/DOM">Mistress/DOM</option>
                  <option value="Master">Master</option>
                  <option value="SUB">SUB</option>
                  <option value="Slave">Slave</option>
                </select>
              </div>

              <div className="flex gap-4 justify-between items-center">
                <div className="flex gap-4 items-center">
                  <div className="flex gap-2 items-center">
                    <span className="text-neutral-500 font-mono text-[9px] uppercase">Gender:</span>
                    <select
                      value={newGender}
                      onChange={(e) => setNewGender(e.target.value)}
                      className="bg-neutral-900 border border-neutral-850 rounded-lg p-1.5 text-white text-[11px]"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-binary">Non-binary</option>
                    </select>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-neutral-500 font-mono text-[9px] uppercase">Initial Rank:</span>
                    <select
                      value={newRank}
                      onChange={(e) => setNewRank(e.target.value as any)}
                      className="bg-neutral-900 border border-neutral-850 rounded-lg p-1.5 text-white text-[11px]"
                    >
                      <option value="Best">Best</option>
                      <option value="Better">Better</option>
                      <option value="Normal">Normal</option>
                      <option value="Fake">Fake</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#8b0000] hover:bg-red-800 text-white font-bold rounded-lg uppercase tracking-wider text-[10px] transition cursor-pointer"
                >
                  Create Member
                </button>
              </div>
            </form>

            {/* LIST OF USERS TABLE */}
            <div className="overflow-x-auto border border-neutral-850 rounded-xl bg-[#050505]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-900 text-neutral-400 border-b border-neutral-850">
                    <th className="p-3 font-semibold uppercase tracking-wider text-[9px]">Username</th>
                    <th className="p-3 font-semibold uppercase tracking-wider text-[9px]">Role / Badges</th>
                    <th className="p-3 font-semibold uppercase tracking-wider text-[9px]">Status</th>
                    <th className="p-3 font-semibold uppercase tracking-wider text-[9px]">Rank Adjustment</th>
                    <th className="p-3 font-semibold uppercase tracking-wider text-[9px] text-right">Reset Passcode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-neutral-900/40 transition">
                      <td className="p-3 font-bold text-white flex items-center gap-1.5">
                        {user.username}
                        {user.isVerified && <span className="text-[#d4af37]" title="Verified">✅</span>}
                      </td>
                      <td className="p-3">
                        <span className="text-[10px] font-mono text-[#d4af37] bg-[#d4af37]/5 px-2 py-0.5 rounded border border-[#d4af37]/10 uppercase tracking-widest block w-max">
                          {user.role}
                        </span>
                        {user.badges.length > 0 && (
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {user.badges.map((b) => (
                              <span key={b} className="text-[8px] bg-[#8b0000]/15 text-[#d4af37] px-1 py-0.5 rounded uppercase font-mono">
                                {b}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => onToggleUserStatus(user.id)}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition cursor-pointer ${user.isActivated ? 'bg-green-950/20 text-green-400 border border-green-800/20 hover:bg-green-900/30' : 'bg-red-950/20 text-red-400 border border-red-800/20 hover:bg-red-900/30'}`}
                        >
                          {user.isActivated ? '● Active' : '○ Deactive'}
                        </button>
                      </td>
                      <td className="p-3">
                        <select
                          value={user.rank}
                          onChange={(e) => onChangeUserRank(user.id, e.target.value as any)}
                          className="bg-neutral-900 border border-neutral-850 rounded px-2 py-1 text-[11px] text-white focus:outline-none"
                        >
                          <option value="Best">Best</option>
                          <option value="Better">Better</option>
                          <option value="Normal">Normal</option>
                          <option value="Fake">Fake</option>
                        </select>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <input
                            type="password"
                            placeholder="New Pass"
                            value={userPasswords[user.id] || ''}
                            onChange={(e) => setUserPasswords({ ...userPasswords, [user.id]: e.target.value })}
                            className="bg-neutral-900 border border-neutral-850 rounded px-2 py-1 text-[10px] placeholder-neutral-700 w-24 text-white"
                          />
                          <button
                            onClick={() => handleUpdatePasswordClick(user.id, user.username)}
                            className="p-1 bg-[#8b0000] hover:bg-red-800 text-white rounded transition cursor-pointer"
                            title="Reset directly"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 3: CONTENT BOARD MANAGEMENT */}
        {activeSection === 'content' && (
          <div className="space-y-6">
            <div className="border-b border-neutral-900 pb-3">
              <h3 className="text-lg font-bold text-white font-display">📋 Content board Management</h3>
              <p className="text-xs text-neutral-500">View and remove potentially harmful or violates rules posts/advertisements</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* FEED POSTS PANEL */}
              <div className="space-y-3 bg-[#050505] p-4 border border-neutral-850 rounded-xl">
                <h4 className="font-bold text-white uppercase tracking-wider font-display border-b border-neutral-900 pb-2">
                  Active Feed Posts ({posts.length})
                </h4>
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {posts.map((post) => (
                    <div key={post.id} className="p-3 bg-neutral-900/60 border border-neutral-850 rounded-lg flex justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-[#d4af37] font-semibold">@{post.username} ({post.userRole})</p>
                        <p className="text-neutral-400 line-clamp-2 leading-snug">"{post.text}"</p>
                      </div>
                      <button
                        onClick={() => {
                          onDeletePost(post.id);
                          showToast('🗑️ Post deleted successfully!');
                        }}
                        className="p-2 bg-neutral-800 hover:bg-red-950/20 text-red-400 rounded-lg hover:border hover:border-red-900 transition self-center cursor-pointer"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* PERSONAL ADS PANEL */}
              <div className="space-y-3 bg-[#050505] p-4 border border-neutral-850 rounded-xl">
                <h4 className="font-bold text-white uppercase tracking-wider font-display border-b border-neutral-900 pb-2">
                  Active Personal Advertisements ({ads.length})
                </h4>
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {ads.map((ad) => (
                    <div key={ad.id} className="p-3 bg-neutral-900/60 border border-neutral-850 rounded-lg flex justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-[#d4af37] font-semibold">{ad.title}</p>
                        <p className="text-neutral-400 line-clamp-2 leading-snug">"{ad.description}"</p>
                        <span className="text-[9px] text-neutral-600 block">By: @{ad.username}</span>
                      </div>
                      <button
                        onClick={() => {
                          onDeleteAd(ad.id);
                          showToast('🗑️ Personal advertisement deleted!');
                        }}
                        className="p-2 bg-neutral-800 hover:bg-red-950/20 text-red-400 rounded-lg hover:border hover:border-red-900 transition self-center cursor-pointer"
                        title="Delete Ad"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: VERIFICATION REQUESTS */}
        {activeSection === 'verifications' && (
          <div className="space-y-6">
            <div className="border-b border-neutral-900 pb-3">
              <h3 className="text-lg font-bold text-white font-display">✅ Account Verification Requests</h3>
              <p className="text-xs text-neutral-500">Review submitted legal credentials, face selfie angles, and recorded 8s videos</p>
            </div>

            <div className="space-y-4">
              {verificationRequests.filter((r) => r.status === 'pending').length === 0 ? (
                <div className="bg-[#050505] border border-neutral-850 p-8 rounded-xl text-center text-neutral-500">
                  <CheckCircle2 className="w-12 h-12 text-green-950 mx-auto mb-3" />
                  <p className="text-sm font-semibold">All verification requests cleared</p>
                  <p className="text-xs text-neutral-600 mt-1">There are no pending accounts waiting for gold badges.</p>
                </div>
              ) : (
                verificationRequests
                  .filter((r) => r.status === 'pending')
                  .map((req) => (
                    <div key={req.id} className="bg-[#050505] border border-neutral-850 p-5 rounded-xl space-y-4 text-xs">
                      {/* Request Header */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-neutral-900 pb-3">
                        <div>
                          <span className="text-[10px] font-mono text-[#d4af37] bg-[#d4af37]/5 border border-[#d4af37]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Pending Approval
                          </span>
                          <h4 className="text-sm font-bold text-white mt-1">
                            Request from @{req.username} (Full Name: {req.fullName})
                          </h4>
                        </div>
                        <span className="text-[10px] text-neutral-600 font-mono">
                          Submitted on {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Request Body Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 bg-neutral-900/30 p-3 rounded-lg border border-neutral-900">
                          <p className="text-neutral-400 font-semibold uppercase tracking-wider text-[9px]">Account Details:</p>
                          <p className="text-neutral-300"><strong>Full Name:</strong> {req.fullName}</p>
                          <p className="text-neutral-300"><strong>Location:</strong> {req.location}</p>
                          <p className="text-neutral-300"><strong>Age:</strong> {req.age} (Must be 18+)</p>
                          <p className="text-neutral-300"><strong>Gender:</strong> {req.gender}</p>
                        </div>

                        <div className="space-y-2 bg-neutral-900/30 p-3 rounded-lg border border-neutral-900">
                          <p className="text-neutral-400 font-semibold uppercase tracking-wider text-[9px]">Recorded Video Proof Check:</p>
                          {req.videoUrl.startsWith('data:video/') ? (
                            <div className="bg-black rounded-lg overflow-hidden border border-neutral-850 p-1 flex justify-center max-h-[140px]">
                              <video src={req.videoUrl} className="max-h-[130px] w-auto" controls />
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 bg-black p-3 border border-neutral-850 rounded">
                              <span className="text-2xl animate-pulse">🔴</span>
                              <div>
                                <p className="text-[#d4af37] font-bold">BLINK-TEST COMPLETED</p>
                                <p className="text-[10px] text-neutral-500">{req.videoUrl}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 3 Selfie Angle Images display */}
                      <div className="space-y-2">
                        <p className="text-neutral-400 font-semibold uppercase tracking-wider text-[9px]">3 Face Selfie Angles:</p>
                        <div className="grid grid-cols-3 gap-3">
                          {req.selfies.map((url, idx) => (
                            <div key={idx} className="aspect-square bg-neutral-950 rounded-lg overflow-hidden border border-neutral-900 max-h-[140px] flex items-center justify-center relative">
                              <img src={url} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest">
                                Angle {idx + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Approve/Reject CTA */}
                      <div className="flex gap-2 justify-end pt-2 border-t border-neutral-900/50">
                        <button
                          onClick={() => {
                            onRejectVerification(req.id);
                            showToast('❌ Verification request rejected.');
                          }}
                          className="px-4 py-2 bg-neutral-900 hover:bg-red-950/20 text-red-500 border border-neutral-850 hover:border-red-900 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                        >
                          Reject Request ❌
                        </button>
                        <button
                          onClick={() => {
                            onApproveVerification(req.id, req.userId);
                            showToast('✅ Account verification approved. Gold badge allocated!');
                          }}
                          className="px-5 py-2 bg-[#8b0000] hover:bg-red-800 text-[#d4af37] font-bold border border-[#d4af37]/20 rounded-lg text-xs uppercase tracking-wider transition cursor-pointer"
                        >
                          Approve ✅
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {/* VIEW 5: PASSWORD RESET REQUESTS (Forgot Pass via WhatsApp) */}
        {activeSection === 'resets' && (
          <div className="space-y-6">
            <div className="border-b border-neutral-900 pb-3">
              <h3 className="text-lg font-bold text-white font-display">🔑 WhatsApp Password Reset Requests</h3>
              <p className="text-xs text-neutral-500">View usernames and WhatsApp numbers submitted by locked-out members. Allocate direct temporary passwords.</p>
            </div>

            <div className="space-y-4">
              {resetRequests.filter((r) => r.status === 'pending').length === 0 ? (
                <div className="bg-[#050505] border border-neutral-850 p-8 rounded-xl text-center text-neutral-500">
                  <CheckCircle2 className="w-12 h-12 text-green-950 mx-auto mb-3" />
                  <p className="text-sm font-semibold">All passcode resets processed</p>
                  <p className="text-xs text-neutral-600 mt-1">No pending WhatsApp reset requests are currently waiting.</p>
                </div>
              ) : (
                resetRequests
                  .filter((r) => r.status === 'pending')
                  .map((req) => (
                    <div key={req.id} className="bg-[#050505] border border-neutral-850 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[#d4af37] bg-[#d4af37]/5 px-2 py-0.5 border border-[#d4af37]/10 rounded-full w-max block uppercase tracking-wider">
                          Reset Requested
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          Locked Username: @{req.username}
                        </h4>
                        <p className="text-neutral-400 font-mono">
                          WhatsApp contact number: <strong className="text-neutral-200">{req.whatsappNumber}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          required
                          type="password"
                          placeholder="Assign Temp Passcode"
                          value={resetPassMap[req.id] || ''}
                          onChange={(e) => setResetPassMap({ ...resetPassMap, [req.id]: e.target.value })}
                          className="bg-neutral-900 border border-neutral-850 rounded-xl p-2.5 text-xs text-white placeholder-neutral-700 w-44"
                        />
                        <button
                          onClick={() => handleResetRequestSubmit(req)}
                          className="px-4 py-2.5 bg-[#8b0000] hover:bg-red-800 text-[#d4af37] font-bold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
                        >
                          Complete Reset & WhatsApp Notify
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
