import { useEffect } from "react";
import styles from "./Toast.module.css";

// ⚠️ Заберіть 'list' зі стану, використовуйте тільки 'toastList'
export default function Toast({ toastList, position, autoDelete, autoDeleteTime, deleteToast }) { 

  // ⚠️ Локальний стан 'list' більше не потрібен! Ми відображаємо 'toastList'.
  // const [list, setList] = useState(toastList); // ❌ ВИДАЛИТИ

  // ⚠️ useEffect для синхронізації також більше не потрібен!
  /*
  useEffect(() => {
      setList([...toastList]);
  }, [toastList]);
  */

  // 1. useEffect для автоматичного видалення
  useEffect(() => {
    let interval;
    if (autoDelete && toastList.length) {
      interval = setInterval(() => {
        // ВИПРАВЛЕННЯ: Викликаємо пропс deleteToast, який dispatch-не Redux action.
        // Це забезпечить правильне видалення з Redux store.
        deleteToast(toastList[0].id); 
      }, autoDeleteTime);
    }
    
    return () => {
      clearInterval(interval);
    }

  }, [toastList, autoDelete, autoDeleteTime, deleteToast]); // ⚠️ Оновлені залежності

  // 2. Локальна функція deleteToast більше не потрібна, бо пропс deleteToast вже її замінює
  // 3. Видалення тоста по кнопці 'X' використовує пропс deleteToast
  
  return (
      <>
        <div className={`${styles.notificationContainer} ${styles[position]}`}>
          {/* ВИПРАВЛЕННЯ: Відображаємо напряму пропс toastList */}
          {toastList.map((toast, i) => ( 
            <div
              key={i}
              className={`${styles.notification} ${styles.toast} ${styles[position]}`}
              style={{ backgroundColor: toast.backgroundColor }}
            >
              {/* ВИПРАВЛЕННЯ: Кнопка 'X' викликає пропс deleteToast (Redux action) */}
              <button onClick={() => deleteToast(toast.id)}>X</button> 
              <div className={styles.notificationImage}>
                <img src={toast.icon} alt="" />
              </div>
              <div>
                <p className={styles.notificationTitle}>{toast.title}</p>
                <p className={styles.notificationMessage}>{toast.description}</p>
              </div>
            </div>
          ))}
        </div>
      </>
  );
}