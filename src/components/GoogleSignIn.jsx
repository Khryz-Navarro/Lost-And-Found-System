import { signInWithGoogle } from "../firebase";
import { FcGoogle } from "react-icons/fc";

function GoogleSignIn() {
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
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
