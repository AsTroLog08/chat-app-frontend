import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../utils/socket.js";
import { fetchChats } from "../store/slices/chatSlice.js";
import { addMessage, fetchMessages } from "../store/slices/messageSlice.js";
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

        // 1. Приєднуємося до кімнати чату на клієнті
        socket.emit('join_chat', currentChatId);

        // 2. Обробник для нових повідомлень (включаючи авто-відповідь)
        const handleNewMessage = (message) => {

             dispatch(addMessage({
                chatId: message.chat.id,
                message: message.autoResponse.text
            }));
            console.log(message.autoResponse)
        const truncatedText = message.autoResponse.text.length > 50 
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

        // 3. Обробник для оновлення списку чатів
        const handleChatListUpdate = () => {
            console.log("Socket.IO: Chat list updated. Refetching chat list...");
            dispatch(fetchChats(""));
        };

        socket.on('new_message', handleNewMessage);
        socket.on('chat_list_updated', handleChatListUpdate);

        return () => {
            // При від'єднанні чи зміні чату — видаляємо слухачів
            socket.off('new_message', handleNewMessage);
            socket.off('chat_list_updated', handleChatListUpdate);
        };
    }, [currentChatId, dispatch]); 
};

