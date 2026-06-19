import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function LosOjosDelVeda() {
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
          <Link to="/grahas/surya">Sūrya</Link>
          <Link to="/grahas/chandra">Candra</Link>
          <Link to="/grahas/mangala">Maṅgala</Link>
          <Link to="/grahas/guru">Guru</Link>
          <Link to="/calcular" className="nav-cta">Calcular Carta</Link>
        </div>
      </nav>

      <section id="hero">
        <div className="hero-content rev">
          <p className="hero-label">JYOTIṢA \u00b7 ASTROLOG\u00cdA V\u00c9DICA</p>
          <h1>Los Ojos <br/><em>del Veda</em></h1>
          <p className="hero-desc">
            La ciencia de la luz que revela el karma y el prop\u00f3sito del alma a trav\u00e9s de los nueve Grahas.
          </p>
          <div className="hero-actions">
            <Link to="/calcular" className="btn-primary">Empezar Lectura</Link>
            <a href="#filosofia" className="btn-secondary">Explorar Tradici\u00f3n</a>
          </div>
        </div>
        <div className="hero-bg-text">\u091c\u094d\u092f\u094b\u0924\u093f\u0937</div>
      </section>

      <section id="filosofia" className="wrap">
        <div className="sec-head rev">
          <div className="sec-n">01</div>
          <div>
            <p className="lbl">La Ciencia de la Luz</p>
            <h2 className="sh">Un Mapa del Alma</h2>
            <p className="sint">
              Jyoti\u1e63a no es simple predicci\u00f3n. Es el "Veda-Chak\u1e63u", el ojo de los Vedas, 
              que nos permite ver el entramado invisible de causas y efectos que llamamos destino.
            </p>
          </div>
        </div>

        <div className="features-grid rev">
          <div className="f-card">
            <h3>Karma y Tiempo</h3>
            <p>Comprende los ciclos temporales (Da\u015b\u0101s) que activan las semillas de tus acciones pasadas.</p>
          </div>
          <div className="f-card">
            <h3>Prop\u00f3sito (Dharma)</h3>
            <p>Identifica la misi\u00f3n de tu alma y los obst\u00e1culos que debes trascender en esta encarnaci\u00f3n.</p>
          </div>
          <div className="f-card">
            <h3>Remedios (Up\u0101yas)</h3>
            <p>Utiliza mantras, gemas y actos de servicio para armonizar las influencias planetarias.</p>
          </div>
        </div>
      </section>

      <section className="bg2 grahas-preview">
        <div className="wrap">
          <div className="sec-head rev">
            <div className="sec-n">02</div>
            <div>
              <p className="lbl">Los Mensajeros Celestes</p>
              <h2 className="sh">Los Nueve Grahas</h2>
            </div>
          </div>
          
          <div className="grahas-grid rev">
            <Link to="/grahas/surya" className="graha-item">
              <span className="g-sym">\u2609</span>
              <h4>S\u016brya</h4>
              <p>El Sol \u00b7 El Alma \u00b7 El Rey</p>
            </Link>
            <Link to="/grahas/chandra" className="graha-item">
              <span className="g-sym">\u263d</span>
              <h4>Candra</h4>
              <p>La Luna \u00b7 La Mente \u00b7 La Madre</p>
            </Link>
            <Link to="/grahas/mangala" className="graha-item">
              <span className="g-sym">\u2642</span>
              <h4>Ma\u1e45gala</h4>
              <p>Marte \u00b7 La Energ\u00eda \u00b7 El Guerrero</p>
            </Link>
            <Link to="/grahas/guru" className="graha-item">
              <span className="g-sym">\u2643</span>
              <h4>Guru</h4>
              <p>J\u00fapiter \u00b7 La Sabidur\u00eda \u00b7 El Maestro</p>
            </Link>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <p>\u00a9 2026 Los Ojos del Veda \u00b7 Astrolog\u00eda V\u00e9dica Par\u0101\u015bar\u012b</p>
        </div>
      </footer>
    </div>
  );
}
