export type Poll = {
  id: string
  scope: 'all' | 'statewide'
  name: string
  kind: string
  fieldwork: string
  sample: string
  seats: Record<string, number>
  pct: Record<string, number>
  live?: boolean
}

/**
 * Datos ilustrativos para la maqueta. Sustituir por las cifras publicadas
 * de cada sondeo antes de usarlos como referencia real.
 */
export const polls: Poll[] = [
  {
    id: 'promedio',
    scope: 'all',
    name: 'Promedio',
    kind: 'Media de sondeos',
    fieldwork: 'Octubre 2026',
    sample: 'Agregado',
    seats: {
      pp: 128, psoe: 104, vox: 65, 'frente-amplio': 17, podemos: 5, erc: 7, junts: 7,
      'eh-bildu': 7, pnv: 5, bng: 2, cc: 1, upn: 1, salf: 1,
    },
    pct: {
      pp: 32.1, psoe: 27.0, vox: 17.5, 'frente-amplio': 6.2, podemos: 2.9, erc: 1.8, junts: 1.6,
      'eh-bildu': 1.5, pnv: 1.1, bng: 0.7, cc: 0.4, upn: 0.2, salf: 2.4,
    },
  },
  {
    id: 'sociometrica',
    scope: 'all',
    name: 'Sociométrica',
    kind: 'Encuesta privada',
    fieldwork: '19–23 oct 2026',
    sample: '1.800 entrevistas',
    seats: {
      pp: 135, psoe: 92, vox: 78, 'frente-amplio': 14, podemos: 4, erc: 6, junts: 7,
      'eh-bildu': 6, pnv: 5, bng: 1, cc: 1, upn: 1, salf: 0,
    },
    pct: {
      pp: 34.0, psoe: 24.5, vox: 20.0, 'frente-amplio': 5.0, podemos: 2.3, erc: 1.7, junts: 1.6,
      'eh-bildu': 1.4, pnv: 1.1, bng: 0.6, cc: 0.4, upn: 0.2, salf: 1.8,
    },
  },
  {
    id: '40db',
    scope: 'all',
    name: '40dB',
    kind: 'Encuesta privada',
    fieldwork: '24–27 oct 2026',
    sample: '2.000 entrevistas',
    seats: {
      pp: 120, psoe: 112, vox: 60, 'frente-amplio': 22, podemos: 6, erc: 8, junts: 7,
      'eh-bildu': 7, pnv: 5, bng: 2, cc: 1, upn: 0, salf: 0,
    },
    pct: {
      pp: 31.0, psoe: 29.5, vox: 16.0, 'frente-amplio': 7.5, podemos: 3.3, erc: 1.9, junts: 1.6,
      'eh-bildu': 1.5, pnv: 1.1, bng: 0.7, cc: 0.4, upn: 0.2, salf: 2.0,
    },
  },
  {
    id: 'gad3',
    scope: 'all',
    name: 'GAD3',
    kind: 'Encuesta privada',
    fieldwork: '13–17 oct 2026',
    sample: '1.500 entrevistas',
    seats: {
      pp: 133, psoe: 98, vox: 72, 'frente-amplio': 15, podemos: 3, erc: 6, junts: 7,
      'eh-bildu': 6, pnv: 5, bng: 1, cc: 1, upn: 1, salf: 2,
    },
    pct: {
      pp: 33.2, psoe: 26.0, vox: 19.0, 'frente-amplio': 5.4, podemos: 2.0, erc: 1.7, junts: 1.6,
      'eh-bildu': 1.4, pnv: 1.1, bng: 0.6, cc: 0.4, upn: 0.2, salf: 2.6,
    },
  },
  {
    id: 'cis',
    scope: 'all',
    name: 'CIS',
    kind: 'Encuesta pública',
    fieldwork: '1–9 oct 2026',
    sample: '4.000 entrevistas',
    seats: {
      pp: 118, psoe: 124, vox: 48, 'frente-amplio': 24, podemos: 7, erc: 8, junts: 6,
      'eh-bildu': 7, pnv: 5, bng: 2, cc: 1, upn: 0, salf: 0,
    },
    pct: {
      pp: 30.5, psoe: 32.5, vox: 14.0, 'frente-amplio': 7.8, podemos: 3.9, erc: 1.9, junts: 1.5,
      'eh-bildu': 1.5, pnv: 1.1, bng: 0.7, cc: 0.4, upn: 0.2, salf: 1.5,
    },
  },
  {
    id: 'sigma-dos',
    scope: 'statewide',
    name: 'Sigma Dos',
    kind: 'Encuesta privada · solo estatales',
    fieldwork: '20–24 oct 2026',
    sample: '1.600 entrevistas',
    seats: { pp: 131, psoe: 101, vox: 68, 'frente-amplio': 16, podemos: 4, salf: 1 },
    pct: { pp: 32.8, psoe: 26.4, vox: 18.2, 'frente-amplio': 5.6, podemos: 2.4, salf: 2.1 },
  },
  {
    id: 'nc-report',
    scope: 'statewide',
    name: 'NC Report',
    kind: 'Encuesta privada · solo estatales',
    fieldwork: '15–19 oct 2026',
    sample: '1.000 entrevistas',
    seats: { pp: 138, psoe: 96, vox: 70, 'frente-amplio': 13, podemos: 3, salf: 2 },
    pct: { pp: 34.1, psoe: 25.2, vox: 19.4, 'frente-amplio': 4.8, podemos: 2.0, salf: 2.5 },
  },
  {
    id: 'dym',
    scope: 'statewide',
    name: 'DYM',
    kind: 'Encuesta privada · solo estatales',
    fieldwork: '22–26 oct 2026',
    sample: '1.200 entrevistas',
    seats: { pp: 126, psoe: 107, vox: 62, 'frente-amplio': 18, podemos: 5, salf: 1 },
    pct: { pp: 31.5, psoe: 28.0, vox: 16.8, 'frente-amplio': 6.6, podemos: 3.0, salf: 2.0 },
  },
    {
    id: 'El Español',
    scope: 'all',
    name: 'Sociométrica',
    kind: 'Encuesta privada',
    fieldwork: '2 nov 2026',
    sample: '1.200 entrevistas',
    seats: { pp: 126, psoe: 107, vox: 62, 'frente-amplio': 18, podemos: 5, salf: 1 },
    pct: { pp: 31.5, psoe: 28.0, vox: 16.8, 'frente-amplio': 6.6, podemos: 3.0, salf: 2.0 },
  },
]
