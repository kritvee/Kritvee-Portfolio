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
const BRUSH = 0.82 // brush radius as a share of the old size (the ring shows this exact radius)
const EASE = 0.55 // how tightly the brush follows the pointer each frame (1 = no smoothing)

// Must match `object-position` in home-hero.css so the canvas stays aligned with the image.
const focus = (): [number, number] => (window.matchMedia(MOBILE).matches ? [0.7, 0.5] : [0.5, 0.5])

// Deep rust, burnt terracotta, copper, amber and earthy brown, laid into the dark ink top to bottom.
const PALETTE = [
  [146, 38, 24],
  [172, 62, 30],
  [188, 92, 42],
  [206, 128, 48],
  [128, 74, 46],
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
      const ink = 1 - smooth(0.28, 0.6, lum) // 1 on dark ink, 0 on cream paper
      const f = Math.min(1, Math.max(0, 0.15 + 0.7 * (y / h) + 0.15 * Math.sin(x * 0.004 + y * 0.002))) * top
      const k0 = Math.min(top - 1, Math.floor(f))
      const t = f - k0
      const a = PALETTE[k0]
      const b = PALETTE[k0 + 1]
      // grain keeps the print's texture; slow variation keeps some shadows deep instead of one flat tone
      const depth = 0.58 + 0.42 * (0.5 + 0.5 * Math.sin(x * 0.0065 + 1.3) * Math.sin(y * 0.0057 + 0.4))
      const k = ink * (0.6 + 0.4 * Math.min(1, lum / 0.18)) * depth * 1.15
      px[i] = Math.min(255, px[i] + (a[0] + (b[0] - a[0]) * t) * k)
      px[i + 1] = Math.min(255, px[i + 1] + (a[1] + (b[1] - a[1]) * t) * k)
      px[i + 2] = Math.min(255, px[i + 2] * (1 - 0.06 * (1 - ink)) + (a[2] + (b[2] - a[2]) * t) * k) // paper stays warm
      px[i + 3] = 255
    }
  }
  ctx.putImageData(data, 0, 0)
  return c
}

/** One broad, softly irregular swath of pigment: the outline drifts as `ph` advances, so no two dabs match. */
function blob(ctx: CanvasRenderingContext2D, x: number, y: number, B: number, ph: number) {
  const n = 36
  ctx.beginPath()
  for (let i = 0; i < n; i++) {
    const th = (i / n) * Math.PI * 2
    const r = B * (1 + 0.09 * Math.sin(3 * th + ph) + 0.06 * Math.sin(5 * th - ph * 1.3) + 0.025 * Math.sin(11 * th + ph * 2.1))
    const px = x + Math.cos(th) * r
    const py = y + Math.sin(th) * r
    if (i) ctx.lineTo(px, py)
    else ctx.moveTo(px, py)
  }
  ctx.closePath()
  ctx.fill()
  if (Math.random() < 0.06) {
    const a = Math.random() * Math.PI * 2
    const d = B * (1 + Math.random() * 0.16)
    ctx.beginPath()
    ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, B * (0.04 + Math.random() * 0.06), 0, Math.PI * 2)
    ctx.fill()
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

  // Persistent paint mask: one pass reveals full colour, repeating a pass changes nothing further.
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
    let mask = document.createElement("canvas")
    let raf = 0
    let have = false // brush has a current position
    let touch = false
    let tx = 0 // pointer target, client px
    let ty = 0
    let cx = 0 // brush position, client px
    let cy = 0
    let phase = Math.random() * 6.28
    let dirty = false
    let drawing = false

    const present = () => {
      if (!ink || !dirty) return
      dirty = false
      out.globalCompositeOperation = "copy"
      out.drawImage(ink, 0, 0)
      out.globalCompositeOperation = "destination-in"
      out.drawImage(mask, 0, 0)
      out.globalCompositeOperation = "source-over"
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
      canvas.width = w
      canvas.height = h
      dirty = true
      present()
    }

    const brushPx = () => Math.min(140, Math.max(64, window.innerWidth * 0.085)) * BRUSH * (touch ? 0.8 : 1)

    const tick = () => {
      raf = 0
      if (!have) return
      const B = brushPx()
      const dx = tx - cx
      const dy = ty - cy
      const dist = Math.hypot(dx, dy)
      const nx = dist < 0.4 ? tx : cx + dx * EASE
      const ny = dist < 0.4 ? ty : cy + dy * EASE
      if (ring && !touch) {
        const hr = hero.getBoundingClientRect()
        ring.style.width = ring.style.height = `${B * 2}px`
        ring.style.transform = `translate3d(${nx - hr.left - B}px, ${ny - hr.top - B}px, 0)`
      }
      const mc = ink && drawing ? mask.getContext("2d") : null
      if (mc) {
        const rect = art.getBoundingClientRect()
        const k = canvas.width / rect.width
        const r = B * k
        mc.fillStyle = "#000"
        mc.shadowColor = "#000"
        mc.shadowBlur = r * 0.1 // soft feathered edge
        const seg = Math.hypot(nx - cx, ny - cy) * k
        const steps = Math.max(1, Math.ceil(seg / (r * 0.12))) // dense stamps: no gaps, however fast
        for (let n = 1; n <= steps; n++) {
          const u = n / steps
          phase += (seg / steps / r) * 0.9
          blob(mc, (cx + (nx - cx) * u - rect.left) * k, (cy + (ny - cy) * u - rect.top) * k, r, phase)
        }
        mc.shadowBlur = 0
        dirty = true
        present()
      }
      cx = nx
      cy = ny
      if (dist >= 0.4) raf = requestAnimationFrame(tick)
    }
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const onMove = (e: PointerEvent) => {
      touch = e.pointerType !== "mouse"
      const onControl = !!(e.target as HTMLElement).closest("a,button")
      if (ring) ring.style.opacity = touch || onControl ? "0" : "1"
      if (onControl || (touch && e.buttons === 0)) {
        have = false
        return
      }
      tx = e.clientX
      ty = e.clientY
      if (!have) {
        cx = tx
        cy = ty
        have = true
      }
      const rect = art.getBoundingClientRect()
      drawing = tx >= rect.left && tx <= rect.right && ty >= rect.top && ty <= rect.bottom
      wake()
    }
    const onEnd = () => {
      have = false
      if (ring) ring.style.opacity = "0"
    }

    img.onload = setup
    img.src = ART
    const ro = new ResizeObserver(setup)
    ro.observe(art)
    hero.addEventListener("pointermove", onMove)
    hero.addEventListener("pointerleave", onEnd)
    hero.addEventListener("pointerup", onEnd)
    hero.addEventListener("pointercancel", onEnd)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      img.onload = null
      hero.removeEventListener("pointermove", onMove)
      hero.removeEventListener("pointerleave", onEnd)
      hero.removeEventListener("pointerup", onEnd)
      hero.removeEventListener("pointercancel", onEnd)
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
      <p className="hp-credit">Original printmaking artwork · Hand-pulled textures and layered ink</p>
    </section>
  )
}
