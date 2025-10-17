import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import store from './store/index.js';
import RootWrapper from './components/layout/RootWrapper.jsx';
import ToastContainer from './components/toastNotification/ToastContainer.jsx';
import { BrowserRouter } from 'react-router-dom';
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

root.render(
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <BrowserRouter> 
        <Provider store={store}>
          <StrictMode>
            <RootWrapper />
            <ToastContainer />
          </StrictMode>
        </Provider>
      </BrowserRouter> 
    </GoogleOAuthProvider>


);
