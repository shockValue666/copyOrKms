"use client";
import React from 'react'
import Banner from '../../../public/images/appBanner.png'
import Cal from '../../../public/images/cal.png'
import Diamond from '../../../public/images/icons/diamond.svg'
import CheckIcon from '../../../public/images/icons/check.svg'
import MainShit from '@/components/landing-page/MainShit'
import TitleSection from '@/components/globals/title-section'
import {Button as MovingButton} from '@/components/ui/moving-border'
import Image from 'next/image'
import Sample from '@/components/landing-page/Sample';
import { CLIENTS } from '@/lib/constants';
import SelfGeneratingShit from '@/components/landing-page/SelfGeneratingShit';


const page = () => {

  const handleClick = () => {
    // Handle the click event here
    console.log('Button clicked!');
  };
  
  return (
    <div className='flex flex-col justify-center items-center w-full '>
      <div className='my-[2%] '>
        <TitleSection subheading='' title='' pill='Take notes fast and efficiently ✨ ' />
      </div>
      <MainShit/>
      <div>
        <button className="p-[3px] relative" onClick={handleClick}>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
          <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
            Try it now!
          </div>
        </button>
      </div>
      <div>
        <div className='sm:w-full w-full flex justify-center items-center sm:ml-0 ml-[-50px]'>
            <Image src={Banner} alt={'Application Banner'}/>
            <div className='bottom-0 bg-gradient-to-t left-0 right-0 absolute z-10'>
            </div>
          </div>
      </div>
      <div className='my-[2%]'>
        <TitleSection subheading='' title='Export text to:' pill='Features' />
      </div>
      <div className='w-[50%]'>
        {/* <Sample/> */}
      </div>
      <div>
      <section className="relative">
            <div
              className="overflow-hidden
              flex
              after:content['']
              after:dark:from-brand-dark
              after:to-transparent
              after:from-background
              after:bg-gradient-to-l
              after:right-0
              after:bottom-0
              after:top-0
              after:w-20
              after:z-10
              after:absolute

              before:content['']
              before:dark:from-brand-dark
              before:to-transparent
              before:from-background
              before:bg-gradient-to-r
              before:left-0
              before:top-0
              before:bottom-0
              before:w-20
              before:z-10
              before:absolute
            "
            >
              {[...Array(2)].map((_,index) => (
                <div
                  key={index}
                  className="flex
                    flex-nowrap
                    animate-slide
              "
                >
                  {CLIENTS.map((client) => (
                    <div
                      key={client.alt}
                      className=" relative
                        w-[200px]
                        m-20
                        shrink-0
                        flex
                        items-center
                      "
                    >
                      <Image
                        src={client.logo}
                        alt={client.alt}
                        width={200}
                        className="object-contain max-w-none"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
      </div>
      <div>
        {/* <SelfGeneratingShit/> */}
      </div>
    </div>
  )
}

export default page