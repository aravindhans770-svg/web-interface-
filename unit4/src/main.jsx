import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Validation from './validation.jsx'
import Portfolio from './portfolio.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Validation/>
    <Portfolio/>
  </StrictMode>,
)
