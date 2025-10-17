// src/components/Message/Message.jsx
import React from 'react';
import styles from './Message.module.css';

const Message = ({ text, timestamp, incoming }) => {
  

  const dateObject = new Date(timestamp);
  
  const formattedTimestamp = dateObject.toLocaleString('en-US', {
    // Вказуємо 'en-US' для отримання MM/DD/YYYY формату
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true // Використовуємо AM/PM
  });

  return (
    <div className={`${styles.message} ${incoming ? styles.incoming : styles.outgoing}`}>
      <div className={styles.bubble}>
        <div className={styles.text}>{text}</div>
        <div className={styles.timestamp}>{formattedTimestamp}</div>
      </div>
    </div>
  );
};

export default Message;