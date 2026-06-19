import { useParams, Link } from "react-router-dom";

const GRAHA_DATA: Record<string, any> = {
  surya: { n: 'Sūrya', s: '☉', d: 'El Atman, el ego, el padre, la autoridad, la vitalidad.', c: 'El Rey' },
  chandra: { n: 'Candra', s: '☽', d: 'La mente (Manas), las emociones, la madre, la paz interior.', c: 'La Reina' },
  mangala: { n: 'Maṅgala', s: '♂', d: 'Energía vital (Tejas), coraje, hermanos menores, acción.', c: 'El Guerrero' },
  guru: { n: 'Guru', s: '♃', d: 'Sabiduría (Jñāna), hijos, maestros, dharma, fortuna.', c: 'El Maestro' }
};

export default function GrahaSheet() {
  const { slug } = useParams();
  const data = slug ? GRAHA_DATA[slug] : null;

  if (!data) return <div>No encontrado</div>;

  return (
    <div className="wrap">
      <nav><Link to="/" style={{color: 'var(--g)'}}>← Volver</Link></nav>
      <div style={{marginTop: '4rem', textAlign: 'center'}}>
        <span style={{fontSize: '5rem', color: 'var(--g)'}}>{data.s}</span>
        <h1 className="sh" style={{fontSize: '4rem'}}>{data.n}</h1>
        <p className="lbl">{data.c}</p>
        <p className="sint" style={{margin: '2rem auto'}}>{data.d}</p>
      </div>
    </div>
  );
}
