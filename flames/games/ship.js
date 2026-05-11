(function () {
  function buildShipNames(a, b, cleanName, cap) {
    const one = cleanName(a);
    const two = cleanName(b);
    const aSplit = Math.max(1, Math.floor(one.length / 2));
    const bSplit = Math.max(1, Math.floor(two.length / 2));

    const c1 = cap(one.slice(0, aSplit) + two.slice(bSplit));
    const c2 = cap(two.slice(0, bSplit) + one.slice(aSplit));
    const c3 = cap(one.slice(0, 2) + two.slice(0, 2) + one.slice(-1));

    return [...new Set([c1, c2, c3].filter(function (n) { return n.length >= 3; }))].slice(0, 3);
  }

  window.NameArcade.registerGame({
    id: "ship",
    title: "Ship Name",
    about: "Blends two names into catchy combo names for fun and sharing.",
    howItWorks: "Name parts are merged using prefix and suffix patterns to generate up to 3 candidates.",
    examplePrompt: "Give me ship name tips",
    buttonText: "Get Ship Name Result",
    hint: "Blend names into fun ship-name options.",
    labels: ["Main Character", "Co-Star"],
    placeholders: ["Who is main character?", "Who is co-star?"],
    themeClass: "theme-ship",
    compute: function (nameA, nameB, utils) {
      const combos = buildShipNames(nameA, nameB, utils.cleanName, utils.cap);
      const primary = combos[0] || "Namix";
      const alt = combos.slice(1).join(" / ") || "No alternates this round";
      return {
        tag: "Ship Name Generator",
        title: "Ship: " + primary,
        line: "Alternates: " + alt,
        media: "assets/media/ship.svg",
        colorA: "#ff4fa3",
        colorB: "#ff7f50",
        namesChip: nameA + " + " + nameB,
        shareLine: "Top ship: " + primary,
      };
    },
  });
})();
