import React, { useState } from 'react';
import { SwapRequest } from '../types';
import {
  X,
  ArrowRightLeft,
  Check,
  MessageCircle,
  Video,
  Clock,
  CheckCircle2,
  Trash2,
  Inbox,
  Send,
  Users
} from 'lucide-react';

interface SwapRequestsDrawerProps {
  requests: SwapRequest[];
  currentUserId: string;
  onAcceptRequest: (requestId: string) => void;
  onDeclineRequest: (requestId: string) => void;
  onOpenChat: (request: SwapRequest) => void;
  onStartVideo: (request: SwapRequest) => void;
  onClose: () => void;
}

export const SwapRequestsDrawer: React.FC<SwapRequestsDrawerProps> = ({
  requests,
  currentUserId,
  onAcceptRequest,
  onDeclineRequest,
  onOpenChat,
  onStartVideo,
  onClose,
}) => {
  // Filter into Instagram-style categories
  const incomingRequests = requests.filter(
    (r) => r.toUserId === currentUserId && r.status === 'pending'
  );
  const sentRequests = requests.filter(
    (r) => r.fromUserId === currentUserId && r.status === 'pending'
  );
  const connectedRequests = requests.filter(
    (r) =>
      (r.toUserId === currentUserId || r.fromUserId === currentUserId) &&
      r.status === 'accepted'
  );

  // Default to incoming if any, else connected, else sent
  const [activeTab, setActiveTab] = useState<'incoming' | 'sent' | 'connected'>(
    incomingRequests.length > 0 ? 'incoming' : sentRequests.length > 0 ? 'sent' : 'connected'
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Instagram-Style Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Skill Swap Requests
            </h3>
            {incomingRequests.length > 0 && (
              <span className="text-xs font-bold text-white bg-rose-500 px-2 py-0.5 rounded-full">
                {incomingRequests.length}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instagram-Style Tab Bar */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 text-xs font-semibold px-2 pt-1">
          <button
            type="button"
            onClick={() => setActiveTab('incoming')}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center space-x-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'incoming'
                ? 'border-sky-600 text-sky-600 font-bold bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Requests</span>
            {incomingRequests.length > 0 && (
              <span className="text-[10px] bg-sky-100 text-sky-700 font-bold px-1.5 py-0.2 rounded-full">
                {incomingRequests.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sent')}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center space-x-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'sent'
                ? 'border-sky-600 text-sky-600 font-bold bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Sent ({sentRequests.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('connected')}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center space-x-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'connected'
                ? 'border-sky-600 text-sky-600 font-bold bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Connected ({connectedRequests.length})</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* 1. INCOMING REQUESTS (Instagram Follow Request Layout) */}
          {activeTab === 'incoming' && (
            <div>
              {incomingRequests.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs flex flex-col items-center">
                  <Inbox className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="font-semibold text-slate-600">No pending swap requests</p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                    When another MITS student sends you a swap request, it will appear right here with Confirm and Delete buttons.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                    Pending Follow / Swap Requests
                  </div>
                  {incomingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-2.5 transition-all hover:border-slate-300"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={req.fromUserAvatar}
                          alt={req.fromUserName}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-1.5">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {req.fromUserName}
                            </h4>
                            <span className="text-[9px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded shrink-0">
                              MITS
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">
                            Wants to swap: <span className="font-semibold text-sky-600">{req.skillOffered}</span> for your <span className="font-semibold text-teal-600">{req.skillWanted}</span>
                          </p>
                          <span className="text-[10px] text-slate-400">{req.createdAt}</span>
                        </div>
                      </div>

                      {/* Instagram-Style Confirm & Delete Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => onAcceptRequest(req.id)}
                          className="py-1.5 px-3 rounded-lg bg-sky-600 hover:bg-sky-700 active:scale-95 text-white text-xs font-bold flex items-center justify-center space-x-1 shadow-2xs transition-all cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Confirm</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeclineRequest(req.id)}
                          className="py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-semibold flex items-center justify-center space-x-1 transition-all cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. SENT REQUESTS (Instagram Requested state) */}
          {activeTab === 'sent' && (
            <div>
              {sentRequests.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs flex flex-col items-center">
                  <Send className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="font-semibold text-slate-600">No sent requests</p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                    Browse the MITS student feed and tap "Request Swap" to barter skills with peers.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                    Awaiting Peer Confirmation
                  </div>
                  {sentRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-2"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={req.toUserAvatar}
                          alt={req.toUserName}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {req.toUserName}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate">
                            Offering: <span className="font-semibold text-sky-600">{req.skillOffered}</span> ⇄ Want: <span className="font-semibold text-teal-600">{req.skillWanted}</span>
                          </p>
                          <span className="text-[10px] text-slate-400">{req.createdAt}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 pt-1">
                        <div className="flex-1 py-1.5 px-3 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center space-x-1.5 select-none">
                          <Clock className="w-3.5 h-3.5 text-slate-500 animate-spin-slow" />
                          <span>Requested</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onDeclineRequest(req.id)}
                          className="py-1.5 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-medium transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. CONNECTED SWAPPERS (Chat & Video Call Unlocked) */}
          {activeTab === 'connected' && (
            <div>
              {connectedRequests.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs flex flex-col items-center">
                  <Users className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="font-semibold text-slate-600">No active connections yet</p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                    Once a swap request is confirmed, your 1-on-1 Chat and Video sessions will be unlocked here!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                    Connected Peers ({connectedRequests.length})
                  </div>
                  {connectedRequests.map((req) => {
                    const peerName = req.fromUserId === currentUserId ? req.toUserName : req.fromUserName;
                    const peerAvatar = req.fromUserId === currentUserId ? req.toUserAvatar : req.fromUserAvatar;

                    return (
                      <div
                        key={req.id}
                        className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-2.5"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <img
                              src={peerAvatar}
                              alt={peerName}
                              referrerPolicy="no-referrer"
                              className="w-11 h-11 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                            />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-1.5">
                              <h4 className="text-xs font-bold text-slate-900 truncate">
                                {peerName}
                              </h4>
                              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded shrink-0">
                                Connected
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate">
                              Barter: <span className="font-semibold text-sky-600">{req.skillOffered}</span> ⇄ <span className="font-semibold text-teal-600">{req.skillWanted}</span>
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenChat(req);
                            }}
                            className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Chat</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onStartVideo(req);
                            }}
                            className="py-1.5 px-3 rounded-lg bg-sky-600 hover:bg-sky-700 active:scale-95 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Video Call</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
