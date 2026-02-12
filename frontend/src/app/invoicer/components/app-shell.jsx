import React from 'react'
import AppHeader from './app-header'
import SideBar from './sidebar'

const AppShell = () => {
  return (
    <div className="antialiased bg-gray-50 dark:bg-gray-900">
    

          <AppHeader />
          <SideBar />

  

    <main className="p-4 md:ml-64 h-auto pt-20">
     
    </main>

  </div>
  )
}

export default AppShell