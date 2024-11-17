# Tic-Tac-Toe Game with Unbeatable AI and Multiplayer Support


[![Play Now](https://img.shields.io/badge/Play-Now-green.svg)](https://sangatsharma.github.io/Tictactoe/)

Welcome to the Tic-Tac-Toe game where you can challenge an unbeatable AI powered by the Minimax algorithm with Alpha-Beta pruning or compete with other players online! Test your skills against the AI, match against other players in real-time, or enjoy a classic offline two-player game.

## Overview

This project implements a classic Tic-Tac-Toe game with three modes:
1. **Play Against AI**: Challenge an unbeatable AI designed to provide a tough game.
2. **Play Online Multiplayer**: Compete with other users in real-time using WebSocket connections.
3. **Offline Two-Player Mode**: Play with a friend on the same device without an internet connection.

## Features

- **Unbeatable AI**: The AI uses the Minimax algorithm with Alpha-Beta pruning for optimal play.
- **Multiplayer Mode**: Play against other users online when they are available.
- **Offline Two-Player Mode**: Enjoy a local game with another player on the same device.
- **Responsive Design**: The game is playable on various devices including desktops, tablets, and smartphones.
- **Interactive Interface**: Enjoy a user-friendly interface with smooth transitions and clear feedback.

## Getting Started

### Play Against AI

Visit the following link to start playing against the unbeatable AI: [Play Tic-Tac-Toe](https://sangatsharma.github.io/Tictactoe/)

### Play Online Multiplayer

To play against other users:
1. **Visit the game page**: [Play Tic-Tac-Toe Online](https://sangatsharma.github.io/Tictactoe/)
2. **Click on 'Play Online'**: This will connect you to the server and attempt to match you with another player.
3. **Wait for a match**: If no other players are available, you will wait in a queue until someone else joins.
4. **Start Playing**: Once matched, you can play against the other player in real-time.

### Play Offline Two-Player

To play with a friend on the same device:
1. **Visit the game page**: [Play Tic-Tac-Toe](https://sangatsharma.github.io/Tictactoe/)
2. **Select 'Play Offline'**: This mode will allow two players to take turns on the same device.

### How to Play

1. **Game Rules**: The game is played on a 3x3 grid. Players take turns placing their marks (X or O) on an empty square.
2. **Objective**: The first player to get three of their marks in a row (horizontally, vertically, or diagonally) wins the game.
3. **Draw**: If all nine squares are filled without a winner, the game is considered a draw.

### AI Mechanics

- **Minimax Algorithm**: This algorithm evaluates all possible moves to determine the best possible outcome for the AI.
- **Alpha-Beta Pruning**: Optimizes the Minimax algorithm by eliminating branches that don't need to be explored, making the AI faster and more efficient.

## Sound Effects

To make the game more engaging, sound effects have been added for the following actions:

- **Placing a Mark**: A sound plays whenever a player places their mark on the board.
- **Winning the Game**: An audio cue is played when a player wins.
- **Losing the Game**: A sound effect indicates when a player loses.
- **Draw**: A sound plays when the game ends in a draw.
- **Opponent found**: A sound plays when the matchmaking is found online.

The sound effects are automatically played during the game, adding a layer of excitement and feedback.

## Technical Details

- **Technologies Used**: HTML, CSS, JavaScript
- **AI Implementation**: The AI is implemented using the Minimax algorithm with Alpha-Beta pruning.
- **Multiplayer Implementation**: WebSocket (WSS) for real-time multiplayer functionality.
- **Project Structure**:
  - `/index.html`: The main HTML file for the game interface.
  - `css/Tic_tac_toe.css`: Styles for the game layout and design.
  - `js/Tic_tac_toe.js`: JavaScript logic for game mechanics, AI functionality, and multiplayer support.

### WebSocket Server

The multiplayer functionality is powered by a WebSocket server using Node.js with Express. 

## Development

If you want to run the project locally or contribute, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/sangatsharma/Tictactoe.git
   cd Tictactoe

2. **Open index.html in a browser to start the game locally.**


