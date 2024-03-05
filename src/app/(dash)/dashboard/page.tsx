export const dynamic = "force-dynamic";
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import {db} from '@/lib/supabase/db'
import { getUserSubscriptionStatus } from '@/lib/supabase/queries'
// import DashboardSetup from '@/components/dashboard-setup/dashboard-setup'
import { Button } from '@/components/ui/button'
import DashboardSetup from '@/components/dashboard/dashboard-setup'
import { redirect } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@radix-ui/react-select';
import Link from 'next/link';
import Dash from '@/components/dashboard/dash';
import { Folder } from '@/lib/supabase/supabase.types';

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
  const folder = await db.query.folders.findMany({
    where:(folder,{eq})=>eq(folder.folderOwner,user.id)
  })

  console.log("user: ",user, " folder: ",folder)

  const {data:subscription,error:subscriptionError} = await getUserSubscriptionStatus(user.id);
  // if(subscriptionError) return;


  if(!folder || folder.length === 0){
    return (
      <div className='bg-background h-screen w-screen flex justify-center items-center'>
        <div>
        <DashboardSetup user={user} subscription={subscription}></DashboardSetup>
        </div>
      </div>
    )
   }else{
    return (
      <div className='w-full h-full'>
          <Dash folders={folder}/>
      </div>
    )
   }
  redirect(`/dashboard/${folder[0].id}`)
}

export default Dashboard





//else{
  //   return (
  //     <div className='bg-background h-screen w-screen flex justify-center items-center border border-green-500'>
  //       <ScrollArea className="h-72 w-48 rounded-md border">
  //         <div className="p-4">
  //           <h4 className="mb-4 text-sm font-medium leading-none">Folders</h4>
  //           {folder.map((f) => (
  //             <>
  //               <div key={f.id} className="text-sm">
  //                 {/* <Image/> */}
  //                 <Link key={f.id} href={`dashboard/${f.id}`}>{f.title}</Link>
  //               </div>
  //               {/* <Separator className="my-2" /> */}
  //             </>
  //           ))}
  //         </div>
  //       </ScrollArea>
  //     </div>
  //   )
  // }