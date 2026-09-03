/**
 * Artwork catalogue.
 *
 * Placeholder images use picsum.photos with a per-stage treatment so the
 * sketch -> outline -> final progression reads even before real art is in:
 *   sketch  = grayscale + blur
 *   outline = grayscale
 *   final   = full colour
 * Replace `stages[].src` and `cover` with real files under src/assets/work/.
 */

export type Style = 'sacred' | 'stylised'

export type Stage = {
  label: string
  src: string
}

export type Artwork = {
  slug: string
  title: string
  year: string
  medium: string
  style: Style
  cover: string
  stages: Stage[]
  description: string
}

const W = 1100
const H = 1375

function stages(seed: string): Stage[] {
  const base = `https://picsum.photos/seed/${seed}/${W}/${H}`
  return [
    { label: 'Sketch', src: `${base}?grayscale&blur=2` },
    { label: 'Outline', src: `${base}?grayscale` },
    { label: 'Final', src: base },
  ]
}

// TODO: real titles, years, media, descriptions and images
const raw: Omit<Artwork, 'cover' | 'stages'>[] = [
  { slug: 'nataraja', title: 'Nataraja', year: '2024', medium: 'Digital', style: 'sacred', description: 'The cosmic dance in the ring of fire. A study of motion held still.' },
  { slug: 'ardhanarishvara', title: 'Ardhanarishvara', year: '2024', medium: 'Digital', style: 'sacred', description: 'Half Shiva, half Parvati. The composition splits cleanly down the centre line.' },
  { slug: 'ganesha-dhyana', title: 'Ganesha in Dhyana', year: '2023', medium: 'Digital', style: 'sacred', description: 'The remover of obstacles, seated and still. Warm tones against a dark ground.' },
  { slug: 'durga', title: 'Durga', year: '2024', medium: 'Digital', style: 'sacred', description: 'Ten arms, one focus. Built the weapons first, then the calm face last.' },
  { slug: 'kali', title: 'Kali', year: '2023', medium: 'Digital', style: 'sacred', description: 'Time and destruction. High contrast, minimal palette, a lot of black.' },
  { slug: 'saraswati', title: 'Saraswati', year: '2024', medium: 'Digital', style: 'sacred', description: 'Knowledge and sound. The veena drives the whole composition.' },
  { slug: 'hanuman', title: 'Hanuman', year: '2023', medium: 'Digital', style: 'sacred', description: 'Devotion and strength. A wide format to carry the leap.' },
  { slug: 'shiva-dhyana', title: 'Shiva Dhyana', year: '2024', medium: 'Digital', style: 'sacred', description: 'The meditating ascetic on Kailasa. Cool blues, a crescent, a serpent.' },
  { slug: 'krishna-venugopala', title: 'Krishna Venugopala', year: '2023', medium: 'Digital', style: 'sacred', description: 'The flute player. Softer line work, a lot of curve.' },
  { slug: 'trimurti', title: 'Trimurti', year: '2024', medium: 'Digital', style: 'sacred', description: 'Brahma, Vishnu, Shiva as one form. A symmetry exercise.' },
]

export const artworks: Artwork[] = raw.map((a) => ({
  ...a,
  cover: `https://picsum.photos/seed/${a.slug}/${W}/${H}`,
  stages: stages(a.slug),
}))

export const bySlug = (slug: string) => artworks.find((a) => a.slug === slug)

export const byStyle = (style: Style) => artworks.filter((a) => a.style === style)
