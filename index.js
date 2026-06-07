const suits = ["spades", "clubs", "diamonds", "hearts"];
const values = [
  { name: "2", value: 2 },
  { name: "3", value: 3 },
  { name: "4", value: 4 },
  { name: "5", value: 5 },
  { name: "6", value: 6 },
  { name: "7", value: 7 },
  { name: "8", value: 8 },
  { name: "9", value: 9 },
  { name: "10", value: 10 },
  { name: "jack", value: 10 },
  { name: "queen", value: 10 },
  { name: "king", value: 10 },
  { name: "ace", value: 11 }
];

function buildDeck(){
  const deck = [];
  for(const suit of suits){
    for(const {name, value} of values){
      deck.push({filename: `PNG-cards/${name}_of_${suit}.png`, value: value});
    }
  }
  return deck;
}

const deck = buildDeck();

function dealCard(targetId){
  const img = document.createElement("img");
  img.classList.add("player-cards");
  const randomIndex = Math.floor(Math.random() * deck.length);
  img.src = deck[randomIndex].filename;
  document.getElementById(targetId).appendChild(img);
  return deck[randomIndex];
}

let users = {};         
let currentUser = null;

const pCard = [];
const cCard = [];

const message = document.createElement("p");
document.getElementById("players").appendChild(message);
let gameOver = false;

function getScore(hand){
  let total = 0;
  let aces = 0;
  for(const card of hand){
    total = total + card.value;
    if(card.value === 11){
      aces = aces + 1;
    }
  }
  while(total > 21 && aces > 0){
    total = total - 10;
    aces = aces - 1;
  }
  return total;
}

function updateScore(){
  document.getElementById("player-score").innerText = "Point = " + getScore(pCard);
}

function dealerTurn(){
  while(getScore(cCard) < 17){
    cCard.push(dealCard("computer-cards"));
  }
}

function endRound(text){
  message.innerText = text;
  gameOver = true;
}

function decideWinner(){
  const playerScore = getScore(pCard);
  const computerScore = getScore(cCard);

  if(computerScore > 21){
    playerWins();
  } else if(playerScore > computerScore){
    playerWins();
  } else if(computerScore > playerScore){
    playerLoses();
  } else {
    tie();
  }
}

function clearCards(targetId){
  const container = document.getElementById(targetId);
  container.querySelectorAll("img").forEach(img => img.remove());
}

function resetRound(){
  pCard.length = 0;
  cCard.length = 0;
  clearCards("player-cards");
  clearCards("computer-cards");
  message.innerText = "";
  gameOver = false;
}

const startbtn = document.getElementById("startbtn");
startbtn.addEventListener("click", () => {
  if(!placeBet()) return;

  resetRound();
  for(let i = 0; i < 2; i++){
    pCard.push(dealCard("player-cards"));
  }
  cCard.push(dealCard("computer-cards"));
  updateScore();
});

const hitbtn = document.getElementById("hitbtn");
hitbtn.addEventListener("click", () => {
  if(gameOver) return;
  pCard.push(dealCard("player-cards"));
  updateScore();
  if(getScore(pCard) > 21){
     playerLoses(); 
  }
});

const standbtn = document.getElementById("standbtn");
standbtn.addEventListener("click", () => {
  if(gameOver) return;
  dealerTurn();
  decideWinner();
});


let pott = 100;   
let bet = 0;      



function placeBet(){
  const input = document.getElementById("bet-input");
  bet = Number(input.value);   

  if(pott <= 0){
    message.innerText = "Kassan är tom. Fyll på för att spela.";
    return false;
  }
  if(bet <= 0){
    message.innerText = "Du måste satsa minst 1.";
    return false;
  }
  if(bet > pott){
    message.innerText = "Du kan inte satsa mer än du har i potten.";
    return false;
  }

  return true;
}

const fyllpåBtn = document.getElementById("fyllpå");
fyllpåBtn.addEventListener("click", () => {
  pott = pott + 100; 
  updatePott();
});


function playerWins(){
  pott = pott + bet;
  updatePott();
  endRound("Du vinner! +" + bet);
}

function playerLoses(){
  pott = pott - bet;
  updatePott();
  endRound("Du förlorar. -" + bet);
}

function tie(){
  endRound("Oavgjort. Insatsen tillbaka.");
}


function savePott(){
  if(currentUser !== null){
    users[currentUser].pott = pott;   
    saveUsers();
  }
}

function loadPott(){
  const saved = localStorage.getItem("pott");   
  if(saved !== null){
    pott = JSON.parse(saved);   
  }
}

function updatePott(){
  document.getElementById("pott").innerText = "Pott: " + pott;
  savePott();   
}

loadPott();   
updatePott(); 



function loadUsers(){
  const saved = localStorage.getItem("users");
  if(saved !== null){
    users = JSON.parse(saved); 
  }
}

function saveUsers(){
  localStorage.setItem("users", JSON.stringify(users));
}



function register(){
  const name = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const loginMessage = document.getElementById("login-message");

  if(name === "" || password === ""){
    loginMessage.innerText = "Fyll i både användarnamn och lösenord.";
    return;
  }
  if(users[name] !== undefined){   
    loginMessage.innerText = "Användarnamnet är upptaget.";
    return;
  }

  users[name] = { password: password, pott: 100 };   
  saveUsers();
  loginMessage.innerText = "Konto skapat! Logga in nu.";
}


