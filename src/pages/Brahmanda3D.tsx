import { Canvas, useFrame } from "@react-three/fiber";
import { CameraControls, Html, Line, Stars } from "@react-three/drei";
import type { CameraControlsImpl } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Component, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import * as THREE from "three";
import { useChartStore } from "./store/chartStore";
import type { ApiResponse, ChartData, Planet, TransitPlanet, SavedChart, BirthInput } from "./store/chartStore";
import {
  PLANET_COLORS,
  PLANET_EMISSIVE,
  PLANET_SIZES,
  PLANET_SYMBOLS,
  RASI_SYMBOLS,
  RASI_NAMES,
  ELEMENT_COLORS,
  rasiElement,
} from "./lib/chart3d";

class SceneErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error: error.message };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="engine-error">
          <div>
            <strong>Error del motor 3D</strong>
            <span>{this.state.error}</span>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const CHART_SCALE = 0.018;
const JD_EPOCH = 2451545.0;
const MS_PER_DAY = 86400000;
const JD_UNIX_EPOCH_MS = 946727935816;

const PLANET_ABB: Record<string, string> = {
  "Sūrya": "Su",
  "Candra": "Ca",
  "Maṅgala": "Ma",
  "Budha": "Bu",
  "Guru": "Gu",
  "Śukra": "Śu",
  "Śani": "Śa",
  "Rāhu": "Ra",
  "Ketu": "Ke",
};

const DIGNITY_COL: Record<string, string> = {
  exalt: "#6ee7a8",
  debil: "#f1896d",
  own: "#8fb8c8",
  comb: "#f3a24f",
};

const DIGN_LABEL: Record<string, string> = {
  exalt: "exaltado",
  debil: "debilitado",
  own: "signo propio",
  comb: "combusto",
};

const HOUSE_MEANINGS: Record<number, { sanskrit: string; plain: string; scene: string; quality: string }> = {
  1: { sanskrit: "Tanu", plain: "cuerpo, identidad, vitalidad", scene: "puerta de llegada", quality: "kendra" },
  2: { sanskrit: "Dhana", plain: "recursos, habla, familia", scene: "tesorería", quality: "artha" },
  3: { sanskrit: "Sahaja", plain: "coraje, hermanos, esfuerzo", scene: "sala de entrenamiento", quality: "upacaya" },
  4: { sanskrit: "Bandhu", plain: "hogar, madre, paz interior", scene: "santuario", quality: "kendra" },
  5: { sanskrit: "Putra", plain: "inteligencia, mantra, hijos", scene: "sala de estudio", quality: "trikona" },
  6: { sanskrit: "Ari", plain: "enfermedad, deuda, enemigos", scene: "taller de reparación", quality: "dusthana" },
  7: { sanskrit: "Yuvati", plain: "socios, acuerdos, espejo público", scene: "umbral", quality: "kendra" },
  8: { sanskrit: "Randhra", plain: "secretos, crisis, transformación", scene: "bóveda oculta", quality: "dusthana" },
  9: { sanskrit: "Dharma", plain: "maestros, gracia, ética", scene: "camino al templo", quality: "trikona" },
  10: { sanskrit: "Karma", plain: "trabajo, estatus, acción", scene: "taller activo", quality: "kendra" },
  11: { sanskrit: "Lābha", plain: "ganancias, redes, plenitud", scene: "mercado", quality: "upacaya" },
  12: { sanskrit: "Vyaya", plain: "pérdidas, sueño, liberación", scene: "cámara de salida", quality: "dusthana" },
};

const HOUSE_FILL: Record<string, string> = {
  kendra: "#192845",
  trikona: "#173524",
  dusthana: "#3b1815",
  upacaya: "#14233a",
  artha: "#2e2a16",
};

const HOUSE_EDGE: Record<string, string> = {
  kendra: "#75a7ff",
  trikona: "#75d792",
  dusthana: "#f08a6a",
  upacaya: "#6bc0d8",
  artha: "#d2b760",
};

const NORTH_BHV = [
  { n: 1, pts: "250,0 375,125 250,250 125,125", cx: 250, cy: 125 },
  { n: 2, pts: "0,0 250,0 125,125", cx: 125, cy: 42 },
  { n: 3, pts: "0,0 125,125 0,250", cx: 42, cy: 125 },
  { n: 4, pts: "0,250 125,125 250,250 125,375", cx: 125, cy: 250 },
  { n: 5, pts: "0,500 0,250 125,375", cx: 42, cy: 375 },
  { n: 6, pts: "0,500 125,375 250,500", cx: 125, cy: 432 },
  { n: 7, pts: "250,500 125,375 250,250 375,375", cx: 250, cy: 375 },
  { n: 8, pts: "500,500 250,500 375,375", cx: 375, cy: 432 },
  { n: 9, pts: "500,500 375,375 500,250", cx: 458, cy: 375 },
  { n: 10, pts: "500,250 375,125 250,250 375,375", cx: 375, cy: 250 },
  { n: 11, pts: "500,0 500,250 375,125", cx: 458, cy: 125 },
  { n: 12, pts: "500,0 375,125 250,0", cx: 375, cy: 42 },
];

const RASI_ABB = ["Me", "Vṛ", "Mi", "Ka", "Si", "Kā", "Tu", "Vś", "Dh", "Mk", "Ku", "Mī"];
const ELEMENT_LABELS: Record<ReturnType<typeof rasiElement>, string> = {
  fire: "fuego",
  earth: "tierra",
  air: "aire",
  water: "agua",
};

const PLANET_KARAKAS: Record<string, { body: string; teaching: string }> = {
  "Sūrya": { body: "corazón", teaching: "ātman, autoridad, vitalidad" },
  "Candra": { body: "mente", teaching: "mente, memoria, receptividad" },
  "Maṅgala": { body: "brazos", teaching: "fuerza, coraje, acción" },
  "Budha": { body: "habla", teaching: "intelecto, lenguaje, comercio" },
  "Guru": { body: "sabiduría", teaching: "conocimiento, maestros, expansión" },
  "Śukra": { body: "deseo", teaching: "belleza, placer, relación" },
  "Śani": { body: "huesos", teaching: "karma, retraso, disciplina" },
  "Rāhu": { body: "cabeza", teaching: "hambre, sombra, amplificación" },
  "Ketu": { body: "cola", teaching: "liberación, separación, mokṣa" },
};

const STAGE_LEXICON: Record<string, { frame: string; key: string; trap: string }> = {
  grahas: {
    frame: "¿Quién?",
    key: "Un graha es un agente, no un punto decorativo.",
    trap: "No leas el signo antes de saber quién actúa.",
  },
  rasis: {
    frame: "¿Cómo?",
    key: "El rāśi es la atmósfera: elemento, dignidad, comodidad, fricción.",
    trap: "No confundas rāśi con casa. El signo es el clima, la casa es la habitación.",
  },
  bhavas: {
    frame: "¿Dónde?",
    key: "El bhāva es la habitación vivida donde el graha tiene consecuencias.",
    trap: "El mismo planeta cambia de significado cuando cambia la habitación.",
  },
  nakshatras: {
    frame: "¿Por qué?",
    key: "El nakṣatra es la motivación lunar más fina bajo el signo.",
    trap: "El pāda es pequeño, pero cambia el tono de la expression.",
  },
  dashas: {
    frame: "¿Cuándo?",
    key: "La daśā es el reloj que decide cuál trama está activa.",
    trap: "Una promesa en la carta no se manifiesta hasta que su período se abre.",
  },
  gochara: {
    frame: "Detonador",
    key: "El gocāra es el cielo vivo presionando sobre el patrón natal.",
    trap: "Los tránsitos tienen sentido solo después de orientar el mapa natal.",
  },
};
const NAKS27 = [
  "Aśvinī", "Bharaṇī", "Kṛttikā", "Rohiṇī", "Mṛgaśirā", "Ārdrā", "Punarvasū", "Puṣya", "Āśleṣā",
  "Maghā", "Pūrvā Phālgunī", "Uttara Phālgunī", "Hastā", "Citrā", "Svātī", "Viśākhā", "Anurādhā", "Jyeṣṭhā",
  "Mūlā", "Pūrvāṣāḍhā", "Uttarāṣāḍhā", "Śravaṇa", "Dhaniṣṭhā", "Śatabhiṣā", "Pūrva Bhādrapadā", "Uttara Bhādrapadā", "Revatī",
];

const NAKS_LORDS = [
  "Ketu","Śukra","Sūrya","Candra","Maṅgala","Rāhu","Guru",
  "Śani","Budha","Ketu","Śukra","Sūrya","Candra","Maṅgala","Rāhu",
  "Guru","Śani","Budha","Ketu","Śukra","Sūrya","Candra","Maṅgala",
  "Rāhu","Guru","Śani","Budha",
];

