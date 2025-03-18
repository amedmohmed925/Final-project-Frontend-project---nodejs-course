import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import  store  from './app/store';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'animate.css/animate.min.css';
import ReactGA from "react-ga4";
ReactGA.initialize("G-RLYT7ZPRKQ"); // استبدل G-XXXXXXX بالـ ID بتاعك
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <App />
</Provider>
)
