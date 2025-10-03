import { useState, useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion } from "framer-motion"
import { TiLocationArrow } from "react-icons/ti"

// Tilt wrapper
export const BentoTilt = ({ children, className = "" }) => {
  const itemRef = useRef(null)
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (!itemRef.current || prefersReducedMotion) return

    let rafId = null
    let lastX = 0
    let lastY = 0
    let isInside = false

    const applyTilt = () => {
      if (!itemRef.current) return
      const { left, top, width, height } = itemRef.current.getBoundingClientRect()
      const relativeX = (lastX - left) / width
      const relativeY = (lastY - top) / height
      const tiltX = (relativeY - 0.5) * 12
      const tiltY = (relativeX - 0.5) * -12
      itemRef.current.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95, .95, .95)`
      rafId = null
    }

    const handleMouseMove = (event) => {
      lastX = event.clientX
      lastY = event.clientY
      if (!rafId) rafId = requestAnimationFrame(applyTilt)
    }

    const handleMouseEnter = () => {
      isInside = true
    }

    const handleMouseLeave = () => {
      isInside = false
      if (itemRef.current) itemRef.current.style.transform = ''
    }

    const el = itemRef.current
    el.addEventListener('mousemove', handleMouseMove, { passive: true })
    el.addEventListener('mouseenter', handleMouseEnter, { passive: true })
    el.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseenter', handleMouseEnter)
      el.removeEventListener('mouseleave', handleMouseLeave)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [prefersReducedMotion])

  return (
    <div
      ref={itemRef}
      className={`transition-transform duration-300 will-change-transform ${className}`}
    >
      {children}
    </div>
  )
}

// Project Card with scroll animations
export const BentoCard = ({ src, title, link, width=544, height=352, index }) => {
  const hoverButtonRef = useRef(null)
  const spotlightRef = useRef(null)
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const handleClick = (e) => {
    e.preventDefault()

    if (link === window.location.origin) {
      window.location.reload()
    } else {
      window.open(link, "_blank", "noopener,noreferrer")
    }
  }

  useEffect(() => {
    if (!hoverButtonRef.current || prefersReducedMotion) return
    let rafId = null
    let lx = 0, ly = 0
    const update = (x, y) => {
      if (!spotlightRef.current) return
      spotlightRef.current.style.opacity = '1'
      spotlightRef.current.style.background = `radial-gradient(120px circle at ${x}px ${y}px, #656fe288, #00000026)`
    }
    const onMove = (e) => {
      const rect = hoverButtonRef.current.getBoundingClientRect()
      lx = e.clientX - rect.left
      ly = e.clientY - rect.top
      if (!rafId) rafId = requestAnimationFrame(() => { update(lx, ly); rafId = null })
    }
    const onEnter = () => { if (spotlightRef.current) spotlightRef.current.style.opacity = '1' }
    const onLeave = () => { if (spotlightRef.current) spotlightRef.current.style.opacity = '0' }
    const el = hoverButtonRef.current
    el.addEventListener('mousemove', onMove, { passive: true })
    el.addEventListener('mouseenter', onEnter, { passive: true })
    el.addEventListener('mouseleave', onLeave, { passive: true })
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [prefersReducedMotion])

  // Animation variants for scroll reveal - MacbookScroll style
  const projectVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <motion.div 
      className="relative w-[30rem] h-[20rem] md:w-[34rem] md:h-[22rem] rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-lg cursor-pointer hover:scale-105 hover:shadow-2xl transition-all"
      variants={projectVariants}
      whileHover={{ 
        scale: 1.05, 
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        transition: { duration: 0.3, ease: "easeOut" }
      }}
    >
      <img
        src={src}
        alt={title}
        className="absolute left-0 top-0 w-full h-full object-cover"
        loading="lazy"
        width={width}
        height={height}
      />
      <div className="relative z-10 flex flex-col justify-between h-full w-full p-6 bg-gradient-to-t from-black/70 via-black/30 to-transparent text-white">
        {/* Title */}
        <h2 className="text-xl md:text-3xl font-bold flex items-center gap-2">
          {title}
        </h2>

        {/* Hover Button */}
        <button
          onClick={handleClick}
          className="border-hsla relative flex w-fit cursor-pointer items-center gap-2 overflow-hidden rounded-full bg-black px-6 py-2 text-xs uppercase text-white/70 mt-4 will-change-transform"
          ref={hoverButtonRef}
        >
          <div
            ref={spotlightRef}
            className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
          />
          <TiLocationArrow className="relative z-20" />
          <p className="relative z-20">View Project</p>
        </button>
      </div>
    </motion.div>
  )
}

const ProjectsSection = () => {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const titleLineRef = useRef(null)
  const gridRef = useRef(null)

  // Container animation variants for staggered effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // delay between cards
      },
    },
  }

  const projectImages = [
    {
      id: 1,
      title: "LyfeIndex Website",
      imageSrc: "/images/project-1.png",
      link: "https://www.behance.net/gallery/219358429/Redesigned-LyfeIndex-Website",
    },
    {
      id: 2,
      title: "Edsynapse Website",
      imageSrc: "/images/project-2.png",
      link: "https://www.behance.net/gallery/219360589/Edsynapse-Website-Design",
    },
    {
      id: 3,
      title: "3D Portfolio Website",
      imageSrc: "/images/project-3.png",
      link: window.location.origin,
    },
    {
      id: 4,
      title: "Cyber Conclave",
      imageSrc: "/images/project-4.png",
      link: "https://www.behance.net/gallery/219362827/Cyber-Conclave-Web-Design",
    },
    {
      id: 5,
      title: "Kahani Manch",
      imageSrc: "/images/project-5.png",
      link: "https://www.behance.net/gallery/219359247/VIT-BHOPALs-Hindi-Club-Website-Design",
    },
    {
      id: 6,
      title: "KYC Verification App",
      imageSrc: "/images/project-6.png",
      link: "https://www.behance.net/gallery/234083887/KYC-Verification-app",
    },
    {
      id: 7,
      title: "College Fest Website",
      imageSrc: "/images/project-7.png",
      link: "https://www.behance.net/gallery/219363507/College-fest-Web-Design",
    },
    {
      id: 8,
      title: "LyfeIndex Website",
      imageSrc: "/images/project-8.png",
      link: "https://www.behance.net/gallery/219360277/Redesigned-LyfeIndex-Website",
    },
  ]

  // GSAP Animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    gsap.fromTo(
      titleRef.current,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    )

    gsap.fromTo(
      titleLineRef.current,
      { width: "0%", opacity: 0 },
      {
        width: "100%",
        opacity: 1,
        duration: 1.5,
        delay: 0.3,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    )
  }, [])

  return (
    <section 
      ref={sectionRef} 
      className="bg-gradient-to-b from-[#9a74cf50] to-black py-20"
    >
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 opacity-0"
          >
            Feature Projects
          </h2>
          <div
            ref={titleLineRef}
            className="w-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full opacity-0"
          />
        </div>

        {/* Grid */}
        <motion.div 
          ref={gridRef}
          className="flex flex-wrap justify-center gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {projectImages.map((project, index) => (
            <BentoTilt key={project.id}>
              <BentoCard
                src={project.imageSrc}
                title={project.title}
                link={project.link}
                index={index}
              />
            </BentoTilt>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default ProjectsSection
