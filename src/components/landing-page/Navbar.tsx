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
import Logo from '../../../public/images/newLogo.png'

  

const Navbar = () => {
  const [path,setPath] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(true)
  return (
    <>
    <div className="flex">
        <div className="flex justify-between  p-4  w-[100%]">
            <Link href={'/'} className="flex justify-center items-center gap-2">
                <Image src={Logo}  width={50} height={50} alt="logo" className="rounded-lg"/>
                <span className="">FastNotesAI</span>
            </Link>
            <NavigationMenu className="md:block hidden">
                <NavigationMenuList className="gap-6">
                  <NavigationMenuItem onClick={() => setPath('#pricing')} 
                          className={cn({
                            'dark:text-white': path === '#pricing',
                            'dark:text-white/70': path !== '#pricing',
                            'font-normal': true,
                            'text-xl': true,
                          })}>
                      <Link href="/docs" legacyBehavior passHref>
                          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                          Getting Started
                          </NavigationMenuLink>
                      </Link>
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
                          Pricing
                          </NavigationMenuLink>
                      </Link>
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
                <div className="flex justify-center items-center gap-4">
                    <Link href={'/login'} className="p-[3px] relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                      <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                        Log In
                      </div>
                    </Link>
                    <Link href={'/signup'} className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                        Sign Up
                      </span>
                    </Link>
                </div>
        </div>
      </div>
        {/* Mobile Navbar */}
        <div>

        </div>
    </>
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