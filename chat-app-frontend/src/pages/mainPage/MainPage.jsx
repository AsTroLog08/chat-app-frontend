import { useDispatch } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ChatList from "../../components/chatList/ChatList.jsx";
import Message from "../../components/message/Message.jsx";
import ChatDialog from "../../components/modals/chatDialog/ChatDialog.jsx";
import LoginDialog from "../../components/modals/loginDialog/LoginDialog.jsx";

import styles from "./MainPage.module.css";

import { createNewChat, fetchChat, fetchChats } from "../../store/slices/chatSlice.js";
import { fetchMessages, sendMessage } from "../../store/slices/messageSlice.js";
import { clearStore, logout } from "../../store/slices/authSlice.js";

import { useChat } from "../../hooks/useChat.js";
import { useMessage, useSocketListeners } from "../../hooks/useMessage.js";
import { useAuth } from "../../hooks/useAuth.js";

// Компонент для відображення завантаження/помилки в контейнері
const StatusPlaceholder = ({ loading, error, loadingText, errorText }) => {
    if (loading) return <div className={styles.statusMessage}>{loadingText || "Завантаження..."}</div>;
    if (error) return <div className={`${styles.statusMessage} ${styles.errorMessage}`}>{errorText || "Помилка."}</div>;
    return null;
};

// ===================================
// Додаткові компактні компоненти
// ===================================

const AuthButton = ({ user, onLogin, onLogout }) => (
    user ? (
        <button onClick={onLogout} className={styles.logOutButton}>Log Out</button>
    ) : (
        <button onClick={onLogin} className={styles.logOutButton}>Log In</button>
    )
);

const ChatHeader = ({ chat, currentChatName, avatarUrl }) => (
    <div className={styles.chatWindowHeader}>
        <div className={styles.avatarContainer}>
            <img className={styles.avatar} src={avatarUrl} alt="Chat Avatar" />
            {/* Рекомендовано: використовувати іконку SVG/компонент замість зовнішнього URL */}
            <img className={styles.onlineDot} src="https://cdn.pixabay.com/photo/2013/07/12/12/17/check-145512_640.png" alt="Online" />
        </div>
        <div className={styles.name}>{currentChatName}</div>
    </div>
);

const MessageForm = ({ chatId, messageText, setMessageText, handleSendMessage, messagesLoading, messagesError }) => {
    const isDisabled = !chatId || messagesLoading || messagesError;

    return (
        <form onSubmit={handleSendMessage} className={styles.inputContainer}>
            <div className={styles.messageWrapper}>
                <input
                    type="text"
                    placeholder="Type your message"
                    className={styles.messageInput}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    disabled={isDisabled}
                />
                <button 
                    className={styles.sendButton} 
                    type="submit"
                    disabled={isDisabled || messageText.trim() === ''}
                >
                    <img src="https://www.svgrepo.com/show/418580/outlined-send-message.svg" alt="Send" />
                </button>
            </div>
        </form>
    );
};


// ===================================
// Основний компонент
// ===================================

