import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ChatList from "../../components/chatList/ChatList";
import Message from "../../components/message/Message";
import ChatDialog from "../../components/modals/chatDialog/ChatDialog";
import LoginDialog from "../../components/modals/loginDialog/LoginDialog";

import styles from "./MainPage.module.css";

import { createNewChat, fetchChat, fetchChats } from "../../store/slices/chatSlice";
import { fetchMessages, sendMessage } from "../../store/slices/messageSlice";
import { logout } from "../../store/slices/authSlice";

import { useChat } from "../../hooks/useChat";
import { useMessage, useSocketListeners } from "../../hooks/useMessage";
import { useAuth } from "../../hooks/useAuth";

// Компонент для відображення завантаження/помилки в контейнері
const StatusPlaceholder = ({ loading, error, loadingText, errorText }) => {
    if (loading) return <div className={styles.statusMessage}>{loadingText || "Завантаження..."}</div>;
    if (error) return <div className={`${styles.statusMessage} ${styles.errorMessage}`}>{errorText || "Помилка."}</div>;
    return null;
};

export default function MainPage() {
    const dispatch = useDispatch();
    const { id: chatIdFromUrl } = useParams();
    const navigate = useNavigate();

    const { userId, user, loading: authLoading } = useAuth();
    const { chats, currentChat, loadingChats, errorChats, errorChatAction } = useChat();
    const { messagesByChat, loading: messagesLoading, error: messagesError } = useMessage();

    const [messageText, setMessageText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateChatOpen, setIsCreateChatOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [chatToEdit, setChatToEdit] = useState(null);
    const currentMessages = messagesByChat[chatIdFromUrl] || [];
    const currentChatName = currentChat?.displayName ||
                           `${currentChat?.firstName || ''} ${currentChat?.lastName || ''}`.trim() ||
                           "Select a Chat";
    const avatarUrl = currentChat?.avatarUrl;

    // Підключаємо WebSocket слухачів
    useSocketListeners(chatIdFromUrl);

    // -----------------------------
    // Обробники
    // -----------------------------
    const handleSearchChange = (e) => setSearchQuery(e.target.value);

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
        navigate('/');
        window.location.reload(); 
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
    // Завантаження даних
    // -----------------------------
    useEffect(() => {
        if (userId) {
            dispatch(fetchChats(searchQuery));
            console.log("Current user/guest ID:", userId);
        }
    }, [userId, dispatch, searchQuery]);

    useEffect(() => {
        if (chatIdFromUrl) {
            dispatch(fetchChat(chatIdFromUrl));
            dispatch(fetchMessages(chatIdFromUrl));
        }
    }, [chatIdFromUrl, dispatch]);

    // -----------------------------
    // Кнопка автентифікації
    // -----------------------------
    const AuthButton = () => user ? (
        <button onClick={handleLogout} className={styles.logOutButton}>Log Out</button>
    ) : (
        <button onClick={handleOpenLoginDialog} className={styles.logOutButton}>Log In</button>
    );

    // -----------------------------
    // Повне блокування екрану, якщо завантажується сесія
    // -----------------------------
    if (authLoading) {
        return <div className={styles.loadingScreen}>Завантаження сесії...</div>;
    }
    
    // Перевірка, чи можна показувати заголовок та форму
    const shouldShowChatDetails = chatIdFromUrl && !messagesError;

    // -----------------------------
    // Основний рендер
    // -----------------------------
    return (
        <>
            <div className={styles.appContainer}>
                {/* ======================================================= */}
                {/* 1. БОКОВА ПАНЕЛЬ ЧАТІВ */}
                {/* ======================================================= */}
                <div className={styles.sidebar}>
                    <div className={styles.sidebarHeader}>
                        <span>Hi, {user?.displayName || 'Guest'}</span>
                        <AuthButton />
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
                        <div>
                            <button className={styles.createButton} onClick={handleOpenCreateDialog}>
                                Create Chat
                            </button>
                        </div>
                    </div>

                    <div className={styles.chatsLabel}>Chats</div>
                    
                    <div className={styles.chatListContainer}>
                        <StatusPlaceholder 
                            loading={loadingChats} 
                            error={errorChats}
                            loadingText="Завантаження чатів..."
                            errorText="Помилка завантаження чатів."
                        />
                        
                        {!loadingChats && !errorChats  && <ChatList chats={chats} />}
                    </div>
                </div>

                {/* ======================================================= */}
                {/* 2. ВІКНО ПОВІДОМЛЕНЬ */}
                {/* ======================================================= */}
                <div className={styles.chatWindow}>
                    
                    {/* ХЕДЕР ЧАТУ: Показуємо, тільки якщо є обраний чат і немає помилки */}
                    {shouldShowChatDetails && (
                        <div className={styles.chatWindowHeader}>
                            <div className={styles.avatarContainer}>
                                <img className={styles.avatar} src={avatarUrl} alt="icon" />
                                <img className={styles.onlineDot} src="https://cdn.pixabay.com/photo/2013/07/12/12/17/check-145512_640.png" alt="icon" />
                            </div>
                            <div className={styles.name}>{currentChatName}</div>
                        </div>
                    )}

                    {/* КОНТЕЙНЕР ПОВІДОМЛЕНЬ */}
                    <div className={styles.messagesContainer}>

                        {/* Відображення завантаження/помилки повідомлень */}
                        <StatusPlaceholder
                            loading={messagesLoading}
                            error={messagesError}
                            loadingText="Завантаження повідомлень..."
                            errorText="Помилка завантаження повідомлень."
                        />
                        
                        {/* Основний рендер повідомлень або порожнього стану, якщо немає завантаження/помилки */}
                        {!messagesLoading && !messagesError && (
                            currentMessages && currentMessages.length > 0 ? (
                                currentMessages.map(msg => (
                                <Message
                                    key={msg.id}
                                    text={msg.text}
                                    timestamp={msg.timestamp}
                                    incoming={msg.incoming}
                                    sender={msg.sender}
                                />
                                ))
                            ) : (
                                <div className={styles.emptyChatPlaceholder}>
                                    {/* Змінено логіку відображення заглушки, щоб коректно працювати з shouldShowChatDetails */}
                                    {chatIdFromUrl && currentChat ? "This chat is empty. You can be the first!" : "Select a chat to start messaging."}
                                </div>
                            )
                        )}
                    </div>

                    {/* ФОРМА ВВОДУ ПОВІДОМЛЕНЬ: Показуємо, тільки якщо є обраний чат і немає помилки */}
                    {shouldShowChatDetails && (
                        <form onSubmit={handleSendMessage} className={styles.inputContainer}>
                            <div className={styles.messageWrapper}>
                                <input
                                    type="text"
                                    placeholder="Type your message"
                                    className={styles.messageInput}
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    disabled={!currentChat?.id || messagesLoading || messagesError}
                                />
                                <button 
                                    className={styles.sendButton} 
                                    type="submit"
                                    disabled={!currentChat?.id || messageText.trim() === '' || messagesLoading || messagesError}
                                >
                                    <img src="https://www.svgrepo.com/show/418580/outlined-send-message.svg" alt="Send" />
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

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