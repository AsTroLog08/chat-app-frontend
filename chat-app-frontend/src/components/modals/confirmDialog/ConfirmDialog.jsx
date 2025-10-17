import styles from "./ConfirmDialog.module.css";
import { Link } from "react-router-dom";

export default function ConfirmDialog({ isOpen, onClose, onConfirm, chatName }) {

  if (!isOpen) return null;

return (
    <>
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Confirmation</h2>

        <p className={styles.text}>
          Are you sure you want to delete the chat from <strong>{chatName}</strong>?
        </p>

        <div className={styles.buttons}>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelBtn}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={styles.deleteBtn}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
    </>
);
}
