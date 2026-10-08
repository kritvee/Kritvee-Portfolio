export default function Navigation() {
  return (
    <header className="site-nav">
      <a className="brand" href="/" aria-label="Kritvee Modi, home">
        Kritvee Modi
      </a>
      <nav aria-label="Primary navigation">
        <a href="/#work">Work</a>
        <a
          href="/assets/Kritvee-Modi-Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Resume
        </a>
        <a href="/about">About</a>
        <a className="contact-link" href="/#contact">
          Contact
        </a>
      </nav>
    </header>
  )
}
