(() => {
  "use strict";
  const WORDS = ["python", "computer", "program", "developer", "coding", "geography", "student", "teacher"];
  const MAX_ATTEMPTS = 6;
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const wordEl = document.getElementById("word");
  const remainingEl = document.getElementById("remaining");
  const countEl = document.getElementById("count");
  const messageEl = document.getElementById("message");
  const inputEl = document.getElementById("guess");
  const formEl = document.getElementById("guess-form");
  const keyboardEl = document.getElementById("keyboard");
  const newGameEl = document.getElementById("new-game");
  let answer = "";
  let guessed = new Set();
  let wrong = 0;
  let status = "playing";

  function newGame() {
    answer = WORDS[Math.floor(Math.random() * WORDS.length)];
    guessed = new Set();
    wrong = 0;
    status = "playing";
    messageEl.textContent = "Choose a letter below to make your guess.";
    messageEl.className = "message neutral";
    inputEl.value = "";
    inputEl.disabled = false;
    formEl.querySelector("button").disabled = false;
    render();
    inputEl.focus();
  }
  function guessLetter(value) {
    const letter = String(value || "").trim().toLowerCase();
    if (status !== "playing") return;
    if (!/^[a-z]$/.test(letter)) {
      setMessage("Please enter one alphabet letter.", "neutral");
      return;
    }
    if (guessed.has(letter)) {
      setMessage("You already guessed that letter.", "neutral");
      return;
    }
    guessed.add(letter);
    if (!answer.includes(letter)) {
      wrong++;
      setMessage("Not quite! Try another letter.", "error");
    } else {
      setMessage("Good guess!", "success");
    }
    if ([...answer].every(ch => guessed.has(ch))) {
      status = "won";
      setMessage(`🎉 You won! The word was “${answer}”.`, "success");
    } else if (wrong >= MAX_ATTEMPTS) {
      status = "lost";
      setMessage(`Game over! The word was “${answer}”.`, "error");
    }
    render();
  }
  function setMessage(text, kind) {
    messageEl.textContent = text;
    messageEl.className = `message ${kind}`;
  }
  function render() {
    wordEl.textContent = [...answer].map(ch => guessed.has(ch) ? ch : "_").join(" ");
    remainingEl.textContent = `${MAX_ATTEMPTS - wrong} / ${MAX_ATTEMPTS}`;
    countEl.textContent = guessed.size;
    keyboardEl.replaceChildren();
    for (const letter of alphabet) {
      const key = document.createElement("button");
      key.type = "button";
      key.className = "key";
      key.textContent = letter;
      key.setAttribute("aria-label", `Guess ${letter}`);
      if (guessed.has(letter)) {
        key.classList.add("used", answer.includes(letter) ? "correct" : "wrong");
        key.disabled = true;
      }
      key.disabled = key.disabled || status !== "playing";
      key.addEventListener("click", () => guessLetter(letter));
      keyboardEl.appendChild(key);
    }
    inputEl.disabled = status !== "playing";
    formEl.querySelector("button").disabled = status !== "playing";
  }
  formEl.addEventListener("submit", event => {
    event.preventDefault();
    guessLetter(inputEl.value);
    inputEl.value = "";
    if (status === "playing") inputEl.focus();
  });
  newGameEl.addEventListener("click", newGame);
  newGame();
})();