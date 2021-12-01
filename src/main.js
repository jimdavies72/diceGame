const btns = document.querySelectorAll(".btn");
const splash = document.querySelector(".splash")
const onePlayer = document.querySelector(".one-player-board");
const twoPlayer = document.querySelector(".two-player-board");
const playerName = document.querySelector(".player-name");
const scoreDisplay = document.querySelector(".score");
const diceImg = document.querySelector(".dice-img")
const gameStatus = document.getElementById("status")
let currentscore = 0
let gameType = ""
const defaultMediaPath = "./media/";
const defaultDiceImg = `${defaultMediaPath}dice-roll.gif`;

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
}

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

  if (boardType === "Player 1") {
  
    currentscore = 0;
    scoreDisplay.textContent = `Score: 0`;
    playerName.innerHTML = boardType;
    gameStatus.textContent = "Ready to roll!";
    resetDiceImg();
    let dieImgSrc = defaultDiceImg;
    displayDiceImg(dieImgSrc);
  } else if (boardType === "Player 2") {
    // 2 player
    twoPlayerBoard();
    resetDiceImg();
    let dieImgSrc = defaultDiceImg;
    displayDiceImg(dieImgSrc);
  }
};

// initiate the game
startGame("splash")


// which button has been clicked
btns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let btnClass = e.currentTarget;
    
    if (btnClass.classList.contains("player-btn")){
      //player button clicked
      gameType = btnClass.innerHTML;
      startGame(gameType)
    }
     
    // are we playing a player 1 game or a player 2 game
    if (gameType = "Player 1"){
      if (btnClass.classList.contains("roll-btn")) {
        //roll dice button clicked
        onePlayerRules(btnClass);
        
      } else if (btnClass.classList.contains("reset-btn")) {
        //reset the game board
        toggleRollNewGameBtn(btnClass, false);

        // reset game variables
        startGame(gameType);
      }
    }else{
      // Player 2 game

    }
    
  });
})


const onePlayerRules = (btnClass) =>{
  //roll dice button clicked

  let roll = rollDice();
  currentscore += roll;
  setTimeout(function () {
    let currentStatus = "";
    if (roll === 1) {
      // score of 1 = insta-lose

      currentStatus = "Lost! rolled a 1";
      playAudio(`${defaultMediaPath}lostGame.wav`);
      toggleRollNewGameBtn(btnClass);
    } else if (currentscore >= 21) {
      // win!

      scoreDisplay.textContent = `Score: ${currentscore}`;
      currentStatus = "wins!";
      playAudio(`${defaultMediaPath}wonGame.wav`);
      toggleRollNewGameBtn(btnClass);
    } else {
      // we continue...

      currentStatus = "Playing...";
      scoreDisplay.textContent = `Score: ${currentscore}`;
    }
    gameStatus.textContent = currentStatus;
  }, 3000);
}


const twoPlayerBoard = () => {
  twoPlayer.innerHTML = "";
  for (let i = 0; i < 2; i++){
    let html = `
    <div class="container player${i + 1}">  
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
      <div class="dice-img"></div>  
      <button class="btn roll-btn">Roll</button>
      <button class="btn hold-btn">Hold</button>
    <div>  
  `;

  twoPlayer.innerHTML += html
  }

};



const rollDice = () =>{
  let dieImg = ""
  let score = 0
  const soundPath = `${defaultMediaPath}shakeDice.wav`;

  score = getRandomInt(1, 6);
  switch (score) {
    case 1:
      dieImg = `${defaultMediaPath}die-one.png`;
      break;
    case 2:
      dieImg = `${defaultMediaPath}die-two.png`;
      break;
    case 3:
      dieImg = `${defaultMediaPath}die-three.png`;
      break;
    case 4:
      dieImg = `${defaultMediaPath}die-four.png`;
      break;
    case 5:
      dieImg = `${defaultMediaPath}die-five.png`;
      break;
    case 6:
      dieImg = `${defaultMediaPath}die-six.png`;
      break;
  }
  // remove the img element if it exists
  resetDiceImg()
  displayDiceImg(defaultDiceImg);

  //play shaking dice sound
  //playAudio(soundPath)
  
  const audio = new Audio(soundPath);
  audio.play();
  audio.addEventListener("ended", () => {
    audio.currentTime = 0;
    resetDiceImg();
    displayDiceImg(dieImg)
  });

  return score;
  
}

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

const resetDiceImg = ()=> {
  //removes any existing images
  if (diceImg.hasChildNodes()) {
    diceImg.querySelectorAll("*").forEach((n) => n.remove());
  }
}

const displayDiceImg = (src) =>{
  let img = document.createElement("img");
  img.src = src;
  diceImg.appendChild(img);
}

