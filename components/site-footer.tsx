import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm leading-relaxed text-muted-foreground sm:px-6">
        <p className="max-w-3xl text-pretty">
          Los sondeos y las proyecciones de escaños mostrados son datos de ejemplo con fines
          ilustrativos. La posición de cada partido en el eje izquierda–derecha es una
          simplificación orientativa. Consulta siempre las fuentes oficiales y las fichas técnicas de
          cada encuesta.
        </p>
        <p className="mt-3 max-w-3xl text-pretty">
          Fotografías de líderes: Wikimedia Commons, bajo sus respectivas licencias libres.
        </p>
        <Link
          href="/admin"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block text-xs text-muted-foreground/60 transition-colors hover:text-foreground"
        >
          Administración
        </Link>
      </div>
    </footer>
  )
}
