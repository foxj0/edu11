import { User } from '../types';

// Mock users for testing
const mockUsers = [
  {
    email: 'user@example.com',
    password: 'password123',
    userData: {
      id: '1',
      email: 'user@example.com',
      role: 'user',
      name: 'Test User'
    }
  },
  {
    email: 'admin@example.com',
    password: 'admin123',
    userData: {
      id: '2',
      email: 'admin@example.com',
      role: 'admin',
      name: 'Test Admin'
    }
  }
];

export const mockAuth = {
  signInWithPassword: async ({ email, password }: { email: string; password: string }): Promise<{ data: { user: User | null }, error: Error | null }> => {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      return {
        data: { user: user.userData },
        error: null
      };
    }

    return {
      data: { user: null },
      error: new Error('Invalid email or password')
    };
  }
};
