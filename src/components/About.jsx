import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ✅ Correct react-icons (Simple Icons) imports — note the lowercase names
import {
  SiFigma,
  SiAdobexd,
  SiAdobeillustrator,
  SiAdobephotoshop,
  SiWix,
  SiNotion,
} from "react-icons/si";
import { FaRobot } from "react-icons/fa";
import { Sparkles } from "lucide-react"; // used for Dora AI

const About = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const introRef = useRef(null);
  const starsRef = useRef([]);

  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    // Title animation
    gsap.fromTo(
      titleRef.current,
      { y: 100, opacity: 0 },
      {
        y: -300,
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 40%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Intro animation
    gsap.fromTo(
      introRef.current,
      { y: 100, opacity: 0, filter: "blur(10px)" },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.5,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 40%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Stars animation
    starsRef.current.forEach((star, index) => {
      const direction = index % 2 === 0 ? 1 : -1;
      const speed = 0.5 + Math.random() * 0.5;

      gsap.to(star, {
        x: `${direction * (100 + index * 20)}`,
        y: `${direction * -50 - index * 10}`,
        rotation: direction * 360,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: speed,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === sectionRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);

  const addToStarsRef = (el) => {
    if (el && !starsRef.current.includes(el)) {
      starsRef.current.push(el);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="h-screen relative overflow-hidden bg-gradient-to-b from-black to-[#9a74cf50]"
    >
      {/* Background Stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            ref={addToStarsRef}
            key={`star-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${10 + i * 3}px`,
              height: `${10 + i * 3}px`,
              backgroundColor: "white",
              opacity: 0.2 + Math.random() * 0.4,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Title */}
      <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center">
        <h1
          ref={titleRef}
          className="text-4xl md:text-6xl font-bold sm:mb-16 text-center text-white opacity-0"
          style={{ fontFamily: "Progress" }}
        >
          ABOUT ME
        </h1>
      </div>

      {/* Content: Left Text, Center Model, Right Text */}
      <div
        ref={introRef}
        className="absolute inset-0 flex justify-between items-center px-10 opacity-0"
      >
        {/* Left Side Text */}
        <div className="w-1/3 relative z-50">
          <h3
            className="text-sm md:text-2xl font-bold text-purple-200 tracking-wider leading-relaxed"
            style={{ fontFamily: "Touche" }}
          >
            I am a UI/UX and product designer passionate about creating
            intuitive, accessible, and engaging digital experiences.<br />
            I design responsive websites using user research, prototyping, and
            testing, guided by human-centered design, accessibility, and visual
            hierarchy.
          </h3>
        </div>

        {/* Center Model */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <img
            className="lg:h-[40rem] md:h-[25rem] h-[20rem] mix-blend-lighten opacity-90"
            src="images/person.png"
            alt="profile-img"
          />
        </div>

{/* Right Side Big Text + Skills */}
<div className="w-1/3 flex flex-col items-start justify-center relative z-50 text-left">
  {/* Big Heading */}
  <h1 
  style={{ fontFamily: "Progress" }}
  className="text-[4rem] md:text-[7rem] font-extrabold text-white leading-none">
    SKILLS
  </h1>

  {/* Skills Section directly below */}
  <div className="mt-6 w-full">
    <div className="grid grid-cols-2 gap-6 text-white text-lg md:text-xl font-medium">
      <div className="flex items-center gap-3">
        <SiFigma className="w-8 h-8 text-pink-400" />
        <span>Figma</span>
      </div>
      <div className="flex items-center gap-3">
        <SiAdobexd className="w-8 h-8 text-purple-400" />
        <span>Adobe XD</span>
      </div>
      <div className="flex items-center gap-3">
        <SiAdobeillustrator className="w-8 h-8 text-orange-400" />
        <span>Illustrator</span>
      </div>
      <div className="flex items-center gap-3">
        <SiAdobephotoshop className="w-8 h-8 text-blue-400" />
        <span>Photoshop</span>
      </div>
      <div className="flex items-center gap-3">
        <SiWix className="w-8 h-8 text-gray-300" />
        <span>Wix Studio</span>
      </div>
      <div className="flex items-center gap-3">
        <Sparkles className="w-8 h-8 text-yellow-300" />
        <span>Dora AI</span>
      </div>
      <div className="flex items-center gap-3">
        <SiNotion className="w-8 h-8 text-white" />
        <span>Notion</span>
      </div>
      <div className="flex items-center gap-3">
        <FaRobot className="w-8 h-8 text-green-400" />
        <span>AI Tools</span>
      </div>
    </div>
  </div>
</div>




      </div>
    </section>
  );
};

export default About;
