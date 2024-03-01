import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
//creates a supabase client for a server component: 
//-a server component runs on the server-side
//-it's executed on the server before any content is sent to the client
// e.g. -when a user logs in on the client side, a cookie containing an authentication token might be set in the browser
//-later, when a request is made on the server component, it can access the cookies using context.cookies to ckeck
//if the user is authenticatied
//-if he is authenticatd the serverside can perform some shit
// import React, {useEffect} from 'react'

import { cookies } from 'next/headers'
// import db from '@/lib/supabase/db'
import { redirect } from 'next/navigation'
import { getUserSubscriptionStatus } from '@/lib/supabase/queries'
// import DashboardSetup from '@/components/dashboard-setup/dashboard-setup'
import { Button } from '@/components/ui/button'

const Dashboard = async () => {

  const supabase  = createServerComponentClient({cookies})
  const {
    data:{user}
  } = await supabase.auth.getUser();


  if(!user) return;
  // const workspace=await db.query.workspaces.findFirst({
  //   where:(workspace,{eq})=>eq(workspace.workspaceOwner,user.id)
  // })

  const {data:subscription,error:subscriptionError} = await getUserSubscriptionStatus(user.id);
  if(subscriptionError) return;


   if(true){
    return (
      <div className='bg-background h-screen w-screen flex justify-center items-center border border-green-500'>
        <div>
        {/* <DashboardSetup user={user} subscription={subscription}></DashboardSetup> */}
        </div>
      </div>
    )
  }
  // redirect(`/dashboard/${workspace.id}`)
}

export default Dashboard


