import { useEffect } from "react";
import styles from "./Toast.module.css";


export default function Toast({ toastList, position, autoDelete, autoDeleteTime, deleteToast }) { 

  // useEffect для автоматичного видалення
  useEffect(() => {
    let interval;
    if (autoDelete && toastList.length) {
      interval = setInterval(() => {
        deleteToast(toastList[0].id); 
      }, autoDeleteTime);
    }
    
    return () => {
      clearInterval(interval);
    }

  }, [toastList, autoDelete, autoDeleteTime, deleteToast]); 
  
  return (
      <>
        <div className={`${styles.notificationContainer} ${styles[position]}`}>

          {toastList.map((toast, i) => ( 
            <div
              key={i}
              className={`${styles.notification} ${styles.toast} ${styles[position]}`}
              style={{ backgroundColor: toast.backgroundColor }}
            >
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