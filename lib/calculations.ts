// ─── Utility ─────────────────────────────────────────────────────────────────

export function mround(value: number, multiple: number): number {
  if (multiple === 0) return 0;
  return Math.round(value / multiple) * multiple;
}

export function roundUp(value: number, digits: number = 0): number {
  const factor = Math.pow(10, digits);
  return Math.ceil(value * factor) / factor;
}

// ─── Status Epilepticus ───────────────────────────────────────────────────────

export interface StatusEpilepticusResult {
  // IV Benzodiazepines
  midazolamIV: number;
  lorazepamIV: number;
  diazepamIV: number;
  // Alternative routes
  midazolamBuccalMin: number;
  midazolamBuccalMax: number;
  midazolamIntranasal: number;
  diazepamRectalAge2_5: number;
  diazepamRectalAge6_11: number;
  diazepamRectalAge12plus: number;
  // 2nd line
  phenobarbitalMin: number;
  phenobarbitalMax: number;
  phenobarbitalDilution: number;
  phenobarbitalMaxTotal: number;
  levetiracetamNeonates: number;
  levetiracetamNeonatesDilution: number;
  levetiracetamOlder: number;
  levetiracetamOlderDilution: number;
  valproicAcid: number;
  valproicAcidDilution: number;
  valproicAcid2nd: number;
  valproicAcid2ndDilution: number;
  phenytoin: number;
  phenytoinTimeMin: number;
  fosphenytoin: number;
  fosphenytoinDilution: number;
  fosphenytoinTimeMin: number;
}

export function calcStatusEpilepticus(weight: number): StatusEpilepticusResult {
  const pheno = 15 * weight;
  const phenoMax = 20 * weight;
  const phenoDilution = pheno / 10;

  const vpa = 40 * weight;
  const vpaDilution = roundUp(vpa / 50, 0);
  const vpa2nd = 20 * weight;
  const vpa2ndDilution = roundUp(vpaDilution / 2, 0);

  const phenytoin = 20 * weight;
  const fosphenytoin = 20 * weight;
  const fosphenytoinDilution = fosphenytoin / 20;

  const levNeo = 30 * weight;
  const levOlder = 60 * weight;

  return {
    midazolamIV: 0.15 * weight,
    lorazepamIV: 0.1 * weight,
    diazepamIV: 0.2 * weight,
    midazolamBuccalMin: 0.2 * weight,
    midazolamBuccalMax: 0.5 * weight,
    midazolamIntranasal: 0.2 * weight,
    diazepamRectalAge2_5: 0.5 * weight,
    diazepamRectalAge6_11: 0.3 * weight,
    diazepamRectalAge12plus: 0.2 * weight,
    phenobarbitalMin: pheno,
    phenobarbitalMax: phenoMax,
    phenobarbitalDilution: phenoDilution,
    phenobarbitalMaxTotal: 40 * weight,
    levetiracetamNeonates: levNeo,
    levetiracetamNeonatesDilution: 30,
    levetiracetamOlder: levOlder,
    levetiracetamOlderDilution: levOlder / 15,
    valproicAcid: vpa,
    valproicAcidDilution: vpaDilution,
    valproicAcid2nd: vpa2nd,
    valproicAcid2ndDilution: vpa2ndDilution,
    phenytoin,
    phenytoinTimeMin: phenytoin / 50,
    fosphenytoin,
    fosphenytoinDilution,
    fosphenytoinTimeMin: Math.round(fosphenytoin / 150),
  };
}

// ─── Infusion Rate ────────────────────────────────────────────────────────────

export type DoseUnit =
  | 'mcg/kg/min'
  | 'mg/kg/hr'
  | 'mcg/kg/hr'
  | 'mcg/kg/min_mgConc'
  | 'mg/kg/hr_mcgConc'
  | 'mL/kg/min';