function makePieWedge(startA: number, endA: number, r: number): THREE.BufferGeometry {
  const steps = Math.max(6, Math.round(((endA - startA) / (Math.PI * 2)) * 48));
  const pos: number[] = [0, 0, 0];
  for (let i = 0; i <= steps; i++) {
    const a = startA + ((endA - startA) * i) / steps;
    pos.push(Math.cos(a) * r, 0, Math.sin(a) * r);
  }
  const idx: number[] = [];
  for (let i = 1; i <= steps; i++) idx.push(0, i, i + 1);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pos), 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

const STAGES = [
  {
    id: "grahas",
    label: "Grahas",
    title: "¿Quién actúa?",
    action: "Elige un planeta para comenzar. Los nueve grahas son los agentes de cada historia.",
    note: "Los planetas flotan sobre la carta. El punto sobre el planeta indica dignidad: ver leyenda en el panel derecho.",
    camera: [0, 5.5, 7] as [number, number, number],
    hint: "Haz clic en cualquier planeta para continuar.",
  },
  {
    id: "rasis",
    label: "Rāśis",
    title: "¿Cómo se comporta?",
    action: "Los signos son la atmósfera en la que cada planeta entra.",
    note: "El diamante rota para que el signo del lagna quede arriba. Los colores de dignidad muestran comodidad o fricción.",
    camera: [-3.5, 4.5, 6.5] as [number, number, number],
    hint: "Elige un planeta para ver cómo su signo lo colorea.",
  },
  {
    id: "bhavas",
    label: "Bhāvas",
    title: "¿Dónde sucede?",
    action: "Las casas se elevan como columnas. La altura muestra ocupación, el color muestra su calidad.",
    note: "Kendra (azul), trikona (verde), dusthana (rojo), upacaya (cian), artha (dorado).",
    camera: [5, 4.2, 6.5] as [number, number, number],
    hint: "Haz clic en una columna para anclar esa habitación.",
  },
  {
    id: "nakshatras",
    label: "Nakṣatras",
    title: "¿Por qué se mueve?",
    action: "27 mansiones lunares rodean la carta. Haz clic en un segmento del anillo para explorar esa mansión.",
    note: "El nakṣatra es la motivación más sutil bajo el signo: la mansión lunar donde el planeta está anclado.",
    camera: [0, 3.5, 8.5] as [number, number, number],
    hint: "Haz clic en un planeta para ver su nakṣatra. Haz clic en un segmento del anillo para explorar esa mansión.",
  },
  {
    id: "dashas",
    label: "Daśās",
    title: "¿Cuándo se activa?",
    action: "El reloj viṃśottarī muestra los 9 períodos planetarios. El sector más brillante es la mahādaśā actual.",
    note: "La daśā es el reloj planetario. Indica qué trama está corriendo ahora.",
    camera: [-5.5, 3.2, 7.5] as [number, number, number],
    hint: "Observa el anillo y avanza.",
  },
  {
    id: "gochara",
    label: "Gocāra",
    title: "¿Qué lo detona hoy?",
    action: "Activa los tránsitos. Los planetas actuales se superponen en capa traslúcida sobre el mapa natal.",
    note: "Los tránsitos son el cielo vivo. Son legibles solo después de orientar el mapa natal.",
    camera: [0, 5.8, 7.5] as [number, number, number],
    hint: "Activa Tránsitos para continuar.",
  },
] as const;

type StageId = (typeof STAGES)[number]["id"];

type BirthField = "date" | "time";

function jdNow() {
  return JD_EPOCH + (Date.now() - JD_UNIX_EPOCH_MS) / MS_PER_DAY;
}

function jdToDate(jd: number): string {
  const ms = (jd - JD_EPOCH) * MS_PER_DAY + JD_UNIX_EPOCH_MS;
  return new Date(ms).toLocaleDateString("es-ES", { month: "short", day: "numeric", year: "numeric" });
}

function fmtDeg(lon: number) {
  const signDegree = ((lon % 30) + 30) % 30;
  return `${Math.floor(signDegree)}°${String(Math.floor((signDegree % 1) * 60)).padStart(2, "0")}′`;
}

function svgTo3D(sx: number, sy: number, y = 0): [number, number, number] {
  return [(sx - 250) * CHART_SCALE, y, (sy - 250) * CHART_SCALE];
}

function makeHouseGeo(points: string): THREE.BufferGeometry {
  const pts = points.split(" ").map((p) => {
    const [x, y] = p.split(",").map(Number);
    return svgTo3D(x, y, 0);
  });
  const verts = pts.length === 3
    ? new Float32Array([...pts[0], ...pts[1], ...pts[2]])
    : new Float32Array([...pts[0], ...pts[1], ...pts[2], ...pts[0], ...pts[2], ...pts[3]]);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(verts, 3));
  geo.computeVertexNormals();
  return geo;
}

function houseCenter(house: number): [number, number, number] {
  const match = NORTH_BHV.find((h) => h.n === house) ?? NORTH_BHV[0];
  return svgTo3D(match.cx, match.cy, 0);
}

function getCurrentDasha(apiData: ApiResponse | null) {
  const now = jdNow();
  const maha = apiData?.dasha?.dashas.find((d) => d.sjd <= now && now <= d.ejd);
  const antar = maha?.subs.find((s) => s.sjd <= now && now <= s.ejd);
  return { maha, antar };
}

const CHART_ANCHOR_X = 0;
const CHART_ANCHOR_Y = 0.4;

function CameraGuide({ stage }: { stage: (typeof STAGES)[number] }) {
  const controlsRef = useRef<CameraControlsImpl>(null);
  const resetCameraTs = useChartStore((s) => s.resetCameraTs);

  useEffect(() => {
    if (!controlsRef.current) return;
    controlsRef.current.setLookAt(
      stage.camera[0] + CHART_ANCHOR_X,
      stage.camera[1],
      stage.camera[2],
      CHART_ANCHOR_X,
      CHART_ANCHOR_Y,
      0,
      true,
    );
  }, [stage]);

  useEffect(() => {
    if (!resetCameraTs || !controlsRef.current) return;
    controlsRef.current.setLookAt(
      stage.camera[0] + CHART_ANCHOR_X,
      stage.camera[1],
      stage.camera[2],
      CHART_ANCHOR_X,
      CHART_ANCHOR_Y,
      0,
      true,
    );
  }, [resetCameraTs, stage]);

  useEffect(() => {
    const STEP_AZ = 0.12;
    const STEP_POL = 0.08;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (!controlsRef.current) return;
      if (e.key === "ArrowLeft")  { e.preventDefault(); controlsRef.current.rotate(-STEP_AZ, 0, true); }
      if (e.key === "ArrowRight") { e.preventDefault(); controlsRef.current.rotate( STEP_AZ, 0, true); }
      if (e.key === "ArrowUp")    { e.preventDefault(); controlsRef.current.rotate(0, -STEP_POL, true); }
      if (e.key === "ArrowDown")  { e.preventDefault(); controlsRef.current.rotate(0,  STEP_POL, true); }
      if (e.key === "c" || e.key === "C") {
        useChartStore.getState().triggerCameraReset();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return <CameraControls ref={controlsRef} makeDefault minDistance={5} maxDistance={22} polarAngleMin={0.05} polarAngleMax={Math.PI / 2 - 0.05} />;
}

function HouseCell({
  house,
  lagnaRasi,
  activeStage,
  selectedHouse,
  occupants,
  onSelect,
  alpha = 1,
}: {
  house: (typeof NORTH_BHV)[number];
  lagnaRasi?: number;
  activeStage: StageId;
  selectedHouse: number | null;
  occupants: number;
  onSelect: (house: number) => void;
  alpha?: number;
}) {
  const geometry = useMemo(() => makeHouseGeo(house.pts), [house.pts]);
  const points = useMemo<[number, number, number][]>(() => {
    const pts = house.pts.split(" ").map((p) => {
      const [x, y] = p.split(",").map(Number);
      return svgTo3D(x, y, 0.04) as [number, number, number];
    });
    return [...pts, pts[0]];
  }, [house.pts]);

  const houseInfo = HOUSE_MEANINGS[house.n];
  const isSelected = selectedHouse === house.n;
  const rasiIdx = lagnaRasi === undefined ? undefined : (lagnaRasi + house.n - 1) % 12;
  const bhavaMode = activeStage === "bhavas";
  const rasiMode = activeStage === "rasis";
  const muted = ["nakshatras", "dashas", "gochara"].includes(activeStage) && !isSelected;
  const color = HOUSE_FILL[houseInfo.quality];
  const edge = isSelected ? "#f7df90" : HOUSE_EDGE[houseInfo.quality];

  const lift = bhavaMode ? 0.22 + occupants * 0.32 + (isSelected ? 0.4 : 0) : isSelected ? 0.18 : 0;
  const labelY = bhavaMode ? lift + 0.3 : 0.18;
  const baseCenter = svgTo3D(house.cx, house.cy, 0);
  const center: [number, number, number] = [baseCenter[0], labelY, baseCenter[2]];

  const houseClickable = activeStage === "bhavas";

  return (
    <group onClick={(e) => { if (!houseClickable) return; e.stopPropagation?.(); onSelect(house.n); }}>
      <mesh geometry={geometry} raycast={houseClickable ? undefined : () => {}}>
        <meshBasicMaterial transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <group position={[0, lift, 0]}>
        <mesh geometry={geometry}>
          <meshStandardMaterial
            color={isSelected ? edge : color}
            transparent
            opacity={isSelected ? 0.78 : (muted ? 0.18 : bhavaMode ? 0.66 : 0.32) * alpha}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        <Line points={points} color={edge} lineWidth={isSelected ? 3 : bhavaMode ? 2.2 : 1.1} transparent opacity={isSelected ? 1 : 0.7 * alpha} />
      </group>
      {bhavaMode && lift > 0 && (
        <Line
          points={[
            svgTo3D(house.cx, house.cy, 0),
            [svgTo3D(house.cx, house.cy, 0)[0], lift, svgTo3D(house.cx, house.cy, 0)[2]] as [number, number, number],
          ]}
          color={edge}
          lineWidth={1.4}
          transparent
          opacity={0.45}
          dashed
          dashSize={0.08}
          gapSize={0.08}
        />
      )}
      <Html position={center} center className="html-label" style={{ pointerEvents: "none" }}>
        <div className={`house-label ${isSelected ? "selected" : ""} ${bhavaMode ? "educational" : ""}`} style={{ opacity: isSelected ? 1 : alpha }}>
          <b>{house.n}</b>
          <span>{rasiIdx !== undefined ? RASI_ABB[rasiIdx] : ""}</span>
          {(bhavaMode || isSelected) && <small>{houseInfo.sanskrit}</small>}
          {rasiMode && rasiIdx !== undefined && <small>{RASI_NAMES[rasiIdx]}</small>}
        </div>
      </Html>
    </group>
  );
}

function DiamondChart({ chart, activeStage, selectedHouse, setSelectedHouse, houseAlpha = 1 }: {
  chart?: ChartData;
  activeStage: StageId;
  selectedHouse: number | null;
  setSelectedHouse: (house: number | null) => void;
  houseAlpha?: number;
}) {
  const occupantsByHouse = useMemo(() => {
    const map: Record<number, number> = {};
    chart?.planets.forEach((p) => { map[p.house] = (map[p.house] ?? 0) + 1; });
    return map;
  }, [chart]);

  const selectHouse = useCallback((house: number) => {
    const next = selectedHouse === house ? null : house;
    setSelectedHouse(next);
  }, [selectedHouse, setSelectedHouse]);

  return (
    <group rotation={[0, 0, 0]}>
      <Line points={[[-4.65, 0.06, -4.65], [4.65, 0.06, -4.65], [4.65, 0.06, 4.65], [-4.65, 0.06, 4.65], [-4.65, 0.06, -4.65]]} color="#577399" lineWidth={1.4} transparent opacity={0.35 * houseAlpha} />
      {NORTH_BHV.map((house) => (
        <HouseCell
          key={house.n}
          house={house}
          lagnaRasi={chart?.lagnaRasi}
          activeStage={activeStage}
          selectedHouse={selectedHouse}
          occupants={occupantsByHouse[house.n] ?? 0}
          onSelect={selectHouse}
          alpha={houseAlpha}
        />
      ))}
      <Html position={[0, 0.1, 0]} center style={{ pointerEvents: "none" }}>
        <div className="center-seal">
          <b>Jyotish</b>
          <span>{chart ? `${RASI_NAMES[chart.lagnaRasi]} Lagna` : "mapa del Lagna"}</span>
        </div>
      </Html>
    </group>
  );
}

function PlanetAvatar({ planet, isTransit = false, activeStage, occupantIdx = 0, totalInHouse = 1, alpha = 1 }: {
  planet: Planet | TransitPlanet;
  isTransit?: boolean;
  activeStage: StageId;
  occupantIdx?: number;
  totalInHouse?: number;
  alpha?: number;
}) {
  const { selectedBody, setSelectedBody } = useChartStore();
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const isSelected = selectedBody === planet.name;
  const natalPlanet = !isTransit && "house" in planet ? planet as Planet : null;
  const position = useMemo<[number, number, number]>(() => {
    if (natalPlanet) {
      const [x, , z] = houseCenter(natalPlanet.house);
      const stageY = (() => {
        if (activeStage === "grahas") return 1.55;
        if (activeStage === "bhavas") return 0.45;
        if (activeStage === "nakshatras") return 3.0;
        if (activeStage === "dashas") return 0.38;
        if (activeStage === "gochara") return 0.7;
        return 0.85;
      })();
      let dx = 0, dz = 0;
      if (totalInHouse > 1) {
        const angle = (occupantIdx / totalInHouse) * Math.PI * 2;
        const r = 0.28 + 0.1 * (totalInHouse - 1);
        dx = Math.cos(angle) * r;
        dz = Math.sin(angle) * r;
      } else {
        const raw = ((natalPlanet.lon % 30) / 30 - 0.5) * 0.82;
        dx = raw;
        dz = -raw * 0.45;
      }
      return [x + dx, stageY, z + dz];
    }
    const transit = planet as TransitPlanet;
    const ring = 5.6;
    const theta = -(transit.lon * Math.PI) / 180;
    return [Math.cos(theta) * ring, 3.8, Math.sin(theta) * ring];
  }, [activeStage, natalPlanet, planet, occupantIdx, totalInHouse]);

  const dignity = natalPlanet?.dign ?? "";
  const planetColor = PLANET_COLORS[planet.name] ?? "#f6f1df";
  const emissive = PLANET_EMISSIVE[planet.name] ?? planetColor;
  const size = (PLANET_SIZES[planet.name] ?? 0.16) * (isTransit ? 0.7 : 1);
  const selectedScale = planet.name === "Sūrya" ? 1.15 : 1.28;
  const faded = activeStage === "bhavas" || activeStage === "dashas";

  const haloColor = dignity === "exalt" ? "#f7df90" : dignity === "debil" ? "#f1896d" : dignity === "own" ? "#8fb8c8" : null;
  const dignLabel = dignity === "exalt" ? "E" : dignity === "debil" ? "D" : dignity === "own" ? "P" : dignity === "comb" ? "C" : null;

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * (isSelected ? 0.9 : 0.35);
  });

  const select = useCallback((e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (isTransit) return;
    setSelectedBody(isSelected ? null : planet.name);
  }, [isSelected, isTransit, planet.name, setSelectedBody]);

  const isSun = planet.name === "Sūrya";
  const isSaturn = planet.name === "Śani";
  const isMoon = planet.name === "Candra";

  return (
    <group
      position={position}
      onPointerDown={(e) => { if (!isTransit) e.stopPropagation(); }}
    >
      <mesh
        ref={meshRef}
        onClick={select}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        scale={isSelected ? selectedScale : hovered ? 1.16 : 1}
        renderOrder={10}
      >
        <sphereGeometry args={[size, 24, 24]} />
        <meshStandardMaterial
          color={planetColor}
          emissive={emissive}
          emissiveIntensity={isSelected ? 1.85 : hovered ? 1.45 : isTransit ? 0.7 : 1.05}
          roughness={isSun ? 0.12 : 0.38}
          metalness={isSaturn ? 0.55 : 0.18}
          transparent
          opacity={isSelected ? 1 : (isTransit ? 0.38 : !isTransit && selectedBody !== null ? 0.14 : activeStage === "dashas" ? 0.22 : faded ? 0.55 : 1) * alpha}
        />
      </mesh>
      {isSun && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[size * 1.9, size * 0.32, 6, 48]} />
          <meshStandardMaterial color="#FF9500" emissive="#FF6800" emissiveIntensity={3.5} transparent opacity={0.22} />
        </mesh>
      )}
      {isSaturn && (
        <mesh rotation={[-Math.PI / 4, 0, 0]}>
          <torusGeometry args={[size * 2.2, size * 0.09, 4, 48]} />
          <meshStandardMaterial color="#7BA7BC" emissive="#4477AA" emissiveIntensity={1.2} transparent opacity={0.78} />
        </mesh>
      )}
      {isMoon && (
        <mesh>
          <sphereGeometry args={[size * 1.55, 12, 12]} />
          <meshStandardMaterial color="#C8D8F0" emissive="#8899CC" emissiveIntensity={0.8} transparent opacity={0.14} />
        </mesh>
      )}
      {haloColor && !isTransit && (
        <mesh position={[0, size * 3.6, 0]} renderOrder={12}>
          <sphereGeometry args={[size * 0.30, 6, 6]} />
          <meshStandardMaterial color={haloColor} emissive={haloColor} emissiveIntensity={6.5} transparent opacity={0.92} depthTest={false} />
        </mesh>
      )}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[size * 2.55, size * 0.07, 8, 72]} />
          <meshStandardMaterial color={planetColor} emissive={planetColor} emissiveIntensity={3} transparent opacity={0.7} />
        </mesh>
      )}
      <mesh
        onClick={select}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onPointerDown={(e) => { if (!isTransit) e.stopPropagation(); }}
        renderOrder={10}
      >
        <sphereGeometry args={[size * 2.0, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <Html position={[0, -(size + 0.48), 0]} center className="html-label" style={{ pointerEvents: "none" }}>
        <div className={`planet-tag ${isSelected ? "selected" : ""} ${isTransit ? "transit" : ""}`} style={{ borderColor: `${planetColor}88`, color: planetColor, boxShadow: `0 0 18px ${emissive}33`, opacity: isSelected ? 1 : alpha }}>
          <b>{PLANET_SYMBOLS[planet.name] ?? "."}</b>
          <span>{isTransit ? `T:${PLANET_ABB[planet.name] ?? planet.name}` : PLANET_ABB[planet.name] ?? planet.name}</span>
          {natalPlanet?.retro && natalPlanet.name !== "Rāhu" && natalPlanet.name !== "Ketu" && <i>R</i>}
          {dignLabel && !isTransit && <i className={`dign-pip dign-${dignity}`}>{dignLabel}</i>}
        </div>
      </Html>
    </group>
  );
}

function DashaWheel({ apiData }: { apiData: ApiResponse | null }) {
  const dasha = apiData?.dasha;
  const now = jdNow();
  if (!dasha?.dashas.length) return null;
  const start = dasha.dashas[0].sjd;
  const end = dasha.dashas[dasha.dashas.length - 1].ejd;
  const span = end - start;

  const R = 5.4;
  const Y = 1.2;

  const sectors = useMemo(() => {
    let cursor = 0;
    return dasha.dashas.slice(0, 9).map((seg) => {
      const fraction = (seg.ejd - seg.sjd) / span;
      const startA = cursor;
      const endA = cursor + fraction * Math.PI * 2;
      cursor = endA;
      const mid = (startA + endA) / 2;
      const current = seg.sjd <= now && now <= seg.ejd;
      const color = PLANET_COLORS[seg.lord] ?? "#8fb8c8";
      const geo = makePieWedge(startA, endA, R);
      return { startA, endA, mid, current, color, lord: seg.lord, geo, fraction };
    });
  }, [dasha, now, span]);

  const activeSector = sectors.find((s) => s.current);
  const activeColor = activeSector?.color ?? "#f7df90";

  return (
    <group position={[0, Y, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={0} position={[0, -0.02, 0]}>
        <ringGeometry args={[0.18, R + 0.08, 64]} />
        <meshBasicMaterial color="#0a0f1e" transparent opacity={0.55} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {sectors.map(({ geo, mid, current, color, lord, startA }, sIdx) => (
        <group key={lord}>
          <mesh geometry={geo} renderOrder={sIdx + 1} position={[0, 0.01, 0]}>
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={current ? 1.4 : 0.22}
              transparent
              opacity={current ? 0.65 : 0.2}
              side={THREE.DoubleSide}
              depthWrite={false}
              polygonOffset
              polygonOffsetFactor={-1}
              polygonOffsetUnits={-1}
            />
          </mesh>
          <Line
            points={[[Math.cos(startA) * 0.18, 0.06, Math.sin(startA) * 0.18], [Math.cos(startA) * R, 0.06, Math.sin(startA) * R]]}
            color="#0d1525"
            lineWidth={1.8}
            transparent
            opacity={0.95}
          />
          <Html position={[Math.cos(mid) * (R * 0.66), 0.22, Math.sin(mid) * (R * 0.66)]} center style={{ pointerEvents: "none" }}>
            <div className={`dasha-sector-tag ${current ? "active" : ""}`} style={{ color, borderColor: `${color}55` }}>
              <b>{PLANET_SYMBOLS[lord] ?? ""}</b>
              <span>{PLANET_ABB[lord] ?? lord}</span>
            </div>
          </Html>
        </group>
      ))}
      {activeSector && (
        <>
          <Line
            points={[[0, 0.1, 0], [Math.cos(activeSector.mid) * (R * 0.52), 0.1, Math.sin(activeSector.mid) * (R * 0.52)]]}
            color={activeColor}
            lineWidth={3.2}
            transparent
            opacity={0.92}
          />
          <mesh position={[Math.cos(activeSector.mid) * (R * 0.52), 0.22, Math.sin(activeSector.mid) * (R * 0.52)]}>
            <sphereGeometry args={[0.22, 14, 14]} />
            <meshStandardMaterial color={activeColor} emissive={activeColor} emissiveIntensity={5} />
          </mesh>
          <Html position={[Math.cos(activeSector.mid) * (R * 0.52), 0.9, Math.sin(activeSector.mid) * (R * 0.52)]} center style={{ pointerEvents: "none" }}>
            <div className="nak-tag" style={{ color: activeColor, borderColor: `${activeColor}88` }}>
              <b>{PLANET_SYMBOLS[activeSector.lord] ?? ""} {activeSector.lord}</b>
              <span>mahādaśā activa</span>
            </div>
          </Html>
        </>
      )}
    </group>
  );
}

function NakshatraRing({ chart, activeStage, selectedNakshatra, setSelectedNakshatra }: {
  chart?: ChartData;
  activeStage: StageId;
  selectedNakshatra: number | null;
  setSelectedNakshatra: (n: number | null) => void;
}) {
  const selectedBody = useChartStore((s) => s.selectedBody);
  const planet = chart?.planets.find((p) => p.name === selectedBody) ?? chart?.planets[0];
  const nakIndex = planet ? Math.floor(planet.lon / (360 / 27)) : null;
  const alwaysVisible = activeStage === "nakshatras";

  const naksWithPlanets = useMemo(() => {
    const map = new Map<number, string[]>();
    chart?.planets.forEach((p) => {
      const nk = Math.floor(p.lon / (360 / 27));
      if (!map.has(nk)) map.set(nk, []);
      map.get(nk)!.push(PLANET_ABB[p.name] ?? p.name);
    });
    return map;
  }, [chart]);

  const wedgeGeos = useMemo(() =>
    Array.from({ length: 27 }, (_, i) => {
      const a0 = (i / 27) * Math.PI * 2;
      const a1 = ((i + 1) / 27) * Math.PI * 2;
      const inner = 5.5, outer = 6.95;
      const steps = 8;
      const pos: number[] = [];
      for (let s = 0; s <= steps; s++) {
        const a = a0 + ((a1 - a0) * s) / steps;
        pos.push(Math.cos(a) * inner, 0, Math.sin(a) * inner);
        pos.push(Math.cos(a) * outer, 0, Math.sin(a) * outer);
      }
      const idx: number[] = [];
      for (let s = 0; s < steps; s++) {
        const b = s * 2;
        idx.push(b, b + 1, b + 3, b, b + 3, b + 2);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pos), 3));
      geo.setIndex(idx);
      geo.computeVertexNormals();
      return geo;
    }), []);

  const segments = useMemo(() => Array.from({ length: 27 }, (_, i) => {
    const a0 = (i / 27) * Math.PI * 2;
    const a1 = ((i + 1) / 27) * Math.PI * 2;
    const r = 6.22;
    const mid = (a0 + a1) / 2;
    return { i, mid, px: Math.cos(mid) * r, pz: Math.sin(mid) * r };
  }), []);

  const focused = selectedNakshatra ?? nakIndex;

  return (
    <group>
      {segments.map((seg) => {
        const isNakPlanet = nakIndex === seg.i;
        const isSelected = selectedNakshatra === seg.i;
        const active = isNakPlanet || isSelected;
        const hasNatal = naksWithPlanets.has(seg.i);
        const pillarTop = isSelected ? 2.8 : isNakPlanet ? 2.2 : hasNatal ? 1.3 : 0.7;
        const segColor = isNakPlanet ? "#f7df90" : isSelected ? "#c8b0f0" : hasNatal ? "#8fb8c8" : "#3a4a5c";
        const fillOpacity = active ? 0.72 : alwaysVisible ? (hasNatal ? 0.38 : 0.10) : (hasNatal ? 0.18 : 0.05);

        return (
          <group key={seg.i}>
            <mesh
              geometry={wedgeGeos[seg.i]}
              position={[0, 0.02, 0]}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedNakshatra(isSelected ? null : seg.i);
              }}
            >
              <meshStandardMaterial
                color={segColor}
                emissive={segColor}
                emissiveIntensity={active ? 1.8 : hasNatal ? 0.9 : 0.3}
                transparent
                opacity={fillOpacity}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
            <Line
              points={[[seg.px, 0.18, seg.pz], [seg.px, pillarTop, seg.pz]]}
              color={segColor}
              lineWidth={active ? 2.8 : alwaysVisible ? (hasNatal ? 1.6 : 0.9) : 0.7}
              transparent
              opacity={active ? 0.95 : alwaysVisible ? (hasNatal ? 0.65 : 0.28) : 0.18}
            />
            {(active || (alwaysVisible && hasNatal)) && (
              <mesh position={[seg.px, pillarTop + 0.1, seg.pz]}>
                <sphereGeometry args={active ? [0.12, 10, 10] : [0.07, 8, 8]} />
                <meshStandardMaterial
                  color={segColor}
                  emissive={segColor}
                  emissiveIntensity={active ? 4.5 : 2}
                />
              </mesh>
            )}
          </group>
        );
      })}
      {nakIndex !== null && planet && (
        <>
          <Line
            points={[houseCenter(planet.house), [Math.cos(segments[nakIndex].mid) * 6.2, 0.18, Math.sin(segments[nakIndex].mid) * 6.2]]}
            color="#f7df90"
            lineWidth={1.6}
            transparent
            opacity={0.7}
            dashed
            dashSize={0.18}
            gapSize={0.12}
          />
          <Html
            position={[Math.cos(segments[nakIndex].mid) * 7.5, 1.8, Math.sin(segments[nakIndex].mid) * 7.5]}
            center
            style={{ pointerEvents: "none" }}
          >
            <div className="nak-tag">
              <b>{NAKS27[nakIndex]}</b>
              <span>pāda {planet.pada}</span>
            </div>
          </Html>
        </>
      )}
      {focused !== null && focused !== nakIndex && (
        <Html
          position={[Math.cos(segments[focused].mid) * 7.5, 1.8, Math.sin(segments[focused].mid) * 7.5]}
          center
          style={{ pointerEvents: "none" }}
        >
          <div className="nak-tag" style={{ borderColor: "#c8b0f088", color: "#c8b0f0" }}>
            <b>{NAKS27[focused]}</b>
            <span>señor: {NAKS_LORDS[focused]}</span>
            {naksWithPlanets.has(focused) && <small>{naksWithPlanets.get(focused)!.join(", ")}</small>}
          </div>
        </Html>
      )}
    </group>
  );
}

