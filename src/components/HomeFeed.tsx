/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Post, User, Comment } from '../types';
import { Heart, MessageSquare, Share2, PlusCircle, Check, Send, AlertTriangle, Image as ImageIcon, Video, HelpCircle, MessageCircle } from 'lucide-react';

interface HomeFeedProps {
  posts: Post[];
  currentUser: User;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onAddPost: (text: string, mediaUrl?: string, mediaType?: 'image' | 'video') => void;
  onOpenChat: (userId: string, username: string) => void;
}

export default function HomeFeed({ posts, currentUser, onLikePost, onAddComment, onAddPost, onOpenChat }: HomeFeedProps) {
  const [newPostText, setNewPostText] = useState('');
  const [newPostMedia, setNewPostMedia] = useState('');
  const [newPostMediaType, setNewPostMediaType] = useState<'image' | 'video'>('image');
  const [showCreator, setShowCreator] = useState(false);
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [errorToast, setErrorToast] = useState<string | null>(null);

  // Preset premium photos for easy choosing when creating a post
  const PRESET_PHOTOS = [
    { name: 'Velvet Mask', url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80' },
    { name: 'Obsidian Lights', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80' },
    { name: 'Gold Fluid', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80' },
    { name: 'Hourglass Gears', url: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80' },
  ];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() && !newPostMedia.trim()) return;

    onAddPost(
      newPostText.trim(),
      newPostMedia.trim() || undefined,
      newPostMedia.trim() ? newPostMediaType : undefined
    );

    setNewPostText('');
    setNewPostMedia('');
    setShowCreator(false);
  };

  const handleAddCommentSubmit = (postId: string) => {
    if (!currentUser.isVerified) {
      showVerificationError('commenting');
      return;
    }

    const text = commentInputs[postId] || '';
    if (!text.trim()) return;

    onAddComment(postId, text.trim());
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  const handleShareClick = () => {
    if (!currentUser.isVerified) {
      showVerificationError('sharing');
      return;
    }
    setErrorToast('✨ Post link copied to dashboard clipboard!');
    setTimeout(() => setErrorToast(null), 3000);
  };

  const handleChatClick = (userId: string, username: string) => {
    if (!currentUser.isVerified) {
      showVerificationError('chatting');
      return;
    }
    onOpenChat(userId, username);
  };

  const showVerificationError = (action: string) => {
    setErrorToast(`🚫 Access Denied: Verified ✅ members only can engage in ${action}. Please complete verification in your Profile tab.`);
    setTimeout(() => setErrorToast(null), 5000);
  };

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto px-1 md:px-0 font-sans text-neutral-300">
      {/* ERROR / NOTIFICATION TOAST */}
      {errorToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-11/12 bg-neutral-900 border border-neutral-800 text-sm p-4 rounded-xl shadow-2xl flex items-start gap-3 text-white animate-slide-down">
          <AlertTriangle className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold leading-tight">{errorToast}</p>
          </div>
          <button onClick={() => setErrorToast(null)} className="text-neutral-500 hover:text-white font-bold text-xs cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* POST CREATION BAR */}
      <div className="bg-[#121212]/90 border border-neutral-900 rounded-xl p-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 overflow-hidden flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-[#d4af37]">
              {currentUser.username[0].toUpperCase()}
            </span>
          </div>
          <button
            onClick={() => setShowCreator(!showCreator)}
            className="flex-1 bg-[#050505] hover:bg-neutral-900 border border-neutral-800 text-left text-neutral-500 rounded-xl py-3 px-4 text-sm transition"
          >
            What is your desire today, {currentUser.username}?
          </button>
          <button
            onClick={() => setShowCreator(!showCreator)}
            className="text-[#8b0000] hover:text-red-500 transition cursor-pointer"
          >
            <PlusCircle className="w-7 h-7" />
          </button>
        </div>

        {/* POST CREATION FORM EXPANDED */}
        {showCreator && (
          <form onSubmit={handleCreatePost} className="mt-4 border-t border-neutral-900 pt-4 space-y-4 animate-fade-in">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                Post description
              </label>
              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="Share your thoughts, expectations, or current lifestyle mood..."
                rows={3}
                className="w-full bg-[#050505] border border-neutral-800 rounded-xl p-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#8b0000] transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                  Optional Media URL
                </label>
                <input
                  type="text"
                  value={newPostMedia}
                  onChange={(e) => setNewPostMedia(e.target.value)}
                  placeholder="Paste direct image or video URL"
                  className="w-full bg-[#050505] border border-neutral-800 rounded-xl p-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#8b0000] transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                  Media Type
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewPostMediaType('image')}
                    className={`flex-1 py-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition ${newPostMediaType === 'image' ? 'bg-[#8b0000]/10 border-[#8b0000] text-white' : 'bg-transparent border-neutral-800 text-neutral-500 hover:text-white'}`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" /> Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPostMediaType('video')}
                    className={`flex-1 py-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition ${newPostMediaType === 'video' ? 'bg-[#8b0000]/10 border-[#8b0000] text-white' : 'bg-transparent border-neutral-800 text-neutral-500 hover:text-white'}`}
                  >
                    <Video className="w-3.5 h-3.5" /> Video
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                Quick Gothic/Noir Presets (Image placeholders)
              </span>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_PHOTOS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      setNewPostMedia(p.url);
                      setNewPostMediaType('image');
                    }}
                    className="h-10 rounded border border-neutral-800 bg-cover bg-center overflow-hidden relative group cursor-pointer hover:border-[#d4af37]"
                    style={{ backgroundImage: `url('${p.url}')` }}
                    title={p.name}
                  >
                    <div className="absolute inset-0 bg-black/40 hover:bg-transparent transition flex items-center justify-center">
                      <span className="text-[8px] text-white font-bold opacity-0 group-hover:opacity-100">{p.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreator(false)}
                className="px-4 py-2 bg-transparent text-neutral-400 hover:text-white rounded-xl text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#8b0000] hover:bg-red-800 text-white rounded-xl text-xs font-bold tracking-wider transition uppercase"
              >
                Post to Feed
              </button>
            </div>
          </form>
        )}
      </div>

      {/* MAIN CARDS FEED */}
      <div className="space-y-6">
        {posts.map((post) => {
          const isLiked = post.likes.includes(currentUser.id);
          return (
            <article key={post.id} className="bg-[#121212]/90 border border-neutral-900/80 rounded-xl overflow-hidden shadow-xl transition-all hover:border-neutral-800">
              {/* Card Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center relative">
                    <span className="text-sm font-bold text-white">
                      {post.username[0].toUpperCase()}
                    </span>
                    {post.isUserVerified && (
                      <span className="absolute -bottom-1 -right-1 bg-black text-[#d4af37] w-5 h-5 rounded-full flex items-center justify-center border border-[#d4af37] text-[10px] font-bold" title="Verified Member">
                        ✅
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-sm hover:underline cursor-pointer">
                        {post.username}
                      </span>
                      {post.isUserVerified && (
                        <span className="text-[#d4af37] text-xs font-bold" title="Gold Verified Badge">✅</span>
                      )}
                    </div>
                    <span className="text-[10px] font-semibold text-[#d4af37]/80 bg-[#d4af37]/5 px-2 py-0.5 rounded border border-[#d4af37]/10 uppercase tracking-widest block w-max mt-0.5">
                      {post.userRole}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-600 font-mono">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  {/* Direct Chat Access for Verified */}
                  {currentUser.id !== post.userId && (
                    <button
                      onClick={() => handleChatClick(post.userId, post.username)}
                      className="p-2 hover:bg-neutral-900 text-neutral-400 hover:text-[#d4af37] rounded-full transition cursor-pointer"
                      title={`Send secret message to ${post.username}`}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Card Text Content */}
              <div className="px-4 pb-3">
                <p className="text-sm leading-relaxed text-neutral-300 font-sans whitespace-pre-wrap">
                  {post.text}
                </p>
              </div>

              {/* Card Media (Image/Video) */}
              {post.mediaUrl && (
                <div className="relative border-y border-neutral-900 overflow-hidden bg-black max-h-[450px] flex items-center justify-center">
                  {post.mediaType === 'video' ? (
                    <div className="w-full aspect-video bg-neutral-950 flex flex-col items-center justify-center p-8 relative">
                      <video 
                        src={post.mediaUrl} 
                        controls 
                        className="w-full h-full object-contain"
                        poster="https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80"
                      />
                      <div className="absolute top-2 left-2 bg-red-600/90 text-white px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider font-mono">
                        Simulated Playback
                      </div>
                    </div>
                  ) : (
                    <img
                      src={post.mediaUrl}
                      alt="Open Life Post media"
                      className="w-full h-auto object-cover max-h-[450px]"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
              )}

              {/* Card Footer Actions */}
              <div className="px-4 py-2 border-t border-neutral-900/50 flex justify-between items-center bg-neutral-900/10">
                <div className="flex gap-6">
                  {/* Like Button */}
                  <button
                    onClick={() => onLikePost(post.id)}
                    className={`flex items-center gap-1.5 text-xs font-semibold hover:scale-105 transition cursor-pointer ${isLiked ? 'text-red-500' : 'text-neutral-500 hover:text-red-400'}`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{post.likes.length}</span>
                  </button>

                  {/* Comment Button Trigger */}
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments.length}</span>
                  </div>
                </div>

                {/* Share Button */}
                <button
                  onClick={handleShareClick}
                  className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-white transition cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>

              {/* Comments Section */}
              <div className="border-t border-neutral-950 bg-neutral-950/40 p-4 space-y-4">
                {/* Existing Comments list */}
                {post.comments.length > 0 && (
                  <div className="space-y-3 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="text-xs bg-neutral-900/50 border border-neutral-900/30 p-2.5 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-[#d4af37]">{comment.username}</span>
                          <span className="text-[9px] text-neutral-600 font-mono">
                            {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-neutral-300 leading-normal">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment Input */}
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={commentInputs[post.id] || ''}
                    onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                    placeholder={currentUser.isVerified ? "Write your respectful comment..." : "✅ Get verified to write a comment"}
                    disabled={false} // Allow typing so unverified users can see the verification trigger on click
                    className="flex-1 bg-[#050505] border border-neutral-950 rounded-lg py-2 px-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#8b0000] transition disabled:opacity-50"
                  />
                  <button
                    onClick={() => handleAddCommentSubmit(post.id)}
                    className="p-2 bg-[#8b0000] hover:bg-red-800 text-white rounded-lg transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