export default function MainPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id: chatIdFromUrl } = useParams();

    // --- Стан Redux та Хуки ---
    const { userId, user, loading: authLoading } = useAuth();
    const { chats, currentChat, loadingChats, errorChats } = useChat(); 
    const { messagesByChat, loading: messagesLoading, error: messagesError } = useMessage();
    
    // --- Локальний Стан ---
    const [messageText, setMessageText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateChatOpen, setIsCreateChatOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [chatToEdit, setChatToEdit] = useState(null);

    // --- Обчислювані Властивості (Мемоізовані) ---
    const currentMessages = messagesByChat[chatIdFromUrl] || [];
    const avatarUrl = currentChat?.avatarUrl;

    const currentChatName = useMemo(() => {
        if (!currentChat) return "Select a Chat";
        if (currentChat.displayName) return currentChat.displayName;

        const fullName = `${currentChat.firstName || ''} ${currentChat.lastName || ''}`.trim();
        return fullName || "Unknown Chat";
    }, [currentChat]);

    const shouldShowChatDetails = !!chatIdFromUrl && !messagesError && !!currentChat;

    // Підключаємо WebSocket слухачів
    useSocketListeners(chatIdFromUrl);

    // -----------------------------
    // Обробники
    // -----------------------------
    const handleSearchChange = (e) => setSearchQuery(e.target.value);

    // Обробники діалогових вікон
    const handleOpenCreateDialog = () => {
        setChatToEdit(null);
        setIsCreateChatOpen(true);
    };
    const handleCloseCreateDialog = () => setIsCreateChatOpen(false);
    const handleSubmitNewChat = (newChatData) => dispatch(createNewChat(newChatData));

    const handleOpenLoginDialog = () => setIsLoginOpen(true);
    const handleCloseLoginDialog = () => setIsLoginOpen(false);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(clearStore());
        dispatch(fetchChats());
        navigate('/');
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!currentChat?.id || messageText.trim() === '') return;

        dispatch(sendMessage({
            chatId: currentChat.id,
            text: messageText,
        }));
        setMessageText('');
    };

    // -----------------------------
    // Завантаження даних (useEffect)
    // -----------------------------
    
    // Ефект для завантаження списку чатів при зміні userId або пошукового запиту
    useEffect(() => {
        if (userId) {
            dispatch(fetchChats(searchQuery));
        }
    }, [userId, dispatch, searchQuery]);

    // Ефект для завантаження деталей та повідомлень обраного чату
    useEffect(() => {
        if (chatIdFromUrl) {
            dispatch(fetchChat(chatIdFromUrl));
            dispatch(fetchMessages(chatIdFromUrl));
        }
    }, [chatIdFromUrl, dispatch]);

    // -----------------------------
    // Загальний Стан (Рендер)
    // -----------------------------
    
    // Блокування екрану, якщо йде завантаження сесії (початковий автологін)
    if (authLoading) {
        return <div className={styles.loadingScreen}>Завантаження сесії...</div>;
    }

    return (
        <>
            <div className={styles.appContainer}>
                {/* ======================================================= */}
                {/* 1. БОКОВА ПАНЕЛЬ ЧАТІВ */}
                {/* ======================================================= */}
                <div className={styles.sidebar}>
                    <div className={styles.sidebarHeader}>
                        <span>Hi, {user?.displayName || 'Guest'}</span>
                        <AuthButton 
                            user={user} 
                            onLogin={handleOpenLoginDialog} 
                            onLogout={handleLogout} 
                        />
                    </div>

                    <div className={styles.controlsRow}>
                        <div className={styles.searchContainer}>
                            <span className={styles.searchIcon}>🔍</span>
                            <input
                                type="text"
                                placeholder="Search new chat"
                                className={styles.searchInput}
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <button className={styles.createButton} onClick={handleOpenCreateDialog}>
                            Create Chat
                        </button>
                    </div>

                    <div className={styles.chatsLabel}>Chats</div>
                    
                    <div className={styles.chatListContainer}>
                        <StatusPlaceholder 
                            loading={false} 
                            error={errorChats}
                            loadingText="Завантаження чатів..."
                            errorText="Помилка завантаження чатів."
                        />
                        
                        {!loadingChats && !errorChats && <ChatList chats={chats} />}
                    </div>
                </div>

                {/* ======================================================= */}
                {/* 2. ВІКНО ПОВІДОМЛЕНЬ */}
                {/* ======================================================= */}
                <div className={styles.chatWindow}>
                    
                    {/* ХЕДЕР ЧАТУ */}
                    {shouldShowChatDetails && (
                        <ChatHeader 
                            chat={currentChat} 
                            currentChatName={currentChatName} 
                            avatarUrl={avatarUrl} 
                        />
                    )}

                    {/* КОНТЕЙНЕР ПОВІДОМЛЕНЬ */}
                    <div className={styles.messagesContainer}>

                        {/* Відображення завантаження/помилки повідомлень */}
                        <StatusPlaceholder
                            loading={false}
                            error={messagesError}
                            loadingText="Завантаження повідомлень..."
                            errorText="Помилка завантаження повідомлень."
                        />
                        
                        {/* Основний рендер повідомлень або порожнього стану */}
                        {!messagesLoading && !messagesError && (
                            currentMessages && currentMessages.length > 0 ? (
                                currentMessages.map(msg => (
                                <Message
                                    key={msg.id}
                                    text={msg.text}
                                    timestamp={msg.timestamp}
                                    incoming={msg.senderId !== userId} 
                                    sender={msg.sender}
                                />
                                ))
                            ) : (
                                <div className={styles.emptyChatPlaceholder}>
                                    {chatIdFromUrl && currentChat ? 
                                        "This chat is empty. Be the first to send a message!" : 
                                        "Select a chat to start messaging."
                                    }
                                </div>
                            )
                        )}
                    </div>

                    {/* ФОРМА ВВОДУ ПОВІДОМЛЕНЬ */}
                    {shouldShowChatDetails && (
                        <MessageForm
                            chatId={currentChat?.id}
                            messageText={messageText}
                            setMessageText={setMessageText}
                            handleSendMessage={handleSendMessage}
                            messagesLoading={messagesLoading}
                            messagesError={messagesError}
                        />
                    )}
                </div>
            </div>

            {/* Модальні вікна */}
            <ChatDialog
                isOpen={isCreateChatOpen}
                onClose={handleCloseCreateDialog}
                onSubmit={handleSubmitNewChat}
                initialData={chatToEdit}
            />

            <LoginDialog
                isOpen={isLoginOpen}
                onClose={handleCloseLoginDialog}
            />
        </>
    );
}