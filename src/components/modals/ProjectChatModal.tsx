import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageSquare, Building2, User, Bell, CheckCheck } from 'lucide-react';
import { Project, ChatMessage } from '../../types';

interface ProjectChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  currentUser: { name: string; role: string };
  onNewMessageNotify?: (msg: ChatMessage) => void;
}

export const ProjectChatModal: React.FC<ProjectChatModalProps> = ({
  isOpen,
  onClose,
  project,
  currentUser,
  onNewMessageNotify
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && project) {
      fetchMessages();
    }
  }, [isOpen, project]);

  const fetchMessages = async () => {
    if (!project) return;
    try {
      const res = await fetch(`/api/chat-messages?projectId=${project.id}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
        scrollToBottom();
      }
    } catch (err) {
      console.error('Error fetching chat messages:', err);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !project) return;

    setLoading(true);
    try {
      const res = await fetch('/api/chat-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          senderName: currentUser.name,
          senderRole: currentUser.role,
          message: inputMessage.trim()
        })
      });

      if (res.ok) {
        const newMsg = await res.json();
        setMessages(prev => [...prev, newMsg]);
        setInputMessage('');
        scrollToBottom();
        if (onNewMessageNotify) {
          onNewMessageNotify(newMsg);
        }
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl h-[85vh] shadow-2xl border border-slate-200 overflow-hidden text-right flex flex-col">
        {/* Header */}
        <div className="px-6 py-3.5 bg-gradient-to-r from-[#17457e] to-[#1e589f] text-white flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div>
              <div className="text-[11px] text-blue-200 font-mono">{project.code}</div>
              <h2 className="text-sm sm:text-base font-bold">غرفة الدردشة الهندسية: {project.name}</h2>
            </div>
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-blue-200" />
            </div>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8fbff]">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
              <MessageSquare className="w-10 h-10 text-slate-300 mb-2" />
              <p>لا توجد رسائل سابقة في هذا المشروع. ابدأ المحادثة الآن!</p>
            </div>
          ) : (
            messages.map(msg => {
              const isMe = msg.senderName === currentUser.name;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-start' : 'items-end'} space-y-1`}
                >
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold px-1">
                    <span className="font-mono text-[10px] text-slate-400">{msg.timestamp}</span>
                    <span>•</span>
                    <span className="text-blue-700">{msg.senderRole}</span>
                    <span>{msg.senderName}</span>
                  </div>

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-xs leading-relaxed ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Form */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1 disabled:opacity-50 shrink-0"
          >
            <span>إرسال</span>
            <Send className="w-3.5 h-3.5" />
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            placeholder="اكتب رسالتك للمهندسين وفريق الموقع..."
            className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </form>
      </div>
    </div>
  );
};
