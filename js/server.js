const express = require("express");
const WebSocket = require("ws");
const http = require("http");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let waitingPlayer = null; // To store the waiting player
wss.on("connection", (ws) => {
  if (waitingPlayer) {
    // If there's a waiting player, pair them
    const player1 = waitingPlayer;
    const player2 = ws;
    waitingPlayer = null;

    player1.send(JSON.stringify({ type: "start", symbol: "X" }));
    player2.send(JSON.stringify({ type: "start", symbol: "O" }));

    player1.on("message", (message) => {
      let msg = JSON.stringify(message);
      console.log(msg);
      player2.send(msg); // Forward move to the opponent
    });

    player2.on("message", (message) => {
      let msg = JSON.stringify(message);
      console.log(msg);
      player1.send(msg); // Forward move to the opponent
    });
  } else {
    // If no waiting player, set this player as waiting
    waitingPlayer = ws;
    ws.send(JSON.stringify({ type: "waiting" }));
  }

  // Handle disconnection
  ws.on("close", () => {
    if (waitingPlayer === ws) {
      waitingPlayer = null;
    }
  });
});

server.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
