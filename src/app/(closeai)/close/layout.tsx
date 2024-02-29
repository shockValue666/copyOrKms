"use client";
import Navbar from '@/components/landing-page/Navbar'
import React, { useState } from 'react'
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-textarea/styles.css"; // also import this if you want to use the CopilotTextarea component
import { AiContext } from '@/lib/providers/ai-context-provider';

interface LayoutProps{
    children:React.ReactNode
}

const layout:React.FC<LayoutProps> = ({
    children
}) => {
  const [aictx,setAictx] = useState(0)
  return (

      <main>
        <Navbar/>
          <CopilotKit url="/api/copilot/closeai">
            <AiContext.Provider value={aictx} >
              {children}
            </AiContext.Provider>
          </CopilotKit>
      </main>
  )
}

export default layout


//otan psaxnw files, kalo tha itan na ksekinaw apo to layout.tsx kai meata na pigainw page.tsx