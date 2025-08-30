import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import TitleBar from './TitleBar'
import { useActiveTab } from '../contexts/ActiveTabContext'
import { Link } from 'react-router-dom'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
    const { activeTab, setActiveTab } = useActiveTab()

    const tabs = [
      { id: 'students', label: 'Students', path: '/dashboard/students' },
      { id: 'add-student', label: 'Add Student', path: '/dashboard/add-student' },
      { id: 'analytics', label: 'Analytics', path: '/dashboard/analytics' }
    ]
  

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TitleBar />
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-8 z-50">
        <div className="flex items-center justify-between px-6 py-2 max-w-7xl mx-auto">
          {/* <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1> */}
          {/* <nav className="card p-0 overflow-hidden"> */}
            {/* <div className="flex border-b border-gray-200"> */}
            <div className="flex">
              {tabs.map((tab) => (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`px-6 py-2 rounded font-medium transition-colors duration-200 border-b-3 ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-blue-600 bg-blue-50'
                      : 'text-gray-600 border-transparent hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          {/* </nav> */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 hidden sm:block">Welcome, {user?.username}</span>
            <button 
              onClick={handleLogout}
              className="btn-danger px-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 text-xs h-6"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full mt-6">
        {children}
      </main>
    </div>
  )
}

export default Layout
