import { Component } from "react"
import type { ErrorInfo, ReactNode } from "react"
import { projects } from "./data/portfolio"
import About from "./pages/About"
import CaseStudyPlaceholder from "./pages/CaseStudyPlaceholder"
import Home from "./pages/Home"

class AppErrorBoundary extends Component<{ children: ReactNode }, {
  hasError: boolean
}> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Portfolio render failed", error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="app-error" role="alert">
          <p>The portfolio could not load correctly.</p>
          <a href="/">Reload portfolio</a>
        </main>
      )
    }

    return this.props.children
  }
}

export default function App() {
  const path = window.location.pathname
  const project = projects.find((item) => `/${item.slug}` === path)

  return (
    <AppErrorBoundary>
      {path === "/about" ? (
        <About />
      ) : project ? (
        <CaseStudyPlaceholder project={project} />
      ) : (
        <Home />
      )}
    </AppErrorBoundary>
  )
}
