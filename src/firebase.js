import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut, // Add this import
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
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
  const user = auth.currentUser; // Get current user
  if (!user) throw new Error("User not authenticated");

  // Update with the user's email instead of UID
  await updateDoc(doc(db, "items", itemId), {
    status: "claimed",
    claimedBy: user.email, // Use email instead of user.uid
  });
};

// Storage Functions
export const uploadImage = async (file) => {
  try {
    // Add timestamp to ensure unique filenames
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `items/${fileName}`);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file);

    // Get public URL
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error("Image upload failed:", error);
    throw new Error("Image upload failed. Please try again.");
  }
};

// const getItemsByUser = async (email) => {
//   const q = query(collection(db, "items"), where("reportedBy", "==", email));
//   const querySnapshot = await getDocs(q);
//   return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// };