export function calcInfusionRate(
  weight: number,
  dose: number,
  concentration: number,
  doseUnit: DoseUnit
): number {
  let rate = 0;
  switch (doseUnit) {
    case 'mcg/kg/min':
      rate = (dose * weight * 60) / concentration;
      break;
    case 'mg/kg/hr':
      rate = (dose * weight) / concentration;
      break;
    case 'mcg/kg/hr':
      rate = (dose * weight) / concentration;
      break;
    case 'mcg/kg/min_mgConc':
      rate = (dose * weight * 60) / (1000 * concentration);
      break;
    case 'mg/kg/hr_mcgConc':
      rate = (dose * weight) / (concentration / 1000);
      break;
    case 'mL/kg/min':
      rate = dose * weight * 60;
      break;
  }
  return mround(rate, 0.01);
}

export interface InfusionDrug {
  name: string;
  defaultConc: number;
  concUnit: string;
  defaultDose: number;
  doseUnit: DoseUnit;
  doseLabel: string;
}

export const INFUSION_DRUGS: InfusionDrug[] = [
  { name: 'Alprostadil', defaultConc: 20, concUnit: 'mcg/mL', defaultDose: 0.2, doseUnit: 'mcg/kg/min', doseLabel: 'mcg/kg/min' },
  { name: 'Aminophylline', defaultConc: 5, concUnit: 'mg/mL', defaultDose: 1, doseUnit: 'mg/kg/hr', doseLabel: 'mg/kg/hr' },
  { name: 'Atracurium', defaultConc: 5, concUnit: 'mg/mL', defaultDose: 10, doseUnit: 'mcg/kg/min_mgConc', doseLabel: 'mcg/kg/min' },
  { name: 'Calcium Gluconate', defaultConc: 100, concUnit: 'mg/mL', defaultDose: 8, doseUnit: 'mg/kg/hr', doseLabel: 'mg/kg/hr' },
  { name: 'Dexmedetomidine', defaultConc: 4, concUnit: 'mcg/mL', defaultDose: 0.3, doseUnit: 'mcg/kg/hr', doseLabel: 'mcg/kg/hr' },
  { name: 'Dobutamine', defaultConc: 4000, concUnit: 'mcg/mL', defaultDose: 2, doseUnit: 'mcg/kg/min', doseLabel: 'mcg/kg/min' },
  { name: 'Dopamine (Peripheral)', defaultConc: 3.2, concUnit: 'mg/mL', defaultDose: 2, doseUnit: 'mcg/kg/min_mgConc', doseLabel: 'mcg/kg/min' },
  { name: 'Dopamine (Central)', defaultConc: 6000, concUnit: 'mcg/mL', defaultDose: 2, doseUnit: 'mcg/kg/min', doseLabel: 'mcg/kg/min' },
  { name: 'Epinephrine', defaultConc: 50, concUnit: 'mcg/mL', defaultDose: 0.1, doseUnit: 'mcg/kg/min', doseLabel: 'mcg/kg/min' },
  { name: 'Fentanyl', defaultConc: 25, concUnit: 'mcg/mL', defaultDose: 2, doseUnit: 'mcg/kg/hr', doseLabel: 'mcg/kg/hr' },
  { name: 'Furosemide (Lasix)', defaultConc: 5, concUnit: 'mg/mL', defaultDose: 0.1, doseUnit: 'mg/kg/hr', doseLabel: 'mg/kg/hr' },
  { name: 'Fat Emulsion 20%', defaultConc: 0.2, concUnit: '-', defaultDose: 0.25, doseUnit: 'mL/kg/min', doseLabel: 'mL/kg/min' },
  { name: 'Isoproterenol', defaultConc: 64, concUnit: 'mcg/mL', defaultDose: 0.1, doseUnit: 'mcg/kg/min', doseLabel: 'mcg/kg/min' },
  { name: 'Ketamine', defaultConc: 2, concUnit: 'mg/mL', defaultDose: 5, doseUnit: 'mcg/kg/min_mgConc', doseLabel: 'mcg/kg/min' },
  { name: 'Labetalol', defaultConc: 2, concUnit: 'mg/mL', defaultDose: 0.25, doseUnit: 'mg/kg/hr', doseLabel: 'mg/kg/hr' },
  { name: 'Magnesium Sulfate', defaultConc: 50, concUnit: 'mg/mL', defaultDose: 25, doseUnit: 'mg/kg/hr', doseLabel: 'mg/kg/hr' },
  { name: 'Midazolam', defaultConc: 1000, concUnit: 'mcg/mL', defaultDose: 2, doseUnit: 'mcg/kg/min', doseLabel: 'mcg/kg/min' },
  { name: 'Milrinone', defaultConc: 200, concUnit: 'mcg/mL', defaultDose: 0.25, doseUnit: 'mcg/kg/min', doseLabel: 'mcg/kg/min' },
  { name: 'Morphine', defaultConc: 1000, concUnit: 'mcg/mL', defaultDose: 0.02, doseUnit: 'mg/kg/hr_mcgConc', doseLabel: 'mg/kg/hr' },
  { name: 'Nitroprusside', defaultConc: 200, concUnit: 'mcg/mL', defaultDose: 0.3, doseUnit: 'mcg/kg/min', doseLabel: 'mcg/kg/min' },
  { name: 'Norepinephrine', defaultConc: 64, concUnit: 'mcg/mL', defaultDose: 0.1, doseUnit: 'mcg/kg/min', doseLabel: 'mcg/kg/min' },
  { name: 'Octreotide', defaultConc: 10, concUnit: 'mcg/mL', defaultDose: 2, doseUnit: 'mcg/kg/hr', doseLabel: 'mcg/kg/hr' },
  { name: 'Phenobarbital', defaultConc: 10, concUnit: 'mg/mL', defaultDose: 0.5, doseUnit: 'mg/kg/hr', doseLabel: 'mg/kg/hr' },
  { name: 'Propofol', defaultConc: 10, concUnit: 'mg/mL', defaultDose: 2, doseUnit: 'mg/kg/hr', doseLabel: 'mg/kg/hr' },
  { name: 'Rocuronium', defaultConc: 5, concUnit: 'mg/mL', defaultDose: 7, doseUnit: 'mcg/kg/min_mgConc', doseLabel: 'mcg/kg/min' },
  { name: 'Thiopental', defaultConc: 25, concUnit: 'mg/mL', defaultDose: 2, doseUnit: 'mg/kg/hr', doseLabel: 'mg/kg/hr' },
];

