import React from 'react'
import { Toaster } from "@/components/ui/toaster"
// import { SubscriptionModalProvider } from '@/lib/providers/subscription-modal-provider';
// import { getActiveProductsWithPrice } from '@/lib/supabase/queries';

interface LayoutProps{
    children:React.ReactNode;
    params:any;
}

const Layout:React.FC<LayoutProps> = ({children,params}) => {
//   const {data:products,error} = await getActiveProductsWithPrice();
//   if(error) throw new Error('Error fetching products');
  return (
    <main className='flex overflow-hidden h-screen'>
      {/* <SubscriptionModalProvider products={products || []}> */}
          {children}
      {/* </SubscriptionModalProvider> */}
        <Toaster />
    </main>
  )
}

export default Layout