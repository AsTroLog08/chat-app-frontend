export function getOrCreateGuestId() {
    // Якщо користувач автентифікований, гостьовий ID не потрібен
    if (localStorage.getItem('authToken')) {
        return null; 
    }

    let guestId = localStorage.getItem("guest_id"); 
    
    if (!guestId) {
        // Генеруємо та зберігаємо новий унікальний ID, якщо він відсутній
        guestId = crypto.randomUUID(); 
        localStorage.setItem("guest_id", guestId); 
    }

    return guestId;
}