import React, { useState } from 'react';
import styles from './ChatList.module.css';
import ChatListItem from '../chatListItem/ChatListItem.jsx';
import { useDispatch } from 'react-redux';
import { fetchChat, modifyChat, removeChat } from '../../store/slices/chatSlice.js';
import ConfirmDialog from '../modals/confirmDialog/ConfirmDialog.jsx';
import ChatDialog from '../modals/chatDialog/ChatDialog.jsx';
import { useChat } from '../../hooks/useChat.js';
import { useNavigate } from 'react-router-dom';

const ChatList = ({ chats }) => {
  
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [chatToDelete, setChatToDelete] = useState({ id: null, name: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {currentChat} = useChat(); 
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [chatToEdit, setChatToEdit] = useState(null);
    if (!chats || chats.length === 0) { 
      return null;
    }



  const handleEditChat = (chatId) => {
        console.log('Редагувати чат з ID:', chatId);
        const chatData = chats.find(chat => chat.id === chatId);
        
        if (chatData) {
            setChatToEdit(chatData);
            setIsDialogOpen(true); 
        }
    };
    
    const handleEditSubmit = (editedData) => {

        const chatId = chatToEdit.id; 
        const updatePayload = {
            id: chatId,
            data: editedData 
        };

        dispatch(modifyChat(updatePayload));
        if(chatId == currentChat._id){
          dispatch(fetchChat(chatId));
        }
    
    };

    const handleCloseDialog = () => {
      setIsDialogOpen(false);
    };
    const handleConfirmOpen = (id, name) => {
        setChatToDelete({ id, name });
        setIsConfirmOpen(true);
    };

    const handleConfirmClose = () => {
        setIsConfirmOpen(false);
        setChatToDelete({ id: null, name: '' });
    };
  const handleChatDelete = () => {
      console.log('Видалити чат з ID:', chatToDelete.id);
       dispatch(removeChat(chatToDelete.id));
       navigate("/")
       handleConfirmClose();
  };

  return (
    <div className={styles.chatList}>
      {chats.map(chat => (
        <ChatListItem 
          key={chat.id} 
          id={chat.id} 
          name={chat.fullName} 
          lastMessage={chat.lastMessage} 
          avatarUrl={chat.avatarUrl} 
          date={chat.date} 
          active={chat.active} 
          onEdit={handleEditChat}
          onDeleteConfirm={handleConfirmOpen}
        />
      ))}
                  <ConfirmDialog 
                isOpen={isConfirmOpen} 
                onClose={handleConfirmClose} 
                onConfirm={handleChatDelete}
                chatName={chatToDelete.name}
            />
                        <ChatDialog
                            isOpen={isDialogOpen}
                            onClose={handleCloseDialog}
                            onSubmit={handleEditSubmit}
                            initialData={chatToEdit}
                        />
    </div>
  );
};

export default ChatList;