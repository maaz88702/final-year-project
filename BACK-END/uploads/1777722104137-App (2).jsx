import { useState, useEffect } from "react";
import { globalCSS } from "./styles";
import { programs, faculty, galleryItems, notices, timeline, navLinks } from "./data";
import { Navbar, Footer, PageHero } from "./components";

// ─── Scroll fade hook ─────────────────────────────────────────────────────────
function useScrollFade() {
  useEffect(() => {
    const run = () => {
      document.querySelectorAll(".fade-up").forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 60)
          el.classList.add("visible");
      });
    };
    window.addEventListener("scroll", run);
    run();
    return () => window.removeEventListener("scroll", run);
  }, []);
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: HOME
// ═══════════════════════════════════════════════════════════════════════════════
function HomePage({ navigate }) {
  useScrollFade();
  return (
    <>
      {/* Hero */}
      <section id="home-hero">
        <div className="container">
          <div className="row align-items-center gy-5">
            <div className="col-lg-6">
              <span className="hero-overline page-enter">Est. — Government Degree College</span>
              <h1 className="hero-title page-enter page-enter-delay-1">
                Shaping Minds,<br /><em>Building Futures</em>
              </h1>
              <p className="hero-sub page-enter page-enter-delay-2">
                GDC Thana, nestled in the heart of Malakand Division, offers premier intermediate
                education across Science and Computer programs — where academic rigour meets lifelong character.
              </p>
              <div className="d-flex gap-3 flex-wrap page-enter page-enter-delay-3">
                <button className="btn-navy" onClick={() => { navigate('/academics'); window.scrollTo(0,0); }}>
                  Explore Programs
                </button>
                <button className="btn-outline-navy" onClick={() => { navigate('/about'); window.scrollTo(0,0); }}>
                  Our Story
                </button>
              </div>
              <div className="hero-stats page-enter page-enter-delay-4">
                {[{num:'20+',label:'Years of Excellence'},{num:'3',label:'Programs Offered'},{num:'98%',label:'Pass Rate'}].map(s => (
                  <div key={s.label}>
                    <div className="hero-stat-num">{s.num}</div>
                    <div className="hero-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <div style={{position:'relative',paddingLeft:'1rem'}}>
                <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700&q=80"
                  alt="Campus" className="img-fluid"
                  style={{borderRadius:4,boxShadow:'0 20px 60px rgba(0,33,71,0.15)'}} />
                <div className="hero-badge">
                  <strong>BISE</strong>Malakand Board
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Programs */}
      <section style={{background:'#fff',padding:'90px 0'}}>
        <div className="container">
          <div className="row justify-content-center text-center mb-5 fade-up">
            <div className="col-lg-6">
              <span className="section-label">Academics</span>
              <h2 className="section-heading mb-3">Programs We Offer</h2>
              <p className="section-desc">Three focused programs preparing students for Pakistan's most competitive universities.</p>
            </div>
          </div>
          <div className="row g-4">
            {programs.map((p, i) => (
              <div key={i} className="col-md-4 fade-up" style={{transitionDelay:`${i*0.12}s`}}>
                <div className="gdc-card" style={{padding:'2.2rem 1.8rem'}}>
                  <div className="program-icon">{p.icon}</div>
                  <div className="program-title">{p.title}</div>
                  <p style={{fontSize:'0.9rem',color:'#6c757d',fontWeight:300,lineHeight:1.65,marginBottom:'1.3rem'}}>{p.desc}</p>
                  {p.tags.map(t=><span key={t} className="program-tag">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4 fade-up">
            <button className="btn-outline-navy" onClick={()=>{navigate('/academics');window.scrollTo(0,0);}}>
              View Full Details
            </button>
          </div>
        </div>
      </section>

      {/* Latest Notices teaser */}
      <section style={{background:'var(--gray-bg)',padding:'90px 0'}}>
        <div className="container">
          <div className="row align-items-start gy-4">
            <div className="col-lg-4 fade-up">
              <span className="section-label">Notices</span>
              <h2 className="section-heading mb-3">Latest<br />Announcements</h2>
              <div className="divider-line mb-4" />
              <p className="section-desc mb-4">Stay updated with admissions, events, and important college news.</p>
              <button className="btn-navy" onClick={()=>{navigate('/notices');window.scrollTo(0,0);}}>View All Notices</button>
            </div>
            <div className="col-lg-7 offset-lg-1 fade-up" style={{transitionDelay:'0.15s'}}>
              {notices.slice(0,4).map((n,i)=>(
                <div key={i} className={`notice-item${n.urgent?' urgent':''}`}>
                  <div className="notice-date">{n.date}</div>
                  <div className="notice-title">
                    {n.title}
                    {n.type==='new'&&<span className="notice-badge badge-new">New</span>}
                    {n.urgent&&<span className="notice-badge badge-urgent">Important</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery strip */}
      <section style={{background:'#fff',padding:'90px 0'}}>
        <div className="container">
          <div className="row justify-content-center text-center mb-5 fade-up">
            <div className="col-lg-6">
              <span className="section-label">Gallery</span>
              <h2 className="section-heading mb-3">Life at GDC Thana</h2>
            </div>
          </div>
          <div className="gallery-grid fade-up">
            {galleryItems.slice(0,6).map((item,i)=>(
              <div key={i} className="gallery-item">
                <img src={item.src} alt={item.label} />
                <div className="gallery-overlay">{item.label}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4 fade-up">
            <button className="btn-outline-navy" onClick={()=>{navigate('/gallery');window.scrollTo(0,0);}}>
              View Full Gallery
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: ABOUT
// ═══════════════════════════════════════════════════════════════════════════════
function AboutPage({ navigate }) {
  useScrollFade();
  const features = [
    "Established institution with decades of academic excellence in Malakand Division.",
    "Qualified and experienced faculty dedicated to student success.",
    "State-of-the-art science and computer laboratories.",
    "Active student societies promoting leadership and extracurricular growth.",
    "Consistent top results in BISE Malakand board examinations.",
  ];
  return (
    <>
      <PageHero overline="Who We Are" title="About GDC Thana" subtitle="A legacy of learning in the heart of Malakand Division." page="About" navigate={navigate} />

      {/* Mission */}
      <section style={{padding:'90px 0',background:'#fff'}}>
        <div className="container">
          <div className="row align-items-center gy-5">
            <div className="col-lg-5 fade-up">
              <img src="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=700&q=80" alt="About" className="about-img" />
            </div>
            <div className="col-lg-6 offset-lg-1 fade-up" style={{transitionDelay:'0.15s'}}>
              <span className="section-label">Our Mission</span>
              <h2 className="section-heading mb-3">Nurturing Excellence<br />Since Establishment</h2>
              <div className="divider-line mb-4" />
              <p style={{fontSize:'0.97rem',color:'#444',fontWeight:300,lineHeight:1.8,marginBottom:'1rem'}}>
                Government Degree College Thana stands as one of the premier educational institutions
                of Malakand Division, committed to nurturing the intellectual and personal development
                of young scholars from across Khyber Pakhtunkhwa.
              </p>
              <p style={{fontSize:'0.97rem',color:'#444',fontWeight:300,lineHeight:1.8,marginBottom:'1.5rem'}}>
                Our institution blends time-honoured academic values with modern pedagogical approaches,
                equipping students with the knowledge and discipline required to excel in higher education and beyond.
              </p>
              {features.map((f,i)=>(
                <div key={i} className="about-feature">
                  <div className="about-feature-dot" />
                  <div style={{fontSize:'0.9rem',color:'#555',fontWeight:400,lineHeight:1.6}}>{f}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{background:'var(--gray-bg)',padding:'90px 0'}}>
        <div className="container">
          <div className="row justify-content-center text-center mb-5 fade-up">
            <div className="col-lg-6">
              <span className="section-label">Our Values</span>
              <h2 className="section-heading">What We Stand For</h2>
            </div>
          </div>
          <div className="row g-4">
            {[
              {icon:'📚',title:'Academic Rigour',text:'We uphold the highest standards of academic discipline, pushing students to achieve their intellectual peak.'},
              {icon:'🤝',title:'Community & Inclusion',text:'GDC Thana welcomes students from all backgrounds across Malakand, fostering a diverse and inclusive campus.'},
              {icon:'🌱',title:'Character Building',text:'Beyond textbooks, we invest in the moral and ethical development of every student who walks through our doors.'},
              {icon:'🏆',title:'Excellence in Results',text:'Year after year, our students rank at the top of BISE Malakand examinations and secure admissions to prestigious institutions.'},
            ].map((v,i)=>(
              <div key={i} className="col-md-6 col-lg-3 fade-up" style={{transitionDelay:`${i*0.1}s`}}>
                <div className="gdc-card" style={{padding:'1.8rem 1.5rem',textAlign:'center'}}>
                  <div style={{fontSize:'2rem',marginBottom:'1rem'}}>{v.icon}</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontWeight:600,color:'var(--navy)',marginBottom:'0.6rem'}}>{v.title}</div>
                  <p style={{fontSize:'0.88rem',color:'#6c757d',fontWeight:300,lineHeight:1.65,marginBottom:0}}>{v.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section style={{padding:'90px 0',background:'#fff'}}>
        <div className="container">
          <div className="row gy-5">
            <div className="col-lg-4 fade-up">
              <span className="section-label">History</span>
              <h2 className="section-heading mb-3">Our Journey Through<br />the Years</h2>
              <div className="divider-line mb-4" />
              <p className="section-desc">From a modest founding to becoming a cornerstone institution of Malakand Division.</p>
            </div>
            <div className="col-lg-7 offset-lg-1 fade-up" style={{transitionDelay:'0.15s'}}>
              <div className="timeline">
                {timeline.map((t,i)=>(
                  <div key={i} className="timeline-item">
                    <div className="timeline-dot" />
                    <div className="timeline-year">{t.year}</div>
                    <div className="timeline-title">{t.title}</div>
                    <div className="timeline-text">{t.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: ACADEMICS
// ═══════════════════════════════════════════════════════════════════════════════
function AcademicsPage({ navigate }) {
  useScrollFade();
  return (
    <>
      <PageHero overline="Programs" title="Academic Programs" subtitle="Three rigorous intermediate programs preparing students for Pakistan's top universities." page="Academics" navigate={navigate} />

      <section style={{padding:'90px 0',background:'#fff'}}>
        <div className="container">
          {programs.map((p,i)=>(
            <div key={i} className={`row align-items-center gy-5 mb-5 ${i%2===1?'flex-lg-row-reverse':''} fade-up`} style={{transitionDelay:`${i*0.1}s`}}>
              <div className="col-lg-5">
                <div style={{
                  background: i===0?'#eaf0f7':i===1?'#f0f7f0':'#fdf6e3',
                  borderRadius:4, padding:'3rem 2rem', textAlign:'center'
                }}>
                  <div style={{fontSize:'4rem',marginBottom:'1rem'}}>{p.icon}</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.5rem',fontWeight:700,color:'var(--navy)'}}>
                    {p.title}
                  </div>
                </div>
              </div>
              <div className="col-lg-6" style={i%2===1?{paddingRight:'3rem'}:{paddingLeft:'3rem'}}>
                <span className="section-label">F.Sc / ICS Program</span>
                <h2 className="section-heading mb-3">{p.title}</h2>
                <div className="divider-line mb-4" />
                <p style={{fontSize:'0.97rem',color:'#444',fontWeight:300,lineHeight:1.8,marginBottom:'1rem'}}>{p.desc}</p>
                <p style={{fontSize:'0.97rem',color:'#444',fontWeight:300,lineHeight:1.8,marginBottom:'1.5rem'}}>{p.detail}</p>
                <div className="mb-3">{p.tags.map(t=><span key={t} className="program-tag">{t}</span>)}</div>
                <button className="btn-navy" onClick={()=>{navigate('/contact');window.scrollTo(0,0);}}>Apply Now</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Admission requirements */}
      <section style={{background:'var(--gray-bg)',padding:'90px 0'}}>
        <div className="container">
          <div className="row justify-content-center text-center mb-5 fade-up">
            <div className="col-lg-6">
              <span className="section-label">Admissions</span>
              <h2 className="section-heading">Admission Requirements</h2>
            </div>
          </div>
          <div className="row g-4">
            {[
              {step:'01',title:'Eligibility',text:'Matric (SSC) pass with minimum 50% marks from a recognized board.'},
              {step:'02',title:'Documents',text:'Matric certificate, school leaving certificate, domicile, and CNIC/B-Form copy.'},
              {step:'03',title:'Apply',text:'Submit application form at the college office or contact us via the online form.'},
              {step:'04',title:'Enrollment',text:'Merit list announced. Qualifying candidates complete enrollment by paying dues.'},
            ].map((s,i)=>(
              <div key={i} className="col-md-6 col-lg-3 fade-up" style={{transitionDelay:`${i*0.1}s`}}>
                <div className="gdc-card" style={{padding:'2rem 1.5rem'}}>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:'2rem',fontWeight:700,color:'var(--gray-border)',marginBottom:'1rem'}}>{s.step}</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontWeight:600,color:'var(--navy)',marginBottom:'0.6rem',fontSize:'1.05rem'}}>{s.title}</div>
                  <p style={{fontSize:'0.88rem',color:'#6c757d',fontWeight:300,lineHeight:1.65,marginBottom:0}}>{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: FACULTY
// ═══════════════════════════════════════════════════════════════════════════════
function FacultyPage({ navigate }) {
  useScrollFade();
  return (
    <>
      <PageHero overline="Our Team" title="Faculty & Staff" subtitle="Dedicated educators committed to shaping the next generation of leaders." page="Faculty" navigate={navigate} />

      <section style={{padding:'90px 0',background:'#fff'}}>
        <div className="container">
          <div className="row justify-content-center text-center mb-5 fade-up">
            <div className="col-lg-6">
              <span className="section-label">Meet the Team</span>
              <h2 className="section-heading mb-3">Experienced &amp; Qualified</h2>
              <p className="section-desc">Our faculty brings together decades of teaching experience and subject expertise.</p>
            </div>
          </div>
          <div className="row g-4">
            {faculty.map((f,i)=>(
              <div key={i} className="col-md-6 col-lg-4 fade-up" style={{transitionDelay:`${i*0.1}s`}}>
                <div className="gdc-card faculty-card">
                  <img src={f.img} alt={f.name} className="faculty-avatar" />
                  <div className="faculty-name">{f.name}</div>
                  <div className="faculty-role">{f.role}</div>
                  <div className="faculty-dept">{f.dept}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{background:'var(--gray-bg)',padding:'90px 0'}}>
        <div className="container">
          <div className="row justify-content-center text-center fade-up">
            <div className="col-lg-6">
              <span className="section-label">Join Us</span>
              <h2 className="section-heading mb-3">Careers at GDC Thana</h2>
              <p className="section-desc mb-4">We periodically open positions for qualified educators. If you are passionate about teaching, we'd love to hear from you.</p>
              <button className="btn-navy" onClick={()=>{navigate('/contact');window.scrollTo(0,0);}}>Get in Touch</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: NOTICES
// ═══════════════════════════════════════════════════════════════════════════════
function NoticesPage({ navigate }) {
  useScrollFade();
  return (
    <>
      <PageHero overline="Updates" title="Notice Board" subtitle="Admissions, events, exam results, and all important college announcements." page="Notices" navigate={navigate} />

      <section style={{padding:'90px 0',background:'#fff'}}>
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-8 fade-up">
              <span className="section-label">All Notices</span>
              <h2 className="section-heading mb-4">Latest Announcements</h2>
              {notices.map((n,i)=>(
                <div key={i} className={`notice-item${n.urgent?' urgent':''}`}>
                  <div className="notice-date">{n.date}</div>
                  <div className="notice-title">
                    {n.title}
                    {n.type==='new'&&<span className="notice-badge badge-new">New</span>}
                    {n.urgent&&<span className="notice-badge badge-urgent">Important</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="col-lg-3 offset-lg-1 fade-up" style={{transitionDelay:'0.15s'}}>
              <div style={{background:'var(--gray-bg)',borderRadius:4,padding:'1.8rem',position:'sticky',top:'100px'}}>
                <span className="section-label">Quick Links</span>
                <ul style={{listStyle:'none',padding:0,marginTop:'1rem'}}>
                  {[
                    {label:'Admissions 2026–28',page:'/academics'},
                    {label:'Programs Offered',page:'/academics'},
                    {label:'Faculty Directory',page:'/faculty'},
                    {label:'Contact Office',page:'/contact'},
                    {label:'Our Location',page:'/location'},
                  ].map((l,i)=>(
                    <li key={i} style={{marginBottom:'0.7rem'}}>
                      <a href={l.page} style={{fontSize:'0.88rem',color:'var(--navy)',textDecoration:'none',fontWeight:500,display:'flex',alignItems:'center',gap:'0.4rem'}}
                        onClick={e=>{e.preventDefault();navigate(l.page);window.scrollTo(0,0);}}>
                        <span style={{color:'var(--gold)'}}>›</span> {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <div style={{marginTop:'1.5rem',paddingTop:'1.5rem',borderTop:'1px solid var(--gray-border)'}}>
                  <div style={{fontSize:'0.78rem',color:'var(--text-muted)',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'0.6rem'}}>Admissions Open</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.5rem',fontWeight:700,color:'var(--navy)'}}>2026–28</div>
                  <button className="btn-navy mt-3" style={{width:'100%'}} onClick={()=>{navigate('/contact');window.scrollTo(0,0);}}>Apply Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: GALLERY
// ═══════════════════════════════════════════════════════════════════════════════
function GalleryPage({ navigate }) {
  useScrollFade();
  return (
    <>
      <PageHero overline="Photos" title="Gallery" subtitle="A visual journey through campus life, facilities, and student achievements." page="Gallery" navigate={navigate} />

      <section style={{padding:'90px 0',background:'#fff'}}>
        <div className="container">
          <div className="row justify-content-center text-center mb-5 fade-up">
            <div className="col-lg-6">
              <span className="section-label">Campus Life</span>
              <h2 className="section-heading mb-3">Life at GDC Thana</h2>
              <p className="section-desc">From laboratories to sports grounds, our campus is alive with learning and growth.</p>
            </div>
          </div>
          <div className="gallery-grid fade-up">
            {galleryItems.map((item,i)=>(
              <div key={i} className="gallery-item">
                <img src={item.src} alt={item.label} />
                <div className="gallery-overlay">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: LOCATION
// ═══════════════════════════════════════════════════════════════════════════════
function LocationPage({ navigate }) {
  useScrollFade();
  return (
    <>
      <PageHero overline="Find Us" title="Our Location" subtitle="Situated in the scenic Thana area of Malakand Division, Khyber Pakhtunkhwa." page="Location" navigate={navigate} />

      <section style={{padding:'90px 0',background:'#fff'}}>
        <div className="container">
          <div className="row align-items-start gy-5">
            <div className="col-lg-7 fade-up">
              <div className="map-placeholder">
                <div className="map-pin" />
                <div className="map-label">GDC Thana</div>
                <div className="map-sub">Thana, Malakand Division, KPK</div>
                <a href="https://maps.google.com/?q=Thana+Malakand+KPK" target="_blank" rel="noopener noreferrer"
                  style={{marginTop:'1.2rem',fontSize:'0.78rem',color:'var(--navy)',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',textDecoration:'none',position:'relative',zIndex:1}}>
                  Open in Google Maps →
                </a>
              </div>
            </div>
            <div className="col-lg-4 offset-lg-1 fade-up" style={{transitionDelay:'0.15s'}}>
              <span className="section-label">Address</span>
              <h2 className="section-heading mb-3">How to Reach Us</h2>
              <div className="divider-line mb-4" />
              {[
                {icon:'📍',label:'Address',text:'Government Degree College Thana, Thana, Malakand Division, Khyber Pakhtunkhwa, Pakistan'},
                {icon:'📞',label:'Phone',text:'+92-XXX-XXXXXXX'},
                {icon:'✉️',label:'Email',text:'info@gdcthana.edu.pk'},
                {icon:'🕗',label:'Office Hours',text:'Monday – Friday: 8:00 AM – 2:00 PM\nSaturday: 8:00 AM – 12:00 PM'},
              ].map((item,i)=>(
                <div key={i} style={{display:'flex',gap:'1rem',marginBottom:'1.5rem',alignItems:'flex-start'}}>
                  <div style={{width:40,height:40,background:'#eaf0f7',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'1rem'}}>{item.icon}</div>
                  <div>
                    <div style={{fontSize:'0.72rem',fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--text-muted)',marginBottom:'0.2rem'}}>{item.label}</div>
                    <div style={{fontSize:'0.9rem',color:'var(--text-main)',fontWeight:400,lineHeight:1.6,whiteSpace:'pre-line'}}>{item.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How to get here */}
          <div className="row mt-5 g-4">
            {[
              {icon:'🚌',title:'By Bus',text:'Regular buses from Batkhela, Dargai, and Malakand to Thana. Alight at GDC Thana stop.'},
              {icon:'🚗',title:'By Road',text:'From Batkhela take the Thana road (~20 min). GPS: search "GDC Thana Malakand".'},
              {icon:'🏍️',title:'Local Transport',text:'Rickshaws and motorbike taxis are available within Thana for the final stretch.'},
            ].map((item,i)=>(
              <div key={i} className="col-md-4 fade-up" style={{transitionDelay:`${i*0.1}s`}}>
                <div className="gdc-card" style={{padding:'1.8rem 1.5rem'}}>
                  <div style={{fontSize:'1.8rem',marginBottom:'0.8rem'}}>{item.icon}</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontWeight:600,color:'var(--navy)',marginBottom:'0.5rem'}}>{item.title}</div>
                  <p style={{fontSize:'0.88rem',color:'#6c757d',fontWeight:300,lineHeight:1.65,marginBottom:0}}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: CONTACT
// ═══════════════════════════════════════════════════════════════════════════════
function ContactPage({ navigate }) {
  useScrollFade();
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' });
  const [submitted, setSubmitted] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
  };

  return (
    <>
      <PageHero overline="Get in Touch" title="Contact Us" subtitle="Have a question or want to apply? We're here to help." page="Contact" navigate={navigate} />

      <section style={{padding:'90px 0',background:'#fff'}}>
        <div className="container">
          <div className="row gy-5">
            <div className="col-lg-5 fade-up">
              <span className="section-label">Contact Information</span>
              <h2 className="section-heading mb-3">We'd Love to<br />Hear From You</h2>
              <div className="divider-line mb-4" />
              {[
                {icon:'📍',label:'Location',text:'Thana, Malakand Division, KPK'},
                {icon:'📞',label:'Phone',text:'+92-XXX-XXXXXXX'},
                {icon:'✉️',label:'Email',text:'info@gdcthana.edu.pk'},
                {icon:'🕗',label:'Hours',text:'Mon–Fri 8 AM – 2 PM'},
              ].map((item,i)=>(
                <div key={i} style={{display:'flex',gap:'1rem',marginBottom:'1.3rem',alignItems:'flex-start'}}>
                  <div style={{width:38,height:38,background:'#eaf0f7',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'0.95rem'}}>{item.icon}</div>
                  <div>
                    <div style={{fontSize:'0.7rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'var(--text-muted)',marginBottom:'0.15rem'}}>{item.label}</div>
                    <div style={{fontSize:'0.9rem',color:'var(--text-main)',fontWeight:400}}>{item.text}</div>
                  </div>
                </div>
              ))}
              <div style={{marginTop:'2rem',padding:'1.5rem',background:'var(--gray-bg)',borderRadius:4}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontWeight:600,color:'var(--navy)',marginBottom:'0.5rem'}}>Admissions Enquiries</div>
                <p style={{fontSize:'0.88rem',color:'#6c757d',fontWeight:300,lineHeight:1.6,marginBottom:'1rem'}}>
                  For admission-related queries, please visit the college office or send us a message with "Admissions" in the subject.
                </p>
                <button className="btn-outline-navy" style={{fontSize:'0.78rem'}} onClick={()=>{navigate('/academics');window.scrollTo(0,0);}}>
                  View Programs
                </button>
              </div>
            </div>

            <div className="col-lg-6 offset-lg-1 fade-up" style={{transitionDelay:'0.15s'}}>
              {submitted ? (
                <div className="form-submitted">
                  <div style={{fontSize:'2.5rem',marginBottom:'1rem'}}>✅</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.3rem',fontWeight:600,color:'var(--navy)',marginBottom:'0.5rem'}}>Message Sent!</div>
                  <p style={{fontSize:'0.92rem',color:'#555',fontWeight:300}}>Thank you for reaching out. We'll get back to you within 1–2 business days.</p>
                  <button className="btn-navy mt-3" onClick={()=>setSubmitted(false)}>Send Another</button>
                </div>
              ) : (
                <div style={{background:'var(--gray-bg)',padding:'2.5rem',borderRadius:4}}>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.3rem',fontWeight:600,color:'var(--navy)',marginBottom:'1.8rem'}}>Send Us a Message</div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="gdc-label">Full Name</label>
                      <input className="gdc-input" placeholder="Your name" value={form.name} onChange={e=>set('name',e.target.value)} />
                    </div>
                    <div className="col-md-6">
                      <label className="gdc-label">Email Address</label>
                      <input className="gdc-input" type="email" placeholder="your@email.com" value={form.email} onChange={e=>set('email',e.target.value)} />
                    </div>
                    <div className="col-12">
                      <label className="gdc-label">Subject</label>
                      <select className="gdc-input" value={form.subject} onChange={e=>set('subject',e.target.value)}>
                        <option value="">Select a subject</option>
                        <option>Admission Enquiry</option>
                        <option>Academic Information</option>
                        <option>Fee Structure</option>
                        <option>Faculty / Staff</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="gdc-label">Message</label>
                      <textarea className="gdc-input" rows={5} placeholder="Write your message here..." value={form.message} onChange={e=>set('message',e.target.value)} style={{resize:'vertical'}} />
                    </div>
                    <div className="col-12">
                      <button className="btn-navy" style={{width:'100%'}} onClick={handleSubmit}>
                        Send Message
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP — Simple client-side router
// ═══════════════════════════════════════════════════════════════════════════════
const PAGES = {
  '/': HomePage,
  '/about': AboutPage,
  '/academics': AcademicsPage,
  '/faculty': FacultyPage,
  '/notices': NoticesPage,
  '/gallery': GalleryPage,
  '/location': LocationPage,
  '/contact': ContactPage,
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('/');

  // Inject global CSS + Bootstrap
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'gdc-styles';
    style.textContent = globalCSS;
    document.head.appendChild(style);

    if (!document.getElementById('bs-cdn')) {
      const link = document.createElement('link');
      link.id = 'bs-cdn';
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css';
      document.head.appendChild(link);
    }
    return () => { document.getElementById('gdc-styles')?.remove(); };
  }, []);

  const navigate = (path) => {
    setCurrentPage(path);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const PageComponent = PAGES[currentPage] || HomePage;

  return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column'}}>
      <Navbar currentPage={currentPage} navigate={navigate} />
      <main style={{flex:1}}>
        <PageComponent navigate={navigate} key={currentPage} />
      </main>
      <Footer navigate={navigate} />
    </div>
  );
}
