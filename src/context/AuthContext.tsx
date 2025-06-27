import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../utils/firebase";

export interface AuthContextType {
  currentUser: UserDetails | null;
  signUp: (email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | null>(null);

type Props = {
  children: React.ReactNode;
};

interface UserDetails {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserDetails | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: UserDetails | null) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.email?.split("@")[0] ?? "User"
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { user: data } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return {
        message: "User registered successfully",
        user: {
          email: data.email,
          displayName: data.email?.split("@")[0] ?? "User",
        },
      };
    } catch (error: any) {
      return {
        message: "Error signing up",
        error: error.message,
      };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { user: data } = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return {
        message: "User logged in successfully",
        user: {
          email: data.email,
          displayName: data.email?.split("@")[0] ?? "User",
        },
      };
    } catch (error: any) {
      return {
        message: "Error logging in. Please check your credentials.",
        error: error.message,
      };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return {
        message: "User signed out successfully",
      };
    } catch (error: any) {
      return {
        message: "Error signing out",
        error: error.message,
      };
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser: user, signUp, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
