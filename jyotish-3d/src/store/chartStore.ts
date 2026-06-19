import { create } from "zustand";

export type Planet = {
  name: string;
  lon: number;
  rasi: number;
  deg: number;
  house: number;
  nak: string;
  nakIdx: number;
  pada: number;
  nav?: number;
  dign: string;
  retro: boolean;
  combust: boolean;
  speed?: number;
};

export type ChartData = {
  planets: Planet[];
  ascLon: number;
  lagnaRasi: number;
  lagnaNak: string;
  lagnaPada: number;
  houses: number[];
  aya: number;
};

export type DashaSub = {
  lord: string;
  sjd: number;
  ejd: number;
  prats: { lord: string; sjd: number; ejd: number }[];
};

export type DashaEntry = {
  lord: string;
  total: number;
  yrs: number;
  sjd: number;
  ejd: number;
  subs: DashaSub[];
};

export type AspectResult = { from: string; to: string; type: number; strength: number };
export type YogaResult   = { name: string; type: string; planets: string[]; desc: string };
export type TransitPlanet = { name: string; lon: number; rasi: number; retro: boolean };

export type Panchanga = {
  tithi: string; paksha: string; vara: string;
  nakshatra: string; pada: number; yoga: string; karana: string;
};
export type Karaka = { name: string; planet: string; deg: number };
export type Shadbala = {
  name: string; total: number; rupas: number;
  uccha: number; saptavargaja: number; dik: number;
  kala: number; chesta: number; naisargika: number;
};
export type Ashtakavarga = { planets: string[]; bindhu: number[][]; sarva: number[] };
export type Arudha = { name: string; rasi: number; house: number };
export type BB = { lon: number; rasi: number; deg: number; house: number };
export type Upagraha = { name: string; rasi: number; deg: number; house: number };
export type SpecialLagna = { abbrev: string; name: string; rasi: number; deg: number; house: number };

export type ApiResponse = {
  chart: ChartData;
  dasha: { dashas: DashaEntry[]; lord: string; bal: number };
  aspects: AspectResult[];
  yogas: YogaResult[];
  panchanga?: Panchanga;
  karakas?: Karaka[];
  shadbala?: Shadbala[];
  ashtakavarga?: Ashtakavarga;
  arudhas?: Arudha[];
  bb?: BB;
  chartPoints?: any[];
  upagrahas?: Upagraha[];
  specialLagnas?: SpecialLagna[];
};

export type BirthInput = {
  date: string;
  time: string;
  lat: number;
  lng: number;
  utcOffset: number;
  placeName: string;
};

export type SavedChart = {
  id: string;
  name: string;
  birthInput: BirthInput;
  savedAt: number;
};

const LS_KEY = "jyotish-saved-charts";

function loadSaved(): SavedChart[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function persistSaved(charts: SavedChart[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(charts));
}

const today = new Date();
const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

type Store = {
  apiData: ApiResponse | null;
  transits: TransitPlanet[] | null;
  selectedBody: string | null;
  showTransits: boolean;
  showHouseLabels: boolean;
  showDataPanel: boolean;
  flyTarget: [number, number, number] | null;
  isLoading: boolean;
  birthInput: BirthInput;
  hasSubmitted: boolean;
  resetCameraTs: number;
  savedCharts: SavedChart[];
  setApiData: (d: ApiResponse) => void;
  setTransits: (t: TransitPlanet[]) => void;
  setSelectedBody: (n: string | null) => void;
  toggleTransits: () => void;
  toggleHouseLabels: () => void;
  toggleDataPanel: () => void;
  setFlyTarget: (p: [number, number, number] | null) => void;
  setIsLoading: (v: boolean) => void;
  setBirthInput: (i: Partial<BirthInput>) => void;
  setHasSubmitted: (v: boolean) => void;
  triggerCameraReset: () => void;
  saveChart: (name: string) => void;
  deleteChart: (id: string) => void;
};

export const useChartStore = create<Store>((set, get) => ({
  apiData: null,
  transits: null,
  selectedBody: null,
  showTransits: true,
  showHouseLabels: true,
  showDataPanel: false,
  flyTarget: null,
  isLoading: false,
  hasSubmitted: false,
  resetCameraTs: 0,
  savedCharts: loadSaved(),
  birthInput: {
    date: defaultDate,
    time: "12:00",
    lat: 0,
    lng: 0,
    utcOffset: 0,
    placeName: "",
  },
  setApiData: (d) => set({ apiData: d }),
  setTransits: (t) => set({ transits: t }),
  setSelectedBody: (n) => set({ selectedBody: n }),
  toggleTransits: () => set((s) => ({ showTransits: !s.showTransits })),
  toggleHouseLabels: () => set((s) => ({ showHouseLabels: !s.showHouseLabels })),
  toggleDataPanel: () => set((s) => ({ showDataPanel: !s.showDataPanel })),
  setFlyTarget: (p) => set({ flyTarget: p }),
  setIsLoading: (v) => set({ isLoading: v }),
  setBirthInput: (i) => set((s) => ({ birthInput: { ...s.birthInput, ...i } })),
  setHasSubmitted: (v) => set({ hasSubmitted: v }),
  triggerCameraReset: () => set({ resetCameraTs: Date.now() }),
  saveChart: (name) => {
    const { birthInput, savedCharts } = get();
    const entry: SavedChart = { id: crypto.randomUUID(), name, birthInput, savedAt: Date.now() };
    const updated = [entry, ...savedCharts];
    persistSaved(updated);
    set({ savedCharts: updated });
  },
  deleteChart: (id) => {
    const updated = get().savedCharts.filter((c) => c.id !== id);
    persistSaved(updated);
    set({ savedCharts: updated });
  },
}));
