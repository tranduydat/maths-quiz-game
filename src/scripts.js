class GameSession {
  constructor() {
    this.progressBarElement = document.querySelector("#progress-bar");
    this.scoreStatusElement = document.querySelector("#status-score");
    this.levelStatusElement = document.querySelector("#status-level");
    this.questionElement = document.querySelector("#question");
    this.hypothesisElement = document.querySelector("#hypothesis");
    this.btnAnswerTrue = document.querySelector("#btn-answer-true");
    this.btnAnswerFalse = document.querySelector("#btn-answer-false");
    this.gameOverScreenElement = document.querySelector("#gameover-screen");
    this.btnPlayGameElement = document.querySelector("#btn-play-game");

    this.operators = ["+", "-", "*"];
    this.countUnitMillisecond = 1000;

    this.sessionDurationSecond = 20;
    this.currentTimerSecond = 0;

    this.currentSession = undefined;
    this.currentScore = 0;
    this.currentLevel = 1;
    this.currentQuestion = undefined;
    this.currentHypothesis = undefined;
    this.currentAnswer = undefined;
    this.currentUserAnswer = undefined;
    this.isGameOver = false;
    this.prevScore = undefined;
    this.prevLevel = undefined;

    this.btnAnswerTrue.addEventListener("click", () =>
      this.btnUserAnswerOnClickListener(this.btnAnswerTrue)
    );
    this.btnAnswerFalse.addEventListener("click", () =>
      this.btnUserAnswerOnClickListener(this.btnAnswerFalse)
    );
    this.btnPlayGameElement.addEventListener(
      "click",
      this.btnPlayGameOnClickListener
    );
  }

  run() {
    this.#initSession();
  }

  #startTimer() {
    this.currentSession = setInterval(() => {
      if (this.currentTimerSecond >= this.sessionDurationSecond) {
        this.#updateGameOverScreenUI(true);
        this.currentTimerSecond = 0;
        clearInterval(this.currentSession);
      } else {
        this.#updateGameOverScreenUI(false);
        this.currentTimerSecond++;
        this.#updateProgressBarUIBySecond(
          this.currentTimerSecond,
          this.sessionDurationSecond
        );
      }
    }, this.countUnitMillisecond);
  }

  #initSession() {
    this.#initUI();
    this.#resetState();
    this.#newQuestion();
    this.#startTimer();
  }

  #resetState() {
    this.currentTimerSecond = 0;
    this.currentSession = undefined;
    this.currentScore = 0;
    this.currentLevel = 1;
    this.currentQuestion = undefined;
    this.currentHypothesis = undefined;
    this.currentAnswer = undefined;
    this.currentUserAnswer = undefined;
    this.isGameOver = false;
    this.prevScore = undefined;
    this.prevLevel = undefined;
  }

  #initUI() {
    this.#updateProgressBarUIBySecond(0, this.sessionDurationSecond);
    this.#updateGameOverScreenUI(false);
    this.#updateStatusUI(0, 1);
  }

  #updateProgressBarUIBySecond(second, totalSecond) {
    // Update progress bar
    const percentage = ((totalSecond - second) / totalSecond) * 100;
    this.progressBarElement.style.width = `${percentage}%`;
  }

  #updateStatusUI(score, level) {
    if (this.prevLevel != level) {
      this.prevLevel = this.levelStatusElement.innerText;
      this.levelStatusElement.innerText = level;
    }
    if (this.prevScore != score) {
      // Update new value and return previous value
      this.prevScore = this.scoreStatusElement.innerText;
      this.scoreStatusElement.innerText = score;
    }
  }

  #updateQuestionUI(question) {
    this.questionElement.innerText = question;
  }

  #updateHypothesisUI(hypothesis) {
    this.hypothesisElement.innerText = hypothesis;
  }

  #updateGameOverScreenUI(isShow) {
    const displayValue = isShow ? "flex" : "none";
    this.gameOverScreenElement.style.display = displayValue;
    return displayValue;
  }

  #newQuestion() {
    this.#generateQuestion();
    this.#updateQuestionUI(this.currentQuestion);
    this.#updateHypothesisUI(this.currentHypothesis);
  }

  #generateQuestion() {
    const a = this.#randomNumberByLength(3);
    const b = this.#randomNumberByLength(3);
    const operator = this.#randomOperator();
    this.currentQuestion = `${a} ${operator} ${b}`;
    const result = this.#calculateTwoOperands(operator, a, b);
    const isFakeAnswer = this.#generateHypothesis(result);
    this.currentAnswer = isFakeAnswer ? false : true;
  }

  #generateHypothesis(result) {
    // If isSkipHypothesis is true,
    // then generate fake answer by adding the answer with random number
    // otherwise return the answer
    let isFakeAnswer = Math.random() < 0.5;

    const hypothesis = () => {
      if (isFakeAnswer) {
        const randomNumber = this.#randomNumberBetween(-10, 10);
        if (randomNumber === 0) isFakeAnswer = false;
        return result + randomNumber;
      } else {
        return result;
      }
    };

    this.currentHypothesis = hypothesis();

    return isFakeAnswer;
  }

  btnUserAnswerOnClickListener = (element) => {
    const userAnswer = () => {
      if (element.value === "true") return true;
      else if (element.value === "false") return false;
      else throw Error("failed to get user answer");
    };

    if (this.currentAnswer === userAnswer()) {
      this.currentScore += 5;
      this.currentLevel += 1;
      this.#updateStatusUI(this.currentScore, this.currentLevel);
    }

    this.#newQuestion();
  };

  btnPlayGameOnClickListener = () => {
    this.#initSession();
  };

  #randomNumberByLength(length = 3) {
    // Math.random generate [0,1)
    // Math.floor to get rid of float number
    if (length === 0) {
      throw Error("length must be larger than 0");
    }

    const min = 10 ** (length - 1);
    const n = 9 * min;

    return Math.floor(min + Math.random() * n);
  }

  #randomOperator(operators = ["+", "-", "*"]) {
    // Random index by array length
    const randomIndex = Math.floor(Math.random() * operators.length);

    return operators[randomIndex];
  }

  #randomNumberBetween(minNum = -10, maxNum = 10) {
    // Generate a random number between A and B
    return Math.floor(Math.random() * (maxNum - minNum)) + minNum;
  }

  #calculateTwoOperands(operator, a, b) {
    // Calculate 2 operands then return the result
    const operationStr = a + operator + b;

    return eval(operationStr);
  }
}

function run() {
  const game = new GameSession();
  game.run();
}