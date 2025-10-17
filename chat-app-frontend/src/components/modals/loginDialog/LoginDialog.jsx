import { useGoogleLogin  } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { loginWithGoogle } from "../../../store/slices/authSlice.js";
import styles from "./LoginDialog.module.css";
export default function LoginDialog({isOpen, onClose}) {
  const dispatch = useDispatch();

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      const token = tokenResponse.access_token; 
      console.log(token)
      dispatch(loginWithGoogle(token));
      onClose(); 
    },
    onError: () => {
      console.error("Error logging in via Google");
    },
    
  });
    if (!isOpen) return null;
  return (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2>Authorization via Google</h2>
        <button
          type="button"
          onClick={() => googleLogin()}
          className={styles.googleCustomBtn}
        >
          Sign in with Google
        </button>

    
            <div className={styles.buttons}>
              <button
                type="button"
                onClick={onClose}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
  );
}
