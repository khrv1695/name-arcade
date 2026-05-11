(function () {
  const traits = {
    1: "Leader vibe",
    2: "Balanced and calm",
    3: "Creative spark",
    4: "Grounded and loyal",
    5: "Adventurous energy",
    6: "Caring and warm",
    7: "Deep thinker",
    8: "Power planner",
    9: "Big heart",
  };

  function sumLetters(name, cleanName) {
    return cleanName(name)
      .split("")
      .reduce(function (acc, ch) { return acc + (ch.charCodeAt(0) - 96); }, 0);
  }

  function digitalRoot(num) {
    let n = Math.max(1, num);
    while (n > 9) {
      n = String(n)
        .split("")
        .reduce(function (acc, d) { return acc + Number(d); }, 0);
    }
    return n;
  }

  window.NameArcade.registerGame({
    id: "numerology",
    title: "Numerology Lite",
    about: "Converts names into number roots and personality-style traits.",
    howItWorks: "Letter values are summed and reduced to roots from 1 to 9, then mapped to trait text.",
    examplePrompt: "Explain numerology roots",
    buttonText: "Get Numerology Result",
    hint: "Name numbers with quick traits.",
    labels: ["Your Vibe", "Their Vibe"],
    placeholders: ["Type your vibe name", "Type their vibe name"],
    themeClass: "theme-numerology",
    compute: function (nameA, nameB, utils) {
      const rootA = digitalRoot(sumLetters(nameA, utils.cleanName));
      const rootB = digitalRoot(sumLetters(nameB, utils.cleanName));
      const delta = Math.abs(rootA - rootB);
      const pairNote = delta <= 1 ? "very aligned" : delta <= 3 ? "complementary" : "opposites with spark";
      return {
        tag: "Numerology Lite",
        title: "Roots: " + rootA + " & " + rootB,
        line: traits[rootA] + " + " + traits[rootB] + " | Pair is " + pairNote + ".",
        media: "assets/media/numerology.svg",
        colorA: "#7a5cff",
        colorB: "#b06df8",
        namesChip: nameA + " + " + nameB,
        shareLine: "Pair tone: " + pairNote,
      };
    },
  });
})();
