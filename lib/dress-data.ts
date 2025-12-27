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
  image?: string;
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
    id: "allure",
    slug: "allure",
    name: "Allure",
    tagLine: "Airy A-line with a sculpted bodice and fluid movement.",
    description:
      "An ethereal silhouette designed to accentuate the waist while allowing effortless movement. Perfect for garden parties and evening cocktails.",
    basePrice: 240,
    productionTime: "7-9 business days",
    heroImage:
      "/images/allure/sauvage/WhatsApp Image 2025-11-24 at 20.56.43.avif",
    silhouette: "a-line",
    accentGradient:
      "linear-gradient(135deg, rgba(255,236,235,1) 0%, rgba(132,22,40,0.85) 100%)",
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
      {
        id: "red",
        name: "Red",
        swatch: "#a11a32",
        secondary: "#6f0f23",
        image: "/images/allure/red/WhatsApp Image 2025-12-10 at 16.13.01 (2).avif",
      },
      {
        id: "sauvage",
        name: "Sauvage",
        swatch: "#4f4a43",
        secondary: "#2f2b28",
        image: "/images/allure/sauvage/WhatsApp Image 2025-11-24 at 20.56.43.avif",
      },
      {
        id: "volour",
        name: "Velour",
        swatch: "#5a3b4d",
        secondary: "#402735",
        image: "/images/allure/volour/WhatsApp Image 2025-12-10 at 15.57.23.avif",
      },
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
    id: "blush",
    slug: "blush",
    name: "Blush",
    tagLine: "Sculpted mermaid silhouette with couture seams.",
    description:
      "Tailored to follow the body and flare at the hem, Blush is the power dress for red carpets and galas.",
    basePrice: 320,
    productionTime: "10-12 business days",
    heroImage:
      "/images/blush/bloom/WhatsApp Image 2025-12-10 at 16.09.43 (2).avif",
    silhouette: "mermaid",
    accentGradient:
      "linear-gradient(135deg, rgba(255,237,241,1) 0%, rgba(197,52,87,0.85) 100%)",
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
      {
        id: "bloom",
        name: "Bloom",
        swatch: "#f2b7c3",
        secondary: "#f7d7df",
        image: "/images/blush/bloom/WhatsApp Image 2025-12-10 at 16.09.43 (2).avif",
      },
      {
        id: "red",
        name: "Red",
        swatch: "#98142b",
        secondary: "#6d0f22",
        image: "/images/blush/red/WhatsApp Image 2025-12-10 at 16.12.45 (3).avif",
      },
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
    id: "elegance",
    slug: "elegance",
    name: "Elegance",
    tagLine: "Minimal sheath with an architectural neckline.",
    description:
      "A minimalist column dress that celebrates clean lines and impeccable tailoring. Works for civil ceremonies and art openings alike.",
    basePrice: 275,
    productionTime: "8-10 business days",
    heroImage:
      "/images/elegance/cocoa/WhatsApp Image 2025-11-24 at 20.36.55 (2).avif",
    silhouette: "sheath",
    accentGradient:
      "linear-gradient(135deg, rgba(247,240,233,1) 0%, rgba(117,77,58,0.85) 100%)",
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
      {
        id: "cocoa",
        name: "Cocoa",
        swatch: "#6b4a36",
        secondary: "#4a2f21",
        image: "/images/elegance/cocoa/WhatsApp Image 2025-11-24 at 20.36.55 (2).avif",
      },
      {
        id: "pearl",
        name: "Pearl",
        swatch: "#f5eee5",
        secondary: "#eadfd3",
        image: "/images/elegance/pearl/WhatsApp Image 2025-11-24 at 21.37.19.avif",
      },
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
    id: "valeria",
    slug: "valeria",
    name: "Valeria",
    tagLine: "Romantic ballgown with luminous layers.",
    description:
      "A couture-inspired gown with voluminous layers and intricate detailing. Designed for statement-making entrances.",
    basePrice: 440,
    productionTime: "12-15 business days",
    heroImage:
      "/images/valeria/milky/WhatsApp Image 2025-11-24 at 21.46.35.avif",
    silhouette: "ballgown",
    accentGradient:
      "linear-gradient(135deg, rgba(250,246,239,1) 0%, rgba(142,126,178,0.85) 100%)",
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
      {
        id: "baby-pink",
        name: "Baby Pink",
        swatch: "#f7c8d6",
        secondary: "#fbe1ea",
        image: "/images/valeria/baby-pink/WhatsApp Image 2025-12-10 at 15.58.55 (1).avif",
      },
      {
        id: "black",
        name: "Black",
        swatch: "#111111",
        secondary: "#2a2a2a",
        image: "/images/valeria/black/WhatsApp Image 2025-11-24 at 20.41.21.avif",
      },
      {
        id: "gold",
        name: "Gold",
        swatch: "#c8a24a",
        secondary: "#e2c878",
        image: "/images/valeria/gold/WhatsApp Image 2025-11-24 at 20.43.56.avif",
      },
      {
        id: "lavender",
        name: "Lavender",
        swatch: "#b7a1d7",
        secondary: "#d8c9ef",
        image: "/images/valeria/lavender/IMG_3510.avif",
      },
      {
        id: "milky",
        name: "Milky",
        swatch: "#f3efe6",
        secondary: "#e6ded1",
        image: "/images/valeria/milky/WhatsApp Image 2025-11-24 at 21.46.35.avif",
      },
      {
        id: "olive",
        name: "Olive",
        swatch: "#7c7a4a",
        secondary: "#a6a077",
        image: "/images/valeria/olive/WhatsApp Image 2025-11-24 at 20.38.39.avif",
      },
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


