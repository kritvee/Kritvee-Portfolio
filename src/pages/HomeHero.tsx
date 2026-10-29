import { useEffect, useRef } from "react"
import { motion, useReducedMotion } from "motion/react"
import "./home-hero.css"

// Save your printmaking image at public/assets/print-hero.png (or change this path).
const ART = "/assets/print-hero.png"
const MOBILE = "(max-width: 700px)"
const easeOut = [0.22, 1, 0.36, 1] as const
const LINE_1 = "I notice little things."
const LINE_2 = "Then I design around them."
const STEP = 0.022 // seconds per character
const LINE_2_START = 0.12 + LINE_1.length * STEP + 0.08 // line 2 begins once line 1 is done
const PASS = 0.38 // how much pigment one pass lays down; repeated passes build up to full colour

// Must match `object-position` in home-hero.css so the canvas stays aligned with the image.
const focus = (): [number, number] => (window.matchMedia(MOBILE).matches ? [0.7, 0.5] : [0.5, 0.5])

// Rusty reds, terracotta, ochre: pigment laid into the dark ink, top to bottom.
const PALETTE = [
  [128, 48, 34],
  [158, 76, 50],
  [176, 110, 68],
  [196, 150, 84],
] as const

const smooth = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/** The print at full intensity with colour worked into its dark ink. Cream paper stays as printed. */
function buildInk(img: HTMLImageElement, w: number, h: number, fx: number, fy: number) {
  const c = document.createElement("canvas")
  c.width = w
  c.height = h
  const ctx = c.getContext("2d", { willReadFrequently: true })
  if (!ctx) return c
  const s = Math.max(w / img.naturalWidth, h / img.naturalHeight)
  const dw = img.naturalWidth * s
  const dh = img.naturalHeight * s
  ctx.drawImage(img, (w - dw) * fx, (h - dh) * fy, dw, dh)
  const data = ctx.getImageData(0, 0, w, h)
  const px = data.data
  const top = PALETTE.length - 1
  for (let y = 0, i = 0; y < h; y++) {
    for (let x = 0; x < w; x++, i += 4) {
      const lum = (0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]) / 255
      const ink = 1 - smooth(0.22, 0.5, lum) // 1 on black ink, 0 on cream paper
      const f = Math.min(1, Math.max(0, 0.2 + 0.6 * (y / h) + 0.2 * Math.sin(x * 0.004 + y * 0.002))) * top
      const k0 = Math.min(top - 1, Math.floor(f))
      const t = f - k0
      const a = PALETTE[k0]
      const b = PALETTE[k0 + 1]
      const k = ink * (0.65 + 0.35 * Math.min(1, lum / 0.2)) * 0.85 // grain stays visible
      px[i] = Math.min(255, px[i] + (a[0] + (b[0] - a[0]) * t) * k)
      px[i + 1] = Math.min(255, px[i + 1] + (a[1] + (b[1] - a[1]) * t) * k)
      px[i + 2] = Math.min(255, px[i + 2] + (a[2] + (b[2] - a[2]) * t) * k)
      px[i + 3] = 255
    }
  }
  ctx.putImageData(data, 0, 0)
  return c
}

interface Bristle {
  ox: number
  oy: number
  w: number
  a: number
  skip: number
}

/** A dry, rough brush: bristles scattered in a jagged-edged disc, a few strays outside it. */
function makeBristles(R: number): Bristle[] {
  const list: Bristle[] = []
  const ph = Math.random() * 6.283
  for (let i = 0; i < 62; i++) {
    const th = Math.random() * 6.283
    const edge = 0.8 + 0.14 * Math.sin(3 * th + ph) + 0.08 * Math.sin(7 * th + ph * 2)
    const d = R * edge * Math.sqrt(Math.random()) * (i < 54 ? 1 : 1.25)
    list.push({
      ox: Math.cos(th) * d,
      oy: Math.sin(th) * d,
      w: R * (i < 54 ? 0.03 + Math.random() * 0.045 : 0.015 + Math.random() * 0.02),
      a: 0.55 + Math.random() * 0.45,
      skip: Math.random() * 0.55, // dry bristles leave broken marks
    })
  }
  return list
}

function drawSeg(ctx: CanvasRenderingContext2D, bs: Bristle[], x0: number, y0: number, x1: number, y1: number) {
  ctx.lineCap = "butt"
  for (const b of bs) {
    if (Math.random() < b.skip) continue
    ctx.strokeStyle = `rgba(0,0,0,${b.a})`
    ctx.lineWidth = b.w * (0.8 + Math.random() * 0.4)
    ctx.beginPath()
    ctx.moveTo(x0 + b.ox, y0 + b.oy)
    ctx.lineTo(x1 + b.ox, y1 + b.oy)
    ctx.stroke()
  }
}

