/* eslint-disable react-refresh/only-export-components */
import {
  useState,
  useEffect,
  createContext,
  ReactNode,
  useContext,
} from "react";

type UserRole = "admin" | "staff";

type AuthUser = {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
};

type LoginResponse = AuthUser & {
  token?: string;
  message?: string;
};

const tokenStorageKey = "emmarToken";

const getStoredToken = () => {
  return localStorage.getItem(tokenStorageKey);
};

const saveStoredToken = (token: string) => {
  localStorage.setItem(tokenStorageKey, token);
};

const removeStoredToken = () => {
  localStorage.removeItem(tokenStorageKey);
};

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const token = getStoredToken();

      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/auth/me",
        {
          credentials: "include",
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        },
      );

      if (!response.ok) {
        removeStoredToken();
        setUser(null);
        return;
      }

      const loggedInUser = await response.json();
      setUser(loggedInUser);
    } catch (error) {
      console.error("Check auth error:", error);
      removeStoredToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      },
    );

    const data: LoginResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Could not log in");
    }

    if (data.token) {
      saveStoredToken(data.token);
    }

    setUser({
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    });
  };

  const logout = async () => {
    const token = getStoredToken();

    await fetch(import.meta.env.VITE_BACKEND_URL + "/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    });

    (removeStoredToken(), setUser(null));
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
