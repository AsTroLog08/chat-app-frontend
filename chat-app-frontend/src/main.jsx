import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import store from './store/index.js';
import ToastContainer from './components/toastNotification/ToastContainer.jsx';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

root.render(
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <BrowserRouter> 
        <Provider store={store}>
          <StrictMode>
            <ToastContainer />
            <App/>
          </StrictMode>
        </Provider>
      </BrowserRouter> 
    </GoogleOAuthProvider>


);
