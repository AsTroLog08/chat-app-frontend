import { useSelector, useDispatch } from "react-redux";
import Toast from "./Toast.jsx";
import { removeToast } from "../../store/slices/toastSlice.js";

export default function ToastContainer() {
  const { list } = useSelector((state) => state.toast);
  const dispatch = useDispatch();

  const handleRemoveToast = (id) => dispatch(removeToast(id)); 

  return (
    <Toast
      toastList={list}
      position="topRight"
      autoDelete={true}
      autoDeleteTime={9000}
      deleteToast={handleRemoveToast}
    />
  );
}