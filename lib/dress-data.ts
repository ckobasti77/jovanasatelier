export type LengthOption = {
  id: string;
  name: string;
  description: string;
};

export type FabricOption = {
  id: string;
  name: string;
  description: string;
  texture: "matte" | "silky" | "structured";
  care: string;
  upcharge?: number;
};

export type ColorOption = {
  id: string;
  name: string;
  swatch: string;
  secondary?: string;
};

export type DressModel = {
  id: string;
  slug: string;
  name: string;
  tagLine: string;
  description: string;
  basePrice: number;
  productionTime: string;
  heroImage: string;
  silhouette: "a-line" | "mermaid" | "sheath" | "ballgown";
  highlights: string[];
  fabrics: FabricOption[];
  colors: ColorOption[];
  lengths: LengthOption[];
  accentGradient: string;
};

export const DRESS_MODELS: DressModel[] = [
  {
    id: "luma",
    slug: "luma",
    name: "Luma",
    tagLine: "Airy A-line with a cinched waist and flowing skirt.",
    description:
      "An ethereal silhouette designed to accentuate the waist while allowing effortless movement. Perfect for garden parties and evening cocktails.",
    basePrice: 220,
    productionTime: "7-9 business days",
    heroImage: "/images/dress1.avif",
    silhouette: "a-line",
    accentGradient:
      "linear-gradient(135deg, rgba(255,241,243,1) 0%, rgba(204,221,255,0.9) 100%)",
    highlights: [
      "Adjustable corset-style back",
      "Lightweight double-layered skirt",
      "Optional high-slit add-on",
    ],
    fabrics: [
      {
        id: "silk-chiffon",
        name: "Silk Chiffon",
        description: "Sheer and floaty with a soft drape.",
        texture: "silky",
        care: "Dry clean only",
        upcharge: 40,
      },
      {
        id: "eco-crepe",
        name: "Eco Crepe",
        description: "Sustainably sourced crepe with subtle texture.",
        texture: "matte",
        care: "Gentle cold wash",
      },
    ],
    colors: [
      { id: "midnight", name: "Midnight Blue", swatch: "#0f1b48" },
      { id: "rosewater", name: "Rosewater", swatch: "#f0c7c1" },
      { id: "ivory", name: "Ivory", swatch: "#f6f2eb", secondary: "#efe9dc" },
    ],
    lengths: [
      {
        id: "midi",
        name: "Midi",
        description: "Hits mid-calf for a modern, versatile look.",
      },
      {
        id: "full",
        name: "Full Length",
        description: "Floor length with subtle train option.",
      },
    ],
  },
  {
    id: "vara",
    slug: "vara",
    name: "Vara",
    tagLine: "Sculpted mermaid silhouette with couture seams.",
    description:
      "Tailored to follow the body and flare at the hem, Vara is the power dress for red carpets and galas.",
    basePrice: 310,
    productionTime: "10-12 business days",
    heroImage: "/images/dress2.avif",
    silhouette: "mermaid",
    accentGradient:
      "linear-gradient(135deg, rgba(255,233,220,1) 0%, rgba(186,37,73,0.85) 100%)",
    highlights: [
      "Boned bodice for structure",
      "Invisible zipper with hand finishing",
      "Optional removable overskirt",
    ],
    fabrics: [
      {
        id: "duchesse-satin",
        name: "Duchesse Satin",
        description: "High-shine satin with dramatic body.",
        texture: "silky",
        care: "Dry clean only",
        upcharge: 60,
      },
      {
        id: "matte-mikado",
        name: "Matte Mikado",
        description: "Crisp mikado that sculpts without stiffness.",
        texture: "structured",
        care: "Spot clean, dry clean recommended",
      },
    ],
    colors: [
      { id: "onyx", name: "Onyx", swatch: "#0b0b0b" },
      { id: "ruby", name: "Ruby", swatch: "#990f2b" },
      { id: "champagne", name: "Champagne", swatch: "#ebd9b3" },
    ],
    lengths: [
      {
        id: "full",
        name: "Full Length",
        description: "Floor sweeping with optional chapel train.",
      },
    ],
  },
  {
    id: "noor",
    slug: "noor",
    name: "Noor",
    tagLine: "Minimal sheath with architectural neckline.",
    description:
      "A minimalist column dress that celebrates clean lines and impeccable tailoring. Works for civil ceremonies and art openings alike.",
    basePrice: 260,
    productionTime: "8-10 business days",
    heroImage: "/images/dress3.avif",
    silhouette: "sheath",
    accentGradient:
      "linear-gradient(135deg, rgba(235,242,244,1) 0%, rgba(130,142,155,0.9) 100%)",
    highlights: [
      "Built-in lining with smoothing mesh",
      "Hidden side pockets",
      "Neckline can be asymmetrical or straight",
    ],
    fabrics: [
      {
        id: "stretch-crepe",
        name: "Stretch Crepe",
        description: "Soft crepe with just enough give.",
        texture: "matte",
        care: "Cold hand wash, lay flat",
      },
      {
        id: "tencel-sateen",
        name: "Tencel Sateen",
        description: "Sustainable sateen with slight sheen.",
        texture: "silky",
        care: "Gentle machine wash, hang dry",
      },
    ],
    colors: [
      { id: "pearl", name: "Pearl", swatch: "#faf1ed" },
      { id: "slate", name: "Slate Grey", swatch: "#545862" },
      { id: "sage", name: "Sage", swatch: "#c5d5c1" },
    ],
    lengths: [
      {
        id: "knee",
        name: "Knee Length",
        description: "Hits right above the knee.",
      },
      {
        id: "tea",
        name: "Tea Length",
        description: "Falls mid-shin with clean hem.",
      },
      {
        id: "full",
        name: "Full Length",
        description: "Streamlined floor length.",
      },
    ],
  },
  {
    id: "solenne",
    slug: "solenne",
    name: "Solenne",
    tagLine: "Romantic ballgown with hand-placed applique.",
    description:
      "A couture-inspired gown with voluminous layers and intricate floral detailing. Designed for the statement makers.",
    basePrice: 420,
    productionTime: "12-15 business days",
    heroImage: "/images/dress4.avif",
    silhouette: "ballgown",
    accentGradient:
      "linear-gradient(135deg, rgba(255,235,239,1) 0%, rgba(89,75,104,0.9) 100%)",
    highlights: [
      "Corseted bodice with inner lacing",
      "Horsehair hem for dramatic flare",
      "Optional detachable sleeves",
    ],
    fabrics: [
      {
        id: "illusion-tulle",
        name: "Illusion Tulle",
        description: "Lightweight tulle with subtle sparkle.",
        texture: "structured",
        care: "Steam only, store with garment bag",
      },
      {
        id: "organza",
        name: "Organza",
        description: "Crisp yet sheer, perfect for volume.",
        texture: "structured",
        care: "Dry clean only",
      },
    ],
    colors: [
      { id: "opal", name: "Opal", swatch: "#f8e3ea" },
      { id: "moonstone", name: "Moonstone", swatch: "#e9e7f2" },
      { id: "noir", name: "Noir", swatch: "#1a181a" },
    ],
    lengths: [
      {
        id: "grand",
        name: "Grand",
        description: "Full length with cathedral train option.",
      },
    ],
  },
];


