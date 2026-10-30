import { useEffect, useState } from "react"
import { motion, MotionConfig } from "motion/react"
import Navigation from "../components/Navigation"
import { visualWork, type VisualProject } from "../data/visualWork"
import "./capygo.css"
import "./visual-design.css"

const url = (src: string) => encodeURI(src)

function ProjectRow({ p, index }: { p: VisualProject; index: number }) {
  const images = [{ src: p.cover, alt: p.alt }, ...p.gallery]
  const [active, setActive] = useState(0)
  const current = images[active]
  return (
    <motion.article
      id={p.slug}
      className={index % 2 ? "vd-row vd-row-rev" : "vd-row"}
      aria-labelledby={`${p.slug}-title`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="vd-view">
        <img key={current.src} src={url(current.src)} alt={current.alt} loading={index < 2 ? "eager" : "lazy"} decoding="async" />
      </div>
      <div className="vd-info">
        <p className="vd-meta">
          <span>{String(index + 1).padStart(2, "0")}</span>
          {p.category}
        </p>
        <h2 id={`${p.slug}-title`}>{p.title}</h2>
        <p className="vd-desc">{p.description}</p>
        {images.length > 1 && (
          <div className="vd-explore">
            <p className="vd-cue">
              {images.length} images <span aria-hidden="true">→</span>
            </p>
            <ul className="vd-thumbs">
              {images.map((m, k) => (
                <li key={m.src}>
                  <button
                    type="button"
                    aria-label={`Show image ${k + 1} of ${images.length}: ${m.alt}`}
                    aria-pressed={k === active}
                    onClick={() => setActive(k)}
                  >
                    <img src={url(m.src)} alt="" loading="lazy" decoding="async" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.article>
  )
}

export default function VisualDesign() {
  // Scroll to the project named in the URL hash (works on direct load and refresh), else start at the top.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) {
      window.scrollTo(0, 0)
      return
    }
    const go = () => document.getElementById(id)?.scrollIntoView()
    const raf = requestAnimationFrame(go)
    const t = window.setTimeout(go, 300)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(t)
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
