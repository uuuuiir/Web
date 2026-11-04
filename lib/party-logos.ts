const logoSlugs = new Set([
  'pp',
  'psoe',
  'vox',
  'frente-amplio',
  'podemos',
  'erc',
  'junts',
  'eh-bildu',
  'cc',
  'upn',
  'pnv',
  'bng',
  'salf',
])

function logoFilename(slug: string): string {
  return ['frente-amplio', 'salf'].includes(slug)
    ? `${slug}.png`
    : slug === 'pnv'
      ? `${slug}.jpg`
      : slug === 'bng'
        ? `${slug}.webp`
        : `${slug}.svg`
}

export function getPartyLogo(slug: string): string | null {
  return logoSlugs.has(slug) ? `/logos/${logoFilename(slug)}` : null
}

export function getSmallPartyLogo(slug: string): string | null {
  return logoSlugs.has(slug) ? `/logos-small/${logoFilename(slug)}` : null
}
