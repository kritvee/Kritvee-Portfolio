import { useEffect, useRef, useState } from "react"
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react"
import Navigation from "../components/Navigation"

const asset = (name: string) => `/assets/about/${name}`

const gallery = [
  /* Row 1 */
  { image: "artwork/sinking-ship-sculpture.png", alt: "Handcrafted sinking ship sculpture" },
  { image: "artwork/blue-cosmic-linocut.png", alt: "Blue cosmic landscape linocut print" },
  { image: "artwork/sand-relief-sculpture.png", alt: "Sand relief sculpture with embedded marbles" },
  { image: "artwork/paper-cut-forest-shadow-box.png", alt: "Paper-cut shadow box forest scene" },
  { image: "artwork/stippled-david-portrait.png", alt: "Stippled portrait of Michelangelo's David" },
  /* Row 2 */
  { image: "artwork/astronaut-cockpit-illustration.png", alt: "Astronaut cockpit ink illustration" },
  { image: "artwork/red-cosmic-linocut.png", alt: "Red cosmic landscape linocut print" },
  { image: "artwork/graphite-portrait-water-highlights.png", alt: "Graphite portrait with water highlights" },
  { image: "artwork/backlit-paper-cut-shadow-box.png", alt: "Backlit paper-cut shadow box" },
  /* Row 3 */
  { image: "artwork/lunch-containers-still-life.png", alt: "Still life pencil drawing of lunch containers" },
  { image: "artwork/justice-tarot-illustration.png", alt: "Justice tarot card ink illustration" },
  { image: "artwork/nocturnal-landscape-painting.png", alt: "Whimsical nocturnal landscape painting" },
  { image: "artwork/topographic-line-portrait.png", alt: "Topographic line profile portrait" },
  { image: "artwork/mcgsmun-secretariat-poster.png", alt: "MCGSMUN23 Secretariat poster design" },
  /* Row 4 */
  { image: "artwork/camera-light-ribbons-painting.png", alt: "Camera with golden light ribbons painting" },
  { image: "artwork/graphite-portrait-woman.png", alt: "Graphite pencil portrait of a woman" },
  { image: "artwork/portrait-with-golden-liquid.png", alt: "Colored portrait with golden liquid" },
  { image: "artwork/blue-whale-fabric-installation.png", alt: "Blue whale fabric installation sculpture" },
  /* Row 5 */
  { image: "artwork/pandemic-mask-portrait.png", alt: "Pandemic portrait with masks pencil drawing" },
  { image: "artwork/fruit-still-life.png", alt: "Fruit still life graphite drawing" },
] as const

const interests = [
  {
    text: "Sketching ideas that don’t fit into wireframes.",
    image: "interests/art.png",
  },
  {
    text: "At the gym or outdoors, resetting my brain.",
    image: "interests/gym.jpg",
  },
  {
    text: "Watching films that linger longer than they should.",
    image: "interests/film.jpg",
  },
  {
    text: "Cooking up a new recipe i found on instagram.",
    image: "interests/cooking.jpg",
  },
  {
    text: "Listening to music that shapes my mood and ideas.",
    image: "interests/music.jpg",
  },
  {
    text: "Playing football for the chaos, energy, and teamwork.",
    image: "interests/football.jpg",
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
      <img className="photo-pin" src={asset("profile/photo-pin.png")} alt="" />
      <motion.div
        className="pinned-photo"
        onHoverStart={() => setFlipped(true)}
        onHoverEnd={() => setFlipped(false)}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="photo-face photo-front">
          <img src={asset("profile/portrait-outdoors.png")} alt="Kritvee outdoors" />
        </div>
        <div className="photo-face photo-back">
          <img src={asset("profile/portrait-back.jpg")} alt="Kritvee" />
        </div>
      </motion.div>
    </motion.div>
  )
}

function EducationCard() {
  return (
    <article className="about-card education-card">
      <h2>Education</h2>
      <div className="education-timeline">
        <div className="education-entry">
          <img src={asset("profile/education-mit.png")} alt="" />
          <div>
            <h3>MIT Insititute of design</h3>
            <p>Bachelor of Design (B.Des)</p>
            <span>2024 – Present</span>
          </div>
        </div>
        <div className="education-connector" aria-hidden="true" />
        <div className="education-entry">
          <img src={asset("profile/education-mayo.png")} alt="" />
          <div>
            <h3>Mayo College Girls’ School</h3>
            <p>Higher Secondary Education</p>
            <span>School Art President</span>
            <span>Graduated 2024</span>
          </div>
        </div>
      </div>
    </article>
  )
}

