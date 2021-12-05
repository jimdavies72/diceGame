const dieImageArray = [
  "dice-roll.gif",
  "die-one.png",
  "die-two.png",
  "die-three.png",
  "die-four.png",
  "die-five.png",
  "die-six.png",
];

const soundEffectsArray = ["shakeDice.wav", "lostGame.wav", "wonGame.wav"];

const btns = document.querySelectorAll(".btn");
const splash = document.querySelector(".splash");
const onePlayer = document.querySelector(".one-player-board");
const twoPlayer = document.querySelector(".two-player-board");
const playerName = document.querySelector(".player-name");
const scoreDisplay = document.querySelector(".score");
const diceImg = document.querySelector(".dice-img");
const gameStatus = document.getElementById("status");
let currentScore = 0;
const maxScore = 21;
let currentGameType = "";
const defaultMediaPath = "./media/";

// random number generator
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// play audio function
const playAudio = (soundPath) => {
  const audio = new Audio(soundPath);
  audio.play();
};

const bounceDrum = () => {
  anime({
    targets: "div.box",
    translateY: [
      { value: 300, duration: 1000 },
      { value: 0, duration: 1000 },
    ],
    rotate: {
      value: "1turn",
      easing: "easeInOutSine",
    },
    delay: function (el, i, l) {
      return i * 1000;
    },
  });
};

bounceDrum();

// make board we want visible and hide the ones we dont 
const toggleVisible = (boardType) => {
  if (boardType === "splash") {
    splash.style.display = "";
  
    onePlayer.style.display = "none";
    twoPlayer.style.display = "none";
  } else if (boardType === "Player 1") {
    //remove splash screen if visible
    if (splash.style.display === "") {
      splash.style.display = "none";
    }
    twoPlayer.style.display = "none";
    onePlayer.style.display = "";
  } else if (boardType === "Player 2") {
    //remove splash screen if visible
    if (splash.style.display === "") {
      splash.style.display = "none";
    }
    onePlayer.style.display = "none";
    twoPlayer.style.display = "";
  }
};

// starts or resets the game variables to init
const startGame = (boardType) => {
  // what game board do we need? splash, 1 player or 2 player
  toggleVisible(boardType);
  currentScore = 0;
  if (boardType === "Player 1") {
    scoreDisplay.textContent = `Score: 0`;
    playerName.innerHTML = boardType;
    
    gameStatus.textContent = "Ready to roll!";
    initDiceImg();
    
  } else if (boardType === "Player 2") {
    // 2 player
    
    twoPlayerBoard();
    initDiceImg();
  }
};

// initiate the game
startGame("splash");

// which button has been clicked
btns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let btnClass = e.currentTarget;

    if (btnClass.classList.contains("player-btn")) {
      //player button clicked
      currentGameType = btnClass.innerHTML;
      startGame(currentGameType);
    }

    if (btnClass.classList.contains("reset-btn")) {
      console.log(btnClass.classList);
      // re-init the game     
      startGame(currentGameType);

      //FIXME: dice roll whilst button is 'New Game'. The domTokenList is 'reset-btn', however its item array is 'roll-btn'. I cant find any documentation on this... is this expected behaviour or the source of the bug?
      // button is now 'New Game' so reset to 'Roll'
      toggleRollNewGameBtn(btnClass, false);
        
    }
    
    // are we playing a player 1 game or a player 2 game
    if ((currentGameType = "Player 1")) {
      if (btnClass.classList.contains("roll-btn")) {
        //roll dice button clicked
        onePlayerRules(btnClass);
      } 

    } else {
      // Player 2 game - NOTE NO functionality. P2 game in separate project - diceGameTwoPlayer
     
    }
  });
});

const onePlayerRules = (btnClass) => {
  //roll dice button clicked

  let roll = rollDice();
  currentScore += roll;
  setTimeout(function () {
    let currentStatus = "";
    if (roll === 1) {
      // score of 1 = insta-lose

      currentStatus = "Lost! rolled a 1";
      playAudio(`${defaultMediaPath}${soundEffectsArray[1]}`);
      toggleRollNewGameBtn(btnClass);
    } else if (currentScore >= maxScore) {
      // win!

      scoreDisplay.textContent = `Score: ${currentScore}`;
      currentStatus = "wins!";
      playAudio(`${defaultMediaPath}${soundEffectsArray[2]}`);
      toggleRollNewGameBtn(btnClass);
    } else {
      // we continue...
      currentStatus = "Playing...";
      scoreDisplay.textContent = `Score: ${currentScore}`;
    }
    gameStatus.textContent = currentStatus;
  }, 3000);
};

const twoPlayerBoard = () => {
  let buttonsDisabled = ""
  twoPlayer.innerHTML = "";
  
  for (let i = 0; i < 2; i++) {
    //player 2 settings
    if (i > 0){
      buttonsDisabled = "disabled"
    } else {
      buttonsDisabled = "";
    }
    
    // just for illustrative purposes only!
    let html = `<div class="container player${i + 1}">  
      <div class="player">
        <h3 class="player-name">Player ${i + 1}</h3>
      </div>
      <div class="score">
        <h2>0</h2>
      </div>
      <div class="current-score">
        <h4>Current</h4>
        <h4 class="current-score">0</h4>
      </div>
      <button class="btn ${buttonsDisabled} roll-btn">Roll</button>
      <button class="btn ${buttonsDisabled} hold-btn">Hold</button>
    <div>
    <div class="dice dice-img"></div>`;

    twoPlayer.innerHTML += html;
  }
};

const rollDice = () => {
  let score = 0;
  
  score = getRandomInt(1, 6);
  
  // remove the img element if it exists and replace with dice roll gif
  resetDiceImg();
  displayDiceImg(`${defaultMediaPath}${dieImageArray[0]}`);

  const audio = new Audio(`${defaultMediaPath}${soundEffectsArray[0]}`);
  audio.play();
  audio.addEventListener("ended", () => {
    audio.currentTime = 0;
    resetDiceImg();
    displayDiceImg(`${defaultMediaPath}${dieImageArray[score]}`);
  });

  return score;
};

const toggleRollNewGameBtn = (btn, isResetBtn = true) => {
  // during the game the button will be 'roll'
  // at the end of the game either loss or win then the
  // button will become a reset button
  if (isResetBtn) {
    // becomes a reset button
    btn.innerHTML = "New Game";
    btn.classList.remove("roll-btn");
    btn.classList.add("reset-btn");
  } else {
    // becomes a roll button
    btn.innerHTML = "Roll";
    btn.classList.remove("reset-btn");
    btn.classList.add("roll-btn");
  }
};

const initDiceImg = () => {
  resetDiceImg();
  displayDiceImg(`${defaultMediaPath}${dieImageArray[0]}`);
}

const resetDiceImg = () => {
  //removes any existing images
  if (diceImg.hasChildNodes()) {
    diceImg.querySelectorAll("*").forEach((n) => n.remove());
  }
};

const displayDiceImg = (src) => {
  let img = document.createElement("img");
  img.src = src;
  diceImg.appendChild(img);
};
