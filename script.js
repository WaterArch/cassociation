const socket = io();

socket.on('catch up', (list) => {
    console.log("hi")
    players = list[0]
    playerNames = list[1]
    playerIndex = playerNames.findIndex(sublist => sublist[0] === socket.id);
    console.log(playerNames)
    updatePlayers()
})

const guess = document.getElementById('guess');
const timerLabel = document.getElementById('timer');
const player1 = document.getElementById('player1');
const word1 = document.getElementById('word1');
const player2 = document.getElementById('player2');
const word2 = document.getElementById('word2');
const player3 = document.getElementById('player3');
const word3 = document.getElementById('word3');
const joininput = document.getElementById('joininput');
const joinbutton = document.getElementById('joinbutton');
const game = document.getElementById('game');
const join = document.getElementById('join');
const overlay = document.getElementById('overlay');
const guessinput = document.getElementById('guessinput');
const guessbutton = document.getElementById('guessbutton');

const TOTALTIMER = 10;

let timer = TOTALTIMER;
let players = 0
let playerNames = []
let words = ["","",""]
let wordBinary = [false, false, false]
let joined = false
let playerIndex = -1;


joinbutton.addEventListener('click', () => {
    const name = joininput.value;
    game.removeAttribute('inert');
    join.setAttribute('style', 'display: none;');
    overlay.setAttribute('style', 'display: none;');
    console.log("hie")
    socket.emit('claim', [socket.id, name]);
    joined = true;
});

guessbutton.addEventListener('click', () => {
    const word = guessinput.value;
    words = ["","",""]
    wordBinary = [false, false, false]
    words[playerIndex] = word;
    wordBinary[playerIndex] = true;
    socket.emit('submit guess', [socket.id, word]);
    guessinput.value = '';
    guessbutton.setAttribute('disabled', 'true');
    updateWords();
});

socket.on('all guessed', (guessedWords) => {
    words = guessedWords;
    wordBinary = [true, true, true];
    guessbutton.removeAttribute('disabled');
    updateWords();
});

const updatePlayers = () => {
    console.log(players)
    if (players == 0) {player1.textContent = "Waiting..."; player2.textContent = "Waiting..."; player3.textContent = "Waiting..."}
    if (players == 1) {player1.textContent = playerNames[0][1]; player2.textContent = "Waiting..."; player3.textContent = "Waiting..."};
    if (players == 2) {player1.textContent = playerNames[0][1]; player2.textContent = playerNames[1][1]; player3.textContent = "Waiting..."};
    if (players == 3) {player1.textContent = playerNames[0][1]; player2.textContent = playerNames[1][1]; player3.textContent = playerNames[2][1]};
}
const updateWords = () => {
    console.log(wordBinary, words);

    word1.textContent = words[0]; 
    if(words[0] == words[playerIndex]){ word1.setAttribute('style', 'color: lightgreen;')}
    
    word2.textContent = words[1]; 
    if(words[1] == words[playerIndex]){ word2.setAttribute('style', 'color: lightgreen;')}

    word3.textContent = words[2]; 
    if(words[2] == words[playerIndex]){ word3.setAttribute('style', 'color: lightgreen;')}
};
//socket.emit('submit guess', guess.textContent);


