export type Project = {
  slug: string;
  title: string;
  category: "Cafés" | "Restaurants" | "Hotels" | "Lounges" | "Outdoor Spaces" | "Luxury Dining" | "Commercial Interiors";
  client: string;
  city: string;
  year: string;
  scope: string[];
  overview: string;
  challenge: string;
  solution: string;
  variant: "walnut" | "cafe" | "lounge" | "hotel" | "dining" | "ink" | "warm";
  size?: "tall" | "wide" | "regular";
};

export const projects: Project[] = [
  {
    slug: "noir-coffee-house",
    title: "Noir Coffee House",
    category: "Cafés",
    client: "Noir Hospitality",
    city: "Mumbai",
    year: "2024",
    scope: ["Custom Seating", "Bar Counter", "Lighting Curation"],
    overview: "An intimate third-wave café designed around slow mornings — warm walnut, low-glare lighting and an open bar that invites conversation.",
    challenge: "The space had a narrow footprint with awkward column placement that fragmented sightlines.",
    solution: "We anchored the room with a sculpted walnut bar and used banquette seating along the perimeter to reclaim every inch.",
    variant: "cafe",
    size: "tall",
  },
  {
    slug: "atelier-dining-room",
    title: "Atelier Dining Room",
    category: "Restaurants",
    client: "Atelier Group",
    city: "Pune",
    year: "2024",
    scope: ["Dining Furniture", "Private Booths", "Brass Detailing"],
    overview: "A modern Indian fine-dining concept layered with brass inlay, hand-rubbed walnut and chocolate-leather booths.",
    challenge: "Acoustic comfort across 86 covers in a single open volume.",
    solution: "Upholstered booths and fluted wood ceilings tame reverb without compromising the cinematic openness.",
    variant: "dining",
    size: "wide",
  },
  {
    slug: "the-ember-lounge",
    title: "The Ember Lounge",
    category: "Lounges",
    client: "Ember Group",
    city: "Bengaluru",
    year: "2023",
    scope: ["Modular Sofas", "Bar Stools", "Ambient Lighting"],
    overview: "A late-night lounge that feels like a hushed gallery — deep velvets, smoked glass and gold accents.",
    challenge: "Maintaining intimacy across multiple zones and lighting moods.",
    solution: "Modular sofa systems and dimmable champagne-toned lighting create distinct rooms within one space.",
    variant: "lounge",
  },
  {
    slug: "casa-mira-boutique-hotel",
    title: "Casa Mira Boutique Hotel",
    category: "Hotels",
    client: "Casa Mira Hospitality",
    city: "Goa",
    year: "2024",
    scope: ["Lobby Furniture", "Suite Casegoods", "Outdoor Lounge"],
    overview: "Coastal modern with a Mediterranean whisper — bone linen, bleached oak and hand-thrown ceramics.",
    challenge: "Coastal climate demanded materials that would weather beautifully without losing their luxury.",
    solution: "Marine-grade walnut, brushed brass with PVD coatings, and performance bouclé fabrics.",
    variant: "hotel",
    size: "wide",
  },
  {
    slug: "ostara-rooftop",
    title: "Ostara Rooftop",
    category: "Outdoor Spaces",
    client: "Ostara",
    city: "Hyderabad",
    year: "2023",
    scope: ["Outdoor Seating", "Pergola System", "Planters"],
    overview: "Skyline-facing rooftop terrace with weatherproof teak and hand-woven canopies.",
    challenge: "All-weather durability without an outdoor-furniture aesthetic.",
    solution: "FSC teak with marine oil finishing and indoor-grade silhouettes.",
    variant: "warm",
  },
  {
    slug: "house-of-luna-fine-dining",
    title: "House of Luna",
    category: "Luxury Dining",
    client: "Luna Hospitality",
    city: "Delhi",
    year: "2024",
    scope: ["Chef's Table", "Wine Cellar Joinery", "Custom Chairs"],
    overview: "A 22-seat tasting room where every chair, sconce and sideboard was made for the room.",
    challenge: "A bespoke chair that read modern but felt like a familiar embrace.",
    solution: "A sculpted walnut frame with hand-stitched leather sling — twelve prototypes, one final.",
    variant: "dining",
    size: "tall",
  },
  {
    slug: "north-yard-workspace",
    title: "North Yard Workspace",
    category: "Commercial Interiors",
    client: "North Yard",
    city: "Nagpur",
    year: "2023",
    scope: ["Workstations", "Boardroom", "Breakout Lounge"],
    overview: "A premium private office that rejects the cubicle in favour of cabinetry, tactile surfaces and light.",
    challenge: "Desks that house power and data without visible clutter.",
    solution: "Integrated brass grommets and a modesty panel with concealed cable race.",
    variant: "ink",
  },
  {
    slug: "the-velvet-room",
    title: "The Velvet Room",
    category: "Lounges",
    client: "Velvet Hospitality",
    city: "Mumbai",
    year: "2024",
    scope: ["Banquettes", "Cocktail Tables", "Mirrored Bar"],
    overview: "A speakeasy lounge dressed in oxblood velvet, smoked mirror and antique brass.",
    challenge: "Theatrical without becoming a theme.",
    solution: "Restraint — one hero material per zone, repeated with intent.",
    variant: "lounge",
    size: "wide",
  },
];

export const categories = [
  "All",
  "Cafés",
  "Restaurants",
  "Hotels",
  "Lounges",
  "Outdoor Spaces",
  "Luxury Dining",
  "Commercial Interiors",
] as const;
