import { useSelector, useDispatch } from "react-redux";
import Toast from "./Toast.jsx";
import { removeToast } from "../../store/slices/toastSlice.js";

export default function ToastContainer() {
  const { list } = useSelector((state) => state.toast);
  const dispatch = useDispatch();

  // Функція, яка видаляє тост через Redux
  const handleRemoveToast = (id) => dispatch(removeToast(id)); // 👈 Додамо цю функцію

  return (
    <Toast
      toastList={list}
      position="topRight"
      autoDelete={true}
      autoDeleteTime={9000}
      // Передаємо функцію видалення з Redux
      deleteToast={handleRemoveToast} // 👈 Передаємо в пропси
    />
  );
}