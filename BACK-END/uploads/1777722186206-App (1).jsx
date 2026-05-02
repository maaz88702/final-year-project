import { useState, useEffect } from "react";

// ── Inline CSS overrides ──────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Sans+3:wght@300;400;500;600&display=swap');

  :root {
    --navy: #002147;
    --navy-light: #003070;
    --gold: #b8960c;
    --gray-bg: #f8f9fa;
    --gray-border: #e2e6ea;
    --text-main: #1a1a2e;
    --text-muted: #6c757d;
  }

  * { box-sizing: border-box; }

  body {
    font-family: 'Source Sans 3', sans-serif;
    color: var(--text-main);
    background: #fff;
  }

  /* ── Navbar ── */
  .gdc-navbar {
    background: #fff !important;
    border-bottom: 1px solid var(--gray-border);
    padding: 0.85rem 0;
    box-shadow: 0 2px 12px rgba(0,33,71,0.06);
  }
  .gdc-navbar .navbar-brand {
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    font-size: 1.35rem;
    color: var(--navy) !important;
    letter-spacing: 0.04em;
  }
  .gdc-navbar .navbar-brand span {
    color: var(--gold);
  }
  .gdc-navbar .nav-link {
    font-family: 'Source Sans 3', sans-serif;
    font-weight: 500;
    font-size: 0.88rem;
    color: var(--text-main) !important;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 0.5rem 1.1rem !important;
    position: relative;
    transition: color 0.2s;
  }
  .gdc-navbar .nav-link::after {
    content: '';
    position: absolute;
    bottom: 0; left: 1.1rem; right: 1.1rem;
    height: 2px;
    background: var(--navy);
    transform: scaleX(0);
    transition: transform 0.25s ease;
  }
  .gdc-navbar .nav-link:hover { color: var(--navy) !important; }
  .gdc-navbar .nav-link:hover::after { transform: scaleX(1); }
  .gdc-navbar .nav-link.active { color: var(--navy) !important; }
  .gdc-navbar .nav-link.active::after { transform: scaleX(1); }

  /* ── Hero ── */
  #home {
    background: linear-gradient(160deg, #f0f4f8 0%, #eaf0f7 60%, #dde9f5 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding-top: 80px;
    position: relative;
    overflow: hidden;
  }
  #home::before {
    content: '';
    position: absolute;
    top: -80px; right: -120px;
    width: 520px; height: 520px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,33,71,0.07) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero-overline {
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 1rem;
    display: block;
  }
  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.4rem, 5vw, 3.8rem);
    font-weight: 700;
    color: var(--navy);
    line-height: 1.15;
    letter-spacing: -0.01em;
    margin-bottom: 1.4rem;
  }
  .hero-title em {
    font-style: italic;
    color: var(--navy-light);
  }
  .hero-sub {
    font-size: 1.1rem;
    color: var(--text-muted);
    font-weight: 300;
    line-height: 1.7;
    max-width: 480px;
    margin-bottom: 2.2rem;
  }
  .btn-navy {
    background: var(--navy);
    color: #fff;
    border: none;
    padding: 0.8rem 2rem;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    border-radius: 2px;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    text-decoration: none;
    display: inline-block;
  }
  .btn-navy:hover {
    background: var(--navy-light);
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,33,71,0.22);
  }
  .btn-outline-navy {
    background: transparent;
    color: var(--navy);
    border: 1.5px solid var(--navy);
    padding: 0.75rem 1.8rem;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    border-radius: 2px;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-block;
  }
  .btn-outline-navy:hover {
    background: var(--navy);
    color: #fff;
  }
  .hero-stats {
    display: flex;
    gap: 2.5rem;
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid var(--gray-border);
  }
  .hero-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 700;
    color: var(--navy);
    line-height: 1;
  }
  .hero-stat-label {
    font-size: 0.78rem;
    color: var(--text-muted);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-top: 0.25rem;
  }
  .hero-img-wrap {
    position: relative;
  }
  .hero-img-wrap img {
    border-radius: 4px;
    box-shadow: 0 20px 60px rgba(0,33,71,0.15);
  }
  .hero-badge {
    position: absolute;
    bottom: -18px; left: -18px;
    background: var(--navy);
    color: #fff;
    padding: 1rem 1.4rem;
    border-radius: 4px;
    font-size: 0.78rem;
    letter-spacing: 0.08em;
    font-weight: 600;
    box-shadow: 0 8px 24px rgba(0,33,71,0.25);
  }
  .hero-badge strong {
    display: block;
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    letter-spacing: 0;
  }

  /* ── Section shared ── */
  .section-label {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 0.6rem;
    display: block;
  }
  .section-heading {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.8rem, 3vw, 2.6rem);
    font-weight: 700;
    color: var(--navy);
    letter-spacing: -0.01em;
    line-height: 1.2;
  }
  .section-desc {
    font-size: 1rem;
    color: var(--text-muted);
    font-weight: 300;
    line-height: 1.7;
    max-width: 520px;
    margin: 0 auto;
  }
  .divider-line {
    width: 40px; height: 3px;
    background: var(--navy);
    margin: 1rem 0 0;
  }

  /* ── Academics ── */
  #academics {
    background: #fff;
    padding: 100px 0;
  }
  .program-card {
    border: 1px solid var(--gray-border) !important;
    border-radius: 4px !important;
    padding: 2.4rem 2rem !important;
    box-shadow: 0 2px 16px rgba(0,33,71,0.05) !important;
    transition: box-shadow 0.25s, transform 0.25s;
    cursor: default;
    height: 100%;
    background: #fff;
  }
  .program-card:hover {
    box-shadow: 0 10px 40px rgba(0,33,71,0.12) !important;
    transform: translateY(-4px);
  }
  .program-icon {
    width: 48px; height: 48px;
    background: #eaf0f7;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.4rem;
    font-size: 1.3rem;
  }
  .program-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--navy);
    margin-bottom: 0.7rem;
    letter-spacing: 0.01em;
  }
  .program-desc {
    font-size: 0.92rem;
    color: var(--text-muted);
    line-height: 1.65;
    font-weight: 300;
    margin-bottom: 1.5rem;
  }
  .program-tag {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--navy);
    background: #eaf0f7;
    padding: 0.25rem 0.75rem;
    border-radius: 2px;
    margin-right: 0.4rem;
    margin-bottom: 0.4rem;
  }

  /* ── About ── */
  #about {
    background: var(--gray-bg);
    padding: 100px 0;
  }
  .about-img {
    border-radius: 4px;
    box-shadow: 0 12px 48px rgba(0,33,71,0.12);
    width: 100%;
    object-fit: cover;
    height: 440px;
  }
  .about-text p {
    font-size: 1rem;
    color: #444;
    font-weight: 300;
    line-height: 1.8;
    margin-bottom: 1rem;
  }
  .about-feature {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1.2rem;
  }
  .about-feature-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--navy);
    margin-top: 6px;
    flex-shrink: 0;
  }
  .about-feature-text {
    font-size: 0.92rem;
    color: #555;
    font-weight: 400;
    line-height: 1.6;
  }

  /* ── Gallery ── */
  #gallery {
    background: #fff;
    padding: 100px 0;
  }
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  .gallery-item {
    position: relative;
    overflow: hidden;
    border-radius: 4px;
    aspect-ratio: 4/3;
    background: #e2e6ea;
  }
  .gallery-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
  .gallery-item:hover img { transform: scale(1.06); }
  .gallery-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,33,71,0.5);
    opacity: 0;
    transition: opacity 0.3s;
    display: flex; align-items: center; justify-content: center;
    color: #fff;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
  .gallery-item:hover .gallery-overlay { opacity: 1; }
  @media (max-width: 768px) {
    .gallery-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 480px) {
    .gallery-grid { grid-template-columns: 1fr; }
  }

  /* ── Footer ── */
  footer {
    background: var(--navy);
    color: rgba(255,255,255,0.75);
    padding: 60px 0 30px;
  }
  footer .footer-brand {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.04em;
    margin-bottom: 0.5rem;
  }
  footer .footer-brand span { color: var(--gold); }
  footer p { font-size: 0.88rem; font-weight: 300; line-height: 1.7; }
  footer .footer-heading {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.45);
    margin-bottom: 1.2rem;
  }
  footer ul { list-style: none; padding: 0; margin: 0; }
  footer ul li { margin-bottom: 0.55rem; }
  footer ul li a {
    color: rgba(255,255,255,0.65);
    text-decoration: none;
    font-size: 0.88rem;
    font-weight: 300;
    transition: color 0.2s;
  }
  footer ul li a:hover { color: #fff; }
  footer .footer-divider {
    border-color: rgba(255,255,255,0.1);
    margin: 2.5rem 0 1.5rem;
  }
  footer .footer-bottom {
    font-size: 0.8rem;
    color: rgba(255,255,255,0.35);
  }
  .social-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px; height: 34px;
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 2px;
    color: rgba(255,255,255,0.6);
    text-decoration: none;
    font-size: 0.85rem;
    margin-right: 0.5rem;
    transition: all 0.2s;
  }
  .social-link:hover {
    border-color: rgba(255,255,255,0.6);
    color: #fff;
    background: rgba(255,255,255,0.08);
  }

  /* ── Scroll animation ── */
  .fade-up {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .fade-up.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

// ── Data ─────────────────────────────────────────────────────────────────────
const programs = [
  {
    icon: "💻",
    title: "Computer Science",
    desc: "A rigorous two-year program covering programming fundamentals, algorithms, databases, and modern software development. Prepares students for top engineering universities.",
    tags: ["Programming", "Algorithms", "Mathematics"],
  },
  {
    icon: "🔬",
    title: "Pre-Medical",
    desc: "Comprehensive preparation in Biology, Chemistry, and Physics for aspiring doctors and healthcare professionals. Strong focus on MDCAT readiness.",
    tags: ["Biology", "Chemistry", "Physics"],
  },
  {
    icon: "⚙️",
    title: "Pre-Engineering",
    desc: "In-depth study of Physics, Mathematics, and Chemistry, laying the groundwork for engineering disciplines at top universities across Pakistan.",
    tags: ["Physics", "Mathematics", "ECAT"],
  },
];

const galleryItems = [
  { label: "Campus Library", src: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80" },
  { label: "Science Labs", src: "https://images.unsplash.com/photo-1532094349884-543559c08671?w=600&q=80" },
  { label: "Lecture Hall", src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80" },
  { label: "Campus Grounds", src: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80" },
  { label: "Student Life", src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80" },
  { label: "Computer Lab", src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80" },
];

const features = [
  "Established institution with decades of academic excellence in Malakand Division.",
  "Qualified and experienced faculty dedicated to student success.",
  "State-of-the-art science and computer laboratories.",
  "Active student societies promoting leadership and extracurricular growth.",
  "Consistent top results in BISE Malakand board examinations.",
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeSection, setActiveSection] = useState("home");

  // Inject CSS
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Bootstrap CDN
  useEffect(() => {
    if (!document.getElementById("bs-cdn")) {
      const link = document.createElement("link");
      link.id = "bs-cdn";
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css";
      document.head.appendChild(link);
    }
  }, []);

  // Scroll-based active nav + fade-up
  useEffect(() => {
    const sections = ["home", "academics", "about", "gallery"];
    const onScroll = () => {
      const scrollY = window.scrollY + 100;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && scrollY >= el.offsetTop && scrollY < el.offsetTop + el.offsetHeight) {
          setActiveSection(id);
        }
      }
      // fade-up elements
      document.querySelectorAll(".fade-up").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight - 60) {
          el.classList.add("visible");
        }
      });
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className="navbar navbar-expand-lg gdc-navbar fixed-top">
        <div className="container">
          <a className="navbar-brand" href="#home" onClick={(e) => { e.preventDefault(); scrollTo("home"); }}>
            GDC <span>Thana</span>
          </a>
          <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navMenu">
            <ul className="navbar-nav gap-1">
              {[
                { id: "home", label: "Home" },
                { id: "academics", label: "Academics" },
                { id: "gallery", label: "Gallery" },
              ].map(({ id, label }) => (
                <li key={id} className="nav-item">
                  <a
                    className={`nav-link ${activeSection === id ? "active" : ""}`}
                    href={`#${id}`}
                    onClick={(e) => { e.preventDefault(); scrollTo(id); }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="home">
        <div className="container">
          <div className="row align-items-center gy-5">
            <div className="col-lg-6">
              <span className="hero-overline">Est. — Government Degree College</span>
              <h1 className="hero-title">
                Shaping Minds,<br /><em>Building Futures</em>
              </h1>
              <p className="hero-sub">
                GDC Thana, nestled in the heart of Malakand Division, offers premier intermediate education
                across Science and Computer programs — where academic rigour meets lifelong character.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <a href="#academics" className="btn-navy" onClick={(e) => { e.preventDefault(); scrollTo("academics"); }}>
                  Explore Programs
                </a>
                <a href="#about" className="btn-outline-navy" onClick={(e) => { e.preventDefault(); scrollTo("about"); }}>
                  Our Story
                </a>
              </div>
              <div className="hero-stats">
                {[
                  { num: "20+", label: "Years of Excellence" },
                  { num: "3", label: "Academic Programs" },
                  { num: "98%", label: "Pass Rate" },
                ].map(({ num, label }) => (
                  <div key={label}>
                    <div className="hero-stat-num">{num}</div>
                    <div className="hero-stat-label">{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <div className="hero-img-wrap ps-4">
                <img
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700&q=80"
                  alt="GDC Thana campus"
                  className="img-fluid"
                  style={{ borderRadius: 4, boxShadow: "0 20px 60px rgba(0,33,71,0.15)" }}
                />
                <div className="hero-badge">
                  <strong>BISE</strong>
                  Malakand Board
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ACADEMICS ── */}
      <section id="academics">
        <div className="container">
          <div className="row justify-content-center text-center mb-5 fade-up">
            <div className="col-lg-7">
              <span className="section-label">Academics</span>
              <h2 className="section-heading mb-3">Programs We Offer</h2>
              <p className="section-desc">
                Three focused intermediate programs designed to prepare students for Pakistan's most competitive universities and professional careers.
              </p>
            </div>
          </div>
          <div className="row g-4">
            {programs.map((p, i) => (
              <div key={i} className="col-md-4 fade-up" style={{ transitionDelay: `${i * 0.12}s` }}>
                <div className="program-card">
                  <div className="program-icon">{p.icon}</div>
                  <div className="program-title">{p.title}</div>
                  <p className="program-desc">{p.desc}</p>
                  <div>
                    {p.tags.map((t) => (
                      <span key={t} className="program-tag">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about">
        <div className="container">
          <div className="row align-items-center gy-5">
            <div className="col-lg-5 fade-up">
              <img
                src="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=700&q=80"
                alt="GDC Thana academics"
                className="about-img"
              />
            </div>
            <div className="col-lg-6 offset-lg-1 fade-up about-text" style={{ transitionDelay: "0.15s" }}>
              <span className="section-label">About the College</span>
              <h2 className="section-heading mb-3">A Legacy of Learning<br />in Malakand</h2>
              <div className="divider-line mb-4" />
              <p>
                Government Degree College Thana stands as one of the premier educational institutions
                of Malakand Division, committed to nurturing the intellectual and personal development
                of young scholars from across Khyber Pakhtunkhwa.
              </p>
              <p>
                Our institution blends time-honoured academic values with modern pedagogical approaches,
                equipping students with the knowledge and discipline required to excel in higher education and beyond.
              </p>
              <div className="mt-4">
                {features.map((f, i) => (
                  <div key={i} className="about-feature">
                    <div className="about-feature-dot" />
                    <div className="about-feature-text">{f}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <a
                  href="#academics"
                  className="btn-navy"
                  onClick={(e) => { e.preventDefault(); scrollTo("academics"); }}
                >
                  View Programs
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section id="gallery">
        <div className="container">
          <div className="row justify-content-center text-center mb-5 fade-up">
            <div className="col-lg-6">
              <span className="section-label">Gallery</span>
              <h2 className="section-heading mb-3">Life at GDC Thana</h2>
              <p className="section-desc">A glimpse into our campus, facilities, and the vibrant student community.</p>
            </div>
          </div>
          <div className="gallery-grid fade-up" style={{ transitionDelay: "0.1s" }}>
            {galleryItems.map((item, i) => (
              <div key={i} className="gallery-item">
                <img src={item.src} alt={item.label} />
                <div className="gallery-overlay">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-4">
              <div className="footer-brand">GDC <span>Thana</span></div>
              <p className="mt-2">
                Government Degree College Thana<br />
                Thana, Malakand Division<br />
                Khyber Pakhtunkhwa, Pakistan
              </p>
              <div className="mt-3">
                {["f", "tw", "ig", "yt"].map((s) => (
                  <a key={s} href="#" className="social-link" onClick={(e) => e.preventDefault()}>
                    {s === "f" ? "𝖋" : s === "tw" ? "𝕏" : s === "ig" ? "◎" : "▶"}
                  </a>
                ))}
              </div>
            </div>
            <div className="col-lg-2 offset-lg-1">
              <div className="footer-heading">Navigation</div>
              <ul>
                {["Home", "Academics", "Gallery"].map((l) => (
                  <li key={l}><a href="#" onClick={(e) => { e.preventDefault(); scrollTo(l.toLowerCase()); }}>{l}</a></li>
                ))}
              </ul>
            </div>
            <div className="col-lg-2">
              <div className="footer-heading">Programs</div>
              <ul>
                {["Computer Science", "Pre-Medical", "Pre-Engineering"].map((l) => (
                  <li key={l}><a href="#" onClick={(e) => e.preventDefault()}>{l}</a></li>
                ))}
              </ul>
            </div>
            <div className="col-lg-3">
              <div className="footer-heading">Contact</div>
              <ul>
                <li><a href="#">Thana, Malakand</a></li>
                <li><a href="#">Khyber Pakhtunkhwa</a></li>
                <li><a href="mailto:info@gdcthana.edu.pk">info@gdcthana.edu.pk</a></li>
              </ul>
            </div>
          </div>
          <hr className="footer-divider" />
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center footer-bottom">
            <span>© {new Date().getFullYear()} Government Degree College Thana. All rights reserved.</span>
            <span className="mt-2 mt-md-0">Affiliated with BISE Malakand</span>
          </div>
        </div>
      </footer>
    </>
  );
}
