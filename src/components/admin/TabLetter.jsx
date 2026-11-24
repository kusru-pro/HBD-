import React from 'react';
import { Mail, AlignLeft } from 'lucide-react';

export default function TabLetter({ config, onChange }) {
  const text = config.letterText || '';

  // Calculate live stats
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lineCount = text.split('\n').length;

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-white/70 border border-blush-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-blush-100 pb-2">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-rosegold" />
            <h4 className="text-xs font-bold text-plum uppercase tracking-wider">
              Screen 6: Birthday Letter Editor
            </h4>
          </div>

          {/* Live Stats */}
          <div className="flex items-center gap-3 text-[10px] font-mono text-plum/60 bg-blush-50 px-2.5 py-1 rounded-full border border-blush-200/60">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{charCount} chars</span>
            <span>•</span>
            <span>{lineCount} lines</span>
          </div>
        </div>

        <p className="text-[11px] text-plum/60 leading-relaxed">
          This letter unfolds with a smooth typewriter animation when she taps the wax seal on Screen 6. Write freely and from your heart!
        </p>

        {/* Spacious Textarea */}
        <div className="relative">
          <textarea
            rows={14}
            value={text}
            onChange={(e) => onChange('letterText', e.target.value)}
            placeholder="Write your heartfelt birthday letter here..."
            className="w-full p-4 rounded-2xl bg-white border border-blush-200 text-xs md:text-sm text-plum leading-relaxed placeholder:text-plum/30 focus:outline-none focus:ring-2 focus:ring-rosegold/40 resize-y font-serif custom-scrollbar"
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-plum/50">
          <span>Tip: Line breaks and emojis will be preserved exactly as typed.</span>
          <span>Auto-scrolls during typing</span>
        </div>
      </div>
    </div>
  );
}
