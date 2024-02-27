"use client";
import Link from "next/link"
 
import { cn } from "@/lib/utils"
// import { Icons } from "@/components/icons"
import React, { useState } from 'react'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"
import Image from "next/image";
import Logo from '../../../public/images/logo.png'

const components: { title: string; href: string; description: string }[] = [
{
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
    "A modal dialog that interrupts the user with important content and expects a response.",
},
{
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
    "For sighted users to preview content available behind a link.",
},
{
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
    "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
},
{
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
},
{
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
    "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
},
{
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
    "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
},
]
  

const Navbar = () => {
  const [path,setPath] = useState("")
  return (
    <div className="sm:flex justify-center items-center p-4">
        <Link href={'/'} className="absolute left-[5%] flex justify-center items-center gap-2">
            <Image src={Logo}  width={50} height={50} alt="logo"/>
            <span className="">Logo</span>
        </Link>
        <NavigationMenu className="block">
            <NavigationMenuList className="gap-6">
                <NavigationMenuItem>
                    <NavigationMenuTrigger onClick={()=>{setPath("home")}} className={cn({
                      'dark:text-white': path === '#resources',
                      'dark:text-white/70': path !== '#resources',
                      'font-normal': true,
                      'text-xl': true,
                    })}>Getting started</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                        <li className="row-span-3">
                            <NavigationMenuLink asChild>
                            <a
                                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                href="/"
                            >
                                {/* <Icons.logo className="h-6 w-6" /> */}
                                <div className="mb-2 mt-4 text-lg font-medium">
                                shadcn/ui
                                </div>
                                <p className="text-sm leading-tight text-muted-foreground">
                                Beautifully designed components that you can copy and
                                paste into your apps. Accessible. Customizable. Open
                                Source.
                                </p>
                            </a>
                            </NavigationMenuLink>
                        </li>
                        <ListItem href="/docs" title="Introduction">
                            Re-usable components built using Radix UI and Tailwind CSS.
                        </ListItem>
                        <ListItem href="/docs/installation" title="Installation">
                            How to install dependencies and structure your app.
                        </ListItem>
                        <ListItem href="/docs/primitives/typography" title="Typography">
                            Styles for headings, paragraphs, lists...etc
                        </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                <NavigationMenuTrigger  onClick={() => setPath('#pricing')} 
                  className={cn({
                    'dark:text-white': path === '#pricing',
                    'dark:text-white/70': path !== '#pricing',
                    'font-normal': true,
                    'text-xl': true,
                  })}>Pricing</NavigationMenuTrigger>
                <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {components.map((component) => (
                        <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                        >
                        {component.description}
                        </ListItem>
                    ))}
                    </ul>
                </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem onClick={() => setPath('#pricing')} 
                    className={cn({
                      'dark:text-white': path === '#pricing',
                      'dark:text-white/70': path !== '#pricing',
                      'font-normal': true,
                      'text-xl': true,
                    })}>
                <Link href="/docs" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Documentation
                    </NavigationMenuLink>
                </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
            </NavigationMenu>
            <Link href={'/'} className="absolute right-[5%] flex justify-center items-center gap-4">
                <button className="p-[3px] relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                  <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                    Log In
                  </div>
                </button>
                <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                    Sign Up
                  </span>
                </button>
            </Link>
    </div>
  )
}
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

export default Navbar