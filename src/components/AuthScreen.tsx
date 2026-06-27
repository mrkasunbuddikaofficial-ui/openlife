/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Role } from '../types';
import { ShieldCheck, Lock, Mail, User as UserIcon, Phone, AlertCircle, HelpCircle } from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: (user: User) => void;
  users: User[];
  onAddUser: (user: User) => void;
  onAddResetRequest: (username: string, whatsapp: string) => void;
}

export default function AuthScreen({ onLoginSuccess, users, onAddUser, onAddResetRequest }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // Login Form States
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register Form States
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regGender, setRegGender] = useState('Female');
  const [regRole, setRegRole] = useState<Role>('SUB');
  const [regError, setRegError] = useState('');
  const [showRegSuccessPopup, setShowRegSuccessPopup] = useState(false);

  // Forgot Password States
  const [forgotUsername, setForgotUsername] = useState('');
  const [forgotWhatsapp, setForgotWhatsapp] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginUsername.trim() || !loginPassword.trim()) {
      setLoginError('Please enter both username and password.');
      return;
    }

    // Special Admin Credentials Check
    if (loginUsername === 'mrx26') {
      if (loginPassword === 'admin7408@123') {
        const adminUser = users.find(u => u.username === 'mrx26') || {
          id: 'admin_user',
          username: 'mrx26',
          email: 'admin@openlife.app',
          gender: 'Male',
          role: 'Admin' as Role,
          rank: 'Best' as const,
          isVerified: true,
          isActivated: true,
          badges: ['👑 Owner', '💻 Founder']
        };
        onLoginSuccess(adminUser);
        return;
      } else {
        setLoginError('Invalid administrator password.');
        return;
      }
    }

    // Regular User Login Check
    // For demo/prototype, we allow standard logins. Let's look up in the list
    const foundUser = users.find(u => u.username.toLowerCase() === loginUsername.toLowerCase());
    if (foundUser) {
      if (!foundUser.isActivated) {
        setLoginError('This account has been deactivated by the Admin.');
        return;
      }
      // Since it's a front-end demo with persistent state, any password is fine except for admin,
      // but let's assume password is the username + '123' or just standard validation.
      onLoginSuccess(foundUser);
    } else {
      setLoginError('User not found. Try "Mistress_Elara" or "Slave_Kael", or Register.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regUsername.trim() || !regEmail.trim() || !regPassword.trim()) {
      setRegError('All fields are required.');
      return;
    }

    if (users.some(u => u.username.toLowerCase() === regUsername.toLowerCase())) {
      setRegError('Username is already taken.');
      return;
    }

    const newUser: User = {
      id: 'user_' + Date.now(),
      username: regUsername.trim(),
      email: regEmail.trim(),
      gender: regGender,
      role: regRole,
      rank: 'Normal',
      isVerified: false,
      isActivated: true,
      badges: []
    };

    onAddUser(newUser);
    setShowRegSuccessPopup(true);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');

    if (!forgotUsername.trim() || !forgotWhatsapp.trim()) {
      setForgotError('Please enter both username and WhatsApp number.');
      return;
    }

    onAddResetRequest(forgotUsername.trim(), forgotWhatsapp.trim());
    setForgotSuccess(true);
  };

  const closeRegSuccess = () => {
    setShowRegSuccessPopup(false);
    setRegUsername('');
    setRegEmail('');
    setRegPassword('');
    setIsLogin(true);
  };

  return (
    <div id="auth-screen-container" className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Art */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80')` }}
        />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0a0a0a]/90 to-[#0a0a0a] pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-[450px]">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-serif tracking-[2px] uppercase text-[#d4af37] font-bold mb-2">
            OPEN LIFE
          </h1>
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#999999]">
            18+ Niche Lifestyle Social Network
          </p>
        </div>

        {/* Main Card */}
        <div id="auth-card" className="bg-[#121212]/90 border border-neutral-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent" />

          {/* FORGOT PASSWORD VIEW */}
          {isForgotPassword ? (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold font-display text-white mb-1">Recover Passcode</h2>
                <p className="text-sm text-neutral-400">Request password reset via WhatsApp</p>
              </div>

              {forgotSuccess ? (
                <div className="bg-neutral-900/80 border border-neutral-800 p-5 rounded-xl space-y-4 text-center">
                  <div className="w-12 h-12 bg-amber-500/10 text-[#d4af37] rounded-full flex items-center justify-center mx-auto">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Reset Request Sent</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Your request has been filed in the Admin Dashboard. The agent will manually reset your passcode and contact you on WhatsApp shortly.
                  </p>
                  <button
                    onClick={() => {
                      setIsForgotPassword(false);
                      setForgotSuccess(false);
                      setForgotUsername('');
                      setForgotWhatsapp('');
                    }}
                    className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm font-semibold transition"
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  {forgotError && (
                    <div className="bg-red-950/40 border border-red-800/50 p-3 rounded-lg flex items-center gap-2 text-xs text-red-400">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{forgotError}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-widest block ml-1">
                      Account Username
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 w-4.5 h-4.5" />
                      <input
                        type="text"
                        placeholder="e.g. Slave_Kael"
                        value={forgotUsername}
                        onChange={(e) => setForgotUsername(e.target.value)}
                        className="w-full bg-[#050505] border border-neutral-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder-neutral-600 focus:outline-none focus:border-[#8b0000] focus:ring-1 focus:ring-[#8b0000] transition text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-widest block ml-1">
                      WhatsApp Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 w-4.5 h-4.5" />
                      <input
                        type="text"
                        placeholder="e.g. +44 7911 123456"
                        value={forgotWhatsapp}
                        onChange={(e) => setForgotWhatsapp(e.target.value)}
                        className="w-full bg-[#050505] border border-neutral-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder-neutral-600 focus:outline-none focus:border-[#8b0000] focus:ring-1 focus:ring-[#8b0000] transition text-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#8b0000] hover:bg-red-800 text-white rounded-xl font-bold tracking-wider hover:shadow-lg hover:shadow-red-950/30 transition duration-300 mt-2 cursor-pointer text-sm"
                  >
                    Send Reset Request
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(false)}
                    className="w-full py-2.5 bg-transparent text-neutral-400 hover:text-white rounded-lg text-xs font-semibold transition mt-1"
                  >
                    Back to Login
                  </button>
                </form>
              )}
            </div>
          ) : isLogin ? (
            /* LOGIN VIEW */
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold font-display text-white mb-1">Sign In</h2>
                <p className="text-sm text-neutral-400">Access your lifestyle sanctuary</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {loginError && (
                  <div className="bg-red-950/40 border border-red-800/50 p-3 rounded-lg flex items-center gap-2 text-xs text-red-400">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-400 uppercase tracking-widest block ml-1">
                    Username
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 w-4.5 h-4.5" />
                    <input
                      type="text"
                      placeholder="Enter username"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      className="w-full bg-[#050505] border border-neutral-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder-neutral-600 focus:outline-none focus:border-[#8b0000] focus:ring-1 focus:ring-[#8b0000] transition text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(true);
                        setForgotSuccess(false);
                      }}
                      className="text-xs text-[#d4af37] hover:underline"
                    >
                      FORGOT?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 w-4.5 h-4.5" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-[#050505] border border-neutral-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder-neutral-600 focus:outline-none focus:border-[#8b0000] focus:ring-1 focus:ring-[#8b0000] transition text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#8b0000] hover:bg-red-800 text-white rounded-xl font-bold tracking-wider hover:shadow-lg hover:shadow-red-950/30 transition duration-300 mt-2 cursor-pointer text-sm uppercase"
                >
                  Enter The Sanctuary
                </button>
              </form>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-800" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#121212] px-3 text-neutral-500 uppercase tracking-widest text-[10px]">
                    or
                  </span>
                </div>
              </div>

              <p className="text-center text-sm text-neutral-400">
                New to the lifestyle?{' '}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-[#d4af37] font-bold hover:underline"
                >
                  Create invitation
                </button>
              </p>
            </div>
          ) : (
            /* REGISTER VIEW */
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold font-display text-white mb-1">Apply for Membership</h2>
                <p className="text-sm text-neutral-400">Submit credentials for verified access</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                {regError && (
                  <div className="bg-red-950/40 border border-red-800/50 p-3 rounded-lg flex items-center gap-2 text-xs text-red-400">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-400 uppercase tracking-widest block ml-1">
                    Choose Username
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 w-4.5 h-4.5" />
                    <input
                      type="text"
                      placeholder="e.g. Mistress_Luna"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      className="w-full bg-[#050505] border border-neutral-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder-neutral-600 focus:outline-none focus:border-[#8b0000] focus:ring-1 focus:ring-[#8b0000] transition text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-400 uppercase tracking-widest block ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 w-4.5 h-4.5" />
                    <input
                      type="email"
                      placeholder="name@lifestyle.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full bg-[#050505] border border-neutral-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder-neutral-600 focus:outline-none focus:border-[#8b0000] focus:ring-1 focus:ring-[#8b0000] transition text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-400 uppercase tracking-widest block ml-1">
                    Secret Passcode
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 w-4.5 h-4.5" />
                    <input
                      type="password"
                      placeholder="Min. 8 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full bg-[#050505] border border-neutral-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder-neutral-600 focus:outline-none focus:border-[#8b0000] focus:ring-1 focus:ring-[#8b0000] transition text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-widest block ml-1">
                      Gender
                    </label>
                    <select
                      value={regGender}
                      onChange={(e) => setRegGender(e.target.value)}
                      className="w-full bg-[#050505] border border-neutral-800 rounded-xl py-3 px-3 text-white focus:outline-none focus:border-[#8b0000] focus:ring-1 focus:ring-[#8b0000] transition text-sm"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Cuckold">Cuckold</option>
                      <option value="Couples">Couples</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-widest block ml-1">
                      Role Selection
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as Role)}
                      className="w-full bg-[#050505] border border-neutral-800 rounded-xl py-3 px-3 text-white focus:outline-none focus:border-[#8b0000] focus:ring-1 focus:ring-[#8b0000] transition text-sm"
                    >
                      <option value="Mistress/DOM">Mistress/DOM</option>
                      <option value="Master">Master</option>
                      <option value="SUB">SUB</option>
                      <option value="Slave">Slave</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#8b0000] hover:bg-red-800 text-white rounded-xl font-bold tracking-wider hover:shadow-lg hover:shadow-red-950/30 transition duration-300 mt-2 cursor-pointer text-sm uppercase"
                >
                  Submit Application
                </button>
              </form>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-800" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#121212] px-3 text-neutral-500 uppercase tracking-widest text-[10px]">
                    or
                  </span>
                </div>
              </div>

              <p className="text-center text-sm text-neutral-400">
                Already registered?{' '}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-[#d4af37] font-bold hover:underline"
                >
                  Sign In
                </button>
              </p>
            </div>
          )}
        </div>

        {/* Demo hints below form */}
        {isLogin && !isForgotPassword && (
          <div className="mt-4 bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-3 text-center">
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              <span className="text-[#d4af37] font-semibold">Demo Accounts:</span><br />
              <span className="text-neutral-400">mrx26</span> (Admin) • Pass: <span className="text-neutral-400">admin7408@123</span><br />
              <span className="text-neutral-400">Mistress_Elara</span> (DOM) • <span className="text-neutral-400">Slave_Kael</span> (Slave)<br />
              <span className="text-neutral-500 italic">(Any passcode works for standard accounts)</span>
            </p>
          </div>
        )}

        {/* Footer Links */}
        <div className="mt-8 flex justify-center gap-6 text-[10px] text-neutral-600 tracking-widest uppercase font-mono">
          <a href="#" className="hover:text-neutral-400 transition">Support</a>
          <span>•</span>
          <a href="#" className="hover:text-neutral-400 transition">Privacy</a>
          <span>•</span>
          <a href="#" className="hover:text-neutral-400 transition">Terms</a>
        </div>
      </div>

      {/* REGISTRATION SUCCESS DIALOG POPUP */}
      {showRegSuccessPopup && (
        <div id="reg-success-popup" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#161616] border border-neutral-800 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl relative">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-yellow-500 to-red-600" />
            
            <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-yellow-600 text-black rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-2xl shadow-lg">
              ✅
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2 font-display">Application Received</h3>
            
            <p className="text-sm text-[#d4af37] font-bold uppercase tracking-widest mb-4 animate-pulse">
              "Contact the Agent and Open Your Life"
            </p>

            <p className="text-xs text-neutral-400 leading-relaxed mb-6">
              Your Open Life membership application is pending approval. To accelerate verification and unlock full capabilities, please send your confirmation code to our VIP agent on Telegram/WhatsApp.
            </p>

            <button
              onClick={closeRegSuccess}
              className="w-full py-3 bg-[#8b0000] hover:bg-red-800 text-white rounded-xl text-sm font-bold tracking-widest transition duration-300 uppercase"
            >
              Continue to Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