// ─── Magnesium Sulfate ────────────────────────────────────────────────────────

export interface MagnesiumResult {
  totalDose: number;
  minDilution: number;
  maxDilution: number;
  infusionHours: number;
}

export function calcMagnesium(weight: number, dose: number): MagnesiumResult {
  const totalDose = weight * dose;
  const minDilution = Math.round((totalDose / 200) * 10) / 10;
  const maxDilution = Math.floor((totalDose / 60) * 10) / 10;
  const infusionHours = dose / 12.5;
  return { totalDose, minDilution, maxDilution, infusionHours };
}

// ─── Metabolic Acidosis ───────────────────────────────────────────────────────

export interface MetabolicAcidosisResult {
  fullHCO3: number;
  halfHCO3: number;
  fullBD: number;
  halfBD: number;
  maxPerDay: number;
}

export function calcMetabolicAcidosis(
  weight: number,
  hco3: number,
  baseDef: number
): MetabolicAcidosisResult {
  const rawFullHCO3 = 0.5 * weight * (24 - hco3);
  const fullHCO3 = mround(rawFullHCO3, 0.5);
  const halfHCO3 = mround(rawFullHCO3 / 2, 0.5);

  const rawFullBD = 0.3 * weight * baseDef;
  const fullBD = mround(rawFullBD, 0.5);
  const halfBD = mround(rawFullBD / 2, 0.5);

  return {
    fullHCO3,
    halfHCO3,
    fullBD,
    halfBD,
    maxPerDay: 8 * weight,
  };
}

