// import Header from '@/components/landing-page/header'
import React from 'react'

interface LayoutProps{
    children:React.ReactNode
}

const layout:React.FC<LayoutProps> = ({
    children
}) => {
  return (
    <main>
      {/* <Header/> */}
        {children}
    </main>
  )
}

export default layout


//otan psaxnw files, kalo tha itan na ksekinaw apo to layout.tsx kai meata na pigainw page.tsx