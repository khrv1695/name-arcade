(function () {
  const letters = ["F", "L", "A", "M", "E", "S"];

  function seededValue(seedText) {
    let hash = 2166136261;
    for (let i = 0; i < seedText.length; i += 1) {
      hash ^= seedText.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return Math.abs(hash >>> 0);
  }

  function dailyLetter() {
    const stamp = new Date().toISOString().slice(0, 10);
    const idx = seededValue(stamp) % letters.length;
    return letters[idx];
  }

  window.NameArcade.registerGame({
    id: "lucky",
    title: "Lucky Letter",
    about: "Daily challenge game where one date-seeded letter decides your luck score.",
    howItWorks: "The app picks one lucky letter from today and scores both names by matches and positions.",
    examplePrompt: "What is lucky letter today?",
    buttonText: "Get Lucky Letter Result",
    hint: "Daily letter challenge based on UTC date.",
    labels: ["Bestie 1", "Bestie 2"],
    placeholders: ["Drop first bestie", "Drop second bestie"],
    themeClass: "theme-lucky",
    compute: function (nameA, nameB, utils) {
      const lucky = dailyLetter().toLowerCase();
      const a = utils.cleanName(nameA);
      const b = utils.cleanName(nameB);
      const scoreA = a.split("").reduce(function (acc, ch, idx) { return acc + (ch === lucky ? 2 + (idx % 3) : 0); }, 0);
      const scoreB = b.split("").reduce(function (acc, ch, idx) { return acc + (ch === lucky ? 2 + (idx % 3) : 0); }, 0);
      const total = scoreA + scoreB;
      const tier = total >= 10 ? "Jackpot" : total >= 5 ? "Good Day" : "Quiet Luck";

      return {
        tag: "Daily Lucky Letter",
        title: "Letter: " + utils.cap(lucky) + " | " + tier,
        line: nameA + ": " + scoreA + " | " + nameB + ": " + scoreB,
        media: "assets/media/lucky.svg",
        colorA: "#00a896",
        colorB: "#02c39a",
        namesChip: nameA + " + " + nameB,
        shareLine: "Lucky letter: " + utils.cap(lucky) + " | Total: " + total,
      };
    },
  });
})();
