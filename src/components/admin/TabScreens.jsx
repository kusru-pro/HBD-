import React from 'react';
import { Sparkles, Heart, Gift, Crown, Flower2 } from 'lucide-react';

export default function TabScreens({ config, onChange }) {
  const hiddenWords = config.hiddenMessageWords || ["You", "Make", "Everything", "Magical"];
  const compliments = config.complimentsList || [];

  const handleWordChange = (index, val) => {
    const updated = [...hiddenWords];
    updated[index] = val;
    onChange('hiddenMessageWords', updated);
  };

  const handleComplimentChange = (index, field, val) => {
    const updated = [...compliments];
    updated[index] = { ...updated[index], [field]: val };
    onChange('complimentsList', updated);
  };

  return (
    <div className="space-y-6">
      {/* 1. Welcome Screen Texts */}
      <div className="p-4 rounded-2xl bg-white/70 border border-blush-200/80 shadow-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-blush-100 pb-2">
          <Sparkles className="w-4 h-4 text-rosegold" />
          <h4 className="text-xs font-bold text-plum uppercase tracking-wider">Screen 2: Welcome Subtitle</h4>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-plum/70 mb-1 block">
            Welcome Prompt Subtitle:
          </label>
          <textarea
            rows={2}
            value={config.welcomeSubtitle || ''}
            onChange={(e) => onChange('welcomeSubtitle', e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white border border-blush-200 text-xs text-plum focus:outline-none focus:ring-2 focus:ring-rosegold/40 resize-none"
          />
        </div>
      </div>

      {/* 2. Screen 3: Balloon Hidden Words */}
      <div className="p-4 rounded-2xl bg-white/70 border border-blush-200/80 shadow-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-blush-100 pb-2">
          <Heart className="w-4 h-4 text-rosegold fill-rosegold" />
          <h4 className="text-xs font-bold text-plum uppercase tracking-wider">Screen 3: 4 Balloon Words</h4>
        </div>
        <p className="text-[10px] text-plum/60">
          The 4 hidden words revealed in order when popping the balloons:
        </p>

        <div className="grid grid-cols-2 gap-2">
          {[0, 1, 2, 3].map((idx) => (
            <div key={idx}>
              <span className="text-[10px] font-bold text-rosegold block mb-0.5">Word {idx + 1}:</span>
              <input
                type="text"
                value={hiddenWords[idx] || ''}
                onChange={(e) => handleWordChange(idx, e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-blush-200 text-xs text-plum focus:outline-none focus:ring-2 focus:ring-rosegold/40 font-semibold"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Screen 5: 6 Bouquet Compliment Cards */}
      <div className="p-4 rounded-2xl bg-white/70 border border-blush-200/80 shadow-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-blush-100 pb-2">
          <Flower2 className="w-4 h-4 text-rosegold" />
          <h4 className="text-xs font-bold text-plum uppercase tracking-wider">Screen 5: Bouquet Compliments (6 Cards)</h4>
        </div>

        <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
          {compliments.map((item, idx) => (
            <div key={item.id || idx} className="p-3 rounded-xl bg-white border border-blush-100 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={item.emoji || '💖'}
                  onChange={(e) => handleComplimentChange(idx, 'emoji', e.target.value)}
                  className="w-9 px-1 py-1 rounded-lg bg-blush-50 border border-blush-200 text-center text-sm"
                  title="Card Emoji"
                />
                <input
                  type="text"
                  value={item.tag || ''}
                  onChange={(e) => handleComplimentChange(idx, 'tag', e.target.value)}
                  placeholder="Tag label (e.g. Kind Heart)"
                  className="flex-1 px-2.5 py-1 rounded-lg bg-blush-50 border border-blush-200 text-xs font-bold text-rosegold"
                />
              </div>

              <input
                type="text"
                value={item.title || ''}
                onChange={(e) => handleComplimentChange(idx, 'title', e.target.value)}
                placeholder="Card Title (e.g. Radiant Smile)"
                className="w-full px-2.5 py-1 rounded-lg bg-white border border-blush-200 text-xs font-semibold text-plum"
              />

              <textarea
                rows={2}
                value={item.text || ''}
                onChange={(e) => handleComplimentChange(idx, 'text', e.target.value)}
                placeholder="Compliment message..."
                className="w-full px-2.5 py-1 rounded-lg bg-white border border-blush-200 text-xs text-plum resize-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 4. Screen 8: Grand Finale Cards */}
      <div className="p-4 rounded-2xl bg-white/70 border border-blush-200/80 shadow-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-blush-100 pb-2">
          <Crown className="w-4 h-4 text-rosegold" />
          <h4 className="text-xs font-bold text-plum uppercase tracking-wider">Screen 8: Finale Card</h4>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-plum/70 mb-1 block">Finale Badge:</label>
          <input
            type="text"
            value={config.finaleBadge || ''}
            onChange={(e) => onChange('finaleBadge', e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl bg-white border border-blush-200 text-xs text-plum"
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-plum/70 mb-1 block">Romantic Quote:</label>
          <input
            type="text"
            value={config.finaleQuote || ''}
            onChange={(e) => onChange('finaleQuote', e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl bg-white border border-blush-200 text-xs text-plum"
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-plum/70 mb-1 block">Footer Wish:</label>
          <input
            type="text"
            value={config.finaleFooter || ''}
            onChange={(e) => onChange('finaleFooter', e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl bg-white border border-blush-200 text-xs text-plum"
          />
        </div>
      </div>
    </div>
  );
}