function login(){
  const name = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const loginMessage = document.getElementById("login-message");

  const user = users[name];   

  if(user === undefined){
    loginMessage.innerText = "Användaren finns inte. Registrera dig först.";
    return;
  }
  if(user.password !== password){
    loginMessage.innerText = "Fel lösenord.";
    return;
  }

  currentUser = name;   
  pott = user.pott;    
  showGame();          
  updatePott();
}

function showGame(){
  document.getElementById("login").style.display = "none";
  document.getElementById("players").style.display = "block";
}


const loginbtn = document.getElementById("loginbtn");
loginbtn.addEventListener("click", login);

const registerbtn = document.getElementById("registerbtn");
registerbtn.addEventListener("click", register);

loadUsers();   
document.getElementById("players").style.display = "none";  






















// const suits = ["spades", "clubs", "diamonds", "hearts"];
// const values = [
//   { name: "2", value: 2 },
//   { name: "3", value: 3 },
//   { name: "4", value: 4 },
//   { name: "5", value: 5 },
//   { name: "6", value: 6 },
//   { name: "7", value: 7 },
//   { name: "8", value: 8 },
//   { name: "9", value: 9 },
//   { name: "10", value: 10 },
//   { name: "jack", value: 10 },
//   { name: "queen", value: 10 },
//   { name: "king", value: 10 },
//   { name: "ace", value: 11 }
// ];

// const image =document.getElementById("img");


// function buildDeck(){

//   const deck = [];

//   for(const suit of suits){
//     for(const {name, value} of values){
//       deck.push({
//         filename : `PNG-cards/${name}_of_${suit}.png `,
//         value : value
//         })
//     }
//   }

//   return deck
// }

// const deck = buildDeck()



// function dealCard(targetId){
  
//   const img = document.createElement("img");
//   img.classList.add("player-cards");
//   const randomIndex = Math.floor(Math.random() * (deck.length));
//   img.src =  deck[randomIndex].filename;


//   document.getElementById(targetId).appendChild(img);

//   return deck[randomIndex];

// }


// const pCard =[]
// const cCard =[]


// const resultP =[];
// const resultC =[];

// function calculateScore(){
  
//   resultP.push(pCard[0].value)
//   resultP.push(pCard[1].value)
    
//   let total = resultP.reduce((sum, val) =>sum + val ,0)
//   document.getElementById("player-score").innerText = "Point = " + total;

//   resultC.push(cCard[0].value)

//   checkGameState()
  
//   console.log(resultP)
//   console.log(resultC)

//   return resultP;
//   return resultC;
// }


// const startbtn = document.getElementById("startbtn");
// startbtn.addEventListener("click", () => {
//   resetRound();  

//   for(let i = 0; i < 2; i++){
//     pCard.push(dealCard("player-cards"));
//   }
//   cCard.push(dealCard("computer-cards"));

//   updateScore();
// });

 
// const hitbtn = document.getElementById("hitbtn");
// hitbtn.addEventListener("click", () => {
//   if(gameOver) return;   

//   pCard.push(dealCard("player-cards"));  
//   updateScore();

//   if(getScore(pCard) > 21){
//     endRound("Du sprack! Datorn vinner.");
//   }
// });

// const standbtn = document.getElementById("standbtn");
// standbtn.addEventListener("click", () => {
//   if(gameOver) return;

//   dealerTurn();     
//   decideWinner();   
// });

// function getScore(hand){
//   let total = 0;
//   let aces = 0;


//     for(const card of hand){
//     total = total + card.value;


//       if(card.value === 11){
//       aces = aces + 1;
//     }

//   }

//    while(total > 21 && aces > 0){
//     total = total - 10;
//     aces = aces - 1;
//   }

//   return total;
// }

// function updateScore(){
//   document.getElementById("player-score").innerText = "Point = " + getScore(pCard);
// }

// function dealerTurn(){
//   while(getScore(cCard) < 17){
//     cCard.push(dealCard("computer-cards"));
//   }
// }

// let gameOver = false;

// function endRound(text){
//   const message = document.createElement("p");
//   message.innerText = text;
//   document.getElementById("players").appendChild(message);

//   gameOver = true;
// }

// function decideWinner(){
//   const playerScore = getScore(pCard);
//   const computerScore = getScore(cCard);

//   if(computerScore > 21){
//     endRound("Datorn sprack! Du vinner.");
//   } else if(playerScore > computerScore){
//     endRound("Du vinner!");
//   } else if(computerScore > playerScore){
//     endRound("Datorn vinner.");
//   } else {
//     endRound("Oavgjort.");
//   }
// }

// function clearCards(targetId){
//   const container = document.getElementById(targetId);
//   container.querySelectorAll("img").forEach(img => img.remove());
// }

// function resetRound(){
//   pCard.length = 0;
//   cCard.length = 0;
//   clearCards("player-cards");
//   clearCards("computer-cards");
//   message.innerText = "";
//   gameOver = false;
// }

