import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { api } from "../lib/api";

interface UserProfile {
  name: string;
  bio: string;
  location: string;
  avatar: string;
  tags: string[];
}

interface AuthUser {
  id: string;
  email: string;
  token: string;
}

interface UserContextType {
  profile: UserProfile;
  authUser: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (newProfile: Partial<UserProfile>) => Promise<void>;
}

const defaultProfile: UserProfile = {
  name: "访客",
  bio: "",
  location: "",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
  tags: ["爱心领养人"],
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化：从 localStorage 恢复登录状态
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");
    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthUser({ ...user, token });
        // 从后端刷新 profile
        api.get<UserProfile>("/users/me")
          .then((data) => setProfile(data))
          .catch(() => {
            // Token 已过期，清除登录状态
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_user");
            setAuthUser(null);
          });
      } catch {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await api.post<any>("/auth/login", { email, password });
    const { token, user } = data;

    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify({ id: user.id, email: user.email }));

    setAuthUser({ id: user.id, email: user.email, token });
    setProfile({
      name: user.name || email.split("@")[0],
      bio: user.bio || "",
      location: user.location || "",
      avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
      tags: user.tags || ["爱心领养人"],
    });
  }, []);

  const register = useCallback(async (email: string, password: string, name?: string) => {
    const data = await api.post<any>("/auth/register", { email, password, name });
    const { token, user } = data;

    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify({ id: user.id, email: user.email }));

    setAuthUser({ id: user.id, email: user.email, token });
    setProfile({
      name: user.name || name || email.split("@")[0],
      bio: "",
      location: "",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
      tags: ["爱心领养人"],
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setAuthUser(null);
    setProfile(defaultProfile);
  }, []);

  const updateProfile = useCallback(async (newProfile: Partial<UserProfile>) => {
    const updated = await api.put<UserProfile>("/users/me", newProfile);
    setProfile((prev) => ({ ...prev, ...updated }));
  }, []);

  return (
    <UserContext.Provider value={{
      profile,
      authUser,
      isLoggedIn: !!authUser,
      isLoading,
      login,
      register,
      logout,
      updateProfile,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
