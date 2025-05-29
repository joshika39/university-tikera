import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './styles/globals.css'
import App from './App'
import {BrowserRouter} from "react-router";
import {Provider} from "react-redux";
import {store} from "@/app/store";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App/>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)
