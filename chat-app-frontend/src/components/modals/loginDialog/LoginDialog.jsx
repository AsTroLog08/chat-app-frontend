import { useGoogleLogin  } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { loginWithGoogle } from "../../../store/slices/authSlice.js";
import styles from "./LoginDialog.module.css";
export default function LoginDialog({isOpen, onClose}) {
  const dispatch = useDispatch();

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      const token = tokenResponse.access_token; // Використовуємо Access Token
      console.log(token)
      dispatch(loginWithGoogle(token));
      onClose(); // Закриваємо діалог після успішного логіну
    },
    onError: () => {
      console.error("Помилка при вході через Google");
    },
    
    // Додатково: ви можете додати потрібні scope, наприклад: scope: 'email profile',
  });
    if (!isOpen) return null;
  return (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2>Авторизація через Google</h2>
        <button
          type="button"
          onClick={() => googleLogin()}
          className={styles.googleCustomBtn} // Створіть власний стиль для цієї кнопки
        >
          Увійти через Google
        </button>

    
            <div className={styles.buttons}>
              <button
                type="button"
                onClick={onClose}
                className={styles.cancelBtn}
              >
                Скасувати
              </button>
            </div>
          </div>
        </div>
  );
}
