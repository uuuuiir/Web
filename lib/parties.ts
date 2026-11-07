export type Party = {
  slug: string
  short: string
  name: string
  color: string
  /** Color del texto sobre el color del partido */
  fg: string
  /** Posición en el eje ideológico: -100 (izquierda) a +100 (derecha) */
  position: number
  leader: string
  /** Solo cuando el nombre no es el de un líder orgánico, p. ej. una candidata */
  leaderRole?: string
  founded: string
  scope: string
  ideology: string[]
  summary: string
  priorities: string[]
  /** Escaños obtenidos el 23J de 2023 (Podemos concurrió dentro de Sumar) */
  seats2023: number | null
  pct2023: number | null
  note?: string
}

export const parties: Party[] = [
  {
    slug: 'podemos',
    short: 'PODEMOS',
    name: 'Podemos',
    color: '#6B2D8B',
    fg: '#FFFFFF',
    position: -82,
    leader: 'Irene Montero',
    founded: '2014',
    scope: 'Estatal',
    ideology: ['Izquierda', 'Populismo de izquierda', 'Feminismo'],
    summary:
      'Partido nacido del movimiento 15M. Defiende una agenda de redistribución, vivienda pública y ampliación de derechos sociales. Concurrió dentro de Sumar en 2023 y después se integró en el Grupo Mixto.',
    priorities: [
      'Control de los precios del alquiler y más vivienda pública',
      'Mayor tributación a las grandes fortunas y empresas',
      'Refuerzo de los servicios públicos de sanidad y educación',
    ],
    seats2023: null,
    pct2023: null,
    note: 'En 2023 se presentó dentro de la coalición Sumar, por lo que no tiene resultado propio. Ahora concurre por separado de Frente Amplio.',
  },
  {
    slug: 'eh-bildu',
    short: 'BILDU',
    name: 'EH Bildu',
    color: '#B3C300',
    fg: '#1B2200',
    position: -70,
    leader: 'Oskar Matute',
    founded: '2011',
    scope: 'País Vasco y Navarra',
    ideology: ['Izquierda soberanista', 'Independentismo vasco', 'Socialdemocracia'],
    summary:
      'Coalición de izquierda independentista vasca. Combina una agenda social con la defensa del derecho a decidir y un mayor autogobierno para Euskal Herria.',
    priorities: [
      'Ampliación del autogobierno y derecho a decidir',
      'Políticas de vivienda y salarios dignos',
      'Transferencia de competencias pendientes al País Vasco y Navarra',
    ],
    seats2023: 6,
    pct2023: 1.36,
  },
  {
    slug: 'bng',
    short: 'BNG',
    name: 'Bloque Nacionalista Galego',
    color: '#69B7E6',
    fg: '#06243A',
    position: -60,
    leader: 'Néstor Rego',
    founded: '1982',
    scope: 'Galicia',
    ideology: ['Izquierda', 'Nacionalismo gallego', 'Ecologismo'],
    summary:
      'Frente nacionalista de izquierda de Galicia. Prioriza la defensa de los intereses gallegos, la lengua propia y un modelo económico con más peso del sector público.',
    priorities: [
      'Mejora de infraestructuras y conexiones ferroviarias en Galicia',
      'Defensa de la lengua y la cultura gallegas',
      'Protección del sector primario y de la industria gallega',
    ],
    seats2023: 1,
    pct2023: 0.61,
  },
  {
    slug: 'frente-amplio',
    short: 'F. AMPLIO',
    name: 'Frente Amplio',
    color: '#E5007D',
    fg: '#FFFFFF',
    position: -52,
    leader: 'Ada Colau',
    leaderRole: 'Candidata',
    founded: '2026',
    scope: 'Estatal',
    ideology: ['Izquierda', 'Ecologismo', 'Progresismo'],
    summary:
      'Coalición formada por Movimiento Sumar, Izquierda Unida, Más Madrid y Catalunya en Comú para concurrir a las generales, con Ada Colau como candidata a la Presidencia del Gobierno. Recoge el espacio de Sumar a la izquierda del PSOE; Podemos concurre por separado.',
    priorities: [
      'Reducción de la jornada laboral y subida del salario mínimo',
      'Transición ecológica y energías renovables',
      'Ampliación de derechos sociales y vivienda asequible',
    ],
    seats2023: 31,
    pct2023: 12.33,
    note: 'Los 31 escaños y el 12,33% de 2023 corresponden a la coalición Sumar, que incluía a Podemos. Frente Amplio es su heredera electoral.',
  },
  {
    slug: 'erc',
    short: 'ERC',
    name: 'Esquerra Republicana de Catalunya',
    color: '#F28C00',
    fg: '#2A1500',
    position: -40,
    leader: 'Gabriel Rufián',
    founded: '1931',
    scope: 'Cataluña',
    ideology: ['Izquierda', 'Independentismo catalán', 'Republicanismo'],
    summary:
      'Partido histórico del independentismo catalán de izquierdas. Aboga por un referéndum de autodeterminación y por una financiación singular para Cataluña.',
    priorities: [
      'Financiación propia y singular para Cataluña',
      'Acuerdo para un referéndum de autodeterminación',
      'Traspaso de competencias como Rodalies',
    ],
    seats2023: 7,
    pct2023: 1.89,
  },
  {
    slug: 'psoe',
    short: 'PSOE',
    name: 'Partido Socialista Obrero Español',
    color: '#E2001A',
    fg: '#FFFFFF',
    position: -30,
    leader: 'Pedro Sánchez',
    founded: '1879',
    scope: 'Estatal',
    ideology: ['Centroizquierda', 'Socialdemocracia', 'Europeísmo'],
    summary:
      'Partido más antiguo de España y actual cabeza del Gobierno. Defiende el Estado del bienestar, la agenda europea y la ampliación de derechos civiles y laborales.',
    priorities: [
      'Mantenimiento del Estado del bienestar y las pensiones',
      'Políticas de vivienda y de transición energética',
      'Diálogo territorial y fortalecimiento europeo',
    ],
    seats2023: 121,
    pct2023: 31.7,
  },
  {
    slug: 'pnv',
    short: 'PNV',
    name: 'Partido Nacionalista Vasco',
    color: '#00843D',
    fg: '#FFFFFF',
    position: -4,
    leader: 'Maribel Vaquero',
    founded: '1895',
    scope: 'País Vasco y Navarra',
    ideology: ['Centro', 'Nacionalismo vasco', 'Democracia cristiana'],
    summary:
      'Fuerza hegemónica del País Vasco desde la Transición. Pragmático y negociador, defiende el Concierto Económico y la ampliación del autogobierno.',
    priorities: [
      'Blindaje del Concierto Económico vasco',
      'Cumplimiento del Estatuto de Gernika y traspasos pendientes',
      'Estabilidad institucional y apoyo a la industria vasca',
    ],
    seats2023: 5,
    pct2023: 1.12,
  },
  {
    slug: 'junts',
    short: 'JUNTS',
    name: 'Junts per Catalunya',
    color: '#00B8A9',
    fg: '#00201D',
    position: 8,
    leader: 'Míriam Nogueras',
    founded: '2020',
    scope: 'Cataluña',
    ideology: ['Centroderecha', 'Independentismo catalán', 'Liberalismo'],
    summary:
      'Formación independentista catalana de corte liberal-conservador. Ha condicionado su apoyo a los Gobiernos a cesiones en materia de autogobierno y financiación.',
    priorities: [
      'Amnistía y resolución del conflicto político con el Estado',
      'Competencias en inmigración y fiscalidad',
      'Impulso al catalán en las instituciones europeas',
    ],
    seats2023: 7,
    pct2023: 1.6,
  },
  {
    slug: 'cc',
    short: 'CC',
    name: 'Coalición Canaria',
    color: '#FFD21F',
    fg: '#2B2300',
    position: 16,
    leader: 'Cristina Valido',
    founded: '1993',
    scope: 'Canarias',
    ideology: ['Centro', 'Nacionalismo canario', 'Regionalismo'],
    summary:
      'Partido regionalista que defiende los intereses de las islas ante el Estado. Suele pactar con Gobiernos de distinto signo a cambio de inversiones y competencias.',
    priorities: [
      'Régimen económico y fiscal especial de Canarias',
      'Atención a la política migratoria en las islas',
      'Mayor inversión en infraestructuras y transporte insular',
    ],
    seats2023: 1,
    pct2023: 0.39,
  },
  {
    slug: 'upn',
    short: 'UPN',
    name: 'Unión del Pueblo Navarro',
    color: '#003C8F',
    fg: '#FFFFFF',
    position: 38,
    leader: 'Leticia San Martín',
    founded: '1979',
    scope: 'Navarra',
    ideology: ['Centroderecha', 'Regionalismo navarro', 'Foralismo'],
    summary:
      'Partido navarrista que defiende la identidad foral de Navarra dentro de España. Ha concurrido tradicionalmente en alianza con el PP.',
    priorities: [
      'Defensa del régimen foral navarro',
      'Rechazo a la integración de Navarra con el País Vasco',
      'Impulso a las infraestructuras y la industria navarras',
    ],
    seats2023: 1,
    pct2023: 0.17,
  },
  {
    slug: 'pp',
    short: 'PP',
    name: 'Partido Popular',
    color: '#0B6FBF',
    fg: '#FFFFFF',
    position: 46,
    leader: 'Alberto Núñez Feijóo',
    founded: '1989',
    scope: 'Estatal',
    ideology: ['Centroderecha', 'Conservadurismo liberal', 'Democracia cristiana'],
    summary:
      'Principal partido de la oposición y la fuerza con más escaños en 2023. Propone bajadas de impuestos, estabilidad institucional y una política económica de corte liberal.',
    priorities: [
      'Rebaja de impuestos y reducción del gasto superfluo',
      'Reforma de la financiación autonómica y unidad territorial',
      'Impulso a la vivienda con más suelo edificable',
    ],
    seats2023: 137,
    pct2023: 33.05,
  },
  {
    slug: 'salf',
    short: 'SALF',
    name: 'Se Acabó La Fiesta',
    color: '#232A3B',
    fg: '#FFFFFF',
    position: 64,
    leader: 'Alvise Pérez',
    founded: '2024',
    scope: 'Estatal',
    ideology: ['Derecha', 'Populismo antisistema', 'Antipolítica'],
    summary:
      'Formación surgida en 2024 que irrumpió en las elecciones europeas con un discurso contra la clase política y los privilegios institucionales. No concurrió a las generales de 2023.',
    priorities: [
      'Recorte de cargos políticos y de asesores',
      'Eliminación de privilegios de la clase política',
      'Mayor control ciudadano del gasto público',
    ],
    seats2023: null,
    pct2023: null,
    note: 'No se presentó a las elecciones generales de 2023.',
  },
  {
    slug: 'vox',
    short: 'VOX',
    name: 'VOX',
    color: '#6BB026',
    fg: '#0B1F00',
    position: 80,
    leader: 'Santiago Abascal',
    founded: '2013',
    scope: 'Estatal',
    ideology: ['Derecha', 'Conservadurismo nacional', 'Soberanismo'],
    summary:
      'Partido de derecha nacional que defiende la unidad de España, la reducción del Estado autonómico y un endurecimiento de la política migratoria.',
    priorities: [
      'Control de la inmigración y refuerzo de fronteras',
      'Recentralización de competencias autonómicas',
      'Rebaja fiscal y reducción del gasto político',
    ],
    seats2023: 33,
    pct2023: 12.39,
  },
]

export const partiesBySpectrum = [...parties].sort((a, b) => a.position - b.position)

/** Más escaños en 2023 primero; los partidos sin resultado propio van al final */
export const partiesBySeats2023 = [...parties].sort((a, b) => {
  if (a.seats2023 === null && b.seats2023 === null) return a.position - b.position
  if (a.seats2023 === null) return 1
  if (b.seats2023 === null) return -1
  return b.seats2023 - a.seats2023 || (b.pct2023 ?? 0) - (a.pct2023 ?? 0)
})

export const isStatewide = (party: Party) => party.scope === 'Estatal'
export const statewideBySeats2023 = partiesBySeats2023.filter(isStatewide)
export const regionalBySeats2023 = partiesBySeats2023.filter((p) => !isStatewide(p))

export const leaderPhoto = (party: Party) => `/leaders/${party.slug}.jpg`

export function getParty(slug: string) {
  return parties.find((p) => p.slug === slug)
}

export const ELECTION_DATE = '2026-11-29T09:00:00+01:00'
export const TOTAL_SEATS = 350
export const ABSOLUTE_MAJORITY = 176
