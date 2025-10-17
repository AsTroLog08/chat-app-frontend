import React, { useState } from 'react';
import styles from './ChatList.module.css';
import ChatListItem from '../chatListItem/ChatListItem.jsx';
import { useDispatch } from 'react-redux';
import { modifyChat, removeChat } from '../../store/slices/chatSlice.js';
import ConfirmDialog from '../modals/confirmDialog/ConfirmDialog.jsx';
import ChatDialog from '../modals/chatDialog/ChatDialog.jsx';

const ChatList = ({ chats }) => {
  
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [chatToDelete, setChatToDelete] = useState({ id: null, name: '' });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [chatToEdit, setChatToEdit] = useState(null);
  if (!chats || chats.length === 0) { 
    return null;
  }
    const dispatch = useDispatch();


const handleEditChat = (chatId) => {
        console.log('Редагувати чат з ID:', chatId);
        // 1. Знаходимо поточні дані чату за ID
        const chatData = chats.find(chat => chat.id === chatId);
        
        // 2. Встановлюємо знайдені дані у chatToEdit (для initialData)
        //    Якщо не знайдено, краще не відкривати діалог.
        if (chatData) {
            setChatToEdit(chatData);
            setIsDialogOpen(true); // 3. Відкриваємо діалог
        }
    };
    
    const handleEditSubmit = (editedData) => {

        const chatId = chatToEdit.id; // Отримуємо ID з об'єкта чату
        const updatePayload = {
            id: chatId,
            data: editedData // editedData - це { firstName, lastName }
        };

        dispatch(modifyChat(updatePayload));
      
        // Діалог закривається автоматично через onClose() всередині ChatDialog
    };

    // Функція закриття діалогу (передаємо як onClose)
    const handleCloseDialog = () => {
      setIsDialogOpen(false);
    };
    const handleConfirmOpen = (id, name) => {
        setChatToDelete({ id, name });
        setIsConfirmOpen(true);
    };

    // 2. Функція, що закриває діалог (для кнопки "Скасувати")
    const handleConfirmClose = () => {
        setIsConfirmOpen(false);
        setChatToDelete({ id: null, name: '' }); // Очистити дані
    };
  const handleChatDelete = () => {
      console.log('Видалити чат з ID:', chatToDelete.id);
       dispatch(removeChat(chatToDelete.id));
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
          onEdit={handleEditChat}     // Передаємо функцію редагування
          onDeleteConfirm={handleConfirmOpen}  // Передаємо функцію видалення
        />
      ))}
                  <ConfirmDialog 
                isOpen={isConfirmOpen} 
                onClose={handleConfirmClose} 
                onConfirm={handleChatDelete} // Функція, що виконує видалення
                chatName={chatToDelete.name} // Ім'я для відображення в модальному вікні
            />
                        <ChatDialog
                            isOpen={isDialogOpen}
                            onClose={handleCloseDialog} // Передаємо функцію для закриття
                            onSubmit={handleEditSubmit} // Передаємо функцію для обробки даних
                            initialData={chatToEdit}
                        />
    </div>
  );
};

export default ChatList;