// ─── Hypocalcemia ─────────────────────────────────────────────────────────────

export interface HypocalcemiaResult {
  // Symptomatic
  gluconate1mlKg: number;
  gluconate1mlKgDilution: number;
  gluconate2mlKg: number;
  gluconate2mlKgDilution: number;
  chloride02mlKg: number;
  // Asymptomatic unsafe — IV
  gluconateIV_mg: number;
  gluconateIV_elemCa: number;
  gluconateIV_vol: number;
  gluconateIV_dilution: number;
  chlorideIV_mg: number;
  chlorideIV_elemCa: number;
  chlorideIV_vol: number;
  chlorideIV_dilution: number;
  chlorideIV_infusionMin: number;
  // Asymptomatic safe — oral
  gluconateOral_mg: number;
  carbonateOral_mg: number;
  glubionateOral_mg: number;
  // Reference
  correctedCa: number;
  crystallizationRatio: number;
}

export function calcHypocalcemia(
  weight: number,
  glucDoseIV: number,
  chlorDoseIV: number,
  elemCaDoseOral: number,
  serumCa: number,
  albumin: number,
  serumPhosphate: number
): HypocalcemiaResult {
  const gluconateIV_mg = glucDoseIV * weight;
  const gluconateIV_elemCa = (glucDoseIV / 100) * 9.3 * weight;
  const gluconateIV_vol = gluconateIV_mg / 100;
  const gluconateIV_dilution = gluconateIV_vol * 2;

  const chlorideIV_mg = chlorDoseIV * weight;
  const chlorideIV_elemCa = (chlorDoseIV / 100) * 27.2 * weight;
  const chlorideIV_vol = chlorideIV_mg / 100;
  const chlorideIV_dilution = chlorideIV_mg / 20;
  const rawInfusion = (chlorideIV_mg / (90 * weight)) * 60;
  const chlorideIV_infusionMin = mround(rawInfusion, 5);

  const oralTotal = elemCaDoseOral * weight;
  const gluconateOral_mg = mround((oralTotal / 100) * 9.3, 1);
  const carbonateOral_mg = mround((oralTotal / 100) * 40, 1);
  const glubionateOral_mg = mround((oralTotal / 100) * 6.38, 1);

  return {
    gluconate1mlKg: weight,
    gluconate1mlKgDilution: weight * 2,
    gluconate2mlKg: weight * 2,
    gluconate2mlKgDilution: weight * 4,
    chloride02mlKg: weight * 0.2,
    gluconateIV_mg,
    gluconateIV_elemCa,
    gluconateIV_vol,
    gluconateIV_dilution,
    chlorideIV_mg,
    chlorideIV_elemCa,
    chlorideIV_vol,
    chlorideIV_dilution,
    chlorideIV_infusionMin,
    gluconateOral_mg,
    carbonateOral_mg,
    glubionateOral_mg,
    correctedCa: (40 - albumin) * 0.02 + serumCa,
    crystallizationRatio: serumCa * serumPhosphate,
  };
}

// ─── Hyponatremia ─────────────────────────────────────────────────────────────

export interface HyponatremiaResult {
  symptomaticVol: number;
  asymptomaticMEq: number;
  asymptomaticVol: number;
  deltaNa: number;
}

export function calcHyponatremia(
  weight: number,
  dose3pct: number,
  currentNa: number,
  desiredNa: number
): HyponatremiaResult {
  const deltaNa = desiredNa - currentNa;
  const asymptomaticMEq = weight * deltaNa * 0.6;
  const asymptomaticVol = asymptomaticMEq * 2;
  return {
    symptomaticVol: weight * dose3pct,
    asymptomaticMEq,
    asymptomaticVol,
    deltaNa,
  };
}

// ─── Hypokalemia ─────────────────────────────────────────────────────────────

export interface HypokalemiaRow {
  kLevel: string;
  dosePerKg: number;
  rawDose: number;
  roundedDose: number;
  volumeKCl: number;
  dilution: number;
  hours: number;
}

