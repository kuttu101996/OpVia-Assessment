import React from 'react'

// Extend Window interface to include electronAPI
declare global {
  interface Window {
    electronAPI: {
      minimizeWindow: () => void
      maximizeWindow: () => void
      closeWindow: () => void
    }
  }
}

const TitleBar: React.FC = () => {
  const handleMinimize = () => {
    if (window.electronAPI) 
      window.electronAPI.minimizeWindow()
  }

  // const handleMaximize = () => {
  //   if (window.electronAPI) {
  //     window.electronAPI.maximizeWindow()
  //   }
  // }

  const handleClose = () => {
    if (window.electronAPI) 
      window.electronAPI.closeWindow()
  }

  return (
    <div className="custom-title-bar flex justify-between fixed top-0 h-10 w-full items-center bg-gray-800 text-white h-8 px-4 select-none" style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}>
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Teacher Dashboard</span>
      </div>
      
      <div className="flex items-center space-x-1" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        {/* Minimize Button */}
        <button
          onClick={handleMinimize}
          className="w-6 h-6 flex items-center justify-center hover:bg-gray-600 rounded transition-colors"
          title="Minimize"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Maximize Button */}
        <button
          // onClick={handleMaximize}
          className="w-6 h-6 flex items-center justify-center rounded transition-colors text-gray-500"
          title="Maximize"
          disabled
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="2" y="2" width="8" height="8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          </svg>
        </button>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="w-6 h-6 flex items-center justify-center hover:bg-red-600 rounded transition-colors"
          title="Close"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default TitleBar
