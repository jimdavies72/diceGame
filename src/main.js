const btns = document.querySelectorAll(".btn");
const splash = document.querySelector(".splash")
const playerName = document.getElementById("player-name")
const scoreDisplay = document.getElementById("score")
const diceImg = document.getElementById("dice-img")
const gameStatus = document.getElementById("status")
let currentscore = 0
let gameType = ""


startGame(splash)

// random number generator
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const startGame = (gameType)=>{
  // starts or resets the game to 0
  if (gameType === "splash"){

  }else if (gameType === "Player 1"){
    currentscore = 0;
    playerName.innerHTML = gameType
    scoreDisplay.textContent = "0";
    gameStatus.textContent = "Ready to roll!"; 
    resetDiceImg();
    let dieImgSrc = "./media/dice-roll.gif"
    displayDiceImg(dieImgSrc);
  } else {
    // 2 player
  }
}

btns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let btnClass = e.currentTarget;
    
    if (btnClass.classList.contains("player-btn")){
      //player button has been pressed
      if (gameType === ""){
        gameType = btnClass.innerHTML
      }
      console.log(gameType)
      startGame(gameType)
    }else if (btnClass.classList.contains("roll-btn")) {
      //roll dice button pressed

      let roll = rollDice("land");
      currentscore += roll;

      let currentStatus = ""
      if (roll === 1){
        // score of 1 = insta-lose

        currentStatus = "Lost! they rolled a 1"
        toggleRollNewGameBtn(btnClass);

      } else if ( currentscore >= 21 ) {
        // win!
       
        scoreDisplay.textContent = currentscore;
        currentStatus = "wins!"
        toggleRollNewGameBtn(btnClass);

      }else {
        // we continue...
        currentStatus = "Playing..."
        scoreDisplay.textContent = currentscore
      }
      gameStatus.textContent = currentStatus
    } else if (btnClass.classList.contains("reset-btn")){
      //reset the game board

      // reset to roll button
      toggleRollNewGameBtn(btnClass, false)
      // reset game variables
      startGame(gameType)

    }
  });
})

const toggleRollNewGameBtn = (btn, isResetBtn = true) =>{
  // during the game the button will be 'roll'
  // at the end of the game either loss or win then the
  // button will become a reset button
  if (isResetBtn){
    // becomes a reset button
    btn.innerHTML = "New Game"
    btn.classList.remove("roll-btn")
    btn.classList.add("reset-btn")
  }else {
    // becomes a roll button
    btn.innerHTML = "Roll";
    btn.classList.remove("reset-btn");
    btn.classList.add("roll-btn");
  }

}

const rollDice = (rollStage) =>{
  let dieImg = ""
  let score = 0
  
  if(rollStage === "roll"){
    // rolling...
    dieImg = "./media/dice-roll.gif"
    score = 0
  } else if (rollStage === "land") {
    // die has landed what did we get?
    score = getRandomInt(1, 6);
    switch (score) {
      case 1:
        dieImg = "./media/die-one.png";
        break;
      case 2:
        dieImg = "./media/die-two.png";
        break;
      case 3:
        dieImg = "./media/die-three.png";
        break;
      case 4:
        dieImg = "./media/die-four.png";
        break;
      case 5:
        dieImg = "./media/die-five.png";
        break;
      case 6:
        dieImg = "./media/die-six.png";
        break;
    }
  }
  
  // remove the img element if it exists
  resetDiceImg()

  //display the new image
  displayDiceImg(dieImg)

  return score
}



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


// TODO: complete the display/hide logic. splash, 1 player, 2 player

const toggleVisible = (gameType) => {
  if (gameType === "splash") {
      splash.style.display.style.display = "block";;
      onePlayer.classList.add("visible");
      onePlayer.classList.remove("hidden");
    }
};