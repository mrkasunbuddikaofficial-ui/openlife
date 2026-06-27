/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, VerificationRequest } from '../types';
import { ShieldCheck, Camera, Video, AlertTriangle, ArrowLeft, Check, Play, Square, Loader } from 'lucide-react';

interface VerificationFormProps {
  currentUser: User;
  onAddVerificationRequest: (request: Omit<VerificationRequest, 'id' | 'status' | 'createdAt'>) => void;
  onBack: () => void;
}

export default function VerificationForm({ currentUser, onAddVerificationRequest, onBack }: VerificationFormProps) {
  const [fullName, setFullName] = useState('');
  const [location, setLocation] = useState('');
  const [age, setAge] = useState<number>(25);
  const [gender, setGender] = useState(currentUser.gender);

  // 3 Selfies state (URLs representing Center, Left, Right angles)
  const [selfie1, setSelfie1] = useState(''); // Center Angle
  const [selfie2, setSelfie2] = useState(''); // Left Angle
  const [selfie3, setSelfie3] = useState(''); // Right Angle

  // Recording State for Simulated Verification Video
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0); // 0 to 8 seconds
  const [recordedVideoUrl, setRecordedVideoUrl] = useState('');
  const [videoMode, setVideoMode] = useState<'upload' | 'record'>('upload');
  const [errorText, setErrorText] = useState<string | null>(null);
  const [successSubmitted, setSuccessSubmitted] = useState(false);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorText(null);

    if (file.type.startsWith('video/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRecordedVideoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setErrorText('🚫 Please select a valid video file (MP4/WebM).');
    }
  };

  // Unsplash portait options representing different personas for demo simulation
  const SIMULATED_SELFIE_PRESETS = [
    {
      gender: 'Male',
      center: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      left: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      right: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80'
    },
    {
      gender: 'Female',
      center: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      left: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      right: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80'
    }
  ];

  const selectPresetSelfies = (g: string) => {
    const preset = SIMULATED_SELFIE_PRESETS.find(p => p.gender === g) || SIMULATED_SELFIE_PRESETS[1];
    setSelfie1(preset.center);
    setSelfie2(preset.left);
    setSelfie3(preset.right);
    setErrorText(null);
  };

  // Recording timer simulation
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordProgress((prev) => {
          if (prev >= 8) {
            setIsRecording(false);
            setRecordedVideoUrl('Simulated 8-second Verification Selfie Video (Match with selfie identities)');
            clearInterval(interval);
            return 8;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startSimulatedRecording = () => {
    setIsRecording(true);
    setRecordProgress(0);
    setRecordedVideoUrl('');
  };

  const stopSimulatedRecording = () => {
    setIsRecording(false);
    if (recordProgress >= 2) {
      setRecordedVideoUrl(`Simulated ${recordProgress}-second Verification Selfie Video (Match with selfie identities)`);
    } else {
      setErrorText('Recording too short! Selfie verification video must be at least 2 seconds (max 8 seconds).');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);

    if (!fullName.trim() || !location.trim()) {
      setErrorText('Please fill out your Full Name and Location.');
      return;
    }

    if (!selfie1 || !selfie2 || !selfie3) {
      setErrorText('Please upload or generate all 3 required Face Selfie angles.');
      return;
    }

    if (!recordedVideoUrl) {
      setErrorText('Please record the required 8-second verification selfie video.');
      return;
    }

    if (age < 18) {
      setErrorText('Open Life is strictly an 18+ platform. You must be at least 18 years old to verify.');
      return;
    }

    onAddVerificationRequest({
      userId: currentUser.id,
      username: currentUser.username,
      fullName: fullName.trim(),
      location: location.trim(),
      selfies: [selfie1, selfie2, selfie3],
      videoUrl: recordedVideoUrl,
      age,
      gender
    });

    setSuccessSubmitted(true);
  };

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto px-1 md:px-0 font-sans text-neutral-300 animate-fade-in">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-neutral-400 hover:text-white transition text-xs font-semibold cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Profile
      </button>

      {/* HEADER BAR */}
      <div className="bg-[#121212]/95 border border-neutral-900 rounded-xl p-5 shadow-xl relative overflow-hidden text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#d4af37]" />
        <div>
          <h2 className="text-xl font-bold text-white font-display flex items-center justify-center md:justify-start gap-1.5">
            <ShieldCheck className="w-6 h-6 text-[#d4af37]" />
            Apply for Gold Verification Badge ✅
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            To unlock full commenting, advertising, and messaging, submit high-fidelity credentials for manual Admin verification.
          </p>
        </div>
      </div>

      {successSubmitted ? (
        /* SUCCESS SCREEN */
        <div className="bg-[#121212] border border-neutral-850 p-6 rounded-xl space-y-6 text-center animate-fade-in">
          <div className="w-16 h-16 bg-green-950/20 text-green-500 border border-green-800 rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-lg">
            ✓
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Application Successfully Submitted</h3>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-md mx-auto">
              Your 3 selfie angles and selfie video have been successfully locked and forwarded to the Admin console review dashboard. The administrator will inspect your details shortly.
            </p>
          </div>

          <div className="bg-[#050505] border border-neutral-900 p-4 rounded-xl text-xs space-y-1 max-w-sm mx-auto text-left">
            <p className="text-neutral-500 font-semibold uppercase tracking-wider text-[9px]">Verification Details Locked:</p>
            <p className="text-neutral-300"><strong>Name:</strong> {fullName}</p>
            <p className="text-neutral-300"><strong>Location:</strong> {location}</p>
            <p className="text-neutral-300"><strong>Age:</strong> {age} years (18+ confirmed)</p>
            <p className="text-[#d4af37]"><strong>Status:</strong> ⏳ PENDING ADMIN REVIEW</p>
          </div>

          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-[#8b0000] hover:bg-red-800 text-[#d4af37] font-bold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
          >
            Return to Profile
          </button>
        </div>
      ) : (
        /* REQUEST FORM */
        <form onSubmit={handleSubmit} className="bg-[#121212] border border-neutral-900 rounded-xl p-5 md:p-6 space-y-6">
          {errorText && (
            <div className="bg-red-950/40 border border-red-800/50 p-3 rounded-lg flex items-center gap-2 text-xs text-red-400 animate-shake">
              <AlertTriangle className="w-4.5 h-4.5 text-red-400 shrink-0" />
              <span>{errorText}</span>
            </div>
          )}

          {/* SECTION 1: Personal info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#d4af37] uppercase tracking-wider border-b border-neutral-900 pb-2">
              1. Basic Credentials
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-neutral-500 uppercase block ml-1">Legal Full Name</label>
                <input
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Kaelen James Miller"
                  className="w-full bg-[#050505] border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#8b0000]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-neutral-500 uppercase block ml-1">Current Location (City, Country)</label>
                <input
                  required
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. London, UK"
                  className="w-full bg-[#050505] border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#8b0000]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-neutral-500 uppercase block ml-1">Age (Must be 18+)</label>
                <input
                  required
                  type="number"
                  min={18}
                  max={100}
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 18)}
                  className="w-full bg-[#050505] border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#8b0000]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-neutral-500 uppercase block ml-1">Gender</label>
                <input
                  required
                  type="text"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-[#050505] border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#8b0000]"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: 3 Selfie Angles */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-900 pb-2">
              <h3 className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">
                2. Face Selfies — 3 Angles
              </h3>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => selectPresetSelfies('Female')}
                  className="px-2 py-1 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-[9px] font-bold text-[#d4af37] rounded uppercase cursor-pointer"
                >
                  👩 Simulated female model
                </button>
                <button
                  type="button"
                  onClick={() => selectPresetSelfies('Male')}
                  className="px-2 py-1 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-[9px] font-bold text-[#d4af37] rounded uppercase cursor-pointer"
                >
                  👨 Simulated male model
                </button>
              </div>
            </div>

            <p className="text-[11px] text-neutral-500 italic leading-relaxed">
              For manual identity verification, please upload or generate 3 clear selfie photographs captured at 3 distinct angles (Center, Left Profile, Right Profile) with sufficient lighting.
            </p>

            <div className="grid grid-cols-3 gap-3">
              {/* Box 1: Center Angle */}
              <div className="space-y-1 text-center">
                <span className="text-[9px] font-mono text-neutral-500 uppercase">Center Face</span>
                <div className="aspect-square bg-[#050505] border-2 border-dashed border-neutral-800 rounded-xl overflow-hidden flex flex-col items-center justify-center p-1 relative">
                  {selfie1 ? (
                    <img src={selfie1} alt="Center face selfie" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <Camera className="w-5 h-5 text-neutral-700" />
                  )}
                </div>
              </div>

              {/* Box 2: Left Profile */}
              <div className="space-y-1 text-center">
                <span className="text-[9px] font-mono text-neutral-500 uppercase">Left Profile</span>
                <div className="aspect-square bg-[#050505] border-2 border-dashed border-neutral-800 rounded-xl overflow-hidden flex flex-col items-center justify-center p-1 relative">
                  {selfie2 ? (
                    <img src={selfie2} alt="Left Profile face selfie" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <Camera className="w-5 h-5 text-neutral-700" />
                  )}
                </div>
              </div>

              {/* Box 3: Right Profile */}
              <div className="space-y-1 text-center">
                <span className="text-[9px] font-mono text-neutral-500 uppercase">Right Profile</span>
                <div className="aspect-square bg-[#050505] border-2 border-dashed border-neutral-800 rounded-xl overflow-hidden flex flex-col items-center justify-center p-1 relative">
                  {selfie3 ? (
                    <img src={selfie3} alt="Right Profile face selfie" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <Camera className="w-5 h-5 text-neutral-700" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: 8s Selfie Video */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#d4af37] uppercase tracking-wider border-b border-neutral-900 pb-2">
              3. Selfie Verification Video — Max 8s
            </h3>
            <p className="text-[11px] text-neutral-500 italic leading-relaxed">
              Upload a direct selfie verification video from your device or use our liveness camera recorder simulator.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setVideoMode('upload'); setRecordedVideoUrl(''); }}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase border transition ${videoMode === 'upload' ? 'bg-[#8b0000]/20 border-[#8b0000] text-white' : 'bg-transparent border-neutral-800 text-neutral-500 hover:text-neutral-400'}`}
              >
                📁 Direct Video Upload
              </button>
              <button
                type="button"
                onClick={() => { setVideoMode('record'); setRecordedVideoUrl(''); }}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase border transition ${videoMode === 'record' ? 'bg-[#8b0000]/20 border-[#8b0000] text-white' : 'bg-transparent border-neutral-800 text-neutral-500 hover:text-neutral-400'}`}
              >
                🎥 Camera Recorder Simulator
              </button>
            </div>

            <div className="bg-[#050505] border border-neutral-800 rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden">
              {recordedVideoUrl ? (
                <div className="space-y-2 py-4 w-full">
                  <div className="max-h-[200px] rounded-xl overflow-hidden bg-black flex justify-center border border-neutral-900 max-w-sm mx-auto">
                    {recordedVideoUrl.startsWith('data:video/') ? (
                      <video src={recordedVideoUrl} className="max-h-[200px]" controls />
                    ) : (
                      <div className="p-4 text-xs text-[#d4af37] font-mono italic text-center">
                        🎥 {recordedVideoUrl}
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-bold text-green-500 font-mono uppercase tracking-widest text-center">
                    ✓ Video Proof Ready & Locked
                  </p>
                  <button
                    type="button"
                    onClick={() => { setRecordedVideoUrl(''); }}
                    className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[10px] font-mono rounded cursor-pointer mx-auto block text-red-500"
                  >
                    Clear & Choose Another
                  </button>
                </div>
              ) : isRecording ? (
                <div className="space-y-2 py-4">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center animate-pulse text-white mx-auto">
                    <Square className="w-5 h-5 fill-current" />
                  </div>
                  <p className="text-xs font-bold text-red-500 font-mono tracking-widest uppercase">
                    REC: 00:0{recordProgress} / 00:08
                  </p>
                  <p className="text-[10px] text-neutral-400">Speak name clearly & blink twice...</p>
                  
                  {/* Progress bar */}
                  <div className="w-48 h-1 bg-neutral-900 rounded-full overflow-hidden mx-auto">
                    <div 
                      className="h-full bg-red-600 transition-all duration-1000"
                      style={{ width: `${(recordProgress / 8) * 100}%` }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={stopSimulatedRecording}
                    className="px-4 py-1.5 bg-red-800 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer mx-auto block"
                  >
                    Stop & Lock Proof
                  </button>
                </div>
              ) : videoMode === 'upload' ? (
                <div className="border border-dashed border-neutral-800 hover:border-[#8b0000]/50 rounded-xl p-5 bg-[#050505] text-center transition relative cursor-pointer group w-full">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-2">
                    <Video className="w-8 h-8 text-neutral-600 mx-auto group-hover:text-[#d4af37] transition" />
                    <p className="text-xs font-semibold text-neutral-400">Click or Drag & Drop Video File</p>
                    <p className="text-[10px] text-neutral-500 font-mono">Select a verification selfie video from device (MP4/WebM/MOV)</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 py-4">
                  <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 text-[#d4af37] rounded-full flex items-center justify-center mx-auto">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Verification Video Simulator</h4>
                    <p className="text-[10px] text-neutral-500 mt-1 max-w-sm">
                      Launches an interactive simulated camera pipeline that records the required blink-check liveness.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={startSimulatedRecording}
                    className="px-5 py-2.5 bg-[#8b0000] hover:bg-red-800 text-white font-bold rounded-xl text-xs tracking-wider uppercase transition cursor-pointer"
                  >
                    Start Simulated Camera Recording
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* SUBMIT */}
          <div className="pt-4 border-t border-neutral-900 flex justify-end gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 bg-transparent text-neutral-400 hover:text-white rounded-xl text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#8b0000] hover:bg-red-800 text-[#d4af37] font-bold rounded-xl text-xs tracking-widest uppercase transition cursor-pointer"
            >
              Lock Details & Submit Verification
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
