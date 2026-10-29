import { useEffect, useState } from "react"
import { motion, MotionConfig } from "motion/react"
import Navigation from "../components/Navigation"
import "./capygo.css"
import "./roop.css"

const img = (n: string) => `/assets/roop/${n}.png`
const ease = [0.22, 1, 0.36, 1] as const
const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.6, ease },
}
const chapters = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "The Problem" },
  { id: "research", label: "Research & Insights" },
  { id: "direction", label: "Design Direction" },
  { id: "experience", label: "The Roop Experience" },
  { id: "reflection", label: "Reflection" },
] as const

type Tag = "Primary research" | "Desk research" | "Team synthesis" | "Design response" | "Usability testing"
const Chip = ({ t }: { t: Tag }) => <span className="cs-chip">{t}</span>

function Contents({ active }: { active: string }) {
  return (
    <nav className="cs-toc" aria-label="Case study contents">
      <p className="cs-note cs-toc-title">Contents</p>
      <ol>
        {chapters.map((c, i) => (
          <li key={c.id}>
            <a href={`#${c.id}`} aria-current={active === c.id ? "true" : undefined}>
              <span>{String(i + 1).padStart(2, "0")}</span>{c.label}
            </a>
          </li>
        ))}
      </ol>
      <p className="cs-toc-id">Roop / Case study</p>
    </nav>
  )
}

function Chapter({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  const n = chapters.findIndex((c) => c.id === id)
  return (
    <motion.section className="cs-chapter" id={id} aria-labelledby={`${id}-h`} {...reveal}>
      <header className="cs-chapter-head">
        <p className="cs-note">{String(n + 1).padStart(2, "0")} / {chapters[n].label}</p>
        <h2 id={`${id}-h`}>{title}</h2>
      </header>
      {children}
    </motion.section>
  )
}

const insights = [
  { tag: "Primary research", found: "In our survey (13 responses), about 69% said ingredients influence their product choice most. 46% had experienced irritation, breakouts or pigmentation after using actives without guidance.", matters: "People choose by ingredient but are not equipped to read one.", response: "Scanning a product breaks it into actives and base ingredients, shown on one screen." },
  { tag: "Primary research", found: "About 69% agreed that traditional Indian skincare is becoming less relevant to their generation. Contextual interviews with Gen Z students at our college explored Western influence more broadly.", matters: "Traditional knowledge is being set aside, not weighed against modern actives.", response: "Each scan pairs the active with natural swaps and Ayurvedic equivalents." },
  { tag: "Team synthesis", found: "Our jobs-to-be-done work framed two moments: wanting instant validation when buying a product, and wanting to log symptoms to see what triggers a change.", matters: "Needs are situational. People want clarity at the point of doubt.", response: "A scan-first flow, plus a symptom log tied to a skin calendar." },
  { tag: "Desk research", found: "Science-first brands such as The Ordinary lack personalisation and local roots. DIY social trends use home ingredients without scientific backing.", matters: "Neither side combines safety, science and Indian context.", response: "One place that links modern actives to their traditional origin." },
] as const

const groups = {
  home: [["m-home", "Roop home screen: daily activity, skin health score, and shortcuts to skin analysis and product scan", "Home"]],
  a: [
    ["m-quiz-1", "Skin quiz question: how would you describe your skin type", "Skin type"],
    ["m-quiz-2", "Skin quiz question: how sensitive is your skin", "Sensitivity"],
    ["m-quiz-3", "Skin quiz question: which concerns to improve, select up to three", "Concerns"],
  ],
  b: [
    ["m-scan", "Product scan camera view asking to focus on the front label", "Scan"],
    ["m-scan-results", "Product scan results for niacinamide with ingredients and alternatives", "Results"],
    ["m-scanned", "Scanned products grid tagged suitable for skin or potential irritant", "Scanned products"],
  ],
  c: [
    ["m-analysis", "Skin analysis camera view with a framing guide", "Skin analysis"],
    ["m-analysis-results-1", "Your Skin Today: hydration, redness, pigmentation and texture with a skin summary", "Scan results"],
    ["m-analysis-results-2", "Tips and tricks based on the latest skin scan", "Tips"],
    ["m-calendar", "Skin calendar with logged days highlighted", "Calendar"],
  ],
} as const

function Phones({ items }: { items: readonly (readonly [string, string, string])[] }) {
  return (
    <div className="rp-row">
      {items.map(([n, alt, cap], i) => (
        <motion.figure
          className="rp-phone"
          key={n}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease, delay: i * 0.08 }}
        >
          <img
            src={`/assets/roop/${n}.png`}
            alt={alt}
            loading="lazy"
            decoding="async"
            onError={(event) => {
              const figure = event.currentTarget.closest("figure")
              if (figure) figure.hidden = true
            }}
          />
          <figcaption>{cap}</figcaption>
        </motion.figure>
      ))}
    </div>
  )
}

