/**
 * Artwork catalogue.
 *
 * Real images live in src/assets/work/ and are picked up by the glob below;
 * reference them by filename. Pieces that only have a final so far get a
 * single "Final" stage; add sketch/outline entries as they exist.
 *
 * Placeholder pieces use picsum.photos with a per-stage treatment so the
 * sketch -> outline -> final progression reads, and with varied sizes so the
 * masonry isn't a uniform grid.
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

// real files: src/assets/work/<name>
const files = import.meta.glob('../assets/work/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const asset = (name: string): string => {
  const hit = Object.entries(files).find(([path]) => path.endsWith(`/${name}`))
  if (!hit) throw new Error(`missing artwork asset: ${name}`)
  return hit[1]
}

// picsum placeholder with the sketch -> outline -> final treatment
const ph = (seed: string, w: number, h: number): Omit<Artwork, 'slug' | 'title' | 'year' | 'medium' | 'style' | 'description'> => {
  const base = `https://picsum.photos/seed/${seed}/${w}/${h}`
  return {
    cover: base,
    stages: [
      { label: 'Sketch', src: `${base}?grayscale&blur=2` },
      { label: 'Outline', src: `${base}?grayscale` },
      { label: 'Final', src: base },
    ],
  }
}

export const artworks: Artwork[] = [
  {
    slug: 'ganpathi-maharaj',
    title: 'Ganpathi Maharaj',
    year: '2025',
    medium: 'Digital',
    style: 'sacred',
    cover: asset('ganpathi-maharaj.jpg'),
    stages: [{ label: 'Final', src: asset('ganpathi-maharaj.jpg') }],
    description:
      'Ganpathi Maharaj enthroned, the mouse at his feet. Built the throne and the ornament first, then the deity over it.',
  },
  {
    slug: 'venkataramana-murthy',
    title: 'Venkataramana Murthy',
    year: '2026',
    medium: 'Digital',
    style: 'sacred',
    cover: asset('venkataramana-murthy.jpg'),
    stages: [{ label: 'Final', src: asset('venkataramana-murthy.jpg') }],
    description:
      'The standing form of Vishnu under a golden torana, chakra and shankha in the upper hands, Garuda and Hanuman on the pillar bases.',
  },
  {
    slug: 'mahadev',
    title: 'Mahadev',
    year: '2024',
    medium: 'Digital',
    style: 'sacred',
    cover: asset('mahadev.jpg'),
    stages: [{ label: 'Final', src: asset('mahadev.jpg') }],
    description:
      'Shiva in meditation on a cosmic ground, trishul and serpent to one side, a flame held in the open hand. The still frame the home-page video is built from.',
  },
  {
    slug: 'dhyana-anjaneyam',
    title: 'Dhyana Anjaneyam',
    year: '2023',
    medium: 'Digital',
    style: 'sacred',
    cover: asset('dhyana-anjaneyam.jpg'),
    stages: [{ label: 'Final', src: asset('dhyana-anjaneyam.jpg') }],
    description:
      'Hanuman in dhyana, ringed by the Rama-nama japa written out as a halo, "Shri Ram" on the pendant.',
  },
  // --- placeholders (varied sizes) ---
  {
    slug: 'nataraja',
    title: 'Nataraja',
    year: '2024',
    medium: 'Digital',
    style: 'sacred',
    ...ph('nataraja', 1100, 1550),
    description: 'The cosmic dance in the ring of fire. A study of motion held still.',
  },
  {
    slug: 'ardhanarishvara',
    title: 'Ardhanarishvara',
    year: '2024',
    medium: 'Digital',
    style: 'sacred',
    ...ph('ardhanarishvara', 1100, 1300),
    description: 'Half Shiva, half Parvati. The composition splits down the centre line.',
  },
  {
    slug: 'ganesha-dhyana',
    title: 'Ganesha in Dhyana',
    year: '2023',
    medium: 'Digital',
    style: 'sacred',
    ...ph('ganesha-dhyana', 1200, 1200),
    description: 'The remover of obstacles, seated and still. Warm tones on a dark ground.',
  },
  {
    slug: 'durga',
    title: 'Durga',
    year: '2024',
    medium: 'Digital',
    style: 'sacred',
    ...ph('durga', 1000, 1500),
    description: 'Ten arms, one focus. Built the weapons first, the calm face last.',
  },
  {
    slug: 'kali',
    title: 'Kali',
    year: '2023',
    medium: 'Digital',
    style: 'sacred',
    ...ph('kali', 1400, 1000),
    description: 'Time and destruction. High contrast, minimal palette, a lot of black.',
  },
  {
    slug: 'saraswati',
    title: 'Saraswati',
    year: '2024',
    medium: 'Digital',
    style: 'sacred',
    ...ph('saraswati', 1100, 1400),
    description: 'Knowledge and sound. The veena drives the whole composition.',
  },
  {
    slug: 'hanuman',
    title: 'Hanuman',
    year: '2023',
    medium: 'Digital',
    style: 'sacred',
    ...ph('hanuman', 1500, 950),
    description: 'Devotion and strength. A wide format to carry the leap.',
  },
  {
    slug: 'krishna-venugopala',
    title: 'Krishna Venugopala',
    year: '2023',
    medium: 'Digital',
    style: 'sacred',
    ...ph('krishna-venugopala', 1000, 1250),
    description: 'The flute player. Softer line work, a lot of curve.',
  },
  {
    slug: 'trimurti',
    title: 'Trimurti',
    year: '2024',
    medium: 'Digital',
    style: 'sacred',
    ...ph('trimurti', 1300, 1000),
    description: 'Brahma, Vishnu, Shiva as one form. A symmetry exercise.',
  },
]

export const bySlug = (slug: string) => artworks.find((a) => a.slug === slug)

export const byStyle = (style: Style) => artworks.filter((a) => a.style === style)
