import { useParams, Link } from "react-router-dom";

const GRAHA_DATA: Record<string, any> = {
  surya: { n: 'Sūrya', s: '☉', e: 'Sol', d: 'El Atman, el ego, el padre, la autoridad, la vitalidad.', c: 'El Rey', nat: 'Maléfico natural (Krura)', tr: '1 mes por signo', ex: 'Aries 10°', db: 'Libra 10°', up: 'Servicio al padre, donación de trigo el domingo.' },
  chandra: { n: 'Candra', s: '☽', e: 'Luna', d: 'La mente (Manas), las emociones, la madre, la paz interior.', c: 'La Reina', nat: 'Benéfico (si es creciente)', tr: '2.25 días por signo', ex: 'Tauro 3°', db: 'Escorpio 3°', up: 'Cuidado de la madre, meditación, donación de arroz el lunes.' },
  mangala: { n: 'Maṅgala', s: '♂', e: 'Marte', d: 'Energía vital (Tejas), coraje, hermanos menores, acción.', c: 'El Guerrero', nat: 'Maléfico natural', tr: '1.5 meses por signo', ex: 'Capricornio 28°', db: 'Cáncer 28°', up: 'Actividad física, disciplina, donación de lentejas rojas el martes.' },
  budha: { n: 'Budha', s: '☿', e: 'Mercurio', d: 'Intelecto (Buddhi), habla, comunicación, comercio.', c: 'El Príncipe', nat: 'Variable', tr: '1 mes por signo', ex: 'Virgo 15°', db: 'Piscis 15°', up: 'Estudio, comunicación clara, cuidado de plantas verdes el miércoles.' },
  guru: { n: 'Guru', s: '♃', e: 'Júpiter', d: 'Sabiduría (Jñāna), hijos, maestros, dharma, fortuna.', c: 'El Maestro', nat: 'Gran benéfico', tr: '12 meses por signo', ex: 'Cáncer 5°', db: 'Capricornio 5°', up: 'Respeto a maestros, estudio de escrituras, donación de garbanzos el jueves.' },
  sukra: { n: 'Śukra', s: '♀', e: 'Venus', d: 'Deseo (Kāma), belleza, cónyuge, arte, vehículos.', c: 'El Ministro', nat: 'Benéfico natural', tr: '1 mes por signo', ex: 'Piscis 27°', db: 'Virgo 27°', up: 'Cuidado de la pareja, arte, donación de azúcar o flores blancas el viernes.' },
  sani: { n: 'Śani', s: '♄', e: 'Saturno', d: 'Karma estructural, disciplina, longevidad, límites.', c: 'El Ermitaño', nat: 'Maléfico natural', tr: '2.5 años por signo', ex: 'Libra 20°', db: 'Aries 20°', up: 'Servicio a ancianos, austeridad, donación de sésamo negro el sábado.' },
  rahu: { n: 'Rāhu', s: '☊', e: 'Nodo Norte', d: 'Deseo insaciable, lo extranjero, tabú, obsesión.', c: 'El Extranjero', nat: 'Maléfico', tr: '18 meses por signo', ex: 'Tauro/Géminis', db: 'Escorpio/Sagitario', up: 'Desapego de obsesiones mundanas, servicio social.' },
  ketu: { n: 'Ketu', s: '☋', e: 'Nodo Sur', d: 'Karma pasado, espiritualidad, liberación, desapego.', c: 'El Monje', nat: 'Maléfico/Místico', tr: '18 meses por signo', ex: 'Escorpio/Sagitario', db: 'Tauro/Géminis', up: 'Práctica espiritual intensa, meditación sobre la liberación.' }
};

export default function GrahaSheet() {
  const { slug } = useParams();
  const data = slug ? GRAHA_DATA[slug] : null;
  if (!data) return <div className="wrap"><h1 className="sh">Graha no encontrado</h1><Link to="/" style={{color:'var(--g)'}}>← Volver</Link></div>;

  return (
    <div className="wrap">
      <nav><Link to="/" style={{color: 'var(--g)'}}>← Volver</Link></nav>
      <div style={{marginTop: '4rem', textAlign: 'center'}}>
        <span style={{fontSize: '5rem', color: 'var(--g)'}}>{data.s}</span>
        <h1 className="sh" style={{fontSize: '4rem'}}>{data.n}</h1>
        <p className="lbl">{data.c} · {data.e}</p>
      </div>
      <div className="pillar-grid" style={{marginTop:'3rem'}}>
        <div className="pill"><strong>Naturaleza</strong><p>{data.nat}</p></div>
        <div className="pill"><strong>Tránsito</strong><p>{data.tr}</p></div>
        <div className="pill"><strong>Exaltación</strong><p>{data.ex}</p></div>
        <div className="pill"><strong>Debilitación</strong><p>{data.db}</p></div>
      </div>
      <div style={{marginTop:'3rem', background:'var(--bg2)', padding:'2rem', border:'1px solid var(--bd)'}}>
        <h3 className="sh" style={{fontSize:'1.5rem'}}>Significación (Karakatvas)</h3>
        <p className="sint">{data.d}</p>
        <h3 className="sh" style={{fontSize:'1.5rem', marginTop:'2rem'}}>Remedios (Upāyas)</h3>
        <p className="sint">{data.up}</p>
      </div>
    </div>
  );
}
