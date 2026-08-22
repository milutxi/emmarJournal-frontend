
import { useState, useEffect, createContext, ReactNode, useContext } from "react";

type UserRole = "admin" | "staff";

type AuthUser = {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
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
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/auth/me",
        {
          credentials: "include",
        },
      );

      if(!response.ok) {
        setUser(null);
        return;
      }

      const loggedInUser = await response.json();
      setUser(loggedInUser);
    } catch(error) {
      console.error("Check auth error:", error);
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

    const data = await response.json();

    if(!response.ok) {
      throw new Error(data.message || "Could not log in");
    }

    setUser(data);
  };

  const logout = async () => {
    await fetch(import.meta.env.VITE_BACKEND_URL + "/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
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
    throw new Error( "useAuth must be used inside AuthProvider");
  }

  return context;
};
