export function getOrCreateGuestId() {
  // Перевіряємо, чи користувач автентифікований
  if (localStorage.getItem('authToken')) {
    // Якщо є токен, Guest ID не потрібен
    return null; 
  }

  let guestId = localStorage.getItem("guest_id"); // Перевіряємо наявність guest_id
  if (!guestId) {
    guestId = crypto.randomUUID(); 
    localStorage.setItem("guest_id", guestId); // Зберігаємо новий guest_id
  }

  return guestId;
}
