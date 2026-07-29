/**
 * Configuration des identifiants d entreprise par pays
 * Utilise dans le formulaire d onboarding fournisseur
 */

export const COUNTRY_ID_CONFIG = {
  maroc: {
    type: "ICE",
    label: "ICE — Identifiant Commun de l Entreprise",
    maxLength: 15,
    exactLength: 15,
    numeric: true,
    verifiable: true,
    helpUrl: "https://ice.marocfacture.com/",
    helpText: "Verifier mon ICE sur ice.marocfacture.com",
    placeholder: "Ex: 001531606000066",
  },
  algerie: {
    type: "NIF",
    label: "NIF — Numero d Identification Fiscale",
    maxLength: 20,
    exactLength: null,
    numeric: false,
    verifiable: false,
    helpUrl: "https://www.mfdgi.gov.dz/",
    helpText: "Trouver mon NIF sur le site des impots",
    placeholder: "Ex: 000000000000000",
  },
  tunisie: {
    type: "MF",
    label: "Matricule Fiscal",
    maxLength: 13,
    exactLength: null,
    numeric: false,
    verifiable: false,
    helpUrl: "https://www.finances.gov.tn/",
    helpText: "Aide sur le Matricule Fiscal",
    placeholder: "Ex: 1234567A/P/M/000",
  },
  egypte: {
    type: "TRN",
    label: "Tax Registration Number (TRN)",
    maxLength: 9,
    exactLength: null,
    numeric: true,
    verifiable: false,
    helpUrl: "https://www.eta.gov.eg/",
    helpText: "Aide sur l ETA Egypte",
    placeholder: "Ex: 123456789",
  },
  france: {
    type: "SIRET",
    label: "SIRET — Numero d identification unique",
    maxLength: 14,
    exactLength: 14,
    numeric: true,
    verifiable: false,
    helpUrl: "https://www.infogreffe.fr/",
    helpText: "Rechercher mon SIRET sur Infogreffe",
    placeholder: "Ex: 12345678901234",
  },
  belgique: {
    type: "BCE",
    label: "Numero BCE — Banque-Carrefour des Entreprises",
    maxLength: 12,
    exactLength: null,
    numeric: false,
    verifiable: false,
    helpUrl: "https://kbopub.economie.fgov.be/",
    helpText: "Rechercher sur la BCE",
    placeholder: "Ex: 0123.456.789",
  },
  espagne: {
    type: "CIF",
    label: "CIF / NIF — Codigo de Identificacion Fiscal",
    maxLength: 9,
    exactLength: 9,
    numeric: false,
    verifiable: false,
    helpUrl: "https://www.agenciatributaria.gob.es/",
    helpText: "Aide AEAT Espagne",
    placeholder: "Ex: A12345678",
  },
  arabie_saoudite: {
    type: "CR",
    label: "Commercial Registration Number (CR)",
    maxLength: 10,
    exactLength: 10,
    numeric: true,
    verifiable: false,
    helpUrl: "https://mc.gov.sa/",
    helpText: "Ministry of Commerce KSA",
    placeholder: "Ex: 1234567890",
  },
  emirats: {
    type: "TRN",
    label: "Tax Registration Number (TRN)",
    maxLength: 15,
    exactLength: 15,
    numeric: true,
    verifiable: false,
    helpUrl: "https://tax.gov.ae/",
    helpText: "UAE Federal Tax Authority",
    placeholder: "Ex: 100123456700003",
  },
  default: {
    type: "FISCAL_ID",
    label: "Numero d identification fiscale",
    maxLength: 50,
    exactLength: null,
    numeric: false,
    verifiable: false,
    helpUrl: null,
    helpText: "Votre numero d identification fiscale legale",
    placeholder: "Votre identifiant fiscal local",
  },
};

export function getIdConfigByCountry(countryLabel) {
  if (!countryLabel) return COUNTRY_ID_CONFIG.default;
  const label = countryLabel.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (label.includes("maroc") || label.includes("morocco")) return COUNTRY_ID_CONFIG.maroc;
  if (label.includes("algerie") || label.includes("algeria")) return COUNTRY_ID_CONFIG.algerie;
  if (label.includes("tunisie") || label.includes("tunisia")) return COUNTRY_ID_CONFIG.tunisie;
  if (label.includes("egypte") || label.includes("egypt")) return COUNTRY_ID_CONFIG.egypte;
  if (label.includes("france")) return COUNTRY_ID_CONFIG.france;
  if (label.includes("belgique") || label.includes("belgium")) return COUNTRY_ID_CONFIG.belgique;
  if (label.includes("espagne") || label.includes("spain")) return COUNTRY_ID_CONFIG.espagne;
  if (label.includes("arabie") || label.includes("saudi")) return COUNTRY_ID_CONFIG.arabie_saoudite;
  if (label.includes("emirats") || label.includes("uae") || label.includes("emirates")) return COUNTRY_ID_CONFIG.emirats;
  return COUNTRY_ID_CONFIG.default;
}