export function calcHypokalemia(weight: number, concentration: number): HypokalemiaRow[] {
  const levels = [
    { kLevel: '3.5 – 4 mEq/L', dosePerKg: 0.25, hours: 1 },
    { kLevel: '3 – 3.5 mEq/L', dosePerKg: 0.5, hours: 2 },
    { kLevel: '2.5 – 3 mEq/L', dosePerKg: 0.75, hours: 3 },
    { kLevel: '< 2.5 mEq/L', dosePerKg: 1.0, hours: 4 },
  ];

  return levels.map(({ kLevel, dosePerKg, hours }) => {
    const rawDose = dosePerKg * weight;
    const roundedDose = mround(rawDose, 0.2);
    const volumeKCl = roundedDose / 2;
    const dilution = roundUp((1000 / concentration) * roundedDose, 0);
    return { kLevel, dosePerKg, rawDose, roundedDose, volumeKCl, dilution, hours };
  });
}

// ─── Hypophosphatemia ─────────────────────────────────────────────────────────

export interface PhosphateDoseRow {
  dosePerKg: number;
  phosphateMmol: number;
  kpo4_ml: number;
  kpo4_rounded: number;
  kContent: number;
  kDilution: number;
  kPerKg: number;
  naPO4_peripheral: number;
  naPO4_central: number;
  infusionHours: number;
}

export function calcHypophosphatemia(weight: number, kConc: number): PhosphateDoseRow[] {
  const doses = [0.16, 0.2, 0.3, 0.4, 0.5, 0.6];
  const timeMap: Record<number, number> = { 0.16: 1, 0.2: 2, 0.3: 3, 0.4: 6, 0.5: 6, 0.6: 6 };

  return doses.map((dosePerKg) => {
    const phosphateMmol = dosePerKg * weight;
    const kpo4_ml_raw = phosphateMmol / 3;
    const kpo4_rounded = mround(kpo4_ml_raw, 0.1);
    const kContent = kpo4_rounded * 4.4;
    const kDilution = roundUp((1000 / kConc) * kContent, 0);
    const kPerKg = mround(kContent / weight, 0.01);
    const naPO4_peripheral = phosphateMmol * 20;
    const naPO4_central = phosphateMmol * 10;
    return {
      dosePerKg,
      phosphateMmol,
      kpo4_ml: kpo4_ml_raw,
      kpo4_rounded,
      kContent,
      kDilution,
      kPerKg,
      naPO4_peripheral,
      naPO4_central,
      infusionHours: timeMap[dosePerKg],
    };
  });
}

// ─── Hyperkalemia ─────────────────────────────────────────────────────────────

export interface HyperkalemiaResult {
  caGluconate_mg: number;
  caGluconate_elemCa: number;
  caGluconate_ml: number;
  nahco3_min: number;
  nahco3_max: number;
  furosemide_min: number;
  furosemide_max: number;
  insulin_units: number;
  insulin_d25: number;
  insulin_d5w: number;
  kayexalate_g: number;
  caResonium_g: number;
}

export function calcHyperkalemia(weight: number): HyperkalemiaResult {
  return {
    caGluconate_mg: 100 * weight,
    caGluconate_elemCa: 9 * weight,
    caGluconate_ml: weight,
    nahco3_min: weight,
    nahco3_max: 2 * weight,
    furosemide_min: weight,
    furosemide_max: 2 * weight,
    insulin_units: 0.1 * weight,
    insulin_d25: 2 * weight,
    insulin_d5w: 5 * weight,
    kayexalate_g: weight,
    caResonium_g: weight,
  };
}

// ─── Appendix (BSA, BMI, eGFR, GIR) ──────────────────────────────────────────

export interface AppendixResult {
  bsa: number;
  bmi: number;
  egfr_preterm: number;
  egfr_fullterm: number;
  egfr_child: number;
  egfr_adolescent: number;
  fluidsGIR: number;
  feedingGIR: number;
  totalGIR: number;
}

