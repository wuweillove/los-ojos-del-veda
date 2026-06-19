export const PLANET_COLORS: Record<string, string> = {
  "Sūrya":  "#FF9500",
  "Candra": "#C8D8F0",
  "Maṅgala":"#FF3B30",
  "Budha":  "#30D158",
  "Guru":   "#FFD60A",
  "Śukra":  "#FFB7D5",
  "Śani":   "#7BA7BC",
  "Rāhu":   "#9B7BC8",
  "Ketu":   "#C49A6B",
};

export const PLANET_EMISSIVE: Record<string, string> = {
  "Sūrya":  "#FF6800",
  "Candra": "#8899CC",
  "Maṅgala":"#CC0000",
  "Budha":  "#00AA44",
  "Guru":   "#BBAA00",
  "Śukra":  "#CC88AA",
  "Śani":   "#4477AA",
  "Rāhu":   "#6644AA",
  "Ketu":   "#886633",
};

export const PLANET_SIZES: Record<string, number> = {
  "Sūrya":  0.26,
  "Candra": 0.19,
  "Maṅgala":0.15,
  "Budha":  0.14,
  "Guru":   0.23,
  "Śukra":  0.16,
  "Śani":   0.21,
  "Rāhu":   0.18,
  "Ketu":   0.15,
};

export const PLANET_SYMBOLS: Record<string, string> = {
  "Sūrya": "☉", "Candra": "☽", "Maṅgala": "♂",
  "Budha": "☿", "Guru": "♃", "Śukra": "♀",
  "Śani": "♄", "Rāhu": "☊", "Ketu": "☋",
};

export const RASI_NAMES = [
  "Meṣa","Vṛṣa","Mithuna","Karkaṭa",
  "Siṃha","Kanyā","Tulā","Vṛścika",
  "Dhanus","Makara","Kumbha","Mīna",
];

export const RASI_ABBREV = [
  "Ar","Ta","Ge","Ca","Le","Vi","Li","Sc","Sg","Cp","Aq","Pi"
];

export const RASI_SYMBOLS = [
  "मेष","वृष","मिथुन","कर्क","सिंह","कन्या","तुला","वृश्चिक","धनु","मकर","कुम्भ","मीन"
];

export const ELEMENT_COLORS = {
  fire:  "#FF6B35CC",
  earth: "#8B9E6ACC",
  air:   "#6BA3BECC",
  water: "#7B89BECC",
};

export function rasiElement(rasi: number): keyof typeof ELEMENT_COLORS {
  if ([0,4,8].includes(rasi))  return "fire";
  if ([1,5,9].includes(rasi))  return "earth";
  if ([2,6,10].includes(rasi)) return "air";
  return "water";
}

export function lonTo3D(lon: number, radius: number, elevation = 0): [number, number, number] {
  const theta = -(lon * Math.PI) / 180;
  return [
    radius * Math.cos(theta),
    elevation,
    radius * Math.sin(theta),
  ];
}

export function rasiMidLon(rasi: number): number {
  return rasi * 30 + 15;
}

export const NATAL_RADIUS  = 8;
export const TRANSIT_RADIUS = 9.4;
export const RING_RADIUS    = 11;
export const HOUSE_OUTER    = 12.5;
