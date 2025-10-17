import styles from "./ConfirmDialog.module.css";
import { Link } from "react-router-dom";

export default function ConfirmDialog({ isOpen, onClose, onConfirm, chatName }) {

  if (!isOpen) return null;

return (
    <>
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Підтвердження</h2>

        <p className={styles.text}>
          Ви впевнені, що хочете видалити чат з <strong>{chatName}</strong>?
        </p>

        <div className={styles.buttons}>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelBtn}
          >
            Скасувати
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={styles.deleteBtn}
          >
            Видалити
          </button>
        </div>
      </div>
    </div>
    </>
);
}
