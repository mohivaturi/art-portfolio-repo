/**
 * Artwork catalogue.
 *
 * Image files live in frontend/public/work/<slug>/ and are served as static
 * files at /work/<slug>/<stage>.jpg. That folder is git-ignored - the images
 * are synced to S3 separately, not committed. Pieces with only a final so far
 * get a single "Final" stage; add line-art / sketch entries as they exist.
 *
 * Order here drives both the gallery and the prev/next pager: newest first,
 * grouped by tool (Photoshop, then Paint.NET, then MS Paint).
 */

export type Style = 'sacred' | 'stylised'

export type Stage = {
  label: string
  src: string
  /** invert a white-paper drawing to light-on-dark to fit the theme */
  invert?: boolean
}

/** tool the piece was made in - the gallery groups by this */
export type Tool = 'photoshop' | 'paintnet' | 'mspaint'

export type Artwork = {
  slug: string
  title: string
  subtitle?: string
  /** an epigraph shown in italic above the description */
  quote?: string
  year: string
  medium: string
  style: Style
  /** defaults to 'photoshop' when omitted */
  tool?: Tool
  cover: string
  stages: Stage[]
  /** omit to fall back to the shared toolBlurb for this piece's tool */
  description?: string
}

export const toolOf = (a: Artwork): Tool => a.tool ?? 'photoshop'

export const toolLabel: Record<Tool, string> = {
  photoshop: 'Adobe Photoshop / Illustrator',
  paintnet: 'Paint.NET',
  mspaint: 'MS Paint',
}

/** shown once above a tool group, and as the fallback description for its pieces */
export const toolBlurb: Partial<Record<Tool, string>> = {
  mspaint:
    'My first taste of digital art, through MS Paint. Every line was drawn with the mouse, all of it slow, manual, rigid work. I still do not know how I managed it back then, in my schooling years in the late 2000s. There was a lot more work from that time, most of it now lost.',
}

export const descriptionOf = (a: Artwork): string =>
  a.description ?? toolBlurb[toolOf(a)] ?? ''

// asset('lalbaugcha-raja/final.jpg') -> '/work/lalbaugcha-raja/final.jpg'
// served from frontend/public/work/ (git-ignored, synced to S3 out of band)
const asset = (path: string): string => `/work/${path}`

