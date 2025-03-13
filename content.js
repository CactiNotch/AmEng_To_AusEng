const americanToBritish = {
  color: "colour",
  honor: "honour",
  organize: "organise",
  organization: "organisation",
  // Is not properly checking for this, I assume that if it notices a
  // similar word it immediately ignores proceeding letters
  organizations: "organisations",
  organizational: "organisational",
  sterilize: "sterlise",
  sterilization: "sterilisation",
  analyze: "analyse",
  center: "centre",
  defense: "defence",
  traveler: "traveller",
  traveled: "travelled",
  traveling: "travelling",
  labor: "labour",
  laborer: "labourer",
  plow: "plough",
  plowed: "ploughed",
  plowing: "ploughing",
  // This should have some condtions, program is also valid for computer programs
  program: "programme",
  programs: "programmes",
  gray: "grey",
  dialog: "dialogue",
  enroll: "enrol",
  enrollment: "enrolment",
  demeanor: "demeanour",
  fiber: "fibre",
  favorite: "favourite",
  flavor: "flavour",
  fulfill: "fulfil",
  humor: "humour",
  jewelry: "jewellery",
  maneuver: "manoeuvre",
  meter: "metre",
  modeling: "modelling",
  mold: "mould",
  neighbor: "neighbour",
  neighbors: "neighbours",
  neighborhood: "neighbourhood",
  offense: "offence",
  parlor: "parlour",
  practice: "practise",
  realty: "realtor",
  realize: "realise",
  recognize: "recognise",
  rumor: "rumour",
  saber: "sabre",
  theater: "theatre",
  tire: "tyre",
  tumor: "tumour",
  vapor: "vapour",
  yogurt: "yoghurt",

  // Handles context-sensitive words
  license: function (word, context) {
    return context === "verb" ? "license" : "licence";
  },

  practice: function (word, context) {
    return context === "verb" ? "practise" : "practice";
  },
};

// Function to determine context (very basic)
function getContext(word, surroundingText) {
  const verbs = ["to", "will", "should", "must", "can", "could"];
  const prevWord = surroundingText.split(/\s+/).slice(-1)[0];
  return verbs.includes(prevWord) ? "verb" : "noun";
}

// Is not properly checking for this, I assume that if it notices a
// similar word it immediately ignores proceeding letters

// TODO: Need to ensure that this script acknowledges capital letters
// and handle these words differently
function replaceText(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    let text = node.nodeValue;
    for (const [us, uk] of Object.entries(americanToBritish)) {
      if (typeof uk === "function") {
        text = text.replace(new RegExp(`\\b${us}\\b`, "gi"), (match) =>
          uk(match, getContext(match, text))
        );
      } else {
        text = text.replace(new RegExp(`\\b${us}\\b`, "gi"), uk);
      }
    }
    node.nodeValue = text;
  } else {
    node.childNodes.forEach(replaceText);
  }
}

// Run replacement on the whole page
document.body.childNodes.forEach(replaceText);
