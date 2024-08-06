const express = require("express");
const WebSocket = require("ws");
const http = require("http");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
let players = {};
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
      const msg = JSON.parse(message);
      console.log(msg);
      // Forward move to the opponent
      player2.send(JSON.stringify(msg));
    });

    player2.on("message", (message) => {
      const msg = JSON.parse(message.toString());
      console.log(msg);
      // Forward move to the opponent
      player1.send(JSON.stringify(msg));
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

server.listen(8000, () => {
  console.log("Server is listening on port 8000");
});
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
