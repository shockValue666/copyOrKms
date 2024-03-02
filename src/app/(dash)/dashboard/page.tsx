import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import {db} from '@/lib/supabase/db'
import { redirect } from 'next/navigation'
import { getUserSubscriptionStatus } from '@/lib/supabase/queries'
// import DashboardSetup from '@/components/dashboard-setup/dashboard-setup'
import { Button } from '@/components/ui/button'
import DashboardSetup from '@/components/dashboard/dashboard-setup'

const Dashboard = async () => {
  cookies().getAll();

  const supabase  = createServerComponentClient({cookies})
  const {
    data:{user}
  } = await supabase.auth.getUser();


  if(!user) return;
  // const workspace=await db.query.folders.findFirst({
  //   where:(folder,{eq})=>eq(folder.folder,user.id)
  // })
  const folder = await db.query.folders.findFirst({
    where:(folder,{eq})=>eq(folder.folderOwner,user.id)
  })

  console.log("user: ",user, " folder: ",folder)

  const {data:subscription,error:subscriptionError} = await getUserSubscriptionStatus(user.id);
  if(subscriptionError) return;


  if(!folder || folder){
    return (
      <div className='bg-background h-screen w-screen flex justify-center items-center border border-green-500'>
        <div>
        <DashboardSetup user={user} subscription={subscription}></DashboardSetup>
        </div>
      </div>
    )
  }
  // redirect(`/dashboard/${workspace.id}`)
}

export default Dashboard


