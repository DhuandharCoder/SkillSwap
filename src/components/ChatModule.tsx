import React, { useState, useRef, useEffect } from 'react';
import { SwapRequest, ChatMessage } from '../types';
import {
  X,
  Send,
  Smile,
  Video,
  CheckCheck,
  Sparkles,
  Heart,
  Flame,
  ThumbsUp
} from 'lucide-react';

interface ChatModuleProps {
  request: SwapRequest;
  messages: ChatMessage[];
  currentUserId: string;
  onSendMessage: (text: string) => void;
  onStartVideoCall: () => void;
  onClose: () => void;
}

const QUICK_EMOJIS = ['❤️', '😂', '🔥', '👍', '👏', '🚀', '💡', '💯', '🥳', '☕'];

const EMOJI_CATEGORIES = [
  {
    name: 'Smileys',
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
      '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😋', '😛', '😜',
      '🤪', '😎', '🤓', '🥳', '🤠', '🥺', '😴', '🤯', '🤫', '🤗'
    ],
  },
  {
    name: 'Gestures',
    emojis: [
      '👍', '👎', '👏', '🙌', '👐', '🤲', '🤝', '🤜', '🤛', '✊',
      '👊', '✌️', '🤞', '🤟', '🤘', '👌', '🤌', '🤙', '👋', '🙏'
    ],
  },
  {
    name: 'Tech & Study',
    emojis: [
      '💻', '🖥️', '📱', '📚', '📖', '📝', '✏️', '💡', '🧠', '⚡',
      '🚀', '🎯', '🏆', '🎓', '🔬', '🔭', '📐', '📊', '📈', '💾'
    ],
  },
  {
    name: 'Fun & Life',
    emojis: [
      '☕', '🍕', '🍔', '🍿', '🎸', '🎨', '⚽', '🏀', '🎮', '🎧',
      '🎬', '📸', '⏰', '📅', '📌', '🔑', '💎', '❤️', '💖', '✨'
    ],
  },
];

export const ChatModule: React.FC<ChatModuleProps> = ({
  request,
  messages,
  currentUserId,
  onSendMessage,
  onStartVideoCall,
  onClose,
}) => {
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const peerName = request.fromUserId === currentUserId ? request.toUserName : request.fromUserName;
  const peerAvatar = request.fromUserId === currentUserId ? request.toUserAvatar : request.fromUserAvatar;

  // Auto scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
    setShowEmojiPicker(false);
  };

  const handleAddEmoji = (emoji: string) => {
    setInputText((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  const handleQuickSendEmoji = (emoji: string) => {
    onSendMessage(emoji);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Instagram / WhatsApp-Style Header */}
        <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={peerAvatar}
                alt={peerName}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover ring-1 ring-white/30"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-900" />
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-sm font-bold text-white">{peerName}</h3>
                <span className="text-[9px] font-bold bg-sky-900/90 text-sky-200 px-1.5 py-0.2 rounded">
                  MITS Gwalior
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Swapping: {request.skillOffered} ⇄ {request.skillWanted}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={onStartVideoCall}
              className="p-2 text-slate-200 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
              title="Launch 1-on-1 Jitsi Video Session"
            >
              <Video className="w-5 h-5 text-emerald-400" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
              title="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Body */}
        <div className="flex-1 bg-[#efeae2]/40 p-4 overflow-y-auto space-y-3">
          {/* Security & Campus Notification Banner */}
          <div className="flex justify-center">
            <div className="bg-amber-50/90 border border-amber-200/80 rounded-lg px-3 py-1 text-[11px] text-amber-800 font-medium text-center shadow-2xs max-w-sm">
              🔒 Peer-to-peer encrypted session between MITS students.
            </div>
          </div>

          {messages.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Say hello! Tap emojis below, coordinate your skill barter session, or tap the video camera above for your live session.
            </div>
          ) : (
            messages.map((msg) => {
              const isSender = msg.isMe;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isSender ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[78%] px-3.5 py-2 rounded-2xl shadow-xs text-xs relative ${
                      isSender
                        ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-none'
                        : 'bg-white text-slate-900 rounded-tl-none border border-slate-200/70'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <div className="flex items-center justify-end space-x-1 mt-1 text-[9px] text-slate-500">
                      <span>{msg.timestamp}</span>
                      {isSender && <CheckCheck className="w-3 h-3 text-sky-600" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 1-Tap Quick Emoji Bar (Instagram DM style) */}
        <div className="bg-slate-50 border-t border-slate-200/80 px-3 py-1.5 flex items-center justify-between overflow-x-auto gap-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider shrink-0 mr-1">
            Quick:
          </span>
          <div className="flex items-center space-x-1">
            {QUICK_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleAddEmoji(emoji)}
                className="text-base hover:scale-125 active:scale-95 transition-transform p-1 rounded-md hover:bg-slate-200/70 cursor-pointer"
                title={`Add ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Expanded Categorized Emoji Drawer */}
        {showEmojiPicker && (
          <div className="bg-white border-t border-slate-200 flex flex-col max-h-48 animate-in slide-in-from-bottom-2 duration-150 shadow-inner">
            {/* Category Tabs */}
            <div className="flex border-b border-slate-100 bg-slate-50 text-[11px] font-semibold">
              {EMOJI_CATEGORIES.map((cat, idx) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setActiveCategory(idx)}
                  className={`flex-1 py-1.5 px-2 text-center transition-colors cursor-pointer ${
                    activeCategory === idx
                      ? 'text-sky-600 font-bold border-b-2 border-sky-600 bg-white'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Emoji Grid */}
            <div className="p-2.5 grid grid-cols-10 gap-1 overflow-y-auto max-h-36">
              {EMOJI_CATEGORIES[activeCategory].emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleAddEmoji(emoji)}
                  className="text-lg hover:bg-slate-100 hover:scale-110 rounded p-1 transition-all flex items-center justify-center cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Input Bar */}
        <form
          onSubmit={handleSend}
          className="bg-white px-3 py-2 border-t border-slate-200 flex items-center space-x-2"
        >
          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              showEmojiPicker ? 'text-sky-600 bg-sky-50' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Browse all emojis"
          >
            <Smile className="w-5 h-5" />
          </button>

          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message or tap emojis..."
            className="flex-1 px-4 py-2 bg-slate-100 rounded-full text-xs text-slate-900 outline-none border border-transparent focus:border-sky-500 focus:bg-white transition-all shadow-2xs"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              inputText.trim()
                ? 'bg-sky-600 text-white shadow-xs hover:bg-sky-700'
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
