import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, ArrowRightLeft, Sparkles, Check } from 'lucide-react';

interface InitiateSwapModalProps {
  peer: UserProfile;
  currentUser: UserProfile;
  onConfirm: (skillOffered: string, skillWanted: string) => void;
  onClose: () => void;
}

export const InitiateSwapModal: React.FC<InitiateSwapModalProps> = ({
  peer,
  currentUser,
  onConfirm,
  onClose,
}) => {
  const [selectedOffer, setSelectedOffer] = useState(currentUser.skillsOffered[0] || 'Python');
  const [selectedWant, setSelectedWant] = useState(peer.skillsOffered[0] || 'React');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(selectedOffer, selectedWant);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-2">
            <ArrowRightLeft className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Initiate Skill Barter
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

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-sky-50/60 border border-sky-100">
            <img
              src={peer.avatar}
              alt={peer.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h4 className="text-xs font-bold text-slate-900">{peer.name}</h4>
              <p className="text-[11px] text-slate-500">
                MITS Gwalior • {peer.department}
              </p>
            </div>
          </div>

          {/* You Will Teach */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              1. Which skill will you teach {peer.name}?
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {currentUser.skillsOffered.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => setSelectedOffer(skill)}
                  className={`p-2 rounded-lg text-xs font-semibold text-left border transition-all ${
                    selectedOffer === skill
                      ? 'bg-sky-50 border-sky-500 text-sky-900 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{skill}</span>
                    {selectedOffer === skill && <Check className="w-3.5 h-3.5 text-sky-600" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* You Will Learn */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              2. Which skill do you want to learn from {peer.name}?
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {peer.skillsOffered.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => setSelectedWant(skill)}
                  className={`p-2 rounded-lg text-xs font-semibold text-left border transition-all ${
                    selectedWant === skill
                      ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{skill}</span>
                    {selectedWant === skill && <Check className="w-3.5 h-3.5 text-teal-600" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-500">
            Once sent, the request remains in <strong className="text-slate-700">Pending Confirmation</strong> status until accepted by the peer.
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all"
          >
            Send Skill Swap Request
          </button>
        </form>
      </div>
    </div>
  );
};
