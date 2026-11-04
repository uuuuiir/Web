export type TopicId =
  | 'vivienda'
  | 'empleo'
  | 'sanidad'
  | 'pensiones'
  | 'inmigracion'
  | 'feminismo'
  | 'educacion'
  | 'clima'
  | 'territorial'

export const topics: { id: TopicId; title: string }[] = [
  { id: 'vivienda', title: 'Vivienda' },
  { id: 'empleo', title: 'Empleo y salarios' },
  { id: 'sanidad', title: 'Sanidad' },
  { id: 'pensiones', title: 'Pensiones' },
  { id: 'inmigracion', title: 'Inmigración' },
  { id: 'feminismo', title: 'Feminismo e igualdad' },
  { id: 'educacion', title: 'Educación' },
  { id: 'clima', title: 'Transición ecológica' },
  { id: 'territorial', title: 'Modelo territorial' },
]

export type TopicGroup = { label: string; parties: string[] }

/** Tipos de propuesta por tema, ordenados de izquierda a derecha. */
export const topicGroups: Record<TopicId, TopicGroup[]> = {
  vivienda: [
    { label: 'Alquileres indefinidos y mayor protección del inquilino', parties: ['frente-amplio', 'podemos'] },
    { label: 'Regulación y tope de los alquileres', parties: ['psoe', 'erc', 'eh-bildu'] },
    { label: 'Más vivienda pública y protegida', parties: ['bng', 'pnv', 'cc', 'upn'] },
    { label: 'Liberalizar suelo y estimular la oferta', parties: ['junts', 'pp', 'vox', 'salf'] },
  ],
  empleo: [
    { label: 'Reducción de jornada y subida de salarios', parties: ['frente-amplio', 'podemos', 'psoe'] },
    { label: 'Salarios y convenios propios', parties: ['erc', 'eh-bildu', 'bng'] },
    { label: 'Empleo industrial de calidad y diálogo social', parties: ['pnv', 'cc', 'upn'] },
    { label: 'Rebajar impuestos y cotizaciones a empresas y autónomos', parties: ['junts', 'pp', 'vox', 'salf'] },
  ],
  sanidad: [
    { label: 'Blindar la sanidad pública y frenar las privatizaciones', parties: ['frente-amplio', 'podemos', 'eh-bildu', 'bng'] },
    { label: 'Más inversión y atención primaria en la pública', parties: ['psoe', 'upn'] },
    { label: 'Gestión autonómica y más financiación propia', parties: ['erc', 'pnv', 'junts', 'cc'] },
    { label: 'Reducir listas de espera con eficiencia y colaboración privada', parties: ['pp', 'vox', 'salf'] },
  ],
  pensiones: [
    { label: 'Pensiones mínimas dignas y más aportación de las rentas altas', parties: ['frente-amplio', 'podemos', 'erc', 'bng'] },
    { label: 'Revalorización con el IPC y sistema público de reparto', parties: ['psoe', 'cc', 'upn'] },
    { label: 'Gestión propia de la Seguridad Social', parties: ['eh-bildu', 'pnv'] },
    { label: 'Sostenibilidad del sistema y ahorro complementario', parties: ['junts', 'pp', 'vox', 'salf'] },
  ],
  inmigracion: [
    { label: 'Regularización y vías legales de entrada', parties: ['frente-amplio', 'podemos', 'eh-bildu'] },
    { label: 'Migración regulada y acogida repartida', parties: ['psoe', 'bng'] },
    { label: 'Competencias propias en acogida e integración', parties: ['erc', 'pnv', 'junts'] },
    { label: 'Solidaridad del Estado y la UE ante la llegada a las islas', parties: ['cc'] },
    { label: 'Migración legal y ordenada ligada al empleo', parties: ['upn', 'pp'] },
    { label: 'Frenar la inmigración irregular y expulsar', parties: ['vox', 'salf'] },
  ],
  feminismo: [
    { label: 'Agenda feminista, Ministerio de Igualdad y derechos LGTBI', parties: ['frente-amplio', 'podemos'] },
    { label: 'Pacto de Estado, paridad y brecha salarial', parties: ['psoe', 'erc', 'eh-bildu', 'bng'] },
    { label: 'Igualdad y lucha contra la violencia machista', parties: ['pnv', 'junts', 'cc', 'upn', 'pp'] },
    { label: 'Sustituir la ley de violencia de género', parties: ['vox'] },
    { label: 'Sin posición desarrollada', parties: ['salf'] },
  ],
  educacion: [
    { label: 'Escuela pública, gratuita y con más becas', parties: ['frente-amplio', 'podemos', 'psoe'] },
    { label: 'Escuela pública con lengua propia', parties: ['erc', 'eh-bildu', 'pnv', 'bng', 'junts'] },
    { label: 'Más inversión y ayudas por insularidad', parties: ['cc'] },
    { label: 'Libertad de elección de centro y exigencia académica', parties: ['upn', 'pp', 'vox'] },
    { label: 'Sin posición desarrollada', parties: ['salf'] },
  ],
  clima: [
    { label: 'Acelerar las renovables y rechazar los combustibles fósiles', parties: ['frente-amplio', 'podemos'] },
    { label: 'Descarbonización con cierre escalonado de las nucleares', parties: ['psoe'] },
    { label: 'Renovables y soberanía energética propia', parties: ['erc', 'eh-bildu', 'bng'] },
    { label: 'Transición compatible con la industria', parties: ['pnv', 'junts', 'cc', 'upn'] },
    { label: 'Mantener la nuclear y evitar cargas verdes', parties: ['pp', 'vox'] },
    { label: 'Sin programa climático detallado', parties: ['salf'] },
  ],
  territorial: [
    { label: 'Plurinacionalidad y derecho a decidir', parties: ['frente-amplio', 'podemos', 'eh-bildu', 'bng'] },
    { label: 'Estado autonómico y diálogo dentro de la Constitución', parties: ['psoe'] },
    { label: 'Autodeterminación, independencia y financiación singular', parties: ['erc', 'junts'] },
    { label: 'Estatuto de Gernika y Concierto Económico', parties: ['pnv'] },
    { label: 'Régimen foral o especial dentro de España', parties: ['cc', 'upn'] },
    { label: 'Unidad de España e igualdad entre ciudadanos', parties: ['pp'] },
    { label: 'Recentralizar y reducir el aparato autonómico', parties: ['vox', 'salf'] },
  ],
}

