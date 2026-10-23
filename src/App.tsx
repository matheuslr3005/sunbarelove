import { MotionConfig, motion, useScroll, useSpring } from "motion/react";
import { IconContext } from "@phosphor-icons/react";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { BarraStrip } from "./components/BarraStrip";
import { EventSpotlight } from "./components/EventSpotlight";
import { EventMap3D } from "./components/EventMap3D";
import { Collab } from "./components/Collab";
import { Manifesto } from "./components/Manifesto";
import { Events } from "./components/Events";
import { Videos } from "./components/Videos";
import { Gallery } from "./components/Gallery";
import { Finale } from "./components/Finale";
import { Intro, IntroProvider } from "./components/Intro";
import { Faq } from "./components/Faq";
import { Shop } from "./components/Shop";
import { Band } from "./components/Band";
import { FloatingTicket } from "./components/FloatingTicket";
import { SunCursor } from "./components/SunCursor";

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 h-1 origin-left bg-[linear-gradient(90deg,#ffc21a,#ff6a2b,#f0286e)]"
      style={{ scaleX, zIndex: "var(--z-progress)" }}
    />
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <IconContext.Provider value={{ weight: "bold" }}>
       <IntroProvider>
        <Intro />
        <ScrollProgress />
        <Nav />
        <SunCursor />
        <FloatingTicket />
        <main>
          <Hero />
          <BarraStrip />
          <EventSpotlight />
          <EventMap3D />
          <Collab />
          <Manifesto />
          <Events />
          <Videos />
          <Gallery />
          <Shop />
          <Band />
          <Faq />
        </main>
        <Finale />
       </IntroProvider>
      </IconContext.Provider>
    </MotionConfig>
  );
}
