// Six projects shared by the homepage gallery and /visual-design.
// Paths are absolute from public/.
export interface VisualProject {
  slug: string // matches the id on /visual-design and the #hash used by homepage links
  cover: string
  alt: string
  title: string
  label: string
  category: string
  position: string
  description: string
  gallery: { src: string; alt: string }[]
}

export const visualWork: VisualProject[] = [
  {
    slug: "tarot-cards",
    cover: "/assets/visual-design/tarot-cards/cover.png",
    alt: "Tarot Cards Reimagined: illustrated Death, The Lovers and The Devil cards beside a deck on linen",
    title: "Tarot Cards Reimagined",
    label: "ILLUSTRATION",
    category: "Visual Experiment",
    position: "50% 50%",
    description:
      "A contemporary reinterpretation of traditional tarot symbolism through neon colours, high-contrast compositions, bold silhouettes and expressive flat illustrations. The four cards explore transformation, choice, temptation and growth through Death, The Lovers, The Devil and The Empress.",
    gallery: [
      { src: "/assets/visual-design/tarot-cards/death.png", alt: "Death tarot card" },
      { src: "/assets/visual-design/tarot-cards/lovers.png", alt: "The Lovers tarot card" },
      { src: "/assets/visual-design/tarot-cards/devil.png", alt: "The Devil tarot card" },
      { src: "/assets/visual-design/tarot-cards/empress.png", alt: "The Empress tarot card" },
    ],
  },
  {
    slug: "retail-bags",
    cover: "/assets/visual-design/retail-bags/cover.png",
    alt: "Retail Bags Catalogue: editorial and product design moodboard",
    title: "Retail Bags Catalogue",
    label: "EDITORIAL DESIGN",
    category: "Graphic Design / Editorial",
    position: "50% 50%",
    description:
      "A sales catalogue for Modi Industries' retail bag division, a women-led manufacturing unit in Assam producing jute, cotton, juco and non-woven bags. Designed for exhibitions and trade meets, it focuses on product presentation, clear information hierarchy, consistent layouts and the story of craftswomen-led sustainable production.",
    gallery: [
      { src: "/assets/visual-design/retail-bags/catalogue/retail-cover.png", alt: "Catalogue cover: Retail Bags with a sketched jute bag" },
      { src: "/assets/visual-design/retail-bags/catalogue/retail-bag-montage.png", alt: "Catalogue page: a montage of jute, cotton and non-woven bags" },
      { src: "/assets/visual-design/retail-bags/catalogue/retail-precision-cutting.png", alt: "Catalogue page: Precision Cutting, clean finish" },
      { src: "/assets/visual-design/retail-bags/catalogue/retail-screen-printing.png", alt: "Catalogue page: Screen Printing, high definition" },
      { src: "/assets/visual-design/retail-bags/catalogue/retail-materials.png", alt: "Catalogue page: jute, cotton canvas, juco and non-woven materials" },
      { src: "/assets/visual-design/retail-bags/catalogue/retail-jute-bags.png", alt: "Catalogue page: jute bags with handle details" },
      { src: "/assets/visual-design/retail-bags/catalogue/retail-cotton-canvas-bags.png", alt: "Catalogue page: cotton canvas bags" },
      { src: "/assets/visual-design/retail-bags/catalogue/retail-non-woven-bags.png", alt: "Catalogue page: non-woven bags" },
      { src: "/assets/visual-design/retail-bags/catalogue/retail-team.png", alt: "Catalogue page: About the Team, an entirely women-led retail bag team" },
    ],
  },
  {
    slug: "mcgsmun-logo",
    cover: "/assets/visual-design/mcgsmun-logo/cover.png",
    alt: "MCGSMUN logo design: the Ouroboros as a black and silver dragon circle",
    title: "MCGSMUN Logo Design",
    label: "LOGO DESIGN",
    category: "Logo Design / Identity",
    position: "50% 50%",
    description:
      "Identity for MCGSMUN 2023, themed around reconstructing the moral arc. The Ouroboros is reinterpreted as a symbol of destruction, creation, renewal and transformation, with contrasting dark and light forms suggesting decay and growth.",
    gallery: [
      { src: "/assets/visual-design/mcgsmun-logo/logo.png", alt: "Ouroboros logo artwork on white" },
      { src: "/assets/visual-design/mcgsmun-logo/tote-set.png", alt: "Tote bag, notebook and folder carrying the identity" },
      { src: "/assets/visual-design/mcgsmun-logo/tote-model.png", alt: "Tote bag with the MCGSMUN logo worn over a shoulder" },
    ],
  },
  {
    slug: "skin-and-me",
    cover: "/assets/branding/skin-and-me/product-mockup.png",
    alt: "Skin & Me logo on a skincare tube, serum bottles, jar, box and shopping bag",
    title: "Skin & Me",
    label: "LOGO DESIGN",
    category: "Logo Design",
    position: "50% 50%",
    // Provisional copy: revise when the brief is final.
    description:
      "A visual identity for a natural skincare brand, built around a botanical bloom and soft, understated lettering. Warm neutrals and muted terracotta give the identity a considered, natural feel.",
    gallery: [
      { src: "/assets/branding/skin-and-me/logo.png", alt: "Skin & Me Natural Skincare logo in terracotta on cream" },
      { src: "/assets/branding/skin-and-me/logo-reversed.png", alt: "Skin & Me Natural Skincare logo in cream on terracotta" },
      { src: "/assets/branding/skin-and-me/unboxing-set.png", alt: "Skin & Me gift box with tissue paper, card, box, dropper bottle and jar" },
    ],
  },
  {
    slug: "world-aviation-training",
    cover: "/assets/branding/world-aviation-training/stationery.png",
    alt: "World Aviation Training identity on a pilot manual, folder, shirt, lanyard, notebook and aircraft",
    title: "World Aviation Training",
    label: "LOGO DESIGN",
    category: "Logo Design",
    position: "50% 50%",
    description:
      "A logo for an aviation-training context: a stylised emblem of wing-like forms around a strong central geometric mark, paired with clean, professional typography in navy and pale blue.",
    gallery: [
      { src: "/assets/branding/world-aviation-training/logo.png", alt: "World Aviation Training logo: wing emblem beside the wordmark in navy" },
      { src: "/assets/branding/world-aviation-training/aircraft-branding.png", alt: "World Aviation Training logo on an aircraft fuselage" },
    ],
  },
  {
    slug: "mcgsmun-tshirt",
    cover: "/assets/visual-design/mcgsmun-tshirt/design.png",
    alt: "MCGSMUN23 Secretariat T-shirt graphic: a statue of Lady Justice with lightning on black",
    title: "MCGSMUN T-Shirt Design",
    label: "APPAREL GRAPHICS",
    category: "Merchandise / Graphic Design",
    position: "50% 40%",
    description:
      "Merchandise artwork that carries the event's visual identity onto a garment. A high-contrast composition pairs MCGSMUN 2023 typography with a classical statue, monochrome imagery and graphic motifs such as lightning, a globe emblem and a barcode.",
    gallery: [],
  },
]
