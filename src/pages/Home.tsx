import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { PILLARS, BHV } from "../lib/constants";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activePill, setActivePill] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("vis");
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(".rev").forEach(el => observer.observe(el));
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="landing-page">
      <nav className={scrolled ? "scrolled" : ""}>
        <div className="nav-brand">LOS OJOS DEL VEDA</div>
        <div className="nav-links">
          <Link to="/">Inicio</Link>
          <a href="#pilares">Pilares</a>
          <a href="#grahas">Grahas</a>
          <Link to="/calcular" className="nav-cta">Calcular Carta</Link>
        </div>
      </nav>

      <section id="hero">
        <div className="hero-content rev">
          <p className="lbl" style={{ marginBottom: '1.5rem' }}>ASTROLOGÍA VÉDICA SIDERAL</p>
          <h1>Los Ojos <br/><em>del Veda</em></h1>
          <p className="hero-desc">
            Jyotiṣa es el "Veda-Chakṣu", el órgano con que la tradición mira el cielo para leer el tiempo y el karma.
          </p>
          <div className="hero-actions">
            <Link to="/calcular" className="btn-primary">Empezar Lectura</Link>
            <a href="#pilares" className="btn-secondary">Ver Fundamentos</a>
          </div>
        </div>
        <div className="hero-bg-text">ज्योतिष</div>
      </section>

      <section id="pilares" className="wrap">
        <div className="sec-head rev">
          <div className="sec-n">01</div>
          <div>
            <p className="lbl">Arquitectura del Destino</p>
            <h2 className="sh">Los Seis Pilares</h2>
            <p className="sint">La ciencia de la luz se sostiene sobre seis fundamentos técnicos que permiten decodificar la experiencia humana.</p>
          </div>
        </div>
        <div className="pillar-grid rev">
          {PILLARS.map((p, i) => (
            <div key={i} className={`pill ${activePill === i ? 'active' : ''}`} onClick={() => setActivePill(activePill === i ? null : i)}>
              <p className="pill-q">{p.q}</p>
              <h3 className="pill-skt">{p.skt}</h3>
              <p className="pill-es">{p.es}</p>
              <p className="pill-desc">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="grahas" className="bg2 wrap">
        <div className="sec-head rev">
          <div className="sec-n">02</div>
          <div>
            <p className="lbl">Navagraha</p>
            <h2 className="sh">Mensajeros Celestes</h2>
          </div>
        </div>
        <div className="grahas-grid rev">
           <Link to="/grahas/surya" className="graha-item"><span className="g-sym">☉</span><h4>Sūrya</h4><p>El Alma · El Rey</p></Link>
           <Link to="/grahas/chandra" className="graha-item"><span className="g-sym">☽</span><h4>Candra</h4><p>La Mente · La Madre</p></Link>
           <Link to="/grahas/mangala" className="graha-item"><span className="g-sym">♂</span><h4>Maṅgala</h4><p>La Acción · El Guerrero</p></Link>
           <Link to="/grahas/guru" className="graha-item"><span className="g-sym">♃</span><h4>Guru</h4><p>La Gracia · El Maestro</p></Link>
        </div>
      </section>

      <section id="bhavas" className="wrap">
        <div className="sec-head rev">
          <div className="sec-n">03</div>
          <div>
            <p className="lbl">Bhāvas</p>
            <h2 className="sh">Las Doce Casas</h2>
            <p className="sint">Las áreas de la experiencia donde el karma se manifiesta físicamente.</p>
          </div>
        </div>
        <div className="pillar-grid rev">
          {BHV.map((b, i) => (
            <div key={i} className="pill">
               <h3 className="pill-skt">Casa {b.n} · {b.skt}</h3>
               <p className="pill-es">{b.es}</p>
               <p style={{fontSize: '0.9rem', color: 'var(--cm)', marginTop: '0.5rem'}}>{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer><p>© 2026 LOS OJOS DEL VEDA</p></footer>
    </div>
  );
}
