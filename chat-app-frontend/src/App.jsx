import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { autoLogin } from "./store/slices/authSlice";
import MainPage from "./pages/mainPage/MainPage.jsx";
import "./styles/index.css"

function AppInitializer() {
    const dispatch = useDispatch();

    useEffect(() => {
        // Запуск логіки автоматичного входу лише один раз при монтуванні
        dispatch(autoLogin());
    }, [dispatch]);
    
    return null; 
}

function App() {

    return ( 
        <>
            <AppInitializer /> 
            
            <Routes>
                {/* 1. Кореневий шлях, що відображає список чатів (без вибраного ID) */}
                <Route path="/" element={<MainPage />} /> 
                
                {/* 2. Шлях для конкретного чату */}
                <Route path="chat/:id" element={<MainPage />} />
                
                {/* 3. Додамо маршрут 404/Not Found (Для підвищення стійкості) */}
                <Route path="*" element={<div>404 Page Not Found</div>} />
                
            </Routes>
        </>
    );
}

export default App;