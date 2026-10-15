from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

WORDS = ["PYTHON", "APPLE", "TIGER", "SCHOOL", "COMPUTER"]
MAX_WRONG_GUESSES = 6

word = ""
guessed_letters = set()
wrong_guesses = 0


def new_game():
    global word, guessed_letters, wrong_guesses
    word = random.choice(WORDS)
    guessed_letters = set()
    wrong_guesses = 0


def game_over():
    return set(word).issubset(guessed_letters) or wrong_guesses >= MAX_WRONG_GUESSES


def get_game_state():
    won = set(word).issubset(guessed_letters)
    lost = wrong_guesses >= MAX_WRONG_GUESSES
    return {
        "display_word": " ".join(ch if ch in guessed_letters else "_" for ch in word),
        "guessed_letters": sorted(guessed_letters),
        "wrong_guesses": wrong_guesses,
        "remaining": MAX_WRONG_GUESSES - wrong_guesses,
        "game_over": won or lost,
        "won": won,
        "answer": word if lost else None,
    }


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/new_game", methods=["POST"])
def restart():
    new_game()
    return jsonify(get_game_state())


@app.route("/guess", methods=["POST"])
def guess():
    global wrong_guesses
    data = request.get_json(silent=True) or {}
    letter = str(data.get("letter", "")).strip().upper()

    if len(letter) != 1 or not letter.isalpha() or not letter.isascii():
        return jsonify({"error": "Please enter one letter from A to Z."}), 400

    if not game_over() and letter not in guessed_letters:
        guessed_letters.add(letter)
        if letter not in word:
            wrong_guesses += 1

    return jsonify(get_game_state())


# Start with a fresh game when the server starts.
new_game()

if __name__ == "__main__":
    app.run(debug=True)
