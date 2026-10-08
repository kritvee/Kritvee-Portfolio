import {
  motion,
  MotionConfig,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react"
import type { PointerEvent as ReactPointerEvent } from "react"
import { useEffect, useRef, useState } from "react"
import Navigation from "../components/Navigation"
import { projects, secondaryWork } from "../data/portfolio"

const asset = (name: string) => `/assets/${name}`
type Project = typeof projects[number]

const easeOut = [0.22, 1, 0.36, 1] as const

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.18 },
  transition: { duration: 0.68, ease: easeOut },
}

const titleLines = [
  {
    key: "line-1",
    content: (
      <>
        I notice <em>little things.</em>
      </>
    ),
  },
  {
    key: "line-2",
    content: (
      <>
        Then I <em>design around them.</em>
      </>
    ),
  },
]

function ArtworkLayer({
  className,
  name,
}: {
  className: string
  name: string
}) {
  return (
    <img
      className={className}
      src={asset(name)}
      alt=""
      loading="lazy"
      decoding="async"
    />
  )
}

function CapyArtwork() {
  return (
    <div className="artwork capy-artwork">
      <ArtworkLayer className="capy-line capy-line-one" name="ed7e5.svg" />
      <ArtworkLayer className="capy-screen capy-screen-five" name="68c93.png" />
      <ArtworkLayer className="capy-line capy-line-two" name="d532e.svg" />
      <ArtworkLayer className="capy-screen capy-screen-one" name="556d8.png" />
      <ArtworkLayer className="capy-line capy-line-three" name="4e9d0.svg" />
      <ArtworkLayer className="capy-screen capy-screen-two" name="606b1.png" />
      <ArtworkLayer
        className="capy-screen capy-screen-three"
        name="08088.png"
      />
      <ArtworkLayer className="capy-screen capy-screen-four" name="d82d6.png" />
    </div>
  )
}

function RoopArtwork() {
  const screens = [
    ["155a0.png", "roop-one"],
    ["e8cd6.png", "roop-two"],
    ["dfbd7.png", "roop-three"],
    ["8a3ed.png", "roop-four"],
    ["77623.png", "roop-five"],
    ["b5b79.png", "roop-six"],
    ["92260.png", "roop-seven"],
    ["3aa85.png", "roop-eight"],
  ] as const

  return (
    <div className="artwork roop-artwork">
      {screens.map(([image, className]) => (
        <ArtworkLayer
          key={image}
          className={`roop-screen ${className}`}
          name={image}
        />
      ))}
    </div>
  )
}

function SplitwiseArtwork() {
  return (
    <div className="artwork splitwise-artwork">
      <ArtworkLayer className="splitwise-texture" name="aa23c.png" />
      <ArtworkLayer className="split-screen split-one" name="c2b38.png" />
      <ArtworkLayer className="split-screen split-two" name="faba2.png" />
      <ArtworkLayer className="split-screen split-three" name="115aa.png" />
    </div>
  )
}

function ProjectArtwork({ slug }: { slug: Project["slug"] }) {
  if (slug === "capy") return <CapyArtwork />
  if (slug === "roop") return <RoopArtwork />
  return <SplitwiseArtwork />
}

function SelectionHandles() {
  return (
    <span className="workspace-selection" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  )
}

const cursorLabels = {
  default: "",
  inspect: "Inspect",
  open: "Open",
  view: "View",
} as const

type CursorMode = keyof typeof cursorLabels

