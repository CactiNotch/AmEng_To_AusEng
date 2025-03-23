const americanToAustralian = {
  // ------------------------------
  // Miscellaneous words
  aluminum: "aluminium",
  chili: "chilli",
  defense: "defence",
  plow: "plough",
  gray: "grey",
  enroll: "enrol",
  jewelry: "jewellery",
  modeling: "modelling",
  offense: "offence",
  pediatric: "paediatric",
  tire: "tyre",
  yogurt: "yoghurt",
  fulfill: "fulfil",

  // ------------------------------
  // Words with the -or suffix in American English
  color: "colour",
  honor: "honour",
  harbor: "harbour",
  humor: "humour",
  labor: "labour",
  rumor: "rumour",
  splendor: "splendour",
  behavior: "behaviour",
  flavor: "flavour",
  vigor: "vigour",
  candor: "candour",
  clamor: "clamour",
  endeavor: "endeavour",
  fervor: "fervour",
  glamor: "glamour",
  rigor: "rigour",
  savior: "saviour",
  valor: "valour",
  ardor: "ardour",
  armor: "armour",
  tumor: "tumour",
  vapor: "vapour",
  demeanor: "demeanour",
  favorite: "favourite",
  mold: "mould",
  neighbor: "neighbour",
  neighborhood: "neighbourhood",
  parlor: "parlour",

  // ------------------------------
  // Words with the -re suffix in Australian English
  center: "centre",
  liter: "litre",
  fiber: "fibre",
  caliber: "calibre",
  specter: "spectre",
  meter: "metre",
  theater: "theatre",
  somber: "sombre",
  luster: "lustre",
  meager: "meagre",
  kilometer: "kilometre",
  saber: "sabre",
  maneuver: "manoeuvre",

  // ------------------------------
  // Words that include e, which is either dropped or kept in their suffix
  // These are also the words that retain the Greek spelling in American English

  organiz: "organis",
  steriliz: "sterlis",
  analyz: "analys",
  centraliz: "centralis",
  personaliz: "personalis",
  centraliz: "centralis",
  memoriz: "memoris",
  categoriz: "categoris",
  characteriz: "characteris",
  generaliz: "generalis",
  recogniz: "recognis",
  accessoriz: "accessoris",
  prioritiz: "prioritis",
  customiz: "customis",
  harmoniz: "harmonis",
  minimiz: "minimis",
  maximiz: "maximis",
  summariz: "summaris",
  utiliz: "utilis",
  visualiz: "visualis",
  civiliz: "civilis",
  coloniz: "colonis",
  fertiliz: "fertilis",
  patroniz: "patronis",
  plagiariz: "plagiaris",
  realiz: "realis",
  proselytiz: "proselytis",
  legitimiz: "legitimis",
  apologiz: "apologis",
  formaliz: "formalis",
  materializ: "materialis",
  socializ: "socialis",
  editorializ: "editorialis",
  fantasiz: "fantasis",
  hospitaliz: "hospitalis",
  capitaliz: "capitalis",
  enterpriz: "enterpris",
  improviz: "improvis",
  moderniz: "modernis",
  pasteuriz: "pasteuris",
  unioniz: "unionis",
  feminiz: "feminis",
  localiz: "localis",
  digitiz: "digitis",
  digitizaliz: "digitisalis",
  indivitualiz: "indivitualis",
  incentiviz: "incentivis",

  // ------------------------------
  // Words that have a base word spelt the same in both American and Australian English
  // but have a suffix that is different

  // travel
  traveler: "traveller",
  traveler: "travellers",
  traveled: "travelled",
  traveling: "travelling",

  // Handles context-sensitive words
  license: function (word, context) {
    return context === "verb" ? "license" : "licence";
  },
  practice: function (word, context) {
    return context === "verb" ? "practise" : "practice";
  },
};

// List of exceptions
const exceptions = ["fulfilling"];

// List of words that change from "-er" to "-re"
const erToReWords = [
  "center",
  "liter",
  "fiber",
  "caliber",
  "specter",
  "meter",
  "theater",
  "somber",
  "luster",
  "meager",
  "kilometer",
  "saber",
  "maneuver",
];

// Function to determine context (very basic)
function getContext(word, surroundingText) {
  const verbs = ["to", "will", "should", "must", "can", "could"];
  const prevWord = surroundingText.split(/ \ s + /).slice(-1)[0];
  return verbs.includes(prevWord) ? "verb" : "noun";
}

function replaceText(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    let text = node.nodeValue;

    for (const [usBase, auBase] of Object.entries(americanToAustralian)) {
      // Base Suffix
      const regex = new RegExp(
        "\\b(" +
          usBase +
          ")(ed|ing|s|es|al|ation|ations|ally|er|ers|ment|ments)?\\b",
        "gi"
      );

      // Check for exceptions
      if (exceptions.includes(text)) {
        continue;
      }

      if (erToReWords.includes(usBase)) {
        text = text.replace(regex, (match, base, suffix = "") => {
          const replacementBase =
            base[0] === base[0].toUpperCase()
              ? auBase[0].toUpperCase() + auBase.slice(1)
              : auBase;

          // Handle the special case where "er" changes to "re"
          if (suffix.startsWith("e")) {
            suffix = suffix.slice(1);
          }
          // Handle the special case where "ering" changes to "ring"
          if (suffix === "ing") {
            replacementBase = replacementBase.slice(0, -1);
          }

          return replacementBase + suffix;
        });
      } else if (typeof auBase === "function") {
        // Handle context-sensitive words
        text = text.replace(new RegExp("\\b" + usBase + "\\b", "gi"), (match) =>
          auBase(match, getContext(match, text))
        );
      } else {
        text = text.replace(regex, (match, base, suffix = "") => {
          const replacementBase =
            base[0] === base[0].toUpperCase()
              ? auBase[0].toUpperCase() + auBase.slice(1)
              : auBase;

          return replacementBase + suffix;
        });
      }
    }
    node.nodeValue = text;
  } else {
    node.childNodes.forEach(replaceText);
  }
}

// Run replacement on the whole page
document.body.childNodes.forEach(replaceText);
