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
          <a href="#calcular" className="nav-cta">Calcular Carta</a>
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
            <a href="#calcular" className="btn-primary">Empezar Lectura</a>
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
              Anclado en la posición real de los astros a través del Ayanāṃśa de Lahiri.
            </p>
          </div>
        </div>
        
        <div className="features-grid rev" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '4rem' }}>
          {[
            { h: 'Karma Siddhānta', p: 'La ley de causa y efecto. El horóscopo es el mapa del Prārabdha karma: la porción del pasado activada para esta vida.' },
            { h: 'Tri Skandha', p: 'Las tres ramas: Siddhānta (astronomía), Saṃhitā (mundana) y Horā (interpretación de la carta natal).' },
            { h: 'Vedāṅga', p: 'Jyotiṣa es uno de los seis miembros del Veda, proporcionando la visión necesaria para el ritual y el dharma.' }
          ].map((f, i) => (
            <div key={i} className="f-card" style={{ padding: '2.5rem', background: 'var(--bg2)', border: '1px solid var(--bd)' }}>
              <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--g)' }}>{f.h}</h3>
              <p style={{ color: 'var(--cm)', fontSize: '1.05rem', lineHeight: '1.7' }}>{f.p}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="grahas" className="bg2 wrap">
        <div className="sec-head rev">
          <div className="sec-n">02</div>
          <div>
            <p className="lbl">Navagraha</p>
            <h2 className="sh">Los Agarradores Celestes</h2>
            <p className="sint">Los nueve planetas que "agarran" la conciencia y ejecutan el destino a través de las casas y signos.</p>
          </div>
        </div>
        
        <div className="grahas-grid rev">
          {[
            { s: '☉', n: 'Sūrya', d: 'Sol · El Atman' },
            { s: '☽', n: 'Candra', d: 'Luna · La Mente' },
            { s: '♂', n: 'Maṅgala', d: 'Marte · La Acción' },
            { s: '☿', n: 'Budha', d: 'Mercurio · El Intelecto' },
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

      <section id="calcular" className="wrap">
        <div className="sec-head rev">
          <div className="sec-n">03</div>
          <div>
            <p className="lbl">Cálculo Natal</p>
            <h2 className="sh">Lagna Kuṇḍalī</h2>
            <p className="sint">Genera tu carta astral védica. El motor de cálculo utiliza el Ayanāṃśa de Lahiri y el sistema de casas Signo-Casa (Whole Sign).</p>
          </div>
        </div>
        
        <div className="calc-box rev">
          <div className="calc-title">Datos de Nacimiento</div>
          <div className="calc-form" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div className="cf"><label>Fecha</label><input type="date" /></div>
            <div className="cf"><label>Hora</label><input type="time" /></div>
            <div className="cf"><label>Ciudad</label><input type="text" placeholder="Ciudad de nacimiento..." /></div>
          </div>
          <button className="btn-primary" style={{ marginTop: '2rem', width: '100%', border: 'none', cursor: 'pointer' }}>Calcular Carta ▸</button>
          <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--gd)', borderLeft: '2px solid var(--bd)', paddingLeft: '1rem' }}>
            Nota: El cálculo se realiza en el zodíaco sideral. Las posiciones diferirán de la astrología occidental (tropical).
          </p>
        </div>
      </section>

      <footer>
        <p>© 2026 LOS OJOS DEL VEDA · Astrología Védica</p>
      </footer>
    </div>
  );
}
