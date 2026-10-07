import Navigation from "../components/Navigation"
import { projects } from "../data/portfolio"

type Project = typeof projects[number]

export default function CaseStudyPlaceholder({
  project,
}: {
  project: Project
}) {
  return (
    <div className="case-placeholder">
      <Navigation />
      <main>
        <div className="case-placeholder-meta">
          <span>Case study {project.number}</span>
          <span>{project.discipline}</span>
        </div>
        <h1>{project.title}</h1>
        <p>{project.description}</p>
        <div className="case-placeholder-note">
          <p>The concise, redesigned case study is currently being edited.</p>
          <a href="/#work">Return to selected work ←</a>
        </div>
      </main>
    </div>
  )
}