function SelectedPlanetBeam({ chart }: { chart?: ChartData }) {
  const selectedBody = useChartStore((s) => s.selectedBody);
  const planet = chart?.planets.find((p) => p.name === selectedBody);
  if (!planet) return null;
  const [x, , z] = houseCenter(planet.house);
  const color = PLANET_COLORS[planet.name] ?? "#f5e4a2";
  return (
    <group>
      <Line
        points={[[x, 0.04, z], [x, 1.6, z]]}
        color={color}
        lineWidth={2.2}
        transparent
        opacity={0.8}
      />
      <mesh position={[x, 0.04, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.32, 0.46, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function RasiAtmosphere({ chart, activeStage }: { chart?: ChartData; activeStage: StageId }) {
  const selectedBody = useChartStore((s) => s.selectedBody);
  if (!chart || !["rasis", "nakshatras", "gochara"].includes(activeStage)) return null;
  const selectedPlanet = chart.planets.find((planet) => planet.name === selectedBody);
  const activeRasi = selectedPlanet?.rasi ?? chart.lagnaRasi;

  return (
    <group position={[0, -0.02, 0]}>
      {NORTH_BHV.map((house) => {
        const rasiIdx = (chart.lagnaRasi + house.n - 1) % 12;
        const active = rasiIdx === activeRasi;
        const element = rasiElement(rasiIdx);
        const color = ELEMENT_COLORS[element].replace("CC", "");
        const [hx, , hz] = svgTo3D(house.cx, house.cy, 0);
        const dist = Math.sqrt(hx * hx + hz * hz);
        const nx = dist > 0.001 ? hx / dist : 0;
        const nz = dist > 0.001 ? hz / dist : 1;
        const r = active ? 7.2 : 6.8;
        return (
          <Html key={house.n} position={[nx * r, active ? 0.32 : 0.12, nz * r]} center style={{ pointerEvents: "none" }}>
            <div className={`rasi-chip ${active ? "active" : ""}`} style={{ borderColor: `${color}88`, color }}>
              <b>{RASI_SYMBOLS[rasiIdx]}</b>
              <span>{RASI_ABB[rasiIdx]}</span>
              {active && <small>{ELEMENT_LABELS[element]}</small>}
            </div>
          </Html>
        );
      })}
    </group>
  );
}

function ReadingVector({ chart, activeStage, selectedHouse }: { chart?: ChartData; activeStage: StageId; selectedHouse: number | null }) {
  const selectedBody = useChartStore((s) => s.selectedBody);
  if (!chart || activeStage === "dashas" || activeStage === "gochara") return null;
  const planet = chart.planets.find((item) => item.name === selectedBody);
  if (!planet) return null;
  const house = selectedHouse ?? planet.house;
  const planetPos = houseCenter(planet.house);
  const housePos = houseCenter(house);
  const color = PLANET_COLORS[planet.name] ?? "#f7df90";
  return (
    <Line
      points={[[planetPos[0], 1.28, planetPos[2]], [housePos[0], 0.18, housePos[2]]]}
      color={color}
      lineWidth={1.6}
      transparent
      opacity={0.55}
      dashed
      dashSize={0.12}
      gapSize={0.08}
    />
  );
}

function TransitPressure({ chart, transits }: { chart?: ChartData; transits: TransitPlanet[] | null }) {
  if (!chart || !transits?.length) return null;

  const transitByHouse: Record<number, typeof transits> = {};
  transits.slice(0, 9).forEach((tr) => {
    const rth = (rasi: number) => ((rasi - chart.lagnaRasi + 12) % 12) + 1;
    const house = rth(Math.floor(tr.lon / 30));
    if (!transitByHouse[house]) transitByHouse[house] = [];
    transitByHouse[house].push(tr);
  });

  const TRANSIT_Y = 2.5;

  return (
    <group>
      {Object.entries(transitByHouse).map(([houseStr, trs]) => {
        const house = Number(houseStr);
        const [hx, , hz] = houseCenter(house);
        return (
          <group key={`tbh-${house}`}>
            {trs.map((tr, idx) => {
              const color = PLANET_COLORS[tr.name] ?? "#87c7ba";
              const totalA = Math.max(trs.length, 1);
              const angle = (idx / totalA) * Math.PI * 2;
              const r = trs.length > 1 ? 0.32 + 0.06 * (trs.length - 1) : 0;
              const px = hx + Math.cos(angle) * r;
              const pz = hz + Math.sin(angle) * r;
              return (
                <group key={tr.name}>
                  <mesh position={[px, TRANSIT_Y, pz]}>
                    <sphereGeometry args={[0.17, 18, 18]} />
                    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3.2} transparent opacity={0.92} wireframe={false} />
                  </mesh>
                  <mesh position={[px, TRANSIT_Y, pz]}>
                    <sphereGeometry args={[0.22, 12, 12]} />
                    <meshBasicMaterial color={color} transparent opacity={0.12} wireframe />
                  </mesh>
                  <Line
                    points={[[px, TRANSIT_Y - 0.2, pz], [px, 0.12, pz]]}
                    color={color}
                    lineWidth={1.0}
                    transparent
                    opacity={0.35}
                    dashed={false}
                  />
                  <Html position={[px, TRANSIT_Y + 0.36, pz]} center style={{ pointerEvents: "none" }}>
                    <div className="planet-tag transit" style={{ borderColor: `${color}99`, color, fontSize: "0.7em", background: "rgba(5,12,8,0.82)" }}>
                      <b>{PLANET_SYMBOLS[tr.name] ?? ""}</b>
                      <span>{PLANET_ABB[tr.name] ?? tr.name}</span>
                      {tr.retro && <small style={{ opacity: 0.7 }}>R</small>}
                    </div>
                  </Html>
                </group>
              );
            })}
          </group>
        );
      })}
    </group>
  );
}

const CATEGORY_ALPHA: Record<StageId, { planets: number; houses: number }> = {
  grahas:     { planets: 1.0,  houses: 0.36 },
  rasis:      { planets: 0.85, houses: 0.50 },
  bhavas:     { planets: 0.38, houses: 1.0  },
  nakshatras: { planets: 0.55, houses: 0.26 },
  dashas:     { planets: 0.18, houses: 0.15 },
  gochara:    { planets: 0.52, houses: 0.40 },
};

const STAGE_AMBIENCE: Record<StageId, { ambient: string; dir: string; point: string; bg: string }> = {
  grahas:     { ambient: "#d9ede0", dir: "#fff1ca", point: "#e8b75b", bg: "#090b12" },
  rasis:      { ambient: "#b8e0e8", dir: "#d2f0f4", point: "#5bbfce", bg: "#070c13" },
  bhavas:     { ambient: "#c2c8e8", dir: "#d0d4f8", point: "#7888cc", bg: "#08091a" },
  nakshatras: { ambient: "#d0c0e0", dir: "#e8d8f8", point: "#b08acf", bg: "#09080f" },
  dashas:     { ambient: "#b0c0e0", dir: "#c8d8f8", point: "#5890c8", bg: "#060a14" },
  gochara:    { ambient: "#c8e0c8", dir: "#d8f8d8", point: "#58c878", bg: "#070f0a" },
};

function Scene3D({ apiData, transits, activeStage, showTransits, selectedHouse, setSelectedHouse, selectedNakshatra, setSelectedNakshatra }: {
  apiData: ApiResponse | null;
  transits: TransitPlanet[] | null;
  activeStage: StageId;
  showTransits: boolean;
  selectedHouse: number | null;
  setSelectedHouse: (house: number | null) => void;
  selectedNakshatra: number | null;
  setSelectedNakshatra: (n: number | null) => void;
}) {
  const stage = STAGES.find((item) => item.id === activeStage) ?? STAGES[0];
  const chart = apiData?.chart;
  const amb = STAGE_AMBIENCE[activeStage];
  const catAlpha = CATEGORY_ALPHA[activeStage];

  const occupantMap = useMemo(() => {
    const byHouse: Record<number, string[]> = {};
    chart?.planets.forEach((p) => {
      if (!byHouse[p.house]) byHouse[p.house] = [];
      byHouse[p.house].push(p.name);
    });
    return byHouse;
  }, [chart]);

  return (
    <>
      <color attach="background" args={[amb.bg]} />
      <fog attach="fog" args={[amb.bg, 16, 42]} />
      <Stars radius={58} depth={48} count={2600} factor={4} saturation={0.15} fade speed={0.18} />
      <ambientLight intensity={0.36} color={amb.ambient} />
      <directionalLight position={[6, 10, 8]} intensity={1.9} color={amb.dir} />
      <pointLight position={[0, 2, 0]} intensity={1.1} color={amb.point} distance={18} />
      <CameraGuide stage={stage} />
      <group scale={1.0} position={[0, 0, 0]}>
        <RasiAtmosphere chart={chart} activeStage={activeStage} />
        <DiamondChart chart={chart} activeStage={activeStage} selectedHouse={selectedHouse} setSelectedHouse={setSelectedHouse} houseAlpha={catAlpha.houses} />
        {chart?.planets.map((planet) => {
          const total = occupantMap[planet.house]?.length ?? 1;
          const idx = occupantMap[planet.house]?.indexOf(planet.name) ?? 0;
          return <PlanetAvatar key={planet.name} planet={planet} activeStage={activeStage} occupantIdx={idx} totalInHouse={total} alpha={catAlpha.planets} />;
        })}
        {showTransits && activeStage === "gochara" && <TransitPressure chart={chart} transits={transits} />}
        {activeStage === "dashas" && <DashaWheel apiData={apiData} />}
        {activeStage === "nakshatras" && <NakshatraRing chart={chart} activeStage={activeStage} selectedNakshatra={selectedNakshatra} setSelectedNakshatra={setSelectedNakshatra} />}
        <ReadingVector chart={chart} activeStage={activeStage} selectedHouse={selectedHouse} />
        {(activeStage === "grahas" || activeStage === "rasis") && <SelectedPlanetBeam chart={chart} />}
      </group>
      <EffectComposer>
        <Bloom luminanceThreshold={0.28} luminanceSmoothing={0.85} intensity={0.52} />
      </EffectComposer>
    </>
  );
}

function CitySearch({ onSelect }: { onSelect: (lat: number, lng: number, tz: number, name: string) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ name: string; lat: number; lng: number }[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (query.length < 3) {
      setResults([]);
      return;
    }
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search-city?q=${encodeURIComponent(query)}`, { headers: { Accept: "application/json" } });
        setResults(await res.json());
      } catch {
        setResults([]);
      }
    }, 350);
  }, [query]);

  return (
    <div className="city-search">
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar ciudad" />
      {results.length > 0 && (
        <div className="city-results">
          {results.map((result) => (
            <button
              key={`${result.name}-${result.lat}-${result.lng}`}
              onClick={async () => {
                setQuery(result.name);
                setResults([]);
                try {
                  const tz = await fetch(`/api/timezone?lat=${result.lat}&lng=${result.lng}`, { headers: { Accept: "application/json" } });
                  const tzData = await tz.json();
                  onSelect(result.lat, result.lng, tzData.offset ?? 0, result.name);
                } catch {
                  onSelect(result.lat, result.lng, 0, result.name);
                }
              }}
            >
              {result.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ChartForm() {
  const { birthInput, setBirthInput, setApiData, setTransits, setIsLoading, setHasSubmitted, isLoading } = useChartStore();
  const [error, setError] = useState("");

  const submit = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [year, month, day] = birthInput.date.split("-").map(Number);
      const [hours, minutes] = birthInput.time.split(":").map(Number);
      const params = new URLSearchParams({
        year: String(year),
        month: String(month),
        day: String(day),
        hour: String(hours + minutes / 60),
        offset: String(birthInput.utcOffset),
        lat: String(birthInput.lat),
        lng: String(birthInput.lng),
      });
      const [chartRes, transitRes] = await Promise.all([
        fetch(`/api/calculate?${params}`, { headers: { Accept: "application/json" } }),
        fetch("/api/transits", { headers: { Accept: "application/json" } }),
      ]);
      const chartData: ApiResponse = await chartRes.json();
      const transitData = await transitRes.json();
      if ((chartData as { error?: string }).error) throw new Error((chartData as { error: string }).error);
      setApiData(chartData);
      setTransits(transitData.transits ?? []);
      setHasSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al calcular la carta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="intro-screen">
      <div className="intro-map" />
      <section className="birth-console">
        <p className="kicker">mapa jyotish guiado</p>
        <h1>Brahmāṇḍa</h1>
        <p className="intro-copy">Ingresa tus datos de nacimiento y recorre las seis capas de la carta sin perderte en tablas.</p>
        <div className="form-grid">
          {([
            ["Fecha de nacimiento", "date", "date", birthInput.date],
            ["Hora de nacimiento", "time", "time", birthInput.time],
          ] as [string, string, BirthField, string][]).map(([label, type, key, value]) => (
            <label key={key}>
              <span>{label}</span>
              <input type={type} value={value} onChange={(e) => setBirthInput({ [key]: e.target.value })} />
            </label>
          ))}
          <label className="place-field">
            <span>Lugar de nacimiento</span>
            <CitySearch onSelect={(lat, lng, utcOffset, placeName) => setBirthInput({ lat, lng, utcOffset, placeName })} />
          </label>
        </div>
        {birthInput.placeName && (
          <div className="place-readout">
            {birthInput.placeName} · {birthInput.lat.toFixed(2)}, {birthInput.lng.toFixed(2)} · UTC{birthInput.utcOffset >= 0 ? "+" : ""}{birthInput.utcOffset}
          </div>
        )}
        {error && <div className="form-error">{error}</div>}
        <button className="primary-action" disabled={isLoading} onClick={submit}>{isLoading ? "Calculando..." : "Entrar a la carta"}</button>
        <SavedChartsPanel onLoad={(bi) => { setBirthInput(bi); }} onSubmit={submit} />
      </section>
    </div>
  );
}

function SavedChartsPanel({ onLoad, onSubmit }: { onLoad: (bi: BirthInput) => void; onSubmit: () => void }) {
  const { savedCharts, deleteChart } = useChartStore();
  if (!savedCharts.length) return null;
  return (
    <div className="saved-charts">
      <p className="kicker" style={{ marginTop: "1.5rem" }}>Cartas guardadas</p>
      <ul className="saved-list">
        {savedCharts.map((c: SavedChart) => (
          <li key={c.id} className="saved-item">
            <button className="saved-load-btn" onClick={() => { onLoad(c.birthInput); setTimeout(onSubmit, 0); }}>
              <span className="saved-name">{c.name}</span>
              <span className="saved-meta">{c.birthInput.date} · {c.birthInput.placeName}</span>
            </button>
            <button className="saved-del-btn" onClick={() => deleteChart(c.id)} title="Eliminar">✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function isStageComplete(stage: StageId, ctx: { selectedBody: string | null; selectedHouse: number | null; showTransits: boolean }): boolean {
  if (stage === "grahas") return ctx.selectedBody !== null;
  if (stage === "rasis") return ctx.selectedBody !== null;
  if (stage === "bhavas") return ctx.selectedHouse !== null;
  if (stage === "nakshatras") return ctx.selectedBody !== null;
  if (stage === "dashas") return true;
  if (stage === "gochara") return ctx.showTransits;
  return false;
}

function MissionPanel({ activeStage, setActiveStage, selectedHouse }: {
  activeStage: StageId;
  setActiveStage: (stage: StageId) => void;
  selectedHouse: number | null;
}) {
  const { apiData, selectedBody, setSelectedBody, showTransits, toggleTransits, setHasSubmitted, triggerCameraReset } = useChartStore();
  const stageIndex = STAGES.findIndex((item) => item.id === activeStage);
  const stage = STAGES[stageIndex] ?? STAGES[0];
  const chart = apiData?.chart;
  const selectedPlanet = chart?.planets.find((planet) => planet.name === selectedBody) ?? null;
  const houseInfo = selectedHouse ? HOUSE_MEANINGS[selectedHouse] : null;
  const { maha, antar } = getCurrentDasha(apiData);
  const stageDone = isStageComplete(activeStage, { selectedBody, selectedHouse, showTransits });
  const lexicon = STAGE_LEXICON[activeStage];

  const goNext = () => {
    const next = Math.min(STAGES.length - 1, stageIndex + 1);
    setActiveStage(STAGES[next].id);
  };

  const goPrev = () => {
    const prev = Math.max(0, stageIndex - 1);
    setActiveStage(STAGES[prev].id);
  };

  const jumpToStage = (stageId: StageId) => {
    setActiveStage(stageId);
  };

  return (
    <aside className="mission-panel" data-stage={activeStage}>
      <div className="brand-row">
        <div>
          <p className="kicker">capa {stageIndex + 1} de {STAGES.length}</p>
          <h2>{stage.title}</h2>
        </div>
        <button className="icon-button" onClick={() => setHasSubmitted(false)} title="Nueva carta">↺</button>
      </div>
      <p className="stage-action">{stage.action}</p>
      <p className="stage-note">{stage.note}</p>
      <div className="causal-prism">
        <span>{lexicon.frame}</span>
        <b>{lexicon.key}</b>
        <small>{lexicon.trap}</small>
      </div>
      <div className="stage-track">
        {STAGES.map((item, index) => (
          <button
            key={item.id}
            className={item.id === activeStage ? "active" : ""}
            onClick={() => jumpToStage(item.id)}
            title={item.label}
          >
            <span>{index + 1}</span>
            {item.label}
          </button>
        ))}
      </div>
      <div className={`stage-hint ${stageDone ? "done" : ""}`}>
        <span className="dot" />
        <span>{stageDone ? "Listo. Avanza a la siguiente capa." : stage.hint}</span>
      </div>
      {(selectedPlanet || houseInfo) && (
        <div className="mission-card focused">
          <span className="card-label">Enfoque</span>
          {selectedPlanet ? (
            <>
              <h3 style={{ color: PLANET_COLORS[selectedPlanet.name] ?? "#f5e4a2" }}>{PLANET_SYMBOLS[selectedPlanet.name]} {selectedPlanet.name}</h3>
              <p>{RASI_NAMES[selectedPlanet.rasi]} {fmtDeg(selectedPlanet.lon)} · casa {selectedPlanet.house}</p>
              <p>{selectedPlanet.nak}, pāda {selectedPlanet.pada} · {selectedPlanet.dign ? DIGN_LABEL[selectedPlanet.dign] ?? selectedPlanet.dign : "dignidad neutral"}</p>
            </>
          ) : houseInfo ? (
            <>
              <h3>Casa {selectedHouse}: {houseInfo.sanskrit}</h3>
              <p>{houseInfo.plain}</p>
              <p>Ambiente: {houseInfo.scene}</p>
            </>
          ) : null}
        </div>
      )}
      <div className="control-row">
        <button className="nav-arrow" onClick={goPrev} disabled={stageIndex === 0} title="Capa anterior ([)">←</button>
        <button className={`transit-btn ${showTransits ? "active" : ""}`} onClick={toggleTransits} title="Activar tránsitos actuales">Tránsitos</button>
        <button className="nav-arrow center-btn" onClick={() => triggerCameraReset()} title="Centrar cámara (C)">⊙</button>
        <button className="nav-arrow" onClick={goNext} disabled={stageIndex === STAGES.length - 1} title="Siguiente capa (])">→</button>
      </div>
      <p className="kbd-hint">Flechas: orbitar · [ ]: capas · C: centrar</p>
      <div className="planet-roster">
        {chart?.planets.map((planet) => {
          const color = DIGNITY_COL[planet.dign] ?? PLANET_COLORS[planet.name] ?? "#f5e4a2";
          return (
            <button
              key={planet.name}
              className={selectedBody === planet.name ? "active" : ""}
              style={{ borderColor: `${color}66`, color }}
              onClick={() => setSelectedBody(planet.name)}
            >
              {PLANET_SYMBOLS[planet.name]} {PLANET_ABB[planet.name] ?? planet.name}
            </button>
          );
        })}
      </div>
      {(activeStage === "dashas" || activeStage === "gochara") && (
        <div className="mission-card timing">
          <span className="card-label">Capa de tiempo</span>
          <h3>{maha ? `${PLANET_SYMBOLS[maha.lord] ?? ""} ${maha.lord} mahādaśā` : "Sin daśā"}</h3>
          <p>{maha ? `${jdToDate(maha.sjd)} al ${jdToDate(maha.ejd)}` : "Calcula la carta para ver el timeline."}</p>
          {antar && <p>Antardaśā: {antar.lord}, hasta {jdToDate(antar.ejd)}</p>}
        </div>
      )}
    </aside>
  );
}

function TopReadout() {
  const { apiData, birthInput, saveChart, setHasSubmitted } = useChartStore();
  const panchanga = apiData?.panchanga;
  const [saving, setSaving] = useState(false);
  const [saveName, setSaveName] = useState("");

  const openSave = () => { setSaveName(birthInput.placeName || "Mi carta"); setSaving(true); };
  const confirmSave = () => {
    if (saveName.trim()) saveChart(saveName.trim());
    setSaving(false);
  };

  return (
    <header className="top-readout">
      <div className="top-readout-info">
        <b>{apiData?.chart ? `${RASI_NAMES[apiData.chart.lagnaRasi]} Lagna` : "Jyotish 3D"}</b>
        <span>{birthInput.date} · {birthInput.placeName}</span>
      </div>
      {panchanga && (
        <div className="panchanga-strip">
          <span>Tithi {panchanga.tithi}</span>
          <span>Nakṣatra {panchanga.nakshatra}</span>
          <span>Yoga {panchanga.yoga}</span>
        </div>
      )}
      <div className="top-readout-actions">
        {saving ? (
          <div className="save-inline">
            <input className="save-name-input" value={saveName} onChange={(e) => setSaveName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && confirmSave()} autoFocus placeholder="Nombre de la carta" />
            <button className="save-confirm-btn" onClick={confirmSave}>Guardar</button>
            <button className="save-cancel-btn" onClick={() => setSaving(false)}>✕</button>
          </div>
        ) : (
          <>
            <button className="save-chart-btn" onClick={openSave} title="Guardar carta">Guardar</button>
            <button className="back-btn" onClick={() => setHasSubmitted(false)} title="Nueva carta">Nueva carta</button>
          </>
        )}
      </div>
    </header>
  );
}

const DIGNITY_LEGEND = [
  { key: "exalt", label: "Exaltado (uchcha)", color: "#f7df90", badge: "E" },
  { key: "debil", label: "Debilitado (neecha)", color: "#f1896d", badge: "D" },
  { key: "own",   label: "Signo propio (sva)", color: "#8fb8c8", badge: "P" },
  { key: "comb",  label: "Combusto (asta)", color: "#f3a24f", badge: "C" },
];

function DataDrawer({ activeStage, selectedHouse, selectedNakshatra }: { activeStage: StageId; selectedHouse: number | null; selectedNakshatra: number | null }) {
  const { apiData, transits, selectedBody } = useChartStore();
  const chart = apiData?.chart;
  if (!chart) return null;
  if (activeStage === "rasis" && !selectedBody) return null;
  if (activeStage === "bhavas" && !selectedHouse) return null;
  if (activeStage === "nakshatras" && !selectedBody && selectedNakshatra === null) return null;
  const selectedPlanet = chart.planets.find((planet) => planet.name === selectedBody) ?? chart.planets.find((planet) => planet.name === "Candra") ?? chart.planets[0];

  if (activeStage === "grahas") {
    const explicitPlanet = selectedBody ? chart.planets.find((p) => p.name === selectedBody) : null;
    return (
      <section className="data-drawer compact">
        <h3>Dignidad</h3>
        <div className="dignity-legend">
          {DIGNITY_LEGEND.map((d) => (
            <div key={d.key} className="dign-legend-row">
              <i className={`dign-pip dign-${d.key}`}>{d.badge}</i>
              <span style={{ color: d.color }}>{d.label}</span>
            </div>
          ))}
        </div>
        {explicitPlanet && (
          <>
            <div className="timeline-row current">
              <b style={{ color: PLANET_COLORS[explicitPlanet.name] ?? "#f5e4a2" }}>{PLANET_SYMBOLS[explicitPlanet.name]} {explicitPlanet.name}</b>
              <span>{RASI_NAMES[explicitPlanet.rasi]} · casa {explicitPlanet.house}</span>
            </div>
            <div className="timeline-row"><b>Nakṣatra</b><span>{explicitPlanet.nak}, pāda {explicitPlanet.pada}</span></div>
            <div className="timeline-row"><b>Dignidad</b><span>{explicitPlanet.dign ? DIGN_LABEL[explicitPlanet.dign] ?? explicitPlanet.dign : "neutral"}</span></div>
            <div className="timeline-row"><b>Kāraka</b><span>{PLANET_KARAKAS[explicitPlanet.name]?.teaching ?? ""}</span></div>
          </>
        )}
      </section>
    );
  }

  if (activeStage === "dashas") {
    const dashas = apiData?.dasha?.dashas ?? [];
    return (
      <section className="data-drawer">
        <h3>Línea de tiempo: Daśās</h3>
        {dashas.slice(0, 9).map((dasha) => {
          const now = jdNow();
          const current = dasha.sjd <= now && now <= dasha.ejd;
          return (
            <div key={dasha.lord} className={`timeline-row ${current ? "current" : ""}`}>
              <b style={{ color: PLANET_COLORS[dasha.lord] ?? "#f5e4a2" }}>{PLANET_SYMBOLS[dasha.lord]} {dasha.lord}</b>
              <span>{jdToDate(dasha.sjd)} al {jdToDate(dasha.ejd)}</span>
            </div>
          );
        })}
      </section>
    );
  }

  if (activeStage === "gochara") {
    return (
      <section className="data-drawer">
        <h3>Tránsitos activos</h3>
        {(transits ?? []).slice(0, 9).map((planet) => {
          const natal = chart.planets.find((p) => p.rasi === planet.rasi);
          const transitHouse = ((planet.rasi - chart.lagnaRasi + 12) % 12) + 1;
          return (
            <div key={planet.name} className="timeline-row">
              <b style={{ color: PLANET_COLORS[planet.name] ?? "#f5e4a2" }}>{PLANET_SYMBOLS[planet.name]} {planet.name}</b>
              <span>{RASI_NAMES[planet.rasi]} {fmtDeg(planet.lon)}{planet.retro ? " R" : ""} · casa {transitHouse}{natal ? ` · sobre ${natal.name}` : ""}</span>
            </div>
          );
        })}
      </section>
    );
  }

  if (activeStage === "nakshatras") {
    const nak = selectedNakshatra ?? (selectedPlanet ? Math.floor(selectedPlanet.lon / (360 / 27)) : null);
    const planetsInNak = nak !== null
      ? chart.planets.filter((p) => Math.floor(p.lon / (360 / 27)) === nak)
      : [];
    return (
      <section className="data-drawer compact">
        <h3>Nakṣatra</h3>
        {nak !== null ? (
          <>
            <div className="timeline-row current">
              <b style={{ color: "#f7df90" }}>{NAKS27[nak]}</b>
              <span>señor: {NAKS_LORDS[nak]}</span>
            </div>
            {planetsInNak.map((p) => (
              <div key={p.name} className="timeline-row">
                <b style={{ color: PLANET_COLORS[p.name] ?? "#f5e4a2" }}>{PLANET_SYMBOLS[p.name]} {p.name}</b>
                <span>pāda {p.pada} · {p.dign ? DIGN_LABEL[p.dign] ?? p.dign : "neutral"}</span>
              </div>
            ))}
            {planetsInNak.length === 0 && (
              <div className="timeline-row"><span>Sin planetas natales en esta mansión</span></div>
            )}
            <div className="timeline-row"><small>Haz clic en otro segmento del anillo para explorar</small></div>
          </>
        ) : (
          <div className="timeline-row"><span>Selecciona un planeta o un segmento del anillo</span></div>
        )}
      </section>
    );
  }

  return (
    <section className="data-drawer compact">
      <h3>{activeStage === "bhavas" ? "Vocabulario de casas" : "Detalle del planeta"}</h3>
      {activeStage === "bhavas" ? NORTH_BHV.slice(0, 12).map((house) => (
        <div key={house.n} className="timeline-row">
          <b>{house.n}. {HOUSE_MEANINGS[house.n].sanskrit}</b>
          <span>{HOUSE_MEANINGS[house.n].plain}</span>
        </div>
      )) : selectedPlanet && (
        <>
          <div className="timeline-row current"><b>{selectedPlanet.name}</b><span>{RASI_NAMES[selectedPlanet.rasi]} · casa {selectedPlanet.house}</span></div>
          <div className="timeline-row"><b>Nakṣatra</b><span>{selectedPlanet.nak}, pāda {selectedPlanet.pada}</span></div>
          <div className="timeline-row"><b>Longitud</b><span>{selectedPlanet.lon.toFixed(4)}°</span></div>
          <div className="timeline-row"><b>Dignidad</b><span>{selectedPlanet.dign ? DIGN_LABEL[selectedPlanet.dign] ?? selectedPlanet.dign : "neutral"}</span></div>
        </>
      )}
    </section>
  );
}

function LoadingOverlay() {
  const isLoading = useChartStore((s) => s.isLoading);
  if (!isLoading) return null;
  return (
    <div className="loading-overlay">
      <div className="loading-orbit" />
      <span>Calculando carta</span>
    </div>
  );
}

export default function App() {
  const { apiData, transits, hasSubmitted, showTransits, selectedBody, setBirthInput, setApiData, setTransits, setIsLoading, setHasSubmitted } = useChartStore();
  const [activeStage, setActiveStage] = useState<StageId>("grahas");
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const [selectedNakshatra, setSelectedNakshatra] = useState<number | null>(null);

  // Auto-calculate from URL params (deep link from jyotish-app)
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const date = sp.get("date");
    const time = sp.get("time");
    const lat = sp.get("lat");
    const lng = sp.get("lng");
    const utcOffset = sp.get("utcOffset");
    const placeName = sp.get("place");
    if (!date || !lat || !lng) return;
    const bi = {
      date,
      time: time ?? "12:00",
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      utcOffset: parseFloat(utcOffset ?? "0"),
      placeName: placeName ?? "",
    };
    setBirthInput(bi);
    (async () => {
      setIsLoading(true);
      try {
        const [year, month, day] = date.split("-").map(Number);
        const [hours, minutes] = (time ?? "12:00").split(":").map(Number);
        const params = new URLSearchParams({
          year: String(year), month: String(month), day: String(day),
          hour: String(hours + minutes / 60),
          offset: String(bi.utcOffset), lat: String(bi.lat), lng: String(bi.lng),
        });
        const [chartRes, transitRes] = await Promise.all([
          fetch(`/api/calculate?${params}`, { headers: { Accept: "application/json" } }),
          fetch("/api/transits", { headers: { Accept: "application/json" } }),
        ]);
        const chartData: ApiResponse = await chartRes.json();
        const transitData = await transitRes.json();
        if ((chartData as { error?: string }).error) return;
        setApiData(chartData);
        setTransits(transitData.transits ?? []);
        setHasSubmitted(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!hasSubmitted) {
      setActiveStage("grahas");
      setSelectedHouse(null);
      setSelectedNakshatra(null);
    }
  }, [hasSubmitted]);

  useEffect(() => {
    setSelectedNakshatra(null);
  }, [activeStage]);

  useEffect(() => {
    if (!hasSubmitted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "]") {
        setActiveStage((current) => {
          const idx = STAGES.findIndex((s) => s.id === current);
          return STAGES[Math.min(STAGES.length - 1, idx + 1)].id;
        });
      } else if (e.key === "[") {
        setActiveStage((current) => {
          const idx = STAGES.findIndex((s) => s.id === current);
          return STAGES[Math.max(0, idx - 1)].id;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hasSubmitted]);

  return (
    <main className="jyotish-game-shell" data-stage={activeStage}>
      {hasSubmitted && (
        <div className="canvas-stage">
          <SceneErrorBoundary>
            <Canvas
              camera={{ position: [0, 5.5, 7], fov: 50, near: 0.1, far: 160 }}
              gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
              dpr={[1, 1.5]}
              onCreated={({ gl }) => gl.setClearColor("#080911")}
            >
              <Scene3D
                apiData={apiData}
                transits={transits}
                activeStage={activeStage}
                showTransits={showTransits}
                selectedHouse={selectedHouse}
                setSelectedHouse={setSelectedHouse}
                selectedNakshatra={selectedNakshatra}
                setSelectedNakshatra={setSelectedNakshatra}
              />
            </Canvas>
          </SceneErrorBoundary>
        </div>
      )}
      {!hasSubmitted && <ChartForm />}
      {hasSubmitted && (
        <>
          <TopReadout />
          <MissionPanel
            activeStage={activeStage}
            setActiveStage={setActiveStage}
            selectedHouse={selectedHouse}
          />
          <DataDrawer activeStage={activeStage} selectedHouse={selectedHouse} selectedNakshatra={selectedNakshatra} />
        </>
      )}
      <LoadingOverlay />
    </main>
  );
}
