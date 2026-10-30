import { useEffect, useRef } from "react"
import type { PointerEvent as ReactPointerEvent } from "react"
import { motion, MotionConfig } from "motion/react"
import Navigation from "../components/Navigation"
import { visualWork, type VisualProject } from "../data/visualWork"
import "./capygo.css"
import "./visual-design.css"

type Img = { src: string; alt: string }
const url = (src: string) => encodeURI(src)

// Every image keeps its natural aspect ratio: width is set by the layout, height is always `auto`.
const Pic = ({ m, onLoad }: { m: Img; onLoad?: () => void }) => (
  <img className="vd-img" src={url(m.src)} alt={m.alt} loading="eager" decoding="async" draggable={false} onLoad={onLoad} />
)

/** Horizontal gallery: fixed height, natural width, drag / trackpad / touch scrolling, subtle edge hint. */
function Scroller({ items, label }: { items: Img[]; label: string }) {
  const wrap = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; left: number } | null>(null)

  const sync = () => {
    const t = track.current
    if (t && wrap.current) wrap.current.classList.toggle("vd-at-end", t.scrollLeft + t.clientWidth >= t.scrollWidth - 8)
  }
  useEffect(() => {
    sync()
    window.addEventListener("resize", sync)
    return () => window.removeEventListener("resize", sync)
  }, [])

  const down = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !track.current) return
    drag.current = { x: e.clientX, left: track.current.scrollLeft }
    track.current.classList.add("vd-dragging")
    track.current.setPointerCapture(e.pointerId)
  }
  const move = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (drag.current && track.current) track.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x)
  }
  const up = () => {
    drag.current = null
    track.current?.classList.remove("vd-dragging")
  }

  return (
    <div className="vd-scroll" ref={wrap}>
      <p className="vd-cue">
        {items.length} pages · scroll to browse <span aria-hidden="true">→</span>
      </p>
      <div
        className="vd-track"
        ref={track}
        tabIndex={0}
        role="region"
        aria-label={label}
        onScroll={sync}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        {items.map((m) => (
          <Pic key={m.src} m={m} onLoad={sync} />
        ))}
      </div>
    </div>
  )
}

function Media({ p }: { p: VisualProject }) {
  const g = p.gallery
  const cover = { src: p.cover, alt: p.alt }
  switch (p.slug) {
    case "tarot-cards":
      return (
        <div className="vd-media vd-tarot">
          <div className="vd-cards">
            {g.map((m) => (
              <Pic key={m.src} m={m} />
            ))}
          </div>
          <div className="vd-tarot-cover">
            <Pic m={cover} />
          </div>
        </div>
      )
    case "retail-bags":
      return <Scroller items={[cover, ...g]} label="Retail Bags Catalogue pages, scrollable" />
    case "mcgsmun-logo":
      return (
        <div className="vd-media vd-g12">
          <div className="s6"><Pic m={cover} /></div>
          <div className="s6"><Pic m={g[0]} /></div>
          <div className="s7"><Pic m={g[1]} /></div>
          <div className="s5"><Pic m={g[2]} /></div>
        </div>
      )
    case "skin-and-me":
      return (
        <div className="vd-media vd-g12">
          <div className="s8 vd-stack">
            <Pic m={cover} />
            <Pic m={g[2]} />
          </div>
          <div className="s4 vd-stack vd-logos">
            <Pic m={g[0]} />
            <Pic m={g[1]} />
          </div>
        </div>
      )
    case "world-aviation-training":
      return (
        <div className="vd-media vd-g12">
          <div className="s5"><Pic m={cover} /></div>
          <div className="s7 vd-stack vd-wats">
            <Pic m={g[0]} />
            <div className="vd-plane"><Pic m={g[1]} /></div>
          </div>
        </div>
      )
    default:
      return (
        <div className="vd-media">
          <div className="vd-tee"><Pic m={cover} /></div>
        </div>
      )
  }
}

function ProjectRow({ p, index }: { p: VisualProject; index: number }) {
  return (
    <motion.article
      id={p.slug}
      className={index % 2 ? "vd-row vd-row-rev" : "vd-row"}
      aria-labelledby={`${p.slug}-title`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <Media p={p} />
      <div className="vd-info">
        <p className="vd-meta">
          <span>{String(index + 1).padStart(2, "0")}</span>
          {p.category}
        </p>
        <h2 id={`${p.slug}-title`}>{p.title}</h2>
        <p className="vd-desc">{p.description}</p>
      </div>
    </motion.article>
  )
}

export default function VisualDesign() {
  // Scroll to the project named in the URL hash (direct load, refresh), re-checking once images have loaded.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) {
      window.scrollTo(0, 0)
      return
    }
    const go = () => document.getElementById(id)?.scrollIntoView()
    const raf = requestAnimationFrame(go)
    const t = window.setTimeout(go, 300)
    window.addEventListener("load", go)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(t)
      window.removeEventListener("load", go)
    }
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <div className="case-study vd">
        <Navigation />
        <main className="vd-main">
          <header className="vd-head">
            <p className="cs-note">Workspace / Visual design</p>
            <h1>Selected Visual Work</h1>
            <p className="cs-lead">Identity, print, illustration, and visual systems shaped through curiosity, contrast, and craft.</p>
          </header>
          <div className="vd-list">
            {visualWork.map((p, i) => (
              <ProjectRow key={p.slug} p={p} index={i} />
            ))}
          </div>
        </main>
      </div>
    </MotionConfig>
  )
}
