import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
  isLoading: boolean;
  user: any | null;
  role: string | null;
  getToken: () => string | null;
  getRole: () => string | null;
}

interface AuthState {
  isAuthenticated: boolean;
  role: string | null;
  user: any | null;
}

const initializeAuthState = (): AuthState => {
  const token = localStorage.getItem('accessToken');
  const savedRole = localStorage.getItem('role');
  return {
    isAuthenticated: !!token,
    role: savedRole,
    user: null
  };
};

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initializeAuthState());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const validateAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const storedRole = localStorage.getItem('role');

      if (token && storedRole) {
        try {
          // You can add token validation logic here if needed
          setAuthState(prev => ({
            ...prev,
            isAuthenticated: true,
            role: storedRole
          }));
        } catch (error) {
          console.error('Auth validation error:', error);
          // Clear everything if validation fails
          logout();
        }
      }
    };

    validateAuth();
  }, []);

  const login = async (email: string, password: string): Promise<string | null> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('accessToken', data.data.access);
        localStorage.setItem('refreshToken', data.data.refresh);
        localStorage.setItem('role', data.data.role);
        
        setAuthState({
          isAuthenticated: true,
          user: data.data,
          role: data.data.role
        });
        
        return data.data.role;
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    
    setAuthState({
      isAuthenticated: false,
      user: null,
      role: null
    });
  };

  const getToken = () => {
    return localStorage.getItem('accessToken');
  };

  const getRole = () => {
    return localStorage.getItem('role');
  };

  const value: AuthContextType = {
    isAuthenticated: authState.isAuthenticated,
    login,
    logout,
    isLoading,
    user: authState.user,
    role: authState.role,
    getToken,
    getRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};