import {useRef , useEffect} from 'react'
import {gsap} from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const ContactSection = ({ openContactForm }) => {
    const circleRef = useRef(null)
    const sectionRef = useRef(null)
    const initialTextRef = useRef(null)
    const finaltextRef = useRef(null)

    useEffect(()=>{
        gsap.registerPlugin(ScrollTrigger);
        //helper cleanup function
        const cleanup = () => {
            ScrollTrigger.getAll().forEach((st) => {
                if(st.vars.trigger === sectionRef.current){
                    st.kill(true)
                }
            })
        }

        cleanup()

        //set initial states
        gsap.set(circleRef.current, {scale:1, backgroundColor: "white"})
        gsap.set(initialTextRef.current, {opacity:1})
        gsap.set(finaltextRef.current, {opacity:0})

        //create timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=200%",
                pin: true,
                scrub: 0.5,
                anticipatePin: 1,
                fastScrollEnd: true,
                preventOverlaps: true,
                invalidateOnRefresh: true,
            }
                
        })

        //initial state to midzoom
        tl.to(
            circleRef.current,
            {
                scale:5,
                backgroundColor: "#9333EA",
                ease: "power1.inOut",
                duration:0.5,
            },
            0,
        )

        //fade out initial text
        tl.to(
            initialTextRef.current,
            {
                opacity:0,
                ease: "power1.Out",
                duration:0.2,
            },
            0.1,
        )

        //midzoom to final zoom
        tl.to(
            circleRef.current,
            {
                scale:17,
                backgroundColor: "#E9D5FF",
                boxShadow: "0 0 50px 20px rgba(233,213,255,0.3)",
                ease: "power2.inOut",
                duration:0.5,
            },
            0.5,
        )

        //fade in final text
        tl.to(
            finaltextRef.current,
            {
                opacity:1,
                ease: "power2.in",
                duration:0.2,
            },
            0.7,
        )

        //return cleanup function
        return cleanup
    },[])

  return (
    <section 
        ref={sectionRef}
        className='flex items-center justify-center bg-black relative '
    style={{overscrollBehavior:"none"}}>
        {/* simple circle */}
        <div
            ref={circleRef}
            className='w-24 sm:w-28 md:w-32 h-24 sm:h-32 rounded-full flex items-center justify-center relative transition-shadow duration-1000 shadow-violet-300/50 shadow-lg bg-gradient-to-r from-violet-400 to-pink-100'
        >
            <p
                className='text-black font-bold text-base sm:text-lg md:text-xl absolute inset-0 flex items-center text-center'
                ref={initialTextRef}            
            >
                Scroll down
            </p>

            {/* final text */}
            <div
                className='text-center relative flex flex-col items-center justify-center opacity-0'
                ref={finaltextRef}
            >
                <h1 className='text-black md:w-[10rem] w-[20rem] lg:scale-[0.4] sm:scale-[0.25] scale-[0.7] md:font-bold text-sm sm:text-base leading-none mb-5'>
                    Let's do something great together.
                </h1>

                <p className='text-black lg:w-[40rem] w-[20rem] absolute sm:mt-3 mt-1 md:scale-[0.1] scale-[0.068]'>
                    Feel free to reach out for collaborations or just a friendly hello. 
                    I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions. 
                    Let's connect and create something amazing together!
                </p>
                <button 
                    onClick={openContactForm}
                    className='px-10 py-2 rounded-xl bg-black hover:bg-white hover:text-black transition-all duration-500 scale-[0.1] absolute sm:mt-9 mt-7 text-nowrap'
                >
                    Contact Me
                </button>
            </div>
        </div>

    </section>
  )
}

export default ContactSection
