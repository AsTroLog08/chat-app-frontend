import React from 'react';
import styles from './ChatListItem.module.css';
import { useNavigate } from 'react-router-dom';


const ChatListItem = ({ 
    id, 
    name, 
    lastMessage, 
    avatarUrl, 
    date, 
    active, 
    onEdit, 
    onDeleteConfirm 
}) => {
    const navigate = useNavigate();

    const handleChatClick = () => {
        navigate(`/chat/${id}`); 
    };

    const handleEditClick = (e) => {
        e.stopPropagation(); 
        if (onEdit) {
            onEdit(id);
        }
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        
        if (onDeleteConfirm) {
            onDeleteConfirm(id, name); 
        }
    };

    return (
        <div onClick={handleChatClick} className={`${styles.item} ${active ? styles.active : ''}`}>
            <div className={styles.avatarContainer}>
                <img className={styles.avatar} src={avatarUrl} alt="icon"/>
                <img className={styles.onlineDot} src="https://cdn.pixabay.com/photo/2013/07/12/12/17/check-145512_640.png" alt="icon"/>
            </div>
            
            <div className={styles.details}>
                <div className={styles.name}>{name}</div>
                <div className={styles.preview}>
                    {lastMessage && lastMessage.text ? lastMessage.text : null}
                </div>
            </div>
            
            <div className={styles.actionsContainer}>
                <div className={styles.date}>{date}</div>
                <div className={styles.buttonsGroup}>
                    <button onClick={handleEditClick} className={styles.actionButton}>
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button onClick={handleDeleteClick} className={`${styles.actionButton} ${styles.deleteButton}`}>
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="14" y2="11"></line><line x1="10" y1="15" x2="14" y2="15"></line></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatListItem;