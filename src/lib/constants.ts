export const RN = ['Meṣa', 'Vṛṣabha', 'Mithuna', 'Karkaṭa', 'Siṃha', 'Kanyā', 'Tulā', 'Vṛścika', 'Dhanuṣ', 'Makara', 'Kumbha', 'Mīna'];
export const RASI_ABB = ['Me', 'Vṛ', 'Mi', 'Ka', 'Si', 'Kā', 'Tu', 'Vś', 'Dh', 'Mk', 'Ku', 'Mī'];
export const ABB: Record<string, string> = { Sūrya: 'Su', Candra: 'Ca', Maṅgala: 'Ma', Budha: 'Bu', Guru: 'Gu', Śukra: 'Śu', Śani: 'Śa', Rāhu: 'Ra', Ketu: 'Ke' };

export const BHV = [
  { n: 1, skt: 'Tanu', es: 'El Yo', pts: '250,0 375,125 250,250 125,125', cx: 250, cy: 125, t: 'kendra', ka: 'Sūrya', kv: 'Cuerpo, personalidad, vitalidad, comienzos, autoconciencia, cabeza', d: 'El Ascendente (Lagna) — punto de partida de toda lectura. Rige la constitución física, la vitalidad, la salud y cómo nos proyectamos. El planeta en Casa 1 se manifiesta físicamente, incluso en el rostro. El signo colorea toda la personalidad.' },
  { n: 2, skt: 'Dhana', es: 'Riqueza', pts: '0,0 250,0 125,125', cx: 125, cy: 42, t: '', ka: 'Guru, Budha', kv: 'Dinero, familia, habla, alimentación, calidad de voz, entorno familiar temprano', d: 'Recursos acumulados: dinero, bienes, la familia de origen, la voz y la alimentación. Rige la calidad del habla y el entorno familiar temprano. Los indicadores son Júpiter (riqueza duradera) y Mercurio (comercio y discurso).' },
  { n: 3, skt: 'Bhrātṛ', es: 'Coraje', pts: '0,0 125,125 0,250', cx: 42, cy: 125, t: 'upacaya', ka: 'Maṅgala', kv: 'Hermanos menores, coraje, comunicación, escritura, deportes, uso de manos, artes, viajes cortos', d: 'Coraje, iniciativa y esfuerzo personal. Rige los hermanos menores, la comunicación, la escritura, los deportes, las artes y el uso de las manos. Los viajes cortos y la valentía también pertenecen aquí. Mejora con el tiempo (Upacaya).' },
  { n: 4, skt: 'Bandhu', es: 'Hogar', pts: '0,250 125,125 250,250 125,375', cx: 125, cy: 250, t: 'kendra', ka: 'Candra, Maṅgala', kv: 'Madre, hogar, bienes raíces, vehículos, educación formal, estabilidad mental', d: 'La madre, el hogar ancestral, los bienes raíces, los vehículos y la educación formal (especialmente la graduación universitaria). Para ver vehículos: Venus. Para estabilidad mental: Luna. La base emocional del nativo.' },
  { n: 5, skt: 'Putra', es: 'Creatividad', pts: '0,500 0,250 125,375', cx: 42, cy: 375, t: 'trikona', ka: 'Guru', kv: 'Hijos, inteligencia, romance, especulación, mantras, pūrva puṇya', d: 'Hijos, inteligencia creativa, romance y méritos de vidas anteriores (pūrva puṇya). Rige la especulación, la capacidad de aprendizaje y la mantra-siddhi. Júpiter aquí es indicador de aptitud para la astrología. Casa esencial para practicantes espirituales.' },
  { n: 6, skt: 'Śatru', es: 'Obstáculos', pts: '0,500 125,375 250,500', cx: 125, cy: 432, t: 'dusthana', ka: 'Maṅgala, Śani', kv: 'Enemigos, enfermedades, deudas, servicio, subordinados, competencia, amantes, tíos maternos', d: 'Duṣṭhāna. La más desafiante de las tres casas difíciles. Rige enemigos, enfermedades, deudas y competencias. También los amantes y relaciones extra-matrimoniales, los tíos maternos y los subordinados. Planetas fuertes aquí dan victorias militares o de alto rango.' },
  { n: 7, skt: 'Yuvati', es: 'Cónyuge', pts: '250,500 125,375 250,250 375,375', cx: 250, cy: 375, t: 'kendra', ka: 'Śukra', kv: 'Matrimonio, pareja, socios comerciales, vida pública, acuerdos, enemigos abiertos', d: 'El matrimonio, el cónyuge y las asociaciones comerciales. También la vida pública, los acuerdos y los enemigos abiertos (reconocidos públicamente). Opuesto al Lagna — representa el "otro" en todas sus formas. Casa clave para Venus.' },
  { n: 8, skt: 'Āyur', es: 'Transformación', pts: '500,500 250,500 375,375', cx: 375, cy: 432, t: 'dusthana', ka: 'Śani, Śukra', kv: 'Longevidad, muerte, ocultismo, herencias, litigios, eventos inesperados, transformación', d: 'Duṣṭhāna. Longevidad y duración de la vida. Rige la transformación profunda, el ocultismo, las herencias, los litigios y los eventos inesperados. Casa del renacimiento — superar adicciones o hábitos difíciles se ve aquí. La habilidad mística también pertenece a esta casa.' },
  { n: 9, skt: 'Dharma', es: 'Fortuna', pts: '500,500 375,375 500,250', cx: 458, cy: 375, t: 'trikona', ka: 'Sūrya, Guru', kv: 'Padre, gurú, dharma, fe, educación superior, viajes al extranjero, fortuna del karma pasado', d: 'La más auspiciosa después del Lagna. Rige el padre, los maestros (ācāryas), la fe, la ética y la comprensión espiritual. Educación superior, viajes al extranjero y el destino kármico (bhāgya). Luna en Casa 9 indica devoción profunda.' },
  { n: 10, skt: 'Karma', es: 'Profesión', pts: '500,250 375,125 250,250 375,375', cx: 375, cy: 250, t: 'kendra', ka: 'Sūrya, Budha, Guru', kv: 'Carrera, autoridad, reputación, reconocimiento público, karma en acción, suegra', d: 'El karma en acción. Carrera, profesión, estatus social, autoridad y reconocimiento público. También rige a la suegra. Una de las cuatro casas Kendra (pilares de la carta) — la más visible del horóscopo.' },
  { n: 11, skt: 'Lābha', es: 'Ganancias', pts: '500,0 500,250 375,125', cx: 458, cy: 125, t: 'upacaya', ka: 'Guru', kv: 'Ingresos, deseos cumplidos, hermanos mayores, tíos paternos, amigos, beneficios de vidas pasadas', d: 'Casa de beneficios, prosperidad y cumplimiento de metas e ingresos. Upacaya: mejora progresivamente con el tiempo.' },
  { n: 12, skt: 'Vyaya', es: 'Liberación', pts: '500,0 375,125 250,0', cx: 375, cy: 42, t: 'dusthana', ka: 'Śani', kv: 'Gastos, aislamiento, meditación, sueño, desapego, tierras lejanas, hospitalizaciones, mokṣa', d: 'Duṣṭhāna final. Los gastos, el aislamiento y el desapego. Rige el sueño profundo, la meditación y la reclusión. El destino del mokṣa — la liberación espiritual.' },
];