function WorkspaceCursor() {
  const rawX = useMotionValue(-100)
  const rawY = useMotionValue(-100)
  const x = useSpring(rawX, { stiffness: 650, damping: 45, mass: 0.28 })
  const y = useSpring(rawY, { stiffness: 650, damping: 45, mass: 0.28 })
  const [mode, setMode] = useState<CursorMode>("default")
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const move = (event: MouseEvent) => {
      rawX.set(event.clientX)
      rawY.set(event.clientY)
      setVisible(true)
      const interactive = (event.target as HTMLElement).closest<HTMLElement>(
        "[data-cursor]",
      )
      setMode(interactive?.dataset.cursor as CursorMode || "default")
    }
    const leave = () => setVisible(false)
    window.addEventListener("mousemove", move)
    document.documentElement.addEventListener("mouseleave", leave)
    return () => {
      window.removeEventListener("mousemove", move)
      document.documentElement.removeEventListener("mouseleave", leave)
    }
  }, [rawX, rawY])

  return (
    <motion.div
      className={`workspace-cursor workspace-cursor-${mode}`}
      style={{ x, y }}
      animate={{ opacity: visible ? 1 : 0 }}
      aria-hidden="true"
    >
      <span />
      {cursorLabels[mode] && <em>{cursorLabels[mode]}</em>}
    </motion.div>
  )
}

function HeroInspectOverlay({
  x,
  y,
  label,
  visible,
}: {
  x: MotionValue<number>
  y: MotionValue<number>
  label: string
  visible: boolean
}) {
  return (
    <motion.div
      className="workspace-hero-inspect"
      aria-hidden="true"
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.18 }}
    >
      <motion.span className="workspace-hero-inspect-x" style={{ left: x }} />
      <motion.span className="workspace-hero-inspect-y" style={{ top: y }} />
      <motion.div
        className="workspace-hero-inspect-readout"
        style={{ x, y }}
      >
        <i />
        <em>{label}</em>
      </motion.div>
    </motion.div>
  )
}

function Hero() {
  const prefersReducedMotion = useReducedMotion()
  const heroRef = useRef<HTMLElement>(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 420, damping: 38, mass: 0.28 })
  const y = useSpring(rawY, { stiffness: 420, damping: 38, mass: 0.28 })
  const [inspectVisible, setInspectVisible] = useState(false)
  const [inspectLabel, setInspectLabel] = useState("INSPECT / 000 · 000")
  const [finePointer, setFinePointer] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine) and (hover: hover)")
    const sync = () => setFinePointer(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!finePointer || !heroRef.current) return
    const rect = heroRef.current.getBoundingClientRect()
    const localX = event.clientX - rect.left
    const localY = event.clientY - rect.top
    rawX.set(localX)
    rawY.set(localY)
    setInspectVisible(true)

    const target = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-cursor]",
    )
    const mode = target?.dataset.cursor
    const coords = `${String(Math.round(localX)).padStart(3, "0")} · ${String(Math.round(localY)).padStart(3, "0")}`
    if (mode === "open") setInspectLabel(`TARGET / ${coords}`)
    else if (mode === "inspect") setInspectLabel(`FRAME / ${coords}`)
    else setInspectLabel(`INSPECT / ${coords}`)
  }

  const handlePointerLeave = () => setInspectVisible(false)

  return (
    <section
      ref={heroRef}
      className="workspace-hero"
      id="top"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {finePointer && (
        <HeroInspectOverlay
          x={x}
          y={y}
          label={inspectLabel}
          visible={inspectVisible}
        />
      )}
      <div className="workspace-hero-grid">
        <motion.p
          className="workspace-eyebrow"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: easeOut }}
        >
          UI/UX + PRODUCT DESIGNER
        </motion.p>
        <motion.div
          className="workspace-headline-frame"
          data-cursor="inspect"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: prefersReducedMotion ? 0 : 0.08 }}
        >
          <p className="workspace-annotation workspace-headline-note">
            01 / OBSERVATION
          </p>
          <h1>
            {titleLines.map((line, index) => (
              <span className="workspace-title-line" key={line.key}>
                <motion.span
                  className="workspace-title-line-inner"
                  initial={
                    prefersReducedMotion ? false : { y: "108%", opacity: 0 }
                  }
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.58,
                    delay: prefersReducedMotion ? 0 : 0.16 + index * 0.12,
                    ease: easeOut,
                  }}
                >
                  {line.content}
                </motion.span>
              </span>
            ))}
          </h1>
          <SelectionHandles />
          <span className="workspace-measure workspace-measure-width">
            12 COL / ALIGNED
          </span>
        </motion.div>
        <motion.div
          className="workspace-hero-support"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: prefersReducedMotion ? 0 : 0.42,
            duration: 0.55,
            ease: easeOut,
          }}
        >
          <p>
            I'm Kritvee, a UI/UX design student who enjoys understanding why
            people interact with things the way they do, and turning those
            observations into thoughtful experiences.
          </p>
          <div className="workspace-hero-support-meta">
            <span>Kritvee Modi · Pune, India</span>
            <a href="#work" data-cursor="open">
              See what I've been working on ↓
            </a>
          </div>
        </motion.div>
      </div>
      <div className="workspace-hero-guide workspace-hero-guide-one" />
      <div className="workspace-hero-guide workspace-hero-guide-two" />
    </section>
  )
}