export const artworks: Artwork[] = [
  // --- Photoshop ---
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
    slug: 'sridevi-bhudevi-venkataramana',
    title: 'Sridevi Bhudevi Sametha Venkataramana Murthy',
    subtitle: 'The Lord of Kaliyuga stands with His divine consorts.',
    year: '2026',
    medium: 'Digital',
    style: 'sacred',
    cover: asset('sridevi-bhudevi-venkataramana/final.jpg'),
    stages: [
      { label: 'Final', src: asset('sridevi-bhudevi-venkataramana/final.jpg') },
      { label: 'Nijarupa', src: asset('sridevi-bhudevi-venkataramana/nijarupa.jpg') },
      { label: 'Line art', src: asset('sridevi-bhudevi-venkataramana/line-art.jpg') },
      { label: 'Rough sketch', src: asset('sridevi-bhudevi-venkataramana/sketch.jpg') },
    ],
    description:
      "An extension of my earlier version. It felt wrong to leave him standing alone, so Sridevi and Bhudevi now stand beside him, worked up from the line drawing through the *nijarupa* to the full *alankara*.",
  },
  {
    slug: 'mahaveer',
    title: 'Mahaveer',
    subtitle: 'Jai Chiranjeeva.',
    year: '2026',
    medium: 'Digital',
    style: 'sacred',
    cover: asset('mahaveer/final.jpg'),
    stages: [
      { label: 'Final', src: asset('mahaveer/final.jpg') },
      { label: 'Line art', src: asset('mahaveer/line-art.jpg') },
      { label: 'Rough sketch', src: asset('mahaveer/sketch.jpg') },
    ],
    description:
      'Whenever I visit the Hanuman temple near my home and look at the deity inside, I feel a magnetic pull that draws you in. That is where the inspiration for this piece comes from.',
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
  {
    slug: 'gitopadesham',
    title: 'Gitopadesham',
    subtitle: 'Lessons for the ages.',
    year: '2022',
    medium: 'Digital',
    style: 'sacred',
    cover: asset('gitopadesham/final.jpg'),
    stages: [{ label: 'Final', src: asset('gitopadesham/final.jpg') }],
    description:
      "A cowherd, a prankster, an enchanting flute player, a lover, a true warrior, a kingmaker, a mentor, and a colourful incarnation of the divine. It didn't turn out the way I had it in my mind, not that I'm unhappy with the outcome. PS: I lost the line art and rough sketches for this one, though.",
  },
  {
    slug: 'dusshera',
    title: 'Dussehra',
    subtitle: 'Conquering your inner demons.',
    year: '2022',
    medium: 'Digital',
    style: 'sacred',
    cover: asset('dusshera/final.jpg'),
    stages: [
      { label: 'Final', src: asset('dusshera/final.jpg') },
      { label: 'Line art', src: asset('dusshera/line-art.jpg') },
      { label: 'Rough sketch', src: asset('dusshera/sketch.jpg') },
    ],
    description:
      'Different regions each celebrate it their own way, but the core stays the same. It is a victory over the demons within.',
  },
  {
    slug: 'adiyogi-silhouette',
    title: 'Adiyogi Silhouette',
    subtitle: 'The first yogi.',
    year: '2022',
    medium: 'Vector',
    style: 'sacred',
    cover: asset('adiyogi-silhouette/final.jpg'),
    stages: [{ label: 'Final', src: asset('adiyogi-silhouette/final.jpg') }],
    description:
      'My first real introduction to Photoshop, put to work on this vector piece. The outline took barely fifteen minutes; the detailing, close to two hours.',
  },

  // --- Paint.NET ---
  {
    slug: 'ram-darbar',
    title: 'Ram Darbar',
    subtitle: 'Steady through every storm.',
    year: '2022',
    medium: 'Digital',
    style: 'sacred',
    tool: 'paintnet',
    cover: asset('ram-darbar/final.jpg'),
    stages: [{ label: 'Final', src: asset('ram-darbar/final.jpg') }],
    description:
      "Rama's whole life was uncertain, yet he never wavered within. That steadiness is the quality I would like to take from him.",
  },
  {
    slug: 'adiyogi',
    title: 'Adiyogi',
    subtitle: 'The first yogi.',
    year: '2021',
    medium: 'Digital',
    style: 'sacred',
    tool: 'paintnet',
    cover: asset('adiyogi/final.jpg'),
    stages: [
      { label: 'Final', src: asset('adiyogi/final.jpg') },
      { label: 'Earlier version', src: asset('adiyogi/earlier.jpg') },
    ],
    description:
      'Before Photoshop I worked in a program called Paint.NET. This is the piece where I first started using a pen tablet.',
  },

  // --- MS Paint (schooling years, late 2000s) ---
  {
    slug: 'bhakta-anjaneya',
    title: 'Bhakta Anjaneya',
    year: 'late 2000s',
    medium: 'MS Paint',
    style: 'sacred',
    tool: 'mspaint',
    cover: asset('bhakta-anjaneya/final.jpg'),
    stages: [{ label: 'Final', src: asset('bhakta-anjaneya/final.jpg') }],
  },
  {
    slug: 'veera-anjaneya',
    title: 'Veera Anjaneya',
    year: 'late 2000s',
    medium: 'MS Paint',
    style: 'sacred',
    tool: 'mspaint',
    cover: asset('veera-anjaneya/final.jpg'),
    stages: [{ label: 'Final', src: asset('veera-anjaneya/final.jpg') }],
  },
  {
    slug: 'devi',
    title: 'Devi',
    year: 'late 2000s',
    medium: 'MS Paint',
    style: 'sacred',
    tool: 'mspaint',
    cover: asset('devi/final.jpg'),
    stages: [{ label: 'Final', src: asset('devi/final.jpg') }],
  },
  {
    slug: 'shiva-thandavam',
    title: 'Shiva Thandavam',
    year: 'late 2000s',
    medium: 'MS Paint',
    style: 'sacred',
    tool: 'mspaint',
    cover: asset('shiva-thandavam/final.jpg'),
    stages: [{ label: 'Final', src: asset('shiva-thandavam/final.jpg') }],
  },
  {
    slug: 'vasudeva',
    title: 'Vasudeva',
    year: 'late 2000s',
    medium: 'MS Paint',
    style: 'sacred',
    tool: 'mspaint',
    cover: asset('vasudeva/final.jpg'),
    stages: [{ label: 'Final', src: asset('vasudeva/final.jpg') }],
  },
  {
    slug: 'neele-megha-shyama',
    title: 'Neele Megha Shyama',
    year: 'late 2000s',
    medium: 'MS Paint',
    style: 'sacred',
    tool: 'mspaint',
    cover: asset('neele-megha-shyama/final.jpg'),
    stages: [{ label: 'Final', src: asset('neele-megha-shyama/final.jpg') }],
  },

  // ===== Stylised =====
  {
    slug: 'sunny-day',
    title: 'Sunny Day',
    year: '2022',
    medium: 'Digital',
    style: 'stylised',
    cover: asset('sunny-day/final.jpg'),
    stages: [
      { label: 'Final', src: asset('sunny-day/final.jpg') },
      { label: 'Line art', src: asset('sunny-day/line-art.jpg') },
      { label: 'Miami dawn', src: asset('sunny-day/miami-dawn.jpg') },
    ],
    description:
      'A sunny day, maybe dawn, somewhere in Miami. You have probably met her already. Isn’t she hot?',
  },
  {
    slug: 'winter-is-coming',
    title: 'Winter is Coming',
    year: '2022',
    medium: 'Digital',
    style: 'stylised',
    cover: asset('winter-is-coming/final.jpg'),
    stages: [
      { label: 'Final', src: asset('winter-is-coming/final.jpg') },
      { label: 'Line art', src: asset('winter-is-coming/line-art.jpg') },
      { label: 'Rough sketch', src: asset('winter-is-coming/sketch.jpg') },
    ],
    description:
      'Winter is coming, so she settled in by the fire. The beanie stayed on.',
  },
  {
    slug: 'goku',
    title: 'Goku',
    year: '2022',
    medium: 'Digital',
    style: 'stylised',
    cover: asset('goku/final.jpg'),
    stages: [
      { label: 'Final', src: asset('goku/final.jpg') },
      { label: 'Line art', src: asset('goku/line-art.jpg') },
      { label: 'Pencil sketch', src: asset('goku/pencil.jpg') },
    ],
    description:
      'Traced from an old pencil sketch of Goku, redrawn clean in Illustrator, then coloured. Dragon Ball Z was never just an anime to me; it is closer to a guide for living, always about getting better.',
  },
  {
    slug: 'fall',
    title: 'Fall',
    year: '2022',
    medium: 'Digital',
    style: 'stylised',
    cover: asset('fall/final.jpg'),
    stages: [{ label: 'Final', src: asset('fall/final.jpg') }],
    description:
      '“I’ll fall for you.” Not a bad pick-up line, is it? Lost the line art for this one, unfortunately.',
  },
  {
    slug: 'man-with-no-name',
    title: 'Man With No Name',
    year: '2022',
    medium: 'Digital',
    style: 'stylised',
    cover: asset('man-with-no-name/final.jpg'),
    stages: [{ label: 'Final', src: asset('man-with-no-name/final.jpg') }],
    description:
      "A nod to Clint Eastwood and Sergio Leone's spaghetti westerns. My favourite is The Good, the Bad and the Ugly. Do watch it.",
  },
  {
    slug: 'heisenberg',
    title: 'Heisenberg',
    year: '2022',
    medium: 'Digital',
    style: 'stylised',
    cover: asset('heisenberg/final.jpg'),
    stages: [{ label: 'Final', src: asset('heisenberg/final.jpg') }],
    description:
      '“He is the danger.” Breaking Bad is still the best TV series I have watched to date.',
  },
  {
    slug: 'n-t-rama-rao',
    title: 'N T Rama Rao',
    year: '2022',
    medium: 'Digital',
    style: 'stylised',
    cover: asset('n-t-rama-rao/final.jpg'),
    stages: [{ label: 'Final', src: asset('n-t-rama-rao/final.jpg') }],
    description:
      'A tribute to one of the greatest actors of all time. He pulled off Lord Krishna effortlessly. Mayabazar is still my all-time favourite.',
  },
  {
    slug: 'king-of-pop',
    title: 'King of Pop',
    year: '2022',
    medium: 'Digital',
    style: 'stylised',
    cover: asset('king-of-pop/final.jpg'),
    stages: [
      { label: 'Final', src: asset('king-of-pop/final.jpg') },
      { label: 'Smooth Criminal', src: asset('king-of-pop/smooth-criminal.jpg') },
    ],
    description:
      'I only got into his music after he was gone. Still groove to it every time. One of my early MS Paint pieces.',
  },
]

export const bySlug = (slug: string) => artworks.find((a) => a.slug === slug)

export const byStyle = (style: Style) => artworks.filter((a) => a.style === style)
