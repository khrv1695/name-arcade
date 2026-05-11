(function () {
  function scoreName(name, cleanName) {
    const n = cleanName(name);
    const unique = new Set(n).size;
    const vowels = (n.match(/[aeiou]/g) || []).length;
    const consonants = Math.max(0, n.length - vowels);
    const rhythm = n.length > 0 ? 10 - Math.abs(vowels - consonants) : 0;
    return unique * 4 + vowels * 3 + consonants * 2 + rhythm;
  }

  window.NameArcade.registerGame({
    id: "battle",
    title: "Name Battle",
    about: "Head-to-head scoring game that picks a winner between two names.",
    howItWorks: "Each name is scored by uniqueness, vowel/consonant balance, and rhythm.",
    examplePrompt: "How is battle winner decided?",
    buttonText: "Get Battle Result",
    hint: "Head-to-head score by rhythm and uniqueness.",
    labels: ["Side A", "Side B"],
    placeholders: ["Who is on side A?", "Who is on side B?"],
    themeClass: "theme-battle",
    compute: function (nameA, nameB, utils) {
      const scoreA = scoreName(nameA, utils.cleanName);
      const scoreB = scoreName(nameB, utils.cleanName);
      const winner = scoreA === scoreB ? "Draw" : scoreA > scoreB ? nameA : nameB;
      return {
        tag: "Name Battle",
        title: "Winner: " + winner,
        line: nameA + " " + scoreA + " vs " + nameB + " " + scoreB,
        media: "assets/media/battle.svg",
        colorA: "#ef4444",
        colorB: "#f59e0b",
        namesChip: nameA + " + " + nameB,
        shareLine: "Battle: " + scoreA + "-" + scoreB,
      };
    },
  });
})();
