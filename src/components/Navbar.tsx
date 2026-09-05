import React from 'react';
import { UserProfile } from '../types';
import { SkillSwapLogo } from './SkillSwapLogo';
import {
  CheckCircle2,
  Coins,
  Clock,
  BookOpen,
  Star,
  Bell,
  LogOut,
  Edit3,
  Users
} from 'lucide-react';

interface NavbarProps {
  currentUser: UserProfile;
  pendingRequestsCount: number;
  onOpenRequests: () => void;
  onOpenEditProfile: () => void;
  onSwitchPeer: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  pendingRequestsCount,
  onOpenRequests,
  onOpenEditProfile,
  onSwitchPeer,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20">
          {/* Left: SkillSwap Brand & Campus Dedication */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <div className="flex items-center cursor-pointer">
              <SkillSwapLogo size="sm" showText={true} />
            </div>
            <div className="hidden md:block h-7 w-[1px] bg-slate-200" />
            <div className="hidden md:flex flex-col">
              <span className="text-[11px] font-bold text-slate-800 tracking-wide">
                MITS Gwalior
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Campus Skill Exchange Network
              </span>
            </div>
          </div>

          {/* Right: User Profile Stats & Action Bar */}
          <div className="flex items-center space-x-1.5 sm:space-x-4">
            {/* Wallet Credit Indicator */}
            <div className="flex items-center space-x-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 shadow-2xs">
              <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-400 shrink-0" />
              <div className="flex items-baseline space-x-1">
                <span className="text-xs sm:text-sm font-extrabold font-mono text-amber-900">
                  {currentUser.credits}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-amber-700 hidden sm:inline">
                  Credits
                </span>
              </div>
            </div>

            {/* Teaching & Learning Counters (Desktop/Tablet) */}
            <div className="hidden lg:flex items-center space-x-3 px-3 py-1 bg-slate-50 border border-slate-200/80 rounded-xl text-xs">
              {/* Hours Taught */}
              <div className="flex items-center space-x-1.5" title="Total hours taught to peers">
                <Clock className="w-3.5 h-3.5 text-sky-600" />
                <span className="font-bold text-slate-800">{currentUser.hoursTaught}h</span>
                <span className="text-[10px] text-slate-400">Taught</span>
              </div>

              <div className="h-4 w-[1px] bg-slate-200" />

              {/* Hours Learned */}
              <div className="flex items-center space-x-1.5" title="Total hours learned from peers">
                <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                <span className="font-bold text-slate-800">{currentUser.hoursLearned}h</span>
                <span className="text-[10px] text-slate-400">Learned</span>
              </div>

              <div className="h-4 w-[1px] bg-slate-200" />

              {/* Total Reviews */}
              <div className="flex items-center space-x-1" title="Reviews received">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="font-bold text-slate-800">{currentUser.totalReviews}</span>
                <span className="text-[10px] text-slate-400">Reviews</span>
              </div>
            </div>

            {/* Swap Request Notifications Bell */}
            <button
              type="button"
              onClick={onOpenRequests}
              className="relative p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              title="Skill Swap Requests"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {pendingRequestsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {pendingRequestsCount}
                </span>
              )}
            </button>

            {/* User Profile Avatar with Blue Verified Peer Badge */}
            <div className="flex items-center space-x-1.5 pl-0.5 sm:pl-2">
              <div
                onClick={onOpenEditProfile}
                className="relative cursor-pointer group"
                title="Click to edit profile photo & skills"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-sky-500/30 group-hover:ring-sky-500 transition-all"
                />
                {/* Blue Verified Peer Check Badge */}
                {currentUser.verified && (
                  <div
                    className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-2xs"
                    title="Verified MITS/Campus Peer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 fill-sky-500" />
                  </div>
                )}
              </div>

              <div className="hidden xl:flex flex-col">
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-bold text-slate-900 leading-tight">
                    {currentUser.name}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-[9px] font-semibold text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded-full border border-sky-100">
                    MITS Student
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Edit Profile, Switch Peer, Logout */}
            <div className="flex items-center space-x-0.5 sm:space-x-1 border-l border-slate-200 pl-1 sm:pl-2">
              <button
                type="button"
                onClick={onOpenEditProfile}
                className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Edit My Profile & Photo"
              >
                <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <button
                type="button"
                onClick={onSwitchPeer}
                className="p-1.5 sm:p-2 text-slate-500 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                title="Switch / Add Student Account"
              >
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Stats Ribbon (Under header on mobile screens) */}
        <div className="lg:hidden flex items-center justify-around py-1.5 border-t border-slate-100 text-[10px] sm:text-[11px] font-medium text-slate-600">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3 text-sky-600" />
            <span>{currentUser.hoursTaught}h Taught</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-200" />
          <div className="flex items-center space-x-1">
            <BookOpen className="w-3 h-3 text-teal-600" />
            <span>{currentUser.hoursLearned}h Learned</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-200" />
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>{currentUser.totalReviews} Reviews</span>
          </div>
        </div>
      </div>
    </header>
  );
};
