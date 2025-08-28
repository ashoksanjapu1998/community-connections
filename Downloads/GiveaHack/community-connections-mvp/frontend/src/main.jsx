
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'
import { handleCallback } from './auth'

createRoot(document.getElementById('root')).render(<App />)
handleCallback().then((ok) => {
  if (ok) window.history.replaceState({}, '', '/'); // clean URL after login
});
