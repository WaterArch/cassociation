import express from 'express';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from "url";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"] 
    }
});

const PORT = 3000;
let players = 0;
let playerNames = [];
let words = ["","",""];
let wordBinary = [false, false, false];

io.on('connection', (socket) => {
    console.log("A client connected: ", socket.id);
    socket.emit('catch up', [players, playerNames]);
    
    socket.on('claim', (nameList) => {
        console.log("Claimed name: ", nameList[1])
        players++
        playerNames.push(nameList)
        console.log(playerNames)
        io.emit('catch up', [players, playerNames]);
    })

    socket.on('submit guess', (guessList) => {
        const playerIndex = playerNames.findIndex(sublist => sublist[0] === guessList[0]);
        if (playerIndex !== -1) {
            words[playerIndex] = guessList[1];
            wordBinary[playerIndex] = true;
        }
        console.log(words);
        console.log(wordBinary);
        if (wordBinary[0] && wordBinary[1] && wordBinary[2]) {
            io.emit('all guessed', words);
            wordBinary = [false, false, false];
            words = ["","",""];
        }
    });

    socket.on('disconnect', (reason) => {
        console.log('Client Disconnected: ', socket.id);
        players--
        const index = playerNames.findIndex(sublist => sublist[0] === socket.id);
        playerNames.splice(index, 1); 
        io.emit('catch up', [players, playerNames]);
    });
});

app.use(express.static(process.cwd()));

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), "index.html"));
})

httpServer.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})