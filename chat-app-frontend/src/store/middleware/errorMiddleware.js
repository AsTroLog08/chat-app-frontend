const REJECTED_SUFFIX = "/rejected";

/**
 * Middleware для централізованої обробки помилок від Redux Thunks.
 * Обробляє дії, що закінчуються на '/rejected', та виводить/відображає повідомлення про помилку.
 */
export const errorMiddleware = () => next => action => {
  if (action.type.endsWith(REJECTED_SUFFIX) && action.payload) {
    const error = action.payload;
    let message = "An unknown error occurred.";

    // 1. Спробуємо отримати найбільш детальне повідомлення про помилку
    if (typeof error === "string") {
      message = error;
    } else if (error?.data?.message) {
      message = error.data.message;
    } else if (error?.message) {
      message = error.message;
    } else if (error?.error) {
      message = error.error;
    } 
    
    // 2. Якщо повідомлення не знайдено, використовуємо статус HTTP для узагальнених повідомлень
    else if (error?.status) {
      switch (error.status) {
        case 401:
          message = "unauthorized";
          break;
        case 403:
          message = "forbidden";
          break;
        case 404:
          message = "notFound";
          break;
        case 500:

          message = "serverError"; 
          break;
        default:
          message = `API Error (Status: ${error.status})`;
      }
    }

    // Логуємо для відладки
    console.warn("API Error Object:", error);
    console.warn("API Error Message:", message);
  }

  return next(action);
};