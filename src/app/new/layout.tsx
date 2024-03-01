"use client";
import Navbar from '@/components/landing-page/Navbar'
import React, { useState } from 'react'

interface LayoutProps{
    children:React.ReactNode
}

const Layout:React.FC<LayoutProps> = ({
    children
}) => {
  const [aictx,setAictx] = useState(0)
  return (

      <main>
        <Navbar/>
              {children}
          
      </main>
  )
}

export default Layout