export const PILLARS = [
  { q: '¿Quién actúa?', skt: 'Grahas', es: 'Planetas', d: 'Los 9 Navagrahas — ejecutores del karma. Cada uno rige áreas específicas de la vida (karakatvas) y actúa de forma diferente según el signo y la casa que ocupa.' },
  { q: '¿Cómo actúa?', skt: 'Rāśis', es: 'Signos', d: '12 signos siderales. El tono psicológico y la modalidad de acción. El signo es el "cómo".' },
  { q: '¿Dónde actúa?', skt: 'Bhāvas', es: 'Casas', d: '12 áreas de la experiencia humana contadas desde el Lagna. El planeta actúa en el área de la vida que rige la casa.' },
  { q: '¿Por qué sucede?', skt: 'Nakṣatras', es: 'Mansiones Lunares', d: '27 asterismos de 13°20′. La motivación kármica más profunda y el impulso subyacente.' },
  { q: '¿Cuándo se activa?', skt: 'Daśās', es: 'Períodos Planetarios', d: 'Sistema Viṃśottarī de 120 años. Las Daśās indican cuándo fructifica el karma natal.' },
  { q: '¿El gatillo actual?', skt: 'Gocāra', es: 'Tránsitos', d: 'Posición actual de los planetas sobre la carta natal. El activador inmediato del karma latente.' },
];

export const RASHIS = [
  { n: 1, skt: 'Meṣa', es: 'Aries', lord: 'Maṅgala', mob: 'Chara', elem: 'Fuego', guna: 'Tamas' },
  { n: 2, skt: 'Vṛṣabha', es: 'Tauro', lord: 'Śukra', mob: 'Sthira', elem: 'Tierra', guna: 'Rajas' },
  { n: 3, skt: 'Mithuna', es: 'Géminis', lord: 'Budha', mob: 'Dvisvabhāva', elem: 'Aire', guna: 'Rajas' },
  { n: 4, skt: 'Karkaṭa', es: 'Cáncer', lord: 'Candra', mob: 'Chara', elem: 'Agua', guna: 'Sattva' },
  { n: 5, skt: 'Siṃha', es: 'Leo', lord: 'Sūrya', mob: 'Sthira', elem: 'Fuego', guna: 'Sattva' },
  { n: 6, skt: 'Kanyā', es: 'Virgo', lord: 'Budha', mob: 'Dvisvabhāva', elem: 'Tierra', guna: 'Rajas' },
  { n: 7, skt: 'Tulā', es: 'Libra', lord: 'Śukra', mob: 'Chara', elem: 'Aire', guna: 'Rajas' },
  { n: 8, skt: 'Vṛścika', es: 'Escorpio', lord: 'Maṅgala', mob: 'Sthira', elem: 'Agua', guna: 'Tamas' },
  { n: 9, skt: 'Dhanuṣ', es: 'Sagitario', lord: 'Guru', mob: 'Dvisvabhāva', elem: 'Fuego', guna: 'Sattva' },
  { n: 10, skt: 'Makara', es: 'Capricornio', lord: 'Śani', mob: 'Chara', elem: 'Tierra', guna: 'Tamas' },
  { n: 11, skt: 'Kumbha', es: 'Acuario', lord: 'Śani', mob: 'Sthira', elem: 'Aire', guna: 'Tamas' },
  { n: 12, skt: 'Mīna', es: 'Piscis', lord: 'Guru', mob: 'Dvisvabhāva', elem: 'Agua', guna: 'Sattva' },
];

export const GRAHAS = [
  { skt: 'Sūrya', es: 'Sol', sym: '☉', nat: 'm', ka: 'Ātman, ego, padre, autoridad, vitalidad', tr: '1 mes / signo', ex: 'Meṣa 10°', db: 'Tulā 10°' },
  { skt: 'Candra', es: 'Luna', sym: '☽', nat: 'v', ka: 'Mente (Manas), emociones, madre, paz interior', tr: '2.25 días / signo', ex: 'Vṛṣabha 3°', db: 'Vṛścika 3°' },
  { skt: 'Maṅgala', es: 'Marte', sym: '♂', nat: 'm', ka: 'Energía vital (Tejas), coraje, hermanos menores', tr: '1.5 meses / signo', ex: 'Makara 28°', db: 'Karkaṭa 28°' },
  { skt: 'Budha', es: 'Mercurio', sym: '☿', nat: 'v', ka: 'Intelecto (Buddhi), habla, comunicación, comercio', tr: '1 mes / signo', ex: 'Kanyā 15°', db: 'Mīna 15°' },
  { skt: 'Guru', es: 'Júpiter', sym: '♃', nat: 'b', ka: 'Sabiduría (Jñāna), hijos, maestros, dharma, fortuna', tr: '12 meses / signo', ex: 'Karkaṭa 5°', db: 'Makara 5°' },
  { skt: 'Śukra', es: 'Venus', sym: '♀', nat: 'b', ka: 'Deseo (Kāma), belleza, cónyuge, arte, vehículos', tr: '1 mes / signo', ex: 'Mīna 27°', db: 'Kanyā 27°' },
  { skt: 'Śani', es: 'Saturno', sym: '♄', nat: 'm', ka: 'Karma estructural, disciplina, longevidad, límites', tr: '2.5 años / signo', ex: 'Tulā 20°', db: 'Meṣa 20°' },
  { skt: 'Rāhu', es: 'Nodo Norte', sym: '☊', nat: 'm', ka: 'Deseo insaciable, lo extranjero, tabú, obsesión', tr: '18 meses / signo' },
  { skt: 'Ketu', es: 'Nodo Sur', sym: '☋', nat: 'm', ka: 'Karma pasado, espiritualidad, liberación, desapego', tr: '18 meses / signo' },
];

export const FUNDAMENTOS = [
  {
    q: 'Los ojos del Veda', skt: 'Vedāṅga', es: 'Jyotiṣa y los Cuatro Vedas',
    body: [
      { p: 'El Jyotiṣa es uno de los seis Vedāṅgas — ciencias auxiliares que ayudan a comprender y aplicar el Veda. El cuerpo del Veda se representa como el Puruṣa cósmico.' },
      { h: 'Los seis Vedāṅgas como partes del Puruṣa', items: ['Śikṣā (fonética) — la voz', 'Vyākaraṇa (gramática) — la boca', 'Chandas (métrica) — el ritmo del canto', 'Nirukta (etimología) — el discernimiento', 'Kalpa (ritual) — la acción correcta', 'Jyotiṣa (astrología) — los ojos y la visión'] },
    ]
  },
  {
    q: 'Las tres ramas', skt: 'Tri Skandha', es: 'Ramas del Jyotiṣa',
    body: [
      { p: 'El Jyotiṣa se organiza en tres ramas (Tri Skandha), cada una respondiendo una pregunta distinta sobre el tiempo y el destino.' },
      { h: 'Siddhānta — ¿cómo calcular?', p: 'La rama matemática y astronómica. Calcula con exactitud las posiciones planetarias.' },
      { h: 'Horā — ¿cómo interpretar?', items: ['Jātaka — análisis de la carta natal', 'Muhūrta — elección de momentos auspiciosos', 'Praśna — preguntas horarias', 'Nimitta — presagios', 'Kuṇḍalī Milāna — compatibilidad'] },
      { h: 'Saṃhitā — ¿qué sucede en el mundo?', items: ['Mundana — clima, naciones', 'Vāstuvidyā — arquitectura sagrada', 'Āṅgavidyā — lectura del cuerpo'] },
    ]
  }
];

export const KARMA_TEMAS = [
  {
    q: 'La acción y su fruto', skt: 'Karma Siddhānta', es: 'Teoría del Karma',
    body: [
      { p: 'La teoría del karma habla de ley de causa y efecto aplicada a la conciencia. Toda acción deja una huella (Saṃskāra) que tarde o temprano da fruto (Phala).' },
      { h: 'Por acumulación', items: ['Sañcita — la biblioteca total de karma pasado', 'Prārabdha — la porción activada en esta vida; "la flecha disparada"', 'Āgāmi — el karma que se genera ahora'] },
    ]
  },
  {
    q: 'El origen de los nodos', skt: 'Samudra Manthan', es: 'Mitología de Rāhu y Ketu',
    body: [
      { p: 'Un demonio se infiltró entre los Deva y bebió el Amṛta. Viṣṇu le cortó la cabeza, pero ya era inmortal. La cabeza es Rāhu y el cuerpo Ketu.' },
    ]
  }
];
