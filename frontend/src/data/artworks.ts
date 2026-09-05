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
  /** invert a white-paper drawing to light-on-dark to fit the theme */
  invert?: boolean
}

export type Artwork = {
  slug: string
  title: string
  subtitle?: string
  /** an epigraph shown in italic above the description */
  quote?: string
  year: string
  medium: string
  style: Style
  cover: string
  stages: Stage[]
  description: string
}

// real files: src/assets/work/<slug>/<stage>.jpg
const files = import.meta.glob('../assets/work/**/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

// asset('lalbaugcha-raja/final.jpg')
const asset = (path: string): string => {
  const hit = Object.entries(files).find(([p]) => p.endsWith(`/${path}`))
  if (!hit) throw new Error(`missing artwork asset: ${path}`)
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
    slug: 'lalbaugcha-raja',
    title: 'Lalbaugcha Raja',
    subtitle: 'Remover of Obstacles',
    year: '2025',
    medium: 'Digital',
    style: 'sacred',
    cover: asset('lalbaugcha-raja/final.jpg'),
    // shown top-to-bottom: final first, then back through the process
    stages: [
      { label: 'Final', src: asset('lalbaugcha-raja/final.jpg') },
      { label: 'Line art', src: asset('lalbaugcha-raja/line-art.jpg') },
      { label: 'Rough sketch', src: asset('lalbaugcha-raja/sketch.jpg') },
    ],
    description:
      "The inspiration comes from Mumbai's famous Lalbaugcha Raja. I created this piece during the 2025 Ganesh Chaturthi. Visiting his mandap during the festival is still on my checklist.",
  },
  {
    slug: 'venkataramana-murthy',
    title: 'Venkataramana Murthy',
    subtitle: 'Cosmic in form, gentle in grace.',
    year: '2026',
    medium: 'Digital',
    style: 'sacred',
    cover: asset('venkataramana-murthy/final.jpg'),
    stages: [
      { label: 'Final', src: asset('venkataramana-murthy/final.jpg') },
      { label: 'Nijarupa', src: asset('venkataramana-murthy/nijarupa.jpg') },
      { label: 'Nijarupa', src: asset('venkataramana-murthy/nijarupa-2.jpg') },
      { label: 'Line art', src: asset('venkataramana-murthy/line-art.jpg') },
      { label: 'Rough sketch', src: asset('venkataramana-murthy/sketch.jpg') },
    ],
    description:
      'I felt his infinite aura on my last visit to his abode. Whether the *nijarupa* darshan or the full *alankara*, his presence is unmatched.',
  },
  {
    slug: 'mahadev',
    title: 'Mahadev',
    subtitle: 'He is all and everything. He is the Universe.',
    year: '2022',
    medium: 'Digital',
    style: 'sacred',
    cover: asset('mahadev/final.jpg'),
    stages: [
      { label: 'Final', src: asset('mahadev/final.jpg') },
      { label: 'Line art', src: asset('mahadev/line-art.jpg') },
      { label: 'Rough sketch', src: asset('mahadev/sketch.jpg') },
    ],
    description:
      'My first ever painting in Photoshop. It took several days, learning off every random YouTube tutorial and just going all out. Still my favourite piece I have made.',
  },
  {
    slug: 'dhyana-anjaneyam',
    title: 'Dhyana Anjaneya',
    subtitle: 'Serene and strong.',
    quote:
      'Kanchana barana biraja subesa, kanana kundala kunchita kesa.',
    year: '2022',
    medium: 'Digital',
    style: 'sacred',
    cover: asset('dhyana-anjaneyam/final.jpg'),
    stages: [
      { label: 'Final', src: asset('dhyana-anjaneyam/final.jpg') },
      { label: 'Line art', src: asset('dhyana-anjaneyam/line-art.jpg') },
      { label: 'Rough sketch', src: asset('dhyana-anjaneyam/sketch.jpg') },
    ],
    description:
      'Loosely: golden-hued and finely robed, studs in his ears and curls in his hair. That is how Shri Tulsidas describes him in the Hanuman Chalisa, and I tried to carry the same into this piece.',
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
    slug: 'gitopadesham',
    title: 'Gitopadesham',
    subtitle: 'Lessons for the ages.',
    year: '2026',
    medium: 'Digital',
    style: 'sacred',
    cover: asset('gitopadesham/final.jpg'),
    stages: [{ label: 'Final', src: asset('gitopadesham/final.jpg') }],
    description:
      "A cowherd, a prankster, an enchanting flute player, a lover, a true warrior, a kingmaker, a mentor, and a colourful incarnation of the divine. It didn't turn out the way I had it in my mind, not that I'm unhappy with the outcome. PS: I lost the line art and rough sketches for this one, though.",
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
