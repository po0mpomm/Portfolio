import {useRef ,useEffect} from 'react';
import { gsap } from 'gsap';

const CustomCursor = () => {
    //refs 
    const cursorRef = useRef(null);
    const cursorBorderRef = useRef(null);
    //hide cursor on mobile
    const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width:768px)").matches

    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if(isMobile || prefersReducedMotion){
        return null;
    }
    useEffect(()=>{
        //get cursor elements
        const cursor = cursorRef.current
        const cursorBorder = cursorBorderRef.current

        //initial position off-screen
        gsap.set([cursor,cursorBorder],{
            xPercent:-50,
            yPercent:-50,
        })

        //variables for cursor
        const xTo = gsap.quickTo(cursor,"x", {
            duration:0.2, ease: "power3.out"
        })
        const yTo = gsap.quickTo(cursor, "y",{
            duration:0.2,ease: "power3.out"
        })
        const xToBorder = gsap.quickTo(cursorBorder,"x", {
            duration:0.5, ease: "power3.out"
        })
        const yToBorder = gsap.quickTo(cursorBorder,"y", {
            duration:0.5, ease: "power3.out"
        })

        // rAF batching for mousemove
        let lastX = 0
        let lastY = 0
        let rafId = null

        const applyPos = () => {
            xTo(lastX)
            yTo(lastY)
            xToBorder(lastX)
            yToBorder(lastY)
            rafId = null
        }

        const handlemouseMove = (e) =>{
            lastX = e.clientX
            lastY = e.clientY
            if(rafId === null){
                rafId = requestAnimationFrame(applyPos)
            }
        }

        //mouse listner
        window.addEventListener("mousemove",handlemouseMove, { passive: true })

        //click animation
        const handleMouseDown = ()=>{
            gsap.to([cursor,cursorBorder],{
                scale:0.6,
                duration:0.2,
            })
        }

        const handleMouseUp = ()=>{
            gsap.to([cursor,cursorBorder],{
                scale:1,
                duration:0.2,
            })
        }

        document.addEventListener("mousedown",handleMouseDown, { passive: true })
        document.addEventListener("mouseup",handleMouseUp, { passive: true })

        return () => {
            window.removeEventListener("mousemove", handlemouseMove)
            document.removeEventListener("mousedown", handleMouseDown)
            document.removeEventListener("mouseup", handleMouseUp)
            if (rafId) cancelAnimationFrame(rafId)
        }

    },[])
  return (
    <>
        {/* Main dot */}
        <div ref={cursorRef} className='fixed top-0 left-0 w-[20px] h-[20px] bg-white rounded-full pointer-events-none z-[999] mix-blend-difference'/>
        <div ref={cursorBorderRef}
            className='fixed top-0 left-0 w-[40px] h-[40px] border rounded-full border-white pointer-events-none z-[999] mix-blend-difference opacity-50 '   
        />
    </>
  )
}

export default CustomCursor
