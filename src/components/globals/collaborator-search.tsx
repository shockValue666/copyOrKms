import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';
import { User } from '@/lib/supabase/supabase.types';
import React, { useEffect, useRef, useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar } from '../ui/avatar';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Button } from '../ui/button';
import { getUsersFromSearch } from '@/lib/supabase/queries';


interface CollaboratorSearchProps{
    existingCollaborators: User[] | [];
    getCollaborator:(collaborator:User)=>void;
    children:React.ReactNode
    
}

const CollaboratorSearch:React.FC<CollaboratorSearchProps> = ({
  children,
  getCollaborator,
  existingCollaborators
}) => {
  const {user} = useSupabaseUser();
  const [searchResults,setSearchResults] = useState<User[] | []>([
    // {
    //   id: "1",
    //   email: "john.doe@example.com",
    //   avatarUrl: "https://example.com/avatar/johndoe.jpg",
    //   fullName: "John Doe",
    //   billingAddress: "123 Main Street, Anytown, USA",
    //   paymentMethod: "Visa ending in 1234",
    //   updatedAt: "2024-02-11T12:30:45Z"
    // },
    // {
    //   id: "2",
    //   email: "jane.smith@example.com",
    //   avatarUrl: "https://example.com/avatar/janesmith.jpg",
    //   fullName: "Jane Smith",
    //   billingAddress: "456 Elm Street, Springfield, USA",
    //   paymentMethod: "Mastercard ending in 5678",
    //   updatedAt: "2024-02-10T14:20:30Z"
    // },
    // {
    //   id: "3",
    //   email: "alex.johnson@example.com",
    //   avatarUrl: "https://example.com/avatar/alexjohnson.jpg",
    //   fullName: "Alex Johnson",
    //   billingAddress: "789 Oak Avenue, Anytown, USA",
    //   paymentMethod: "PayPal",
    //   updatedAt: "2024-02-09T09:15:00Z"
    // },
    // {
    //   id: "4",
    //   email: "sarah.williams@example.com",
    //   avatarUrl: "https://example.com/avatar/sarahwilliams.jpg",
    //   fullName: "Sarah Williams",
    //   billingAddress: "101 Pine Street, Anytown, USA",
    //   paymentMethod: "American Express ending in 9012",
    //   updatedAt: "2024-02-08T18:00:20Z"
    // },
    // {
    //   id: "5",
    //   email: "michael.brown@example.com",
    //   avatarUrl: "https://example.com/avatar/michaelbrown.jpg",
    //   fullName: "Michael Brown",
    //   billingAddress: "321 Cedar Avenue, Springfield, USA",
    //   paymentMethod: "Discover ending in 3456",
    //   updatedAt: "2024-02-07T16:45:10Z"
    // }                    
  ]);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(()=>{
    if(timerRef.current) clearTimeout(timerRef.current);
  },[])

  const onChangeHandler = (e:React.ChangeEvent<HTMLInputElement>) => {
    if(timerRef) clearTimeout(timerRef.current);
    timerRef.current=setTimeout( async ()=>{
      const res = await getUsersFromSearch(e.target.value);
      setSearchResults(res)
    },450)
  }
  const addCollaborator = (collaborator:User) => {
    getCollaborator(collaborator);
  }

  return (
    <Sheet>
      <SheetTrigger className='w-full'>{children}</SheetTrigger>
      <SheetContent className='w-[400px] sm:w-[540px]'>
        <SheetHeader>
          <SheetTitle>
            Search Collaborator
          </SheetTitle>
          <SheetDescription>
            <p className='text-sm text-muted-foreground'>
              You can also remove collaborators after adding them in the settings tabs
            </p>
          </SheetDescription>
        </SheetHeader>
        <div className='flex justify-center items-center gap-2 mt-2'>
          <Search  />
          <Input name="name" className='dark:bg-background' placeholder='email' onChange={onChangeHandler}/>
        </div>
        <ScrollArea className='mt-6 overflow-y-scroll w-full rounded-md'>
          {searchResults.filter((result)=>!existingCollaborators.some((existing)=>existing.id===result.id)).filter(result=>result.id!==user?.id).map((user)=>(<div className='p-4 flex justify-between items-center' key={user.id}>
            <div className='flex gap-4 items-center'>
              <Avatar className='w-8 h-8'>
                <AvatarImage src={"/images/avatars/6.png" || user.avatarUrl}/>
                <AvatarFallback>
                  CP
                </AvatarFallback>
              </Avatar>
              <div className='text-sm gap-2 overflow-hidden overflow-ellipsis w-[180px] text-muted-foreground'>
                {user.email}
              </div>
            </div>
            <Button variant={"secondary"} type="button" onClick={()=>addCollaborator(user)}>
              Add
            </Button>
          </div>))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export default CollaboratorSearch