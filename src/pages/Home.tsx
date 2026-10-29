import {
  motion,
  MotionConfig,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react"
import { useEffect, useRef, useState } from "react"
import Navigation from "../components/Navigation"
import { projects, secondaryWork } from "../data/portfolio"
import HomeHero from "./HomeHero"

const asset = (name: string) => `/assets/${name}`
type Project = typeof projects[number]

const easeOut = [0.22, 1, 0.36, 1] as const

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.18 },
  transition: { duration: 0.68, ease: easeOut },
}

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
    <div className="artwork capy-artwork card-artwork-capy">
      <ArtworkLayer className="portfolio-card-image" name="home-cards/capygo.png" />
    </div>
  )
}

function RoopArtwork() {
  return (
    <div className="artwork roop-artwork card-artwork-roop">
      <ArtworkLayer className="portfolio-card-image" name="home-cards/roop.png" />
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

function LoadingArtwork() {
  return (
    <div className="artwork loading-artwork">
      <ArtworkLayer className="loading-screen loading-screen-basic" name="loading/basic.png" />
      <ArtworkLayer className="loading-screen loading-screen-fancy" name="loading/fancy.png" />
      <ArtworkLayer className="loading-screen loading-screen-skeleton" name="loading/skeleton.png" />
    </div>
  )
}

function ProjectArtwork({ slug }: { slug: Project["slug"] }) {
  if (slug === "capy") return <CapyArtwork />
  if (slug === "roop") return <RoopArtwork />
  if (slug === "loading") return <LoadingArtwork />
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
  const y = useTransform(scrollYProgress, [0, 0.5, 1], ["44%", "0%", "-20%"])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.98])
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
          <div
            className={`workspace-artboard-visual workspace-artboard-visual-${project.slug}`}
          >
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

const visualWork = [
  { image: secondaryWork[0].image, alt: "Tarot Cards Reimagined: colourful illustrated tarot cards", title: "Tarot Cards Reimagined", category: "ILLUSTRATION" },
  { image: secondaryWork[1].image, alt: "Retail Bags Catalogue: editorial and product design moodboard", title: "Retail Bags Catalogue", category: "EDITORIAL DESIGN" },
  { image: secondaryWork[2].image, alt: "MCGSMUN logo design: illustrated dragon logo", title: "MCGSMUN Logo Design", category: "LOGO DESIGN" },
  { image: "skin-and-me.png", alt: "Skin & Me logo on a skincare tube, serum bottles, jar, box and shopping bag", title: "Skin & Me", category: "LOGO DESIGN", position: "20% 50%" },
  { image: "world-aviation-training.png", alt: "World Aviation Training logo on the side of an aircraft fuselage", title: "World Aviation Training", category: "LOGO DESIGN", position: "50% 50%" },
  { image: "mcgsmun-tshirt.png", alt: "MCGSMUN23 Secretariat T-shirt graphic: a statue of Lady Justice with lightning on black", title: "MCGSMUN T-Shirt Design", category: "APPAREL GRAPHICS", position: "50% 40%" },
] as const

function VisualWorkspace() {
  return (
    <section className="workspace-visual" id="visual">
      <motion.header {...reveal}>
        <div>
          <p className="workspace-annotation">WORKSPACE / VISUAL DESIGN</p>
          <h2 style={{ fontSize: "clamp(38px, 4.6vw, 72px)" }}>Graphic Design &amp; Visual Identity</h2>
        </div>
        <p>
          From brand identities and print to illustration and apparel, a selection of work exploring how visual ideas
          take shape across different mediums.
        </p>
      </motion.header>
      <div className="workspace-visual-canvas">
        {visualWork.map((item, index) => (
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
              style={"position" in item ? { objectPosition: item.position } : undefined}
              loading="lazy"
              decoding="async"
            />
            <figcaption style={{ flexWrap: "wrap" }}>
              <span>
                {String(index + 1).padStart(2, "0")} · {item.title.toUpperCase()}
              </span>
              <span>{item.category}</span>
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
          <HomeHero />
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
