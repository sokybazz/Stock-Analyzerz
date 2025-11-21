
import React, { useState } from 'react';
import { User } from '../types';
import { Smartphone, Mail, ArrowRight, Loader2, CheckCircle2, ShieldCheck, TrendingUp } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [authMethod, setAuthMethod] = useState<'selection' | 'phone' | 'otp'>('selection');
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  // Mock Google Login
  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const mockUser: User = {
        id: 'g_123',
        name: 'Demo User',
        email: 'demo@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=22c55e&color=fff',
        provider: 'google'
      };
      onLogin(mockUser);
    }, 1500);
  };

  // Phone Logic
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!phoneNumber.match(/^[6-9]\d{9}$/)) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuthMethod('otp');
    }, 1500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 4) {
      setError('Please enter the 4-digit OTP');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const mockUser: User = {
        id: 'p_123',
        name: 'Mobile User',
        phone: `+91 ${phoneNumber}`,
        avatar: 'https://ui-avatars.com/api/?name=Mobile+User&background=6366f1&color=fff',
        provider: 'phone'
      };
      onLogin(mockUser);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 p-4 relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-brand-600/20 rounded-2xl mb-4 backdrop-blur-sm border border-brand-500/20">
            <TrendingUp className="w-10 h-10 text-brand-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">IndiEquity AI</h1>
          <p className="text-slate-400">Premium Stock Market Predictions</p>
        </div>

        {/* Auth Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 shadow-2xl">
          
          {authMethod === 'selection' && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-semibold text-white mb-6 text-center">Sign in to continue</h2>
              
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-white hover:bg-gray-100 text-slate-900 font-bold transition-all duration-300 group"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-600/50"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-transparent px-2 text-slate-500 font-medium backdrop-blur-sm">Or</span>
                </div>
              </div>

              <button
                onClick={() => setAuthMethod('phone')}
                className="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-white font-semibold transition-all duration-300 hover:border-brand-500/50 group"
              >
                <Smartphone className="w-5 h-5 text-brand-400 group-hover:text-brand-300" />
                Continue with Mobile
              </button>
              
              <p className="text-xs text-center text-slate-500 mt-4">
                By continuing, you agree to our Terms & Privacy Policy.
              </p>
            </div>
          )}

          {authMethod === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                 <h2 className="text-xl font-semibold text-white">Mobile Number</h2>
                 <button type="button" onClick={() => setAuthMethod('selection')} className="text-xs text-brand-400 hover:text-brand-300">Back</button>
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-medium">+91</span>
                </div>
                <input
                  type="tel"
                  placeholder="98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full bg-slate-900/50 border border-slate-600 text-white text-lg rounded-xl py-3 pl-14 pr-4 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                  autoFocus
                />
              </div>

              {error && <p className="text-red-400 text-sm flex items-center gap-1"><ShieldCheck size={14}/> {error}</p>}

              <button
                type="submit"
                disabled={isLoading || phoneNumber.length < 10}
                className="w-full p-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-lg shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <>Get OTP <ArrowRight size={18} /></>}
              </button>
            </form>
          )}

          {authMethod === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                 <h2 className="text-xl font-semibold text-white">Verify OTP</h2>
                 <button type="button" onClick={() => setAuthMethod('phone')} className="text-xs text-brand-400 hover:text-brand-300">Change Number</button>
              </div>

              <div className="text-center mb-2">
                <p className="text-sm text-slate-400">Enter code sent to +91 {phoneNumber}</p>
              </div>

              <div className="flex justify-center gap-3">
                <input
                  type="text"
                  maxLength={4}
                  placeholder="••••"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="w-32 text-center bg-slate-900/50 border border-slate-600 text-white text-3xl tracking-[1em] rounded-xl py-3 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                  autoFocus
                />
              </div>

              {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              
              <div className="text-center">
                <p className="text-xs text-slate-500">Demo OTP: Any 4 digits (e.g. 1234)</p>
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length < 4}
                className="w-full p-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-lg shadow-brand-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <>Verify & Login <CheckCircle2 size={18} /></>}
              </button>
            </form>
          )}

        </div>
        
        <p className="text-center text-slate-600 text-sm mt-8">
          &copy; 2025 IndiEquity AI. Secure Access.
        </p>
      </div>
    </div>
  );
};