function WorkspaceIntro() {
  const repeats = Array.from({ length: 4 }, (_, index) => (
    <span key={index}>Selected projects</span>
  ))

  return (
    <section className="workspace-marquee" aria-label="Selected projects">
      <div className="workspace-marquee-track" aria-hidden="true">
        <div className="workspace-marquee-group">{repeats}</div>
        <div className="workspace-marquee-group">{repeats}</div>
      </div>
    </section>
  )
}

function WorkspaceProject({
  project,
  index,
}: {
  project: Project
  index: number
}) {
  const wrapperRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 0.28, 0.72, 1], [130, 0, 0, -55])
  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.72, 1],
    [0.965, 1, 1, 0.975],
  )
  const annotationOpacity = useTransform(
    scrollYProgress,
    [0.2, 0.36, 0.72, 0.88],
    [0, 1, 1, 0],
  )

  return (
    <section
      ref={wrapperRef}
      className={`workspace-project-wrap workspace-project-wrap-${index + 1}`}
    >
      <motion.article
        className={`workspace-artboard workspace-artboard-${project.slug}`}
        style={
          prefersReducedMotion
            ? undefined
            : { y, scale, "--note-opacity": annotationOpacity }
        }
      >
        <a
          href={project.href}
          aria-label={`Open the ${project.title} case study`}
          data-cursor="open"
        >
          <header className="workspace-artboard-head">
            <div>
              <span>{project.number} /</span>
              <h2>{project.title}</h2>
            </div>
            <div>
              <span>CASE STUDY</span>
              <span>{project.discipline}</span>
            </div>
          </header>
          <div className="workspace-artboard-visual">
            <ProjectArtwork slug={project.slug} />
            <span className="workspace-artboard-state">FINAL / SELECTED</span>
          </div>
          <footer className="workspace-artboard-foot">
            <p>{project.description}</p>
            <span>View full case study ↗</span>
          </footer>
          <SelectionHandles />
          <span className="workspace-artboard-size workspace-artboard-width">
            W / 1200
          </span>
          <span className="workspace-artboard-size workspace-artboard-height">
            H / 780
          </span>
          <span className="workspace-project-note">
            {index === 0
              ? "DETAIL WORTH NOTICING"
              : index === 1
                ? "WHY THIS WORKS"
                : "ITERATION / KEPT"}
          </span>
        </a>
      </motion.article>
    </section>
  )
}

function UXWorkspace() {
  return (
    <section className="workspace-projects" id="work">
      <WorkspaceIntro />
      {projects.map((project, index) => (
        <WorkspaceProject key={project.slug} project={project} index={index} />
      ))}
    </section>
  )
}

function PersonalityMoment() {
  return (
    <motion.section className="workspace-personality" {...reveal}>
      <span className="workspace-annotation">NOTE / PERSONAL</span>
      <p>I overthink interfaces so you don't have to.</p>
      <i aria-hidden="true">↳</i>
    </motion.section>
  )
}

