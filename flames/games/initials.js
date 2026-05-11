(function () {
  const archetypes = [
    "Power Duo",
    "Calm Crew",
    "Chaos Twins",
    "Dream Team",
    "Creative Pair",
    "Silent Strength",
    "Spark Partners",
    "Steady Force",
    "Rapid Movers",
    "Soft Strategists",
    "Bright Minds",
    "Bold Hearts",
  ];

  function initials(name, cleanName) {
    const cleaned = cleanName(name);
    return cleaned ? cleaned[0] : "a";
  }

  window.NameArcade.registerGame({
    id: "initials",
    title: "Initials Chemistry",
    about: "Maps both initials to an archetype and chemistry tier.",
    howItWorks: "Initial letters are hashed to a playful archetype table like Dream Team or Bold Hearts.",
    examplePrompt: "What does initials chemistry mean?",
    buttonText: "Get Initials Result",
    hint: "Archetype from initials and order.",
    labels: ["You", "Your Person"],
    placeholders: ["Your name here", "Your person name here"],
    themeClass: "theme-initials",
    compute: function (nameA, nameB, utils) {
      const a = initials(nameA, utils.cleanName);
      const b = initials(nameB, utils.cleanName);
      const hash = (a.charCodeAt(0) + b.charCodeAt(0) + a.charCodeAt(0) * b.charCodeAt(0)) % archetypes.length;
      const archetype = archetypes[hash];
      const tier = hash % 3 === 0 ? "High" : hash % 3 === 1 ? "Medium" : "Playful";
      return {
        tag: "Initials Chemistry",
        title: "Type: " + archetype,
        line: "Initials " + utils.cap(a) + " + " + utils.cap(b) + " map to " + tier + " chemistry.",
        media: "assets/media/initials.svg",
        colorA: "#0ea5e9",
        colorB: "#6366f1",
        namesChip: nameA + " + " + nameB,
        shareLine: "Chemistry tier: " + tier,
      };
    },
  });
})();
