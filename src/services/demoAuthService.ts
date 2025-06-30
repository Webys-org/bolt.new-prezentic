// Demo authentication service - no database required
export interface DemoUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  createdAt: string;
}

export interface DemoAuthResponse {
  user: DemoUser | null;
  error: string | null;
}

// Demo users storage (in real app this would be a database)
const DEMO_USERS_KEY = 'demo-users';
const CURRENT_USER_KEY = 'current-user';

class DemoAuthService {
  private getDemoUsers(): DemoUser[] {
    try {
      const users = localStorage.getItem(DEMO_USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  }

  private saveDemoUsers(users: DemoUser[]): void {
    localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  async signUp(username: string, email: string, password: string, fullName: string): Promise<DemoAuthResponse> {
    try {
      // Validate input
      if (username.length < 3 || username.length > 50) {
        return { user: null, error: 'Username must be between 3 and 50 characters' };
      }

      if (password.length < 6) {
        return { user: null, error: 'Password must be at least 6 characters long' };
      }

      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(email)) {
        return { user: null, error: 'Invalid email format' };
      }

      const users = this.getDemoUsers();

      // Check if user already exists
      const existingUser = users.find(u => u.username === username || u.email === email);
      if (existingUser) {
        if (existingUser.username === username) {
          return { user: null, error: 'Username already exists' };
        }
        return { user: null, error: 'Email already exists' };
      }

      // Create new user
      const newUser: DemoUser = {
        id: this.generateId(),
        username,
        email,
        fullName,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      this.saveDemoUsers(users);

      // Set as current user
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

      console.log('✅ Demo sign up successful for:', username);
      return { user: newUser, error: null };

    } catch (error) {
      console.error('Demo sign up error:', error);
      return { user: null, error: 'Failed to create account' };
    }
  }

  async signIn(usernameOrEmail: string, password: string): Promise<DemoAuthResponse> {
    try {
      const users = this.getDemoUsers();

      // Find user by username or email
      const user = users.find(u => 
        u.username === usernameOrEmail || u.email === usernameOrEmail
      );

      if (!user) {
        return { user: null, error: 'Invalid login credentials' };
      }

      // In demo mode, any password works for existing users
      // In real app, you'd verify the password hash

      // Set as current user
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

      console.log('✅ Demo sign in successful for:', user.username);
      return { user, error: null };

    } catch (error) {
      console.error('Demo sign in error:', error);
      return { user: null, error: 'Invalid login credentials' };
    }
  }

  async signOut(): Promise<void> {
    localStorage.removeItem(CURRENT_USER_KEY);
    console.log('✅ Demo sign out successful');
  }

  getCurrentUser(): DemoUser | null {
    try {
      const userStr = localStorage.getItem(CURRENT_USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  // Mock auth state change listener
  onAuthStateChange(callback: (user: DemoUser | null) => void) {
    // In demo mode, we'll just call the callback with current user
    const currentUser = this.getCurrentUser();
    callback(currentUser);

    // Return a mock subscription object
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            console.log('Demo auth listener unsubscribed');
          }
        }
      }
    };
  }
}

export const demoAuthService = new DemoAuthService();