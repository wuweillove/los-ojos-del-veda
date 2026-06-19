import { useState } from "react";
import { BHV, RN, RASI_ABB } from "../lib/constants";

export default function Calculator() {
  const [tab, setTab] = useState('grahas');

  return (
    <div className="wrap">
      <h2 className="sh">Calculadora Natal</h2>
      <div className="calc-box">
        <div className="calc-form" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
          <div className="cf"><label>Fecha</label><input type="date" /></div>
          <div className="cf"><label>Hora</label><input type="time" /></div>
          <div className="cf"><label>Ciudad</label><input type="text" placeholder="Buscar ciudad..." /></div>
        </div>
        <button className="btn-primary" style={{ marginTop: '2rem', width: '100%' }}>Calcular Carta</button>
      </div>

      <div className="chart-layout" style={{marginTop: '3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem'}}>
        <div className="chart-svg-wrap">
          <svg viewBox="0 0 500 500" className="chart-bg" style={{border: '1px solid var(--bd)'}}>
            <line x1="0" y1="0" x2="500" y2="500" stroke="var(--bd)" />
            <line x1="500" y1="0" x2="0" y2="500" stroke="var(--bd)" />
            <text x="250" y="250" textAnchor="middle" fill="var(--g)" style={{fontSize: '24px'}}>Jyotiṣa</text>
          </svg>
        </div>
        <div>
          <div className="result-tabs" style={{display: 'flex', gap: '1rem', borderBottom: '1px solid var(--bd)', marginBottom: '1rem'}}>
            {['grahas', 'dasas', 'yogas'].map(t => (
              <button key={t} onClick={() => setTab(t)} className={`rtab ${tab === t ? 'active' : ''}`} style={{background: 'none', border: 'none', color: tab === t ? 'var(--g)' : 'var(--cm)', cursor: 'pointer', padding: '0.5rem'}}>{t.toUpperCase()}</button>
            ))}
          </div>
          <table className="result-table" style={{width: '100%', textAlign: 'left'}}>
            <thead><tr><th>Graha</th><th>Rāśi</th><th>Grado</th></tr></thead>
            <tbody>
              <tr><td>Lagna</td><td>{RN[0]}</td><td>15°00'</td></tr>
              <tr><td>Sūrya</td><td>{RN[4]}</td><td>10°20'</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