export default function Roop() {
  const [active, setActive] = useState("overview")
  useEffect(() => { window.scrollTo(0, 0) }, [])
  useEffect(() => {
    const els = chapters.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-20% 0px -70% 0px" },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <div className="case-study roop">
        <Navigation />
        <Contents active={active} />
        <main className="cs-main">
          <section className="cs-hero" id="overview" aria-labelledby="rp-title">
            <div className="cs-hero-copy">
              <p className="cs-note">UX research + product design</p>
              <h1 id="rp-title">Roop</h1>
              <p className="cs-lead">A skincare guidance app where modern actives meet their traditional origin. It helps Indian Gen Z scan products, understand ingredients and track how their skin responds.</p>
            </div>
            <figure className="rp-cover">
              <img src="/assets/roop/cover.jpg" alt="Roop Skin cover: a close portrait of a woman holding a glass dropper bottle, with the Roop Skin wordmark" width={1920} height={1080} />
            </figure>
            <dl className="cs-facts">
              <div><dt>Role</dt><dd>UX Researcher &amp; Product Designer</dd></div>
              <div><dt>Team</dt><dd>3 student designers</dd></div>
              <div><dt>Context</dt><dd>College coursework, 2025: contextual research, system analysis, usability testing</dd></div>
              <div><dt>Status</dt><dd>Design concept, tested with 6 users</dd></div>
            </dl>
          </section>

          <Chapter id="problem" title="People are adopting actives they can't read.">
            <div className="cs-split">
              <p className="cs-lead">Advertising, influencers and peer pressure are reshaping Indian skincare around Western ideals. Many young people adopt chemical actives without understanding ingredient safety, while traditional remedies are set aside.</p>
              <blockquote className="cs-statement">
                How might we give young Indians clear, trusted, culturally relevant skincare guidance, so they can choose products more safely?
                <footer>Indian Gen Z and urban and semi-urban skincare consumers · ingredient safety · product suitability · unrealistic beauty standards</footer>
              </blockquote>
            </div>
          </Chapter>

          <Chapter id="research" title="Four findings, four design responses">
            <p className="cs-lead">Research ran across three course modules: contextual interviews with Gen Z students, three surveys, stakeholder and jobs-to-be-done analysis, a competitor study, and later usability testing. The numbers below come from a 13-response survey, so read them as directional.</p>
            <ol className="cs-ins">
              {insights.map((r) => (
                <li key={r.found}>
                  <div><Chip t={r.tag} /><h3>Found</h3><p>{r.found}</p></div>
                  <div><h3>Why it matters</h3><p>{r.matters}</p></div>
                  <div className="cs-resp"><Chip t="Design response" /><h3>Opportunity</h3><p>{r.response}</p></div>
                </li>
              ))}
            </ol>
          </Chapter>

          <Chapter id="direction" title="One loop: know your skin, check the product, watch what happens.">
            <p className="cs-lead">Our ideation used SCAMPER, impact-versus-effort and dot voting. Two ideas stood out: combine Indian ingredients with modern science, and eliminate confusion around actives with simpler guidance. The quiz-led concept set out the profile, red-flag alerts, traditional alternatives and education that Roop builds on.</p>
            <ol className="cs-seq">
              <li><h3>Understand your skin</h3><span>Quiz + analysis</span><p>A short profile and a photo-based skin read.</p></li>
              <li><h3>Assess products</h3><span>Scan</span><p>Ingredients, plus natural and Ayurvedic alternatives.</p></li>
              <li><h3>Track changes</h3><span>Log + calendar</span><p>Symptoms, products tried, sleep, stress and sun.</p></li>
              <li><h3>Keep learning</h3><span>Tips</span><p>Daily guidance and short reads based on results.</p></li>
            </ol>
            <p className="cs-small">Our system diagrams show symptom entries combined with quiz and scan history to produce suggestions. We did not document a single automated pipeline across all features.</p>
          </Chapter>

          <Chapter id="experience" title="Understand. Choose. Track.">
            <div className="cs-stage">
              <div className="cs-stage-text"><h3>Start from home</h3><p>The home screen is the hub. It shows the week's activity and a skin health score from today's scan, with daily steps, and puts the two main actions, skin analysis and product scan, one tap away.</p><p className="cs-small">Scores and dates on these screens are sample data.</p></div>
              <Phones items={groups.home} />
            </div>
            <div className="cs-stage">
              <div className="cs-stage-text"><h3>Understand your skin</h3><p>A short quiz covers skin type, sensitivity and up to three concerns, with "Skip for now" always available.</p></div>
              <Phones items={groups.a} />
            </div>
            <div className="cs-stage">
              <div className="cs-stage-text"><h3>Make informed choices</h3><p>The camera asks for the front label. Results pair each active with natural swaps and Ayurvedic equivalents, and scanned products stay in one place, tagged "Suitable for skin" or "Potential irritant".</p></div>
              <Phones items={groups.b} />
            </div>
            <div className="cs-stage">
              <div className="cs-stage-text"><h3>Track and learn</h3><p>A skin scan summarises hydration, redness, pigmentation and texture, linked to what the user logged that day. Results lead to simple tips, and a calendar shows logged days.</p></div>
              <Phones items={groups.c} />
            </div>
          </Chapter>

          <Chapter id="reflection" title="What testing and the research taught me">
            <p className="cs-lead"><Chip t="Usability testing" /> We tested the skin quiz, product scan and symptom log in person with 6 skincare enthusiasts aged 18–25 (3 women, 3 men).</p>
            <ul className="cs-learn">
              <li>The quiz was easy (6 of 6 passed) but felt too short to capture detailed concerns.</li>
              <li>Product scan and symptom log each had 3 of 6 pass unaided, 1 fail and 2 prompted. Testers read the scan icon as a payment QR code, and several missed the Submit button under the navigation bar. The symptom scales and the "Skin Journey" versus "Log Symptoms" labels also confused people.</li>
              <li>Needs are situational, not just "I want good skin". Reframing "add a scanner" as "instant validation when buying" sharpened feature priorities.</li>
            </ul>
            <p className="cs-small">The current screens use a bottle-and-drop scan icon and a Done button clear of the navigation bar. We have not re-tested them, and the alternatives and recommendations have not been reviewed by dermatologists or Ayurvedic practitioners. Next: re-test scan discoverability, review the content with experts, and decide how Roop treats safety ratings.</p>
            <p className="cs-small">Team: Vanshika Kaup, Nandhitha R., Kritvee Modi.</p>
            <a className="cs-next-link" href="/capy">Next project: Capygo ↗</a>
          </Chapter>
        </main>
      </div>
    </MotionConfig>
  )
}
