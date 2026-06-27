/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Challenge, Submission, User } from '../types';
import { Trophy, Clock, Plus, Eye, Award, CheckCircle, HelpCircle, AlertTriangle, Send, ShieldAlert, Image as ImageIcon } from 'lucide-react';

interface ChallengeRoomProps {
  challenges: Challenge[];
  submissions: Submission[];
  currentUser: User;
  onAddChallenge: (text: string, durationDays: number, mediaUrl?: string) => void;
  onAddSubmission: (challengeId: string, text: string, mediaUrl: string) => void;
  onChooseWinner: (challengeId: string, submissionId: string, winnerId: string, winnerUsername: string) => void;
  users: User[];
}

export default function ChallengeRoom({
  challenges,
  submissions,
  currentUser,
  onAddChallenge,
  onAddSubmission,
  onChooseWinner,
  users,
}: ChallengeRoomProps) {
  const [showCreator, setShowCreator] = useState(false);
  const [showSubmissionsForChallengeId, setShowSubmissionsForChallengeId] = useState<string | null>(null);

  // Forms states
  const [chalText, setChalText] = useState('');
  const [chalDuration, setChalDuration] = useState(3);
  const [chalMedia, setChalMedia] = useState('');

  const [joinChallengeId, setJoinChallengeId] = useState<string | null>(null);
  const [subText, setSubText] = useState('');
  const [subMedia, setSubMedia] = useState('');
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [fileError, setFileError] = useState<string | null>(null);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError(null);

    if (file.type.startsWith('video/')) {
      const videoEl = document.createElement('video');
      videoEl.preload = 'metadata';
      videoEl.src = URL.createObjectURL(file);
      videoEl.onloadedmetadata = () => {
        URL.revokeObjectURL(videoEl.src);
        if (videoEl.duration > 8.5) {
          setFileError('🚫 Video exceeds the 8-second limit. Please clip your video.');
          setSubMedia('');
          showToast('🚫 Video exceeds 8-second limit.');
        } else {
          const reader = new FileReader();
          reader.onloadend = () => {
            setSubMedia(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
      };
    } else if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSubMedia(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFileError('🚫 Only image or video files are supported.');
      showToast('🚫 Unsupported file type.');
    }
  };

  const isCreatorRole = currentUser.role === 'Mistress/DOM' || currentUser.role === 'Master';

  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chalText.trim()) return;

    onAddChallenge(chalText.trim(), chalDuration, chalMedia.trim() || undefined);
    
    setChalText('');
    setChalMedia('');
    setChalDuration(3);
    setShowCreator(false);
    showToast('🏆 Challenge posted successfully to the Void!');
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinChallengeId || !subText.trim() || !subMedia.trim()) return;

    if (!currentUser.isVerified) {
      showToast('🚫 Get Verified: Only Verified ✅ members can participate in challenges.');
      return;
    }

    onAddSubmission(joinChallengeId, subText.trim(), subMedia.trim());
    setSubText('');
    setSubMedia('');
    setJoinChallengeId(null);
    showToast('🔥 Submission uploaded successfully to the Creator dashboard!');
  };

  const handleAwardWinner = (challengeId: string, submission: Submission) => {
    const winnerUser = users.find(u => u.username === submission.participantUsername);
    if (!winnerUser) return;

    onChooseWinner(challengeId, submission.id, winnerUser.id, winnerUser.username);
    showToast(`🏆 ${winnerUser.username} has been crowned the Winner and awarded the "Best Slave" badge!`);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto px-1 md:px-0 font-sans text-neutral-300">
      {/* SUCCESS TOAST */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-11/12 bg-neutral-900 border border-neutral-800 text-sm p-4 rounded-xl shadow-2xl flex items-center gap-2 text-[#d4af37] animate-slide-down font-semibold">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#121212]/50 border border-neutral-900 rounded-xl p-5 shadow-xl">
        <div>
          <h2 className="text-2xl font-bold text-white font-display flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[#d4af37]" />
            Open Challenge Room
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Where Domme authority meets Submissive compliance. Submit to trials, show your dedication, and receive accolades.
          </p>
        </div>

        {isCreatorRole && (
          <button
            onClick={() => setShowCreator(!showCreator)}
            className="px-4 py-2.5 bg-[#8b0000] hover:bg-red-800 text-[#d4af37] font-bold rounded-xl text-xs tracking-wider transition flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" /> NEW CHALLENGE
          </button>
        )}
      </div>

      {/* CREATE CHALLENGE INLINE FORM */}
      {showCreator && isCreatorRole && (
        <form onSubmit={handleCreateChallenge} className="bg-[#121212] border border-neutral-800 rounded-xl p-5 space-y-4 animate-fade-in shadow-2xl relative">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-600 via-[#d4af37] to-red-600" />
          <h3 className="text-sm font-bold text-[#d4af37] uppercase tracking-wider">Draft New Trial Instructions</h3>
          
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Challenge Details / Tasks</label>
            <textarea
              required
              rows={3}
              value={chalText}
              onChange={(e) => setChalText(e.target.value)}
              placeholder="E.g. Submit a photo demonstrating 10 minutes of kneeling under instructions. State your compliance..."
              className="w-full bg-[#050505] border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#8b0000]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Duration (Days)</label>
              <input
                type="number"
                min={1}
                max={30}
                value={chalDuration}
                onChange={(e) => setChalDuration(parseInt(e.target.value) || 3)}
                className="w-full bg-[#050505] border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#8b0000]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Atmospheric Image URL (Optional)</label>
              <input
                type="text"
                value={chalMedia}
                onChange={(e) => setChalMedia(e.target.value)}
                placeholder="Paste direct dark/moody image URL"
                className="w-full bg-[#050505] border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#8b0000]"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2 justify-end">
            <button
              type="button"
              onClick={() => setShowCreator(false)}
              className="px-4 py-2 text-xs text-neutral-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#8b0000] hover:bg-red-800 text-white rounded-xl text-xs font-bold tracking-widest uppercase transition"
            >
              Issue Challenge
            </button>
          </div>
        </form>
      )}

      {/* PARTICIPATION MODAL / DIALOG */}
      {joinChallengeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <form onSubmit={handleJoinSubmit} className="bg-[#161616] border border-neutral-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-600 via-[#d4af37] to-red-600" />
            
            <div className="text-center">
              <Trophy className="w-10 h-10 text-[#d4af37] mx-auto mb-2" />
              <h3 className="text-lg font-bold text-white">Join Challenge Room</h3>
              <p className="text-xs text-neutral-400">Submit your completion proof to the creator</p>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Compliance Description</label>
              <textarea
                required
                rows={3}
                value={subText}
                onChange={(e) => setSubText(e.target.value)}
                placeholder="Describe your execution of the trial..."
                className="w-full bg-[#050505] border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#8b0000]"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Proof Media</label>
                {currentUser.isVerified && (
                  <span className="text-[9px] text-green-500 font-mono flex items-center gap-0.5">
                    ✅ Direct Upload Unlocked
                  </span>
                )}
              </div>

              {currentUser.isVerified ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setUploadMode('file'); setSubMedia(''); setFileError(null); }}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase border transition ${uploadMode === 'file' ? 'bg-[#8b0000]/20 border-[#8b0000] text-white' : 'bg-transparent border-neutral-800 text-neutral-500'}`}
                    >
                      📁 Direct File
                    </button>
                    <button
                      type="button"
                      onClick={() => { setUploadMode('url'); setSubMedia(''); setFileError(null); }}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase border transition ${uploadMode === 'url' ? 'bg-[#8b0000]/20 border-[#8b0000] text-white' : 'bg-transparent border-neutral-800 text-neutral-500'}`}
                    >
                      🔗 Paste URL
                    </button>
                  </div>

                  {fileError && (
                    <p className="text-[10px] text-red-500 font-semibold">{fileError}</p>
                  )}

                  {uploadMode === 'file' ? (
                    <div className="border border-dashed border-neutral-800 hover:border-[#8b0000]/50 rounded-xl p-4 bg-[#050505] text-center transition relative cursor-pointer group">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {subMedia ? (
                        <div className="space-y-2">
                          {subMedia.startsWith('data:video/') ? (
                            <div className="max-h-[120px] rounded overflow-hidden flex justify-center bg-black">
                              <video src={subMedia} className="max-h-[120px]" controls />
                            </div>
                          ) : (
                            <img src={subMedia} className="max-h-[120px] mx-auto rounded object-cover" />
                          )}
                          <p className="text-[10px] text-[#d4af37] font-semibold truncate">File selected successfully</p>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setSubMedia(''); }}
                            className="text-[9px] text-red-500 hover:underline"
                          >
                            Remove and select another
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <ImageIcon className="w-6 h-6 text-neutral-600 mx-auto group-hover:text-[#d4af37] transition" />
                          <p className="text-[11px] font-semibold text-neutral-400">Click or Drag & Drop Image/Video</p>
                          <p className="text-[9px] text-neutral-600 font-mono">Max 8 seconds for video proof</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <input
                      required
                      type="text"
                      value={subMedia}
                      onChange={(e) => setSubMedia(e.target.value)}
                      placeholder="Paste direct image/video URL (Unsplash/Imgur etc)"
                      className="w-full bg-[#050505] border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#8b0000]"
                    />
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  <input
                    required
                    type="text"
                    value={subMedia}
                    onChange={(e) => setSubMedia(e.target.value)}
                    placeholder="Paste direct image/video URL"
                    className="w-full bg-[#050505] border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#8b0000]"
                  />
                  <p className="text-[9px] text-yellow-600/80 font-mono">
                    ⚠️ Verify your account under Profile to unlock direct device file uploads!
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setJoinChallengeId(null)}
                className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-xl text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#8b0000] hover:bg-red-800 text-[#d4af37] font-bold rounded-xl text-xs tracking-wider uppercase transition"
              >
                Upload Proof
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CHALLENGES CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((challenge) => {
          const expirationDate = new Date(challenge.expiresAt);
          const daysRemaining = Math.max(0, Math.ceil((expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
          const isExpired = challenge.status === 'Expired' || daysRemaining <= 0;
          
          const filteredSubmissions = submissions.filter(s => s.challengeId === challenge.id);
          const userHasSubmitted = submissions.some(s => s.challengeId === challenge.id && s.participantId === currentUser.id);

          return (
            <div key={challenge.id} className="bg-[#121212]/90 border border-neutral-900 rounded-xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-neutral-800 transition">
              <div>
                {/* Challenge Media */}
                {challenge.mediaUrl && (
                  <div className="relative h-48 bg-black overflow-hidden border-b border-neutral-950">
                    <img
                      src={challenge.mediaUrl}
                      alt="Challenge visual"
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="bg-[#8b0000] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border border-red-800">
                        ACTIVE TRIAL
                      </span>
                      {challenge.status === 'Winner Chosen' && (
                        <span className="bg-[#d4af37] text-black text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
                          👑 CLOSED (WINNER CHOSEN)
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Challenge Body */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold font-mono text-neutral-500 uppercase block tracking-wider">
                        Issued by {challenge.creatorUsername} ({challenge.creatorRole})
                      </span>
                      <h3 className="text-base font-bold text-white mt-0.5 leading-tight hover:text-[#d4af37] transition">
                        {challenge.text.substring(0, challenge.text.indexOf(':') > 0 ? challenge.text.indexOf(':') : 30)}
                      </h3>
                    </div>
                    <Trophy className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                    {challenge.text}
                  </p>

                  {/* Status Banner */}
                  <div className="grid grid-cols-2 gap-2 bg-[#050505] p-3 rounded-lg border border-neutral-900 text-xs">
                    <div className="flex items-center gap-1.5 text-neutral-500 font-mono">
                      <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>
                        {isExpired ? 'Expired' : `${daysRemaining} days remaining`}
                      </span>
                    </div>
                    <div className="text-right text-neutral-500 font-mono">
                      <span>{filteredSubmissions.length} Submissions</span>
                    </div>
                  </div>

                  {challenge.winnerUsername && (
                    <div className="bg-[#d4af37]/5 border border-[#d4af37]/20 p-3 rounded-lg flex items-center gap-2 text-xs">
                      <span className="text-lg">🏆</span>
                      <div>
                        <span className="text-neutral-400 font-mono text-[9px] block uppercase tracking-widest">Winner Chosen</span>
                        <span className="text-[#d4af37] font-bold">{challenge.winnerUsername}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Challenge Actions */}
              <div className="p-4 border-t border-neutral-950 bg-neutral-900/10 flex flex-col gap-2">
                {/* Participation Button */}
                {!isCreatorRole ? (
                  challenge.status === 'Active' && !isExpired ? (
                    userHasSubmitted ? (
                      <div className="w-full py-2.5 bg-[#050505] border border-neutral-800 text-center text-xs text-neutral-500 rounded-lg flex items-center justify-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-500" /> You submitted proof!
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          if (!currentUser.isVerified) {
                            showToast('🚫 Verified ✅ members only can participate in challenges. Complete verification under Profile!');
                            return;
                          }
                          setJoinChallengeId(challenge.id);
                        }}
                        className="w-full py-2.5 bg-gradient-to-r from-red-800 to-red-950 hover:from-red-700 hover:to-red-900 text-[#d4af37] font-bold text-xs tracking-wider uppercase rounded-lg transition"
                      >
                        Participate in Trial
                      </button>
                    )
                  ) : (
                    <div className="w-full py-2.5 bg-neutral-900/50 text-center text-xs text-neutral-600 rounded-lg">
                      Challenge Expired / Concluded
                    </div>
                  )
                ) : (
                  /* Creator Review Actions */
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowSubmissionsForChallengeId(showSubmissionsForChallengeId === challenge.id ? null : challenge.id)}
                      className="w-full py-2 bg-[#050505] border border-neutral-800 text-neutral-400 hover:text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <Eye className="w-4 h-4" />
                      {showSubmissionsForChallengeId === challenge.id ? 'Hide Submissions' : `Review Submissions (${filteredSubmissions.length})`}
                    </button>
                  </div>
                )}

                {/* Submissions List Expanded for Creator */}
                {showSubmissionsForChallengeId === challenge.id && isCreatorRole && (
                  <div className="mt-3 border-t border-neutral-900 pt-3 space-y-3 animate-fade-in max-h-[300px] overflow-y-auto pr-1">
                    {filteredSubmissions.length === 0 ? (
                      <p className="text-xs text-neutral-500 italic text-center py-2">No slaves or subs have submitted proof yet.</p>
                    ) : (
                      filteredSubmissions.map((sub) => (
                        <div key={sub.id} className="bg-[#050505] border border-neutral-800 p-3 rounded-lg space-y-2 text-xs relative">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[#d4af37]">@{sub.participantUsername}</span>
                            <span className="text-[9px] text-neutral-500 font-mono">
                              {new Date(sub.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <p className="text-neutral-400 italic">"{sub.text}"</p>

                          {/* Submission Proof Image/Video */}
                          <div className="rounded overflow-hidden border border-neutral-900 bg-neutral-950 max-h-[180px] w-full flex items-center justify-center">
                            {sub.mediaUrl.startsWith('data:video/') || sub.mediaUrl.endsWith('.mp4') || sub.mediaUrl.endsWith('.webm') ? (
                              <video
                                src={sub.mediaUrl}
                                className="w-full h-auto max-h-[180px] object-contain"
                                controls
                                preload="metadata"
                              />
                            ) : (
                              <img
                                src={sub.mediaUrl}
                                alt="Proof submission"
                                className="w-full h-auto object-cover max-h-[150px]"
                                referrerPolicy="no-referrer"
                              />
                            )}
                          </div>

                          {/* Award Winner Action */}
                          {challenge.status === 'Active' && (
                            <button
                              type="button"
                              onClick={() => handleAwardWinner(challenge.id, sub)}
                              className="w-full py-2 bg-[#8b0000] hover:bg-red-800 text-white font-bold rounded text-[10px] tracking-wider uppercase transition flex items-center justify-center gap-1"
                            >
                              <Award className="w-3.5 h-3.5" /> Crowne Winner 🏆
                            </button>
                          )}

                          {sub.status === 'winner' && (
                            <span className="absolute top-2 right-2 bg-[#d4af37] text-black font-extrabold text-[8px] px-2 py-0.5 rounded uppercase tracking-widest">
                              🏆 WINNER
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
