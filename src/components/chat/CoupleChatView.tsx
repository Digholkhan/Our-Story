import React, { useState, useEffect, useRef } from 'react';
import { Send, Heart, Image as ImageIcon, Smile, Trash2, CheckCheck, Sparkles, MessageCircle } from 'lucide-react';
import { ChatMessage, SessionState, CoupleProfile } from '../../types';

interface CoupleChatViewProps {
  messages: ChatMessage[];
  session: SessionState;
  profile: CoupleProfile;
  onSendMessage: (msg: ChatMessage) => void;
  onDeleteMessage: (id: string) => void;
  onAddReaction: (msgId: string, emoji: string) => void;
}

export const CoupleChatView: React.FC<CoupleChatViewProps> = ({
  messages,
  session,
  profile,
  onSendMessage,
  onDeleteMessage,
  onAddReaction,
}) => {
  const [inputText, setInputText] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [showPhotoInput, setShowPhotoInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeName = session.activePartner === 'partner1' ? profile.partner1Name : profile.partner2Name;
  const otherName = session.activePartner === 'partner1' ? profile.partner2Name : profile.partner1Name;

  const quickStickers = [
    'I love you ❤️',
    'Thinking of you right now ✨',
    'Can’t wait for our date tonight! 🌹',
    'You are my whole world 💍',
    'Miss your smile 😘',
    'Cooking something delicious for us 🍝',
  ];

  const emojis = ['❤️', '🌹', '✨', '🥰', '💍', '💌'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !photoUrl.trim()) return;

    const newMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender: session.activePartner,
      text: inputText.trim(),
      photoUrl: photoUrl.trim() || undefined,
      timestamp: new Date().toISOString(),
    };

    onSendMessage(newMsg);
    setInputText('');
    setPhotoUrl('');
    setShowPhotoInput(false);
  };

  const handleSendSticker = (stickerText: string) => {
    const newMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender: session.activePartner,
      text: stickerText,
      timestamp: new Date().toISOString(),
    };
    onSendMessage(newMsg);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 relative z-10">
      {/* Chat Header */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-stone-200/80 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-rose-400">
              <img
                src={session.activePartner === 'partner1' ? profile.partner2Avatar : profile.partner1Avatar}
                alt={otherName}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-800">
              {otherName} & {activeName} 💬
            </h2>
            <p className="text-xs text-stone-500 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-rose-400" />
              <span>Private Couple Whispers • Only for each other</span>
            </p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800">
            Sending as {activeName}
          </span>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="glass-card rounded-3xl p-4 sm:p-6 border border-stone-200/80 min-h-[460px] max-h-[560px] overflow-y-auto flex flex-col space-y-4">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3 text-stone-400">
            <MessageCircle className="w-12 h-12 text-rose-300 animate-pulse" />
            <h4 className="font-serif text-lg font-bold text-stone-700">No messages yet</h4>
            <p className="text-xs max-w-sm">
              Send your very first secret note or sweet reminder to {otherName}!
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender === session.activePartner;
            const senderAvatar = msg.sender === 'partner1' ? profile.partner1Avatar : profile.partner2Avatar;
            const senderName = msg.sender === 'partner1' ? profile.partner1Name : profile.partner2Name;

            const timeStr = new Date(msg.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={msg.id}
                className={`flex gap-3 group items-end ${isMe ? 'flex-row-reverse self-end' : 'self-start'}`}
              >
                <img
                  src={senderAvatar}
                  alt={senderName}
                  className="w-8 h-8 rounded-full object-cover border border-stone-200 shrink-0 mb-1"
                />

                <div className={`max-w-xs sm:max-w-md space-y-1.5 ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-[11px] text-stone-500 font-medium">
                      {isMe ? 'You' : senderName}
                    </span>
                    <span className="text-[10px] text-stone-400">{timeStr}</span>
                  </div>

                  <div
                    className={`p-3.5 sm:p-4 rounded-2xl text-sm leading-relaxed shadow-sm relative ${
                      isMe
                        ? 'bg-rose-700 text-white rounded-br-none'
                        : 'bg-stone-100 text-stone-800 rounded-bl-none border border-stone-200'
                    }`}
                  >
                    {msg.text && <p className="font-sans whitespace-pre-wrap">{msg.text}</p>}

                    {msg.photoUrl && (
                      <div className="rounded-xl overflow-hidden mt-2 max-h-52 border border-white/20">
                        <img src={msg.photoUrl} alt="Attached" className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* Emoji Reaction Tag */}
                    {msg.reaction && (
                      <span className="absolute -bottom-2.5 right-2 px-2 py-0.5 bg-white border border-stone-200 text-xs rounded-full shadow-sm">
                        {msg.reaction}
                      </span>
                    )}
                  </div>

                  {/* Reaction Pill Controls on Hover */}
                  <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${isMe ? 'justify-end' : 'justify-start'}`}>
                    {emojis.map((em) => (
                      <button
                        key={em}
                        onClick={() => onAddReaction(msg.id, em)}
                        className="text-xs p-1 hover:scale-125 transition-transform"
                        title={`React ${em}`}
                      >
                        {em}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        if (confirm('Delete this message?')) onDeleteMessage(msg.id);
                      }}
                      className="p-1 text-stone-400 hover:text-rose-600 transition-colors ml-1"
                      title="Delete message"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Love Stickers */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-semibold text-rose-800 shrink-0">Quick Whispers:</span>
        {quickStickers.map((s) => (
          <button
            key={s}
            onClick={() => handleSendSticker(s)}
            className="px-3 py-1.5 rounded-full bg-white border border-rose-200/80 hover:border-rose-400 text-xs text-stone-700 hover:text-rose-700 whitespace-nowrap shadow-xs transition-all active:scale-95"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="glass-panel p-3 sm:p-4 rounded-3xl border border-stone-200/80 space-y-3">
        {showPhotoInput && (
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Paste photo URL to attach..."
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl bg-white border border-stone-200 text-xs outline-none focus:border-rose-400 text-stone-800"
            />
            <button
              onClick={() => setShowPhotoInput(false)}
              className="px-3 py-2 rounded-xl bg-stone-100 text-stone-500 text-xs"
            >
              Cancel
            </button>
          </div>
        )}

        <form onSubmit={handleSend} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPhotoInput(!showPhotoInput)}
            className="p-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
            title="Attach photo URL"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          <input
            type="text"
            placeholder={`Message ${otherName}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-3 rounded-2xl bg-white border border-stone-200 focus:border-rose-400 text-sm outline-none text-stone-800 placeholder-stone-400"
          />

          <button
            type="submit"
            className="p-3 rounded-2xl bg-rose-700 hover:bg-rose-800 text-white shadow-md active:scale-95 transition-all flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
