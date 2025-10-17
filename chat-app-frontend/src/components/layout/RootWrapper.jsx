/*import React, { useEffect, useRef } from 'react';
import { useUser } from "../../hooks/useUser";
import { initializeAuth } from '../../store/index';*/
import App from '../../App.jsx';
import "../../styles/index.css";

const RootWrapper = () => {/*
  const { isLoading, error } = useUser();

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      console.log("Ініціалізація вже була виконана, пропускаємо");
      return;
    }

    const init = async () => {
      console.log("initializeAuth починається");
      initialized.current = true;
      await initializeAuth();
      console.log("initializeAuth завершився");
    };
    
    init();
  }, []);

  if (error) {
    return (
      <div className='loaderMain'>
        Сталась помилка
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='loaderMain'>
        Завантаження...
      </div>
    );
  }
*/
  return (
     <App />
  );
};

export default RootWrapper;