/** Resúmenes orientativos de la posición general de cada partido. */
export const positions: Record<string, Record<TopicId, string>> = {
  pp: {
    vivienda:
      'Plantea liberar más suelo edificable, agilizar licencias y dar incentivos fiscales a la construcción y al alquiler, en lugar de intervenir los precios.',
    empleo:
      'Apuesta por rebajar impuestos y cotizaciones a empresas y autónomos para impulsar el empleo y la creación de empresas.',
    sanidad:
      'Defiende reducir las listas de espera con más personal, colaboración público-privada y mejor coordinación entre comunidades.',
    pensiones:
      'Promete garantizar las pensiones y su revalorización, con incentivos al ahorro complementario.',
    inmigracion:
      'Aboga por una migración legal y ordenada ligada al empleo, con más control de fronteras y reparto de la acogida con las comunidades.',
    feminismo:
      'Defiende la igualdad y la lucha contra la violencia de género, con foco en la conciliación y la protección de las víctimas.',
    educacion:
      'Propone un pacto de Estado educativo, libertad de elección de centro y mayor exigencia académica.',
    clima:
      'Apoya la transición energética con un mix que incluya renovables y nuclear, evitando cargas para familias e industria.',
    territorial:
      'Defiende la unidad de España y la igualdad entre ciudadanos, y rechaza los acuerdos bilaterales de financiación.',
  },
  psoe: {
    vivienda:
      'Impulsa vivienda pública y protegida, la Ley de Vivienda con zonas tensionadas y ayudas al alquiler para jóvenes.',
    empleo:
      'Defiende la subida del salario mínimo, la reforma laboral de 2021 y la reducción de la jornada a 37,5 horas.',
    sanidad:
      'Apuesta por una sanidad pública universal con más inversión, atención primaria reforzada y menos listas de espera.',
    pensiones:
      'Garantiza la revalorización de las pensiones con el IPC y defiende el sistema público de reparto.',
    inmigracion:
      'Defiende una migración regulada, la cooperación con los países de origen y una acogida repartida con vías legales de entrada.',
    feminismo:
      'Hace de la igualdad una prioridad: refuerzo del Pacto de Estado contra la violencia de género, paridad y reducción de la brecha salarial.',
    educacion:
      'Apuesta por una educación pública de calidad, más becas y reducción del abandono escolar.',
    clima:
      'Impulsa la descarbonización y las renovables, con un calendario escalonado de cierre de las centrales nucleares.',
    territorial:
      'Defiende el Estado autonómico y el diálogo con Cataluña y otros territorios dentro de la Constitución.',
  },
  vox: {
    vivienda:
      'Propone liberalizar suelo, reducir trámites y rechazar la limitación de los alquileres; pide priorizar a las familias españolas en vivienda social.',
    empleo:
      'Aboga por bajar impuestos y cotizaciones, reducir la burocracia y apoyar a autónomos y pymes.',
    sanidad:
      'Pide mejorar la gestión de la sanidad pública y limitar el acceso gratuito de los inmigrantes en situación irregular.',
    pensiones:
      'Promete garantizar las pensiones apoyándose en una economía más productiva y en el aumento de la natalidad.',
    inmigracion:
      'Exige frenar la inmigración irregular, reforzar las fronteras y expulsar a quienes entren o permanezcan ilegalmente.',
    feminismo:
      'Rechaza la actual legislación de violencia de género y propone una ley de violencia intrafamiliar que proteja a todas las víctimas.',
    educacion:
      'Defiende el llamado pin parental, la libertad de elección de centro y el refuerzo del castellano en toda España.',
    clima:
      'Cuestiona las políticas climáticas actuales, defiende la energía nuclear y rechaza los impuestos verdes.',
    territorial:
      'Propone suprimir el Estado autonómico, recentralizar competencias e ilegalizar a los partidos que busquen la secesión.',
  },
  'frente-amplio': {
    vivienda:
      'Defiende topar los alquileres, alargar los contratos y reforzar la protección del inquilino, limitar la compra especulativa y ampliar el parque público de vivienda.',
    empleo:
      'Impulsa la reducción de la jornada a 37,5 horas, la subida del salario mínimo y una reforma del despido.',
    sanidad:
      'Pide reforzar la sanidad pública, universal y gratuita, con más personal y atención primaria, y frenar su privatización.',
    pensiones:
      'Defiende pensiones públicas dignas, revalorizadas con el IPC y con mayor contribución de las rentas altas.',
    inmigracion:
      'Aboga por vías de entrada legales y seguras, la regularización de personas migrantes y el respeto a los derechos en frontera.',
    feminismo:
      'Prioriza la igualdad real: lucha contra la violencia machista, la brecha salarial y los derechos de las personas LGTBI.',
    educacion:
      'Apuesta por la educación pública gratuita desde los 0 años, más becas y menos alumnos por aula.',
    clima:
      'Propone acelerar la transición ecológica con renovables, movilidad sostenible y rechazo a nuevas prospecciones fósiles.',
    territorial:
      'Defiende un modelo plurinacional con diálogo y respeto a la diversidad territorial dentro de la Constitución.',
  },
  podemos: {
    vivienda:
      'Plantea bajar los alquileres, ofrecer contratos de duración indefinida con mayor protección del inquilino, evitar desahucios sin alternativa habitacional y construir vivienda pública de forma masiva.',
    empleo:
      'Reclama una jornada de 32 horas, subidas salariales y derogar las reformas laborales anteriores.',
    sanidad:
      'Propone blindar la sanidad pública, revertir privatizaciones e incluir la salud mental y bucodental.',
    pensiones:
      'Defiende un sistema público con pensiones mínimas que garanticen una vida digna.',
    inmigracion:
      'Defiende los derechos de las personas migrantes, su regularización y el cierre de los centros de internamiento.',
    feminismo:
      'Es una de sus banderas: mantener el Ministerio de Igualdad, luchar contra la violencia machista y proteger los derechos trans.',
    educacion:
      'Apuesta por una escuela pública, laica y gratuita con más financiación.',
    clima:
      'Pide un gran plan de renovables públicas con justicia social para los trabajadores de los sectores afectados.',
    territorial:
      'Reconoce el derecho a decidir de los pueblos de España mediante acuerdos y no por imposición.',
  },
  erc: {
    vivienda:
      'Reclama competencias propias en vivienda y la regulación de los alquileres en Cataluña.',
    empleo:
      'Defiende salarios dignos y reducir la precariedad, con competencias laborales propias.',
    sanidad:
      'Apuesta por un sistema público catalán bien financiado y por reforzar la atención primaria.',
    pensiones: 'Pide pensiones mínimas dignas y revalorizadas.',
    inmigracion:
      'Reclama competencias en acogida e integración, con una política basada en derechos y compartida con Cataluña.',
    feminismo:
      'Respalda las políticas feministas y la lucha contra la violencia machista, con recursos transferidos a la Generalitat.',
    educacion:
      'Defiende el modelo de inmersión en catalán y una mayor financiación educativa.',
    clima:
      'Propone una transición energética con renovables y mayor soberanía energética catalana.',
    territorial:
      'Defiende un referéndum pactado de autodeterminación y una financiación singular para Cataluña.',
  },
  pnv: {
    vivienda:
      'Reclama competencias en vivienda y apuesta por vivienda protegida y alquiler asequible en Euskadi.',
    empleo:
      'Prioriza el empleo industrial de calidad, la formación y el diálogo social.',
    sanidad:
      'Defiende el sistema sanitario público vasco, Osakidetza, y su capacidad de decisión propia.',
    pensiones:
      'Pide que la gestión de la Seguridad Social pueda transferirse a Euskadi y defiende pensiones suficientes.',
    inmigracion:
      'Aboga por una migración ordenada, vinculada a las necesidades del mercado laboral y con integración compartida.',
    feminismo:
      'Respalda las políticas de igualdad y la lucha contra la violencia machista.',
    educacion:
      'Defiende el modelo educativo vasco, con el euskera y competencia propia.',
    clima:
      'Apuesta por la transición energética apoyando al mismo tiempo a la industria vasca.',
    territorial:
      'Reclama cumplir el Estatuto de Gernika, blindar el Concierto Económico y avanzar hacia un nuevo estatus político.',
  },
  junts: {
    vivienda:
      'Pide competencias para regular y fomentar la vivienda en Cataluña, con incentivos a la oferta.',
    empleo:
      'Aboga por menos carga fiscal para empresas y autónomos y una política de empleo adaptada a Cataluña.',
    sanidad:
      'Defiende un sistema sanitario catalán con gestión propia y más financiación.',
    pensiones:
      'Defiende un sistema sostenible, con revalorización compatible con el equilibrio presupuestario.',
    inmigracion:
      'Reclama competencias en inmigración para Cataluña, con una integración vinculada al conocimiento del catalán.',
    feminismo:
      'Respalda las políticas de igualdad y la lucha contra la violencia machista dentro de sus competencias.',
    educacion:
      'Defiende la inmersión lingüística y el catalán como lengua vehicular.',
    clima:
      'Apoya una transición energética pragmática, compatible con la competitividad industrial.',
    territorial:
      'Defiende la independencia de Cataluña y reclama un acuerdo con el Estado sobre su estatus político.',
  },
  'eh-bildu': {
    vivienda:
      'Propone limitar el precio del alquiler, penalizar las viviendas vacías y ampliar la vivienda pública.',
    empleo:
      'Defiende salarios dignos, convenios propios y mejores condiciones laborales en Euskal Herria.',
    sanidad: 'Pide reforzar la sanidad pública y frenar su privatización.',
    pensiones:
      'Reclama pensiones mínimas dignas y un marco vasco de Seguridad Social.',
    inmigracion:
      'Defiende la acogida, los derechos de las personas migrantes y las vías legales de entrada.',
    feminismo:
      'Mantiene una agenda feminista activa y contra la violencia machista.',
    educacion: 'Apuesta por la escuela pública vasca y la promoción del euskera.',
    clima:
      'Propone una transición ecológica con renovables y protección del territorio.',
    territorial:
      'Defiende el derecho a decidir de Euskal Herria y un mayor autogobierno.',
  },
  bng: {
    vivienda:
      'Plantea vivienda pública y alquiler asequible, y combatir la despoblación del rural gallego.',
    empleo:
      'Defiende empleo digno y la industria gallega, con salarios y convenios propios.',
    sanidad:
      'Reclama reforzar la sanidad pública gallega, especialmente en el rural.',
    pensiones:
      'Pide pensiones dignas, con mínimas acordes al coste de vida de Galicia.',
    inmigracion:
      'Aboga por una acogida con derechos y por la integración de las personas migrantes en la sociedad gallega.',
    feminismo:
      'Mantiene una agenda feminista con foco en el mundo rural y los cuidados.',
    educacion:
      'Defiende la escuela pública gallega y el gallego como lengua vehicular.',
    clima:
      'Propone una transición ecológica en la que los beneficios de las renovables se queden en Galicia.',
    territorial:
      'Defiende el reconocimiento de Galicia como nación y un mayor autogobierno.',
  },
  cc: {
    vivienda:
      'Pide facilitar la vivienda en las islas con más suelo y apoyo a la vivienda protegida.',
    empleo:
      'Se centra en reducir el paro en Canarias y diversificar su economía.',
    sanidad:
      'Reclama más financiación y personal para reducir las listas de espera en el archipiélago.',
    pensiones: 'Defiende pensiones dignas y revalorizadas.',
    inmigracion:
      'Exige solidaridad del Estado y de la UE ante la llegada de migrantes y menores a las islas, con reparto entre comunidades.',
    feminismo:
      'Respalda las políticas de igualdad y contra la violencia de género.',
    educacion:
      'Pide más inversión educativa y ayudas que compensen la insularidad.',
    clima:
      'Apoya el desarrollo de las energías renovables en las islas.',
    territorial:
      'Defiende el estatus de región ultraperiférica, el régimen económico y fiscal y la atención a la doble insularidad.',
  },
  upn: {
    vivienda:
      'Promueve la vivienda protegida y las ayudas para jóvenes en Navarra.',
    empleo:
      'Defiende un entorno favorable para las empresas y el empleo estable en la industria navarra.',
    sanidad:
      'Pide reforzar la sanidad pública navarra y reducir las esperas.',
    pensiones: 'Defiende el sistema público de pensiones y su revalorización.',
    inmigracion:
      'Aboga por una migración legal y ordenada con integración.',
    feminismo:
      'Respalda la igualdad real y la lucha contra la violencia de género.',
    educacion:
      'Defiende un sistema educativo de calidad con libertad de elección de centro.',
    clima:
      'Apoya una transición energética compatible con la industria.',
    territorial:
      'Defiende la identidad foral de Navarra dentro de España y rechaza su integración con el País Vasco.',
  },
  salf: {
    vivienda:
      'Plantea facilitar la construcción y agilizar los trámites para abaratar la vivienda.',
    empleo:
      'Propone reducir impuestos y burocracia para autónomos, y recortar el gasto político.',
    sanidad:
      'Reclama una gestión más eficiente de la sanidad pública y menos gasto político.',
    pensiones:
      'Defiende garantizar las pensiones actuales reduciendo el gasto político superfluo.',
    inmigracion: 'Pide más control de la inmigración irregular.',
    feminismo:
      'Tiene una posición poco desarrollada: su discurso se centra en el gasto político y los privilegios institucionales.',
    educacion:
      'Tiene una posición poco desarrollada: su discurso se centra en el gasto político y los privilegios institucionales.',
    clima:
      'No presenta un programa climático detallado; su prioridad es recortar el gasto político.',
    territorial:
      'Defiende reducir el aparato autonómico y el número de cargos políticos.',
  },
}
