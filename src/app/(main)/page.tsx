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


const page = () => {

  const handleClick = () => {
    // Handle the click event here
    console.log('Button clicked!');
  };
  
  return (
    <div className='flex flex-col justify-center items-center w-full border'>
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
        <TitleSection subheading='' title='Why use our app?' pill='Features' />
      </div>
      <div className=''>
        <Sample/>
      </div>
    </div>
  )
}

export default page