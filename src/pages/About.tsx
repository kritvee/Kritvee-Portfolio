import { useEffect, useRef, useState } from "react"
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react"
import Navigation from "../components/Navigation"

const asset = (name: string) => `/assets/${name}`

const gallery = [
  {
    image: "6364b.png",
    alt: "Sketchbook composition",
    x: 29.22,
    y: 0,
    w: 17.89,
    ratio: 962 / 926,
  },
  {
    image: "fab97.png",
    alt: "Installation artwork",
    x: 47.99,
    y: 42.09,
    w: 30.46,
    ratio: 660 / 430,
  },
  {
    image: "6b735.png",
    alt: "Portrait study",
    x: 79.15,
    y: 16.35,
    w: 18.91,
    ratio: 205.68 / 233.67,
  },
  {
    image: "28d69.png",
    alt: "Digital painting",
    x: 1.07,
    y: 55.71,
    w: 14.1,
    ratio: 2940 / 4096,
  },
  {
    image: "89e10.png",
    alt: "Observational drawing",
    x: 16,
    y: 104.54,
    w: 12.17,
    ratio: 254.1 / 191,
    rotate: -90,
  },
  {
    image: "5cd96.png",
    alt: "Mixed media installation",
    x: 29.05,
    y: 280.9,
    w: 18.06,
    ratio: 379.34 / 283.23,
    rotate: -90,
  },
  {
    image: "92383.png",
    alt: "Sculptural installation",
    x: 69.07,
    y: 364.91,
    w: 30.93,
    ratio: 660 / 431,
  },
  {
    image: "14947.png",
    alt: "Expressive portrait drawing",
    x: 47.95,
    y: 366.35,
    w: 19.99,
    ratio: 354.86 / 463.79,
  },
  {
    image: "8b677.png",
    alt: "Illustrated map artwork",
    x: 0,
    y: 374.12,
    w: 27.93,
    ratio: 4096 / 2664,
  },
  {
    image: "f5ac4.png",
    alt: "Still life drawing",
    x: 2.16,
    y: 672.3,
    w: 19.48,
    ratio: 800 / 624,
  },
  {
    image: "34bcb.png",
    alt: "Detailed ink illustration",
    x: 22.66,
    y: 670.86,
    w: 24.43,
    ratio: 2509 / 3921,
  },
  {
    image: "4e2f7.png",
    alt: "Figure study",
    x: 68.67,
    y: 690.87,
    w: 13.55,
    ratio: 341.06 / 532.77,
  },
  {
    image: "a45ba.png",
    alt: "Editorial poster artwork",
    x: 83.02,
    y: 690.86,
    w: 15.63,
    ratio: 573.06 / 784.88,
  },
  {
    image: "d2bf5.png",
    alt: "Painted portrait",
    x: 47.9,
    y: 790.93,
    w: 20.04,
    ratio: 2774 / 4096,
  },
  {
    image: "a36ad.png",
    alt: "Graphite portrait",
    x: 1.86,
    y: 923.66,
    w: 20.11,
    ratio: 340.18 / 372.13,
  },
  {
    image: "06e1c.png",
    alt: "Whale print",
    x: 68.67,
    y: 1036.48,
    w: 29.94,
    ratio: 443.44 / 323.16,
  },
  {
    image: "d7d33.png",
    alt: "Justice illustration",
    x: 1.64,
    y: 1281.11,
    w: 24,
    ratio: 965.07 / 1151.21,
  },
  {
    image: "badde.png",
    alt: "Pencil portrait",
    x: 26.3,
    y: 1281.11,
    w: 20.79,
    ratio: 326.1 / 372.65,
  },
  {
    image: "cb2e0.png",
    alt: "Color portrait study",
    x: 47.9,
    y: 1269.77,
    w: 20.04,
    ratio: 335.63 / 392.64,
  },
  {
    image: "0a14e.png",
    alt: "Fabric sculpture",
    x: 68.67,
    y: 1387.46,
    w: 28.9,
    ratio: 1516 / 1158,
  },
] as const

