import { useEffect, useState } from "react"
import { motion, MotionConfig } from "motion/react"
import Navigation from "../components/Navigation"
import "./capygo.css"
import "./loading.css"

const PROTO = "https://www.figma.com/make/b5fXW7L9vBbsoqufpyABNY/Loading-screens?fullscreen=1&t=KWtK4w0J0FLSdvzR-1&code-node-id=0-9"
const img = (n: string) => `/assets/loading/${n}.png`
const ease = [0.22, 1, 0.36, 1] as const
const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.6, ease },
}
const chapters = [
  { id: "overview", label: "Overview" },
  { id: "question", label: "Research Question" },
  { id: "design", label: "Experimental Design" },
  { id: "prototype", label: "Interactive Prototype" },
  { id: "findings", label: "Findings & Results" },
  { id: "implications", label: "Implications & Reflection" },
] as const

const Cta = ({ children = "Explore the Interactive Prototype" }: { children?: string }) => (
  <a className="lw-cta" href={PROTO} target="_blank" rel="noopener noreferrer">{children} <span aria-hidden="true">↗</span></a>
)

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
      <p className="cs-toc-id">The Psychology of Loading / Research</p>
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

const designs = ["Basic", "Fancy", "Skeleton"] as const
const shots = { Basic: "basic", Fancy: "fancy", Skeleton: "skeleton" } as const
const notes = { Basic: "Plain static indicator", Fancy: "Animated, colour-filled progress bar", Skeleton: "Structural placeholder pattern" } as const

// Exact condition means from the report's results chart (order: Basic, Fancy, Skeleton)
const metrics = [
  { name: "Perceived duration (s)", max: 25, note: "Objective sequence: about 19 s", d: [12.2, 10.3, 11.7], m: [11.03, 10.77, 12.37] },
  { name: "Satisfaction (1–5)", max: 5, note: "", d: [3.6, 3.83, 3.63], m: [4.13, 3.67, 3.5] },
  { name: "Trust (1–5)", max: 5, note: "Device × design interaction: p = .014", d: [3.7, 4.03, 3.73], m: [4.23, 3.7, 3.6] },
] as const