export function calcAppendix(
  weight: number,
  height: number,
  length: number,
  creatinine: number,
  fluids: { dextrose: number; rate: number }[],
  feedingGlucose: number,
  feedingAmount: number,
  feedingFrequency: number
): AppendixResult {
  const bsa = Math.round(Math.sqrt((weight * height) / 3600) * 100) / 100;
  const bmi = Math.round((weight / Math.pow(height / 100, 2)) * 10) / 10;

  const egfr_preterm = Math.round(22.1 * (length / creatinine) * 1000) / 1000;
  const egfr_fullterm = Math.round(30.1 * (length / creatinine) * 1000) / 1000;
  const egfr_child = Math.round(36.5 * (length / creatinine) * 1000) / 1000;
  const egfr_adolescent = egfr_child;

  const fluidsGIR =
    Math.round(
      fluids.reduce((sum, f) => sum + (f.dextrose * f.rate * 10) / (weight * 60), 0) * 100
    ) / 100;

  let feedingGIR = 0;
  if (feedingFrequency > 0 && feedingAmount > 0 && weight > 0) {
    const dailyVolume = (24 / feedingFrequency) * feedingAmount;
    const hourlyVolume = dailyVolume / 24;
    feedingGIR = Math.round(((hourlyVolume * feedingGlucose * 10) / (weight * 60)) * 100) / 100;
  }

  return {
    bsa,
    bmi,
    egfr_preterm,
    egfr_fullterm,
    egfr_child,
    egfr_adolescent,
    fluidsGIR,
    feedingGIR,
    totalGIR: Math.round((fluidsGIR + feedingGIR) * 100) / 100,
  };
}

// ─── Solution Compatibility ───────────────────────────────────────────────────

export type CompatibilityStatus = 'C' | 'I' | 'NT' | 'V';

export interface CompatibilityEntry {
  drug: string;
  NS: CompatibilityStatus;
  D5W: CompatibilityStatus;
  D10W: CompatibilityStatus;
  D5NS: CompatibilityStatus;
  D5halfNS: CompatibilityStatus;
  LR: CompatibilityStatus;
}

