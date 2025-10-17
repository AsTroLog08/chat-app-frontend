import { useSelector } from "react-redux";

export function useChat() {
  const { chats, currentChat, loadingChats,errorChats, loadingChatAction, errorChatAction } = useSelector((state) => state.chatStore);

  return {
    chats,
    currentChat,
    loadingChats,
    errorChats,
    loadingChatAction,
    errorChatAction
  };
}

