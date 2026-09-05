import React, { useState } from 'react';
import { UserProfile, PeerReview } from '../types';
import { X, Star, CheckCircle2, Shield, MessageSquare, Plus, Send } from 'lucide-react';

interface ReviewsModalProps {
  peer: UserProfile;
  currentUser?: UserProfile | null;
  onClose: () => void;
  onInitiateSwap: (peer: UserProfile) => void;
  onAddReview?: (peerId: string, review: { rating: number; comment: string; skillLearned: string }) => void;
}

export const ReviewsModal: React.FC<ReviewsModalProps> = ({
  peer,
  currentUser,
  onClose,
  onInitiateSwap,
  onAddReview,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [skillLearned, setSkillLearned] = useState(peer.skillsOffered[0] || 'Peer Mentoring');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !onAddReview) return;
    setIsSubmitting(true);
    onAddReview(peer.id, {
      rating,
      comment: comment.trim(),
      skillLearned,
    });
    setIsSubmitting(false);
    setShowAddForm(false);
    setComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={peer.avatar}
                alt={peer.name}
                referrerPolicy="no-referrer"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-sky-500/20"
              />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-sky-500 fill-sky-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">{peer.name}</h3>
                <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
                  MITS Gwalior
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                {peer.department} • {peer.year}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Teaching Quality & Stats Summary */}
        <div className="grid grid-cols-3 gap-2 px-4 sm:px-5 py-3 bg-slate-50 border-b border-slate-100 text-center">
          <div>
            <div className="flex items-center justify-center space-x-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-sm sm:text-base font-bold text-slate-900">{peer.averageRating.toFixed(1)}</span>
            </div>
            <span className="text-[10px] text-slate-500">Average Rating</span>
          </div>

          <div className="border-x border-slate-200">
            <span className="text-sm sm:text-base font-bold text-slate-900">{peer.hoursTaught}h</span>
            <p className="text-[10px] text-slate-500">Hours Taught</p>
          </div>

          <div>
            <span className="text-sm sm:text-base font-bold text-slate-900">{peer.reviews.length}</span>
            <p className="text-[10px] text-slate-500">Peer Reviews</p>
          </div>
        </div>

        {/* Reviews List & Write Review Button */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center">
              <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-sky-600" />
              Student Reviews &amp; Feedback
            </h4>
            {currentUser && currentUser.id !== peer.id && onAddReview && (
              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center space-x-1 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>{showAddForm ? 'Cancel' : 'Write Review'}</span>
              </button>
            )}
          </div>

          {/* Write Review Form */}
          {showAddForm && (
            <form onSubmit={handleSubmitReview} className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">Your Rating:</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-0.5 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Skill Learned / Subject:
                </label>
                <input
                  type="text"
                  value={skillLearned}
                  onChange={(e) => setSkillLearned(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500"
                  placeholder="e.g. React, Python, UI/UX"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Your Review / Experience:
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={2}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500 text-slate-800"
                  placeholder="Write an authentic review of this peer mentor's session..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !comment.trim()}
                className="w-full py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish Peer Review</span>
              </button>
            </form>
          )}

          {peer.reviews.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 p-6">
              No reviews recorded yet for {peer.name}. Be the first student to learn from them and leave a review!
            </div>
          ) : (
            peer.reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <img
                      src={rev.reviewerAvatar}
                      alt={rev.reviewerName}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">{rev.reviewerName}</h5>
                      <span className="text-[10px] text-slate-400 font-medium">Learned: {rev.skillLearned}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-amber-900">{rev.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{rev.comment}"
                </p>

                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center">
                    <Shield className="w-3 h-3 mr-1 text-teal-600" />
                    Verified MITS Jitsi Session
                  </span>
                  <span>{rev.date}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Action */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-100 flex items-center justify-between">
          <div className="text-[11px] sm:text-xs text-slate-500 truncate max-w-[220px]">
            Wants: <span className="font-semibold text-slate-800">{peer.skillsWanted.join(', ')}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onInitiateSwap(peer);
            }}
            className="px-3 sm:px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 active:scale-95 text-white text-xs font-bold shadow-sm transition-all whitespace-nowrap cursor-pointer"
          >
            Initiate Swap
          </button>
        </div>
      </div>
    </div>
  );
};
