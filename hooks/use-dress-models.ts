import { useMemo } from "react";

import { useLanguage } from "@/components/language-provider";
import {
  DRESS_MODELS,
  type ColorOption,
  type DressModel,
  type FabricOption,
  type LengthOption,
} from "@/lib/dress-data";

type PartialFabric = Partial<Pick<FabricOption, "name" | "description" | "care">>;
type PartialColor = Partial<Pick<ColorOption, "name">>;
type PartialLength = Partial<Pick<LengthOption, "name" | "description">>;
type DressOverride = Partial<
  Pick<DressModel, "name" | "tagLine" | "description" | "productionTime" | "highlights">
> & {
  fabrics?: Record<string, PartialFabric>;
  colors?: Record<string, PartialColor>;
  lengths?: Record<string, PartialLength>;
};

const DRESS_OVERRIDES_SR: Record<string, DressOverride> = {
  luma: {
    tagLine: "Prozračna A-linija sa naglašenim strukom i lepršavom suknjom.",
    description:
      "Eterična silueta koja ističe struk i ostavlja dovoljno prostora za kretanje. Savršena za baštanske zabave i večernje koktele.",
    productionTime: "7-9 radnih dana",
    highlights: [
      "Podesivi korset na leđima",
      "Dvostruki sloj suknje lagane težine",
      "Opcioni visoki prorez",
    ],
    fabrics: {
      "silk-chiffon": {
        name: "Svileni šifon",
        description: "Providan i lagan sa mekanim padom.",
        care: "Samo hemijsko čišćenje",
      },
      "eco-crepe": {
        name: "Eko krep",
        description: "Održivi krep sa suptilnom teksturom.",
        care: "Pranje u hladnoj vodi, blago čišćenje",
      },
    },
    colors: {
      midnight: { name: "Ponoćno plava" },
      rosewater: { name: "Ružina rosa" },
      ivory: { name: "Slonovača" },
    },
    lengths: {
      midi: {
        name: "Midi",
        description: "Do sredine lista za moderan i praktičan izgled.",
      },
      full: {
        name: "Puna dužina",
        description: "Do poda sa suptilnom opcijom šlepa.",
      },
    },
  },
  vara: {
    tagLine: "Skrojena mermaid silueta sa couture savovima.",
    description:
      "Haljina koja prati liniju tela i otvara se pri dnu, savršena za crvene tepihe i gala večeri.",
    productionTime: "10-12 radnih dana",
    highlights: [
      "Ojačan korset za dodatnu strukturu",
      "Nevidljiv rajsferšlus sa ručnom završnom obradom",
      "Opcioni skidljivi overskirt",
    ],
    fabrics: {
      "duchesse-satin": {
        name: "Duces saten",
        description: "Saten visokog sjaja sa dramatičnim volumenom.",
        care: "Samo hemijsko čišćenje",
      },
      "matte-mikado": {
        name: "Mat mikado",
        description: "Čvrst mikado koji oblikuje bez krutosti.",
        care: "Čišćenje na fleke, preporučeno hemijsko ciscenje",
      },
    },
    colors: {
      onyx: { name: "Oniks" },
      ruby: { name: "Rubin" },
      champagne: { name: "Šampanj" },
    },
    lengths: {
      full: {
        name: "Puna dužina",
        description: "Do poda uz opcioni slep duzine kapele.",
      },
    },
  },
  noor: {
    tagLine: "Minimalistička kolona sa arhitektonskim izrezom.",
    description:
      "Kolonska haljina koja naglašava čiste linije i precizno krojenje. Radi podjednako dobro za gradska venčanja i umetničke događaje.",
    productionTime: "8-10 radnih dana",
    highlights: [
      "Ugrađena postava sa blago oblikovanom mrežom",
      "Skriveni džepovi sa strane",
      "Izrez može biti asimetrican ili ravan",
    ],
    fabrics: {
      "stretch-crepe": {
        name: "Stretch krep",
        description: "Mekan krep sa taman dovoljno elastičnosti.",
        care: "Ručno pranje u hladnoj vodi i susenje na ravnoj podlozi",
      },
      "tencel-sateen": {
        name: "Tencel saten",
        description: "Održivii saten sa diskretnim sjajem.",
        care: "Mašinsko pranje na blagom programu, susenje na ofingeru",
      },
    },
    colors: {
      pearl: { name: "Biserna bela" },
      slate: { name: "Grafit siva" },
      sage: { name: "Kadulja" },
    },
    lengths: {
      knee: {
        name: "Iznad kolena",
        description: "Doseže neposredno iznad kolena.",
      },
      tea: {
        name: "Tea dužina",
        description: "Pada do sredine potkolenice sa čistim ivicama.",
      },
      full: {
        name: "Puna dužina",
        description: "Uska silueta do poda.",
      },
    },
  },
  solenne: {
    tagLine: "Romantična balska haljina sa ručno postavljenim aplikacijama.",
    description:
      "Haljina inspirisana couture radionicama sa voluminoznim slojevima i bogatim floralnim detaljima. Za trenutke kada želiš da ostavis utisak.",
    productionTime: "12-15 radnih dana",
    highlights: [
      "Korset sa unutrašnjim pertlanjem",
      "Obod sa konjskom dlakom za dramatičan volumen",
      "Opcione skidljive rukavice",
    ],
    fabrics: {
      "illusion-tulle": {
        name: "Iluzija til",
        description: "Lagan til sa suptilnim svetlucanjem.",
        care: "Parenje bez dodira i čuvanje u zaštitnoj vreći",
      },
      organza: {
        name: "Organza",
        description: "Čvrsta a providna, idealna za volumen.",
        care: "Samo hemijsko čišćenje",
      },
    },
    colors: {
      opal: { name: "Opal" },
      moonstone: { name: "Mesečev kamen" },
      noir: { name: "Noir" },
    },
    lengths: {
      grand: {
        name: "Grand",
        description: "Puna dužina sa opcijom katedralnog šlepa.",
      },
    },
  },
};

function applyOverrides(model: DressModel, override?: DressOverride): DressModel {
  if (!override) {
    return model;
  }

  const updated: DressModel = {
    ...model,
    ...(override.name ? { name: override.name } : {}),
    ...(override.tagLine ? { tagLine: override.tagLine } : {}),
    ...(override.description ? { description: override.description } : {}),
    ...(override.productionTime ? { productionTime: override.productionTime } : {}),
    ...(override.highlights ? { highlights: override.highlights } : {}),
  };

  if (override.fabrics) {
    updated.fabrics = model.fabrics.map((fabric) => ({
      ...fabric,
      ...(override.fabrics?.[fabric.id] ?? {}),
    }));
  }

  if (override.colors) {
    updated.colors = model.colors.map((color) => ({
      ...color,
      ...(override.colors?.[color.id] ?? {}),
    }));
  }

  if (override.lengths) {
    updated.lengths = model.lengths.map((length) => ({
      ...length,
      ...(override.lengths?.[length.id] ?? {}),
    }));
  }

  return updated;
}

export function useLocalizedDressModels(): DressModel[] {
  const { language } = useLanguage();

  return useMemo(() => {
    if (language === "sr") {
      return DRESS_MODELS.map((model) => applyOverrides(model, DRESS_OVERRIDES_SR[model.id]));
    }
    return DRESS_MODELS;
  }, [language]);
}

export function useLocalizedDressModel(modelId: string): DressModel {
  const models = useLocalizedDressModels();

  return useMemo(() => {
    return models.find((model) => model.id === modelId) ?? models[0];
  }, [models, modelId]);
}
