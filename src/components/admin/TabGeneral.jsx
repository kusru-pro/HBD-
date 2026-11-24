import React from 'react';
import { User, KeyRound, Shield, Phone, Sparkles } from 'lucide-react';

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

      {/* WhatsApp Number for Direct Reply */}
      <div className="p-4 rounded-2xl bg-white/70 border border-blush-200/80 shadow-sm">
        <label className="flex items-center gap-2 text-xs font-bold text-plum mb-1.5">
          <Phone className="w-4 h-4 text-emerald-600" />
          <span>Your WhatsApp Number (For Replies)</span>
        </label>
        <input
          type="text"
          value={config.whatsappNumber || ''}
          onChange={(e) => onChange('whatsappNumber', e.target.value)}
          placeholder="e.g. 919876543210 (Country code + number)"
          className="w-full px-3 py-2 rounded-xl bg-white border border-blush-200 text-sm text-plum focus:outline-none focus:ring-2 focus:ring-rosegold/40 font-medium"
        />
        <p className="text-[10px] text-plum/50 mt-1">
          When she taps "Send on WhatsApp" on Screen 9, her note will open directly in chat with this number! Include country code (without +).
        </p>
      </div>
    </div>
  );
}