const visualArchive = [
  ...secondaryWork,
  { image: "d7d33.png", alt: "Detailed justice illustration" },
  { image: "fab97.png", alt: "Spatial installation artwork" },
  { image: "06e1c.png", alt: "Illustrated whale print" },
] as const

const visualLabels = [
  "VISUAL EXPERIMENT",
  "GRAPHIC DESIGN",
  "EXPLORATION",
  "ILLUSTRATION",
  "INSTALLATION",
  "PRINT",
] as const

function VisualWorkspace() {
  return (
    <section className="workspace-visual" id="visual">
      <motion.header {...reveal}>
        <div>
          <p className="workspace-annotation">WORKSPACE / VISUAL DESIGN</p>
          <h2>Visual experiments</h2>
        </div>
        <p>
          A looser canvas for illustration, identity, image-making, and the
          ideas that begin outside a product flow.
        </p>
      </motion.header>
      <div className="workspace-visual-canvas">
        {visualArchive.map((item, index) => (
          <motion.figure
            key={item.image}
            className={`workspace-visual-artboard workspace-visual-artboard-${index + 1}`}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ delay: Math.min(index * 0.05, 0.25), duration: 0.55 }}
            data-cursor="view"
          >
            <img
              src={asset(item.image)}
              alt={item.alt}
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span>{visualLabels[index]}</span>
            </figcaption>
            <SelectionHandles />
          </motion.figure>
        ))}
        <span className="workspace-canvas-note">EXPLORED / ONGOING</span>
      </div>
    </section>
  )
}

function AboutWorkspace() {
  return (
    <motion.section className="workspace-about" {...reveal}>
      <div className="workspace-about-image" data-cursor="view">
        <img
          src={asset("01c5f.png")}
          alt="Kritvee outdoors"
          loading="lazy"
          decoding="async"
        />
        <SelectionHandles />
        <span>IMAGE / PERSONAL</span>
      </div>
      <div>
        <p className="workspace-annotation">ABOUT / OFF-CANVAS</p>
        <h2>Curious by habit. Visual by instinct.</h2>
        <p>
          My practice started with sketchbooks, experiments, and an urge to make
          things. That same curiosity now shows up in how I research, prototype,
          and refine digital products.
        </p>
        <a href="/about" data-cursor="open">
          More about me ↗
        </a>
      </div>
    </motion.section>
  )
}

function Contact() {
  return (
    <footer className="workspace-contact" id="contact">
      <div>
        <p className="workspace-annotation">NEW FILE / START A CONVERSATION</p>
        <h2>Let's make something worth noticing.</h2>
      </div>
      <a
        className="workspace-email"
        href="mailto:kritvee11@gmail.com"
        data-cursor="open"
      >
        <span>kritvee11@gmail.com</span>
        <span>↗</span>
      </a>
      <div className="workspace-contact-foot">
        <span>© {new Date().getFullYear()} Kritvee Modi</span>
        <div>
          <a href="https://www.linkedin.com/in/kritvee-modi-a48611268/">
            LinkedIn
          </a>
          <a href="https://www.behance.net/kritveemodi">Behance</a>
        </div>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  )
}

export default function Home() {
  useEffect(() => {
    if (!window.location.hash) return
    const scrollToSection = () => {
      document.querySelector(window.location.hash)?.scrollIntoView()
    }
    const firstFrame = requestAnimationFrame(scrollToSection)
    const settledLayout = window.setTimeout(scrollToSection, 250)
    return () => {
      cancelAnimationFrame(firstFrame)
      window.clearTimeout(settledLayout)
    }
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <div className="studio-home workspace-home">
        <WorkspaceCursor />
        <Navigation />
        <main>
          <Hero />
          <UXWorkspace />
          <PersonalityMoment />
          <VisualWorkspace />
          <AboutWorkspace />
        </main>
        <Contact />
      </div>
    </MotionConfig>
  )
}
