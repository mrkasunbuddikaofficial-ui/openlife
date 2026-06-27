/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { User, Message } from '../types';
import { Send, X, MessageCircle, AlertTriangle, CheckCircle, Shield } from 'lucide-react';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  users: User[];
  messages: Message[];
  onSendMessage: (receiverId: string, receiverUsername: string, text: string) => void;
  activeChatRecipientId: string | null;
  activeChatRecipientUsername: string | null;
  setActiveChatRecipient: (id: string | null, username: string | null) => void;
}

export default function ChatDrawer({
  isOpen,
  onClose,
  currentUser,
  users,
  messages,
  onSendMessage,
  activeChatRecipientId,
  activeChatRecipientUsername,
  setActiveChatRecipient,
}: ChatDrawerProps) {
  const [inputText, setInputText] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter messages for current active chat
  const chatMessages = messages.filter(
    (m) =>
      (m.senderId === currentUser.id && m.receiverId === activeChatRecipientId) ||
      (m.senderId === activeChatRecipientId && m.receiverId === currentUser.id)
  );

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isOpen]);

  // Autoreply simulation
  useEffect(() => {
    if (!activeChatRecipientId) return;

    // Look for last sent message by currentUser
    const lastMsg = chatMessages[chatMessages.length - 1];
    if (lastMsg && lastMsg.senderId === currentUser.id) {
      // Check if there is already a reply in the last 10 seconds or if last message is from current user
      const hasReplyPending = !chatMessages.some(
        (m, idx) => idx > chatMessages.indexOf(lastMsg) && m.senderId === activeChatRecipientId
      );

      if (hasReplyPending) {
        const timer = setTimeout(() => {
          // Generate persona-appropriate reply
          let replyText = "I received your transmission. Keep demonstrating compliance, and wait for instructions.";
          if (activeChatRecipientUsername?.includes('Elara') || activeChatRecipientUsername?.includes('Luna')) {
            replyText = "Very well. Your submission is noted. Continue following the designated protocols, and I may allocate task badges to you shortly.";
          } else if (activeChatRecipientUsername?.includes('Kael')) {
            replyText = "Yes, Mistress. I am at your service and ready for any open trials you issue in the Challenge Room.";
          }

          onSendMessage(currentUser.id, currentUser.username, replyText);
          // Hack to swap sender/receiver so it appears as if the other user replied
          // We will adjust this inside the App parent handler, or we can just push it directly.
          // Inside App, we will handle the simulated reply perfectly when message is sent!
        }, 2000);

        return () => clearTimeout(timer);
      }
    }
  }, [chatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChatRecipientId || !activeChatRecipientUsername) return;

    if (!currentUser.isVerified) {
      setToast('🚫 Get Verified: Only Verified ✅ members can participate in direct chats.');
      setTimeout(() => setToast(null), 3000);
      return;
    }

    onSendMessage(activeChatRecipientId, activeChatRecipientUsername, inputText.trim());
    setInputText('');
  };

  if (!isOpen) return null;

  return (
    <div id="chat-drawer" className="fixed inset-y-0 right-0 z-50 w-full sm:w-[400px] bg-[#0c0f0f]/95 border-l border-neutral-900/85 shadow-2xl flex flex-col justify-between font-sans text-neutral-300 animate-slide-left">
      {/* Drawer Header */}
      <div className="p-4 border-b border-neutral-900 bg-[#121212] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-[#d4af37]" />
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Secret Transmissions</h3>
            <p className="text-[10px] text-neutral-500">Encrypted peer-to-peer sanctuary chats</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-full transition cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* ERROR TOAST */}
      {toast && (
        <div className="bg-red-950/40 border border-red-800/50 p-2.5 mx-4 mt-2 rounded-lg flex items-center gap-1.5 text-[11px] text-red-400">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Recipient Selection Bar */}
      {!activeChatRecipientId ? (
        /* CHOOSE A CONTACT */
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Select Contact to Message:</h4>
          <div className="space-y-2">
            {users
              .filter((u) => u.id !== currentUser.id && u.username !== 'mrx26')
              .map((u) => (
                <button
                  key={u.id}
                  onClick={() => setActiveChatRecipient(u.id, u.username)}
                  className="w-full p-3 bg-[#121212] hover:bg-neutral-900 border border-neutral-900 rounded-xl flex items-center justify-between transition text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-white text-sm">
                      {u.username[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-xs font-bold text-white">
                        <span>{u.username}</span>
                        {u.isVerified && <span className="text-[#d4af37] text-[10px]">✅</span>}
                      </div>
                      <span className="text-[9px] font-mono text-[#d4af37]/80 uppercase block">{u.role}</span>
                    </div>
                  </div>
                  <MessageCircle className="w-4 h-4 text-neutral-600 hover:text-[#d4af37]" />
                </button>
              ))}
          </div>
        </div>
      ) : (
        /* ACTIVE CHAT WINDOW */
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          {/* Active Recipient Details Ribbon */}
          <div className="px-4 py-2 bg-neutral-900/60 border-b border-neutral-950 flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
              <span className="font-bold text-[#d4af37]">@{activeChatRecipientUsername}</span>
              <span className="text-[10px] text-neutral-500 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-900 font-mono">
                {users.find((u) => u.id === activeChatRecipientId)?.role}
              </span>
            </div>
            <button
              onClick={() => setActiveChatRecipient(null, null)}
              className="text-[10px] text-neutral-500 hover:text-white hover:underline"
            >
              Change Contact
            </button>
          </div>

          {/* Messages Flow Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
            {chatMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500 space-y-2 p-4">
                <Shield className="w-8 h-8 text-neutral-800" />
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Secure Sanctuary Channel Initiated</p>
                <p className="text-[10px] text-neutral-600 max-w-[240px]">
                  Send a respectful message. Messages are encrypted and stored inside sandbox memories.
                </p>
              </div>
            ) : (
              chatMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-xs space-y-1 ${isMe ? 'bg-[#8b0000] text-white rounded-br-none' : 'bg-[#121212] border border-neutral-900 text-neutral-200 rounded-bl-none'}`}>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      <span className="text-[8px] text-neutral-500 block text-right font-mono">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input message form */}
          <form onSubmit={handleSend} className="p-4 border-t border-neutral-950 bg-[#121212] flex gap-2 items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={currentUser.isVerified ? `Message @${activeChatRecipientUsername}...` : "✅ Verify account to chat"}
              className="flex-1 bg-[#050505] border border-neutral-850 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#8b0000]"
            />
            <button
              type="submit"
              className="p-2.5 bg-[#8b0000] hover:bg-red-800 text-white rounded-xl transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
