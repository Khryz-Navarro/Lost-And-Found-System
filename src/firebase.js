import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Add this to your existing firebase exports
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

// Firestore Functions
export const addItem = async (itemData) => {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error("User not authenticated");
    }

    const docRef = await addDoc(collection(db, "items"), {
      ...itemData,
      createdAt: new Date(),
      status: "unclaimed",
      reportedBy: user.email, // Store email instead of UID
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding item: ", error);
    throw error;
  }
};

export const getItems = async (filters = {}) => {
  try {
    let q = collection(db, "items");

    if (filters.itemType && filters.itemType !== "all") {
      q = query(q, where("type", "==", filters.itemType));
    }

    if (filters.category && filters.category !== "all") {
      q = query(q, where("category", "==", filters.category));
    }

    if (filters.status && filters.status !== "all") {
      q = query(q, where("status", "==", filters.status));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting items: ", error);
    throw error;
  }
};

export const claimItem = async (itemId) => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("User not authenticated");

  const itemRef = doc(db, "items", itemId);
  const docSnap = await getDoc(itemRef); // Now works with proper import

  if (!docSnap.exists()) {
    throw new Error("Item does not exist");
  }

  if (docSnap.data().reportedBy === user.email) {
    throw new Error("You cannot claim your own item");
  }
  await updateDoc(itemRef, {
    status: "claimed",
    claimedBy: user.email,
  });
};
