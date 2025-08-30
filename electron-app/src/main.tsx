import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { ActiveTabProvider } from './contexts/ActiveTabContext'
import './index.css'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ActiveTabProvider>
          <App />
        </ActiveTabProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
