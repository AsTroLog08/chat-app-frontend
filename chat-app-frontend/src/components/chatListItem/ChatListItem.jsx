import React from 'react';
import styles from './ChatListItem.module.css';
import { useNavigate } from 'react-router-dom';

// 🚩 Додаємо пропси onEdit та onDelete
const ChatListItem = ({ 
    id, 
    name, 
    lastMessage, 
    avatarUrl, 
    date, 
    active, 
    onEdit,    // Функція для редагування
    onDeleteConfirm    // Функція для видалення
}) => {
    const navigate = useNavigate();

    const handleChatClick = () => {
        navigate(`/chat/${id}`); 
    };

    // 🚩 Логіка для кнопок (запобігаємо спливанню події, щоб не переходити на сторінку чату)
    const handleEditClick = (e) => {
        e.stopPropagation(); // Важливо: запобігає виклику handleChatClick
        if (onEdit) {
            onEdit(id); // Передаємо id чату для редагування
        }
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        
        // 🚩 ЗАМІСТЬ window.confirm, викликаємо функцію батьківського компонента, 
        // 🚩 яка відкриє модальне вікно, передаючи їй id та ім'я чату.
        if (onDeleteConfirm) {
            onDeleteConfirm(id, name); 
        }
    };

    return (
        // 🚩 Весь елемент все ще клікабельний для переходу в чат
        <div onClick={handleChatClick} className={`${styles.item} ${active ? styles.active : ''}`}>
            <div className={styles.avatarContainer}>
                <img className={styles.avatar} src={avatarUrl} alt="icon"/>
                <img className={styles.onlineDot} src="https://cdn.pixabay.com/photo/2013/07/12/12/17/check-145512_640.png" alt="icon"/>
            </div>
            
            <div className={styles.details}>
                <div className={styles.name}>{name}</div>
                {/* 🚩 Оновлено перевірку на пусте повідомлення */}
                <div className={styles.preview}>
                    {lastMessage && lastMessage.text ? lastMessage.text : null}
                </div>
            </div>
            
            {/* 🚩 Контейнер для дати та кнопок */}
            <div className={styles.actionsContainer}>
                <div className={styles.date}>{date}</div>
                <div className={styles.buttonsGroup}>
                    {/* Кнопка редагування */}
                    <button onClick={handleEditClick} className={styles.actionButton}>
                        {/* Іконка "олівець" */}
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    {/* Кнопка видалення */}
                    <button onClick={handleDeleteClick} className={`${styles.actionButton} ${styles.deleteButton}`}>
                        {/* Іконка "смітник" */}
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="14" y2="11"></line><line x1="10" y1="15" x2="14" y2="15"></line></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatListItem;