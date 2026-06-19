import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

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
          <a href="#filosofia">Veda</a>
          <a href="#grahas">Grahas</a>
          <Link to="/calcular" className="nav-cta">Calcular Carta</Link>
        </div>
      </nav>

      <section id="hero">
        <div className="hero-content rev">
          <p className="lbl" style={{ marginBottom: '1.5rem' }}>ASTROLOGÍA VÉDICA SIDERAL</p>
          <h1>Los Ojos <br/><em>del Veda</em></h1>
          <p className="hero-desc">
            Jyotiṣa, la ciencia de la luz, es el ojo de los Vedas: el órgano con que la tradición mira el cielo para leer el tiempo y el karma.
          </p>
          <div className="hero-actions">
            <Link to="/calcular" className="btn-primary">Empezar Lectura</Link>
            <a href="#filosofia" className="btn-secondary">Ver Tradición</a>
          </div>
        </div>
        <div className="hero-bg-text">ज्योतिष</div>
      </section>

      <section id="filosofia" className="wrap">
        <div className="sec-head rev">
          <div className="sec-n">01</div>
          <div>
            <p className="lbl">La Ciencia de la Luz</p>
            <h2 className="sh">Nirāyaṇa: El Zodíaco Sideral</h2>
            <p className="sint">
              Donde el calendario tropical sigue las estaciones, el cómputo sideral sigue las estrellas fijas. 
              Anclado en la posición real de los astros a través del Ayanāṃśa.
            </p>
          </div>
        </div>
      </section>

      <section id="grahas" className="bg2 wrap">
        <div className="sec-head rev">
          <div className="sec-n">02</div>
          <div>
            <p className="lbl">Navagraha</p>
            <h2 className="sh">Los Agarradores Celestes</h2>
          </div>
        </div>
        
        <div className="grahas-grid rev">
          {[
            { s: '☉', n: 'Sūrya', d: 'Sol · El Atman' },
            { s: '☽', n: 'Candra', d: 'Luna · La Mente' },
            { s: '♂', n: 'Maṅgala', d: 'Marte · La Acción' },
            { s: '♃', n: 'Guru', d: 'Júpiter · La Gracia' },
            { s: '♀', n: 'Śukra', d: 'Venus · El Deseo' },
            { s: '♄', n: 'Śani', d: 'Saturno · El Karma' },
            { s: '☊', n: 'Rāhu', d: 'Nodo Norte · Obsesión' },
            { s: '☋', n: 'Ketu', d: 'Nodo Sur · Liberación' }
          ].map((g, i) => (
            <div key={i} className="graha-item">
              <span className="g-sym">{g.s}</span>
              <h4>{g.n}</h4>
              <p>{g.d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer>
        <p>© 2026 LOS OJOS DEL VEDA · Astrología Védica</p>
      </footer>
    </div>
  );
}
