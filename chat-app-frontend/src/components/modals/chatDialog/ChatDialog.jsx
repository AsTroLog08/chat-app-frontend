import { useEffect, useState } from "react";
import styles from "./ChatDialog.module.css";
import { Link } from "react-router-dom";

export default function ChatDialog({ isOpen, onClose, onSubmit, initialData }) {

  const [firstName, setFirstName] = useState(initialData?.firstName || '');
  const [lastName, setLastName] = useState(initialData?.lastName || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFirstName(initialData?.firstName || '');
      setLastName(initialData?.lastName || '');
      setError('');
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError('Ім\'я та прізвище обов\'язкові.');
      return;
    }
    onSubmit({ firstName, lastName });
    onClose();
  };

  if (!isOpen) return null;

return (
    <>
 <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>
          {initialData ? 'Edit chat' : 'Crete new chat'}
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={styles.input}
            required
          />
          <input
            type="text"
            placeholder="Surname"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={styles.input}
            required
          />

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.buttons}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
            >
              {initialData ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
);
}
