import { signInWithGoogle } from "../firebase";
import { FcGoogle } from "react-icons/fc";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

function GoogleSignIn() {
  // Update the handleGoogleSignIn function
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      // Create/update user document
      await setDoc(doc(db, "users", result.user.uid), {
        email: result.user.email,
        createdAt: new Date(),
        lastLogin: new Date(),
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        provider: "google", // Add this field
      });
      window.location.href = "/home";
    } catch (error) {
      console.error("Google sign-in failed:", error);
      if (error.code === "auth/popup-closed-by-user") {
        alert("Please complete the sign-in process in the popup window");
      }
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
      <FcGoogle />
      Sign in with Google
    </button>
  );
}

export default GoogleSignIn;
