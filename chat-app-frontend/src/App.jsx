import { useDispatch } from "react-redux";
import { Routes,Route } from "react-router-dom";
import { useEffect } from "react";
import { autoLogin } from "./store/slices/authSlice";
import MainPage from "./pages/mainPage/MainPage.jsx";

function AppInitializer() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(autoLogin());
    }, [dispatch]);
    
    return null; 
}

function App() {

  return (    
  <>
      <AppInitializer /> 
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="chat/:id" element={<MainPage />} />
      </Routes>
  </>)

}

export default App
