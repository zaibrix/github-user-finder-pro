import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom' // 👈 Import this

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter> {/* 👈 Wrap App inside this */}
    <App />
  </BrowserRouter>,
)