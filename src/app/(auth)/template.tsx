import React, { Suspense } from 'react'

interface TemplateProps{
    children: React.ReactNode
}

const Template:React.FC<TemplateProps> = ({
    children
}) => {
  return (
    <Suspense>
      <div className='h-screen p-6 flex justify-center border border-green-500'>{children}</div>
    </Suspense>
  )
}

export default Template