import React from 'react';
import { User, KeyRound, Shield, Instagram, Sparkles } from 'lucide-react';

export default function TabGeneral({ config, onChange, adminPin, onAdminPinChange }) {
  return (
    <div className="space-y-4">
      {/* Recipient Name */}
      <div className="p-4 rounded-2xl bg-white/70 border border-blush-200/80 shadow-sm">
        <label className="flex items-center gap-2 text-xs font-bold text-plum mb-1.5">
          <User className="w-4 h-4 text-rosegold" />
          <span>Birthday Person's Name</span>
        </label>
        <input
          type="text"
          value={config.recipientName || ''}
          onChange={(e) => onChange('recipientName', e.target.value)}
          placeholder="e.g. Ameen / Princess"
          className="w-full px-3 py-2 rounded-xl bg-white border border-blush-200 text-sm text-plum focus:outline-none focus:ring-2 focus:ring-rosegold/40 font-medium"
        />
        <p className="text-[10px] text-plum/50 mt-1">
          Appears across all screens, headers, and personalized messages.
        </p>
      </div>

      {/* Screen 1 Lock Passcode */}
      <div className="p-4 rounded-2xl bg-white/70 border border-blush-200/80 shadow-sm">
        <label className="flex items-center gap-2 text-xs font-bold text-plum mb-1.5">
          <KeyRound className="w-4 h-4 text-rosegold" />
          <span>Lock Screen Passcode (4 Digits)</span>
        </label>
        <input
          type="text"
          maxLength={4}
          value={config.passcode || ''}
          onChange={(e) => onChange('passcode', e.target.value.replace(/[^0-9]/g, ''))}
          placeholder="1205"
          className="w-full px-3 py-2 rounded-xl bg-white border border-blush-200 text-sm font-mono tracking-widest text-plum focus:outline-none focus:ring-2 focus:ring-rosegold/40 font-bold"
        />
        <p className="text-[10px] text-plum/50 mt-1">
          The 4-digit date or PIN needed to unlock Screen 1 (default: 1205).
        </p>
      </div>

      {/* Admin Dashboard PIN */}
      <div className="p-4 rounded-2xl bg-white/70 border border-blush-200/80 shadow-sm">
        <label className="flex items-center gap-2 text-xs font-bold text-plum mb-1.5">
          <Shield className="w-4 h-4 text-rosegold" />
          <span>Admin Dashboard PIN</span>
        </label>
        <input
          type="text"
          maxLength={6}
          value={adminPin || ''}
          onChange={(e) => onAdminPinChange(e.target.value.replace(/[^0-9]/g, ''))}
          placeholder="0000"
          className="w-full px-3 py-2 rounded-xl bg-white border border-blush-200 text-sm font-mono tracking-widest text-plum focus:outline-none focus:ring-2 focus:ring-rosegold/40 font-bold"
        />
        <p className="text-[10px] text-plum/50 mt-1">
          PIN to open this Admin Panel (default: 0000). Keep it secret!
        </p>
      </div>

      {/* Instagram Handle for Direct DM Reply */}
      <div className="p-4 rounded-2xl bg-white/70 border border-blush-200/80 shadow-sm">
        <label className="flex items-center gap-2 text-xs font-bold text-plum mb-1.5">
          <Instagram className="w-4 h-4 text-[#E1306C]" />
          <span>Your Instagram Handle / Username</span>
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-3 text-sm text-plum/40 font-semibold select-none">@</span>
          <input
            type="text"
            value={config.instagramHandle ? config.instagramHandle.replace('@', '') : ''}
            onChange={(e) => onChange('instagramHandle', e.target.value.replace('@', '').trim())}
            placeholder="your_instagram_username"
            className="w-full pl-7 pr-3 py-2 rounded-xl bg-white border border-blush-200 text-sm text-plum focus:outline-none focus:ring-2 focus:ring-[#E1306C]/40 font-medium"
          />
        </div>
        <p className="text-[10px] text-plum/50 mt-1">
          When she taps "Send on Instagram DM" on Screen 9, her message is copied and your Instagram profile/DM will open directly!
        </p>
      </div>
    </div>
  );
}
