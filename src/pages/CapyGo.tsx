import { useEffect, useState } from "react"
import { motion, MotionConfig } from "motion/react"
import Navigation from "../components/Navigation"
import "./capygo.css"

const img = (n: string) => `/assets/projects/capygo/${n}.png`
const ease = [0.22, 1, 0.36, 1] as const
const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.6, ease },
}

const chapters = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "Problem" },
  { id: "research", label: "Research" },
  { id: "concept", label: "Concept" },
  { id: "experience", label: "Experience" },
  { id: "reflection", label: "Reflection" },
] as const

type Tag = "Primary research" | "Desk research" | "Team synthesis" | "Design hypothesis" | "Proposed feature"
const Chip = ({ t }: { t: Tag }) => <span className="cs-chip">{t}</span>

function Contents({ active }: { active: string }) {
  return (
    <nav className="cs-toc" aria-label="Case study contents">
      <p className="cs-note cs-toc-title">Contents</p>
      <ol>
        {chapters.map((c, i) => (
          <li key={c.id}>
            <a href={`#${c.id}`} aria-current={active === c.id ? "true" : undefined}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {c.label}
            </a>
          </li>
        ))}
      </ol>
      <p className="cs-toc-id">Capygo / Case study</p>
    </nav>
  )
}

function Chapter({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  const n = chapters.findIndex((c) => c.id === id) + 1
  return (
    <motion.section className="cs-chapter" id={id} aria-labelledby={`${id}-h`} {...reveal}>
      <header className="cs-chapter-head">
        <p className="cs-note">{String(n).padStart(2, "0")} / {chapters[n - 1].label}</p>
        <h2 id={`${id}-h`}>{title}</h2>
      </header>
      {children}
    </motion.section>
  )
}

type Shot = readonly [file: string, alt: string, caption: string]

function Phones({ items, wide = false }: { items: readonly Shot[]; wide?: boolean }) {
  return (
    <div className={wide ? "cp-row cp-row-wide" : "cp-row"} {...(wide ? { tabIndex: 0, role: "region", "aria-label": "Screens, scrollable" } : {})}>
      {items.map(([n, alt, cap], i) => (
        <motion.figure
          className="cp-phone"
          key={n}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease, delay: Math.min(i, 4) * 0.08 }}
        >
          <img src={img(n)} alt={alt} width={540} height={1100} loading="lazy" decoding="async" />
          <figcaption>{cap}</figcaption>
        </motion.figure>
      ))}
    </div>
  )
}

const flow = {
  welcome: [
    ["n-welcome", "Welcome to Capy screen with the capybara mascot", "Welcome"],
    ["n-welcome-2", "Capygo introduction: instant safe mode, gentle companion guidance, real-time detection, smartwatch integration", "Safe space"],
  ],
  recognise: [
    ["n-home", "Capygo home: 'You handled 7 urges today', an I feel triggered button, trusted contacts and rewards", "Home"],
    ["n-trigger", "Feeling triggered? prompt after a rise in heartbeat, with Yes and a 'Nope, I'm all good' link", "Trigger prompt"],
    ["n-notify", "Would you like to notify your person: choose a trusted contact or skip", "Notify, or skip"],
  ],
  interrupt: [
    ["n-start-game", "Word game start screen with a Start button", "Start the game"],
    ["n-game-reward", "Trophy screen: you completed the game, with a View scratch card button", "Completed: reward"],
  ],
  recover: [
    ["n-start-grounding", "The capybara says 'I noticed you didn't complete the game', with Skip and Continue", "Start grounding"],
    ["n-g1", "Grounding: name 5 things you can see", "5 see"],
    ["n-g2", "Grounding: name 4 things you can touch", "4 touch"],
    ["n-g3", "Grounding: name 3 things you can hear", "3 hear"],
    ["n-g4", "Grounding: name 2 things you can smell", "2 smell"],
    ["n-g5", "Grounding: name 1 thing you can taste", "1 taste"],
    ["n-grounding-finished", "Celebration screen: Woohoo, you did it, I hope you feel better now", "Finished"],
  ],
  progress: [
    ["n-progress-today", "Check your progress: the capybara says you handled 7 urges today", "Today"],
    ["n-progress-monday", "Monday's progress: a bar chart of pauses by hour and insights", "Over time"],
  ],
} as const

