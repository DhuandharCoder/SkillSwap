import React from 'react';
import { UserProfile, SwapRequest } from '../types';
import { ALL_MITS_BRANCHES } from '../data/mitsBranches';
import {
  CheckCircle2,
  Star,
  Clock,
  MessageSquare,
  ArrowRightLeft,
  Sparkles,
  Lock,
  MessageCircle,
  Video,
  Check,
  X
} from 'lucide-react';

interface PeerCardProps {
  peer: UserProfile;
  currentUserId: string;
  activeRequest?: SwapRequest;
  onViewReviews: (peer: UserProfile) => void;
  onInitiateSwap: (peer: UserProfile) => void;
  onOpenChat: (request: SwapRequest) => void;
  onStartVideo: (request: SwapRequest) => void;
  onAcceptRequest?: (requestId: string) => void;
  onDeclineRequest?: (requestId: string) => void;
}

export const PeerCard: React.FC<PeerCardProps> = ({
  peer,
  currentUserId,
  activeRequest,
  onViewReviews,
  onInitiateSwap,
  onOpenChat,
  onStartVideo,
  onAcceptRequest,
  onDeclineRequest,
}) => {
  const isPending = activeRequest?.status === 'pending';
  const isAccepted = activeRequest?.status === 'accepted';
  const isSentByMe = activeRequest?.fromUserId === currentUserId;
  const isReceivedByMe = activeRequest?.toUserId === currentUserId;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      {/* Card Header: Avatar, Name, MITS Gwalior Badge */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div
              onClick={() => onViewReviews(peer)}
              className="relative cursor-pointer"
              title="Click to view peer reviews & teaching history"
            >
              <img
                src={peer.avatar}
                alt={peer.name}
                referrerPolicy="no-referrer"
                className="w-13 h-13 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-sky-500/40 transition-all"
              />
              {peer.verified && (
                <div
                  className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-xs"
                  title="Verified MITS/Campus Peer"
                >
                  <CheckCircle2 className="w-4 h-4 text-sky-500 fill-sky-500" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <h3
                  onClick={() => onViewReviews(peer)}
                  className="text-sm sm:text-base font-bold text-slate-900 hover:text-sky-600 transition-colors cursor-pointer"
                >
                  {peer.name}
                </h3>
              </div>

              {/* Strictly Locked to "MITS Gwalior" */}
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                  MITS Gwalior
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {ALL_MITS_BRANCHES.find((b) => b.value === peer.department)?.code || peer.department} • {peer.year}
                </span>
              </div>
            </div>
          </div>

          {/* Rating Badge */}
          <button
            type="button"
            onClick={() => onViewReviews(peer)}
            className="flex items-center space-x-1 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-lg border border-amber-200 transition-colors cursor-pointer"
            title="Inspect peer feedback reviews"
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-amber-900 font-mono">
              {peer.averageRating.toFixed(1)}
            </span>
          </button>
        </div>

        {/* Peer Bio */}
        <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
          {peer.bio}
        </p>

        {/* Aggregate Peer Performance Metrics */}
        <div className="grid grid-cols-3 gap-2 mt-4 py-2 px-3 bg-slate-50/80 rounded-xl border border-slate-100 text-center">
          <div>
            <span className="text-xs font-bold text-slate-800 font-mono">{peer.hoursTaught}</span>
            <p className="text-[10px] text-slate-400 font-medium">Hours Taught</p>
          </div>
          <div className="border-x border-slate-200">
            <span className="text-xs font-bold text-slate-800 font-mono">{peer.hoursLearned}</span>
            <p className="text-[10px] text-slate-400 font-medium">Hours Learned</p>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 font-mono">{peer.reviews.length}</span>
            <p className="text-[10px] text-slate-400 font-medium">Reviews Logged</p>
          </div>
        </div>

        {/* Skills Offered Matrix */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Can Teach
            </span>
            <span className="text-[10px] text-sky-600 font-semibold">Skill Offered</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {peer.skillsOffered.map((skill) => (
              <span
                key={skill}
                className="text-[11px] font-semibold text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200/80"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Skills Wanted Matrix */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Wants To Learn
            </span>
            <span className="text-[10px] text-teal-600 font-semibold">Skill Wanted</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {peer.skillsWanted.map((skill) => (
              <span
                key={skill}
                className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/80"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Action Footer with Lifecycle State Control */}
      <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex flex-col space-y-2">
        {/* Pre-Swap Inspection Link */}
        <div className="flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => onViewReviews(peer)}
            className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 mr-1 text-slate-400" />
            Inspect Teaching Reviews ({peer.reviews.length})
          </button>
        </div>

        {/* Dynamic Action State (Instagram Follow Request Style) */}
        {isAccepted && activeRequest ? (
          /* Connected & Unlocked: Chat & Video Session Available */
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80">
              <span className="font-semibold flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Connected Swapper
              </span>
              <span className="text-[10px] text-emerald-600">
                {activeRequest.skillOffered} ⇄ {activeRequest.skillWanted}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onOpenChat(activeRequest)}
                className="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>

              <button
                type="button"
                onClick={() => onStartVideo(activeRequest)}
                className="py-2 px-3 rounded-lg bg-sky-600 hover:bg-sky-700 active:scale-95 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video Call</span>
              </button>
            </div>
          </div>
        ) : isPending && isReceivedByMe && activeRequest ? (
          /* Incoming Request: Instagram-style "Confirm" and "Delete" */
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] text-sky-800 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200/80 font-medium">
              Requested to swap: <span className="font-bold">{activeRequest.skillOffered}</span> for your <span className="font-bold">{activeRequest.skillWanted}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onAcceptRequest?.(activeRequest.id)}
                className="py-2 px-3 rounded-lg bg-sky-600 hover:bg-sky-700 active:scale-95 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm</span>
              </button>

              <button
                type="button"
                onClick={() => onDeclineRequest?.(activeRequest.id)}
                className="py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 text-xs font-semibold flex items-center justify-center space-x-1 transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ) : isPending && isSentByMe && activeRequest ? (
          /* Sent Request: Instagram-style "Requested" state with Cancel option */
          <div className="flex items-center space-x-2 pt-1">
            <div className="flex-1 py-2 px-3 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center space-x-1.5 select-none">
              <Clock className="w-3.5 h-3.5 text-slate-500 animate-spin-slow" />
              <span>Requested</span>
            </div>
            <button
              type="button"
              onClick={() => onDeclineRequest?.(activeRequest.id)}
              className="py-2 px-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-medium transition-colors cursor-pointer"
              title="Cancel Swap Request"
            >
              Cancel
            </button>
          </div>
        ) : (
          /* Initial State: Instagram-style "Request Swap" */
          <button
            type="button"
            onClick={() => onInitiateSwap(peer)}
            className="w-full py-2.5 px-4 rounded-lg bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Request Swap</span>
          </button>
        )}
      </div>
    </div>
  );
};
