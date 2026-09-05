import React from 'react';
import { UserProfile } from '../types';
import { ALL_MITS_BRANCHES } from '../data/mitsBranches';
import { X, Users, CheckCircle2, UserPlus } from 'lucide-react';

interface SwitchPeerModalProps {
  currentUserId: string;
  allPeers: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  onAddNewAccount: () => void;
  onClose: () => void;
}

export const SwitchPeerModal: React.FC<SwitchPeerModalProps> = ({
  currentUserId,
  allPeers,
  onSelectUser,
  onAddNewAccount,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Switch MITS Peer Account
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 overflow-y-auto space-y-2 flex-1">
          <p className="text-xs text-slate-500 mb-3">
            Select an authenticated MITS Gwalior student account to test two-way barter flows, chat, and live video sessions:
          </p>

          {allPeers.map((peer) => {
            const isCurrent = peer.id === currentUserId;
            return (
              <button
                key={peer.id}
                type="button"
                onClick={() => {
                  onSelectUser(peer);
                  onClose();
                }}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  isCurrent
                    ? 'bg-sky-50 border-sky-300 ring-2 ring-sky-500/20'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={peer.avatar}
                      alt={peer.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {peer.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 fill-sky-500" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{peer.name}</h4>
                    <p className="text-[10px] text-slate-500">
                      {ALL_MITS_BRANCHES.find((b) => b.value === peer.department)?.code || peer.department} • {peer.year}
                    </p>
                    <div className="flex gap-1 mt-0.5">
                      {peer.skillsOffered.slice(0, 2).map((s) => (
                        <span key={s} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {peer.credits} Credits
                  </span>
                  {isCurrent && (
                    <span className="block text-[10px] font-bold text-sky-600 mt-1">Active</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              onClose();
              onAddNewAccount();
            }}
            className="w-full py-2.5 px-4 rounded-xl border border-dashed border-slate-300 hover:border-sky-500 hover:bg-white text-slate-700 hover:text-sky-600 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Another Student (Twilio / Email)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
