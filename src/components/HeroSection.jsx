import { motion } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";
import "./SplineScene.css";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import Spline from "@splinetool/react-spline";

const HeroSection = () => {
  const [showSpline, setShowSpline] = useState(false)
  const containerRef = useRef(null)
  const particlesInit = async (engine) => {
    await loadSlim(engine)
  }
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isMobile = typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

  // Mount Spline only while visible in viewport
  useEffect(() => {
    if (prefersReducedMotion) return
    const el = containerRef.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      const visible = entries[0]?.isIntersecting ?? false
      setShowSpline(visible)
    }, { rootMargin: '100px', threshold: 0.1 })
    io.observe(el)
    return () => io.disconnect()
  }, [prefersReducedMotion])

  const handleDownload = () => {
    fetch("/Resume.pdf").then((res) => {
      res.blob().then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "resume.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      });
    });
  };

  // Static twinkling starfield
  const starfieldOptions = useMemo(() => ({
    fullScreen: false,
    background: { color: { value: "transparent" } },
    fpsLimit: 45,
    detectRetina: true,
    interactivity: {
      detectsOn: "window",
      events: {
        onHover: { enable: true, mode: [], parallax: { enable: true, force: 18, smooth: 20 } },
        onClick: { enable: false },
        resize: true
      },
      modes: {}
    },
    particles: {
      number: { value: isMobile ? 28 : 70, density: { enable: true, area: 800 } },
      color: { value: ["#ffffff", "#9b6bff", "#15c0c0", "#93c5fd"] },
      shape: { type: "circle" },
      opacity: {
        value: 0.8,
        random: { enable: true, minimumValue: 0.35 },
        animation: { enable: true, speed: 0.35, minimumValue: 0.2, sync: false }
      },
      size: { value: { min: 0.8, max: 2.2 } },
      links: { enable: false },
      move: {
        enable: true,
        speed: 0.22,
        direction: "none",
        random: true,
        straight: false,
        outModes: { default: "out" },
        attract: { enable: false }
      }
    },
  pauseOnBlur: true,
  pauseOnOutsideViewport: true,
  reduceDuplicates: true
  }), [isMobile])

  // Shooting stars (meteors) configuration
  const meteorOptions = useMemo(() => ({
    fullScreen: false,
    background: { color: { value: "transparent" } },
    fpsLimit: 45,
    detectRetina: true,
    interactivity: { events: { resize: true } },
    particles: {
      number: { value: isMobile ? 0.6 : 1.2, density: { enable: true, area: 800 } },
      color: { value: ["#ffffff", "#a8e6ff"] },
      shape: { type: "line" },
      stroke: { width: 1, color: { value: "#a8e6ff" } },
      opacity: {
        value: 0.0,
        animation: { enable: true, speed: 0.9, minimumValue: 0.0, startValue: "min", destroy: "max" }
      },
      size: { value: { min: 50, max: 100 } },
      rotate: { value: 315, direction: "clockwise", animation: { enable: false } },
      move: {
        enable: true,
        speed: { min: 5, max: 8 },
        straight: true,
        direction: "bottom-left",
        outModes: { default: "destroy" }
      },
      life: {
        count: 0,
        duration: { value: { min: 1.0, max: 1.8 } },
        delay: { value: { min: 2.5, max: 6 } }
      },
      zIndex: { value: 0 }
    },
    pauseOnBlur: true,
    pauseOnOutsideViewport: true
  }), [isMobile])

  return (
    <section className="relative min-h-screen bg-black flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 lg:px-24 overflow-hidden">
      {/* Space particles background */}
      <Particles id="tsparticles-stars" init={particlesInit} options={starfieldOptions} className="absolute inset-0 w-full h-full -z-10" />
      {/* Shooting stars behind content */}
      <Particles id="tsparticles-meteors" init={particlesInit} options={meteorOptions} className="absolute inset-0 w-full h-full -z-10" />
      
      {/* Model Layer (Spline) */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full z-10">
        {showSpline && (
          <Spline scene="https://prod.spline.design/WxNNeqiGOKWixoP0/scene.splinecode" style={{ background: 'transparent' }} />
        )}
      </div>      
      
      {/* Text Layer Left */}
      <div className="flex justify-start w-full z-50 mt-6 lg:mt-0 pointer-events-none">
        <div className="relative z-50 inline-block max-w-full md:max-w-xl">
          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: -10 }}
            transition={{ type: "spring", stiffness: 40, damping: 25, delay: 0.5 }}
            style={{ fontFamily: 'Progress', lineHeight: 1 }}
            className="font-extrabold mb-4 text-white text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[9rem]"
          >
            ANVAYA <br /> ARSHA
          </motion.h1>

          {/* Paragraph */}
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: -10 }}
            transition={{ type: "spring", stiffness: 40, damping: 25, delay: 1 }}
            style={{ lineHeight: 1.4 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 max-w-lg sm:max-w-xl"
          >
            I’m a UI/UX Designer and Full Stack Developer passionate about creating stunning interfaces and building seamless, high-performance web applications that inspire and engage.
          </motion.p>

          {/* Download button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: -10 }}
            transition={{ type: "spring", stiffness: 40, damping: 25, delay: 1.5 }}
            onClick={handleDownload}
            className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-cyan-500 text-black font-semibold rounded-xl shadow-xl hover:bg-cyan-400 transition-colors duration-300 text-base sm:text-lg pointer-events-auto"
          >
            Download Resume
          </motion.button>
        </div>
      </div>

      {/* Text Layer Right */}
      <div className="absolute right-4 sm:right-8 md:right-12 lg:right-16 top-1/4 sm:top-1/3 text-right z-50 pointer-events-none">
        <motion.h2
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 40, damping: 25, delay: 0.5 }}
          className="text-white font-extrabold leading-none text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[7rem]"
          style={{ fontFamily: 'Progress' }}
        >
          UI/UX <br/>Designer
        </motion.h2>
        <motion.h3
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 40, damping: 25, delay: 1 }}
          className="text-cyan-300 font-semibold text-lg sm:text-xl md:text-2xl leading-snug mt-2"
        >
          FULL STACK DEVELOPER
        </motion.h3>
      </div>

    </section>
  );
};

export default HeroSection;
