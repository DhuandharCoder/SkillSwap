import React, { useState } from 'react';
import { UserProfile, SwapRequest } from '../types';
import {
  Star,
  AlertTriangle,
  Coins,
  CheckCircle2,
  Sparkles,
  Award
} from 'lucide-react';

interface PostSessionFeedbackModalProps {
  request: SwapRequest;
  currentUser: UserProfile;
  onSubmitReview: (rating: number, comment: string) => void;
  onClose: () => void;
}

export const PostSessionFeedbackModal: React.FC<PostSessionFeedbackModalProps> = ({
  request,
  currentUser,
  onSubmitReview,
  onClose,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSubmitReview(
          rating,
          comment || `Great skill swap session learning ${request.skillWanted}!`
        );
      }, 1200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 text-white flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mb-2">
            <Award className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-base font-bold">Post-Session Feedback Modal</h3>
          <p className="text-xs text-white/85 mt-0.5">
            Evaluate teaching quality with {request.toUserName}
          </p>
        </div>

        {isSuccess ? (
          /* Reward Claimed State */
          <div className="p-7 flex flex-col items-center text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Feedback Recorded!</h4>
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
              <Coins className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>+1 Credit Added to Your Wallet Balance</span>
            </div>
            <p className="text-xs text-slate-500">
              Your review has been permanently linked to {request.toUserName}'s MITS peer profile.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Prominent System Warning Label Required by Prompt */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/90 text-amber-900 text-xs flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Academic Barter Policy:</span>
                <span className="text-[11px] leading-tight">
                  Minimum 3.5/5 rating required. Unreliable sessions forfeit credits.
                </span>
              </div>
            </div>

            {/* 5-Star Teaching Quality Rating Asset */}
            <div className="flex flex-col items-center justify-center pt-2">
              <span className="text-xs font-bold text-slate-700 mb-2">
                Teaching Quality Assessment
              </span>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const activeStar = (hoverRating ?? rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          activeStar
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-semibold text-slate-500 mt-1">
                {rating === 5
                  ? '5.0 - Exceptional Peer Instruction'
                  : rating === 4
                  ? '4.0 - Very Good & Helpful'
                  : rating === 3
                  ? '3.0 - Met Expectations'
                  : `${rating}.0 - Needs Improvement`}
              </span>
            </div>

            {/* Comment Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Feedback (Logged on Peer Profile)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was their explanation? Did they cover the concepts thoroughly?"
                rows={3}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-sky-500 resize-none text-slate-800"
              />
            </div>

            {/* Reward Note */}
            <div className="flex items-center space-x-2 text-[11px] text-teal-700 bg-teal-50 px-3 py-2 rounded-lg border border-teal-200">
              <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
              <span>
                Submitting this verified review returns <strong>+1 Credit</strong> to your wallet balance.
              </span>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <Coins className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Submit Feedback &amp; Claim +1 Credit</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
