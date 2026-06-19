import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { PILLARS, BHV, GRAHAS, RASHIS, FUNDAMENTOS, KARMA_TEMAS } from "../lib/constants";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activePill, setActivePill] = useState<number | null>(null);
  const [activeFund, setActiveFund] = useState<number | null>(null);
  const [activeKarma, setActiveKarma] = useState<number | null>(null);

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
          <div><p className="lbl">Arquitectura del Destino</p><h2 className="sh">Los Seis Pilares</h2></div>
        </div>
        <div className="pillar-grid rev">
          {PILLARS.map((p, i) => (
            <div key={i} className={`pill ${activePill === i ? 'active' : ''}`} onClick={() => setActivePill(activePill === i ? null : i)}>
              <p className="pill-q">{p.q}</p><h3 className="pill-skt">{p.skt}</h3><p className="pill-es">{p.es}</p>
              {activePill === i && <p className="pill-desc">{p.d}</p>}
            </div>
          ))}
        </div>
      </section>

      <section id="grahas" className="bg2 wrap">
        <div className="sec-head rev">
          <div className="sec-n">02</div>
          <div><p className="lbl">Navagraha</p><h2 className="sh">Mensajeros Celestes</h2></div>
        </div>
        <div className="grahas-grid rev">
          {GRAHAS.map(g => (
            <Link key={g.skt} to={`/grahas/${g.skt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`} className="graha-item">
              <span className="g-sym">{g.sym}</span><h4>{g.skt}</h4><p>{g.es} · {g.ka.split(',')[0]}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="rashis" className="wrap">
        <div className="sec-head rev">
          <div className="sec-n">03</div>
          <div><p className="lbl">Rāśis</p><h2 className="sh">Los 12 Signos</h2></div>
        </div>
        <table className="rashis-table rev">
          <thead><tr><th>Skt</th><th>Esp</th><th>Regente</th><th>Elemento</th></tr></thead>
          <tbody>{RASHIS.map(r => <tr key={r.n}><td>{r.skt}</td><td>{r.es}</td><td>{r.lord}</td><td>{r.elem}</td></tr>)}</tbody>
        </table>
      </section>

      <section id="bhavas" className="bg2 wrap">
        <div className="sec-head rev">
          <div className="sec-n">04</div>
          <div><p className="lbl">Bhāvas</p><h2 className="sh">Las 12 Casas</h2></div>
        </div>
        <div className="pillar-grid rev">
          {BHV.map(b => (
            <div key={b.n} className="pill">
               <h3 className="pill-skt">C{b.n} · {b.skt}</h3><p className="pill-es">{b.es}</p>
               <p style={{fontSize: '0.85rem', color: 'var(--cm)', marginTop: '0.5rem'}}>{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="fundamentos" className="wrap">
        <div className="sec-head rev">
          <div className="sec-n">05</div>
          <div><p className="lbl">Vedāṅga</p><h2 className="sh">Fundamentos</h2></div>
        </div>
        <div className="pillar-grid rev">
          {FUNDAMENTOS.map((f, i) => (
            <div key={i} className={`pill ${activeFund === i ? 'active' : ''}`} onClick={() => setActiveFund(activeFund === i ? null : i)}>
              <h3 className="pill-skt">{f.skt}</h3><p className="pill-es">{f.es}</p>
              {activeFund === i && f.body.map((b, j) => <div key={j} style={{marginTop:'1rem'}}>{b.h && <strong>{b.h}</strong>}<p style={{fontSize:'0.9rem'}}>{b.p}</p></div>)}
            </div>
          ))}
        </div>
      </section>

      <section id="karma" className="bg2 wrap">
        <div className="sec-head rev">
          <div className="sec-n">06</div>
          <div><p className="lbl">Siddhānta</p><h2 className="sh">Karma y Mitos</h2></div>
        </div>
        <div className="pillar-grid rev">
          {KARMA_TEMAS.map((k, i) => (
            <div key={i} className={`pill ${activeKarma === i ? 'active' : ''}`} onClick={() => setActiveKarma(activeKarma === i ? null : i)}>
              <h3 className="pill-skt">{k.skt}</h3><p className="pill-es">{k.es}</p>
              {activeKarma === i && k.body.map((b, j) => <div key={j} style={{marginTop:'1rem'}}>{b.h && <strong>{b.h}</strong>}<p style={{fontSize:'0.9rem'}}>{b.p}</p></div>)}
            </div>
          ))}
        </div>
      </section>

      <footer><p>© 2026 LOS OJOS DEL VEDA</p></footer>
    </div>
  );
}