const interests = [
  {
    text: "Sketching ideas that don’t fit into wireframes.",
    image: "interest-art.png",
  },
  {
    text: "At the gym or outdoors, resetting my brain.",
    image: "interest-gym.jpg",
  },
  {
    text: "Watching films that linger longer than they should.",
    image: "interest-film.jpg",
  },
  {
    text: "Cooking up a new recipe i found on instagram.",
    image: "interest-cooking.jpg",
  },
  {
    text: "Listening to music that shapes my mood and ideas.",
    image: "interest-music.jpg",
  },
  {
    text: "Playing football for the chaos, energy, and teamwork.",
    image: "interest-football.jpg",
  },
] as const

function PinnedPhoto() {
  const [flipped, setFlipped] = useState(false)

  return (
    <motion.div
      className="pinned-photo-wrap"
      initial={{ rotate: -12 }}
      animate={{ rotate: [-12, 0, -6, -3, -4] }}
      transition={{ duration: 2.4, ease: "easeInOut" }}
      style={{ transformOrigin: "50% 0%" }}
    >
      <img className="photo-pin" src={asset("d3dee.png")} alt="" />
      <motion.div
        className="pinned-photo"
        onHoverStart={() => setFlipped(true)}
        onHoverEnd={() => setFlipped(false)}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="photo-face photo-front">
          <img src={asset("01c5f.png")} alt="Kritvee outdoors" />
        </div>
        <div className="photo-face photo-back">
          <img src={asset("about-photo-back.jpg")} alt="Kritvee" />
        </div>
      </motion.div>
    </motion.div>
  )
}

function EducationCard() {
  return (
    <article className="about-card education-card">
      <h2>Education</h2>
      <div className="education-entry">
        <img src={asset("e0f29.png")} alt="" />
        <div>
          <h3>MIT Insititute of design</h3>
          <p>Bachelor of Design (B.Des)</p>
          <span>2024 – Present</span>
        </div>
      </div>
      <img className="education-line" src={asset("e1d91.svg")} alt="" />
      <div className="education-entry">
        <img src={asset("d030b.png")} alt="" />
        <div>
          <h3>Mayo College Girls’ School</h3>
          <p>Higher Secondary Education</p>
          <span>School Art President</span>
          <span>Graduated 2024</span>
        </div>
      </div>
    </article>
  )
}

const tools = [
  { image: "39248.png", className: "tool-figma", level: 100, alt: "Figma" },
  {
    image: "a9454.png",
    className: "tool-photoshop",
    level: 60,
    alt: "Photoshop",
  },
  { image: "e455c.png", className: "tool-miro", level: 82, alt: "Miro" },
  {
    image: "a9454.png",
    className: "tool-illustrator",
    level: 60,
    alt: "Illustrator",
  },
  { image: "29331.png", className: "tool-canva", level: 100, alt: "Canva" },
  {
    image: "12f0d.png",
    className: "tool-procreate",
    level: 76,
    alt: "Procreate",
  },
] as const

function ToolsCard() {
  return (
    <article className="about-card tools-card">
      <h2>Tools</h2>
      <div className="tools-grid">
        {tools.map((tool) => (
          <div className="tool" key={tool.alt} title={tool.alt}>
            <span className={`tool-icon ${tool.className}`}>
              <img src={asset(tool.image)} alt={tool.alt} />
            </span>
            <span className="tool-level">
              <i style={{ width: `${tool.level}%` }} />
            </span>
          </div>
        ))}
      </div>
    </article>
  )
}

function InterestsCard() {
  return (
    <article className="about-card design-card">
      <h2>Design Interests</h2>
      <ul>
        <li>UX Research</li>
        <li>Interaction Design</li>
        <li>Visual Storytelling</li>
        <li>Accessibility</li>
        <li>Design Systems</li>
        <li>Micro-interactions</li>
        <li>Behavioral Design</li>
        <li>Information Architecture</li>
        <li>Usability Testing</li>
      </ul>
    </article>
  )
}