function Bars({ k }: { k: (typeof metrics)[number] }) {
  return (
    <figure className="lw-chart">
      <figcaption>
        <b>{k.name}</b>
        <span>
          {k.name.includes("(s)")
            ? "Bar scale: 0–25 seconds"
            : "Response scale: 1–5 (bars start at zero)"}
        </span>
      </figcaption>
      <div
        className="lw-plot"
        role="img"
        aria-label={`Desktop: ${designs.map((d, i) => `${d} ${k.d[i]}`).join(", ")}. Mobile: ${designs.map((d, i) => `${d} ${k.m[i]}`).join(", ")}`}
      >
        {([["Desktop", k.d], ["Mobile", k.m]] as const).map(([dev, vals]) => (
          <div className="lw-group" key={dev}>
            <span className="lw-device">{dev}</span>
            <div className="lw-bars">
              {vals.map((v, i) => (
                <div
                  key={i}
                  className={`lw-bar lw-bar-${i}`}
                  style={{ height: `${(v / k.max) * 100}%` }}
                  aria-hidden="true"
                >
                  <em>{v}</em>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </figure>
  )
}

export default function Loading() {
  const [active, setActive] = useState("overview")
  const [embed, setEmbed] = useState(false)
  useEffect(() => {
    window.scrollTo(0, 0)
    const previousTitle = document.title
    document.title = "The Psychology of Loading | Kritvee Modi"
    return () => { document.title = previousTitle }
  }, [])
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
      <div className="case-study loading">
        <Navigation />
        <Contents active={active} />
        <main className="cs-main">
          <section className="cs-hero" id="overview" aria-labelledby="lw-title">
            <div className="cs-hero-copy">
              <p className="cs-note">UX Research · Experimental Study</p>
              <h1 id="lw-title">The Psychology of Loading</h1>
              <p className="cs-lead">A controlled study of perceived waiting time across mobile and desktop interfaces.</p>
              <Cta />
            </div>
            <dl className="cs-facts">
              <div><dt>Measures</dt><dd>Perceived duration · satisfaction · trust</dd></div>
              <div><dt>Design</dt><dd>2 × 3 within-subjects: device × loading screen</dd></div>
              <div><dt>Sample</dt><dd>30 participants analysed (34 responded, 4 pilot)</dd></div>
              <div><dt>Research team</dt><dd>Maria Saju · Parth Ketkar · Vanshika Kaup · Nanditha R · Kritvee Modi</dd></div>
            </dl>
            <p className="cs-small">A student research project examining the experience of waiting, not a redesign of a loading animation.</p>
          </section>

          <Chapter id="question" title="The clock says one thing. The user feels another.">
            <div className="cs-split">
              <div className="cs-prose">
                <p>Waiting is shaped by attention as well as elapsed time. Prior work links clock-watching with longer perceived waits and finds progress feedback can help; evidence for skeleton screens is less clear.</p>
                <p className="cs-small">Zakay &amp; Block (1995); Harrison et al. (2010); Mejtoft et al. (2018).</p>
                <p><b>The gap.</b> Device context and loading design are often studied separately. This study held the checkout and wait constant while comparing both together.</p>
              </div>
              <blockquote className="cs-statement">
                How do device context and loading-screen design influence perceived waiting time, satisfaction, and trust?
                <footer>H1: perceived duration would differ between mobile and desktop. · H2: second-screening habit would correlate positively with perceived duration, regardless of device.</footer>
              </blockquote>
            </div>
            <div className="lw-gap" aria-label="Actual versus perceived wait">
              <div><span>Actual wait</span><i style={{ width: "100%" }} /><b>About 19 seconds in every condition</b></div>
              <div><span>Perceived estimates</span><i style={{ width: "60%" }} /><b>Means ranged from 10.3 to 12.4 seconds</b></div>
            </div>
          </Chapter>

          <Chapter id="design" title="Six conditions. Every participant saw all of them.">
            <p className="cs-lead">Three loading treatments were tested on both desktop and mobile. Each simulated checkout used the same approximately 19-second wait.</p>
            <div className="lw-condition-grid" aria-label="The three loading-screen conditions">
              {designs.map((d) => (
                <figure className="lw-condition" key={d}>
                  <div className="lw-condition-image">
                    <img src={img(shots[d])} alt={`${d} loading screen: ${notes[d]}`} />
                  </div>
                  <figcaption>
                    <b>{d}</b>
                    <span>{notes[d]}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="lw-matrix" role="table" aria-label="2 by 3 experimental design">
              <div role="row"><span />{designs.map((d) => <div role="columnheader" key={d}>{d}</div>)}</div>
              {["Mobile", "Desktop"].map((dev) => (
                <div role="row" key={dev}><b role="rowheader">{dev}</b>{designs.map((d) => <span role="cell" key={d}>{dev} + {d.toLowerCase()}</span>)}</div>
              ))}
            </div>
            <ol className="cs-seq">
              <li><h3>Briefing</h3><span>Cover story</span><p>General digital-screen experiences; waiting was not disclosed.</p></li>
              <li><h3>Six conditions</h3><span>Fictional checkout</span><p>Same flow and approximately 19-second wait.</p></li>
              <li><h3>After each</h3><span>Questionnaire</span><p>Duration estimate, impressions, satisfaction and trust.</p></li>
              <li><h3>At the end</h3><span>Final questions</span><p>Fastest, preferred, second-screening habit and demographics.</p></li>
            </ol>
            <p className="cs-small">A four-person pilot led to a shorter briefing and questionnaire, breaks between conditions, and a jumbled sequence. The final order was fixed and not counterbalanced, so order effects remain possible.</p>
          </Chapter>

          <Chapter id="prototype" title="Try the experiment yourself.">
            <p className="cs-lead">Explore the checkout flow and compare how the three loading treatments appear across mobile and desktop. The prototype simulates product page, cart, loading and confirmation. It is a research artefact, not a production app.</p>
            <div className="lw-proto">
              <div className="lw-proto-shots">
                <img src={img("desktop-product")} alt="Desktop product page of the checkout prototype" />
                <img src={img("mobile-cart")} alt="Mobile cart screen of the checkout prototype" />
              </div>
              <div className="lw-proto-side">
                <p className="cs-note">Figma prototype</p>
                <Cta />
                <button type="button" className="lw-ghost" onClick={() => setEmbed((v) => !v)} aria-expanded={embed}>
                  {embed ? "Hide embedded view" : "Try embedded view here"}
                </button>
                <p className="cs-small">Embedding is controlled by Figma and may show a blank frame. If it does, use the button to open the prototype in a new tab.</p>
              </div>
            </div>
            {embed && (
              <div className="lw-embed">
                <iframe src={PROTO} title="Loading screens interactive Figma prototype" loading="lazy" allowFullScreen />
              </div>
            )}
          </Chapter>

          <Chapter id="findings" title="Device alone did not matter. Design and device together did, for trust.">
            <div className="lw-charts">
              {metrics.map((k) => <Bars key={k.name} k={k} />)}
            </div>
            <div className="lw-legend" aria-label="Chart legend">
              <span><i className="lw-bar-0" />Basic</span>
              <span><i className="lw-bar-1" />Fancy</span>
              <span><i className="lw-bar-2" />Skeleton</span>
            </div>
            <p className="cs-small">Bars show reported condition means. The source chart includes variability for duration; error bars are not redrawn here.</p>
            <div className="lw-stats">
              <div>
                <h3>Statistically significant</h3>
                <ul>
                  <li><b>Device × design on trust:</b> p = .014. The design effect differed by device.</li>
                  <li><b>Habit on duration:</b> p = .029; higher habit scores accompanied longer estimates. Device × habit was not significant (p = .451).</li>
                  <li><b>“Fast” descriptor:</b> p = .024; Fancy was chosen most (18 responses).</li>
                </ul>
              </div>
              <div>
                <h3>Not significant</h3>
                <ul>
                  <li><b>Device:</b> duration p = .984, satisfaction p = .583, trust p = .798.</li>
                  <li><b>Design:</b> trends only—duration p = .085, satisfaction p = .089, trust p = .087.</li>
                  <li>H1 was not supported; H2 was consistent with the results.</li>
                </ul>
              </div>
            </div>
            <figure className="lw-judg">
              <img src={img("judgments")} alt="Bar chart: how many participants chose each of six experiences as felt fastest and as preferred overall" />
              <figcaption>
                <b>Felt fastest vs preferred overall</b>
                Exp 1–6 are mobile basic, desktop basic, mobile fancy, desktop fancy, mobile skeleton and desktop skeleton. Mobile + skeleton led both (9 fastest, 10 preferred) but had the longest mean estimate (12.37 s). The overall distribution was not significant (p = .154).
              </figcaption>
            </figure>
            <p className="cs-small">Second-screening averaged 3.4/5; 63% defaulted to mobile, limiting variation in these habits.</p>
          </Chapter>

          <Chapter id="implications" title="What the findings may mean for design.">
            <div className="lw-reflection">
              <section>
                <h3>What we found</h3>
                <p>Device alone had no significant effect on the measured outcomes. Trust showed a significant device × design interaction (p = .014).</p>
              </section>
              <section>
                <h3>What it could mean for design</h3>
                <p>It may be worth evaluating loading treatments across device contexts rather than assuming one presentation feels the same everywhere.</p>
              </section>
              <section>
                <h3>What needs further testing</h3>
                <p>Retest the trust interaction and design trends with a larger, counterbalanced sample. The current results do not establish which treatment is best.</p>
              </section>
            </div>
            <p className="cs-small lw-limitations">Limitations: 30 analysed participants from one university, a single-item habit measure, and fixed, non-counterbalanced condition order.</p>
            <p className="cs-lead lw-closing">Device alone did not matter. Design and device together did, for trust.</p>
            <a className="cs-next-link" href="/#work">Back to selected work ↗</a>
          </Chapter>
        </main>
      </div>
    </MotionConfig>
  )
}
