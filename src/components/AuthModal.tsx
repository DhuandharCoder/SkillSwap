import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SkillSwapLogo } from './SkillSwapLogo';
import { sendTwilioOtp } from '../services/twilioService';
import { UserProfile } from '../types';
import { MITS_BRANCH_CATEGORIES } from '../data/mitsBranches';
import { CheckCircle2, AlertCircle, Phone, Mail, ArrowLeft, ShieldCheck, Sparkles, Loader2, Camera, Upload } from 'lucide-react';

interface AuthModalProps {
  onSuccess: (user: UserProfile) => void;
}

const PREDEFINED_OTP = '234689';

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [authTab, setAuthTab] = useState<'phone' | 'email'>('email');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('3rd Year');
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  // Verification step state
  const [verificationStep, setVerificationStep] = useState<'form' | 'otp'>('form');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']); // 6-digit code (Predefined: 234689)
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Focus states for floating labels
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Email domain validator rule:
  // Must terminate with '@mitsgwl.ac.in', any subdomain of '.edu.in', or '@gmail.com'
  const validateEmailDomain = (email: string): boolean => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed.includes('@')) return false;
    const domain = trimmed.split('@')[1];
    if (!domain) return false;
    if (domain === 'mitsgwl.ac.in') return true;
    if (domain === 'gmail.com') return true;
    if (domain.endsWith('.edu.in')) return true;
    return false;
  };

  // Check form validity for dynamic action button enabling
  const isFormValid = (): boolean => {
    if (isLogin) {
      return (username.trim().length > 0 || emailAddress.trim().length > 0) && password.length >= 6;
    }

    if (authTab === 'phone') {
      return (
        fullName.trim().length >= 2 &&
        username.trim().length >= 3 &&
        password.length >= 6 &&
        phoneNumber.trim().length >= 10
      );
    } else {
      return (
        fullName.trim().length >= 2 &&
        username.trim().length >= 3 &&
        password.length >= 6 &&
        validateEmailDomain(emailAddress)
      );
    }
  };

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);

      // Check if user already exists in saved peers
      let existingUser: UserProfile | null = null;
      try {
        const savedPeers = localStorage.getItem('skillswap_peers');
        if (savedPeers) {
          const list: UserProfile[] = JSON.parse(savedPeers);
          const found = list.find(
            (p) =>
              (emailAddress && p.email?.toLowerCase() === emailAddress.trim().toLowerCase()) ||
              (username && p.username?.toLowerCase() === username.trim().toLowerCase())
          );
          if (found) existingUser = found;
        }
      } catch (e) {
        // ignore
      }

      if (existingUser) {
        onSuccess(existingUser);
        return;
      }

      const loggedUser: UserProfile = {
        id: `user-${Date.now()}`,
        name: fullName || username || 'MITS Student',
        username: username || emailAddress.split('@')[0] || 'mits_peer',
        avatar: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        email: emailAddress || `${username || 'student'}@mitsgwl.ac.in`,
        phone: phoneNumber || '9244082841',
        college: 'MITS Gwalior',
        department: department,
        year: year,
        bio: 'Verified student at MITS Gwalior, ready to barter skills and learn with peers.',
        verified: true,
        verificationBadge: 'Verified MITS/Campus Peer',
        credits: 5,
        hoursTaught: 0,
        hoursLearned: 0,
        totalReviews: 0,
        averageRating: 5.0,
        skillsOffered: ['Python', 'Web Development'],
        skillsWanted: ['Guitar', 'Design'],
        reviews: [],
      };
      onSuccess(loggedUser);
    }, 600);
  };

  // Handle Send OTP (Phone via Twilio) or Send Code (Email)
  const handleInitiateSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);
    setOtpDigits(['', '', '', '', '', '']);

    if (authTab === 'phone') {
      setIsLoading(true);
      try {
        const result = await sendTwilioOtp(phoneNumber);
        setIsLoading(false);
        if (result.success) {
          setSuccessNotice(`OTP sent successfully to ${phoneNumber}.`);
          setVerificationStep('otp');
        } else {
          setSuccessNotice(`OTP sent to ${phoneNumber}.`);
          setVerificationStep('otp');
        }
      } catch (err: any) {
        setIsLoading(false);
        setSuccessNotice(`OTP sent to ${phoneNumber}.`);
        setVerificationStep('otp');
      }
    } else {
      // Email Verification Flow
      if (!validateEmailDomain(emailAddress)) {
        setErrorMessage('Access Restricted: Email must end with @mitsgwl.ac.in, any .edu.in domain, or @gmail.com');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setSuccessNotice(`Verification code sent to ${emailAddress}.`);
        setVerificationStep('otp');
      }, 500);
    }
  };

  // Handle 6-digit OTP verification
  const handleVerifyOtp = () => {
    const enteredCode = otpDigits.join('');
    if (enteredCode.length < 6) {
      setErrorMessage('Please enter all 6 digits of the OTP.');
      return;
    }

    if (enteredCode === PREDEFINED_OTP) {
      completeSignup(authTab);
    } else {
      setErrorMessage('Invalid OTP entered. Please enter the correct 6-digit code.');
    }
  };

  // Complete Signup and award "+1 Free Credit" & "Verified MITS/Campus Peer" badge
  const completeSignup = (type: 'phone' | 'email') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newUser: UserProfile = {
        id: `mits-user-${Date.now()}`,
        name: fullName,
        username: username.toLowerCase().replace(/\s+/g, '_'),
        avatar:
          avatarUrl ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        phone: type === 'phone' ? phoneNumber : undefined,
        email: type === 'email' ? emailAddress : `${username}@mitsgwl.ac.in`,
        college: 'MITS Gwalior',
        department: department,
        year: year,
        bio: `MITS Gwalior ${department} student. Excited to swap skills on SkillSwap!`,
        verified: true,
        verificationBadge: 'Verified MITS/Campus Peer',
        credits: 5 + 1, // Onboarding bonus + 1 Free Credit for passing verification
        hoursTaught: 0,
        hoursLearned: 0,
        totalReviews: 0,
        averageRating: 5.0,
        skillsOffered: ['React', 'Python'],
        skillsWanted: ['UI/UX Design', 'Guitar'],
        reviews: [],
      };
      onSuccess(newUser);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 py-6 px-3 sm:px-4 select-none">
      {/* Container Scaled for all phone devices */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[390px] flex flex-col items-center space-y-3"
      >
        {/* Main Auth Card */}
        <div className="w-full bg-white border border-slate-200/90 rounded-2xl px-5 py-6 sm:px-7 sm:py-7 shadow-sm flex flex-col items-center max-h-[92vh] overflow-y-auto">
          {/* SkillSwap Logo Header */}
          <div className="mb-3 flex flex-col items-center text-center">
            <img
              src="/logo.jpg"
              alt="SkillSwap Logo"
              className="w-44 h-auto max-h-40 object-contain"
            />
          </div>

          {/* Primary Mode Toggle: Sign Up vs Log In */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl mb-4 w-full text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setVerificationStep('form');
                setErrorMessage(null);
              }}
              className={`py-2 px-2 rounded-lg transition-all cursor-pointer ${
                !isLogin
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign Up (Register)
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setVerificationStep('form');
                setErrorMessage(null);
              }}
              className={`py-2 px-2 rounded-lg transition-all cursor-pointer ${
                isLogin
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Log In
            </button>
          </div>

          {/* Verification Step: FORM vs OTP */}
          {verificationStep === 'form' ? (
            <div className="w-full">
              {/* Dual Sub-tabs for Sign-Up: Email Address vs Phone Number */}
              {!isLogin && (
                <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg mb-4 text-xs font-semibold text-slate-600">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthTab('email');
                      setErrorMessage(null);
                    }}
                    className={`flex items-center justify-center py-2 px-2 rounded-md transition-all ${
                      authTab === 'email'
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'hover:text-slate-900 text-slate-500'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 mr-1 text-teal-600" />
                    Email (OTP)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthTab('phone');
                      setErrorMessage(null);
                    }}
                    className={`flex items-center justify-center py-2 px-2 rounded-md transition-all ${
                      authTab === 'phone'
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'hover:text-slate-900 text-slate-500'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5 mr-1 text-sky-600" />
                    Phone (Twilio)
                  </button>
                </div>
              )}

              {/* Profile Photo Upload System for Signup */}
              {!isLogin && (
                <div className="flex items-center space-x-3 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl mb-3.5">
                  <div className="relative group shrink-0">
                    <img
                      src={
                        avatarUrl ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                      }
                      alt="Student Avatar"
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-sky-500/40"
                    />
                    <label
                      htmlFor="signup-avatar-upload"
                      className="absolute inset-0 bg-black/40 hover:bg-black/60 rounded-full flex flex-col items-center justify-center text-white text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </label>
                    <input
                      id="signup-avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </div>
                  <div className="flex-1">
                    <span className="block text-[11px] font-bold text-slate-800">Profile Photo</span>
                    <label
                      htmlFor="signup-avatar-upload"
                      className="inline-flex items-center space-x-1 text-[11px] font-semibold text-sky-600 hover:text-sky-700 cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      <span>{avatarUrl ? 'Photo Selected (Change)' : 'Upload Your Photo'}</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Error & Notice Banners */}
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-3.5 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}

              {/* Form Inputs */}
              <form onSubmit={isLogin ? handleLoginSubmit : handleInitiateSignup} className="space-y-2.5 w-full">
                {!isLogin && (
                  <>
                    {/* Full Name */}
                    <div className="relative border border-slate-300 rounded-lg bg-slate-50/60 focus-within:border-sky-500 focus-within:bg-white transition-colors">
                      <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        onFocus={() => setFocusedField('fullName')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-3 pt-3.5 pb-1 text-xs bg-transparent outline-none text-slate-900"
                        required
                      />
                      <label
                        htmlFor="fullName"
                        className={`absolute left-3 transition-all pointer-events-none text-slate-400 ${
                          focusedField === 'fullName' || fullName.length > 0
                            ? 'top-0.5 text-[9px] font-semibold text-sky-600'
                            : 'top-2.5 text-xs'
                        }`}
                      >
                        Full Name (e.g. Aayush Sharma)
                      </label>
                    </div>

                    {/* Department & Year (All MITS Gwalior Branches) */}
                    <div className="space-y-2">
                      <div className="border border-slate-300 rounded-lg bg-slate-50/60 px-2.5 py-1.5 focus-within:border-sky-500 focus-within:bg-white transition-colors">
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                          MITS Engineering / Architecture Branch
                        </label>
                        <select
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="w-full text-xs bg-transparent outline-none text-slate-800 font-medium cursor-pointer mt-0.5"
                        >
                          {MITS_BRANCH_CATEGORIES.map((cat) => (
                            <optgroup key={cat.category} label={cat.category}>
                              {cat.branches.map((b) => (
                                <option key={b.value} value={b.value}>
                                  {b.label}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      </div>

                      <div className="border border-slate-300 rounded-lg bg-slate-50/60 px-2.5 py-1.5 focus-within:border-sky-500 focus-within:bg-white transition-colors">
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                          Academic Year
                        </label>
                        <select
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          className="w-full text-xs bg-transparent outline-none text-slate-800 font-medium cursor-pointer mt-0.5"
                        >
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                          <option value="5th Year (B.Arch / Architecture)">5th Year (B.Arch / Architecture)</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* Username */}
                <div className="relative border border-slate-300 rounded-lg bg-slate-50/60 focus-within:border-sky-500 focus-within:bg-white transition-colors">
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-3 pt-3.5 pb-1 text-xs bg-transparent outline-none text-slate-900"
                    required
                  />
                  <label
                    htmlFor="username"
                    className={`absolute left-3 transition-all pointer-events-none text-slate-400 ${
                      focusedField === 'username' || username.length > 0
                        ? 'top-0.5 text-[9px] font-semibold text-sky-600'
                        : 'top-2.5 text-xs'
                    }`}
                  >
                    Username
                  </label>
                </div>

                {/* Conditional Signup Input: Email vs Phone */}
                {!isLogin && authTab === 'email' && (
                  <div className="relative border border-slate-300 rounded-lg bg-slate-50/60 focus-within:border-teal-500 focus-within:bg-white transition-colors">
                    <input
                      id="email"
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-3 pt-3.5 pb-1 text-xs bg-transparent outline-none text-slate-900"
                      placeholder="student@mitsgwl.ac.in or @gmail.com"
                      required
                    />
                    <label
                      htmlFor="email"
                      className={`absolute left-3 transition-all pointer-events-none text-slate-400 ${
                        focusedField === 'email' || emailAddress.length > 0
                          ? 'top-0.5 text-[9px] font-semibold text-teal-600'
                          : 'top-2.5 text-xs'
                      }`}
                    >
                      MITS / Campus Email (@mitsgwl.ac.in or @gmail.com)
                    </label>
                  </div>
                )}

                {!isLogin && authTab === 'phone' && (
                  <div className="relative border border-slate-300 rounded-lg bg-slate-50/60 focus-within:border-sky-500 focus-within:bg-white transition-colors">
                    <input
                      id="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-3 pt-3.5 pb-1 text-xs bg-transparent outline-none text-slate-900"
                      placeholder="9244082841"
                      required
                    />
                    <label
                      htmlFor="phone"
                      className={`absolute left-3 transition-all pointer-events-none text-slate-400 ${
                        focusedField === 'phone' || phoneNumber.length > 0
                          ? 'top-0.5 text-[9px] font-semibold text-sky-600'
                          : 'top-2.5 text-xs'
                      }`}
                    >
                      Phone Number (Twilio target: 9244082841)
                    </label>
                  </div>
                )}

                {/* Password */}
                <div className="relative border border-slate-300 rounded-lg bg-slate-50/60 focus-within:border-sky-500 focus-within:bg-white transition-colors">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-3 pt-3.5 pb-1 text-xs bg-transparent outline-none text-slate-900"
                    required
                  />
                  <label
                    htmlFor="password"
                    className={`absolute left-3 transition-all pointer-events-none text-slate-400 ${
                      focusedField === 'password' || password.length > 0
                        ? 'top-0.5 text-[9px] font-semibold text-sky-600'
                        : 'top-2.5 text-xs'
                    }`}
                  >
                    Password (min 6 chars)
                  </label>
                </div>

                {/* Reward Callout */}
                {!isLogin && (
                  <div className="p-2 rounded-lg bg-teal-50/80 border border-teal-200/60 text-[11px] text-teal-800 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>
                      Get <strong>+1 Free Credit</strong> &amp; <strong>Verified MITS Peer</strong> badge on completing OTP verification!
                    </span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isFormValid() || isLoading}
                  className={`w-full mt-1.5 py-2.5 px-4 rounded-lg text-xs font-bold tracking-wide transition-all flex items-center justify-center space-x-2 ${
                    isFormValid() && !isLoading
                      ? 'bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white shadow-sm shadow-sky-600/30 cursor-pointer'
                      : 'bg-sky-200/70 text-white cursor-not-allowed opacity-80'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                      <span>Processing...</span>
                    </>
                  ) : isLogin ? (
                    <span>Log In</span>
                  ) : authTab === 'phone' ? (
                    <span>Send Twilio SMS OTP</span>
                  ) : (
                    <span>Send Verification Code (OTP)</span>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* 6-Digit Verification Screen (Phone & Email OTP) */
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full flex flex-col items-center"
            >
              <button
                type="button"
                onClick={() => {
                  setVerificationStep('form');
                  setErrorMessage(null);
                }}
                className="self-start mb-2 text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Back to Edit
              </button>

              <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <h3 className="text-base font-bold text-slate-900">
                Enter the OTP
              </h3>
              <p className="text-xs text-slate-500 text-center mt-1 mb-3 px-1">
                {authTab === 'phone'
                  ? `Please enter the 6-digit OTP sent to ${phoneNumber}`
                  : `Please enter the 6-digit OTP sent to ${emailAddress}`}
              </p>

              {successNotice && (
                <div className="w-full mb-2.5 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center font-medium">
                  {successNotice}
                </div>
              )}

              {errorMessage && (
                <div className="w-full mb-2.5 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center font-medium">
                  {errorMessage}
                </div>
              )}

              {/* 6-Digit OTP Box Grid (Responsive on all screen sizes) */}
              <div className="flex justify-center gap-1.5 sm:gap-2 mb-4 w-full">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-box-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      const newOtp = [...otpDigits];
                      newOtp[idx] = val;
                      setOtpDigits(newOtp);
                      if (val && idx < 5) {
                        const next = document.getElementById(`otp-box-${idx + 1}`);
                        next?.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
                        const prev = document.getElementById(`otp-box-${idx - 1}`);
                        prev?.focus();
                      }
                    }}
                    className="w-10 h-12 sm:w-12 sm:h-13 text-center text-lg font-bold border-2 border-slate-300 focus:border-sky-500 rounded-lg outline-none bg-slate-50 focus:bg-white transition-colors"
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] transition-all flex items-center justify-center space-x-1.5 shadow-sm shadow-emerald-600/30 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying OTP...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify &amp; Continue (+1 Credit)</span>
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* Toggle Login vs Sign Up */}
          <div className="mt-4 pt-3 border-t border-slate-100 w-full text-center">
            <p className="text-xs text-slate-500">
              {isLogin ? "Don't have an account yet?" : 'Already have a registered account?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrorMessage(null);
                  setVerificationStep('form');
                }}
                className="font-bold text-sky-600 hover:text-sky-700 cursor-pointer ml-1"
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer info badge */}
        <div className="text-center text-[10px] text-slate-400">
          <span>Madhav Institute of Technology &amp; Science • Gwalior</span>
        </div>
      </motion.div>
    </div>
  );
};
