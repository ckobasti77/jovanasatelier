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
  allure: {
    tagLine: "Prozracna A-linija sa naglasenim strukom i leprsavom suknjom.",
    description:
      "Etericna silueta koja istice struk i ostavlja dovoljno prostora za kretanje. Savrsena za bastanske zabave i vecernje koktele.",
    productionTime: "7-9 radnih dana",
    highlights: [
      "Podesivi korset na ledima",
      "Dvostruki sloj suknje lagane tezine",
      "Opcioni visoki prorez",
    ],
    fabrics: {
      "silk-chiffon": {
        name: "Svileni sifon",
        description: "Providan i lagan sa mekanim padom.",
        care: "Samo hemijsko ciscenje",
      },
      "eco-crepe": {
        name: "Eko krep",
        description: "Odrzivi krep sa suptilnom teksturom.",
        care: "Pranje u hladnoj vodi, blago ciscenje",
      },
    },
    colors: {
      red: { name: "Crvena" },
      sauvage: { name: "Sauvage" },
      volour: { name: "Velur" },
    },
    lengths: {
      midi: {
        name: "Midi",
        description: "Do sredine lista za moderan i praktican izgled.",
      },
      full: {
        name: "Puna duzina",
        description: "Do poda sa suptilnom opcijom slepa.",
      },
    },
  },
  blush: {
    tagLine: "Skrojena mermaid silueta sa couture savovima.",
    description:
      "Haljina koja prati liniju tela i otvara se pri dnu, savrsena za crvene tepihe i gala veceri.",
    productionTime: "10-12 radnih dana",
    highlights: [
      "Ojacan korset za dodatnu strukturu",
      "Nevidljiv rajsferslus sa rucnom zavrsnom obradom",
      "Opcioni skidljivi overskirt",
    ],
    fabrics: {
      "duchesse-satin": {
        name: "Duces saten",
        description: "Saten visokog sjaja sa dramaticnim volumenom.",
        care: "Samo hemijsko ciscenje",
      },
      "matte-mikado": {
        name: "Mat mikado",
        description: "Cvrst mikado koji oblikuje bez krutosti.",
        care: "Ciscenje na fleke, preporuceno hemijsko ciscenje",
      },
    },
    colors: {
      bloom: { name: "Bloom" },
      red: { name: "Crvena" },
    },
    lengths: {
      full: {
        name: "Puna duzina",
        description: "Do poda uz opcioni slep duzine kapele.",
      },
    },
  },
  elegance: {
    tagLine: "Minimalisticka kolona sa arhitektonskim izrezom.",
    description:
      "Kolonska haljina koja naglasava ciste linije i precizno krojenje. Radi podjednako dobro za gradska vencanja i umetnicke dogadaje.",
    productionTime: "8-10 radnih dana",
    highlights: [
      "Ugradena postava sa blago oblikovanom mrezom",
      "Skriveni dzepovi sa strane",
      "Izrez moze biti asimetrican ili ravan",
    ],
    fabrics: {
      "stretch-crepe": {
        name: "Stretch krep",
        description: "Mekan krep sa taman dovoljno elasticnosti.",
        care: "Rucno pranje u hladnoj vodi i susenje na ravnoj podlozi",
      },
      "tencel-sateen": {
        name: "Tencel saten",
        description: "Odrzivi saten sa diskretnim sjajem.",
        care: "Masinsko pranje na blagom programu, susenje na ofingeru",
      },
    },
    colors: {
      cocoa: { name: "Kakao" },
      pearl: { name: "Biser" },
    },
    lengths: {
      knee: {
        name: "Iznad kolena",
        description: "Doseze neposredno iznad kolena.",
      },
      tea: {
        name: "Tea duzina",
        description: "Pada do sredine potkolenice sa cistim ivicama.",
      },
      full: {
        name: "Puna duzina",
        description: "Uska silueta do poda.",
      },
    },
  },
  valeria: {
    tagLine: "Romanticna balska haljina sa rucno postavljenim aplikacijama.",
    description:
      "Haljina inspirisana couture radionicama sa voluminoznim slojevima i bogatim detaljima. Za trenutke kada zelis da ostavis utisak.",
    productionTime: "12-15 radnih dana",
    highlights: [
      "Korset sa unutrasnjim pertlanjem",
      "Obod sa konjskom dlakom za dramatican volumen",
      "Opcione skidljive rukavice",
    ],
    fabrics: {
      "illusion-tulle": {
        name: "Iluzija til",
        description: "Lagan til sa suptilnim svetlucanjem.",
        care: "Parenje bez dodira i cuvanje u zastitnoj vreci",
      },
      organza: {
        name: "Organza",
        description: "Cvrsta a providna, idealna za volumen.",
        care: "Samo hemijsko ciscenje",
      },
    },
    colors: {
      "baby-pink": { name: "Baby roze" },
      black: { name: "Crna" },
      gold: { name: "Zlatna" },
      lavender: { name: "Lavanda" },
      milky: { name: "Mlecna" },
      olive: { name: "Maslinasta" },
    },
    lengths: {
      grand: {
        name: "Grand",
        description: "Puna duzina sa opcijom katedralnog slepa.",
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

