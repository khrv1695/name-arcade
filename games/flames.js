(function () {
  const letters = ["F", "L", "A", "M", "E", "S"];
  const meta = {
    F: { title: "Friends", line: "You two are giving bestie energy.", colorA: "#72d6ff", colorB: "#5d7bff", media: "assets/media/flames.svg", emoji: "🤝" },
    L: { title: "Love", line: "Romance level looks very high.", colorA: "#ff7fa2", colorB: "#ff4f84", media: "assets/media/flames.svg", emoji: "💘" },
    A: { title: "Affection", line: "A sweet and warm bond is showing.", colorA: "#ffc361", colorB: "#ff9359", media: "assets/media/flames.svg", emoji: "🥰" },
    M: { title: "Marriage", line: "Wedding bells in FLAMES world.", colorA: "#7de2d1", colorB: "#48b5bf", media: "assets/media/flames.svg", emoji: "💍" },
    E: { title: "Enemies", line: "You may clash, keep it playful.", colorA: "#ffb86c", colorB: "#ff7a5c", media: "assets/media/flames.svg", emoji: "😼" },
    S: { title: "Siblings", line: "Sibling-code detected.", colorA: "#9fcbff", colorB: "#6d94ff", media: "assets/media/flames.svg", emoji: "🫶" },
  };

  function computeRemainingCount(a, b, cleanName) {
    const arrA = cleanName(a).split("");
    const arrB = cleanName(b).split("");

    for (let i = 0; i < arrA.length; i += 1) {
      const idx = arrB.indexOf(arrA[i]);
      if (idx !== -1) {
        arrA[i] = "";
        arrB[idx] = "";
      }
    }

    return arrA.join("").length + arrB.join("").length;
  }

  function flamesFromCount(count) {
    if (count <= 0) return "S";
    const pool = [...letters];
    let index = 0;

    while (pool.length > 1) {
      index = (index + count - 1) % pool.length;
      pool.splice(index, 1);
    }

    return pool[0];
  }

  window.NameArcade.registerGame({
    id: "flames",
    title: "FLAMES",
    about: "Classic name game that maps your pair to Friends, Love, Affection, Marriage, Enemies, or Siblings.",
    howItWorks: "Common letters are removed from both names. Remaining count cycles through FLAMES until one outcome stays.",
    examplePrompt: "Explain FLAMES outcome",
    buttonText: "Get FLAMES Result",
    hint: "For fun only. No drama guaranteed.",
    labels: ["Your Name", "Their Name"],
    placeholders: ["Drop your name", "Drop their name"],
    themeClass: "theme-flames",
    compute: function (nameA, nameB, utils) {
      const count = computeRemainingCount(nameA, nameB, utils.cleanName);
      const letter = flamesFromCount(count);
      const m = meta[letter];
      return {
        tag: letter + " in FLAMES",
        title: m.emoji + " " + m.title,
        line: m.line,
        media: m.media,
        colorA: m.colorA,
        colorB: m.colorB,
        namesChip: nameA + " + " + nameB,
        shareLine: "Letter: " + letter,
      };
    },
  });
})();
