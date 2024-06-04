const WebSocket = require("ws");
const { Game } = require("./Game");

class GameManager {
  constructor() {
    this.games = [];
    this.pendingUser = [
      ["0", null],
      ["1", null],
      ["2", null],
      ["3", null],
      ["4", null],
      ["5", null],
    ]; //[['1',socket],['2',socket]]
    this.users = [];
    this.friend_match = [[0, null]];
  }

  addUser(socket) {
    this.users.push(socket);
    this.addHandler(socket);
  }

  removeUser(socket) {
    this.users = this.users.filter((user) => user !== socket);
    // Stop the game here because the user left
  }

  addHandler(socket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());

      if (message.type === "init_game") {
        var game
        this.pendingUser.forEach((arr) => {
          if (arr[0] == message.mode) {
            if (arr[1] == null) {
              arr[1] = socket;
            } else {
               game = new Game(
                arr[1],
                socket,
                message.room,
                message.mode,
                message.state
              );
            }
          }
        });
        if (game !== null) { // Only push if game is created
            this.games.push(game);
        }
        var filteredArr = this.games.filter(function(element) {
            return element !== undefined;
        });
        this.games=filteredArr;
        // console.log(this.games);
        // if (this.pendingUser) {
        //     console.log("pendingUser");
        //     const game = new Game(this.pendingUser, socket ,message.room,message.mode,message.state);
        //     this.games.push(game);

        // } else {
        //     console.log("otherUser");
        //     this.pendingUser = socket;
        // }
      }
      if (message.type === "Start Room") {
        console.log('runn');
        this.friend_match.push([message.room, socket, message.mode,message.state]);
        socket.send(JSON.stringify({
            arr:this.friend_match
        }));
      }
      if (message.type === "Join Room") {
        var game
        var flag = false;
        // console.log(this.friend_match);
        this.friend_match.forEach((arr) => {
          if (arr[0] === message.room) {
                game = new Game(
              arr[1],
              socket,
              arr[0],
              arr[2],
              arr[3]
            );
            flag = true;
          }
        });

        if (!flag) {
          socket.send(
            JSON.stringify({
              type: "Wrong Room",
            })
          );
        }else{
            this.games.push(game);
        }
      }

      if (message.type === "update") {
        console.log("inside move");
        const game = this.games.find(
          (game) => game.player1 === socket || game.player2 === socket
        );
        if (game) {
          console.log("inside makemove");
          game.makeMoves(socket, message.state);
        }
      }
      if (message.type === "gameOver") {
        const game = this.games.find(
            (game) => game.player1 === socket || game.player2 === socket
          );
          if (game) {
            console.log("inside makemove");
            game.gameOver(message.winner);
          }
      }
    });
  }
}

module.exports = { GameManager };