const tools = [
  { image: "tools/figma.png", className: "tool-figma", alt: "Figma" },
  { image: "", className: "tool-framer", alt: "Framer" },
  { image: "tools/miro.png", className: "tool-miro", alt: "Miro" },
  { image: "tools/adobe-creative-suite.png", className: "tool-photoshop", alt: "Photoshop" },
  { image: "tools/adobe-creative-suite.png", className: "tool-illustrator", alt: "Illustrator" },
  { image: "tools/procreate.png", className: "tool-procreate", alt: "Procreate" },
] as const

function ToolsCard() {
  return (
    <article className="about-card tools-card">
      <h2>Tools</h2>
      <div className="tools-grid">
        {tools.map((tool) => (
          <div className="tool" key={tool.alt}>
            <span className={`tool-icon ${tool.className}`}>
              {tool.image ? <img src={asset(tool.image)} alt="" /> : <b aria-hidden="true">F</b>}
            </span>
            <span className="tool-name">{tool.alt}</span>
          </div>
        ))}
      </div>
    </article>
  )
}

function RevealHeading() {
  const reduceMotion = useReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start 82%", "end 36%"],
  })
  const phraseX = useTransform(scrollYProgress, [0, 0.7, 1], [-96, 0, 0])
  const artX = useTransform(scrollYProgress, [0, 0.7, 1], [96, 0, 0])
  const lineLength = useTransform(scrollYProgress, [0.42, 0.82], [0, 1])

  return (
    <div className="art-heading-stage" ref={stageRef}>
      <div className="art-heading-sticky">
        <motion.h2 className="reveal-heading" aria-label="BEFORE UX, THERE WAS ART">
          <motion.span
            className="reveal-heading-words"
            aria-hidden="true"
            style={reduceMotion ? undefined : { x: phraseX }}
          >
            BEFORE UX, THERE WAS
          </motion.span>
          <motion.em
            aria-hidden="true"
            style={reduceMotion ? undefined : { x: artX }}
          >
            ART
          </motion.em>
        </motion.h2>
        <svg className="art-heading-mark" viewBox="0 0 240 20" aria-hidden="true">
          <motion.path
            d="M4 12C64 4 157 4 236 12"
            style={reduceMotion ? undefined : { pathLength: lineLength }}
            initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
          />
        </svg>
      </div>
    </div>
  )
}

function ArtGallery() {
  return (
    <section className="art-section">
      <header>
        <RevealHeading />
        <p>A collection of sketches, installations, and experiments that shaped how I see design today.</p>
      </header>
      <div className="art-canvas">
        {gallery.map((item) => (
          <motion.figure
            key={item.image}
            className="art-tile"
            style={{ aspectRatio: `${item.ratio}` }}
            whileHover={{ scale: 1.025 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0.12 }}
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
          <motion.button
            type="button"
            key={interest.text}
            onHoverStart={() => setActive(index)}
            onHoverEnd={() => setActive(null)}
            onFocus={() => setActive(index)}
            onBlur={() => setActive(null)}
            animate={{ color: active === index ? "#ffffff" : "#ce9b97" }}
            transition={{ duration: 0.3 }}
          >
            {interest.text}
          </motion.button>
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
  const strengths = [
    "Interaction Design",
    "Visual Storytelling",
    "Accessibility",
    "Design Systems",
    "UX Research",
    "Micro-interactions",
    "Behavioral Design",
    "Information Architecture",
    "Usability Testing",
  ]
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
              <article className="about-card design-card">
                <h2>DESIGN STRENGTHS</h2>
                <ol>
                  {strengths.map((strength) => (
                    <li key={strength}>{strength}</li>
                  ))}
                </ol>
              </article>
            </div>
          </section>
          <ArtGallery />
          <OtherInterests />
        </main>
      </div>
    </MotionConfig>
  )
}
