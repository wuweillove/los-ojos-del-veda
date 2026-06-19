import { useState, useEffect } from "react";
import { BHV, RN, RASI_ABB } from "../lib/constants";

export default function Calculator() {
  const [tab, setTab] = useState('grahas');
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [birthData, setBirthData] = useState({
    date: '',
    time: '12:00',
    lat: 0,
    lng: 0,
    offset: 0,
    place: ''
  });

  const [cityQuery, setCityQuery] = useState('');
  const [cityResults, setCityResults] = useState<any[]>([]);

  useEffect(() => {
    if (cityQuery.length < 3) {
      setCityResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search-city?q=${encodeURIComponent(cityQuery)}`);
        const data = await res.json();
        setCityResults(data);
      } catch (e) {
        console.error(e);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [cityQuery]);

  const selectCity = async (city: any) => {
    try {
      const res = await fetch(`/api/timezone?lat=${city.lat}&lng=${city.lng}`);
      const tz = await res.json();
      setBirthData({
        ...birthData,
        lat: city.lat,
        lng: city.lng,
        offset: tz.offset,
        place: city.name
      });
      setCityQuery(city.name);
      setCityResults([]);
    } catch (e) {
      console.error(e);
    }
  };

  const calculate = async () => {
    if (!birthData.date) {
      setError("Por favor ingresa la fecha");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [y, m, d] = birthData.date.split('-').map(Number);
      const [h, min] = birthData.time.split(':').map(Number);
      const hourDec = h + min / 60;
      
      const params = new URLSearchParams({
        year: String(y),
        month: String(m),
        day: String(d),
        hour: String(hourDec),
        offset: String(birthData.offset),
        lat: String(birthData.lat),
        lng: String(birthData.lng)
      });

      const res = await fetch(`/api/calculate?${params}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setChartData(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrap">
      <h2 className="sh">Calculadora Natal</h2>
      <div className="calc-box">
        <div className="calc-form" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
          <div className="cf"><label>Fecha</label><input type="date" value={birthData.date} onChange={e => setBirthData({...birthData, date: e.target.value})} /></div>
          <div className="cf"><label>Hora</label><input type="time" value={birthData.time} onChange={e => setBirthData({...birthData, time: e.target.value})} /></div>
          <div className="cf" style={{ position: 'relative' }}>
            <label>Ciudad</label>
            <input type="text" value={cityQuery} onChange={e => setCityQuery(e.target.value)} placeholder="Buscar ciudad..." />
            {cityResults.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#111', zIndex: 10, border: '1px solid #333' }}>
                {cityResults.map(c => (
                  <div key={`${c.lat}-${c.lng}`} onClick={() => selectCity(c)} style={{ padding: '0.5rem', cursor: 'pointer', borderBottom: '1px solid #222' }}>{c.name}</div>
                ))}
              </div>
            )}
          </div>
        </div>
        <button onClick={calculate} disabled={loading} className="btn-primary" style={{ marginTop: '2rem', width: '100%' }}>
          {loading ? "Calculando..." : "Calcular Carta"}
        </button>
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      </div>

      {chartData && (
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
            
            {tab === 'grahas' && (
              <table className="result-table" style={{width: '100%', textAlign: 'left'}}>
                <thead><tr><th>Graha</th><th>Rāśi</th><th>Grado</th></tr></thead>
                <tbody>
                  <tr><td>Lagna</td><td>{RN[chartData.chart.lagnaRasi]}</td><td>{(chartData.chart.lagna % 30).toFixed(2)}°</td></tr>
                  {chartData.chart.planets.map((p: any) => (
                    <tr key={p.name}><td>{p.name}</td><td>{RN[p.rasi]}</td><td>{(p.lon % 30).toFixed(2)}°</td></tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