/** Typewriter-style reveal, one character at a time, with no wobble. */
function Typed({ text, start, reduce }: { text: string; start: number; reduce: boolean | null }) {
  let n = 0
  const words = text.split(" ")
  return (
    <>
      {words.map((word, wi) => (
        <span key={wi}>
          <span className="hp-word">
            {[...word].map((ch) => {
              const i = n++
              return (
                <motion.span
                  key={i}
                  className="hp-char"
                  aria-hidden="true"
                  initial={reduce ? false : { opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduce ? 0 : 0.2, delay: reduce ? 0 : start + i * STEP, ease: easeOut }}
                >
                  {ch}
                </motion.span>
              )
            })}
          </span>
          {wi < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  )
}

export default function HomeHero() {
  const reduce = useReducedMotion()
  const heroRef = useRef<HTMLElement>(null)
  const artRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  // Size the headline so both lines fit the left negative space on desktop.
  useEffect(() => {
    const hero = heroRef.current
    const copy = copyRef.current
    const title = titleRef.current
    if (!hero || !copy || !title) return
    const fit = () => {
      if (window.matchMedia(MOBILE).matches) {
        title.style.fontSize = ""
        return
      }
      title.style.fontSize = "100px"
      let widest = 0
      title.querySelectorAll<HTMLElement>(".hp-line").forEach((l) => (widest = Math.max(widest, l.offsetWidth)))
      if (widest) title.style.fontSize = `${Math.min(76, (copy.clientWidth / widest) * 100)}px`
    }
    fit()
    document.fonts?.ready.then(fit)
    const ro = new ResizeObserver(fit)
    ro.observe(hero)
    return () => ro.disconnect()
  }, [])

  // Persistent, accumulating brush on a canvas aligned with the artwork.
  useEffect(() => {
    if (reduce) return
    const hero = heroRef.current
    const art = artRef.current
    const canvas = canvasRef.current
    const ring = ringRef.current
    const out = canvas?.getContext("2d")
    if (!hero || !art || !canvas || !out) return

    const img = new Image()
    img.decoding = "async"
    let ink: HTMLCanvasElement | null = null
    let mask = document.createElement("canvas") // committed passes
    let stroke = document.createElement("canvas") // pass in progress
    let comp = document.createElement("canvas") // scratch for compositing
    let bristles: Bristle[] | null = null
    let last: [number, number] | null = null
    let travel = 0
    let raf = 0
    let idle = 0
    let dirty = false

    const render = () => {
      raf = 0
      if (!ink || !dirty) return
      dirty = false
      const cc = comp.getContext("2d")
      if (!cc) return
      cc.clearRect(0, 0, comp.width, comp.height)
      cc.drawImage(mask, 0, 0)
      cc.globalAlpha = PASS
      cc.drawImage(stroke, 0, 0)
      cc.globalAlpha = 1
      out.globalCompositeOperation = "copy"
      out.drawImage(ink, 0, 0)
      out.globalCompositeOperation = "destination-in"
      out.drawImage(comp, 0, 0)
      out.globalCompositeOperation = "source-over"
    }
    const schedule = () => {
      dirty = true
      if (!raf) raf = requestAnimationFrame(render)
    }
    const commit = () => {
      const sc = stroke.getContext("2d")
      const mc = mask.getContext("2d")
      if (!sc || !mc) return
      mc.globalAlpha = PASS
      mc.drawImage(stroke, 0, 0)
      mc.globalAlpha = 1
      sc.clearRect(0, 0, stroke.width, stroke.height)
      travel = 0
    }
    const endStroke = () => {
      window.clearTimeout(idle)
      commit()
      bristles = null
      last = null
      schedule()
    }

    const setup = () => {
      if (!img.complete || !img.naturalWidth) return
      const cssW = art.offsetWidth
      const cssH = art.offsetHeight
      if (!cssW || !cssH) return
      const scale = Math.min(window.devicePixelRatio || 1, 2, 2400 / cssW)
      const w = Math.round(cssW * scale)
      const h = Math.round(cssH * scale)
      if (canvas.width === w && canvas.height === h && ink) return
      const [fx, fy] = focus()
      ink = buildInk(img, w, h, fx, fy)
      const next = document.createElement("canvas") // keep painted state across resizes
      next.width = w
      next.height = h
      if (mask.width && mask.height) next.getContext("2d")?.drawImage(mask, 0, 0, w, h)
      mask = next
      stroke = document.createElement("canvas")
      stroke.width = w
      stroke.height = h
      comp = document.createElement("canvas")
      comp.width = w
      comp.height = h
      canvas.width = w
      canvas.height = h
      bristles = null
      last = null
      schedule()
    }

    const radius = (touch: boolean) => Math.min(140, Math.max(64, window.innerWidth * 0.085)) * (touch ? 0.7 : 1)

    const onMove = (e: PointerEvent) => {
      const touch = e.pointerType !== "mouse"
      const R = radius(touch)
      const onControl = !!(e.target as HTMLElement).closest("a,button")
      if (ring && !touch) {
        const hr = hero.getBoundingClientRect()
        ring.style.width = ring.style.height = `${R * 2}px`
        ring.style.transform = `translate3d(${e.clientX - hr.left - R}px, ${e.clientY - hr.top - R}px, 0)`
        ring.style.opacity = onControl ? "0" : "1"
      }
      if (!ink || onControl || (touch && e.buttons === 0)) {
        if (onControl && bristles) endStroke()
        return
      }
      const rect = art.getBoundingClientRect()
      if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) return
      const k = canvas.width / rect.width
      const x = (e.clientX - rect.left) * k
      const y = (e.clientY - rect.top) * k
      const sc = stroke.getContext("2d")
      if (!sc) return
      if (!bristles) bristles = makeBristles(R * k)
      if (last) {
        drawSeg(sc, bristles, last[0], last[1], x, y)
        travel += Math.hypot(x - last[0], y - last[1])
        if (travel > R * k * 8) commit() // start a fresh layer so crossing passes build up
      } else drawSeg(sc, bristles, x, y, x + 1, y + 1)
      last = [x, y]
      schedule()
      window.clearTimeout(idle)
      idle = window.setTimeout(endStroke, 280)
    }
    const onEnter = (e: PointerEvent) => {
      if (ring && e.pointerType === "mouse") ring.style.opacity = "1"
    }
    const onLeave = () => {
      if (ring) ring.style.opacity = "0"
      endStroke()
    }

    img.onload = setup
    img.src = ART
    const ro = new ResizeObserver(setup)
    ro.observe(art)
    hero.addEventListener("pointermove", onMove)
    hero.addEventListener("pointerenter", onEnter)
    hero.addEventListener("pointerleave", onLeave)
    hero.addEventListener("pointerup", endStroke)
    hero.addEventListener("pointercancel", endStroke)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(idle)
      ro.disconnect()
      img.onload = null
      hero.removeEventListener("pointermove", onMove)
      hero.removeEventListener("pointerenter", onEnter)
      hero.removeEventListener("pointerleave", onLeave)
      hero.removeEventListener("pointerup", endStroke)
      hero.removeEventListener("pointercancel", endStroke)
    }
  }, [reduce])

  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0 : 0.45, delay: reduce ? 0 : delay, ease: easeOut },
  })

  return (
    <section ref={heroRef} className={reduce ? "hp-hero hp-static" : "hp-hero"} id="top">
      <motion.div
        ref={artRef}
        className="hp-art"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0 : 0.9, ease: easeOut }}
      >
        <img className="hp-img" src={ART} alt="" aria-hidden="true" decoding="async" />
        {!reduce && <canvas ref={canvasRef} className="hp-paint" aria-hidden="true" />}
      </motion.div>
      <div className="hp-shade" aria-hidden="true" />
      {!reduce && <div ref={ringRef} className="hp-ring" aria-hidden="true" />}
      <div ref={copyRef} className="hp-copy">
        <motion.p className="hp-role" {...fade(0)}>
          UI/UX + PRODUCT DESIGNER
        </motion.p>
        <h1 ref={titleRef} className="hp-title" aria-label={`${LINE_1} ${LINE_2}`}>
          <span className="hp-line">
            <Typed text={LINE_1} start={0.12} reduce={reduce} />
          </span>
          <span className="hp-line">
            <Typed text={LINE_2} start={LINE_2_START} reduce={reduce} />
          </span>
        </h1>
        <motion.p className="hp-place" {...fade(1.45)}>
          PUNE, INDIA
        </motion.p>
        <motion.a className="hp-link" href="#work" {...fade(1.55)}>
          Explore my work <span aria-hidden="true">↓</span>
        </motion.a>
      </div>
    </section>
  )
}