function RevealHeading() {
  const ref = useRef<HTMLDivElement>(null)
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const x = useSpring(pointerX, { stiffness: 200, damping: 20 })
  const y = useSpring(pointerY, { stiffness: 200, damping: 20 })
  const clipPath = useTransform([x, y], ([latestX, latestY]) => {
    return `circle(120px at ${latestX}px ${latestY}px)`
  })

  const centerLens = () => {
    if (!ref.current) return
    pointerX.set(ref.current.offsetWidth / 2)
    pointerY.set(ref.current.offsetHeight / 2)
  }

  useEffect(centerLens, [])

  return (
    <div
      ref={ref}
      className="reveal-heading"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        pointerX.set(event.clientX - rect.left)
        pointerY.set(event.clientY - rect.top)
      }}
      onPointerLeave={centerLens}
    >
      <span>Before UX, there was art.</span>
      <motion.span className="reveal-heading-highlight" style={{ clipPath }}>
        Before UX, there was art.
      </motion.span>
    </div>
  )
}

function ArtGallery() {
  return (
    <section className="art-section">
      <header>
        <RevealHeading />
        <p>
          A collection of sketches, installations, and experiments that shaped
          how I see design today.
        </p>
      </header>
      <div className="art-canvas">
        {gallery.map((item) => (
          <motion.figure
            key={item.image}
            className="art-tile"
            style={{
              left: `${item.x}%`,
              top: `${(item.y / 1734) * 100}%`,
              width: `${item.w}%`,
              aspectRatio: `${item.ratio}`,
              rotate: item.rotate ?? 0,
            }}
            whileHover={{
              scale: 1.1,
              rotate: 0,
              boxShadow: "0px 8px 30px 0px rgba(0, 0, 0, 0.25)",
            }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
          >
            <img
              src={asset(item.image)}
              alt={item.alt}
              loading="lazy"
              decoding="async"
            />
          </motion.figure>
        ))}
      </div>
    </section>
  )
}

function OtherInterests() {
  const [active, setActive] = useState<number | null>(null)
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const x = useSpring(cursorX, { stiffness: 260, damping: 25 })
  const y = useSpring(cursorY, { stiffness: 260, damping: 25 })
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  useEffect(() => {
    const move = (event: MouseEvent) => {
      cursorX.set(event.clientX)
      cursorY.set(event.clientY)
      rotateX.set((event.clientY / window.innerHeight - 0.5) * -6)
      rotateY.set((event.clientX / window.innerWidth - 0.5) * 6)
    }
    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [cursorX, cursorY, rotateX, rotateY])

  return (
    <section className="other-interests">
      <h2>When I’m not designing, I’m:</h2>
      <div className="interest-list">
        {interests.map((interest, index) => (
          <motion.p
            key={interest.text}
            onHoverStart={() => setActive(index)}
            onHoverEnd={() => setActive(null)}
            animate={{ color: active === index ? "#ffffff" : "#ce9b97" }}
            transition={{ duration: 0.3 }}
          >
            {interest.text}
          </motion.p>
        ))}
      </div>
      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="interest-preview"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.2 }}
            style={{ x, y, rotateX, rotateY }}
          >
            <motion.img
              key={interests[active].image}
              src={asset(interests[active].image)}
              alt=""
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <div className="about-page">
        <Navigation />
        <main>
          <section className="about-intro">
            <PinnedPhoto />
            <div className="about-copy">
              <h1>About Me</h1>
              <p>
                Hi, I’m Kritvee, an aspiring UX designer currently studying at
                MIT Institute of Design.
              </p>
              <p>
                I’ve always been the art kid, sketching through classes and
                finding ways to turn curiosity into creation. What began as
                doodles in school notebooks has grown into a passion for
                designing experiences that feel intuitive, thoughtful, and
                human.
              </p>
              <p>
                UX allows me to bring together what I’ve always loved, visual
                expression, storytelling, and understanding people, transforming
                creativity into meaningful digital experiences.
              </p>
            </div>
          </section>
          <section className="skillset">
            <div className="skillset-grid">
              <EducationCard />
              <ToolsCard />
              <InterestsCard />
            </div>
          </section>
          <ArtGallery />
          <OtherInterests />
        </main>
      </div>
    </MotionConfig>
  )
}
