import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { ActiveTabProvider } from './contexts/ActiveTabContext'
import './index.css'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <ActiveTabProvider>
          <App />
        </ActiveTabProvider>
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>,
)
