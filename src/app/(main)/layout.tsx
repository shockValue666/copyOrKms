"use client";
import Navbar from '@/components/landing-page/Navbar'
import React from 'react'
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-textarea/styles.css"; // also import this if you want to use the CopilotTextarea component

interface LayoutProps{
    children:React.ReactNode
}

const layout:React.FC<LayoutProps> = ({
    children
}) => {
  return (

      <main>
        <Navbar/>
          <CopilotKit url="/">
            {children}
          </CopilotKit>
      </main>
  )
}

export default layout


//otan psaxnw files, kalo tha itan na ksekinaw apo to layout.tsx kai meata na pigainw page.tsx