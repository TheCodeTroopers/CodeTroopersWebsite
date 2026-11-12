import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, googleAuthUser, getCurrentUser } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('ct_auth_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('ct_auth_token'));
  const [loading, setLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    async function verifyAuth() {
      const storedToken = localStorage.getItem('ct_auth_token');
      if (storedToken) {
        try {
          const res = await getCurrentUser();
          if (res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('ct_auth_user', JSON.stringify(res.data.user));
          }
        } catch {
          // Token invalid or expired
          logout();
        }
      }
      setLoading(false);
    }
    verifyAuth();
  }, []);

  const setAuthSession = (authToken, authUser) => {
    setToken(authToken);
    setUser(authUser);
    localStorage.setItem('ct_auth_token', authToken);
    localStorage.setItem('ct_auth_user', JSON.stringify(authUser));
  };

  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    const { token: receivedToken, user: receivedUser } = res.data;
    setAuthSession(receivedToken, receivedUser);
    return receivedUser;
  };

  const register = async (userData) => {
    const res = await registerUser(userData);
    const { token: receivedToken, user: receivedUser } = res.data;
    setAuthSession(receivedToken, receivedUser);
    return receivedUser;
  };

  const googleLogin = async (googlePayload) => {
    const res = await googleAuthUser(googlePayload);
    const { token: receivedToken, user: receivedUser } = res.data;
    setAuthSession(receivedToken, receivedUser);
    return receivedUser;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ct_auth_token');
    localStorage.removeItem('ct_auth_user');
  };

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = Boolean(user && token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        googleLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
