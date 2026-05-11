(function () {
  function scoreFromLetters(a, b, cleanName) {
    const chars = (cleanName(a) + cleanName(b)).split("");
    const unique = new Set(chars).size;
    const length = chars.length;
    const score = Math.min(100, Math.round(unique * 6 + length * 2));
    return { unique: unique, length: length, score: score };
  }

  window.NameArcade.registerGame({
    id: "anagram",
    title: "Anagram Sprint",
    about: "Scores how rich your combined letter pool is for word-play challenges.",
    howItWorks: "Unique letter count and pool length produce a sprint score and rank.",
    examplePrompt: "How to improve anagram rank?",
    buttonText: "Get Anagram Result",
    hint: "Quick challenge score from combined letters.",
    labels: ["Word Source 1", "Word Source 2"],
    placeholders: ["Drop first word-name", "Drop second word-name"],
    themeClass: "theme-anagram",
    compute: function (nameA, nameB, utils) {
      const data = scoreFromLetters(nameA, nameB, utils.cleanName);
      const rank = data.score > 80 ? "Legend" : data.score > 60 ? "Pro" : data.score > 40 ? "Rookie" : "Starter";
      return {
        tag: "Anagram Sprint",
        title: "Rank: " + rank,
        line: "Unique letters: " + data.unique + " | Pool size: " + data.length + " | Sprint score: " + data.score,
        media: "assets/media/anagram.svg",
        colorA: "#f97316",
        colorB: "#f43f5e",
        namesChip: nameA + " + " + nameB,
        shareLine: "Sprint score: " + data.score,
      };
    },
  });
})();
