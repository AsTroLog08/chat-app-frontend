import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../utils/socket.js";
import { fetchChats, updateChatLastMessage } from "../store/slices/chatSlice.js";
import { messageReceived } from "../store/slices/messageSlice.js";
import { addToast } from "../store/slices/toastSlice.js";

export function useMessage() {
  const { messagesByChat, loading, error } = useSelector((state) => state.messageStore);

  return {
    messagesByChat,
    loading,
    error,
  };
}
export const useSocketListeners = (currentChatId) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!currentChatId) return;

        // Приєднуємося до поточного чату
        socket.emit('join_chat', currentChatId);

        // Обробник нового повідомлення
        const handleNewMessage = (message) => {
            // Якщо повідомлення належить поточному чату
            if (message.chatId === currentChatId) {
                dispatch(messageReceived({
                    chatId: currentChatId,
                    message: message.message,
                }));
            }

            // Оновлюємо список чатів (останнє повідомлення)
            dispatch(updateChatLastMessage({
                chatId: message.chatId,
                message: message.message,
            }));

            // Створюємо текст для сповіщення (toast)
            const truncatedText =
                message.autoResponse.text.length > 50
                    ? message.autoResponse.text.substring(0, 20) + '...'
                    : message.autoResponse.text;

            dispatch(addToast({
                id: Date.now(),
                title: `Нове повідомлення від ${message.chat.fullName}`,
                description: truncatedText,
                icon: message.chat.avatarUrl,
                backgroundColor: "#434446FF",
            }));
        };

        // Обробник оновлення списку чатів
        const handleChatListUpdate = () => {
            console.log("Socket.IO: Chat list updated. Refetching chat list...");
            dispatch(fetchChats(""));
        };

        // Підписка на події
        socket.on('new_message', handleNewMessage);
        socket.on('chat_list_updated', handleChatListUpdate);

        // Прибираємо підписки при розмонтуванні
        return () => {
            socket.off('new_message', handleNewMessage);
            socket.off('chat_list_updated', handleChatListUpdate);
            socket.emit('leave_chat', currentChatId);
        };
    }, [currentChatId, dispatch]);
};
