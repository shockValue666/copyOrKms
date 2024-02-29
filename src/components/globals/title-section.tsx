import React from 'react'

interface TitleSectionProps{
    title: string;
    subheading?:string;
    pill?:string;
}

//type of props of title

const TitleSection:React.FC<TitleSectionProps> = ({title,subheading
,pill}) => {
    //it receives as argumentst title, subheading and pill
  return (
    <React.Fragment>
        <section
            className='flex
            flex-col
            gap-4
            justify-center
            items-center
            md:items-center
            '
        >
            {/* column flex with between gap 4, the items are vertically aligned at start in big screens and in the center on medium and smaller screens */}

            <article className='rounded-full
            p-[1px]
            text-sm
            dark:bg-gradient-to-r
            dark:from-brand-primaryBlue
            dark:to-brand-primaryPurple'
            >
                {pill && (<div className='rounded-full
                px-3
                py-1
                dark:bg-black'>
                    {pill}
                </div>)}
            </article>
            {
                subheading ? <>
                    <h2 className='text-left
                    text-3xl
                    sm:text-5xl
                    sm:max-w-[750px]
                    md:text-center
                    font-semibold
                    '>
                        {
                            title
                        }
                    </h2>
                    <p className='dark:text-washed-purple-700
                    sm:max-w-[450px]
                    md:text-center
                    '>
                        {
                            subheading
                        }
                    </p>
                </> 
                : 
                <>
                    <h1 className='text-left
                    text-4xl
                    sm:text-6xl
                    sm:max-w-[850px]
                    md:text-center
                    font-semibold'>
                        {title}
                    </h1>
                </>
            }
        </section>
    </React.Fragment>
  )
}

export default TitleSection