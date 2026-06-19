export const RN = ['Meṣa', 'Vṛṣabha', 'Mithuna', 'Karkaṭa', 'Siṃha', 'Kanyā', 'Tulā', 'Vṛścika', 'Dhanuṣ', 'Makara', 'Kumbha', 'Mīna'];
export const RASI_ABB = ['Me', 'Vṛ', 'Mi', 'Ka', 'Si', 'Kā', 'Tu', 'Vś', 'Dh', 'Mk', 'Ku', 'Mī'];
export const ABB: Record<string, string> = { Sūrya: 'Su', Candra: 'Ca', Maṅgala: 'Ma', Budha: 'Bu', Guru: 'Gu', Śukra: 'Śu', Śani: 'Śa', Rāhu: 'Ra', Ketu: 'Ke' };

export const BHV = [
  { n: 1, skt: 'Tanu', es: 'El Yo', pts: '250,0 375,125 250,250 125,125', cx: 250, cy: 125, t: 'kendra', ka: 'Sūrya', kv: 'Cuerpo, personalidad, vitalidad, comienzos, autoconciencia, cabeza', d: 'El Ascendente (Lagna) — punto de partida de toda lectura. Rige la constitución física, la vitalidad, la salud y cómo nos proyectamos.' },
  { n: 2, skt: 'Dhana', es: 'Riqueza', pts: '0,0 250,0 125,125', cx: 125, cy: 42, t: '', ka: 'Guru, Budha', kv: 'Dinero, familia, habla, alimentación, calidad de voz, entorno familiar temprano', d: 'Recursos acumulados: dinero, bienes, la familia de origen, la voz y la alimentación.' },
  { n: 3, skt: 'Bhrātṛ', es: 'Coraje', pts: '0,0 125,125 0,250', cx: 42, cy: 125, t: 'upacaya', ka: 'Maṅgala', kv: 'Hermanos menores, coraje, comunicación, escritura, deportes, uso de manos, artes, viajes cortos', d: 'Coraje, iniciativa y esfuerzo personal. Rige los hermanos menores, la comunicación y la valentía.' },
  { n: 4, skt: 'Bandhu', es: 'Hogar', pts: '0,250 125,125 250,250 125,375', cx: 125, cy: 250, t: 'kendra', ka: 'Candra, Maṅgala', kv: 'Madre, hogar, bienes raíces, vehículos, educación formal, estabilidad mental', d: 'La madre, el hogar ancestral, los bienes raíces, los vehículos y la educación formal.' },
  { n: 5, skt: 'Putra', es: 'Creatividad', pts: '0,500 0,250 125,375', cx: 42, cy: 375, t: 'trikona', ka: 'Guru', kv: 'Hijos, inteligencia, romance, especulación, mantras, pūrva puṇya', d: 'Hijos, inteligencia creativa, romance y méritos de vidas anteriores (pūrva puṇya).' },
  { n: 6, skt: 'Śatru', es: 'Obstáculos', pts: '0,500 125,375 250,500', cx: 125, cy: 432, t: 'dusthana', ka: 'Maṅgala, Śani', kv: 'Enemigos, enfermedades, deudas, servicio, subordinados, competencia, amantes, tíos maternos', d: 'Duṣṭhāna. La más desafiante de las tres casas difíciles. Rige enemigos, enfermedades, deudas y competencia.' },
  { n: 7, skt: 'Yuvati', es: 'Cónyuge', pts: '250,500 125,375 250,250 375,375', cx: 250, cy: 375, t: 'kendra', ka: 'Śukra', kv: 'Matrimonio, pareja, socios comerciales, vida pública, acuerdos, enemigos abiertos', d: 'El matrimonio, el cónyuge y las asociaciones comerciales. También la vida pública.' },
  { n: 8, skt: 'Āyur', es: 'Transformación', pts: '500,500 250,500 375,375', cx: 375, cy: 432, t: 'dusthana', ka: 'Śani, Śukra', kv: 'Longevidad, muerte, ocultismo, herencias, litigios, eventos inesperados, transformación', d: 'Duṣṭhāna. Longevidad y duración de la vida. Rige la transformación profunda y lo inesperado.' },
  { n: 9, skt: 'Dharma', es: 'Fortuna', pts: '500,500 375,375 500,250', cx: 458, cy: 375, t: 'trikona', ka: 'Sūrya, Guru', kv: 'Padre, gurú, dharma, fe, educación superior, viajes al extranjero, fortuna del karma pasado', d: 'La más auspiciosa después del Lagna. Rige el padre, los maestros, la fe y la ética.' },
  { n: 10, skt: 'Karma', es: 'Profesión', pts: '500,250 375,125 250,250 375,375', cx: 375, cy: 250, t: 'kendra', ka: 'Sūrya, Budha, Guru', kv: 'Carrera, autoridad, reputación, reconocimiento público, karma en acción, suegra', d: 'El karma en acción. Carrera, profesión, estatus social y reconocimiento público.' },
  { n: 11, skt: 'Lābha', es: 'Ganancias', pts: '500,0 500,250 375,125', cx: 458, cy: 125, t: 'upacaya', ka: 'Guru', kv: 'Ingresos, deseos cumplidos, hermanos mayores, tíos paternos, amigos, beneficios de vidas pasadas', d: 'Casa de beneficios, prosperidad y cumplimiento de metas e ingresos.' },
  { n: 12, skt: 'Vyaya', es: 'Liberación', pts: '500,0 375,125 250,0', cx: 375, cy: 42, t: 'dusthana', ka: 'Śani', kv: 'Gastos, aislamiento, meditación, sueño, desapego, tierras lejanas, hospitalizaciones, mokṣa', d: 'Duṣṭhāna final. Los gastos, el aislamiento y el desapego. El destino del mokṣa.' },
];

export const PILLARS = [
  { q: '¿Quién actúa?', skt: 'Grahas', es: 'Planetas', d: 'Los 9 Navagrahas — ejecutores del karma. Cada uno rige áreas específicas de la vida (karakatvas).' },
  { q: '¿Cómo actúa?', skt: 'Rāśis', es: 'Signos', d: '12 signos siderales. El tono psicológico y la modalidad de acción. El signo es el "cómo".' },
  { q: '¿Dónde actúa?', skt: 'Bhāvas', es: 'Casas', d: '12 áreas de la experiencia humana contadas desde el Lagna. El planeta actúa en el área de la vida.' },
  { q: '¿Por qué sucede?', skt: 'Nakṣatras', es: 'Mansiones Lunares', d: '27 asterismos de 13°20′. La motivación kármica más profunda y el impulso subyacente.' },
  { q: '¿Cuándo se activa?', skt: 'Daśās', es: 'Períodos Planetarios', d: 'Sistema Viṃśottarī de 120 años. Las Daśās indican cuándo fructifica el karma natal.' },
  { q: '¿El gatillo actual?', skt: 'Gocāra', es: 'Tránsitos', d: 'Posición actual de los planetas sobre la carta natal. El activador inmediato del karma latente.' },
];
