import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { User, Household } from '../types';
import { demoUser, demoHousehold } from '../services/demoData';
import { v4 as uuidv4 } from 'uuid';

interface AuthContextType {
  currentUser: User | null;
  firebaseUser: FirebaseUser | null;
  household: Household | null;
  isDemo: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  loginDemo: () => void;
  createHousehold: (name: string) => Promise<string>;
  joinHousehold: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [household, setHousehold] = useState<Household | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);

  // Generate a random household code
  function generateHouseholdCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  async function signup(email: string, password: string, displayName: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });

    const newUser: User = {
      id: userCredential.user.uid,
      email,
      displayName,
      householdId: null,
      alertPreferences: {
        enabled: true,
        thresholds: [50, 75, 90, 100],
      },
      createdAt: new Date(),
    };

    setCurrentUser(newUser);
    setIsDemo(false);
  }

  async function login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // In a real app, we'd fetch the user data from Firestore
    const user: User = {
      id: userCredential.user.uid,
      email: userCredential.user.email || email,
      displayName: userCredential.user.displayName || 'User',
      householdId: null, // Would be fetched from Firestore
      alertPreferences: {
        enabled: true,
        thresholds: [50, 75, 90, 100],
      },
      createdAt: new Date(),
    };

    setCurrentUser(user);
    setIsDemo(false);
  }

  async function logout() {
    await signOut(auth);
    setCurrentUser(null);
    setHousehold(null);
    setIsDemo(false);
  }

  function loginDemo() {
    setCurrentUser(demoUser);
    setHousehold(demoHousehold);
    setIsDemo(true);
    setLoading(false);
  }

  async function createHousehold(name: string): Promise<string> {
    const code = generateHouseholdCode();
    const newHousehold: Household = {
      id: uuidv4(),
      name,
      code,
      memberIds: currentUser ? [currentUser.id] : [],
      createdAt: new Date(),
    };

    // In a real app, we'd save this to Firestore
    setHousehold(newHousehold);

    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        householdId: newHousehold.id,
      });
    }

    return code;
  }

  async function joinHousehold(code: string) {
    // In demo mode, check for demo code
    if (code.toUpperCase() === 'DEMO123' || isDemo) {
      setHousehold(demoHousehold);
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          householdId: demoHousehold.id,
        });
      }
      return;
    }

    // In a real app, we'd query Firestore for the household with this code
    throw new Error('Household not found. Please check the code and try again.');
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user && !isDemo) {
        // In a real app, we'd fetch user data from Firestore
        setCurrentUser({
          id: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'User',
          householdId: null,
          alertPreferences: {
            enabled: true,
            thresholds: [50, 75, 90, 100],
          },
          createdAt: new Date(),
        });
      } else if (!isDemo) {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [isDemo]);

  const value: AuthContextType = {
    currentUser,
    firebaseUser,
    household,
    isDemo,
    loading,
    login,
    signup,
    logout,
    loginDemo,
    createHousehold,
    joinHousehold,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
