import { useState, useEffect } from 'react';
import { demoAuthService, DemoUser } from '../services/demoAuthService';

export interface DemoAuthState {
  user: DemoUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useDemoAuth = () => {
  const [authState, setAuthState] = useState<DemoAuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Check for existing user on mount
    const currentUser = demoAuthService.getCurrentUser();
    setAuthState({
      user: currentUser,
      isAuthenticated: !!currentUser,
      isLoading: false
    });

    // Set up auth state listener (demo version)
    const { data: { subscription } } = demoAuthService.onAuthStateChange((user) => {
      console.log('Demo auth state changed:', user ? 'User signed in' : 'User signed out');
      setAuthState({
        user,
        isAuthenticated: !!user,
        isLoading: false
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (usernameOrEmail: string, password: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { user, error } = await demoAuthService.signIn(usernameOrEmail, password);
      
      if (error) {
        throw new Error(error);
      }

      if (user) {
        console.log('✅ Demo sign in successful:', user.username);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
        
        // Reload the page after successful sign in
        window.location.reload();
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signUp = async (username: string, email: string, password: string, fullName: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { user, error } = await demoAuthService.signUp(username, email, password, fullName);
      
      if (error) {
        throw new Error(error);
      }

      if (user) {
        console.log('✅ Demo sign up successful:', user.username);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
        
        // Reload the page after successful sign up
        window.location.reload();
      } else {
        throw new Error('Failed to create account');
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signOut = async () => {
    console.log('🚪 Signing out demo user...');
    try {
      await demoAuthService.signOut();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
      console.log('✅ Demo sign out successful');
      
      // Reload the page after sign out
      window.location.reload();
    } catch (error) {
      console.error('❌ Demo sign out error:', error);
      // Force sign out even if there's an error
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
      
      // Still reload the page even if there was an error
      window.location.reload();
    }
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut
  };
};