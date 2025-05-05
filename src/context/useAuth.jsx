import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { signOut, sendPasswordResetEmail, updateProfile } from "firebase/auth";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    }
  };

  const updateUserName = async (name) => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
      });
      setUser((prev) => ({ ...prev, displayName: name }));
    } catch (error) {
      console.error("Name update error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const tokenResult = await firebaseUser.getIdTokenResult();
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName, // Map displayName to name
            isAdmin: tokenResult.claims.isAdmin || false,
            emailVerified: firebaseUser.emailVerified,
            profile: firebaseUser.photoURL, // Add UserProfile component to user object
          });
        } catch (error) {
          console.error("Error fetching user claims:", error);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            isAdmin: false,
            emailVerified: firebaseUser.emailVerified,
            profile: firebaseUser.photoURL,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return {
    user,
    loading,
    logout,
    resetPassword,
    updateUserName,
  };
}
