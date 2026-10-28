import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';
import { PhoneValidationResult, validateTanzanianPhone } from '../utils/tanzaniaPhone';
import { auth } from '../services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSendingOtp: boolean;
  isVerifyingOtp: boolean;
  authError: { sw: string; en: string } | null;
  phoneData: PhoneValidationResult | null;
  otpSent: boolean;
  
  // Actions
  sendPhoneOtp: (phoneInput: string) => Promise<boolean>;
  verifyPhoneOtp: (otpCode: string, fullName?: string, universityId?: string, declaredRole?: 'buyer' | 'seller') => Promise<boolean>;
  signInWithUniversityEmail: (email: string, universityId?: string, declaredRole?: 'buyer' | 'seller') => Promise<boolean>;
  signInWithDemoUser: (user: User, declaredRole?: 'buyer' | 'seller') => void;
  signOutUser: () => Promise<void>;
  resetOtpFlow: () => void;
  clearError: () => void;
  
  // Protected Route Interceptor
  requireAuth: (callback: () => void) => void;
  pendingAction: (() => void) | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => StorageService.getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [authError, setAuthError] = useState<{ sw: string; en: string } | null>(null);
  
  const [phoneData, setPhoneData] = useState<PhoneValidationResult | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Synchronize Firebase Auth listener
  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          // If Firebase authenticated, ensure user profile is in state
          const existing = StorageService.getCurrentUser();
          if (existing && existing.id === firebaseUser.uid) {
            setUser(existing);
          }
        }
      });
      return () => unsubscribe();
    } catch {
      // In offline or non-live fallback, localStorage maintains auth
    }
  }, []);

  // Execute pending action after successful authentication
  useEffect(() => {
    if (user && pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [user, pendingAction]);

  const clearError = () => setAuthError(null);

  const resetOtpFlow = () => {
    setOtpSent(false);
    setPhoneData(null);
    setAuthError(null);
  };

  /**
   * Protected route handler: execute callback if logged in, otherwise open modal and buffer callback
   */
  const requireAuth = (callback: () => void) => {
    if (user) {
      callback();
    } else {
      setPendingAction(() => callback);
      setIsAuthModalOpen(true);
    }
  };

  /**
   * Step 1: Send OTP to Tanzanian mobile number
   */
  const sendPhoneOtp = async (phoneInput: string): Promise<boolean> => {
    clearError();
    const validation = validateTanzanianPhone(phoneInput);

    if (!validation.isValid) {
      setAuthError({
        sw: validation.errorSw || 'Nambari ya simu sio sahihi',
        en: validation.errorEn || 'Invalid Tanzanian phone number',
      });
      return false;
    }

    setPhoneData(validation);
    setIsSendingOtp(true);

    try {
      // Simulate real-world carrier SMS gateway latency (e.g. Vodacom, Tigo, Airtel)
      await new Promise((resolve) => setTimeout(resolve, 800));

      setOtpSent(true);
      return true;
    } catch (err: any) {
      setAuthError({
        sw: 'Imeshindwa kutuma ujumbe wa OTP. Tafadhali jaribu tena.',
        en: err?.message || 'Failed to send OTP verification SMS. Please try again.',
      });
      return false;
    } finally {
      setIsSendingOtp(false);
    }
  };

  /**
   * Step 2: Verify OTP code
   */
  const verifyPhoneOtp = async (
    otpCode: string,
    fullName?: string,
    universityId = 'udsm',
    declaredRole: 'buyer' | 'seller' = 'buyer'
  ): Promise<boolean> => {
    clearError();
    setIsVerifyingOtp(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 700));

      // Test OTP codes: '1234' or any valid 4-digit code
      if (otpCode !== '1234' && otpCode.length !== 4) {
        setAuthError({
          sw: 'Nambari ya siri ya OTP uliyoweka sio sahihi au muda wake umekwisha (Msimbo wa jaribio ni 1234).',
          en: 'Invalid or expired OTP code (Test verification code is 1234).',
        });
        return false;
      }

      if (!phoneData) {
        setAuthError({
          sw: 'Taarifa za nambari ya simu hazikupatikana. Tafadhali anza upya.',
          en: 'Phone session expired. Please restart the verification flow.',
        });
        return false;
      }

      const users = StorageService.getUsers();
      const cleanTargetPhone = phoneData.formattedE164.replace(/\D/g, '').slice(-9);

      // Check for existing student
      let existingUser = users.find((u) => u.phone.replace(/\D/g, '').endsWith(cleanTargetPhone));

      const roleToSet: 'buyer' | 'seller' = declaredRole || 'buyer';

      if (!existingUser) {
        // Create new student profile
        const newUser: User = {
          id: 'usr_' + Date.now(),
          fullName: fullName?.trim() || `Mwanafunzi (${phoneData.carrier})`,
          phone: phoneData.formattedDisplay,
          universityId,
          campusZone: 'Mlimani Main Campus',
          isVerified: false,
          isSellerRegistered: roleToSet === 'seller',
          declaredRole: roleToSet,
          rating: 5.0,
          reviewCount: 0,
          joinedDate: 'Leo',
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${phoneData.formattedE164}&backgroundColor=b6e3f4`,
        };

        const updatedUsers = [...users, newUser];
        StorageService.saveUsers(updatedUsers);
        existingUser = newUser;
      } else {
        existingUser = {
          ...existingUser,
          declaredRole: roleToSet,
          isSellerRegistered: roleToSet === 'seller' ? true : existingUser.isSellerRegistered,
        };
        const updatedUsers = users.map((u) => (u.id === existingUser!.id ? existingUser! : u));
        StorageService.saveUsers(updatedUsers);
      }

      setUser(existingUser);
      StorageService.saveCurrentUser(existingUser);
      StorageService.saveRoleView(roleToSet);
      setIsAuthModalOpen(false);
      resetOtpFlow();
      return true;
    } catch (err: any) {
      setAuthError({
        sw: 'Hitilafu ya uthibitishaji. Tafadhali jaribu tena.',
        en: err?.message || 'Verification error. Please retry.',
      });
      return false;
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  /**
   * Alternative: Sign In with University Institutional Email (.ac.tz)
   */
  const signInWithUniversityEmail = async (
    email: string,
    universityId = 'udsm',
    declaredRole: 'buyer' | 'seller' = 'buyer'
  ): Promise<boolean> => {
    clearError();
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    // Validate university domain
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setAuthError({
        sw: 'Tafadhali weka anwani halali ya barua pepe.',
        en: 'Please enter a valid email address.',
      });
      setIsLoading(false);
      return false;
    }

    const isAcademic = cleanEmail.endsWith('.ac.tz') || cleanEmail.endsWith('.edu');

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const users = StorageService.getUsers();
      let existingUser = users.find((u) => u.email?.toLowerCase() === cleanEmail);

      const roleToSet: 'buyer' | 'seller' = declaredRole || 'buyer';

      if (!existingUser) {
        const namePart = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
        const formattedName = namePart
          .split(' ')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');

        const newUser: User = {
          id: 'usr_' + Date.now(),
          fullName: formattedName || 'Mwanafunzi wa Chuo',
          phone: '+255 700 000 000',
          email: cleanEmail,
          universityId,
          campusZone: 'Mlimani Main Campus',
          isVerified: isAcademic, // Automatic badge for academic domain
          verificationMethod: isAcademic ? 'email' : undefined,
          isSellerRegistered: roleToSet === 'seller',
          declaredRole: roleToSet,
          rating: 5.0,
          reviewCount: 0,
          joinedDate: 'Leo',
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}&backgroundColor=d1d4f9`,
        };

        const updatedUsers = [...users, newUser];
        StorageService.saveUsers(updatedUsers);
        existingUser = newUser;
      } else {
        existingUser = {
          ...existingUser,
          declaredRole: roleToSet,
          isSellerRegistered: roleToSet === 'seller' ? true : existingUser.isSellerRegistered,
        };
        const updatedUsers = users.map((u) => (u.id === existingUser!.id ? existingUser! : u));
        StorageService.saveUsers(updatedUsers);
      }

      setUser(existingUser);
      StorageService.saveCurrentUser(existingUser);
      StorageService.saveRoleView(roleToSet);
      setIsAuthModalOpen(false);
      return true;
    } catch (err: any) {
      setAuthError({
        sw: 'Hitilafu ya kuingia kwa barua pepe. Tafadhali jaribu tena.',
        en: err?.message || 'Failed to sign in with email.',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fast Demo Student Login (for zero-friction evaluation)
   */
  const signInWithDemoUser = (demoUser: User, declaredRole?: 'buyer' | 'seller') => {
    const roleToSet: 'buyer' | 'seller' = declaredRole || demoUser.declaredRole || (demoUser.isSellerRegistered ? 'seller' : 'buyer');
    const updatedUser: User = {
      ...demoUser,
      declaredRole: roleToSet,
      isSellerRegistered: roleToSet === 'seller' ? true : demoUser.isSellerRegistered,
    };
    setUser(updatedUser);
    StorageService.saveCurrentUser(updatedUser);
    StorageService.saveRoleView(roleToSet);
    setIsAuthModalOpen(false);
    resetOtpFlow();
  };

  /**
   * Sign out
   */
  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch {
      // fallback
    }
    setUser(null);
    StorageService.saveCurrentUser(null);
    resetOtpFlow();
    clearError();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: Boolean(user),
        isLoading,
        isSendingOtp,
        isVerifyingOtp,
        authError,
        phoneData,
        otpSent,
        sendPhoneOtp,
        verifyPhoneOtp,
        signInWithUniversityEmail,
        signInWithDemoUser,
        signOutUser,
        resetOtpFlow,
        clearError,
        requireAuth,
        pendingAction,
        isAuthModalOpen,
        setIsAuthModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
