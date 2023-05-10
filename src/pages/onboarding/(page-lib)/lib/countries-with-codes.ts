export type CountryWithCode = {
  name_en: string;
  name_es: string;
  continent_en: string;
  continent_es: string;
  capital_en: string;
  capital_es: string;
  dial_code: string;
  code_2: string;
  code_3: string;
  tld: string;
  emoji: string;
  placeholder: string;
};

export const countriesWithCodes = [
  {
    name_en: "Colombia",
    name_es: "Colombia",
    continent_en: "South America",
    continent_es: "América del Sur",
    capital_en: "Bogota",
    capital_es: "Bogotá",
    dial_code: "+57",
    code_2: "CO",
    code_3: "COL",
    tld: ".co",
    emoji: "🇨🇴",
    placeholder: "300 123 4567",
  },
  {
    name_en: "Mexico",
    name_es: "México",
    continent_en: "North America",
    continent_es: "América del Norte",
    capital_en: "Mexico City",
    capital_es: "Ciudad de México",
    dial_code: "+52",
    code_2: "MX",
    code_3: "MEX",
    tld: ".mx",
    emoji: "🇲🇽",
    placeholder: "55 1234 5678",
  },
  {
    name_en: "United States",
    name_es: "Estados Unidos",
    continent_en: "North America",
    continent_es: "América del Norte",
    capital_en: "Washington, D.C.",
    capital_es: "Washington, D.C.",
    dial_code: "+1",
    code_2: "US",
    code_3: "USA",
    tld: ".us",
    emoji: "🇺🇸",
    placeholder: "(555) 123-4567",
  },
] as const satisfies readonly CountryWithCode[];
