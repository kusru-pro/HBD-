import React, { useState } from 'react';
import { MessageSquareHeart, Trash2, Copy, Check, Clock, Sparkles } from 'lucide-react';
import { deleteStoredReply, clearAllReplies } from '../../utils/storage';
import { playTapSound } from '../../utils/soundEffects';

export default function TabReplies({ replies, onRepliesUpdated }) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (item) => {
    playTapSound();
    const formatted = `[${item.mood}] "${item.message}" (Sent on ${new Date(item.timestamp).toLocaleString()})`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(formatted);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this reply?")) {
      playTapSound();
      deleteStoredReply(id);
      onRepliesUpdated?.();
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Clear all received replies from the inbox? This cannot be undone.")) {
      playTapSound();
      clearAllReplies();
      onRepliesUpdated?.();
    }
  };

  return (
    <div className="space-y-4">
      {/* Inbox Header */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/70 border border-blush-200/80 shadow-sm">
        <div className="flex items-center gap-2">
          <MessageSquareHeart className="w-5 h-5 text-rosegold" />
          <div>
            <h4 className="text-xs font-bold text-plum uppercase tracking-wider">
              Surprise Replies Inbox
            </h4>
            <p className="text-[10px] text-plum/60">
              {replies.length} {replies.length === 1 ? 'message' : 'messages'} received
            </p>
          </div>
        </div>

        {replies.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-[10px] font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Replies List */}
      {replies.length === 0 ? (
        <div className="p-8 rounded-2xl bg-white/60 border border-dashed border-blush-200 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-blush-100/70 flex items-center justify-center mb-2">
            <Sparkles className="w-6 h-6 text-rosegold" />
          </div>
          <h5 className="font-serif text-sm font-bold text-plum mb-1">
            No notes received yet
          </h5>
          <p className="text-xs text-plum/60 max-w-[240px] leading-relaxed">
            When she finishes the surprise and sends a sweet note on Screen 9, it will appear here immediately! 💌
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
          {replies.map((item) => {
            const formattedDate = new Date(item.timestamp).toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white border border-blush-200 shadow-sm hover:shadow-md transition-shadow relative space-y-2.5"
              >
                {/* Card Top: Mood & Timestamp */}
                <div className="flex items-center justify-between border-b border-blush-100 pb-2">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-rosegold bg-blush-50 px-2.5 py-0.5 rounded-full border border-rosegold/30">
                    {item.mood}
                  </span>

                  <span className="flex items-center gap-1 text-[10px] text-plum/50 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{formattedDate}</span>
                  </span>
                </div>

                {/* Message Body */}
                <p className="font-serif italic text-xs md:text-sm text-plum/90 leading-relaxed whitespace-pre-line select-text">
                  "{item.message}"
                </p>

                {/* Bottom Actions */}
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-blush-50">
                  <button
                    onClick={() => handleCopy(item)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-plum/70 hover:text-rosegold bg-blush-50/80 px-2.5 py-1 rounded-lg border border-blush-200 transition-colors"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete message"
                    aria-label="Delete message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
