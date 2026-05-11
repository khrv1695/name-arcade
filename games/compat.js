(function () {
  function uniqueChars(text, cleanName) {
    return new Set(cleanName(text).split("")).size;
  }

  function sharedChars(a, b, cleanName) {
    const setA = new Set(cleanName(a));
    const setB = new Set(cleanName(b));
    let count = 0;
    setA.forEach(function (ch) {
      if (setB.has(ch)) count += 1;
    });
    return count;
  }

  function vowelHarmony(a, b, cleanName) {
    const vowels = /[aeiou]/g;
    const va = (cleanName(a).match(vowels) || []).length;
    const vb = (cleanName(b).match(vowels) || []).length;
    const total = Math.max(1, va + vb);
    return 1 - Math.abs(va - vb) / total;
  }

  window.NameArcade.registerGame({
    id: "compat",
    title: "Compatibility",
    about: "A quick chemistry score based on letter overlap, vowel harmony, and length balance.",
    howItWorks: "Each name pair gets a weighted percentage and a match band like High Match or Good Match.",
    examplePrompt: "How is compatibility scored?",
    buttonText: "Get Compatibility Result",
    hint: "Weighted name chemistry score.",
    labels: ["Your Name", "Their Name"],
    placeholders: ["Drop your name", "Drop their name"],
    themeClass: "theme-compat",
    compute: function (nameA, nameB, utils) {
      const a = utils.cleanName(nameA);
      const b = utils.cleanName(nameB);
      const sharedScore = Math.min(1, sharedChars(a, b, utils.cleanName) / 8);
      const harmonyScore = vowelHarmony(a, b, utils.cleanName);
      const lenScore = 1 - Math.min(1, Math.abs(a.length - b.length) / Math.max(1, a.length + b.length));
      const uniq = Math.min(1, (uniqueChars(a, utils.cleanName) + uniqueChars(b, utils.cleanName)) / 16);
      const percent = Math.round((sharedScore * 0.45 + harmonyScore * 0.25 + lenScore * 0.2 + uniq * 0.1) * 100);
      const band = percent > 75 ? "High Match" : percent > 45 ? "Good Match" : "Low Match";

      return {
        tag: "Compatibility Score",
        title: "Percent: " + percent,
        line: band + ": your name rhythm has " + percent + "% sync energy.",
        media: "assets/media/compat.svg",
        colorA: "#3a86ff",
        colorB: "#5f4cff",
        namesChip: nameA + " + " + nameB,
        shareLine: "Band: " + band,
      };
    },
  });
})();
