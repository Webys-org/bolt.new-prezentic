import React, { useState } from 'react';
import { Mail, Lock, User, Sparkles, Eye, EyeOff, ArrowLeft, UserCheck } from 'lucide-react';
import { useDemoAuth } from '../../hooks/useDemoAuth';

interface AuthPageProps {
  onAuthSuccess: () => void;
  onBackToLanding: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess, onBackToLanding }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    usernameOrEmail: '' // For sign in
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn, signUp, isLoading } = useDemoAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  const validateForm = () => {
    if (isSignUp) {
      if (!formData.username.trim()) {
        setError('Username is required');
        return false;
      }
      if (formData.username.trim().length < 3 || formData.username.trim().length > 50) {
        setError('Username must be between 3 and 50 characters');
        return false;
      }
      if (!formData.email.trim()) {
        setError('Email is required');
        return false;
      }
      if (!formData.fullName.trim()) {
        setError('Full name is required');
        return false;
      }
      if (formData.password.trim().length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }
    } else {
      if (!formData.usernameOrEmail.trim()) {
        setError('Username or email is required');
        return false;
      }
      if (!formData.password.trim()) {
        setError('Password is required');
        return false;
      }
    }
    return true;
  };

  const getErrorMessage = (errorMessage: string) => {
    // Handle specific authentication errors with helpful guidance
    if (errorMessage.toLowerCase().includes('invalid login credentials') || 
        errorMessage.toLowerCase().includes('invalid credentials')) {
      return `Invalid login credentials. Please check your username/email and password. If you don't have an account, please sign up using the link below.`;
    }
    
    if (errorMessage.toLowerCase().includes('user not found')) {
      return `Account not found. Please check your username/email or create a new account by signing up.`;
    }
    
    if (errorMessage.toLowerCase().includes('username already exists')) {
      return `This username is already taken. Please choose a different username or sign in if you already have an account.`;
    }
    
    if (errorMessage.toLowerCase().includes('email already exists')) {
      return `An account with this email already exists. Please sign in instead or use a different email address.`;
    }
    
    // Return the original error message if no specific handling is needed
    return errorMessage;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      if (isSignUp) {
        // Trim all fields before passing to signUp
        await signUp(
          formData.username.trim(), 
          formData.email.trim(), 
          formData.password.trim(), 
          formData.fullName.trim()
        );
        console.log('✅ Demo sign up successful, redirecting to dashboard...');
      } else {
        // Trim fields before passing to signIn
        await signIn(
          formData.usernameOrEmail.trim(), 
          formData.password.trim()
        );
        console.log('✅ Demo sign in successful, redirecting to dashboard...');
      }
      
      // Small delay to ensure state is updated
      setTimeout(() => {
        onAuthSuccess();
      }, 100);
    } catch (err) {
      console.error('Demo authentication error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(getErrorMessage(errorMessage));
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setFormData({
      username: '',
      email: '',
      password: '',
      fullName: '',
      usernameOrEmail: ''
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-teal-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Back to Landing Button */}
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-1 md:gap-2 text-gray-600 hover:text-gray-800 mb-3 md:mb-6 transition-colors p-2 rounded-lg hover:bg-white/20 backdrop-blur-sm text-xs md:text-sm"
          >
            <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" />
            <span className="font-medium">Back to Home</span>
          </button>

          {/* Auth Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl md:rounded-3xl shadow-2xl p-4 md:p-8">
            {/* Header */}
            <div className="text-center mb-4 md:mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-full mb-3 md:mb-4 shadow-lg">
                <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">
                Prezentic
              </h1>
              <p className="text-xs md:text-base text-gray-600">
                {isSignUp ? 'Create your demo account to get started' : 'Welcome back! Please sign in to your demo account'}
              </p>
              <div className="mt-3 md:mt-4 p-2 md:p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs md:text-sm">
                <p className="text-blue-800">
                  <strong>Demo Mode:</strong> This is a demonstration version. Your data is stored locally in your browser.
                </p>
              </div>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-6">
              {/* Sign Up Fields */}
              {isSignUp && (
                <>
                  {/* Username Field */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 text-xs md:text-sm bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-500"
                        placeholder="Choose a username"
                        required={isSignUp}
                      />
                    </div>
                  </div>

                  {/* Full Name Field */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 text-xs md:text-sm bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-500"
                        placeholder="Enter your full name"
                        required={isSignUp}
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 text-xs md:text-sm bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-500"
                        placeholder="Enter your email"
                        required={isSignUp}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Sign In Field */}
              {!isSignUp && (
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Username or Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.usernameOrEmail}
                      onChange={(e) => handleInputChange('usernameOrEmail', e.target.value)}
                      className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 text-xs md:text-sm bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-500"
                      placeholder="Enter username or email"
                      required={!isSignUp}
                    />
                  </div>
                </div>
              )}

              {/* Password Field */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full pl-9 md:pl-10 pr-10 md:pr-12 py-2 md:py-3 text-xs md:text-sm bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-500"
                    placeholder={isSignUp ? "Create a password (min 6 characters)" : "Enter your password (any password works in demo)"}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 md:h-5 md:w-5" /> : <Eye className="h-4 w-4 md:h-5 md:w-5" />}
                  </button>
                </div>
                {!isSignUp && (
                  <p className="text-[10px] md:text-xs text-gray-500 mt-1">
                    Demo mode: Any password works for existing accounts
                  </p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-lg md:rounded-xl p-3 md:p-4">
                  <p className="text-red-800 text-xs md:text-sm leading-relaxed">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white py-2 md:py-3 rounded-lg md:rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:via-purple-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none text-xs md:text-base"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white"></div>
                    <span>{isSignUp ? 'Creating Demo Account...' : 'Signing In...'}</span>
                  </div>
                ) : (
                  <span>{isSignUp ? 'Create Demo Account' : 'Sign In'}</span>
                )}
              </button>
            </form>

            {/* Toggle Sign Up/Sign In */}
            <div className="mt-4 md:mt-6 text-center">
              <p className="text-xs md:text-sm text-gray-600">
                {isSignUp ? 'Already have a demo account?' : "Don't have a demo account?"}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="ml-1 md:ml-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors text-xs md:text-sm"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-4 md:mt-8 grid grid-cols-3 gap-2 md:gap-4 max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-lg md:rounded-xl p-2 md:p-4 border border-white/20 hover:bg-white/20 transition-all">
              <div className="text-base md:text-2xl font-bold text-blue-600 mb-0 md:mb-1">AI</div>
              <div className="text-[10px] md:text-xs text-gray-600">Generated Content</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg md:rounded-xl p-2 md:p-4 border border-white/20 hover:bg-white/20 transition-all">
              <div className="text-base md:text-2xl font-bold text-purple-600 mb-0 md:mb-1">Voice</div>
              <div className="text-[10px] md:text-xs text-gray-600">Narration</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg md:rounded-xl p-2 md:p-4 border border-white/20 hover:bg-white/20 transition-all">
              <div className="text-base md:text-2xl font-bold text-teal-600 mb-0 md:mb-1">Demo</div>
              <div className="text-[10px] md:text-xs text-gray-600">Mode</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};