export const COMPATIBILITY_DATA: CompatibilityEntry[] = [
  { drug: 'Alprostadil', NS: 'C', D5W: 'C', D10W: 'NT', D5NS: 'NT', D5halfNS: 'NT', LR: 'NT' },
  { drug: 'Aminophylline', NS: 'C', D5W: 'C', D10W: 'C', D5NS: 'C', D5halfNS: 'C', LR: 'C' },
  { drug: 'Atracurium', NS: 'C', D5W: 'C', D10W: 'NT', D5NS: 'NT', D5halfNS: 'C', LR: 'I' },
  { drug: 'Calcium Chloride', NS: 'C', D5W: 'C', D10W: 'C', D5NS: 'C', D5halfNS: 'C', LR: 'V' },
  { drug: 'Calcium Gluconate', NS: 'C', D5W: 'C', D10W: 'C', D5NS: 'C', D5halfNS: 'C', LR: 'C' },
  { drug: 'Dexmedetomidine', NS: 'C', D5W: 'C', D10W: 'NT', D5NS: 'NT', D5halfNS: 'NT', LR: 'NT' },
  { drug: 'Dobutamine', NS: 'C', D5W: 'C', D10W: 'C', D5NS: 'C', D5halfNS: 'C', LR: 'C' },
  { drug: 'Dopamine', NS: 'C', D5W: 'C', D10W: 'C', D5NS: 'C', D5halfNS: 'C', LR: 'C' },
  { drug: 'Epinephrine', NS: 'C', D5W: 'C', D10W: 'C', D5NS: 'C', D5halfNS: 'C', LR: 'NT' },
  { drug: 'Fentanyl', NS: 'C', D5W: 'C', D10W: 'NT', D5NS: 'NT', D5halfNS: 'NT', LR: 'NT' },
  { drug: 'Fosphenytoin', NS: 'C', D5W: 'C', D10W: 'NT', D5NS: 'NT', D5halfNS: 'NT', LR: 'NT' },
  { drug: 'Furosemide', NS: 'C', D5W: 'C', D10W: 'NT', D5NS: 'NT', D5halfNS: 'NT', LR: 'NT' },
  { drug: 'Isoproterenol', NS: 'C', D5W: 'C', D10W: 'NT', D5NS: 'NT', D5halfNS: 'NT', LR: 'NT' },
  { drug: 'Ketamine', NS: 'C', D5W: 'C', D10W: 'NT', D5NS: 'NT', D5halfNS: 'NT', LR: 'NT' },
  { drug: 'Labetalol', NS: 'C', D5W: 'C', D10W: 'NT', D5NS: 'NT', D5halfNS: 'C', LR: 'NT' },
  { drug: 'Levetiracetam (Keppra)', NS: 'C', D5W: 'C', D10W: 'NT', D5NS: 'NT', D5halfNS: 'NT', LR: 'NT' },
  { drug: 'Magnesium Sulfate', NS: 'C', D5W: 'C', D10W: 'C', D5NS: 'C', D5halfNS: 'C', LR: 'C' },
  { drug: 'Midazolam', NS: 'C', D5W: 'C', D10W: 'NT', D5NS: 'NT', D5halfNS: 'NT', LR: 'NT' },
  { drug: 'Milrinone', NS: 'C', D5W: 'C', D10W: 'NT', D5NS: 'C', D5halfNS: 'NT', LR: 'NT' },
  { drug: 'Morphine', NS: 'C', D5W: 'C', D10W: 'NT', D5NS: 'NT', D5halfNS: 'NT', LR: 'NT' },
  { drug: 'Nitroprusside', NS: 'NT', D5W: 'C', D10W: 'NT', D5NS: 'NT', D5halfNS: 'NT', LR: 'NT' },
  { drug: 'Norepinephrine', NS: 'C', D5W: 'C', D10W: 'NT', D5NS: 'NT', D5halfNS: 'NT', LR: 'NT' },
  { drug: 'Octreotide', NS: 'C', D5W: 'C', D10W: 'NT', D5NS: 'NT', D5halfNS: 'NT', LR: 'NT' },
  { drug: 'Phenobarbital', NS: 'C', D5W: 'NT', D10W: 'NT', D5NS: 'NT', D5halfNS: 'NT', LR: 'NT' },
  { drug: 'Phenytoin', NS: 'V', D5W: 'I', D10W: 'NT', D5NS: 'NT', D5halfNS: 'NT', LR: 'NT' },
  { drug: 'Potassium Chloride', NS: 'C', D5W: 'C', D10W: 'C', D5NS: 'C', D5halfNS: 'C', LR: 'C' },
  { drug: 'Potassium Phosphate', NS: 'C', D5W: 'C', D10W: 'NT', D5NS: 'NT', D5halfNS: 'NT', LR: 'NT' },
  { drug: 'Propofol', NS: 'C', D5W: 'C', D10W: 'NT', D5NS: 'NT', D5halfNS: 'NT', LR: 'NT' },
  { drug: 'Rocuronium', NS: 'C', D5W: 'C', D10W: 'NT', D5NS: 'NT', D5halfNS: 'NT', LR: 'NT' },
  { drug: 'Sodium Bicarbonate', NS: 'C', D5W: 'C', D10W: 'NT', D5NS: 'NT', D5halfNS: 'NT', LR: 'NT' },
  { drug: 'Thiopental', NS: 'C', D5W: 'C', D10W: 'NT', D5NS: 'NT', D5halfNS: 'NT', LR: 'NT' },
  { drug: 'Valproic Acid', NS: 'C', D5W: 'C', D10W: 'NT', D5NS: 'NT', D5halfNS: 'NT', LR: 'NT' },
];
