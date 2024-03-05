"use client";
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/aW1RbmpcJVm
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CardTitle, CardDescription, CardContent, Card } from "@/components/ui/card"
import { Folder } from "@/lib/supabase/supabase.types"

interface DashProps{
  folders:Folder[]
}

export const Dash:React.FC<DashProps> = ({folders}) => {
  return (
    <div className='flex justify-center items-center'>
        <div className="flex flex-col h-[70%]">
        <header className="flex items-center h-14 border-b px-4 md:px-6">
            <Link className="flex items-center gap-2 font-semibold" href="#">
            <FolderOpenIcon className="h-6 w-6" />
            <span className="">Folders</span>
            </Link>
            <form className="ml-auto flex-1 md:mx-6">
            <Input
                className="w-full md:w-[300px] lg:w-[400px] xl:w-[500px] 2xl:w-[600px]"
                placeholder="Search folders..."
                type="search"
            />
            </form>
            <Button className="rounded-full w-8 h-8" size="icon" variant="ghost">
            <img
                alt="Avatar"
                className="rounded-full"
                height="32"
                src="/placeholder.svg"
                style={{
                aspectRatio: "32/32",
                objectFit: "cover",
                }}
                width="32"
            />
            <span className="sr-only">Toggle user menu</span>
            </Button>
        </header>
        <main className="flex-1 grid items-start p-4 gap-4 md:gap-8">
            <div className="flex items-center w-full">
            <div className="grid gap-2">
                <h1 className="font-semibold text-lg">My Folders ({folders.length})</h1>
                <p className="text-sm leading-none text-gray-500 dark:text-gray-400">
                Click on a folder to view its contents
                </p>
            </div>
            <Button className="ml-auto" size="sm">
                New Folder
            </Button>
            </div>
            <div className="grid gap-4 w-full">
              {
                folders.map(folder=>(
                  <Link href={`dashboard/${folder.id}`} key={folder.id}>
                    <Card>
                      <CardContent className="flex items-center gap-4">
                      <FolderOpenIcon className="h-6 w-6" />
                      <div className="grid gap-1.5 mt-2">
                          <CardTitle>{folder.title}</CardTitle>
                          <CardDescription>{folder.createdAt.toString()}</CardDescription>
                      </div>
                      <Button className="ml-auto w-8 h-8" size="icon">
                          <ChevronRightIcon className="h-4 w-4" />
                          <span className="sr-only">View folder</span>
                      </Button>
                      </CardContent>
                  </Card>
                  </Link>
                ))
              }
            </div>
        </main>
        </div>
    </div>
  )
}

function ChevronRightIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}


function FolderOpenIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

export default Dash