const insights = [
  { tag: "Desk research", found: "Most existing apps must be opened and navigated mid-distress, which takes effort when anxiety is already high.", matters: "Help has to cost almost nothing to start.", response: "A double press or a one-question watch prompt starts safe mode. One prompt at a time, and the app picks the game." },
  { tag: "Desk research", found: "Existing tools offer little real-time support at the moment of a compulsion.", matters: "The urge is strongest before anyone can open an app.", response: "The watch notices a rise in heart rate and asks, rather than assuming." },
  { tag: "Desk research", found: "Existing tools have no physical or sensory grounding element, and often feel clinical.", matters: "Help should feel like company, not treatment.", response: "A five-senses grounding exercise, led by a gentle capybara companion." },
  { tag: "Primary research", found: "In expert conversations, family misunderstanding came up as a real problem.", matters: "Support from people close to the user matters, but must stay their choice.", response: "Optional trusted contacts. The user decides who is notified, or skips." },
] as const

export default function CapyGo() {
  const [active, setActive] = useState("overview")

  useEffect(() => { window.scrollTo(0, 0) }, [])
  useEffect(() => {
    const els = chapters.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-20% 0px -70% 0px" },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <div className="case-study">
        <Navigation />
        <Contents active={active} />
        <main className="cs-main">
          <section className="cs-hero" id="overview" aria-labelledby="cs-title">
            <div className="cs-hero-copy">
              <p className="cs-note">UX research + product design</p>
              <h1 id="cs-title">Capygo</h1>
              <p className="cs-lead">Helping users pause, process, and regain control during OCD triggers. A companion app and smartwatch concept that steps in when thinking is hardest.</p>
            </div>
            <div className="cp-hero-art">
              <img src={img("n-hero")} alt="Capygo on a phone asking 'Feeling triggered?' beside a smartwatch showing a 30 second timer and heart rate" width={1100} height={956} />
            </div>
            <dl className="cs-facts">
              <div><dt>Role</dt><dd>UX Researcher &amp; Product Designer</dd></div>
              <div><dt>Team</dt><dd>4 student designers</dd></div>
              <div><dt>Timeline</dt><dd>2 weeks</dd></div>
              <div><dt>Course</dt><dd>Design for Special Needs</dd></div>
              <div><dt>Status</dt><dd>Design concept, not usability tested</dd></div>
            </dl>
            <p className="cs-small">Within the team, I contributed to research, synthesis, ideation, concept development, user flows and UI design.</p>
          </section>

          <Chapter id="problem" title="Thinking is hardest exactly when help is needed.">
            <div className="cs-split">
              <div className="cs-prose">
                <p>Riya, 22, touches a shared door handle between classes. Within seconds she is anxious and sure her hands are dirty. Her usual response is to rush to the washroom and wash, again and again.</p>
                <p className="cs-small">Riya is a scenario our team wrote. She is not a research participant.</p>
              </div>
              <blockquote className="cs-statement">
                Young people with contamination OCD can get stuck in a loop of intrusive thoughts and compulsions in everyday places, with no immediate support to pause and manage the urge.
                <footer>Students aged 16–25 · classrooms and public spaces · focused on repetitive, action-based urges that can be interrupted in real time</footer>
              </blockquote>
            </div>
          </Chapter>

          <Chapter id="research" title="Four findings, four design responses">
            <p className="cs-lead">We spoke with approximately 2–3 people who experience OCD and approximately 2–3 domain experts, including psychiatrists and psychologists. We paired this with a SWOT analysis of existing support tools.</p>
            <ol className="cs-ins">
              {insights.map((r) => (
                <li key={r.found}>
                  <div><Chip t={r.tag} /><h3>Found</h3><p>{r.found}</p></div>
                  <div><h3>Why it matters</h3><p>{r.matters}</p></div>
                  <div className="cs-resp"><Chip t="Team synthesis" /><h3>Design response</h3><p>{r.response}</p></div>
                </li>
              ))}
            </ol>
          </Chapter>

          <Chapter id="concept" title="A watch that notices. An app that guides.">
            <p className="cs-lead">We explored physical objects, digital systems, AI pattern prediction and a desk companion. We chose a watch plus app because a watch can notice a trigger without asking anything of the user, while the phone gives somewhere to be guided. It is meant to sit alongside professional support, not replace it.</p>
            <ol className="cs-seq">
              <li><h3>Trigger</h3><span>Watch</span><p>A rise in heart rate, or a double press of the power button.</p></li>
              <li><h3>Intervention</h3><span>App</span><p>"Feeling triggered?" Yes starts safe mode and silences notifications, calls and alarms. Optionally, a trusted contact is notified.</p></li>
              <li><h3>Distraction or grounding</h3><span>App</span><p>A game the app picks. If it is left unfinished, a five-senses grounding exercise follows.</p></li>
              <li><h3>Follow-up</h3><span>App</span><p>A scratch card or a reassuring message, then a progress view over time.</p></li>
            </ol>
            <p className="cs-small"><Chip t="Design hypothesis" /> Random game choice should stop people fixating on one game. Intended effect: awareness of triggers over time. Neither has been tested.</p>
          </Chapter>

          <Chapter id="experience" title="From welcome to recovery.">
            <div className="cs-stage">
              <div className="cs-stage-text"><h3>Welcome</h3><p>Capygo opens with a single action and a short promise: a safe space with instant safe mode, gentle companion guidance, real-time detection and smartwatch integration.</p></div>
              <Phones items={flow.welcome} />
            </div>
            <div className="cs-stage">
              <div className="cs-stage-text"><h3>Recognise</h3><p>Home keeps the trigger button, trusted contacts and rewards in one place. When the watch notices a rise in heartbeat, Capygo asks instead of assuming, and "Nope, I'm all good" is always there. Notifying a trusted person is optional, and the user can skip.</p></div>
              <Phones items={flow.recognise} />
            </div>
            <div className="cs-stage">
              <div className="cs-stage-text"><h3>Interrupt</h3><p>A short word game, chosen for the user so there is no decision to make, redirects attention away from the urge. Finishing it earns a scratch card as positive reinforcement.</p></div>
              <Phones items={flow.interrupt} />
            </div>
            <div className="cs-stage cs-stage-wide">
              <div className="cs-stage-text"><h3>Recover</h3><p>If the game is left unfinished, Capygo offers grounding with a choice to continue or skip. The user names what they notice through each sense, from five things they can see down to one they can taste, then gets a reassuring close.</p></div>
              <Phones items={flow.recover} wide />
            </div>
            <div className="cs-stage">
              <div className="cs-stage-text"><h3>Track your progress</h3><p>Users can see how many urges they handled today, then review pauses over time with simple insights.</p><p className="cs-small">Figures and insights are sample data.</p></div>
              <Phones items={flow.progress} />
            </div>
          </Chapter>

          <Chapter id="reflection" title="What I took from it">
            <ul className="cs-learn">
              <li>During a trigger, people can find it hard to process information or navigate complex interfaces, so reducing effort became the priority.</li>
              <li>In a sensitive context, a supportive companion tone matters more than clinical authority.</li>
              <li>Interaction does not have to end at the screen. Sensory grounding was a first step toward that.</li>
            </ul>
            <p className="cs-small">Capygo is a two-week design concept without formal usability testing. Next: test activation and grounding with the people it is designed for, guided by clinicians, check how notifications and privacy feel, decide how safe mode handles emergency calls, and prototype the wearable interaction.</p>
            <p className="cs-small">Team: Vanshika Bhargava, Vanshika Kaup, Vaibhavi Kunjir, Kritvee Modi.</p>
            <a className="cs-next-link" href="/roop">Next project: Roop ↗</a>
          </Chapter>
        </main>
      </div>
    </MotionConfig>
  )
}
