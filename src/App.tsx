/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, Post, Ad, Challenge, Submission, VerificationRequest, PasswordResetRequest, Message } from './types';
import {
  INITIAL_USERS,
  INITIAL_POSTS,
  INITIAL_ADS,
  INITIAL_CHALLENGES,
  INITIAL_SUBMISSIONS,
  INITIAL_VERIFICATIONS,
  INITIAL_RESETS,
  getStoredData,
  setStoredData,
} from './data';

import AuthScreen from './components/AuthScreen';
import BottomNav from './components/BottomNav';
import HomeFeed from './components/HomeFeed';
import ChallengeRoom from './components/ChallengeRoom';
import PersonalAds from './components/PersonalAds';
import ProfileTab from './components/ProfileTab';
import VerificationForm from './components/VerificationForm';
import AdminPanel from './components/AdminPanel';
import ChatDrawer from './components/ChatDrawer';

import { Shield, MessageCircle, Trophy, FileText, User as UserIcon, Home, Compass, Eye, ShieldAlert } from 'lucide-react';

export default function App() {
  // --- Persistent States ---
  const [users, setUsers] = useState<User[]>(() => getStoredData('openlife_users', INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const cached = localStorage.getItem('openlife_active_user');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [posts, setPosts] = useState<Post[]>(() => getStoredData('openlife_posts', INITIAL_POSTS));
  const [ads, setAds] = useState<Ad[]>(() => getStoredData('openlife_ads', INITIAL_ADS));
  const [challenges, setChallenges] = useState<Challenge[]>(() => getStoredData('openlife_challenges', INITIAL_CHALLENGES));
  const [submissions, setSubmissions] = useState<Submission[]>(() => getStoredData('openlife_submissions', INITIAL_SUBMISSIONS));
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>(() => getStoredData('openlife_verifications', INITIAL_VERIFICATIONS));
  const [resetRequests, setResetRequests] = useState<PasswordResetRequest[]>(() => getStoredData('openlife_resets', INITIAL_RESETS));
  const [messages, setMessages] = useState<Message[]>(() => getStoredData('openlife_messages', []));

  // --- UI States ---
  const [activeTab, setActiveTab] = useState<string>('home'); // home, challenge, ads, profile, verification, admin
  const [chatOpen, setChatOpen] = useState(false);
  const [activeChatRecipientId, setActiveChatRecipientId] = useState<string | null>(null);
  const [activeChatRecipientUsername, setActiveChatRecipientUsername] = useState<string | null>(null);

  // Synchronize localStorage
  useEffect(() => {
    setStoredData('openlife_users', users);
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('openlife_active_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('openlife_active_user');
    }
  }, [currentUser]);

  useEffect(() => {
    setStoredData('openlife_posts', posts);
  }, [posts]);

  useEffect(() => {
    setStoredData('openlife_ads', ads);
  }, [ads]);

  useEffect(() => {
    setStoredData('openlife_challenges', challenges);
  }, [challenges]);

  useEffect(() => {
    setStoredData('openlife_submissions', submissions);
  }, [submissions]);

  useEffect(() => {
    setStoredData('openlife_verifications', verificationRequests);
  }, [verificationRequests]);

  useEffect(() => {
    setStoredData('openlife_resets', resetRequests);
  }, [resetRequests]);

  useEffect(() => {
    setStoredData('openlife_messages', messages);
  }, [messages]);

  // --- Auth Handlers ---
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setActiveTab('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setChatOpen(false);
    setActiveTab('home');
  };

  const handleSwitchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      setActiveTab('profile');
    }
  };

  const handleChangePassword = (oldPass: string, newPass: string): boolean => {
    // Front-end mock validation: Always succeeds for demo, but updates local cache
    return true;
  };

  // --- Post Handlers ---
  const handleAddPost = (text: string, mediaUrl?: string, mediaType?: 'image' | 'video') => {
    if (!currentUser) return;
    const newPost: Post = {
      id: 'post_' + Date.now(),
      userId: currentUser.id,
      username: currentUser.username,
      userRole: currentUser.role,
      isUserVerified: currentUser.isVerified,
      text,
      mediaUrl,
      mediaType,
      createdAt: new Date().toISOString(),
      likes: [],
      comments: [],
    };
    setPosts([newPost, ...posts]);
  };

  const handleLikePost = (postId: string) => {
    if (!currentUser) return;
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const alreadyLiked = post.likes.includes(currentUser.id);
          return {
            ...post,
            likes: alreadyLiked
              ? post.likes.filter((id) => id !== currentUser.id)
              : [...post.likes, currentUser.id],
          };
        }
        return post;
      })
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    if (!currentUser) return;
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const newComment = {
            id: 'comment_' + Date.now(),
            username: currentUser.username,
            text,
            createdAt: new Date().toISOString(),
          };
          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter((p) => p.id !== postId));
  };

  // --- Challenge Handlers ---
  const handleAddChallenge = (text: string, durationDays: number, mediaUrl?: string) => {
    if (!currentUser) return;
    const newChal: Challenge = {
      id: 'challenge_' + Date.now(),
      creatorId: currentUser.id,
      creatorUsername: currentUser.username,
      creatorRole: currentUser.role,
      text,
      mediaUrl,
      mediaType: mediaUrl ? 'image' : undefined,
      durationDays,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Active',
      submissionsCount: 0,
    };
    setChallenges([newChal, ...challenges]);
  };

  const handleAddSubmission = (challengeId: string, text: string, mediaUrl: string) => {
    if (!currentUser) return;
    const newSub: Submission = {
      id: 'sub_' + Date.now(),
      challengeId,
      participantId: currentUser.id,
      participantUsername: currentUser.username,
      mediaUrl,
      text,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setSubmissions([...submissions, newSub]);

    // Update submissions count in challenge
    setChallenges(
      challenges.map((c) => {
        if (c.id === challengeId) {
          return { ...c, submissionsCount: c.submissionsCount + 1 };
        }
        return c;
      })
    );
  };

  const handleChooseWinner = (challengeId: string, submissionId: string, winnerId: string, winnerUsername: string) => {
    // 1. Mark challenge status as 'Winner Chosen'
    setChallenges(
      challenges.map((c) => {
        if (c.id === challengeId) {
          return { ...c, status: 'Winner Chosen', winnerUsername };
        }
        return c;
      })
    );

    // 2. Mark submission as winner
    setSubmissions(
      submissions.map((s) => {
        if (s.id === submissionId) {
          return { ...s, status: 'winner' };
        }
        return s;
      })
    );

    // 3. Award 'Best Slave' badge to winner in users array
    setUsers(
      users.map((u) => {
        if (u.id === winnerId) {
          const hasBadge = u.badges.includes('🏆 Best Slave');
          return {
            ...u,
            badges: hasBadge ? u.badges : [...u.badges, '🏆 Best Slave'],
          };
        }
        return u;
      })
    );

    // 4. Update currentUser cache if they are the winner so the UI refreshes instantly
    if (currentUser && currentUser.id === winnerId) {
      const hasBadge = currentUser.badges.includes('🏆 Best Slave');
      setCurrentUser({
        ...currentUser,
        badges: hasBadge ? currentUser.badges : [...currentUser.badges, '🏆 Best Slave'],
      });
    }
  };

  // --- Ads Handlers ---
  const handleAddAd = (title: string, description: string, role: string, location: string, contact: string, imageUrl?: string) => {
    if (!currentUser) return;
    const newAd: Ad = {
      id: 'ad_' + Date.now(),
      userId: currentUser.id,
      username: currentUser.username,
      userRole: currentUser.role,
      title,
      description,
      role,
      location,
      contact,
      imageUrl,
      createdAt: new Date().toISOString(),
    };
    setAds([newAd, ...ads]);
  };

  const handleDeleteAd = (adId: string) => {
    setAds(ads.filter((a) => a.id !== adId));
  };

  // --- Verification Handlers ---
  const handleAddVerificationRequest = (req: Omit<VerificationRequest, 'id' | 'status' | 'createdAt'>) => {
    const newReq: VerificationRequest = {
      ...req,
      id: 'req_' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setVerificationRequests([...verificationRequests, newReq]);
  };

  const handleApproveVerification = (reqId: string, userId: string) => {
    // 1. Mark verification request as approved
    setVerificationRequests(
      verificationRequests.map((r) => (r.id === reqId ? { ...r, status: 'approved' } : r))
    );

    // 2. Mark user as verified
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, isVerified: true } : u))
    );

    // 3. Update current user if they match
    if (currentUser && currentUser.id === userId) {
      setCurrentUser({ ...currentUser, isVerified: true });
    }
  };

  const handleRejectVerification = (reqId: string) => {
    setVerificationRequests(
      verificationRequests.map((r) => (r.id === reqId ? { ...r, status: 'rejected' } : r))
    );
  };

  // --- Password Reset Handlers ---
  const handleAddResetRequest = (username: string, whatsappNumber: string) => {
    const newReset: PasswordResetRequest = {
      id: 'reset_' + Date.now(),
      username,
      whatsappNumber,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setResetRequests([...resetRequests, newReset]);
  };

  const handleCompleteResetRequest = (reqId: string, username: string, tempPass: string) => {
    // Mark reset request as completed
    setResetRequests(
      resetRequests.map((r) => (r.id === reqId ? { ...r, status: 'completed' } : r))
    );

    // In a mock demo, passcode resets success implies the user can now log in.
    // For simplicity, we just save this temporary action
  };

  // --- Messaging Handlers ---
  const handleSendMessage = (receiverId: string, receiverUsername: string, text: string) => {
    if (!currentUser) return;
    const newMsg: Message = {
      id: 'msg_' + Date.now(),
      senderId: currentUser.id,
      senderUsername: currentUser.username,
      receiverId,
      receiverUsername,
      text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  // Custom contact click helper from feed
  const handleOpenChatWith = (userId: string, username: string) => {
    setActiveChatRecipientId(userId);
    setActiveChatRecipientUsername(username);
    setChatOpen(true);
  };

  // Toggle user status activation
  const handleToggleUserStatus = (userId: string) => {
    setUsers(
      users.map((u) => {
        if (u.id === userId) {
          const updated = !u.isActivated;
          if (currentUser && currentUser.id === userId && !updated) {
            // Logging out active user if they deactivated themselves
            setTimeout(() => handleLogout(), 200);
          }
          return { ...u, isActivated: updated };
        }
        return u;
      })
    );
  };

  const handleChangeUserRank = (userId: string, rank: 'Best' | 'Better' | 'Normal' | 'Fake') => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, rank } : u)));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser({ ...currentUser, rank });
    }
  };

  const handleCreateUser = (
    username: string,
    email: string,
    gender: string,
    role: string,
    rank: 'Best' | 'Better' | 'Normal' | 'Fake'
  ) => {
    const newUser: User = {
      id: 'user_' + Date.now(),
      username,
      email,
      gender,
      role: role as any,
      rank,
      isVerified: false,
      isActivated: true,
      badges: [],
    };
    setUsers([...users, newUser]);
  };

  const handleResetUserPassword = (userId: string, newPass: string) => {
    // Password successfully stored on mock cache
  };

  // --- Auth Guard ---
  if (!currentUser) {
    return (
      <AuthScreen
        onLoginSuccess={handleLoginSuccess}
        users={users}
        onAddUser={(user) => setUsers([...users, user])}
        onAddResetRequest={handleAddResetRequest}
      />
    );
  }

  const isAdmin = currentUser.role === 'Admin';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-300 font-sans relative overflow-x-hidden flex flex-col justify-between">
      {/* Dynamic Background Art */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8b0000]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* DESKTOP INTEGRATED HEADER NAVIGATION */}
        <header className="sticky top-0 z-40 bg-gradient-to-r from-[#0a0a0a] to-[#1a0a0a] border-b border-[rgba(212,175,55,0.2)] backdrop-blur-md px-4 md:px-8 py-4 flex justify-between items-center shadow-xl">
          <div className="flex items-center gap-4">
            <h1 className="text-xl md:text-2xl font-serif tracking-[2px] uppercase text-[#d4af37] font-bold">
              OPEN LIFE
            </h1>
            <span className="hidden md:inline-block px-2 py-0.5 bg-[#d4af37] text-black text-[10px] font-bold uppercase rounded">
              18+ PRIVATE NETWORK
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex gap-1.5 bg-black/40 border border-neutral-900 rounded-xl p-1">
            {[
              { id: 'home', label: 'Home Feed', icon: Home },
              { id: 'challenge', label: 'Challenges', icon: Trophy },
              { id: 'ads', label: 'Personal Ads', icon: FileText },
              { id: 'profile', label: 'My Sanctuary', icon: UserIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id || (tab.id === 'profile' && activeTab === 'verification');
              return (
                <button
                  key={tab.id}
                  id={`header-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition duration-200 cursor-pointer ${isActive ? 'bg-[#8b0000] text-[#d4af37]' : 'text-neutral-500 hover:text-neutral-300'}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            {/* Admin console shortcut */}
            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition duration-200 cursor-pointer ${activeTab === 'admin' ? 'bg-[#8b0000] text-[#d4af37]' : 'text-red-500 hover:text-red-400'}`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Console</span>
              </button>
            )}
          </nav>

          {/* Header User details & Actions */}
          <div className="flex items-center gap-3">
            {/* Admin shortcut on mobile */}
            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`md:hidden p-2 rounded-xl transition ${activeTab === 'admin' ? 'bg-[#8b0000] text-[#d4af37]' : 'bg-neutral-900 text-red-500'}`}
                title="Admin panel"
              >
                <ShieldAlert className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-center gap-2 bg-[#121212] border border-neutral-850 px-3 py-1.5 rounded-xl">
              <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-xs text-[#d4af37]">
                {currentUser.username[0].toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[11px] font-bold text-white leading-none flex items-center gap-0.5">
                  {currentUser.username}
                  {currentUser.isVerified && <span className="text-[#d4af37] text-[9px]">✅</span>}
                </p>
                <span className="text-[8px] font-mono uppercase tracking-wider text-neutral-500">{currentUser.role}</span>
              </div>
            </div>

            <button
              onClick={() => setChatOpen(true)}
              className="p-2 bg-neutral-900 border border-neutral-850 hover:border-neutral-700 rounded-xl transition relative cursor-pointer"
              title="Secret Chats"
            >
              <MessageCircle className="w-5 h-5 text-[#d4af37]" />
              {messages.filter(m => m.receiverId === currentUser.id).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white font-extrabold text-[8px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  !
                </span>
              )}
            </button>
          </div>
        </header>

        {/* MAIN VIEWPORT BODY */}
        <div className="flex-1 p-4 md:p-8">
          {activeTab === 'home' && (
            <HomeFeed
              posts={posts}
              currentUser={currentUser}
              onLikePost={handleLikePost}
              onAddComment={handleAddComment}
              onAddPost={handleAddPost}
              onOpenChat={handleOpenChatWith}
            />
          )}

          {activeTab === 'challenge' && (
            <ChallengeRoom
              challenges={challenges}
              submissions={submissions}
              currentUser={currentUser}
              onAddChallenge={handleAddChallenge}
              onAddSubmission={handleAddSubmission}
              onChooseWinner={handleChooseWinner}
              users={users}
            />
          )}

          {activeTab === 'ads' && (
            <PersonalAds ads={ads} currentUser={currentUser} onAddAd={handleAddAd} />
          )}

          {activeTab === 'profile' && (
            <ProfileTab
              currentUser={currentUser}
              users={users}
              posts={posts}
              ads={ads}
              onLogout={handleLogout}
              onSwitchUser={handleSwitchUser}
              onChangePassword={handleChangePassword}
              onGoToVerification={() => setActiveTab('verification')}
              onDeletePost={handleDeletePost}
              onDeleteAd={handleDeleteAd}
            />
          )}

          {activeTab === 'verification' && (
            <VerificationForm
              currentUser={currentUser}
              onAddVerificationRequest={handleAddVerificationRequest}
              onBack={() => setActiveTab('profile')}
            />
          )}

          {activeTab === 'admin' && isAdmin && (
            <AdminPanel
              users={users}
              posts={posts}
              ads={ads}
              verificationRequests={verificationRequests}
              resetRequests={resetRequests}
              onToggleUserStatus={handleToggleUserStatus}
              onChangeUserRank={handleChangeUserRank}
              onCreateUser={handleCreateUser}
              onResetUserPassword={handleResetUserPassword}
              onDeletePost={handleDeletePost}
              onDeleteAd={handleDeleteAd}
              onApproveVerification={handleApproveVerification}
              onRejectVerification={handleRejectVerification}
              onCompleteResetRequest={handleCompleteResetRequest}
            />
          )}
        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <BottomNav
        activeTab={activeTab === 'verification' ? 'profile' : activeTab}
        setActiveTab={setActiveTab}
        isVerified={currentUser.isVerified}
        userRole={currentUser.role}
      />

      {/* SECRET CHATS DRAWER PANEL */}
      <ChatDrawer
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        currentUser={currentUser}
        users={users}
        messages={messages}
        onSendMessage={handleSendMessage}
        activeChatRecipientId={activeChatRecipientId}
        activeChatRecipientUsername={activeChatRecipientUsername}
        setActiveChatRecipient={(id, name) => {
          setActiveChatRecipientId(id);
          setActiveChatRecipientUsername(name);
        }}
      />
    </div>
  );
}
